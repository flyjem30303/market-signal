# CP1 Follow-up: ETF Schema Rollout Guard

Date: 2026-05-29

Trigger:

- ETF schema migration exists in repo.
- The current remote Supabase project may not have applied the new migration.
- The project needs a safe validation path before ETF ingestion work begins.

## Implemented

- Added `npm run db:etf-schema`.
- The check validates:

```text
etf_profiles
etf_daily_metrics
etf_holdings
0050 / 006208 ETF classification
```

- Updated Supabase runbook with migration and validation steps.

## A / PM + Developer

A confirms the project now has a guard before any ETF ingestion work.

The script is intentionally read-only. It reports `blocked` if the remote
database has not applied the ETF schema.

## B / Marketing

B should not treat this as launched ETF coverage. It is only operational
readiness.

## C / Investment Advisor

C confirms this guard protects ETF-specific model work from starting on an
incorrect schema.

## D / Legal

D approves this as internal validation only. It does not change public claims.

## F / Product Design / UIUX

F should wait for ETF ingestion and model review before creating public ETF
modules.

## E / CEO Synthesis

CEO decision:

```text
PROCEED_INTERNAL_ONLY
```

The next action is to apply `0002_etf_data_model.sql` to Supabase only when the
team is ready to begin ETF ingestion validation. Public release remains blocked.

## Not Approved

```text
ETF ingestion without schema validation
ETF scoring
ETF public interpretation
NEXT_PUBLIC_DATA_SOURCE=supabase
```
