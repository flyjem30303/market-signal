-- Initial schema for Taiwan Market Signal.
-- Target database: PostgreSQL / Supabase.

create extension if not exists "pgcrypto";

create table if not exists public.stocks (
  id uuid primary key default gen_random_uuid(),
  symbol text not null unique,
  name text not null,
  market text not null,
  industry text,
  listed_date date,
  is_etf boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_prices (
  stock_id uuid not null references public.stocks(id) on delete cascade,
  trade_date date not null,
  open numeric,
  high numeric,
  low numeric,
  close numeric,
  volume numeric,
  turnover numeric,
  created_at timestamptz not null default now(),
  primary key (stock_id, trade_date)
);

create table if not exists public.daily_fundamentals (
  stock_id uuid not null references public.stocks(id) on delete cascade,
  trade_date date not null,
  pe numeric,
  pb numeric,
  dividend_yield numeric,
  revenue_yoy numeric,
  eps_ttm numeric,
  created_at timestamptz not null default now(),
  primary key (stock_id, trade_date)
);

create table if not exists public.daily_flows (
  stock_id uuid not null references public.stocks(id) on delete cascade,
  trade_date date not null,
  foreign_net_buy numeric,
  investment_trust_net_buy numeric,
  dealer_net_buy numeric,
  margin_balance numeric,
  short_balance numeric,
  day_trade_ratio numeric,
  created_at timestamptz not null default now(),
  primary key (stock_id, trade_date)
);

create table if not exists public.daily_scores (
  stock_id uuid not null references public.stocks(id) on delete cascade,
  trade_date date not null,
  health_score integer not null check (health_score between 0 and 100),
  risk_score integer not null check (risk_score between 0 and 100),
  composite_score integer not null check (composite_score between 0 and 100),
  data_quality_score integer not null default 0 check (data_quality_score between 0 and 100),
  data_quality_grade text not null default 'D' check (data_quality_grade in ('A', 'B', 'C', 'D')),
  stale_data_flags text[] not null default '{}',
  missing_module_flags text[] not null default '{}',
  signal text not null check (signal in ('green', 'yellow', 'orange', 'red', 'deep-red')),
  model_version text not null,
  last_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (stock_id, trade_date, model_version)
);

create table if not exists public.score_modules (
  stock_id uuid not null references public.stocks(id) on delete cascade,
  trade_date date not null,
  module_key text not null,
  health integer not null check (health between 0 and 100),
  risk integer not null check (risk between 0 and 100),
  weight numeric not null,
  model_version text not null,
  created_at timestamptz not null default now(),
  primary key (stock_id, trade_date, module_key, model_version)
);

create table if not exists public.news_items (
  id uuid primary key default gen_random_uuid(),
  published_at timestamptz not null,
  source text not null,
  title text not null,
  summary text,
  url text,
  category text not null,
  impact_score integer not null check (impact_score between -3 and 3),
  created_at timestamptz not null default now()
);

create table if not exists public.stock_news (
  stock_id uuid not null references public.stocks(id) on delete cascade,
  news_id uuid not null references public.news_items(id) on delete cascade,
  relevance_score numeric not null default 1,
  primary key (stock_id, news_id)
);

create table if not exists public.profiles (
  id uuid primary key,
  email text unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  stock_id uuid not null references public.stocks(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, stock_id)
);

create index if not exists daily_scores_trade_date_idx on public.daily_scores(trade_date desc);
create index if not exists daily_prices_trade_date_idx on public.daily_prices(trade_date desc);
create index if not exists news_items_published_at_idx on public.news_items(published_at desc);
create index if not exists stocks_market_industry_idx on public.stocks(market, industry);
