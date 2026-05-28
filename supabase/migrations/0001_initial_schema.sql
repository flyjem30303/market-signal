-- Initial schema for Taiwan Market Signal.
-- Target database: PostgreSQL / Supabase.

create extension if not exists "pgcrypto";

create table if not exists public.market_exchanges (
  country text not null,
  exchange text not null,
  name text not null,
  display_name text not null,
  currency text not null,
  timezone text not null,
  locale text not null default 'en-US',
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (country, exchange)
);

create table if not exists public.data_runs (
  id uuid primary key default gen_random_uuid(),
  run_key text not null unique,
  source_name text not null,
  source_url text,
  target_table text not null,
  status text not null check (status in ('success', 'partial', 'failed')),
  row_count integer not null default 0,
  data_start_date date,
  data_end_date date,
  started_at timestamptz not null,
  finished_at timestamptz,
  notes text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stocks (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  name text not null,
  market text not null,
  country text not null default 'TW',
  exchange text not null default 'TWSE',
  currency text not null default 'TWD',
  timezone text not null default 'Asia/Taipei',
  asset_type text not null default 'stock',
  industry text,
  listed_date date,
  is_etf boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (country, exchange) references public.market_exchanges(country, exchange),
  unique (country, exchange, symbol)
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
create index if not exists stocks_country_exchange_symbol_idx on public.stocks(country, exchange, symbol);
create index if not exists market_exchanges_active_idx on public.market_exchanges(is_active, country, exchange);
create index if not exists data_runs_target_table_idx on public.data_runs(target_table, finished_at desc);
