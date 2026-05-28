# CP3 TWSE Stock Day Staging Post-Migration Validation And Rollback Plan

Status: plan only

Date: 2026-05-29

Purpose:

- Define what must be checked after a future staging migration run.
- Define rollback and cleanup behavior without providing executable SQL.
- Keep execution blocked until CEO changes the migration execution gate.

## CEO Decision

```text
REVISE
```

This plan is approved as a planning artifact only. It does not approve running
the migration, connecting to Supabase, writing Supabase, writing staging rows,
writing `daily_prices`, creating seed SQL, or storing raw market data.

## Inputs

```text
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_EXECUTION_READINESS_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_EXECUTION_APPROVAL_GATE_2026-05-29.md
supabase/migrations/0003_twse_stock_day_staging.sql
scripts/check-supabase-twse-stock-day-staging-schema.mjs
```

## Non-Negotiable Guardrails

```text
plan only
do not run SQL
do not connect to Supabase
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

## Future Post-Migration Validation

After a separately approved migration execution, A / PM+Dev must validate:

```text
staging_twse_stock_day_runs table exists
staging_twse_stock_day_prices table exists
RLS is enabled on both staging tables
review indexes exist
candidate row constraints exist
no production daily_prices rows were changed
no market rows were inserted by the migration
no seed SQL was created
public site still uses mock data source
scoreSource=real remains disabled
```

Future validation output must be a review report, not raw database data:

```text
table existence summary
RLS summary
index summary
constraint summary
production table untouched assertion
public data source assertion
decision: blocked / ready_for_review
```

## Future Rollback Principles

Rollback must be conservative:

```text
rollback is not automatic
rollback owner must be named
rollback target must be staging tables only
rollback must not touch daily_prices
rollback must not touch stocks
rollback must not touch markets
rollback must not touch model score tables
rollback must report intended action before execution
rollback must require CEO approval before destructive execution
```

## Future Cleanup Principles

Cleanup, if ever approved, must be scoped:

```text
cleanup by run_id only
dry-run cleanup count before deletion
candidate rows only
preserve run metadata unless CEO approves full purge
no cascade into production tables
no raw market data file cleanup because no raw files should be committed
```

## Role Review

A / PM+Dev:

```text
Can prepare validation scripts later, but they must be read-only until execution
approval exists.
```

B / Marketing:

```text
No public messaging changes after staging migration validation.
```

C / Investment:

```text
Post-migration validation does not create backtest credibility.
```

D / Legal:

```text
Rollback and retention policy must be reviewed before destructive cleanup exists.
```

E / CEO:

```text
No execution approval yet. This plan prepares the controls needed before a later
execution decision.
```

F / Design:

```text
No UI change. Any validation surface remains internal and token-gated.
```

## CEO Synthesis

```text
The project now has a clearer path for what would happen after migration
execution. Execution remains blocked. The next safe slice is a read-only
validation script design, not a database command.
```

## Next Implementation Slice

```text
draft read-only post-migration validation script design
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
