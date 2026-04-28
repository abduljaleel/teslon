import Link from "next/link";
import { appConfig } from "@/lib/config";

export default function LandingPage() {
  const sites = [
    { name: "HQ Sydney", status: "green", power: "12.4 kW", bars: [60, 80, 45, 70] },
    { name: "DC Mumbai", status: "green", power: "34.8 kW", bars: [90, 75, 85, 80] },
    { name: "Plant Berlin", status: "yellow", power: "8.1 kW", bars: [40, 55, 30, 65] },
    { name: "Depot Lagos", status: "green", power: "5.7 kW", bars: [50, 60, 70, 45] },
  ];

  return (
    <div className="relative flex min-h-screen flex-col text-gray-300" style={{ backgroundColor: '#111111' }}>
      {/* Circuit board background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <line x1="0" y1="40" x2="80" y2="40" stroke="#1a1a1a" strokeWidth="0.5" />
              <line x1="40" y1="0" x2="40" y2="80" stroke="#1a1a1a" strokeWidth="0.5" />
              <circle cx="40" cy="40" r="2" fill="#1a1a1a" />
              <circle cx="0" cy="0" r="1.5" fill="#1a1a1a" />
              <circle cx="80" cy="0" r="1.5" fill="#1a1a1a" />
              <circle cx="0" cy="80" r="1.5" fill="#1a1a1a" />
              <circle cx="80" cy="80" r="1.5" fill="#1a1a1a" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Nav */}
        <header style={{ borderBottom: '1px solid #222' }}>
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
            <span className="font-bold text-sm tracking-[0.3em] uppercase" style={{ color: '#eab308' }}>
              {appConfig.name}
            </span>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#eab308', color: '#111' }}
              >
                Get started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="flex flex-col items-center pt-28 pb-20 px-6 text-center">
          <h1
            className="text-5xl sm:text-7xl font-bold tracking-[0.2em] uppercase"
            style={{ color: '#fafafa', fontFamily: 'system-ui, -apple-system, sans-serif', fontStretch: 'condensed' }}
          >
            TESL.ON
          </h1>

          {/* Power meter bar */}
          <div className="mt-10 w-full max-w-lg">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-500 uppercase tracking-widest">System Optimization</span>
              <span style={{ color: '#eab308' }} className="font-mono">78%</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#222' }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: '78%', backgroundColor: '#eab308' }}
              />
            </div>
          </div>

          <p className="mt-8 text-lg text-gray-500 font-light">Turn energy data into savings.</p>
        </section>

        {/* Live Dashboard Mockup — Industrial Gauges */}
        <section className="mx-auto max-w-4xl w-full px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gauge 1: Consumption — circular arc */}
            <div className="rounded-lg p-6 text-center" style={{ border: '1px solid #222', backgroundColor: '#161616' }}>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Consumption</p>
              <div className="relative mx-auto" style={{ width: '140px', height: '80px' }}>
                <svg viewBox="0 0 140 80" className="w-full h-full">
                  {/* Background arc */}
                  <path
                    d="M 15 75 A 55 55 0 0 1 125 75"
                    fill="none"
                    stroke="#222"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Filled arc */}
                  <path
                    d="M 15 75 A 55 55 0 0 1 125 75"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="173"
                    strokeDashoffset="43"
                  />
                </svg>
              </div>
              <p className="text-3xl font-light mt-2" style={{ color: '#eab308', fontVariantNumeric: 'tabular-nums' }}>45,200</p>
              <p className="text-xs text-gray-500 mt-1">kWh</p>
            </div>

            {/* Gauge 2: Cost Savings — horizontal bar */}
            <div className="rounded-lg p-6 text-center" style={{ border: '1px solid #222', backgroundColor: '#161616' }}>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Cost Savings</p>
              <div className="mt-6">
                <p className="text-3xl font-light" style={{ color: '#eab308', fontVariantNumeric: 'tabular-nums' }}>$12,400</p>
                <div className="mt-4 w-full h-3 rounded" style={{ backgroundColor: '#222' }}>
                  <div className="h-3 rounded" style={{ width: '85%', backgroundColor: '#eab308' }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">optimized this quarter</p>
              </div>
            </div>

            {/* Gauge 3: Carbon Reduced — with down arrow */}
            <div className="rounded-lg p-6 text-center" style={{ border: '1px solid #222', backgroundColor: '#161616' }}>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Carbon Reduced</p>
              <div className="flex items-center justify-center mt-4 gap-3">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 4 L14 24 M8 18 L14 24 L20 18" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-3xl font-light" style={{ color: '#eab308', fontVariantNumeric: 'tabular-nums' }}>18.2</span>
              </div>
              <p className="text-xs text-gray-500 mt-3">tons CO&#8322;</p>
            </div>
          </div>
        </section>

        {/* Site Grid */}
        <section className="mx-auto max-w-4xl w-full px-6 pb-20">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">Monitored Sites</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sites.map((site) => (
              <div
                key={site.name}
                className="rounded-lg p-4"
                style={{ border: '1px solid #222', backgroundColor: '#161616' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: site.status === "green" ? "#22c55e" : "#eab308",
                      boxShadow: site.status === "green" ? "0 0 6px #22c55e" : "0 0 6px #eab308",
                    }}
                  />
                  <span className="text-xs font-medium text-gray-300">{site.name}</span>
                </div>
                <p className="text-lg font-light" style={{ color: '#eab308', fontVariantNumeric: 'tabular-nums' }}>
                  {site.power}
                </p>
                {/* Mini sparkline */}
                <div className="flex items-end gap-1 mt-3 h-5">
                  {site.bars.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        backgroundColor: '#eab308',
                        opacity: 0.5 + (i * 0.15),
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center pb-24 px-6">
          <Link
            href="/signup"
            className="inline-flex items-center rounded-full px-10 py-4 text-lg font-semibold transition-colors"
            style={{ backgroundColor: '#eab308', color: '#111' }}
          >
            Connect your first site &rarr;
          </Link>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #222' }}>
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 text-xs text-gray-600">
            <span>&copy; {new Date().getFullYear()} {appConfig.name}</span>
            <span>A 12 Cities venture</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
