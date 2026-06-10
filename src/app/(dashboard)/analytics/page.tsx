"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  listSites,
  getMonthlyCostTrend,
  listBenchmarkEntries,
  type MonthCost,
  type BenchmarkEntry,
} from "@/lib/data/api";
import type { Site } from "@/lib/data/energy";

export default function AnalyticsPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [monthlyCostTrend, setMonthlyCostTrend] = useState<MonthCost[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [siteRows, trend, benchRows] = await Promise.all([
          listSites(),
          getMonthlyCostTrend(6),
          listBenchmarkEntries(),
        ]);
        if (!cancelled) {
          setSites(siteRows);
          setMonthlyCostTrend(trend);
          setBenchmarks(benchRows);
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load analytics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const maxCost = Math.max(1, ...monthlyCostTrend.map((m) => m.cost));
  const topConsumers = [...sites].sort(
    (a, b) => b.consumption24h - a.consumption24h
  );
  const maxConsumption = Math.max(
    1,
    topConsumers[0]?.consumption24h ?? 0
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Cross-site benchmarking and cost analysis
          </p>
        </div>
        <Skeleton className="h-64 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Cross-site benchmarking and cost analysis
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Cost trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cost Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-48">
            {monthlyCostTrend.map((m) => (
              <div
                key={m.month}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-xs font-medium text-muted-foreground">
                  ${(m.cost / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full bg-primary rounded-t"
                  style={{
                    height: `${(m.cost / maxCost) * 100}%`,
                    minHeight: "4px",
                  }}
                />
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top consumers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Consumers (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            {topConsumers.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No sites yet. Load demo data from the dashboard to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {topConsumers.map((site, i) => (
                  <div key={site.id} className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted-foreground w-6">
                      #{i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{site.name}</p>
                      <div className="h-2 bg-muted rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${
                              (site.consumption24h / maxConsumption) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-mono">
                      {site.consumption24h.toLocaleString()} kWh
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost per kWh comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            {benchmarks.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No benchmark data yet.
              </p>
            ) : (
              <div className="space-y-3">
                {[...benchmarks]
                  .sort((a, b) => a.costPerKwh - b.costPerKwh)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{b.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {b.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">$/kWh</p>
                          <p className="font-mono text-sm font-bold">
                            ${b.costPerKwh.toFixed(3)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            kWh/sqft
                          </p>
                          <p className="font-mono text-sm">{b.kwhPerSqft}</p>
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
      </div>
    </div>
  );
}
