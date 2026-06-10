"use client";

import { useEffect, useState } from "react";
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
import {
  listAlerts,
  listSites,
  createSiteAlert,
  acknowledgeAlert,
} from "@/lib/data/api";
import type {
  Alert,
  Site,
  AlertSeverity,
  AlertType,
} from "@/lib/data/energy";

function getSeverityVariant(
  severity: AlertSeverity
): "default" | "secondary" | "destructive" | "outline" {
  switch (severity) {
    case "critical":
      return "destructive";
    case "warning":
      return "outline";
    case "info":
      return "secondary";
  }
}

export default function AlertsPage() {
  const [showForm, setShowForm] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ackingId, setAckingId] = useState<string | null>(null);

  const [alertName, setAlertName] = useState("");
  const [alertSiteId, setAlertSiteId] = useState("");
  const [alertType, setAlertType] = useState<AlertType | "">("");
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity | "">("");
  const [threshold, setThreshold] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [alertRows, siteRows] = await Promise.all([
          listAlerts(),
          listSites(),
        ]);
        if (!cancelled) {
          setAlerts(alertRows);
          setSites(siteRows);
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load alerts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    if (!alertName.trim() || !alertSiteId) {
      setFormError("Alert name and site are required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const created = await createSiteAlert({
        siteId: alertSiteId,
        type: alertType || "threshold",
        severity: alertSeverity || "info",
        message: threshold
          ? `${alertName.trim()} — threshold ${threshold} kWh`
          : alertName.trim(),
      });
      setAlerts((prev) => [created, ...prev]);
      setShowForm(false);
      setAlertName("");
      setAlertSiteId("");
      setAlertType("");
      setAlertSeverity("");
      setThreshold("");
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to create alert");
    } finally {
      setSaving(false);
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    setAckingId(alertId);
    try {
      await acknowledgeAlert(alertId);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to acknowledge alert");
    } finally {
      setAckingId(null);
    }
  };

  const sorted = [...alerts].sort(
    (a, b) =>
      new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">
            Energy anomalies, thresholds, and forecasts
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create Alert"}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Create Alert form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Alert Rule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="alert-name">Alert Name</Label>
                <Input
                  id="alert-name"
                  placeholder="e.g., Peak consumption warning"
                  value={alertName}
                  onChange={(e) => setAlertName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert-site">Site</Label>
                <Select
                  value={alertSiteId}
                  onValueChange={(v: string | null) => setAlertSiteId(v ?? "")}
                  items={sites.map((s) => ({ value: s.id, label: s.name }))}
                >
                  <SelectTrigger id="alert-site">
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
                <Label htmlFor="alert-type">Type</Label>
                <Select
                  value={alertType}
                  onValueChange={(v: string | null) =>
                    setAlertType((v as AlertType) ?? "")
                  }
                >
                  <SelectTrigger id="alert-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anomaly">Anomaly</SelectItem>
                    <SelectItem value="threshold">Threshold</SelectItem>
                    <SelectItem value="forecast">Forecast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert-severity">Severity</Label>
                <Select
                  value={alertSeverity}
                  onValueChange={(v: string | null) =>
                    setAlertSeverity((v as AlertSeverity) ?? "")
                  }
                >
                  <SelectTrigger id="alert-severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="alert-threshold">Threshold (kWh)</Label>
                <Input
                  id="alert-threshold"
                  type="number"
                  placeholder="e.g., 500"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                />
              </div>
              {formError && (
                <p className="text-sm text-destructive md:col-span-2">
                  {formError}
                </p>
              )}
              <div className="md:col-span-2">
                <Button onClick={() => void handleSave()} disabled={saving}>
                  {saving ? "Saving..." : "Save Alert Rule"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts ({alerts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No alerts yet. Create an alert rule or load demo data from the
              dashboard.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Triggered</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Badge
                        variant={getSeverityVariant(alert.severity)}
                        className="capitalize text-xs"
                      >
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {alert.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {alert.siteName}
                    </TableCell>
                    <TableCell className="text-sm max-w-xs truncate">
                      {alert.message}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(alert.triggeredAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {alert.acknowledged ? (
                        <Badge variant="secondary" className="text-xs">
                          Ack
                        </Badge>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={ackingId === alert.id}
                            onClick={() => void handleAcknowledge(alert.id)}
                          >
                            {ackingId === alert.id ? "..." : "Ack"}
                          </Button>
                        </div>
                      )}
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
