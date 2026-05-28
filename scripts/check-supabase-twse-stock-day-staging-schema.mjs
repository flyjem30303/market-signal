import fs from "node:fs";

const migrationPath = "supabase/migrations/0003_twse_stock_day_staging.sql";

const migration = fs.existsSync(migrationPath) ? fs.readFileSync(migrationPath, "utf8") : "";
const normalized = migration.toLowerCase();

const requiredPhrases = [
  "candidate draft only",
  "create table if not exists public.staging_twse_stock_day_runs",
  "create table if not exists public.staging_twse_stock_day_prices",
  "run_id uuid primary key",
  "run_type text not null default 'staging_candidate'",
  "source_id text not null default 'twse-stock-day'",
  "review_status text not null default 'draft'",
  "decision text not null",
  "source_url_template text not null",
  "license_url text not null",
  "attribution_text text not null",
  "http_status_summary jsonb",
  "rate_limit_policy jsonb",
  "run_id uuid not null references public.staging_twse_stock_day_runs",
  "exchange_code text not null default 'twse'",
  "symbol text not null",
  "trade_date date not null",
  "open_price numeric not null",
  "high_price numeric not null",
  "low_price numeric not null",
  "close_price numeric not null",
  "source_row_hash text not null",
  "primary key (run_id, exchange_code, symbol, trade_date)",
  "alter table public.staging_twse_stock_day_runs enable row level security",
  "alter table public.staging_twse_stock_day_prices enable row level security",
  "create index if not exists staging_twse_stock_day_runs_created_at_idx",
  "create index if not exists staging_twse_stock_day_prices_symbol_trade_date_idx"
];

const forbiddenPhrases = [
  "insert into",
  "upsert",
  "delete from",
  "truncate",
  "drop table",
  "alter table public.daily_prices",
  "create table if not exists public.daily_prices",
  "alter table public.stocks",
  "alter table public.markets",
  "alter table public.data_runs",
  "create table if not exists public.model",
  "@supabase/supabase-js",
  "createclient",
  "supabase_service_role_key"
];

const createTableMatches = [...normalized.matchAll(/create\s+table\s+if\s+not\s+exists\s+public\.([a-z0-9_]+)/g)].map(
  (match) => match[1]
);
const allowedTables = new Set(["staging_twse_stock_day_runs", "staging_twse_stock_day_prices"]);
const unexpectedTables = createTableMatches.filter((table) => !allowedTables.has(table));
const missing = requiredPhrases.filter((phrase) => !normalized.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => normalized.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      migration: migrationPath,
      status: missing.length === 0 && forbidden.length === 0 && unexpectedTables.length === 0 ? "ok" : "blocked",
      unexpected_tables: unexpectedTables
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0 || unexpectedTables.length > 0) {
  process.exitCode = 1;
}
