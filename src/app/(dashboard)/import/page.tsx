"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { importRecords, sites } from "@/lib/data/energy";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
        <p className="text-muted-foreground">
          Upload CSV files or enter data manually
        </p>
      </div>

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
              <Select>
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
            </div>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your CSV file here, or click to browse
              </p>
              <Input type="file" accept=".csv,.xlsx" className="max-w-xs mx-auto" />
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: CSV, XLSX. Expected columns: timestamp, consumption_kwh,
              cost, source.
            </p>
            <Button>Upload and Process</Button>
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
                <Select>
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
                <Input id="manual-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-consumption">Consumption (kWh)</Label>
                <Input
                  id="manual-consumption"
                  type="number"
                  placeholder="e.g., 1200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-cost">Cost ($)</Label>
                <Input id="manual-cost" type="number" step="0.01" placeholder="e.g., 180.50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-source">Source</Label>
                <Select>
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
                />
              </div>
              <div className="md:col-span-2">
                <Button>Add Entry</Button>
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
              {importRecords.map((record) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
