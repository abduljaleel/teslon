import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/lib/config";
import {
  ArrowRight,
  Zap,
  BarChart3,
  Leaf,
  AlertTriangle,
  TrendingUp,
  Monitor,
  ArrowDown,
  Activity,
  DollarSign,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#18181b] text-[#fafafa]">
      {/* Nav */}
      <header className="border-b border-[#3f3f46]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-[#eab308] text-[#18181b] text-sm font-black tracking-tight">
              <Zap className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">{appConfig.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-[#a1a1aa] hover:text-[#fafafa]">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#eab308] text-[#18181b] hover:bg-[#facc15] font-semibold">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#eab308]/5 to-transparent" />
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 px-4 py-1.5 text-sm text-[#eab308] mb-8">
            <Zap className="h-3.5 w-3.5" />
            Energy intelligence platform
          </div>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl leading-[0.95]">
            Tesla, inventor of the
            <span className="text-[#eab308]"> electrical age</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[#a1a1aa] leading-relaxed">
            Turn energy data into decisions. Optimize cost, carbon, and resilience
            across every facility in your portfolio.
          </p>
          <div className="mt-10 flex gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-[#eab308] text-[#18181b] hover:bg-[#facc15] font-semibold px-8">
                Start monitoring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-[#3f3f46] text-[#fafafa] hover:bg-[#27272a]">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Preview - Metric Cards */}
      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-[#3f3f46] bg-[#27272a] p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#a1a1aa] uppercase tracking-wider font-medium">Consumption</span>
                <Activity className="h-5 w-5 text-[#eab308]" />
              </div>
              <div className="text-3xl font-black text-[#fafafa]">45,200</div>
              <div className="text-sm text-[#a1a1aa] mt-1">kWh monitored</div>
              <div className="mt-4 h-1.5 rounded-full bg-[#3f3f46]">
                <div className="h-1.5 rounded-full bg-[#eab308] w-3/4" />
              </div>
            </div>
            <div className="rounded-lg border border-[#3f3f46] bg-[#27272a] p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#a1a1aa] uppercase tracking-wider font-medium">Cost Savings</span>
                <DollarSign className="h-5 w-5 text-[#eab308]" />
              </div>
              <div className="text-3xl font-black text-[#fafafa]">$12,400</div>
              <div className="text-sm text-[#a1a1aa] mt-1">optimized this month</div>
              <div className="mt-4 h-1.5 rounded-full bg-[#3f3f46]">
                <div className="h-1.5 rounded-full bg-[#eab308] w-[85%]" />
              </div>
            </div>
            <div className="rounded-lg border border-[#3f3f46] bg-[#27272a] p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#a1a1aa] uppercase tracking-wider font-medium">Carbon</span>
                <Leaf className="h-5 w-5 text-[#eab308]" />
              </div>
              <div className="text-3xl font-black text-[#fafafa]">18.2</div>
              <div className="text-sm text-[#a1a1aa] mt-1">tons CO2 tracked</div>
              <div className="mt-4 h-1.5 rounded-full bg-[#3f3f46]">
                <div className="h-1.5 rounded-full bg-[#eab308] w-[60%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#3f3f46] bg-[#1c1c1f]">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <h2 className="text-center text-3xl font-black tracking-tight">
            Industrial-grade energy intelligence
          </h2>
          <p className="text-center text-[#a1a1aa] mt-4 max-w-2xl mx-auto">
            Everything you need to monitor, analyze, and optimize energy across your entire portfolio.
          </p>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Monitor,
                title: "Multi-site Monitoring",
                desc: "Real-time visibility into consumption, demand, and power quality across every facility. One dashboard, every meter.",
              },
              {
                icon: TrendingUp,
                title: "Optimization Engine",
                desc: "AI-driven recommendations for load shifting, peak shaving, and demand response. Cut costs without cutting operations.",
              },
              {
                icon: BarChart3,
                title: "Consumption Forecasting",
                desc: "Machine learning models trained on your historical data. Predict demand with precision and plan procurement ahead.",
              },
              {
                icon: AlertTriangle,
                title: "Anomaly Alerts",
                desc: "Instant detection of unusual consumption patterns, equipment faults, and billing discrepancies. Know before it costs you.",
              },
              {
                icon: Leaf,
                title: "Carbon Tracking",
                desc: "Scope 1, 2, and 3 emissions calculated automatically. Audit-ready reporting for ESG compliance and sustainability goals.",
              },
              {
                icon: DollarSign,
                title: "Benchmarking",
                desc: "Compare facility performance against industry standards and your own portfolio. Find the outliers, fix the gaps.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-[#3f3f46] bg-[#27272a] p-6 hover:border-[#eab308]/40 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[#eab308]/10">
                  <feature.icon className="h-5 w-5 text-[#eab308]" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm text-[#a1a1aa] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* From Data to Decisions Flow */}
      <section className="border-t border-[#3f3f46]">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <h2 className="text-center text-3xl font-black tracking-tight">
            From data to decisions
          </h2>
          <p className="text-center text-[#a1a1aa] mt-4 max-w-xl mx-auto">
            A systematic pipeline that transforms raw energy data into measurable savings.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", label: "Monitor", desc: "Connect meters, sensors, and utility feeds", icon: Monitor },
              { step: "02", label: "Analyze", desc: "Pattern recognition across time and sites", icon: BarChart3 },
              { step: "03", label: "Optimize", desc: "AI recommendations for cost and carbon", icon: TrendingUp },
              { step: "04", label: "Save", desc: "Measurable reductions in spend and emissions", icon: DollarSign },
            ].map((item, i) => (
              <div key={item.step} className="text-center relative">
                <div className="flex flex-col items-center">
                  <div className="text-xs font-mono text-[#eab308] mb-3">{item.step}</div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#eab308]/30 bg-[#eab308]/10 mb-4">
                    <item.icon className="h-6 w-6 text-[#eab308]" />
                  </div>
                  <h3 className="font-bold text-lg">{item.label}</h3>
                  <p className="text-sm text-[#a1a1aa] mt-2">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 -right-3">
                    <ArrowRight className="h-5 w-5 text-[#3f3f46]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-t border-[#3f3f46] bg-[#eab308]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-black text-[#18181b]">45,200 kWh</div>
              <div className="text-sm text-[#18181b]/70 mt-1 font-medium">monitored</div>
            </div>
            <div>
              <div className="text-3xl font-black text-[#18181b]">$12,400</div>
              <div className="text-sm text-[#18181b]/70 mt-1 font-medium">optimized</div>
            </div>
            <div>
              <div className="text-3xl font-black text-[#18181b]">18.2 tons</div>
              <div className="text-sm text-[#18181b]/70 mt-1 font-medium">CO2 tracked</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#3f3f46]">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="text-3xl font-black tracking-tight">Ready to take control of your energy?</h2>
          <p className="mt-4 text-lg text-[#a1a1aa]">
            Join operators already using {appConfig.name} to cut costs and carbon.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg" className="bg-[#eab308] text-[#18181b] hover:bg-[#facc15] font-semibold px-8">
              Start free trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#3f3f46]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-sm text-[#a1a1aa]">
          <span>&copy; {new Date().getFullYear()} {appConfig.name}. All rights reserved.</span>
          <span>A 12 Cities venture</span>
        </div>
      </footer>
    </div>
  );
}
