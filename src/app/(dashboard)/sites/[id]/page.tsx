"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getSiteDetail,
  acknowledgeAlert,
  type SiteDetail,
} from "@/lib/data/api";
import type { ForecastDay, AlertSeverity, SourceType } from "@/lib/data/energy";

function sourceBgClass(source: SourceType): string {
  switch (source) {
    case "grid":
      return "bg-slate-500";
    case "solar":
      return "bg-amber-500";
    case "battery":
      return "bg-emerald-500";
    case "generator":
      return "bg-orange-500";
  }
}

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

export default function SiteDetailPage() {
  const params = useParams();
  const siteId = params.id as string;

  const [detail, setDetail] = useState<SiteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ackingId, setAckingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await getSiteDetail(siteId);
        if (!cancelled) setDetail(d);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load site");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [siteId]);

  const forecast: ForecastDay[] = useMemo(() => {
    if (!detail || detail.site.consumption24h <= 0) return [];
    const { site } = detail;
    const dailyBase = site.consumption24h;
    const costPer = site.cost24h / site.consumption24h;
    // Deterministic per-site variance so the forecast is stable across reloads
    // and unaffected by unrelated state changes (e.g. acknowledging an alert).
    const seed = [...site.id].reduce((a, c) => a + c.charCodeAt(0), 0);
    return Array.from({ length: 7 }, (_, i) => {
      const variance = 0.9 + (((seed + i * 37) % 100) / 100) * 0.2;
      const consumption = Math.round(dailyBase * variance);
      const d = new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000);
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        consumption,
        cost: Math.round(consumption * costPer * 100) / 100,
      };
    });
  }, [detail]);

  const handleAcknowledge = async (alertId: string) => {
    setAckingId(alertId);
    try {
      await acknowledgeAlert(alertId);
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              alerts: prev.alerts.map((a) =>
                a.id === alertId ? { ...a, acknowledged: true } : a
              ),
            }
          : prev
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to acknowledge alert");
    } finally {
      setAckingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-72 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Site</h1>
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Site Not Found</h1>
        <p className="text-muted-foreground">
          No site with ID &quot;{siteId}&quot; exists.
        </p>
      </div>
    );
  }

  const { site, recommendations: siteRecs, alerts, benchmarks } = detail;
  const maxHourly = Math.max(1, ...site.hourlyConsumption);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
          <p className="text-muted-foreground">
            {site.type} &middot; {site.gridRegion} &middot;{" "}
            {site.sqft.toLocaleString()} sqft
          </p>
        </div>
        <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
          {site.type}
        </Badge>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Load</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{site.currentKw} kW</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last 24h</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {site.dailyKwh.toLocaleString()} kWh
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${site.costToday.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Carbon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {site.carbon24h.toLocaleString()} kg
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monitor">
        <TabsList>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
          <TabsTrigger value="optimize">
            Optimize ({siteRecs.length})
          </TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="alerts">Alerts ({alerts.length})</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
        </TabsList>

        {/* Monitor: hourly consumption bars + source breakdown */}
        <TabsContent value="monitor" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Consumption (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              {site.consumption24h === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No consumption data in the last 24 hours. Import data from the
                  Import page.
                </p>
              ) : (
                <div className="flex items-end gap-1 h-48">
                  {site.hourlyConsumption.map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-0.5"
                    >
                      <div
                        className="w-full bg-primary rounded-t"
                        style={{
                          height: `${(val / maxHourly) * 100}%`,
                          minHeight: "2px",
                        }}
                      />
                      {i % 4 === 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {i.toString().padStart(2, "0")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Source Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1 h-8 rounded-full overflow-hidden">
                {site.sourceBreakdown.map((src) => (
                  <div
                    key={src.source}
                    className={sourceBgClass(src.source)}
                    style={{ width: `${src.pct}%` }}
                  />
                ))}
              </div>
              <div className="flex gap-6 mt-3 text-sm">
                {site.sourceBreakdown.map((src) => (
                  <div key={src.source} className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${sourceBgClass(
                        src.source
                      )}`}
                    />
                    <span className="capitalize">
                      {src.source}: {src.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimize: recommendation cards */}
        <TabsContent value="optimize" className="mt-4">
          {siteRecs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No optimization recommendations for this site
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {siteRecs.map((rec) => (
                <Card key={rec.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{rec.title}</CardTitle>
                      <Badge
                        variant={
                          rec.difficulty === "easy"
                            ? "default"
                            : rec.difficulty === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className="capitalize text-xs"
                      >
                        {rec.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {rec.description}
                    </p>
                    <div className="mt-4 flex gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Annual Savings
                        </p>
                        <p className="font-bold text-emerald-600">
                          ${rec.annualSavings.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">
                          ROI Timeline
                        </p>
                        <p className="font-medium">{rec.roiTimeline}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Forecast: 7-day table */}
        <TabsContent value="forecast" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              {forecast.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Not enough consumption data to build a forecast yet.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground pb-2 border-b">
                    <span>Date</span>
                    <span className="text-right">Consumption</span>
                    <span className="text-right">Cost</span>
                  </div>
                  {forecast.map((day) => (
                    <div
                      key={day.date}
                      className="grid grid-cols-3 text-sm py-2 border-b border-dashed last:border-0"
                    >
                      <span className="font-medium">{day.date}</span>
                      <span className="text-right font-mono">
                        {day.consumption.toLocaleString()} kWh
                      </span>
                      <span className="text-right font-mono">
                        ${day.cost.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts: site alerts with acknowledge action */}
        <TabsContent value="alerts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No alerts for this site
                </p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between gap-4 rounded-md border p-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getSeverityVariant(alert.severity)}
                            className="capitalize text-xs"
                          >
                            {alert.severity}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="capitalize text-xs"
                          >
                            {alert.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.triggeredAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-sm">{alert.message}</p>
                      </div>
                      {alert.acknowledged ? (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          Ack
                        </Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          disabled={ackingId === alert.id}
                          onClick={() => void handleAcknowledge(alert.id)}
                        >
                          {ackingId === alert.id ? "..." : "Acknowledge"}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benchmarks: peer comparison rows */}
        <TabsContent value="benchmarks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              {benchmarks.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No benchmark data for this site yet
                </p>
              ) : (
                <div className="space-y-3">
                  {benchmarks.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{b.period}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {b.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            kWh/sqft
                          </p>
                          <p className="font-mono text-sm">{b.kwhPerSqft}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">$/kWh</p>
                          <p className="font-mono text-sm font-bold">
                            ${b.costPerKwh.toFixed(3)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Carbon kg/kWh
                          </p>
                          <p className="font-mono text-sm">
                            {b.carbonIntensity.toFixed(3)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Peer %ile
                          </p>
                          <Badge
                            variant={
                              b.peerPercentile >= 70
                                ? "default"
                                : b.peerPercentile >= 40
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {b.peerPercentile}th
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
