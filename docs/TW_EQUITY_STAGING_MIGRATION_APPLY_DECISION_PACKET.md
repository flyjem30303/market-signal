# TW Equity Staging Migration Apply Decision Packet

Date: 2026-06-07

Status: `tw_equity_staging_migration_apply_decision_packet_ready_for_chairman_or_ceo_execution_approval`.

Decision: `READY_TO_AUTHORIZE_MANUAL_SUPABASE_SQL_EDITOR_EXECUTION_OF_0003_STAGING_MIGRATION`.

## Purpose

This packet converts the Dashboard table visibility evidence into an executable migration decision.

Current evidence shows the public Dashboard table list searched with `staging_twse` returns no staging tables, while the repository migration and write runner both expect:

- `public.staging_twse_stock_day_runs`;
- `public.staging_twse_stock_day_prices`.

CEO classification is `remote_staging_tables_missing_or_not_applied`. The next safe step is to authorize manual Supabase SQL Editor execution of `supabase/migrations/0003_twse_stock_day_staging.sql`, then perform a schema cache reload and bounded read-only verification. This packet does not itself execute SQL.

## Migration Scope

Authorized file, if accepted:

- `supabase/migrations/0003_twse_stock_day_staging.sql`

Expected SQL scope:

- create `public.staging_twse_stock_day_runs` if missing;
- create `public.staging_twse_stock_day_prices` if missing;
- enable row level security on both staging tables;
- create only the indexes declared in the migration file;
- preserve empty staging tables, with no seed data and no production mutation.

The migration uses `create table if not exists` and `create index if not exists`, which makes the intended operation idempotent for table/index creation.

## Manual Execution Steps

If accepted by Chairman/CEO:

1. Open Supabase Dashboard SQL Editor for the current project.
2. Paste only the full contents of `supabase/migrations/0003_twse_stock_day_staging.sql`.
3. Run the SQL once.
4. Run `NOTIFY pgrst, 'reload schema';` once after the migration succeeds.
5. Return to Database > Tables, schema `public`, and search `staging_twse`.
6. Confirm both staging tables appear.
7. Report accepted/rejected outcome back to PM.

## Acceptance Criteria

Accepted only if all are true:

- `staging_twse_stock_day_runs` appears in Supabase Dashboard public table list;
- `staging_twse_stock_day_prices` appears in Supabase Dashboard public table list;
- no data rows were manually inserted by the migration step;
- no production `daily_prices` table was modified;
- no market data was fetched or ingested;
- no secret or raw payload was shared.

## Rejection Criteria

Reject and stop if any are true:

- SQL Editor reports an error that prevents table creation;
- either staging table is still absent after schema reload;
- Dashboard shows a table name mismatch;
- an unexpected production table is changed;
- any data rows are inserted manually by mistake.

## Blocked After Execution Until Separate Verification

Even after successful migration execution:

- no staging write attempt is authorized by this packet;
- no `daily_prices` mutation is authorized;
- no public runtime promotion is authorized;
- no row coverage points are awarded;
- `publicDataSource=mock`;
- `scoreSource=mock`.

The immediate next PM step after accepted execution is a bounded post-migration read-only verification packet and post-run review.

## Rollback Boundary

This packet does not instruct automatic rollback.

If execution is rejected or partial, PM must prepare a separate rollback/repair packet before any further SQL. No destructive SQL should be run from this packet.

## CEO Verdict

Ready for Chairman/CEO approval to execute exactly the `0003_twse_stock_day_staging.sql` migration manually in Supabase SQL Editor, followed by one schema reload. This is the fastest safe route because the leading blocker is missing remote staging tables, not runtime UI, source parsing, or write runner naming.

## Safety Confirmation

- no SQL executed by PM in this packet;
- no migration executed by PM in this packet;
- no Supabase write attempted by PM;
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
