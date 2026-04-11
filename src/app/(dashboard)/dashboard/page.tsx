import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sites, getPortfolioTotals, monthlyCostTrend } from "@/lib/data/energy";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const totals = getPortfolioTotals();
  const maxCost = Math.max(...monthlyCostTrend.map((m) => m.cost));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Portfolio energy overview &mdash;{" "}
          {user?.user_metadata?.full_name || user?.email}
        </p>
      </div>

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
