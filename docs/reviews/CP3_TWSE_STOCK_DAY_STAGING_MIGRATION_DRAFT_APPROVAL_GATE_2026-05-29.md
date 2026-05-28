# CP3 TWSE Stock Day Staging Migration Draft Approval Gate

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: Staging migration implementation plan role review completed

Status: CEO migration draft approval gate recorded

## CEO Decision

```text
PROCEED
```

CEO approves creating a candidate migration draft file and a static schema
checker in the next slice only. This approval does not approve SQL execution,
Supabase writes, staging writes, `daily_prices` writes, seed SQL, raw market
data storage, ingestion jobs, or public `scoreSource=real`.

## Evidence

```text
docs/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_IMPLEMENTATION_PLAN_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_IMPLEMENTATION_PLAN_ROLE_REVIEW_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_REVIEW_CHECKLIST_2026-05-29.md
```

Accepted technical evidence:

```text
source_id: twse-stock-day
symbol: 2330
requested_months: 39
successful_months: 39
total_parsed_row_count: 787
duplicate_trade_dates: 0
missing_required_field_count: 0
parser_flag_count: 0
decision: ready_for_review
```

## Approved Next Slice

```text
create candidate migration draft file
create static schema checker
update package script for static checker
update review gate aggregator
update file manifest and checkpoint list
do not execute SQL
do not connect to Supabase
do not write market rows
```

Approved candidate files:

```text
supabase/migrations/0003_twse_stock_day_staging.sql
scripts/check-supabase-twse-stock-day-staging-schema.mjs
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_DRAFT_REVIEW_2026-05-29.md
```

## Non-Negotiable Guardrails

```text
draft approval only
no SQL execution
no Supabase writes
no staging writes
no daily_prices writes
no seed SQL
no raw market rows stored
no CSV / JSON market data files
no scoreSource=real
no public backtest claims
CP3 source-depth production gate remains not_ready
Keep public data source mock
CEO approval required before running migration
```

## Migration Draft Constraints

The candidate migration draft may define only:

```text
staging_twse_stock_day_runs
staging_twse_stock_day_prices
staging table RLS posture
staging review indexes
staging candidate row constraints
```

The candidate migration draft must not modify:

```text
daily_prices
stocks
markets
data_runs
model score tables
public routes
repository switching
seed market data
raw market data files
```

## Static Checker Requirements

The static checker must:

```text
read the migration draft file from disk
confirm staging_twse_stock_day_runs exists
confirm staging_twse_stock_day_prices exists
confirm RLS posture exists
confirm no daily_prices modification exists
confirm no seed SQL exists
confirm no data insert exists
confirm no Supabase client code exists
return JSON status
```

The static checker must not:

```text
connect to Supabase
use SUPABASE_SERVICE_ROLE_KEY
run SQL
write database rows
write market data files
```

## Role Conditions

A / PM+Dev:

```text
May draft migration and static checker only. Must not run migration.
```

B / Marketing:

```text
No public messaging change.
```

C / Investment:

```text
No backtest or model claim can use draft staging tables.
```

D / Legal:

```text
Must review draft before SQL execution approval.
```

E / CEO:

```text
Approves draft creation only. Execution remains separately gated.
```

F / Design:

```text
No UI change. Future review UI remains internal and token-gated.
```

## Next Implementation Slice

```text
create TWSE STOCK_DAY staging migration draft and static checker
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
