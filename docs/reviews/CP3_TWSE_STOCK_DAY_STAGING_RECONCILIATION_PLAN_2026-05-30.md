# CP3 TWSE Stock Day Staging Reconciliation Plan

Date: 2026-05-30

Status: `CP3 TWSE stock day staging reconciliation plan recorded`

Decision: `RECONCILE_TWSE_STOCK_DAY_STAGING_BEFORE_RUNTIME_OR_MIGRATION_ACTION`

## Scope

This plan reconciles the remote evidence name `twse_stock_day_staging` with the local staging baseline. It does not authorize a second remote attempt, does not connect to Supabase, does not run a validator, does not run SQL, does not create or edit migrations, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Inputs

```text
INPUT-001 CP3_SUPABASE_SCHEMA_SHAPE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-05-30 records twse_stock_day_staging reachable ok
INPUT-002 CP3_SUPABASE_SCHEMA_SHAPE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-05-30 records twse_stock_day_staging shapeStatus needs-reconciliation
INPUT-003 CP3_SUPABASE_SCHEMA_SHAPE_EVIDENCE_TO_ACTION_MAP_2026-05-30 sets twse_stock_day_staging as P0
INPUT-004 CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30 says local migration defines staging_twse_stock_day_runs and staging_twse_stock_day_prices
INPUT-005 CP3_TWSE_STOCK_DAY_STAGING_SQL_DESIGN_2026-05-29 says future migration scope should define exactly staging_twse_stock_day_runs and staging_twse_stock_day_prices
INPUT-006 no local baseline currently confirms exact object name twse_stock_day_staging
```

## Reconciliation Question

```text
QUESTION-001 What is twse_stock_day_staging relative to the local staging baseline?
QUESTION-002 Is it an alias, view, table, naming mismatch, remote-only compatibility object, or object that runtime should avoid?
QUESTION-003 Should future runtime or internal review code reference twse_stock_day_staging, staging_twse_stock_day_prices, staging_twse_stock_day_runs, or none of them?
```

## Candidate Outcomes

| Outcome | Meaning | Action If Accepted | Runtime Impact |
|---|---|---|---|
| Alias | `twse_stock_day_staging` intentionally maps to local staging concepts | Document alias contract and decide canonical name | Runtime still blocked until alias contract and type baseline exist |
| View | `twse_stock_day_staging` is a read-only view over one or both staging tables | Document view contract and expected projection | Internal review may plan read-only use after separate gate |
| Table | `twse_stock_day_staging` is an independent remote table | Decide whether to add local migration/type baseline or deprecate reliance | Runtime blocked until migration/type alignment exists |
| Naming mismatch | Remote evidence name differs from local intended names | Prefer local canonical names unless CEO approves compatibility object | Runtime must not depend on mismatch |
| Deprecate reliance | Object is reachable but not part of intended architecture | Keep evidence for audit only and remove it from runtime planning | Runtime must use approved local baseline only |

## Required Local-Only Checks

```text
CHECK-001 inspect local migrations for staging_twse_stock_day_runs
CHECK-002 inspect local migrations for staging_twse_stock_day_prices
CHECK-003 inspect generated type baseline for staging_twse_stock_day_runs
CHECK-004 inspect generated type baseline for staging_twse_stock_day_prices
CHECK-005 inspect repository code for twse_stock_day_staging references
CHECK-006 inspect repository code for staging_twse_stock_day_prices references
CHECK-007 inspect repository code for staging_twse_stock_day_runs references
CHECK-008 inspect docs for canonical naming commitments
CHECK-009 do not query Supabase
CHECK-010 do not run SQL
```

## Provisional CEO Direction

```text
DIRECTION-001 default canonical local names remain staging_twse_stock_day_runs and staging_twse_stock_day_prices
DIRECTION-002 twse_stock_day_staging remains non-canonical until reconciled
DIRECTION-003 do not add runtime dependency on twse_stock_day_staging
DIRECTION-004 do not create compatibility SQL yet
DIRECTION-005 do not rename migrations or generated types in this slice
DIRECTION-006 prepare a local-only reconciliation result after inspecting code and migration references
```

## Role Findings

```text
CEO-FINDING-001 reconciliation is now the fastest safe path toward runtime clarity
CEO-FINDING-002 immediate SQL or runtime wiring would be premature
PM-FINDING-001 this plan defines the next local-only work slice and avoids another remote attempt
ENGINEERING-FINDING-001 local canonical design has two staging objects, not the singular reachable name
ENGINEERING-FINDING-002 twse_stock_day_staging must remain review/support-only until object identity is resolved
DATA-FINDING-001 schema-shape reachability does not identify whether the object is table, view, or alias
QA-FINDING-001 acceptable outcomes and stop conditions are explicit
SECURITY-FINDING-001 no secret, row, or remote metadata output is needed
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
```

## CEO Synthesis

CEO accepts this reconciliation plan as the P0 response to schema-shape evidence. The project should first run local-only checks over migrations, generated types, repositories, and docs. The default posture is that `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices` remain canonical; `twse_stock_day_staging` is a reachable remote evidence name but not a runtime dependency. No SQL, migration, Supabase write, second remote attempt, or runtime claim is approved.

## Next Slice Recommendation

```text
NEXT-SLICE-001 perform local-only staging reference audit
NEXT-SLICE-002 classify twse_stock_day_staging as alias, view, table, naming mismatch, or deprecated runtime reliance
NEXT-SLICE-003 record recommended canonical naming rule
NEXT-SLICE-004 update decision ledger after classification
NEXT-SLICE-005 keep no SQL, no writes, no second remote attempt, no market data, no scoreSource=real
```

## Verification Expectations

```text
scripts/check-cp3-twse-stock-day-staging-reconciliation-plan.mjs passes
scripts/check-cp3-supabase-schema-shape-evidence-to-action-map.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
public claims remain blocked
```
