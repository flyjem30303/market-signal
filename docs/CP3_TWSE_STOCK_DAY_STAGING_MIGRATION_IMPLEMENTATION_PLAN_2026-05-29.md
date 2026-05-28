# CP3 TWSE Stock Day Staging Migration Implementation Plan

Status: plan only

Date: 2026-05-29

Purpose:

- Describe a future staging migration package without creating it.
- Name candidate files, rollout order, validation commands, rollback procedure,
  and review owners.
- Preserve all no-write, no-SQL, no-Supabase, and no-public-real-score
  guardrails.

## CEO Decision

```text
REVISE
```

The project may document the future migration implementation plan. It is not
approved to create the migration file, run SQL, write Supabase, create staging
tables, create seed SQL, ingest market rows, or switch public scoring.

## Inputs

```text
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_ROLE_REVIEW_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_REVIEW_CHECKLIST_2026-05-29.md
docs/CP3_TWSE_STOCK_DAY_STAGING_SQL_DESIGN_2026-05-29.md
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

## Non-Negotiable Guardrails

```text
plan only
no migration file
no SQL code block
no Supabase writes
no staging writes
no daily_prices writes
no seed SQL
no table creation
no raw market rows stored
no CSV / JSON market data files
no scoreSource=real
no public backtest claims
CP3 source-depth production gate remains not_ready
Keep public data source mock
CEO approval required before migration implementation
```

## Candidate Files To Create Later

These are future candidate file names only. They must not be created until a
separate CEO approval explicitly authorizes migration implementation.

```text
supabase/migrations/0003_twse_stock_day_staging.sql
scripts/check-supabase-twse-stock-day-staging-schema.mjs
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_IMPLEMENTATION_REVIEW_2026-05-29.md
```

Files that must not be created in this plan slice:

```text
supabase/migrations/0003_twse_stock_day_staging.sql
supabase/seed/*twse*stock*day*.sql
data/raw/*
data/market/*
```

## Future Migration Scope

If approved later, the migration package may only define:

```text
staging_twse_stock_day_runs
staging_twse_stock_day_prices
RLS posture for staging tables
review and cleanup indexes
candidate row quality constraints
```

The migration package must not modify:

```text
daily_prices
stocks
markets
data_runs
model score tables
public routes
repository switching
seed market data
```

## Rollout Order

Future rollout sequence:

```text
1. CEO confirms migration implementation approval.
2. D confirms legal approval for staging storage and derived-use boundary.
3. A drafts migration file in a branch.
4. A drafts schema checker without writing market rows.
5. A runs local/static validation only.
6. D and A review RLS policy text.
7. E approves or rejects migration execution.
8. Only after E approval can the migration be run in Supabase.
```

## Validation Commands To Prepare Later

Future validation commands, not to be run as SQL in this plan slice:

```text
npm run check:cp3-twse-stock-day-staging-migration-review-checklist
npm run check:cp3-twse-stock-day-staging-migration-role-review
npm run check:review-gates
npm run db:preflight
npm run db:validate
```

Future command to add only after migration implementation approval:

```text
npm run db:twse-stock-day-staging-schema
```

## Rollback Procedure To Prepare Later

Future rollback design must be non-destructive by default:

```text
dry-run rollback count first
rollback scoped by run_id only
candidate row cleanup never touches daily_prices
production tables are never cascade targets
run metadata is preserved unless CEO approves full purge
rollback output records affected staging row count
```

Rollback commands must not exist until implementation approval:

```text
no cleanup command in this plan slice
no delete command in this plan slice
no destructive SQL in this plan slice
```

## Review Owners

```text
A / PM+Dev: migration file, checker, local validation, rollback draft
B / Marketing: public copy remains unchanged
C / Investment: backtest and model-use limitations remain blocked
D / Legal: attribution, storage, derived use, service role, RLS, retention
E / CEO: final migration implementation and execution approval
F / Design: no public UI dependency; future internal review UI remains gated
```

## Approval Gates

Migration implementation remains blocked until all are true:

```text
CEO approval recorded for migration implementation
D legal approval recorded for staging storage
D legal approval recorded for derived-score boundary
A confirms migration affects staging tables only
A confirms checker does not write market rows
C confirms no backtest claim depends on staging rows
F confirms no public UI depends on staging rows
rollback plan approved
RLS policy approved
service role policy approved
```

## CEO Synthesis

```text
This plan is sufficient to prepare a future implementation decision. It still
does not approve migration file creation, SQL execution, Supabase writes, or
staging table creation. The next step is a role review of this implementation
plan, then CEO can decide whether to approve an actual migration draft.
```

## Next Implementation Slice

```text
record role review for TWSE STOCK_DAY staging migration implementation plan
do not create migration file
do not run SQL
do not write Supabase
do not create staging tables
do not create seed SQL
do not commit raw market data
keep public data source mock
```
