import { createClient } from "@/lib/supabase/client";
import {
  sites as demoSites,
  recommendations as demoRecommendations,
  alerts as demoAlerts,
  type Site,
  type SiteType,
  type SourceType,
  type Recommendation,
  type Alert,
  type AlertType,
  type AlertSeverity,
  type Difficulty,
} from "@/lib/data/energy";

// ── Context ────────────────────────────────────────────────────────────────

export async function getCtx() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();
  return { supabase, userId: user.id, orgId: profile!.org_id as string };
}

export async function getUserGreeting(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "";
  return (user.user_metadata?.full_name as string) || user.email || "";
}

// ── DB row shapes (snake_case) ─────────────────────────────────────────────

interface SiteRowDb {
  id: string;
  org_id: string;
  name: string;
  address: string | null;
  site_type: string | null;
  grid_region: string | null;
  timezone: string | null;
  metadata: {
    sqft?: number;
    sourceBreakdown?: { source: SourceType; pct: number }[];
  } | null;
  created_at: string;
}

interface ConsumptionRowDb {
  id: string;
  site_id: string;
  source: string | null;
  timestamp: string;
  kwh: number;
  cost_cents: number | null;
  carbon_kg: number | null;
  interval_minutes: number | null;
}

interface PlanRowDb {
  id: string;
  site_id: string;
  plan_type: string | null;
  status: string | null;
  recommendations: {
    title?: string;
    description?: string;
    difficulty?: Difficulty;
    roiTimeline?: string;
  } | null;
  projected_savings_cents: number | null;
  projected_carbon_reduction_kg: number | null;
  created_at: string;
}

interface SiteAlertRowDb {
  id: string;
  site_id: string;
  alert_type: string | null;
  severity: string | null;
  message: string | null;
  triggered_at: string | null;
  acknowledged_by: string | null;
  created_at: string;
  sites?: { name: string } | null;
}

interface BenchmarkRowDb {
  id: string;
  site_id: string;
  period: string | null;
  kwh_per_sqft: number | null;
  cost_per_kwh: number | null;
  carbon_intensity: number | null;
  peer_percentile: number | null;
  created_at: string;
  sites?: { name: string; site_type: string | null } | null;
}

// ── Shared shapes used by pages ────────────────────────────────────────────

export interface BenchmarkEntry {
  id: string;
  siteId: string;
  name: string;
  type: SiteType;
  period: string;
  kwhPerSqft: number;
  costPerKwh: number;
  carbonIntensity: number;
  peerPercentile: number;
}

export interface MonthCost {
  month: string;
  cost: number;
}

export interface NewConsumptionRow {
  timestamp: string; // ISO
  kwh: number;
  costCents: number | null;
  source: SourceType | "generator";
  carbonKg: number | null;
  intervalMinutes: number;
}

export interface SiteDetail {
  site: Site;
  recommendations: Recommendation[];
  alerts: Alert[];
  benchmarks: BenchmarkEntry[];
}

export interface NewSiteInput {
  name: string;
  type: SiteType;
  gridRegion: string;
  sqft: number;
  address?: string;
}

export interface NewAlertInput {
  siteId: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 1000;

type SupabaseClientT = Awaited<ReturnType<typeof getCtx>>["supabase"];

async function fetchAllConsumption(
  supabase: SupabaseClientT,
  siteIds: string[],
  sinceIso: string
): Promise<ConsumptionRowDb[]> {
  if (siteIds.length === 0) return [];
  const out: ConsumptionRowDb[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("consumption_data")
      .select(
        "id, site_id, source, timestamp, kwh, cost_cents, carbon_kg, interval_minutes"
      )
      .in("site_id", siteIds)
      .gte("timestamp", sinceIso)
      .order("timestamp", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as ConsumptionRowDb[];
    out.push(...rows);
    if (rows.length < PAGE_SIZE) return out;
    from += PAGE_SIZE;
  }
}

const SOURCE_ORDER: SourceType[] = ["grid", "solar", "battery"];

interface SiteStats {
  consumption24h: number;
  cost24h: number;
  carbon24h: number;
  currentKw: number;
  sourceBreakdown: { source: SourceType; pct: number }[];
  hourlyConsumption: number[];
}

function computeStats(rows: ConsumptionRowDb[]): SiteStats {
  const hourly = new Array<number>(24).fill(0);
  const bySource: Record<string, number> = {};
  let kwhSum = 0;
  let costSum = 0;
  let carbonSum = 0;
  let latest: ConsumptionRowDb | null = null;

  for (const row of rows) {
    const kwh = Number(row.kwh) || 0;
    const d = new Date(row.timestamp);
    hourly[d.getHours()] += kwh;
    kwhSum += kwh;
    costSum += (row.cost_cents ?? 0) / 100;
    carbonSum += Number(row.carbon_kg ?? 0);
    const src = (row.source ?? "grid").toLowerCase();
    bySource[src] = (bySource[src] ?? 0) + kwh;
    if (!latest || row.timestamp > latest.timestamp) latest = row;
  }

  let currentKw = 0;
  if (latest) {
    const intervalHours = (latest.interval_minutes ?? 60) / 60;
    currentKw =
      Math.round(((Number(latest.kwh) || 0) / (intervalHours || 1)) * 10) / 10;
  }

  const breakdown: { source: SourceType; pct: number }[] = [];
  if (kwhSum > 0) {
    for (const source of SOURCE_ORDER) {
      const val = bySource[source] ?? 0;
      const pct = Math.round((val / kwhSum) * 100);
      if (pct > 0) breakdown.push({ source, pct });
    }
  }

  return {
    consumption24h: Math.round(kwhSum),
    cost24h: Math.round(costSum * 100) / 100,
    carbon24h: Math.round(carbonSum),
    currentKw,
    sourceBreakdown: breakdown,
    hourlyConsumption: hourly.map((v) => Math.round(v * 10) / 10),
  };
}

const EMPTY_STATS: SiteStats = {
  consumption24h: 0,
  cost24h: 0,
  carbon24h: 0,
  currentKw: 0,
  sourceBreakdown: [],
  hourlyConsumption: new Array<number>(24).fill(0),
};

function mapSiteRow(row: SiteRowDb, stats: SiteStats): Site {
  const breakdown =
    stats.sourceBreakdown.length > 0
      ? stats.sourceBreakdown
      : row.metadata?.sourceBreakdown ?? [{ source: "grid" as const, pct: 100 }];
  return {
    id: row.id,
    name: row.name,
    type: (row.site_type as SiteType) || "office",
    gridRegion: row.grid_region ?? "",
    sqft: row.metadata?.sqft ?? 0,
    consumption24h: stats.consumption24h,
    cost24h: stats.cost24h,
    carbon24h: stats.carbon24h,
    currentKw: stats.currentKw,
    dailyKwh: stats.consumption24h,
    costToday: stats.cost24h,
    sourceBreakdown: breakdown,
    hourlyConsumption: stats.hourlyConsumption,
  };
}

function mapPlanRow(row: PlanRowDb): Recommendation {
  const rec = row.recommendations ?? {};
  return {
    id: row.id,
    siteId: row.site_id,
    title: rec.title ?? `${row.plan_type ?? "Optimization"} plan`,
    description: rec.description ?? "",
    annualSavings: Math.round((row.projected_savings_cents ?? 0) / 100),
    difficulty: rec.difficulty ?? "medium",
    roiTimeline: rec.roiTimeline ?? "—",
  };
}

function mapAlertRow(row: SiteAlertRowDb, siteName?: string): Alert {
  return {
    id: row.id,
    type: (row.alert_type as AlertType) || "anomaly",
    siteId: row.site_id,
    siteName: siteName ?? row.sites?.name ?? "Unknown site",
    severity: (row.severity as AlertSeverity) || "info",
    message: row.message ?? "",
    triggeredAt: row.triggered_at ?? row.created_at,
    acknowledged: row.acknowledged_by != null,
  };
}

function mapBenchmarkRow(
  row: BenchmarkRowDb,
  siteName?: string,
  siteType?: SiteType
): BenchmarkEntry {
  return {
    id: row.id,
    siteId: row.site_id,
    name: siteName ?? row.sites?.name ?? "Unknown site",
    type: siteType ?? ((row.sites?.site_type as SiteType) || "office"),
    period: row.period ?? "",
    kwhPerSqft: Number(row.kwh_per_sqft ?? 0),
    costPerKwh: Number(row.cost_per_kwh ?? 0),
    carbonIntensity: Number(row.carbon_intensity ?? 0),
    peerPercentile: row.peer_percentile ?? 0,
  };
}

function dayAgoIso(): string {
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
}

// ── Sites ──────────────────────────────────────────────────────────────────

export async function listSites(): Promise<Site[]> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as SiteRowDb[];
  if (rows.length === 0) return [];

  const consumption = await fetchAllConsumption(
    supabase,
    rows.map((r) => r.id),
    dayAgoIso()
  );
  const grouped = new Map<string, ConsumptionRowDb[]>();
  for (const c of consumption) {
    const list = grouped.get(c.site_id);
    if (list) list.push(c);
    else grouped.set(c.site_id, [c]);
  }
  return rows.map((row) =>
    mapSiteRow(row, computeStats(grouped.get(row.id) ?? []))
  );
}

export async function createSite(input: NewSiteInput): Promise<Site> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("sites")
    .insert({
      org_id: orgId,
      name: input.name,
      address: input.address || null,
      site_type: input.type,
      grid_region: input.gridRegion || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      metadata: { sqft: input.sqft },
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapSiteRow(data as SiteRowDb, EMPTY_STATS);
}

export async function getSiteDetail(id: string): Promise<SiteDetail | null> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const siteRow = data as SiteRowDb;

  const [consumption, plansRes, alertsRes, benchRes] = await Promise.all([
    fetchAllConsumption(supabase, [id], dayAgoIso()),
    supabase
      .from("optimization_plans")
      .select("*")
      .eq("site_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("site_alerts")
      .select("*")
      .eq("site_id", id)
      .order("triggered_at", { ascending: false }),
    supabase
      .from("benchmarks")
      .select("*")
      .eq("site_id", id)
      .order("created_at", { ascending: false }),
  ]);
  if (plansRes.error) throw new Error(plansRes.error.message);
  if (alertsRes.error) throw new Error(alertsRes.error.message);
  if (benchRes.error) throw new Error(benchRes.error.message);

  const site = mapSiteRow(siteRow, computeStats(consumption));
  return {
    site,
    recommendations: ((plansRes.data ?? []) as PlanRowDb[]).map(mapPlanRow),
    alerts: ((alertsRes.data ?? []) as SiteAlertRowDb[]).map((r) =>
      mapAlertRow(r, site.name)
    ),
    benchmarks: ((benchRes.data ?? []) as BenchmarkRowDb[]).map((r) =>
      mapBenchmarkRow(r, site.name, site.type)
    ),
  };
}

// ── Alerts ─────────────────────────────────────────────────────────────────

export async function listAlerts(): Promise<Alert[]> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("site_alerts")
    .select("*, sites!inner(name, org_id)")
    .eq("sites.org_id", orgId)
    .order("triggered_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as SiteAlertRowDb[]).map((r) => mapAlertRow(r));
}

export async function createSiteAlert(input: NewAlertInput): Promise<Alert> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("site_alerts")
    .insert({
      site_id: input.siteId,
      alert_type: input.type,
      severity: input.severity,
      message: input.message,
      triggered_at: new Date().toISOString(),
    })
    .select("*, sites(name)")
    .single();
  if (error) throw new Error(error.message);
  return mapAlertRow(data as SiteAlertRowDb);
}

export async function acknowledgeAlert(alertId: string): Promise<void> {
  const { supabase, userId } = await getCtx();
  const { error } = await supabase
    .from("site_alerts")
    .update({ acknowledged_by: userId })
    .eq("id", alertId);
  if (error) throw new Error(error.message);
}

// ── Benchmarks ─────────────────────────────────────────────────────────────

/** Latest benchmark entry per site across the org. */
export async function listBenchmarkEntries(): Promise<BenchmarkEntry[]> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("benchmarks")
    .select("*, sites!inner(name, site_type, org_id)")
    .eq("sites.org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const seen = new Set<string>();
  const out: BenchmarkEntry[] = [];
  for (const row of (data ?? []) as BenchmarkRowDb[]) {
    if (seen.has(row.site_id)) continue;
    seen.add(row.site_id);
    out.push(mapBenchmarkRow(row));
  }
  return out;
}

// ── Analytics ──────────────────────────────────────────────────────────────

/** Aggregates consumption_data cost by calendar month for the last `months` months. */
export async function getMonthlyCostTrend(months = 6): Promise<MonthCost[]> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("sites")
    .select("id")
    .eq("org_id", orgId);
  if (error) throw new Error(error.message);
  const siteIds = ((data ?? []) as { id: string }[]).map((r) => r.id);

  const now = new Date();
  const windowStart = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
  const buckets = new Map<string, number>();
  const order: { key: string; month: string }[] = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(windowStart.getFullYear(), windowStart.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    buckets.set(key, 0);
    order.push({
      key,
      month: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }

  if (siteIds.length > 0) {
    const rows = await fetchAllConsumption(
      supabase,
      siteIds,
      windowStart.toISOString()
    );
    for (const row of rows) {
      const d = new Date(row.timestamp);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + (row.cost_cents ?? 0) / 100);
      }
    }
  }

  return order.map(({ key, month }) => ({
    month,
    cost: Math.round((buckets.get(key) ?? 0) * 100) / 100,
  }));
}

// ── Consumption import ─────────────────────────────────────────────────────

export interface CsvParseResult {
  rows: NewConsumptionRow[];
  errors: string[];
  totalLines: number;
}

const SOURCE_VALUES = new Set(["grid", "solar", "battery", "generator"]);

/** Parses pasted CSV text. Expected columns: timestamp, consumption_kwh, cost, source[, carbon_kg, interval_minutes]. */
export function parseConsumptionCsv(text: string): CsvParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const errors: string[] = [];
  const rows: NewConsumptionRow[] = [];
  if (lines.length === 0) return { rows, errors: ["No rows found"], totalLines: 0 };

  let idx = { ts: 0, kwh: 1, cost: 2, source: 3, carbon: 4, interval: 5 };
  let costIsCents = false;
  let start = 0;

  const headerCells = lines[0].split(",").map((c) => c.trim().toLowerCase());
  const looksLikeHeader = headerCells.some((c) =>
    /^(timestamp|date|time|datetime|kwh|consumption|consumption_kwh|energy|usage|cost|cost_cents|source|carbon|carbon_kg|co2|interval|interval_minutes)$/.test(
      c
    )
  );
  if (looksLikeHeader) {
    start = 1;
    const find = (...names: string[]) =>
      headerCells.findIndex((c) => names.includes(c));
    const ts = find("timestamp", "date", "time", "datetime");
    const kwh = find("kwh", "consumption_kwh", "consumption", "energy", "usage");
    const cost = find("cost", "cost_usd", "cost_dollars");
    const costCents = find("cost_cents");
    const source = find("source");
    const carbon = find("carbon", "carbon_kg", "co2", "co2_kg");
    const interval = find("interval", "interval_minutes");
    idx = {
      ts: ts >= 0 ? ts : 0,
      kwh: kwh >= 0 ? kwh : 1,
      cost: costCents >= 0 ? costCents : cost,
      source,
      carbon,
      interval,
    };
    costIsCents = costCents >= 0;
  }

  for (let i = start; i < lines.length; i++) {
    const cells = lines[i].split(",").map((c) => c.trim());
    const lineNo = i + 1;

    const tsRaw = cells[idx.ts] ?? "";
    const ts = new Date(tsRaw);
    if (!tsRaw || isNaN(ts.getTime())) {
      errors.push(`Line ${lineNo}: invalid timestamp "${tsRaw}"`);
      continue;
    }
    const kwhRaw = cells[idx.kwh] ?? "";
    const kwh = parseFloat(kwhRaw);
    if (!isFinite(kwh) || kwh < 0) {
      errors.push(`Line ${lineNo}: invalid kWh value "${kwhRaw}"`);
      continue;
    }

    let costCents: number | null = null;
    if (idx.cost >= 0 && cells[idx.cost]) {
      const cost = parseFloat(cells[idx.cost].replace(/^\$/, ""));
      if (isFinite(cost)) {
        costCents = Math.round(costIsCents ? cost : cost * 100);
      }
    }

    let source: NewConsumptionRow["source"] = "grid";
    if (idx.source >= 0 && cells[idx.source]) {
      const s = cells[idx.source].toLowerCase();
      if (SOURCE_VALUES.has(s)) source = s as NewConsumptionRow["source"];
    }

    let carbonKg: number | null = null;
    if (idx.carbon >= 0 && cells[idx.carbon]) {
      const c = parseFloat(cells[idx.carbon]);
      if (isFinite(c)) carbonKg = c;
    }

    let intervalMinutes = 60;
    if (idx.interval >= 0 && cells[idx.interval]) {
      const m = parseInt(cells[idx.interval], 10);
      if (isFinite(m) && m > 0) intervalMinutes = m;
    }

    rows.push({
      timestamp: ts.toISOString(),
      kwh,
      costCents,
      source,
      carbonKg,
      intervalMinutes,
    });
  }

  return { rows, errors, totalLines: lines.length - start };
}

const INSERT_CHUNK = 500;

export async function bulkInsertConsumption(
  siteId: string,
  rows: NewConsumptionRow[]
): Promise<number> {
  if (rows.length === 0) return 0;
  const { supabase } = await getCtx();
  const payload = rows.map((r) => ({
    site_id: siteId,
    source: r.source,
    timestamp: r.timestamp,
    kwh: r.kwh,
    cost_cents: r.costCents,
    carbon_kg: r.carbonKg,
    interval_minutes: r.intervalMinutes,
  }));
  for (let i = 0; i < payload.length; i += INSERT_CHUNK) {
    const { error } = await supabase
      .from("consumption_data")
      .insert(payload.slice(i, i + INSERT_CHUNK));
    if (error) throw new Error(error.message);
  }
  return payload.length;
}

// ── Demo seeding ───────────────────────────────────────────────────────────

function planTypeFor(rec: Recommendation): string {
  const text = `${rec.title} ${rec.description}`.toLowerCase();
  if (text.includes("battery") || text.includes("resilien")) return "resilience";
  if (text.includes("heat") || text.includes("carbon")) return "carbon";
  return "cost";
}

function pickSource(
  breakdown: { source: SourceType; pct: number }[],
  hour: number
): string {
  const roll = Math.random() * 100;
  let acc = 0;
  let chosen: SourceType = "grid";
  for (const b of breakdown) {
    acc += b.pct;
    if (roll <= acc) {
      chosen = b.source;
      break;
    }
  }
  if (chosen === "solar" && (hour < 7 || hour > 18)) return "grid";
  return chosen;
}

const DEMO_ALERT_HOURS_AGO = [2, 5, 16, 11, 36, 20];

/** Seeds demo content from the bundled seed arrays. No-op if the org already has sites. */
export async function seedDemoData(): Promise<void> {
  const { supabase, userId, orgId } = await getCtx();

  const { count, error: countError } = await supabase
    .from("sites")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId);
  if (countError) throw new Error(countError.message);
  if ((count ?? 0) > 0) return;

  // 1. Sites (parents first, capture ids)
  const { data: inserted, error: siteError } = await supabase
    .from("sites")
    .insert(
      demoSites.map((s) => ({
        org_id: orgId,
        name: s.name,
        site_type: s.type,
        grid_region: s.gridRegion,
        timezone: "America/Chicago",
        metadata: { sqft: s.sqft, sourceBreakdown: s.sourceBreakdown },
      }))
    )
    .select("id, name");
  if (siteError) throw new Error(siteError.message);

  const idByName = new Map<string, string>();
  for (const row of (inserted ?? []) as { id: string; name: string }[]) {
    idByName.set(row.name, row.id);
  }
  const idForSeed = (seedSiteId: string): string | null => {
    const seed = demoSites.find((s) => s.id === seedSiteId);
    return seed ? idByName.get(seed.name) ?? null : null;
  };

  // 2. Consumption: hourly rows for the last 7 days with a realistic daily shape
  const consumptionRows: Record<string, unknown>[] = [];
  const anchor = new Date();
  anchor.setMinutes(0, 0, 0);
  for (const seed of demoSites) {
    const siteId = idByName.get(seed.name);
    if (!siteId) continue;
    const costRate = seed.cost24h / seed.consumption24h; // $/kWh
    const carbonRate = seed.carbon24h / seed.consumption24h; // kg/kWh
    for (let offset = 0; offset < 7 * 24; offset++) {
      const ts = new Date(anchor.getTime() - offset * 60 * 60 * 1000);
      const hour = ts.getHours();
      const dayFactor = 0.92 + Math.random() * 0.16;
      const noise = 0.93 + Math.random() * 0.14;
      const kwh =
        Math.round(seed.hourlyConsumption[hour] * dayFactor * noise * 10) / 10;
      consumptionRows.push({
        site_id: siteId,
        source: pickSource(seed.sourceBreakdown, hour),
        timestamp: ts.toISOString(),
        kwh,
        cost_cents: Math.round(kwh * costRate * 100),
        carbon_kg: Math.round(kwh * carbonRate * 100) / 100,
        interval_minutes: 60,
      });
    }
  }
  for (let i = 0; i < consumptionRows.length; i += INSERT_CHUNK) {
    const { error } = await supabase
      .from("consumption_data")
      .insert(consumptionRows.slice(i, i + INSERT_CHUNK));
    if (error) throw new Error(error.message);
  }

  // 3. Optimization plans
  const planRows = demoRecommendations
    .map((rec) => {
      const siteId = idForSeed(rec.siteId);
      if (!siteId) return null;
      return {
        site_id: siteId,
        plan_type: planTypeFor(rec),
        status: "proposed",
        recommendations: {
          title: rec.title,
          description: rec.description,
          difficulty: rec.difficulty,
          roiTimeline: rec.roiTimeline,
        },
        projected_savings_cents: rec.annualSavings * 100,
        projected_carbon_reduction_kg: Math.round(rec.annualSavings * 0.35),
      };
    })
    .filter((r) => r !== null);
  if (planRows.length > 0) {
    const { error } = await supabase.from("optimization_plans").insert(planRows);
    if (error) throw new Error(error.message);
  }

  // 4. Site alerts (dates relative to now)
  const alertRows = demoAlerts
    .map((alert, i) => {
      const siteId = idForSeed(alert.siteId);
      if (!siteId) return null;
      const hoursAgo = DEMO_ALERT_HOURS_AGO[i % DEMO_ALERT_HOURS_AGO.length];
      return {
        site_id: siteId,
        alert_type: alert.type,
        severity: alert.severity,
        message: alert.message,
        triggered_at: new Date(
          Date.now() - hoursAgo * 60 * 60 * 1000
        ).toISOString(),
        acknowledged_by: alert.acknowledged ? userId : null,
      };
    })
    .filter((r) => r !== null);
  if (alertRows.length > 0) {
    const { error } = await supabase.from("site_alerts").insert(alertRows);
    if (error) throw new Error(error.message);
  }

  // 5. Benchmarks (current quarter)
  const now = new Date();
  const period = `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`;
  const benchmarkRows = demoSites
    .map((seed) => {
      const siteId = idByName.get(seed.name);
      if (!siteId) return null;
      return {
        site_id: siteId,
        period,
        kwh_per_sqft:
          Math.round(((seed.consumption24h * 365) / seed.sqft) * 100) / 100,
        cost_per_kwh:
          Math.round((seed.cost24h / seed.consumption24h) * 1000) / 1000,
        carbon_intensity:
          Math.round((seed.carbon24h / seed.consumption24h) * 1000) / 1000,
        peer_percentile:
          seed.type === "datacenter"
            ? 72
            : seed.type === "factory"
            ? 45
            : seed.type === "office"
            ? 68
            : 55,
      };
    })
    .filter((r) => r !== null);
  if (benchmarkRows.length > 0) {
    const { error } = await supabase.from("benchmarks").insert(benchmarkRows);
    if (error) throw new Error(error.message);
  }
}
