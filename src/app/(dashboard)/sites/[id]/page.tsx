"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sites,
  recommendations,
  getForecast,
  type Site,
} from "@/lib/data/energy";

export default function SiteDetailPage() {
  const params = useParams();
  const siteId = params.id as string;
  const site = sites.find((s) => s.id === siteId);
  const siteRecs = recommendations.filter((r) => r.siteId === siteId);
  const forecast = getForecast(siteId);

  if (!site) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Site Not Found</h1>
        <p className="text-muted-foreground">
          No site with ID &quot;{siteId}&quot; exists.
        </p>
      </div>
    );
  }

  const maxHourly = Math.max(...site.hourlyConsumption);

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
            <CardTitle className="text-sm font-medium">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {site.dailyKwh.toLocaleString()} kWh
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost Today</CardTitle>
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
        </TabsList>

        {/* Monitor: hourly consumption bars + source breakdown */}
        <TabsContent value="monitor" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Consumption (24h)</CardTitle>
            </CardHeader>
            <CardContent>
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
                    className={`${
                      src.source === "grid"
                        ? "bg-slate-500"
                        : src.source === "solar"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${src.pct}%` }}
                  />
                ))}
              </div>
              <div className="flex gap-6 mt-3 text-sm">
                {site.sourceBreakdown.map((src) => (
                  <div key={src.source} className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        src.source === "grid"
                          ? "bg-slate-500"
                          : src.source === "solar"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
