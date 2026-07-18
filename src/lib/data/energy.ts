// ── Types ──────────────────────────────────────────────────────────────────

export type SiteType = "office" | "factory" | "datacenter" | "retail";
export type SourceType = "grid" | "solar" | "battery" | "generator";
export type AlertSeverity = "info" | "warning" | "critical";
export type AlertType = "anomaly" | "threshold" | "forecast";
export type Difficulty = "easy" | "medium" | "hard";

export interface Site {
  id: string;
  name: string;
  type: SiteType;
  gridRegion: string;
  sqft: number;
  consumption24h: number; // kWh
  cost24h: number;
  carbon24h: number; // kg CO2
  currentKw: number;
  dailyKwh: number;
  costToday: number;
  sourceBreakdown: { source: SourceType; pct: number }[];
  hourlyConsumption: number[]; // 24 entries
}

export interface Recommendation {
  id: string;
  siteId: string;
  title: string;
  description: string;
  annualSavings: number;
  difficulty: Difficulty;
  roiTimeline: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  siteId: string;
  siteName: string;
  severity: AlertSeverity;
  message: string;
  triggeredAt: string;
  acknowledged: boolean;
}

export interface ForecastDay {
  date: string;
  consumption: number;
  cost: number;
}

export interface ImportRecord {
  id: string;
  filename: string;
  site: string;
  uploadedAt: string;
  rows: number;
  status: "completed" | "failed" | "processing";
}

// ── Sites ──────────────────────────────────────────────────────────────────

export const sites: Site[] = [
  {
    id: "site-1",
    name: "HQ Tower — Austin",
    type: "office",
    gridRegion: "ERCOT",
    sqft: 48000,
    consumption24h: 1842,
    cost24h: 276.30,
    carbon24h: 921,
    currentKw: 78.4,
    dailyKwh: 1842,
    costToday: 276.30,
    sourceBreakdown: [
      { source: "grid", pct: 62 },
      { source: "solar", pct: 30 },
      { source: "battery", pct: 8 },
    ],
    hourlyConsumption: [
      42, 38, 35, 33, 32, 34, 45, 68, 92, 105, 112, 108,
      104, 98, 95, 88, 82, 74, 65, 58, 52, 48, 46, 43,
    ],
  },
  {
    id: "site-2",
    name: "Manufacturing Plant — Detroit",
    type: "factory",
    gridRegion: "MISO",
    sqft: 125000,
    consumption24h: 8640,
    cost24h: 1036.80,
    carbon24h: 5184,
    currentKw: 362.0,
    dailyKwh: 8640,
    costToday: 1036.80,
    sourceBreakdown: [
      { source: "grid", pct: 85 },
      { source: "solar", pct: 10 },
      { source: "battery", pct: 5 },
    ],
    hourlyConsumption: [
      280, 275, 270, 268, 265, 272, 310, 365, 390, 402, 410, 405,
      398, 392, 388, 380, 370, 355, 340, 320, 305, 295, 288, 282,
    ],
  },
  {
    id: "site-3",
    name: "Cloud DC — Oregon",
    type: "datacenter",
    gridRegion: "BPA",
    sqft: 35000,
    consumption24h: 14400,
    cost24h: 1152.00,
    carbon24h: 4320,
    currentKw: 598.0,
    dailyKwh: 14400,
    costToday: 1152.00,
    sourceBreakdown: [
      { source: "grid", pct: 55 },
      { source: "solar", pct: 20 },
      { source: "battery", pct: 25 },
    ],
    hourlyConsumption: [
      595, 592, 590, 588, 590, 594, 598, 602, 608, 612, 610, 605,
      600, 598, 602, 606, 610, 608, 604, 600, 598, 596, 594, 592,
    ],
  },
  {
    id: "site-4",
    name: "Retail Flagship — Miami",
    type: "retail",
    gridRegion: "FPL",
    sqft: 12000,
    consumption24h: 624,
    cost24h: 87.36,
    carbon24h: 374,
    currentKw: 26.2,
    dailyKwh: 624,
    costToday: 87.36,
    sourceBreakdown: [
      { source: "grid", pct: 78 },
      { source: "solar", pct: 18 },
      { source: "battery", pct: 4 },
    ],
    hourlyConsumption: [
      12, 10, 9, 8, 8, 9, 14, 22, 30, 35, 38, 40,
      42, 40, 38, 36, 34, 30, 26, 22, 18, 16, 14, 13,
    ],
  },
];

// ── Recommendations ────────────────────────────────────────────────────────

export const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    siteId: "site-1",
    title: "Shift HVAC pre-cooling to off-peak hours",
    description: "Run HVAC pre-cooling between 4-6 AM when grid rates are 40% lower. Current morning ramp-up overlaps peak pricing windows.",
    annualSavings: 18400,
    difficulty: "easy",
    roiTimeline: "2 months",
  },
  {
    id: "rec-2",
    siteId: "site-1",
    title: "Install smart lighting occupancy sensors",
    description: "Floors 3-7 show consistent over-lighting during low-occupancy periods. Occupancy sensors could reduce lighting load by 35%.",
    annualSavings: 8200,
    difficulty: "medium",
    roiTimeline: "8 months",
  },
  {
    id: "rec-3",
    siteId: "site-2",
    title: "Optimize compressor staging sequence",
    description: "Production line compressors run at fixed output regardless of demand. Variable staging could cut compressed air energy by 25%.",
    annualSavings: 42000,
    difficulty: "hard",
    roiTimeline: "14 months",
  },
  {
    id: "rec-4",
    siteId: "site-2",
    title: "Install waste heat recovery on furnace exhaust",
    description: "Furnace exhaust temperatures average 380F. Waste heat recovery can pre-heat intake air and reduce natural gas consumption.",
    annualSavings: 56000,
    difficulty: "hard",
    roiTimeline: "18 months",
  },
  {
    id: "rec-5",
    siteId: "site-3",
    title: "Raise cold aisle setpoint by 2 degrees",
    description: "Current cold aisle temp is 68F. ASHRAE recommends up to 80.6F. A 2-degree increase saves significant cooling energy with no reliability impact.",
    annualSavings: 31000,
    difficulty: "easy",
    roiTimeline: "Immediate",
  },
  {
    id: "rec-6",
    siteId: "site-3",
    title: "Deploy battery arbitrage during peak TOU windows",
    description: "Charge batteries during BPA off-peak (11PM-5AM) and discharge during peak (2-7PM). Current battery utilization is only 40%.",
    annualSavings: 24500,
    difficulty: "medium",
    roiTimeline: "3 months",
  },
  {
    id: "rec-7",
    siteId: "site-4",
    title: "Replace legacy display case refrigeration",
    description: "Display case compressors are 12 years old and running at 65% efficiency. Modern units would cut refrigeration energy by 40%.",
    annualSavings: 6800,
    difficulty: "medium",
    roiTimeline: "24 months",
  },
  {
    id: "rec-8",
    siteId: "site-4",
    title: "Add exterior window film to south facade",
    description: "South-facing windows contribute 42% of cooling load during peak hours. Low-E window film can reduce solar heat gain by 60%.",
    annualSavings: 3200,
    difficulty: "easy",
    roiTimeline: "6 months",
  },
];

// ── Alerts ─────────────────────────────────────────────────────────────────

export const alerts: Alert[] = [
  {
    id: "alert-1",
    type: "anomaly",
    siteId: "site-2",
    siteName: "Manufacturing Plant — Detroit",
    severity: "critical",
    message: "Consumption spike +38% above baseline detected on Line 3 compressors. Possible air leak or equipment malfunction.",
    triggeredAt: "2026-04-11T08:23:00Z",
    acknowledged: false,
  },
  {
    id: "alert-2",
    type: "threshold",
    siteId: "site-3",
    siteName: "Cloud DC — Oregon",
    severity: "warning",
    message: "Cooling system power draw exceeded 200kW threshold for 45 consecutive minutes.",
    triggeredAt: "2026-04-11T06:15:00Z",
    acknowledged: false,
  },
  {
    id: "alert-3",
    type: "forecast",
    siteId: "site-1",
    siteName: "HQ Tower — Austin",
    severity: "info",
    message: "Forecasted grid price spike tomorrow 2-5PM (ERCOT). Consider pre-cooling and battery discharge strategy.",
    triggeredAt: "2026-04-10T18:00:00Z",
    acknowledged: true,
  },
  {
    id: "alert-4",
    type: "anomaly",
    siteId: "site-4",
    siteName: "Retail Flagship — Miami",
    severity: "warning",
    message: "After-hours consumption 22% above expected baseline. Verify HVAC scheduling and display case defrost cycles.",
    triggeredAt: "2026-04-10T23:45:00Z",
    acknowledged: false,
  },
  {
    id: "alert-5",
    type: "threshold",
    siteId: "site-1",
    siteName: "HQ Tower — Austin",
    severity: "info",
    message: "Monthly consumption on track to exceed budget by 8%. Current run rate: $8,420 vs. budget $7,800.",
    triggeredAt: "2026-04-09T09:00:00Z",
    acknowledged: true,
  },
  {
    id: "alert-6",
    type: "forecast",
    siteId: "site-2",
    siteName: "Manufacturing Plant — Detroit",
    severity: "warning",
    message: "Extreme heat advisory for Detroit metro area next 3 days. Expect 15-20% increase in cooling demand.",
    triggeredAt: "2026-04-10T14:00:00Z",
    acknowledged: false,
  },
];

// ── Forecasts ──────────────────────────────────────────────────────────────

export function getForecast(siteId: string): ForecastDay[] {
  const base = sites.find((s) => s.id === siteId);
  if (!base) return [];
  const dailyBase = base.consumption24h;
  const costPer = base.cost24h / base.consumption24h;
  return Array.from({ length: 7 }, (_, i) => {
    const variance = 0.9 + Math.random() * 0.2;
    const consumption = Math.round(dailyBase * variance);
    return {
      date: `Apr ${12 + i}`,
      consumption,
      cost: Math.round(consumption * costPer * 100) / 100,
    };
  });
}

// ── Benchmarking data ──────────────────────────────────────────────────────

export function getBenchmarkData() {
  return sites.map((site) => ({
    id: site.id,
    name: site.name,
    type: site.type,
    kwhPerSqft: Math.round((site.consumption24h * 365) / site.sqft * 100) / 100,
    costPerKwh: Math.round((site.cost24h / site.consumption24h) * 1000) / 1000,
    carbonIntensity: Math.round((site.carbon24h / site.consumption24h) * 1000) / 1000,
    peerPercentile: site.type === "datacenter" ? 72 : site.type === "factory" ? 45 : site.type === "office" ? 68 : 55,
  }));
}

// ── Portfolio totals ───────────────────────────────────────────────────────

export function getPortfolioTotals() {
  return {
    totalConsumption: sites.reduce((sum, s) => sum + s.consumption24h, 0),
    totalCost: Math.round(sites.reduce((sum, s) => sum + s.cost24h, 0) * 100) / 100,
    totalCarbon: sites.reduce((sum, s) => sum + s.carbon24h, 0),
    sitesMonitored: sites.length,
  };
}

// ── Cost trend (monthly) ───────────────────────────────────────────────────

export const monthlyCostTrend = [
  { month: "Oct", cost: 68420 },
  { month: "Nov", cost: 72150 },
  { month: "Dec", cost: 81300 },
  { month: "Jan", cost: 79800 },
  { month: "Feb", cost: 71200 },
  { month: "Mar", cost: 74600 },
];

// ── Import records ─────────────────────────────────────────────────────────

export const importRecords: ImportRecord[] = [
  { id: "imp-1", filename: "austin-hq-march-2026.csv", site: "HQ Tower — Austin", uploadedAt: "2026-04-01T10:00:00Z", rows: 744, status: "completed" },
  { id: "imp-2", filename: "detroit-plant-march.csv", site: "Manufacturing Plant — Detroit", uploadedAt: "2026-04-01T10:15:00Z", rows: 744, status: "completed" },
  { id: "imp-3", filename: "oregon-dc-march.xlsx", site: "Cloud DC — Oregon", uploadedAt: "2026-04-02T09:00:00Z", rows: 2976, status: "completed" },
  { id: "imp-4", filename: "miami-retail-q1.csv", site: "Retail Flagship — Miami", uploadedAt: "2026-04-03T14:30:00Z", rows: 2160, status: "failed" },
];
