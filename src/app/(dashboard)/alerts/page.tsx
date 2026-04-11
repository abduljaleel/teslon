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
import {
  alerts,
  sites,
  type Alert,
  type AlertSeverity,
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
                <Input id="alert-name" placeholder="e.g., Peak consumption warning" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert-site">Site</Label>
                <Select>
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
                <Select>
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
                <Select>
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
                />
              </div>
              <div className="md:col-span-2">
                <Button>Save Alert Rule</Button>
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
                    <Badge
                      variant={alert.acknowledged ? "secondary" : "default"}
                      className="text-xs"
                    >
                      {alert.acknowledged ? "Ack" : "New"}
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
