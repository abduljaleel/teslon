"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  listSites,
  getMonthlyCostTrend,
  getUserGreeting,
  seedDemoData,
  type MonthCost,
} from "@/lib/data/api";
import type { Site } from "@/lib/data/energy";
import Link from "next/link";

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [monthlyCostTrend, setMonthlyCostTrend] = useState<MonthCost[]>([]);
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [siteRows, trend, name] = await Promise.all([
        listSites(),
        getMonthlyCostTrend(6),
        getUserGreeting(),
      ]);
      setSites(siteRows);
      setMonthlyCostTrend(trend);
      setGreeting(name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    try {
      await seedDemoData();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load demo data");
    } finally {
      setSeeding(false);
    }
  };

  const totals = {
    totalConsumption: sites.reduce((sum, s) => sum + s.consumption24h, 0),
    totalCost:
      Math.round(sites.reduce((sum, s) => sum + s.cost24h, 0) * 100) / 100,
    totalCarbon: sites.reduce((sum, s) => sum + s.carbon24h, 0),
    sitesMonitored: sites.length,
  };
  const maxCost = Math.max(1, ...monthlyCostTrend.map((m) => m.cost));

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Portfolio energy overview</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Sites</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-44" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Portfolio energy overview{greeting ? <> &mdash; {greeting}</> : null}
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Consumption"
          value={`${totals.totalConsumption.toLocaleString()} kWh`}
          description="Last 24 hours across all sites"
        />
        <MetricCard
          title="Total Cost"
          value={`$${totals.totalCost.toLocaleString()}`}
          description="Last 24 hours energy spend"
        />
        <MetricCard
          title="Carbon Footprint"
          value={`${totals.totalCarbon.toLocaleString()} kg`}
          description="CO2 equivalent, last 24h"
        />
        <MetricCard
          title="Sites Monitored"
          value={String(totals.sitesMonitored)}
          description="Active monitoring connections"
        />
      </div>

      {/* Per-site summary cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Sites</h2>
        {error ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              Sites couldn&apos;t be loaded. Use Retry above to try again.
            </CardContent>
          </Card>
        ) : sites.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <p className="text-muted-foreground">
                No sites yet. Add your first site or load demo data to explore
                the dashboard.
              </p>
              <Button onClick={() => void handleSeed()} disabled={seeding}>
                {seeding ? "Loading demo data..." : "Load demo data"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sites.map((site) => (
              <Link key={site.id} href={`/sites/${site.id}`}>
                <Card className="hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {site.name}
                    </CardTitle>
                    <SiteTypeBadge type={site.type} />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Consumption</p>
                        <p className="font-semibold">
                          {site.consumption24h.toLocaleString()} kWh
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Cost</p>
                        <p className="font-semibold">
                          ${site.cost24h.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Carbon</p>
                        <p className="font-semibold">
                          {site.carbon24h.toLocaleString()} kg
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Cost trend bar chart */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Monthly Cost Trend</h2>
        <Card>
          <CardContent className="pt-4">
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
                  <span className="text-xs text-muted-foreground">
                    {m.month}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function SiteTypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="secondary" className="text-xs capitalize">
      {type}
    </Badge>
  );
}
