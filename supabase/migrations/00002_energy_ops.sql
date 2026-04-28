-- tesl-on: Energy operations and optimization tables
-- Migration: 00002_energy_ops

-- Sites
create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  address text,
  site_type text not null check (site_type in ('office', 'factory', 'datacenter', 'retail')),
  grid_region text,
  timezone text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sites enable row level security;

create policy "Users can view sites in their org"
  on public.sites for select
  using (org_id in (select org_id from public.profiles where user_id = auth.uid()));

create policy "Users can insert sites in their org"
  on public.sites for insert
  with check (org_id in (select org_id from public.profiles where user_id = auth.uid()));

create policy "Users can update sites in their org"
  on public.sites for update
  using (org_id in (select org_id from public.profiles where user_id = auth.uid()));

create policy "Users can delete sites in their org"
  on public.sites for delete
  using (org_id in (select org_id from public.profiles where user_id = auth.uid()));

-- Consumption Data
create table if not exists public.consumption_data (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  source text not null check (source in ('grid', 'solar', 'battery', 'generator')),
  timestamp timestamptz not null,
  kwh numeric not null,
  cost_cents int,
  carbon_kg numeric,
  interval_minutes int,
  created_at timestamptz not null default now()
);

alter table public.consumption_data enable row level security;

create policy "Users can view consumption data via site org"
  on public.consumption_data for select
  using (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can insert consumption data via site org"
  on public.consumption_data for insert
  with check (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can update consumption data via site org"
  on public.consumption_data for update
  using (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can delete consumption data via site org"
  on public.consumption_data for delete
  using (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

-- Optimization Plans
create table if not exists public.optimization_plans (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  plan_type text not null check (plan_type in ('cost', 'carbon', 'resilience')),
  status text,
  recommendations jsonb,
  projected_savings_cents int,
  projected_carbon_reduction_kg numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.optimization_plans enable row level security;

create policy "Users can view optimization plans via site org"
  on public.optimization_plans for select
  using (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can insert optimization plans via site org"
  on public.optimization_plans for insert
  with check (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can update optimization plans via site org"
  on public.optimization_plans for update
  using (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can delete optimization plans via site org"
  on public.optimization_plans for delete
  using (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

-- Alerts
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  alert_type text,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  message text,
  triggered_at timestamptz not null default now(),
  acknowledged_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.alerts enable row level security;

create policy "Users can view alerts via site org"
  on public.alerts for select
  using (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can insert alerts via site org"
  on public.alerts for insert
  with check (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can update alerts via site org"
  on public.alerts for update
  using (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can delete alerts via site org"
  on public.alerts for delete
  using (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

-- Benchmarks
create table if not exists public.benchmarks (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  period text,
  kwh_per_sqft numeric,
  cost_per_kwh numeric,
  carbon_intensity numeric,
  peer_percentile int,
  created_at timestamptz not null default now()
);

alter table public.benchmarks enable row level security;

create policy "Users can view benchmarks via site org"
  on public.benchmarks for select
  using (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can insert benchmarks via site org"
  on public.benchmarks for insert
  with check (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can update benchmarks via site org"
  on public.benchmarks for update
  using (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));

create policy "Users can delete benchmarks via site org"
  on public.benchmarks for delete
  using (site_id in (
    select id from public.sites where org_id in (
      select org_id from public.profiles where user_id = auth.uid()
    )
  ));
