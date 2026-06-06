import Link from "next/link";
import { appConfig } from "@/lib/config";

/* ────────────────────────────────────────────────────────────────────────
   TESL.ON — THE BLUEPRINT ARCHETYPE
   The whole page is an electrical-engineering schematic sheet: grid paper,
   drafting title block, right-angle traces, reference numbers, a BOM table.
   The SCHEMATIC DIAGRAM is the hero — not a headline.
   ──────────────────────────────────────────────────────────────────────── */

const BG = "#0c1a2b"; // deep blueprint blue
const INK = "#cfe6ff"; // cyan/white drafting line-work
const CYAN = "#5cc8ff";
const GREEN = "#7be870"; // energy-green "clean"
const AMBER = "#e0b050";
const RED = "#e87070";

/* Blueprint grid overlay — fine lines via repeating-linear-gradient */
const blueprintGrid: React.CSSProperties = {
  backgroundColor: BG,
  backgroundImage: `
    repeating-linear-gradient(0deg, rgba(92,200,255,0.07) 0px, rgba(92,200,255,0.07) 1px, transparent 1px, transparent 28px),
    repeating-linear-gradient(90deg, rgba(92,200,255,0.07) 0px, rgba(92,200,255,0.07) 1px, transparent 1px, transparent 28px),
    repeating-linear-gradient(0deg, rgba(92,200,255,0.04) 0px, rgba(92,200,255,0.04) 1px, transparent 1px, transparent 7px),
    repeating-linear-gradient(90deg, rgba(92,200,255,0.04) 0px, rgba(92,200,255,0.04) 1px, transparent 1px, transparent 7px)
  `,
};

/* Routing destinations for the schematic */
interface RegionNode {
  ref: string;
  name: string;
  source: string;
  status: "clean" | "mixed" | "dirty";
  y: number; // vertical position in the schematic (SVG units)
}
const destinations: RegionNode[] = [
  { ref: "N1", name: "REYKJAVIK", source: "geothermal", status: "clean", y: 18 },
  { ref: "N2", name: "OSLO", source: "hydro", status: "clean", y: 38 },
  { ref: "N3", name: "MUMBAI", source: "mixed grid", status: "mixed", y: 58 },
  { ref: "N4", name: "VIRGINIA", source: "coal", status: "dirty", y: 78 },
];

function statusColor(s: RegionNode["status"]) {
  if (s === "clean") return GREEN;
  if (s === "mixed") return AMBER;
  return RED;
}
function statusGlyph(s: RegionNode["status"]) {
  if (s === "clean") return "✓";
  if (s === "mixed") return "~";
  return "✗";
}

/* 24h carbon-aware schedule — intensity low = clean trough; workload snaps to troughs */
const schedule = [
  { h: 0, gco2: 30, load: 88 },
  { h: 1, gco2: 27, load: 92 },
  { h: 2, gco2: 24, load: 95 },
  { h: 3, gco2: 25, load: 90 },
  { h: 4, gco2: 31, load: 70 },
  { h: 5, gco2: 42, load: 44 },
  { h: 6, gco2: 58, load: 22 },
  { h: 7, gco2: 70, load: 12 },
  { h: 8, gco2: 74, load: 10 },
  { h: 9, gco2: 60, load: 30 },
  { h: 10, gco2: 44, load: 64 },
  { h: 11, gco2: 30, load: 90 },
  { h: 12, gco2: 24, load: 96 },
  { h: 13, gco2: 23, load: 95 },
  { h: 14, gco2: 26, load: 88 },
  { h: 15, gco2: 36, load: 70 },
  { h: 16, gco2: 52, load: 42 },
  { h: 17, gco2: 66, load: 24 },
  { h: 18, gco2: 76, load: 14 },
  { h: 19, gco2: 78, load: 10 },
  { h: 20, gco2: 68, load: 16 },
  { h: 21, gco2: 54, load: 36 },
  { h: 22, gco2: 42, load: 66 },
  { h: 23, gco2: 35, load: 82 },
];

/* BOM / specs rows */
const bom = [
  { item: "01", spec: "Carbon per query", val: "47% lower", note: "vs latency-only" },
  { item: "02", spec: "Energy provenance", val: "100% tracked", note: "per request" },
  { item: "03", spec: "Renewable regions", val: "04 active", note: "geo · hydro" },
  { item: "04", spec: "Routing overhead", val: "+80 ms", note: "p50 add-on" },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen font-mono"
      style={{ ...blueprintGrid, color: INK }}
    >
      {/* Outer drafting border frame */}
      <div className="min-h-screen p-2 sm:p-4">
        <div
          className="relative min-h-[calc(100vh-1rem)] border-2"
          style={{ borderColor: `${CYAN}66` }}
        >
          {/* corner tick marks (drafting registration) */}
          <Corner pos="top-0 left-0" />
          <Corner pos="top-0 right-0" />
          <Corner pos="bottom-0 left-0" />
          <Corner pos="bottom-0 right-0" />

          {/* ══ HEADER STRIP ══ city + drawing id, thin-ruled */}
          <header
            className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2"
            style={{ borderColor: `${CYAN}44` }}
          >
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-bold tracking-[0.25em] uppercase" style={{ color: INK }}>
                TESL<span style={{ color: GREEN }}>·</span>ON
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: CYAN }}>
                Reykjavik 🇮🇸 · 64°N · 100% renewable grid
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
              <Link
                href="/login"
                className="border px-2.5 py-1 transition-colors hover:bg-white/5"
                style={{ borderColor: `${CYAN}55`, color: INK }}
              >
                ▭ sign in
              </Link>
              <Link
                href="/signup"
                className="border px-2.5 py-1 font-bold transition-colors hover:opacity-90"
                style={{ borderColor: GREEN, color: BG, backgroundColor: GREEN }}
              >
                ▣ get started
              </Link>
            </div>
          </header>

          {/* ══════════════════════════════════════════════════════════════
              HERO = SCHEMATIC DIAGRAM — energy routing as a circuit drawing.
              Request source (left) → right-angle traces → region nodes.
              Active trace glows green → Reykjavik.
              ══════════════════════════════════════════════════════════════ */}
          <section className="px-3 py-5 sm:px-6">
            <SheetLabel n="FIG.1" text="ENERGY-AWARE ROUTING SCHEMATIC" />
            <div className="relative w-full" style={{ aspectRatio: "16 / 9", minHeight: 300 }}>
              <svg
                viewBox="0 0 160 90"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* SOURCE node R1 — the request */}
                <g>
                  <rect x="6" y="40" width="26" height="12" fill="none" stroke={CYAN} strokeWidth="0.5" />
                  <text x="19" y="46" textAnchor="middle" fontSize="3.4" fill={INK} fontFamily="monospace">
                    REQUEST
                  </text>
                  <text x="19" y="49.5" textAnchor="middle" fontSize="2.4" fill={CYAN} fontFamily="monospace">
                    in: GPT-4 · 8K tok
                  </text>
                  <text x="6" y="38" fontSize="2.6" fill={GREEN} fontFamily="monospace">R1</text>
                </g>

                {/* ROUTER junction J1 (decision point) */}
                <g>
                  <line x1="32" y1="46" x2="50" y2="46" stroke={CYAN} strokeWidth="0.5" />
                  <rect x="50" y="38" width="16" height="16" fill="none" stroke={CYAN} strokeWidth="0.5" />
                  <text x="58" y="45" textAnchor="middle" fontSize="2.6" fill={INK} fontFamily="monospace">
                    ROUTE
                  </text>
                  <text x="58" y="48.5" textAnchor="middle" fontSize="2.2" fill={CYAN} fontFamily="monospace">
                    by gCO₂
                  </text>
                  <text x="50" y="36" fontSize="2.6" fill={GREEN} fontFamily="monospace">J1</text>
                  <circle cx="58" cy="46" r="0.9" fill={GREEN} />
                </g>

                {/* Right-angle traces from J1 (x=66) to each region node (x=116) */}
                {destinations.map((d) => {
                  const c = statusColor(d.status);
                  const active = d.status === "clean" && d.ref === "N1";
                  const branchX = 84; // vertical bus location
                  return (
                    <g key={d.ref}>
                      {/* horizontal out of router to bus */}
                      <polyline
                        points={`66,46 ${branchX},46 ${branchX},${d.y} 110,${d.y}`}
                        fill="none"
                        stroke={active ? GREEN : `${c}`}
                        strokeWidth={active ? 0.7 : 0.35}
                        strokeOpacity={active ? 1 : 0.55}
                        strokeDasharray={active ? "none" : "1.4 1.2"}
                        style={active ? { filter: `drop-shadow(0 0 2px ${GREEN})` } : undefined}
                      />
                      {/* junction dot on the bus */}
                      <circle cx={branchX} cy={d.y} r="0.8" fill={active ? GREEN : `${c}`} fillOpacity={active ? 1 : 0.6} />
                      {/* node box */}
                      <rect
                        x="110"
                        y={d.y - 5}
                        width="40"
                        height="10"
                        fill={active ? `${GREEN}1a` : "none"}
                        stroke={active ? GREEN : c}
                        strokeWidth={active ? 0.6 : 0.4}
                        strokeOpacity={active ? 1 : 0.7}
                      />
                      <text x="113" y={d.y - 1.4} fontSize="2.9" fill={active ? GREEN : INK} fontFamily="monospace">
                        {d.name}
                      </text>
                      <text x="113" y={d.y + 2.6} fontSize="2.2" fill={c} fontFamily="monospace" fillOpacity={0.85}>
                        {d.source} {statusGlyph(d.status)}
                      </text>
                      <text x="150" y={d.y - 6} textAnchor="end" fontSize="2.4" fill={GREEN} fontFamily="monospace">
                        {d.ref}
                      </text>
                    </g>
                  );
                })}

                {/* callout on the chosen path */}
                <g>
                  <line x1="100" y1="18" x2="100" y2="10" stroke={GREEN} strokeWidth="0.35" />
                  <line x1="100" y1="10" x2="148" y2="10" stroke={GREEN} strokeWidth="0.35" />
                  <text x="148" y="8" textAnchor="end" fontSize="2.6" fill={GREEN} fontFamily="monospace">
                    SELECTED ▸ 340ms · 0.62 kg CO₂ saved · 100% geothermal
                  </text>
                </g>
              </svg>
            </div>

            {/* drafting note block — tagline as a hand-annotated note */}
            <div
              className="mt-4 max-w-xl border-l-2 px-4 py-2"
              style={{ borderColor: GREEN, backgroundColor: `${GREEN}0d` }}
            >
              <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: GREEN }}>
                Note ▸
              </span>{" "}
              <span className="text-[12px]" style={{ color: INK }}>
                energy-per-query treated as a first-class routing signal — route by{" "}
                <span style={{ color: GREEN }}>energy cost</span>, not just latency.
              </span>
            </div>
          </section>

          {/* ══ SECONDARY SCHEMATIC ══ 24h carbon-aware schedule as a waveform */}
          <section className="border-t px-3 py-5 sm:px-6" style={{ borderColor: `${CYAN}33` }}>
            <SheetLabel n="FIG.2" text="CARBON-AWARE SCHEDULE · 24H PROFILE" />
            <div
              className="relative w-full border px-2 pt-3 pb-1"
              style={{ borderColor: `${CYAN}33`, height: 200 }}
            >
              <svg
                viewBox="0 0 240 90"
                preserveAspectRatio="none"
                className="absolute inset-x-2 top-3 bottom-1 h-[calc(100%-1rem)] w-[calc(100%-1rem)]"
              >
                {/* horizontal reference rules */}
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 22.5}
                    x2="240"
                    y2={i * 22.5}
                    stroke={CYAN}
                    strokeOpacity="0.12"
                    strokeWidth="0.3"
                  />
                ))}
                {/* carbon-intensity waveform (the trough line) */}
                <polyline
                  points={schedule
                    .map((s, i) => `${(i / 23) * 240},${(s.gco2 / 100) * 90}`)
                    .join(" ")}
                  fill="none"
                  stroke={CYAN}
                  strokeWidth="0.6"
                  strokeOpacity="0.7"
                  strokeDasharray="2 1.5"
                />
                {/* workload blocks snapped to low-carbon troughs */}
                {schedule.map((s, i) => {
                  const clean = s.gco2 < 34;
                  const col = clean ? GREEN : s.gco2 < 58 ? AMBER : RED;
                  const w = 240 / 24;
                  const h = (s.load / 100) * 88;
                  return (
                    <rect
                      key={s.h}
                      x={i * w + 0.6}
                      y={90 - h}
                      width={w - 1.2}
                      height={h}
                      fill={col}
                      fillOpacity={clean ? 0.55 : 0.22}
                      stroke={col}
                      strokeWidth="0.25"
                      strokeOpacity={clean ? 0.9 : 0.4}
                    />
                  );
                })}
              </svg>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[9px] uppercase tracking-[0.2em]" style={{ color: CYAN }}>
              <span>bar = workload scheduled · dashed = grid carbon intensity</span>
              <div className="flex items-center gap-3">
                <Legend c={GREEN} label="clean trough" />
                <Legend c={AMBER} label="medium" />
                <Legend c={RED} label="peak" />
              </div>
            </div>
            <div className="mt-1 flex justify-between text-[9px]" style={{ color: `${CYAN}99` }}>
              {[0, 6, 12, 18, 23].map((h) => (
                <span key={h} className="tabular-nums">
                  {h.toString().padStart(2, "0")}:00
                </span>
              ))}
            </div>
          </section>

          {/* ══ BOM / SPECS TABLE ══ ruled like a blueprint bill-of-materials */}
          <section className="border-t px-3 py-5 sm:px-6" style={{ borderColor: `${CYAN}33` }}>
            <SheetLabel n="TBL.1" text="BILL OF MATERIALS — PERFORMANCE SPEC" />
            <div className="border" style={{ borderColor: `${CYAN}44` }}>
              <div
                className="grid grid-cols-[2.5rem_1fr_auto] gap-px border-b text-[9px] uppercase tracking-[0.2em] sm:grid-cols-[3rem_1fr_8rem_10rem]"
                style={{ borderColor: `${CYAN}44`, color: CYAN }}
              >
                <Cell head>#</Cell>
                <Cell head>Spec</Cell>
                <Cell head>Value</Cell>
                <Cell head className="hidden sm:block">Note</Cell>
              </div>
              {bom.map((r, i) => (
                <div
                  key={r.item}
                  className="grid grid-cols-[2.5rem_1fr_auto] gap-px text-[12px] sm:grid-cols-[3rem_1fr_8rem_10rem]"
                  style={{
                    borderTop: i === 0 ? "none" : `1px solid ${CYAN}22`,
                  }}
                >
                  <Cell className="tabular-nums" style={{ color: `${CYAN}aa` }}>{r.item}</Cell>
                  <Cell style={{ color: INK }}>{r.spec}</Cell>
                  <Cell className="tabular-nums font-bold" style={{ color: GREEN }}>{r.val}</Cell>
                  <Cell className="hidden text-[10px] sm:block" style={{ color: `${CYAN}99` }}>{r.note}</Cell>
                </div>
              ))}
            </div>
          </section>

          {/* ══ TITLE BLOCK ══ a real drafting corner stamp, bottom-right ══ */}
          <section className="px-3 pb-5 sm:px-6">
            <div className="flex justify-end">
              <div
                className="w-full max-w-sm border text-[10px]"
                style={{ borderColor: CYAN, backgroundColor: `${CYAN}08` }}
              >
                <TBRow label="DWG" value="TESL.ON" valueColor={INK} top />
                <TBRow label="TITLE" value="Energy-aware agent routing" />
                <TBRow label="LOC" value="Reykjavik · 64°N" />
                <TBRow label="REV" value="2026.1" />
                <div className="grid grid-cols-2 border-t" style={{ borderColor: `${CYAN}55` }}>
                  <div className="border-r px-3 py-2" style={{ borderColor: `${CYAN}55` }}>
                    <div className="text-[8px] uppercase tracking-[0.2em]" style={{ color: CYAN }}>Scale</div>
                    <div style={{ color: INK }}>NTS</div>
                  </div>
                  <div className="px-3 py-2">
                    <div className="text-[8px] uppercase tracking-[0.2em]" style={{ color: CYAN }}>Sheet</div>
                    <div style={{ color: INK }}>1 OF 1</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ FOOTER ══ drafting strip ══ */}
          <footer
            className="flex flex-col gap-2 border-t px-4 py-3 text-[10px] sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: `${CYAN}44` }}
          >
            <div className="flex items-center gap-2 uppercase tracking-[0.25em]">
              <span style={{ color: GREEN }}>{appConfig.name}</span>
              <span style={{ color: `${CYAN}66` }}>·</span>
              <span style={{ color: INK }}>Reykjavik</span>
              <span style={{ color: `${CYAN}66` }}>·</span>
              <span style={{ color: `${CYAN}aa` }}>tesl.on</span>
            </div>
            <a
              href="https://abduljaleel.xyz/aletheia/"
              target="_blank"
              rel="noopener noreferrer"
              className="self-start border px-2.5 py-1 uppercase tracking-[0.2em] transition-colors hover:bg-white/5 sm:self-auto"
              style={{ borderColor: `${CYAN}55`, color: INK }}
            >
              Part of the Aletheia stack ↗
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}

/* ── Drafting registration tick at a frame corner ── */
function Corner({ pos }: { pos: string }) {
  return (
    <div className={`pointer-events-none absolute ${pos} h-3 w-3`} style={{ margin: -1 }}>
      <div className="absolute left-0 top-0 h-3 w-px" style={{ backgroundColor: CYAN }} />
      <div className="absolute left-0 top-0 h-px w-3" style={{ backgroundColor: CYAN }} />
    </div>
  );
}

/* ── Figure / table label, drafting style ── */
function SheetLabel({ n, text }: { n: string; text: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span
        className="border px-1.5 py-0.5 text-[9px] font-bold tracking-[0.2em]"
        style={{ borderColor: GREEN, color: GREEN }}
      >
        {n}
      </span>
      <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: CYAN }}>
        {text}
      </span>
      <span className="h-px flex-1" style={{ backgroundColor: `${CYAN}33` }} />
    </div>
  );
}

function Legend({ c, label }: { c: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block h-2 w-2" style={{ backgroundColor: c }} />
      {label}
    </span>
  );
}

function Cell({
  children,
  head,
  className,
  style,
}: {
  children: React.ReactNode;
  head?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`px-3 ${head ? "py-1.5" : "py-2.5"} ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
}

function TBRow({
  label,
  value,
  valueColor,
  top,
}: {
  label: string;
  value: string;
  valueColor?: string;
  top?: boolean;
}) {
  return (
    <div
      className="grid grid-cols-[3.5rem_1fr]"
      style={{ borderTop: top ? "none" : `1px solid ${CYAN}33` }}
    >
      <div
        className="border-r px-3 py-1.5 text-[8px] uppercase tracking-[0.2em]"
        style={{ borderColor: `${CYAN}55`, color: CYAN }}
      >
        {label}
      </div>
      <div className="px-3 py-1.5 font-bold tracking-wide" style={{ color: valueColor ?? GREEN }}>
        {value}
      </div>
    </div>
  );
}
