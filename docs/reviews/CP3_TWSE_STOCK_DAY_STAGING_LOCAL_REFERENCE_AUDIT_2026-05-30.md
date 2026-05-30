# CP3 TWSE Stock Day Staging Local Reference Audit

Date: 2026-05-30

Status: `CP3 TWSE stock day staging local reference audit recorded`

Decision: `CLASSIFY_TWSE_STOCK_DAY_STAGING_AS_NAMING_MISMATCH_PENDING_REMOTE_CONTRACT`

## Scope

This audit classifies the reachable remote evidence name `twse_stock_day_staging` against the local staging baseline. It is local-only. It does not authorize a second remote attempt, does not connect to Supabase, does not run a validator, does not run SQL, does not create or edit migrations, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not set `scoreSource=real`, does not approve public claims, does not promote runtime readiness, and does not promote CP3 readiness.

## Audit Inputs

```text
INPUT-001 supabase/migrations/0003_twse_stock_day_staging.sql
INPUT-002 src/lib/supabase/database.types.ts
INPUT-003 scripts/validate-supabase-twse-stock-day-staging-readonly.mjs
INPUT-004 scripts/check-supabase-twse-stock-day-staging-schema.mjs
INPUT-005 docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_RECONCILIATION_PLAN_2026-05-30.md
INPUT-006 repository reference scan for twse_stock_day_staging
INPUT-007 repository reference scan for staging_twse_stock_day_runs
INPUT-008 repository reference scan for staging_twse_stock_day_prices
```

## Findings

```text
AUDIT-001 local migration defines staging_twse_stock_day_runs
AUDIT-002 local migration defines staging_twse_stock_day_prices
AUDIT-003 local migration does not define twse_stock_day_staging
AUDIT-004 local staging readonly validator targets staging_twse_stock_day_runs and staging_twse_stock_day_prices
AUDIT-005 local staging schema checker allows only staging_twse_stock_day_runs and staging_twse_stock_day_prices
AUDIT-006 no runtime repository dependency on twse_stock_day_staging was found in src
AUDIT-007 no generated type baseline for twse_stock_day_staging was confirmed
AUDIT-008 twse_stock_day_staging remains a reachable remote evidence name only
AUDIT-009 existing local documentation already treats staging_twse_stock_day_runs and staging_twse_stock_day_prices as the intended staging contract
AUDIT-010 schema-shape reachability does not prove that twse_stock_day_staging is the intended runtime object
```

## Classification

```text
CLASSIFICATION-001 twse_stock_day_staging is classified as naming mismatch pending remote contract
CLASSIFICATION-002 twse_stock_day_staging is not classified as canonical alias
CLASSIFICATION-003 twse_stock_day_staging is not classified as local view
CLASSIFICATION-004 twse_stock_day_staging is not classified as local table
CLASSIFICATION-005 twse_stock_day_staging is not approved for runtime reliance
CLASSIFICATION-006 canonical local staging names remain staging_twse_stock_day_runs and staging_twse_stock_day_prices
CLASSIFICATION-007 future compatibility object design requires a separate approval gate
CLASSIFICATION-008 runtime code must not depend on twse_stock_day_staging in the next implementation slice
```

## Role Findings

```text
CEO-FINDING-001 the fastest safe path is to preserve the local two-table staging contract and avoid runtime reliance on twse_stock_day_staging
CEO-FINDING-002 no SQL or migration action is needed for this classification slice
PM-FINDING-001 the next slice should record a canonical staging naming rule and update the decision ledger
ENGINEERING-FINDING-001 staging_twse_stock_day_runs and staging_twse_stock_day_prices remain the implementation baseline
ENGINEERING-FINDING-002 if a future compatibility view or alias is desired, it must be designed after the naming rule is recorded
DATA-FINDING-001 remote reachability is useful evidence but not sufficient to accept object identity
QA-FINDING-001 the classification prevents accidental runtime coupling to an unresolved remote name
SECURITY-FINDING-001 no secrets, row payloads, or remote metadata are required for this local audit
LEGAL-FINDING-001 no public market-data or production-readiness claim is approved
```

## Guardrails

```text
GUARDRAIL-001 no second remote schema-shape attempt
GUARDRAIL-002 no Supabase connection
GUARDRAIL-003 no validator execution
GUARDRAIL-004 no SQL execution
GUARDRAIL-005 no migration execution
GUARDRAIL-006 no migration creation or edit
GUARDRAIL-007 no Supabase writes
GUARDRAIL-008 no staging rows
GUARDRAIL-009 no daily_prices writes
GUARDRAIL-010 no market-data fetch, parse, ingestion, or raw market-data commit
GUARDRAIL-011 no .env.local modification
GUARDRAIL-012 no scoreSource=real
GUARDRAIL-013 no source-depth production readiness promotion
GUARDRAIL-014 no CP3 readiness promotion
GUARDRAIL-015 no public claims
GUARDRAIL-016 no runtime reliance on twse_stock_day_staging
```

## CEO Synthesis

CEO classifies `twse_stock_day_staging` as a naming mismatch pending remote contract. The canonical local staging contract remains `staging_twse_stock_day_runs` plus `staging_twse_stock_day_prices`. The project should not spend more time on another remote attempt here, and should not create SQL compatibility objects yet. The next best work is to record the naming rule and decision-ledger entry so the runtime implementation can move forward on the approved local baseline.

## Next Slice Recommendation

```text
NEXT-SLICE-001 record canonical staging naming rule
NEXT-SLICE-002 update decision ledger with naming mismatch classification
NEXT-SLICE-003 keep twse_stock_day_staging as evidence-only until a separate remote contract or compatibility object gate exists
NEXT-SLICE-004 prepare runtime implementation to reference only approved local contract concepts
NEXT-SLICE-005 keep no SQL, no writes, no second remote attempt, no market data, no scoreSource=real
```

## Verification Expectations

```text
scripts/check-cp3-twse-stock-day-staging-local-reference-audit.mjs passes
scripts/check-cp3-twse-stock-day-staging-reconciliation-plan.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
public claims remain blocked
```
