import Link from "next/link";
import { appConfig } from "@/lib/config";

const ACCENT = "#7be870"; // electric green for renewable
const ACCENT_WARM = "#f0a050"; // amber for mixed
const ACCENT_BAD = "#e87070"; // red for coal-heavy
const BG = "#0a0e0a";

interface Region {
  id: string;
  name: string;
  lat: number; // 0-100 (0 = north)
  lon: number; // 0-100 (0 = west)
  kind: "green" | "mixed" | "bad";
}

const regions: Region[] = [
  { id: "is-rkv-1", name: "Reykjavik", lat: 12, lon: 32, kind: "green" },
  { id: "no-oslo", name: "Oslo", lat: 18, lon: 48, kind: "green" },
  { id: "us-pdx", name: "Pacific Northwest", lat: 28, lon: 12, kind: "green" },
  { id: "ca-mtl", name: "Montreal", lat: 24, lon: 25, kind: "green" },
  { id: "eu-fra", name: "Frankfurt", lat: 28, lon: 50, kind: "mixed" },
  { id: "ap-sin", name: "Singapore", lat: 60, lon: 82, kind: "mixed" },
  { id: "au-syd", name: "Sydney", lat: 78, lon: 92, kind: "mixed" },
  { id: "us-east-1", name: "Virginia", lat: 32, lon: 22, kind: "bad" },
  { id: "ap-east", name: "Hong Kong", lat: 48, lon: 80, kind: "bad" },
  { id: "in-mum", name: "Mumbai", lat: 50, lon: 65, kind: "bad" },
];

function regionColor(kind: Region["kind"]): string {
  if (kind === "green") return ACCENT;
  if (kind === "mixed") return ACCENT_WARM;
  return ACCENT_BAD;
}

// 24-hour carbon schedule. Lower numbers = lower carbon intensity (greener grid).
const hourly = [
  { h: 0, intensity: 30, workload: 90 },
  { h: 1, intensity: 28, workload: 88 },
  { h: 2, intensity: 26, workload: 85 },
  { h: 3, intensity: 26, workload: 82 },
  { h: 4, intensity: 30, workload: 70 },
  { h: 5, intensity: 38, workload: 50 },
  { h: 6, intensity: 55, workload: 25 },
  { h: 7, intensity: 68, workload: 15 },
  { h: 8, intensity: 72, workload: 12 },
  { h: 9, intensity: 60, workload: 35 },
  { h: 10, intensity: 45, workload: 70 },
  { h: 11, intensity: 32, workload: 92 },
  { h: 12, intensity: 26, workload: 96 },
  { h: 13, intensity: 24, workload: 95 },
  { h: 14, intensity: 25, workload: 90 },
  { h: 15, intensity: 35, workload: 75 },
  { h: 16, intensity: 50, workload: 50 },
  { h: 17, intensity: 65, workload: 28 },
  { h: 18, intensity: 75, workload: 18 },
  { h: 19, intensity: 78, workload: 12 },
  { h: 20, intensity: 70, workload: 15 },
  { h: 21, intensity: 58, workload: 38 },
  { h: 22, intensity: 45, workload: 70 },
  { h: 23, intensity: 38, workload: 82 },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: BG, color: "#dcebd8" }}>
      {/* Thin accent line */}
      <div className="h-[2px] w-full" style={{ backgroundColor: ACCENT }} />

      {/* Nav */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded border" style={{ borderColor: `${ACCENT}55`, backgroundColor: `${ACCENT}11` }}>
              {/* Lightning bolt */}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill={ACCENT}>
                <path d="M13 2L4.09 12.97l7.91.03L9 22l8.91-10.97-7.91-.03L13 2z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-base text-white tracking-wide">
                Tesl<span style={{ color: ACCENT, textShadow: `0 0 8px ${ACCENT}88` }}>.</span>on
              </span>
              <span className="hidden sm:inline text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Reykjavik
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              tesl.on
            </span>
            <Link href="/login" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm border rounded px-3 py-1.5 transition-colors hover:bg-white/5"
              style={{ borderColor: `${ACCENT}55`, color: ACCENT }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-20 pb-12 text-center">
        <h1
          className="font-serif text-6xl sm:text-8xl text-white tracking-tight leading-[1.0]"
          style={{ fontFamily: 'ui-serif, Georgia, serif' }}
        >
          Tesl<span style={{ color: ACCENT, textShadow: `0 0 24px ${ACCENT}66` }}>.</span>on
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-slate-300 font-serif italic max-w-2xl mx-auto leading-snug">
          Route agent workloads by energy cost, not just latency.
        </p>
        <p className="mt-6 text-sm font-mono text-slate-500 tracking-wide">
          From Reykjavik — where 100% of power runs renewable.
        </p>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-3xl px-4 pb-12 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-slate-600 mb-3">
          The problem
        </p>
        <p className="text-2xl font-serif text-white leading-snug">
          AI workloads burn energy blind to where it comes from.
        </p>
      </section>

      {/* World map */}
      <section className="mx-auto max-w-5xl w-full px-4 pb-12">
        <div className="rounded-lg border border-white/10 overflow-hidden" style={{ backgroundColor: "#0f140e" }}>
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5" style={{ backgroundColor: "#0a0e0a" }}>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Carbon-aware routing
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
              shifting traffic to green grids
            </span>
          </div>

          <div className="relative w-full" style={{ paddingBottom: "50%" }}>
            <svg
              viewBox="0 0 100 50"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
            >
              {/* Latitude grid */}
              {[10, 20, 30, 40].map((y) => (
                <line key={`lat-${y}`} x1={0} y1={y * 0.5 + 5} x2={100} y2={y * 0.5 + 5} stroke="#1c2a1c" strokeWidth={0.1} />
              ))}
              {/* Longitude grid */}
              {[20, 40, 60, 80].map((x) => (
                <line key={`lon-${x}`} x1={x} y1={2} x2={x} y2={48} stroke="#1c2a1c" strokeWidth={0.1} />
              ))}

              {/* Animated traffic arcs from red → green */}
              {[
                { from: "us-east-1", to: "us-pdx" },
                { from: "ap-east", to: "is-rkv-1" },
                { from: "in-mum", to: "no-oslo" },
              ].map(({ from, to }, i) => {
                const f = regions.find((r) => r.id === from)!;
                const t = regions.find((r) => r.id === to)!;
                const fx = f.lon;
                const fy = f.lat * 0.5;
                const tx = t.lon;
                const ty = t.lat * 0.5;
                const mx = (fx + tx) / 2;
                const my = Math.min(fy, ty) - 6;
                return (
                  <g key={`arc-${i}`}>
                    <path
                      d={`M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`}
                      stroke={ACCENT}
                      strokeWidth={0.3}
                      fill="none"
                      strokeDasharray="1.5 1"
                      opacity={0.55}
                    >
                      <animate attributeName="stroke-dashoffset" from="0" to="-10" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                    </path>
                  </g>
                );
              })}

              {/* Region dots */}
              {regions.map((r) => {
                const c = regionColor(r.kind);
                const rad = r.kind === "green" ? 0.9 : 0.7;
                return (
                  <g key={r.id}>
                    <circle cx={r.lon} cy={r.lat * 0.5} r={rad + 0.6} fill={c} opacity={0.2} />
                    <circle cx={r.lon} cy={r.lat * 0.5} r={rad} fill={c} />
                  </g>
                );
              })}
            </svg>

            {/* Region labels (HTML overlay for crispness) */}
            <div className="absolute inset-0 pointer-events-none">
              {regions.map((r) => (
                <span
                  key={`label-${r.id}`}
                  className="absolute text-[8px] sm:text-[10px] font-mono whitespace-nowrap"
                  style={{
                    left: `${r.lon}%`,
                    top: `${r.lat}%`,
                    transform: "translate(-50%, 8px)",
                    color: regionColor(r.kind),
                    opacity: 0.85,
                  }}
                >
                  {r.name}
                </span>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-widest">
            <span className="text-slate-500">grid carbon intensity by region</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT, boxShadow: `0 0 4px ${ACCENT}` }} />
                <span className="text-slate-500">renewable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT_WARM }} />
                <span className="text-slate-500">mixed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT_BAD }} />
                <span className="text-slate-500">coal-heavy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Routing decision panel */}
      <section className="mx-auto max-w-4xl w-full px-4 pb-12">
        <div className="rounded-lg border border-white/10 overflow-hidden" style={{ backgroundColor: "#08100a" }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5" style={{ backgroundColor: "#000" }}>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
              routing decision
            </span>
          </div>
          <pre className="text-xs sm:text-sm font-mono p-5 leading-relaxed overflow-x-auto text-slate-300">
            <span className="text-slate-500">Request:</span> <span className="text-white">GPT-4 inference, 8K tokens</span>{"\n"}
            {"\n"}
            <span style={{ color: ACCENT_BAD }}>Latency-only routing:</span>{"  "}us-east-1     <span className="text-slate-500">(340ms, 0.8 kWh,</span> <span style={{ color: ACCENT_BAD }}>coal+gas</span><span className="text-slate-500">)</span>{"\n"}
            <span style={{ color: ACCENT }}>Tesl.on routing:</span>{"        "}is-rkv-1      <span className="text-slate-500">(420ms, 0.8 kWh,</span> <span style={{ color: ACCENT }}>100% geothermal</span><span className="text-slate-500">)</span>{"\n"}
            {"\n"}
            <span className="text-white">Carbon saved:</span> <span style={{ color: ACCENT }}>0.62 kg CO&#8322;</span>{"\n"}
          </pre>
        </div>
      </section>

      {/* 24h carbon-aware schedule */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-slate-600 mb-3 text-center">
            Carbon-aware schedule · 24h
          </p>
          <h2 className="text-center text-2xl sm:text-3xl font-serif text-white mb-10">
            Workloads concentrate during solar &amp; wind peaks.
          </h2>

          <div className="rounded-lg border border-white/10 p-6" style={{ backgroundColor: "#0f140e" }}>
            <div className="flex items-end justify-between gap-[2px] h-40 sm:h-48">
              {hourly.map((slot) => {
                const greenness = 1 - slot.intensity / 100; // 0 to 1
                // interpolate red→amber→green
                const color =
                  slot.intensity < 35
                    ? ACCENT
                    : slot.intensity < 60
                    ? ACCENT_WARM
                    : ACCENT_BAD;
                return (
                  <div key={slot.h} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${slot.workload}%`,
                        backgroundColor: color,
                        opacity: 0.55 + greenness * 0.45,
                        boxShadow: slot.intensity < 35 ? `0 0 8px ${color}55` : "none",
                      }}
                    />
                  </div>
                );
              })}
            </div>
            {/* Hour axis */}
            <div className="mt-2 flex justify-between text-[9px] font-mono text-slate-600 px-[1px]">
              {[0, 6, 12, 18, 23].map((h) => (
                <span key={h} style={{ marginLeft: h === 0 ? 0 : "auto", marginRight: h === 23 ? 0 : "auto" }}>
                  {h.toString().padStart(2, "0")}:00
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
              <span>bar height = workload scheduled · color = grid carbon</span>
              <div className="flex items-center gap-3">
                <span style={{ color: ACCENT }}>low</span>
                <span style={{ color: ACCENT_WARM }}>medium</span>
                <span style={{ color: ACCENT_BAD }}>high</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <div className="grid sm:grid-cols-2 gap-12 text-center">
            <div>
              <p className="font-serif text-5xl text-white tabular-nums" style={{ color: ACCENT }}>47%</p>
              <p className="mt-3 text-xs font-mono uppercase tracking-widest text-slate-500">
                lower carbon per query
              </p>
            </div>
            <div>
              <p className="font-serif text-5xl text-white tabular-nums" style={{ color: ACCENT }}>100%</p>
              <p className="mt-3 text-xs font-mono uppercase tracking-widest text-slate-500">
                energy provenance tracked
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 border-2 rounded px-8 py-4 text-lg font-medium transition-colors hover:bg-white/5"
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            Route your first workload
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-auto">
        <div className="mx-auto flex flex-col sm:flex-row gap-3 sm:gap-0 h-auto sm:h-16 max-w-6xl items-center justify-between px-4 py-4 sm:py-0">
          <div className="flex items-center gap-3 text-xs text-slate-600 font-mono">
            <span style={{ color: ACCENT }}>{appConfig.name}</span>
            <span>·</span>
            <span>Reykjavik</span>
            <span>·</span>
            <span>tesl.on</span>
          </div>
          <a
            href="https://abduljaleel.xyz/aletheia/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-white border border-white/10 rounded px-3 py-1.5 transition-colors hover:border-white/30"
          >
            Part of the Aletheia stack &#8599;
          </a>
        </div>
      </footer>
    </div>
  );
}
