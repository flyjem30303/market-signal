# CP3 TWSE Stock Day Staging Read-Only Validation Script Design

Status: design only

Date: 2026-05-29

Purpose:

- Design a future read-only validation script for TWSE `STOCK_DAY` staging
  tables.
- Define read-only checks and report output after a separately approved
  migration execution.
- Avoid creating any database-connected script in this slice.

## CEO Decision

```text
REVISE
```

This design is approved for documentation only. It does not approve connecting
to Supabase, running SQL, reading remote database state, writing Supabase,
writing staging rows, writing `daily_prices`, creating seed SQL, or committing
raw market data.

## Inputs

```text
docs/CP3_TWSE_STOCK_DAY_STAGING_POST_MIGRATION_VALIDATION_ROLLBACK_PLAN_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_EXECUTION_READINESS_2026-05-29.md
supabase/migrations/0003_twse_stock_day_staging.sql
```

## Non-Negotiable Guardrails

```text
design only
do not create database-connected script
do not connect to Supabase
do not run SQL
do not write Supabase
do not write staging rows
do not write daily_prices
do not create seed SQL
do not store raw market rows
do not commit CSV / JSON market data files
do not set scoreSource=real
do not make public backtest claims
CP3 source-depth production gate remains not_ready
Keep public data source mock
```

## Future Candidate Script

Future candidate file name only:

```text
scripts/validate-supabase-twse-stock-day-staging-readonly.mjs
```

This file must not be created until a separate CEO gate approves read-only
remote validation.

## Future Read-Only Checks

If approved later, the script may read only metadata summaries:

```text
staging_twse_stock_day_runs table existence
staging_twse_stock_day_prices table existence
RLS enabled status
index existence summary
constraint existence summary
candidate row count by run_id
review_status distribution
latest run metadata summary
```

It must not output:

```text
raw market rows
daily OHLCV rows
CSV / JSON market data files
full table dumps
user secrets
service role key
```

## Future Output Contract

Future report path:

```text
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_READ_ONLY_VALIDATION_YYYY-MM-DD.md
```

Future report fields:

```text
status
environment label
table existence summary
RLS summary
index summary
constraint summary
candidate row count summary
production table untouched assertion
public data source assertion
decision: blocked / ready_for_review
```

## Safety Requirements

```text
read-only client configuration only
no insert
no upsert
no delete
no update
no rpc mutation
no raw SQL execution
no service role unless D and E approve usage
fail closed if env vars are missing
fail closed if target URL is not explicitly confirmed
```

## Role Review

A / PM+Dev:

```text
May design the read-only validator, but must not create the database-connected
script until the read-only validation gate approves it.
```

D / Legal:

```text
Must approve whether remote metadata reads are allowed and whether service role
usage is appropriate.
```

E / CEO:

```text
Execution remains blocked. Read-only remote validation also needs a separate
approval gate because it touches external database state.
```

## Next Implementation Slice

```text
record CEO read-only validation script approval gate
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
