import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  sites,
  monthlyCostTrend,
  getBenchmarkData,
} from "@/lib/data/energy";

export default function AnalyticsPage() {
  const benchmarks = getBenchmarkData();
  const maxCost = Math.max(...monthlyCostTrend.map((m) => m.cost));
  const topConsumers = [...sites].sort(
    (a, b) => b.consumption24h - a.consumption24h
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Cross-site benchmarking and cost analysis
        </p>
      </div>

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
                            (site.consumption24h / topConsumers[0].consumption24h) *
                            100
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
          </CardContent>
        </Card>

        {/* Cost per kWh comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {benchmarks
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
                        <p className="text-xs text-muted-foreground">kWh/sqft</p>
                        <p className="font-mono text-sm">{b.kwhPerSqft}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Peer %ile</p>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
