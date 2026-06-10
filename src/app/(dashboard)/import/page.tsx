"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  listSites,
  parseConsumptionCsv,
  bulkInsertConsumption,
} from "@/lib/data/api";
import type { Site, ImportRecord, SourceType } from "@/lib/data/energy";

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default";
    case "processing":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
}

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload");

  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imports, setImports] = useState<ImportRecord[]>([]);

  // CSV upload state
  const [uploadSiteId, setUploadSiteId] = useState("");
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{
    ok: boolean;
    message: string;
    errors: string[];
  } | null>(null);

  // Manual entry state
  const [manualSiteId, setManualSiteId] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [manualKwh, setManualKwh] = useState("");
  const [manualCost, setManualCost] = useState("");
  const [manualSource, setManualSource] = useState<SourceType | "">("");
  const [manualCarbon, setManualCarbon] = useState("");
  const [manualSaving, setManualSaving] = useState(false);
  const [manualFeedback, setManualFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listSites();
        if (!cancelled) setSites(rows);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load sites");
      } finally {
        if (!cancelled) setLoadingSites(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const siteName = (id: string) =>
    sites.find((s) => s.id === id)?.name ?? "Unknown site";

  const recordImport = (
    filename: string,
    siteId: string,
    rows: number,
    status: ImportRecord["status"]
  ) => {
    setImports((prev) => [
      {
        id: `imp-${Date.now()}-${prev.length}`,
        filename,
        site: siteName(siteId),
        uploadedAt: new Date().toISOString(),
        rows,
        status,
      },
      ...prev,
    ]);
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const text = await file.text();
      setCsvText(text);
      setFileName(file.name);
      setUploadFeedback(null);
    } catch {
      setUploadFeedback({
        ok: false,
        message: "Could not read the selected file.",
        errors: [],
      });
    }
  };

  const handleProcess = async () => {
    setUploadFeedback(null);
    if (!uploadSiteId) {
      setUploadFeedback({
        ok: false,
        message: "Select a target site first.",
        errors: [],
      });
      return;
    }
    if (!csvText.trim()) {
      setUploadFeedback({
        ok: false,
        message: "Choose a CSV file or paste CSV rows below.",
        errors: [],
      });
      return;
    }
    const parsed = parseConsumptionCsv(csvText);
    if (parsed.rows.length === 0) {
      setUploadFeedback({
        ok: false,
        message: "No valid rows found in the CSV.",
        errors: parsed.errors.slice(0, 5),
      });
      recordImport(fileName || "pasted-rows.csv", uploadSiteId, 0, "failed");
      return;
    }
    setProcessing(true);
    try {
      const inserted = await bulkInsertConsumption(uploadSiteId, parsed.rows);
      const skipped = parsed.totalLines - parsed.rows.length;
      setUploadFeedback({
        ok: true,
        message: `Imported ${inserted.toLocaleString()} row${
          inserted === 1 ? "" : "s"
        } into ${siteName(uploadSiteId)}${
          skipped > 0 ? ` (${skipped} row${skipped === 1 ? "" : "s"} skipped)` : ""
        }.`,
        errors: parsed.errors.slice(0, 5),
      });
      recordImport(
        fileName || "pasted-rows.csv",
        uploadSiteId,
        inserted,
        "completed"
      );
      setCsvText("");
      setFileName("");
    } catch (e) {
      setUploadFeedback({
        ok: false,
        message: e instanceof Error ? e.message : "Import failed",
        errors: [],
      });
      recordImport(fileName || "pasted-rows.csv", uploadSiteId, 0, "failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleManualAdd = async () => {
    setManualFeedback(null);
    if (!manualSiteId || !manualDate || !manualKwh) {
      setManualFeedback({
        ok: false,
        message: "Site, date, and consumption are required.",
      });
      return;
    }
    const kwh = parseFloat(manualKwh);
    if (!isFinite(kwh) || kwh < 0) {
      setManualFeedback({ ok: false, message: "Invalid consumption value." });
      return;
    }
    setManualSaving(true);
    try {
      const cost = parseFloat(manualCost);
      const carbon = parseFloat(manualCarbon);
      await bulkInsertConsumption(manualSiteId, [
        {
          timestamp: new Date(`${manualDate}T12:00:00`).toISOString(),
          kwh,
          costCents: isFinite(cost) ? Math.round(cost * 100) : null,
          source: manualSource || "grid",
          carbonKg: isFinite(carbon) ? carbon : null,
          intervalMinutes: 1440,
        },
      ]);
      setManualFeedback({
        ok: true,
        message: `Added 1 entry for ${siteName(manualSiteId)}.`,
      });
      recordImport("manual-entry", manualSiteId, 1, "completed");
      setManualDate("");
      setManualKwh("");
      setManualCost("");
      setManualCarbon("");
    } catch (e) {
      setManualFeedback({
        ok: false,
        message: e instanceof Error ? e.message : "Failed to add entry",
      });
    } finally {
      setManualSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
        <p className="text-muted-foreground">
          Upload CSV files or enter data manually
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Upload / Manual toggle */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("upload")}
        >
          CSV Upload
        </Button>
        <Button
          variant={activeTab === "manual" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("manual")}
        >
          Manual Entry
        </Button>
      </div>

      {activeTab === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-site">Target Site</Label>
              {loadingSites ? (
                <Skeleton className="h-9 w-full max-w-xs" />
              ) : (
                <Select
                  value={uploadSiteId}
                  onValueChange={(v: string | null) => setUploadSiteId(v ?? "")}
                  items={sites.map((s) => ({ value: s.id, label: s.name }))}
                >
                  <SelectTrigger id="import-site">
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your CSV file here, or click to browse
              </p>
              <Input
                type="file"
                accept=".csv,.txt"
                className="max-w-xs mx-auto"
                onChange={(e) => void handleFile(e.target.files?.[0])}
              />
              {fileName && (
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  Loaded: {fileName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="import-paste">Or paste CSV rows</Label>
              <Textarea
                id="import-paste"
                rows={6}
                className="font-mono text-xs"
                placeholder={`timestamp,consumption_kwh,cost,source\n2026-06-09T10:00:00Z,42.5,6.38,grid\n2026-06-09T11:00:00Z,45.1,6.77,solar`}
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value);
                  setUploadFeedback(null);
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supported format: CSV. Expected columns: timestamp, consumption_kwh,
              cost, source. Optional: carbon_kg, interval_minutes.
            </p>
            {uploadFeedback && (
              <div
                className={`rounded-md border px-4 py-3 text-sm ${
                  uploadFeedback.ok
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "border-destructive/50 bg-destructive/10 text-destructive"
                }`}
              >
                <p>{uploadFeedback.message}</p>
                {uploadFeedback.errors.length > 0 && (
                  <ul className="mt-1 list-disc pl-4 text-xs">
                    {uploadFeedback.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <Button onClick={() => void handleProcess()} disabled={processing}>
              {processing ? "Processing..." : "Upload and Process"}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === "manual" && (
        <Card>
          <CardHeader>
            <CardTitle>Manual Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="manual-site">Site</Label>
                <Select
                  value={manualSiteId}
                  onValueChange={(v: string | null) => setManualSiteId(v ?? "")}
                  items={sites.map((s) => ({ value: s.id, label: s.name }))}
                >
                  <SelectTrigger id="manual-site">
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-date">Date</Label>
                <Input
                  id="manual-date"
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-consumption">Consumption (kWh)</Label>
                <Input
                  id="manual-consumption"
                  type="number"
                  placeholder="e.g., 1200"
                  value={manualKwh}
                  onChange={(e) => setManualKwh(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-cost">Cost ($)</Label>
                <Input
                  id="manual-cost"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 180.50"
                  value={manualCost}
                  onChange={(e) => setManualCost(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-source">Source</Label>
                <Select
                  value={manualSource}
                  onValueChange={(v: string | null) =>
                    setManualSource((v as SourceType) ?? "")
                  }
                >
                  <SelectTrigger id="manual-source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="solar">Solar</SelectItem>
                    <SelectItem value="battery">Battery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-carbon">Carbon (kg CO2)</Label>
                <Input
                  id="manual-carbon"
                  type="number"
                  placeholder="e.g., 600"
                  value={manualCarbon}
                  onChange={(e) => setManualCarbon(e.target.value)}
                />
              </div>
              {manualFeedback && (
                <div
                  className={`md:col-span-2 rounded-md border px-4 py-3 text-sm ${
                    manualFeedback.ok
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-destructive/50 bg-destructive/10 text-destructive"
                  }`}
                >
                  {manualFeedback.message}
                </div>
              )}
              <div className="md:col-span-2">
                <Button
                  onClick={() => void handleManualAdd()}
                  disabled={manualSaving}
                >
                  {manualSaving ? "Adding..." : "Add Entry"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent imports table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Imports</CardTitle>
        </CardHeader>
        <CardContent>
          {imports.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No imports yet this session. Process a CSV or add a manual entry
              above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Rows</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imports.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium font-mono text-sm">
                      {record.filename}
                    </TableCell>
                    <TableCell className="text-sm">{record.site}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(record.uploadedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {record.rows.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={getStatusVariant(record.status)}
                        className="capitalize text-xs"
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
