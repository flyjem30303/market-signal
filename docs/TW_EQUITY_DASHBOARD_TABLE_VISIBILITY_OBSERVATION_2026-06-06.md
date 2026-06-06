# TW Equity Dashboard Table Visibility Observation

Date: 2026-06-06

Status: `tw_equity_dashboard_table_visibility_observation_staging_tables_not_found_in_public_table_list`.

## Observation Scope

The operator-provided Supabase Dashboard session was used for a read-only visual inspection of Database > Tables.

Observed UI state:

- project page: Supabase Dashboard Database Tables;
- selected schema: `public`;
- search query: `staging_twse`;
- search result: `No results found`;
- observed table count under the active search: `0 tables`;
- `staging_twse_stock_day_runs` was not visible in the public table list;
- `staging_twse_stock_day_prices` was not visible in the public table list.

## Local Contract Comparison

Local repository contract still expects both canonical staging tables:

- `supabase/migrations/0003_twse_stock_day_staging.sql` declares `create table if not exists public.staging_twse_stock_day_runs`;
- `supabase/migrations/0003_twse_stock_day_staging.sql` declares `create table if not exists public.staging_twse_stock_day_prices`;
- `scripts/run-tw-equity-staging-write-once.mjs` targets `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices`;
- local candidate and checker contracts use the same target relation set.

The migration file is still marked as a draft that must not be executed until CEO approves migration execution.

## CEO Classification

The latest evidence now points to `remote_staging_tables_missing_or_not_applied`, not a local naming mismatch.

This observation supersedes a broad "table-level permission" hypothesis as the leading route. Permission/RLS may still matter later, but the immediate blocker is that the Dashboard public table list does not show either staging table.

## PM Next Action

Prepare a migration-apply decision packet for `supabase/migrations/0003_twse_stock_day_staging.sql`.

The packet must separate:

- local migration review and exact SQL scope;
- manual Supabase SQL execution steps, if CEO authorizes;
- post-execution schema reload/cache refresh;
- bounded post-migration read-only verification;
- staging write decision, which remains separate and blocked until verification passes.

## Safety Confirmation

- no SQL executed by PM;
- no migration executed by PM;
- no Supabase write attempted;
- no staging rows created;
- no `daily_prices` mutation;
- no market-data fetch or ingestion;
- no raw payloads printed;
- no row payloads printed;
- no secrets printed;
- no public data promotion;
- no row coverage points awarded;
- `publicDataSource=mock`;
- `scoreSource=mock`.
