"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { listSites, createSite } from "@/lib/data/api";
import type { Site, SiteType } from "@/lib/data/energy";
import { Plus } from "lucide-react";

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<SiteType | "">("");
  const [gridRegion, setGridRegion] = useState("");
  const [sqft, setSqft] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async () => {
    if (!name.trim() || !type) {
      setFormError("Site name and type are required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const created = await createSite({
        name: name.trim(),
        type,
        gridRegion: gridRegion.trim(),
        sqft: parseInt(sqft, 10) || 0,
        address: address.trim() || undefined,
      });
      setSites((prev) => [...prev, created]);
      setShowForm(false);
      setName("");
      setType("");
      setGridRegion("");
      setSqft("");
      setAddress("");
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to create site");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground">
            Manage and monitor your energy sites
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4 mr-1" />
          {showForm ? "Cancel" : "Add Site"}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Site</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="site-name">Name</Label>
                <Input
                  id="site-name"
                  placeholder="e.g., HQ Tower — Austin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-type">Type</Label>
                <Select
                  value={type}
                  onValueChange={(v: string | null) =>
                    setType((v as SiteType) ?? "")
                  }
                >
                  <SelectTrigger id="site-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="factory">Factory</SelectItem>
                    <SelectItem value="datacenter">Datacenter</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-region">Grid Region</Label>
                <Input
                  id="site-region"
                  placeholder="e.g., ERCOT"
                  value={gridRegion}
                  onChange={(e) => setGridRegion(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-sqft">Square Feet</Label>
                <Input
                  id="site-sqft"
                  type="number"
                  placeholder="e.g., 48000"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="site-address">Address (optional)</Label>
                <Input
                  id="site-address"
                  placeholder="e.g., 100 Congress Ave, Austin, TX"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              {formError && (
                <p className="text-sm text-destructive md:col-span-2">
                  {formError}
                </p>
              )}
              <div className="md:col-span-2">
                <Button onClick={() => void handleCreate()} disabled={saving}>
                  {saving ? "Saving..." : "Save Site"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Sites</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : sites.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No sites yet. Add a site above, or load demo data from the
              dashboard.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Grid Region</TableHead>
                  <TableHead className="text-right">Consumption (24h)</TableHead>
                  <TableHead className="text-right">Cost (24h)</TableHead>
                  <TableHead className="text-right">Carbon (24h)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell>
                      <Link
                        href={`/sites/${site.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {site.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {site.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {site.gridRegion}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {site.consumption24h.toLocaleString()} kWh
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${site.cost24h.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {site.carbon24h.toLocaleString()} kg
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
