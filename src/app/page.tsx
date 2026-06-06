import Link from "next/link";
import { appConfig } from "@/lib/config";

/* ────────────────────────────────────────────────────────────────────────
   TESL.ON — "THE CLEAN GRID"
   A living energy aesthetic: arctic-dark field, drifting aurora ribbons, and
   a luminous energy-flow visualization where the workload routes to the
   cleanest regional grid — pulses of light flow along the chosen path.
   Anchored in Reykjavik: the cleanest grid on Earth.
   ──────────────────────────────────────────────────────────────────────── */

const BG = "#05100c";
const PANEL = "#08190f";
const LINE = "#1632226e";
const GREEN = "#4ade80";
const GREEN_HI = "#86efac";
const TEAL = "#2dd4bf";
const CYAN = "#22d3ee";
const PURPLE = "#a78bfa";
const AMBER = "#fbbf24";
const RED = "#f87171";
const TEXT = "#e3f7ea";
const MUTED = "#6f937f";

const CSS = `
@keyframes auroraDrift {
  0%   { transform: translateX(-8%) translateY(0) skewX(-6deg); opacity: .55; }
  50%  { transform: translateX(8%) translateY(-12px) skewX(4deg); opacity: .8; }
  100% { transform: translateX(-8%) translateY(0) skewX(-6deg); opacity: .55; }
}
@keyframes auroraDrift2 {
  0%   { transform: translateX(6%) translateY(0) skewX(5deg); opacity: .4; }
  50%  { transform: translateX(-6%) translateY(10px) skewX(-5deg); opacity: .65; }
  100% { transform: translateX(6%) translateY(0) skewX(5deg); opacity: .4; }
}
@keyframes flowPulse {
  to { stroke-dashoffset: -28; }
}
@keyframes breathe {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: .55; transform: scale(.82); }
}
@keyframes riseFade {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.teslon-rise { animation: riseFade .8s cubic-bezier(.2,.7,.2,1) both; }
@media (prefers-reduced-motion: reduce) {
  .teslon-aurora, .teslon-pulse, .teslon-breathe, .teslon-rise { animation: none !important; }
}
`;

/* Region destinations for the energy-flow hero */
interface Region {
  name: string;
  source: string;
  status: "clean" | "mixed" | "dirty";
  chosen?: boolean;
  y: number;
}
const REGIONS: Region[] = [
  { name: "Reykjavík", source: "100% geothermal", status: "clean", chosen: true, y: 54 },
  { name: "Oslo", source: "hydro", status: "clean", y: 116 },
  { name: "Mumbai", source: "mixed grid", status: "mixed", y: 178 },
  { name: "N. Virginia", source: "coal + gas", status: "dirty", y: 240 },
];

const color = (s: Region["status"]) =>
  s === "clean" ? GREEN : s === "mixed" ? AMBER : RED;

/* 24h clean-energy availability (%) — workloads snap to the greenest hours */
const HOURS = [
  42, 40, 44, 48, 52, 58, 66, 74, 82, 88, 92, 95,
  96, 95, 91, 84, 74, 63, 54, 49, 47, 45, 44, 43,
];

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `radial-gradient(120% 80% at 50% -10%, #0a241a 0%, ${BG} 55%)`,
        color: TEXT,
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
      }}
    >
      <style>{CSS}</style>

      {/* ── AURORA RIBBONS ── drifting luminous bands across the top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] overflow-hidden">
        <div
          className="teslon-aurora absolute -top-24 left-1/2 h-[440px] w-[160%] -translate-x-1/2 blur-3xl"
          style={{
            background: `linear-gradient(100deg, transparent 0%, ${GREEN}33 22%, ${TEAL}40 42%, ${CYAN}33 60%, ${PURPLE}2b 78%, transparent 100%)`,
            animation: "auroraDrift 16s ease-in-out infinite",
          }}
        />
        <div
          className="teslon-aurora absolute -top-10 left-1/2 h-[360px] w-[150%] -translate-x-1/2 blur-3xl"
          style={{
            background: `linear-gradient(80deg, transparent 8%, ${TEAL}33 30%, ${GREEN}3a 50%, ${CYAN}2e 72%, transparent 96%)`,
            animation: "auroraDrift2 22s ease-in-out infinite",
          }}
        />
        {/* faint star/particle dots */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(1px 1px at 20% 30%, ${GREEN_HI}66, transparent), radial-gradient(1px 1px at 70% 18%, ${CYAN}55, transparent), radial-gradient(1px 1px at 88% 42%, ${TEAL}55, transparent), radial-gradient(1px 1px at 42% 12%, #ffffff44, transparent), radial-gradient(1px 1px at 55% 50%, ${GREEN}44, transparent)`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* ── NAV ── */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold tracking-tight">
              tesl
              <span
                className="teslon-breathe inline-block"
                style={{
                  color: GREEN,
                  textShadow: `0 0 12px ${GREEN}`,
                  animation: "breathe 2.4s ease-in-out infinite",
                }}
              >
                .
              </span>
              on
            </span>
            <span
              className="hidden font-mono text-[10px] uppercase tracking-[0.25em] sm:inline"
              style={{ color: MUTED }}
            >
              Reykjavík · 64°N
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <Link
              href="/login"
              className="transition-colors hover:text-white"
              style={{ color: MUTED }}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full px-4 py-2 text-[13px] font-semibold transition-transform hover:scale-[1.03]"
              style={{
                color: "#04140c",
                background: `linear-gradient(180deg, ${GREEN_HI}, ${GREEN})`,
                boxShadow: `0 0 24px ${GREEN}55`,
              }}
            >
              Start routing clean
            </Link>
          </div>
        </header>

        {/* ── HERO ── headline + live carbon ledger + energy-flow visual ── */}
        <section className="grid grid-cols-1 items-center gap-10 pt-10 pb-16 lg:grid-cols-[1fr_1.05fr] lg:pt-16 lg:pb-24">
          {/* Left: message */}
          <div className="teslon-rise">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em]"
              style={{ borderColor: `${GREEN}33`, color: GREEN_HI, background: `${GREEN}0f` }}
            >
              <span
                className="teslon-breathe inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: GREEN, boxShadow: `0 0 8px ${GREEN}`, animation: "breathe 2s ease-in-out infinite" }}
              />
              Carbon-aware routing · live
            </div>

            <h1 className="text-[2.7rem] font-semibold leading-[1.04] tracking-tight sm:text-[3.4rem]">
              Route every query to the{" "}
              <span
                style={{
                  background: `linear-gradient(110deg, ${GREEN_HI}, ${TEAL} 55%, ${CYAN})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                cleanest grid
              </span>{" "}
              on Earth.
            </h1>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed" style={{ color: MUTED }}>
              Your AI workloads burn energy blind to where it comes from. Tesl.on
              treats <span style={{ color: TEXT }}>energy-per-query</span> as a
              first-class routing signal — shifting compute to renewable-powered
              regions in real time.
            </p>

            {/* live carbon ledger */}
            <div className="mt-9 flex flex-wrap items-end gap-x-10 gap-y-5">
              <div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-4xl font-semibold tabular-nums"
                    style={{ color: GREEN_HI, textShadow: `0 0 22px ${GREEN}66` }}
                  >
                    1,284
                  </span>
                  <span className="text-lg" style={{ color: GREEN }}>kg</span>
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
                  CO₂ avoided today
                </div>
              </div>
              <div>
                <div className="text-4xl font-semibold tabular-nums" style={{ color: TEXT }}>
                  47<span className="text-lg" style={{ color: TEAL }}>%</span>
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
                  lower carbon / query
                </div>
              </div>
              <div>
                <div className="text-4xl font-semibold tabular-nums" style={{ color: TEXT }}>
                  100<span className="text-lg" style={{ color: TEAL }}>%</span>
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
                  energy provenance
                </div>
              </div>
            </div>
          </div>

          {/* Right: glowing energy-flow routing visual */}
          <div className="teslon-rise" style={{ animationDelay: ".12s" }}>
            <EnergyFlow />
          </div>
        </section>

        {/* ── ROUTING DECISION ── before/after, glowing comparison ── */}
        <section className="pb-20">
          <SectionTag>The decision, per request</SectionTag>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
            <DecisionCard
              kind="dirty"
              label="Latency-only routing"
              region="N. Virginia"
              meta="us-east-1 · coal + gas"
              big="0.84"
              unit="kg CO₂ / 1K req"
              foot="340 ms · cheapest hop"
            />
            <div className="flex items-center justify-center">
              <span
                className="rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ borderColor: `${TEAL}44`, color: TEAL }}
              >
                Tesl.on ▸
              </span>
            </div>
            <DecisionCard
              kind="clean"
              label="Energy-aware routing"
              region="Reykjavík"
              meta="is-rkv-1 · 100% geothermal"
              big="0.04"
              unit="kg CO₂ / 1K req"
              foot="420 ms · 0.62 kg saved"
            />
          </div>
        </section>

        {/* ── 24H CLEAN-ENERGY CURVE ── luminous area chart ── */}
        <section className="pb-20">
          <SectionTag>Clean-energy availability · 24h</SectionTag>
          <p className="mt-2 mb-6 max-w-lg text-sm" style={{ color: MUTED }}>
            Tesl.on schedules deferrable workloads into the greenest hours —
            when wind, hydro and solar flood the grid.
          </p>
          <CleanCurve />
        </section>

        {/* ── REGIONS STRIP ── */}
        <section className="pb-20">
          <SectionTag>Routing across 4 renewable regions</SectionTag>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { city: "Reykjavík", src: "Geothermal", pct: "100%" },
              { city: "Oslo", src: "Hydro", pct: "98%" },
              { city: "Québec", src: "Hydro", pct: "99%" },
              { city: "Tasmania", src: "Wind + hydro", pct: "94%" },
            ].map((r) => (
              <div
                key={r.city}
                className="rounded-xl border p-4"
                style={{ borderColor: LINE, background: PANEL }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="teslon-breathe h-2 w-2 rounded-full"
                    style={{ background: GREEN, boxShadow: `0 0 8px ${GREEN}`, animation: "breathe 2.6s ease-in-out infinite" }}
                  />
                  <span className="text-sm font-semibold">{r.city}</span>
                </div>
                <div className="mt-3 text-2xl font-semibold tabular-nums" style={{ color: GREEN_HI }}>
                  {r.pct}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
                  {r.src} · renewable
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pb-20">
          <div
            className="relative overflow-hidden rounded-3xl border px-8 py-14 text-center"
            style={{ borderColor: `${GREEN}22`, background: `radial-gradient(120% 140% at 50% 0%, ${GREEN}14, ${PANEL} 70%)` }}
          >
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Make your AI run clean.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm" style={{ color: MUTED }}>
              One routing layer. Every query lands on the lowest-carbon grid that
              meets your latency budget.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]"
              style={{
                color: "#04140c",
                background: `linear-gradient(180deg, ${GREEN_HI}, ${GREEN})`,
                boxShadow: `0 0 30px ${GREEN}55`,
              }}
            >
              Start routing clean →
            </Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          className="flex flex-col items-center justify-between gap-3 border-t py-8 text-sm sm:flex-row"
          style={{ borderColor: LINE }}
        >
          <div className="flex items-center gap-2" style={{ color: MUTED }}>
            <span style={{ color: GREEN }}>{appConfig.name}</span>
            <span style={{ color: `${MUTED}88` }}>·</span>
            <span>Reykjavík, Iceland</span>
          </div>
          <a
            href="https://abduljaleel.xyz/aletheia/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-white"
            style={{ color: MUTED }}
          >
            Part of the Aletheia stack ↗
          </a>
        </footer>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   ENERGY-FLOW HERO VISUAL
   Source → router → four region nodes. The chosen (clean) path glows green
   with light pulses flowing along it; dirty paths are dim and dashed.
   ════════════════════════════════════════════════════════════════════════ */
function EnergyFlow() {
  const SRC = { x: 36, y: 147 };
  const HUB = { x: 150, y: 147 };
  const nodeX = 300;

  return (
    <div
      className="relative rounded-2xl border p-3"
      style={{
        borderColor: `${GREEN}1f`,
        background: `linear-gradient(180deg, ${PANEL}, #061109)`,
        boxShadow: `0 0 60px -20px ${GREEN}40, inset 0 0 60px -40px ${TEAL}55`,
      }}
    >
      <div className="mb-2 flex items-center justify-between px-2 pt-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: MUTED }}>
          live routing
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: GREEN }}>
          ● optimizing gCO₂
        </span>
      </div>
      <svg viewBox="0 0 430 294" className="w-full" style={{ display: "block" }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="chosen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={TEAL} />
            <stop offset="1" stopColor={GREEN_HI} />
          </linearGradient>
        </defs>

        {/* source → hub trunk */}
        <line x1={SRC.x + 30} y1={SRC.y} x2={HUB.x} y2={HUB.y} stroke={`${TEAL}88`} strokeWidth="2" />

        {/* paths hub → each region */}
        {REGIONS.map((r, i) => {
          const c = color(r.status);
          const d = `M ${HUB.x} ${HUB.y} C ${HUB.x + 70} ${HUB.y}, ${nodeX - 70} ${r.y}, ${nodeX} ${r.y}`;
          if (r.chosen) {
            return (
              <g key={i}>
                {/* base soft glow */}
                <path d={d} fill="none" stroke="url(#chosen)" strokeWidth="3" strokeOpacity="0.5" filter="url(#glow)" />
                {/* flowing pulse dashes */}
                <path
                  className="teslon-pulse"
                  d={d}
                  fill="none"
                  stroke={GREEN_HI}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeDasharray="2 12"
                  style={{ animation: "flowPulse 1.1s linear infinite" }}
                />
              </g>
            );
          }
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={c}
              strokeOpacity={r.status === "mixed" ? 0.4 : 0.28}
              strokeWidth="1.4"
              strokeDasharray="3 5"
            />
          );
        })}

        {/* source node */}
        <g>
          <rect x={SRC.x - 2} y={SRC.y - 16} width="38" height="32" rx="6" fill="#0a1f14" stroke={`${TEAL}66`} strokeWidth="1" />
          <text x={SRC.x + 17} y={SRC.y - 2} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={TEXT}>GPT-4</text>
          <text x={SRC.x + 17} y={SRC.y + 9} textAnchor="middle" fontSize="7" fontFamily="monospace" fill={MUTED}>8K tok</text>
        </g>

        {/* hub / router */}
        <g filter="url(#glow)">
          <circle cx={HUB.x} cy={HUB.y} r="13" fill="#08231733" stroke={GREEN} strokeWidth="1.5" />
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r="4"
            fill={GREEN_HI}
            className="teslon-breathe"
            style={{ animation: "breathe 1.8s ease-in-out infinite", transformOrigin: `${HUB.x}px ${HUB.y}px` }}
          />
        </g>
        <text x={HUB.x} y={HUB.y + 28} textAnchor="middle" fontSize="8" fontFamily="monospace" fill={GREEN}>route · gCO₂</text>

        {/* region nodes */}
        {REGIONS.map((r, i) => {
          const c = color(r.status);
          return (
            <g key={i} opacity={r.chosen ? 1 : 0.62}>
              <rect
                x={nodeX}
                y={r.y - 15}
                width="118"
                height="30"
                rx="7"
                fill={r.chosen ? `${GREEN}14` : "#0a160f"}
                stroke={r.chosen ? GREEN : c}
                strokeWidth={r.chosen ? 1.6 : 1}
                strokeOpacity={r.chosen ? 1 : 0.55}
                filter={r.chosen ? "url(#glow)" : undefined}
              />
              <circle
                cx={nodeX + 12}
                cy={r.y}
                r="3.2"
                fill={c}
                className={r.chosen ? "teslon-breathe" : undefined}
                style={r.chosen ? { animation: "breathe 2s ease-in-out infinite", transformOrigin: `${nodeX + 12}px ${r.y}px` } : undefined}
              />
              <text x={nodeX + 22} y={r.y - 2} fontSize="9.5" fontFamily="monospace" fill={r.chosen ? GREEN_HI : TEXT} fontWeight={r.chosen ? 700 : 400}>
                {r.name}
              </text>
              <text x={nodeX + 22} y={r.y + 9} fontSize="7" fontFamily="monospace" fill={c} opacity="0.9">
                {r.source}
              </text>
            </g>
          );
        })}
      </svg>

      {/* selected readout */}
      <div
        className="mt-2 flex items-center justify-between rounded-lg px-3 py-2"
        style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}22` }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: GREEN_HI }}>
          ▸ selected · Reykjavík
        </span>
        <span className="font-mono text-[10px] tabular-nums" style={{ color: TEAL }}>
          420ms · 0.62 kg CO₂ saved
        </span>
      </div>
    </div>
  );
}

/* ── 24h luminous clean-energy area chart ── */
function CleanCurve() {
  const W = 960;
  const H = 220;
  const pts = HOURS.map((v, i) => {
    const x = (i / (HOURS.length - 1)) * W;
    const y = H - (v / 100) * (H - 24) - 12;
    return { x, y, v, i };
  });
  const line = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `0,${H} ${line} ${W},${H}`;
  // workloads scheduled into the greenest hours (top quartile)
  const peak = [...HOURS].sort((a, b) => b - a)[5];

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: LINE, background: PANEL }}
    >
      <svg viewBox={`0 0 ${W} ${H + 26}`} className="w-full" style={{ display: "block" }}>
        <defs>
          <linearGradient id="cleanArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={GREEN} stopOpacity="0.42" />
            <stop offset="0.7" stopColor={GREEN} stopOpacity="0.05" />
            <stop offset="1" stopColor={GREEN} stopOpacity="0" />
          </linearGradient>
          <filter id="lineGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* grid rules */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" y1={H * f} x2={W} y2={H * f} stroke={GREEN} strokeOpacity="0.07" strokeWidth="1" />
        ))}

        {/* filled area */}
        <polygon points={area} fill="url(#cleanArea)" />
        {/* glowing curve */}
        <polyline points={line} fill="none" stroke={GREEN_HI} strokeWidth="2.5" filter="url(#lineGlow)" />

        {/* scheduled workload markers on the greenest hours */}
        {pts.map((p) =>
          p.v >= peak ? (
            <g key={p.i}>
              <line x1={p.x} y1={p.y} x2={p.x} y2={H} stroke={GREEN} strokeOpacity="0.25" strokeWidth="1" />
              <circle cx={p.x} cy={p.y} r="4.5" fill={GREEN_HI} filter="url(#lineGlow)" />
            </g>
          ) : null
        )}

        {/* hour ticks */}
        {[0, 6, 12, 18, 23].map((h) => (
          <text
            key={h}
            x={(h / 23) * W}
            y={H + 18}
            textAnchor={h === 0 ? "start" : h === 23 ? "end" : "middle"}
            fontSize="11"
            fontFamily="monospace"
            fill={MUTED}
          >
            {String(h).padStart(2, "0")}:00
          </text>
        ))}
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: GREEN_HI, boxShadow: `0 0 6px ${GREEN}` }} />
          workload scheduled
        </span>
        <span>area = renewable availability</span>
      </div>
    </div>
  );
}

/* ── small helpers ── */
function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: GREEN }}>
        {children}
      </span>
      <span className="h-px flex-1" style={{ background: `${GREEN}1f` }} />
    </div>
  );
}

function DecisionCard({
  kind,
  label,
  region,
  meta,
  big,
  unit,
  foot,
}: {
  kind: "clean" | "dirty";
  label: string;
  region: string;
  meta: string;
  big: string;
  unit: string;
  foot: string;
}) {
  const clean = kind === "clean";
  const accent = clean ? GREEN : RED;
  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        borderColor: clean ? `${GREEN}3a` : `${RED}26`,
        background: clean
          ? `radial-gradient(120% 120% at 50% 0%, ${GREEN}12, ${PANEL} 70%)`
          : PANEL,
        boxShadow: clean ? `0 0 40px -16px ${GREEN}55` : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: clean ? GREEN_HI : MUTED }}>
          {label}
        </span>
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: accent, boxShadow: clean ? `0 0 10px ${GREEN}` : "none", opacity: clean ? 1 : 0.7 }}
        />
      </div>
      <div className="mt-4 text-lg font-semibold" style={{ color: TEXT }}>
        {region}
      </div>
      <div className="font-mono text-[11px]" style={{ color: clean ? TEAL : `${RED}cc` }}>
        {meta}
      </div>
      <div className="mt-6 flex items-baseline gap-2">
        <span
          className="text-4xl font-semibold tabular-nums"
          style={{ color: clean ? GREEN_HI : RED, textShadow: clean ? `0 0 20px ${GREEN}55` : "none" }}
        >
          {big}
        </span>
        <span className="font-mono text-[11px]" style={{ color: MUTED }}>
          {unit}
        </span>
      </div>
      <div className="mt-4 border-t pt-3 font-mono text-[11px]" style={{ borderColor: LINE, color: MUTED }}>
        {foot}
      </div>
    </div>
  );
}
