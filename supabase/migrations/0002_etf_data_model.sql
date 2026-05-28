-- ETF-specific data model.
-- Safe to run after 0001_initial_schema.sql. It creates empty tables only.

create table if not exists public.etf_profiles (
  stock_id uuid primary key references public.stocks(id) on delete cascade,
  fund_category text,
  tracking_index text,
  issuer text,
  expense_ratio numeric,
  distribution_frequency text,
  source_name text,
  source_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.etf_daily_metrics (
  stock_id uuid not null references public.stocks(id) on delete cascade,
  trade_date date not null,
  nav numeric,
  premium_discount numeric,
  aum numeric,
  tracking_difference numeric,
  constituent_count integer,
  last_distribution numeric,
  source_name text,
  source_url text,
  created_at timestamptz not null default now(),
  primary key (stock_id, trade_date)
);

create table if not exists public.etf_holdings (
  stock_id uuid not null references public.stocks(id) on delete cascade,
  holding_symbol text not null,
  holding_name text not null,
  holding_country text,
  holding_exchange text,
  weight numeric,
  as_of_date date not null,
  source_name text,
  source_url text,
  created_at timestamptz not null default now(),
  primary key (stock_id, holding_symbol, as_of_date)
);

create index if not exists etf_daily_metrics_trade_date_idx on public.etf_daily_metrics(trade_date desc);
create index if not exists etf_holdings_as_of_date_idx on public.etf_holdings(as_of_date desc);
