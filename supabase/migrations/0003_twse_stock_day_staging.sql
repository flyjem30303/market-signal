-- TWSE STOCK_DAY staging migration draft.
-- Candidate draft only. Do not execute until CEO approves migration execution.
-- Scope: empty staging tables, staging constraints, staging indexes, and RLS posture.

create table if not exists public.staging_twse_stock_day_runs (
  run_id uuid primary key,
  run_type text not null default 'staging_candidate' check (run_type = 'staging_candidate'),
  source_id text not null default 'twse-stock-day' check (source_id = 'twse-stock-day'),
  source_url_template text not null,
  license_url text not null,
  attribution_text text not null,
  requested_symbol_count integer not null check (requested_symbol_count >= 1),
  requested_month_count integer not null check (requested_month_count >= 1),
  successful_month_count integer not null check (successful_month_count >= 0),
  failed_month_count integer not null check (failed_month_count >= 0),
  total_candidate_row_count integer not null check (total_candidate_row_count >= 0),
  zero_row_months jsonb not null default '[]'::jsonb,
  duplicate_trade_dates integer not null default 0 check (duplicate_trade_dates >= 0),
  missing_required_field_count integer not null default 0 check (missing_required_field_count >= 0),
  non_numeric_price_count integer not null default 0 check (non_numeric_price_count >= 0),
  non_numeric_volume_amount_count integer not null default 0 check (non_numeric_volume_amount_count >= 0),
  source_note_count integer not null default 0 check (source_note_count >= 0),
  parser_flag_count integer not null default 0 check (parser_flag_count >= 0),
  http_status_summary jsonb not null default '{}'::jsonb,
  rate_limit_policy jsonb not null default '{}'::jsonb,
  started_at timestamptz not null,
  finished_at timestamptz not null,
  created_by text not null,
  created_at timestamptz not null default now(),
  review_status text not null default 'draft' check (review_status in ('draft', 'pending_review', 'approved_for_production', 'rejected')),
  reviewed_by text,
  reviewed_at timestamptz,
  review_notes text,
  decision text not null check (decision in ('blocked', 'ready_for_review', 'approved_for_staging_review')),
  check (finished_at >= started_at),
  check (
    review_status in ('draft', 'pending_review')
    or (reviewed_by is not null and reviewed_at is not null)
  )
);

create table if not exists public.staging_twse_stock_day_prices (
  run_id uuid not null references public.staging_twse_stock_day_runs(run_id) on delete restrict,
  source_id text not null default 'twse-stock-day' check (source_id = 'twse-stock-day'),
  exchange_code text not null default 'TWSE' check (exchange_code = 'TWSE'),
  symbol text not null check (length(trim(symbol)) > 0),
  trade_date date not null,
  open_price numeric not null check (open_price >= 0),
  high_price numeric not null check (high_price >= 0),
  low_price numeric not null check (low_price >= 0),
  close_price numeric not null check (close_price >= 0),
  price_change numeric,
  volume numeric not null check (volume >= 0),
  trade_value numeric not null check (trade_value >= 0),
  transaction_count numeric not null check (transaction_count >= 0),
  note text,
  quality_flags jsonb not null default '[]'::jsonb,
  source_fetched_at timestamptz not null,
  source_row_hash text not null check (length(trim(source_row_hash)) > 0),
  created_at timestamptz not null default now(),
  primary key (run_id, exchange_code, symbol, trade_date),
  check (high_price >= low_price)
);

alter table public.staging_twse_stock_day_runs enable row level security;
alter table public.staging_twse_stock_day_prices enable row level security;

create index if not exists staging_twse_stock_day_runs_created_at_idx
  on public.staging_twse_stock_day_runs(created_at desc);

create index if not exists staging_twse_stock_day_runs_review_status_idx
  on public.staging_twse_stock_day_runs(review_status);

create index if not exists staging_twse_stock_day_runs_source_id_idx
  on public.staging_twse_stock_day_runs(source_id);

create index if not exists staging_twse_stock_day_prices_run_id_idx
  on public.staging_twse_stock_day_prices(run_id);

create index if not exists staging_twse_stock_day_prices_symbol_trade_date_idx
  on public.staging_twse_stock_day_prices(symbol, trade_date desc);

create index if not exists staging_twse_stock_day_prices_source_row_hash_idx
  on public.staging_twse_stock_day_prices(source_row_hash);
