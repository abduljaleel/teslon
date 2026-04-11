# Tesl.on

**Intelligence for the electrified age.**

Part of the [12 Cities](https://github.com/abduljaleel) venture ecosystem.

## What it does

Tesl.on is an energy intelligence platform that turns consumption data into optimization decisions. Software-first wedge into energy operations — no hardware required.

### Core Features

- **Multi-Site Dashboard** — Portfolio-level view of consumption (kWh), cost, carbon footprint across all monitored sites
- **Site Monitoring** — Hourly consumption charts, source breakdown (grid/solar/battery), and real-time metrics per site
- **Optimization Engine** — Ranked recommendation cards with projected annual savings, implementation difficulty, and ROI timeline
- **Consumption Forecasting** — 7-day projected consumption and cost based on historical patterns
- **Anomaly Alerts** — Configurable alerts for consumption anomalies, threshold breaches, and forecast deviations
- **Benchmarking** — Cross-site comparison on kWh/sqft, cost/kWh, carbon intensity, and peer percentile

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI:** Tailwind CSS v4 + shadcn/ui
- **Auth & Database:** Supabase (Auth, Postgres, RLS)
- **Deployment:** Vercel

## Getting Started

```bash
npm install
cp .env.local.example .env.local
# Add your Supabase URL and anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 12 Cities Role

**Domain:** tesl.on | **Tier:** 3 (Frontier) | **Layer:** Foundations

## License

Private — 12 Cities Venture System
