# CP3 Supabase Schema-Shape Evidence-To-Action Map

Date: 2026-05-30

Status: `CP3 Supabase schema-shape evidence-to-action map recorded`

Decision: `TRANSLATE_SCHEMA_SHAPE_EVIDENCE_TO_LOCAL_CONTRACT_ACTIONS`

## Scope

This map translates the one-attempt schema-shape read-only evidence into local follow-up work. It does not authorize a second remote attempt, does not connect to Supabase, does not run the validator, does not run SQL, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Evidence Inputs

```text
INPUT-001 CP3_SUPABASE_SCHEMA_SHAPE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-05-30 is accepted
INPUT-002 daily_prices reachable ok
INPUT-003 daily_prices shapeStatus ok
INPUT-004 daily_prices missingExpectedFields none
INPUT-005 twse_stock_day_staging reachable ok
INPUT-006 twse_stock_day_staging shapeStatus needs-reconciliation
INPUT-007 twse_stock_day_staging local baseline uses staging_twse_stock_day_runs and staging_twse_stock_day_prices
INPUT-008 market_assets reachable ok
INPUT-009 market_assets remains remote-only-pending-contract
INPUT-010 model_runs reachable ok
INPUT-011 model_runs remains remote-only-pending-contract
INPUT-012 data_freshness reachable ok
INPUT-013 data_freshness remains remote-only-pending-contract
INPUT-014 CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30 remains the local comparison baseline
```

## Action Map

| Object | Evidence State | Local Contract State | Action | Owner | Priority |
|---|---|---|---|---|---|
| `daily_prices` | reachable ok, shapeStatus ok, expected projection present | local-baselined | Preserve as trusted schema-shape baseline, but do not infer data quality or freshness | Engineering + Data | P2 |
| `twse_stock_day_staging` | reachable ok, shapeStatus needs-reconciliation | local migration defines `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices` | Reconcile whether remote object is table, view, alias, or separate compatibility object before runtime reliance | Engineering + DBA | P0 |
| `market_assets` | reachable ok | remote-only-pending-contract | Draft local/remote contract for global asset identity before global runtime wiring | CEO + Data + Engineering | P1 |
| `model_runs` | reachable ok | remote-only-pending-contract | Draft score provenance contract before any score-source promotion or audit UI reliance | Data + QA + Engineering | P1 |
| `data_freshness` | reachable ok | remote-only-pending-contract; local baseline has `data_runs` | Map relationship to `data_runs` and freshness UI before replacing or depending on it | PM + Engineering + QA | P1 |

## Required Next Documents

```text
DOC-001 twse_stock_day_staging reconciliation plan
DOC-002 remote-only object contract plan for market_assets, model_runs, and data_freshness
DOC-003 data_freshness to data_runs relationship note
DOC-004 post-evidence decision ledger update
DOC-005 runtime gating note that schema-shape evidence is not readiness evidence
```

## Role Findings

```text
CEO-FINDING-001 the evidence is strong enough to move from reachability debate to contract reconciliation
CEO-FINDING-002 twse_stock_day_staging is the highest priority because it directly blocks ingestion staging clarity
PM-FINDING-001 P0 work is twse_stock_day_staging reconciliation, not another remote run
PM-FINDING-002 P1 work is remote-only contract planning for market_assets, model_runs, and data_freshness
ENGINEERING-FINDING-001 daily_prices can be treated as schema-shape checked, not data-quality checked
ENGINEERING-FINDING-002 runtime code must not depend on twse_stock_day_staging until object identity is resolved
ENGINEERING-FINDING-003 no migration or SQL execution is approved by this map
DATA-FINDING-001 remote-only objects are reachable but still lack field-level contract evidence
DATA-FINDING-002 model_runs must remain provenance-planning only until semantics are documented
QA-FINDING-001 no CP3 readiness or public claim can be derived from this map
SECURITY-FINDING-001 no second remote access is needed for this slice
LEGAL-FINDING-001 no public market-data rights, investment advice, or production-readiness claim is approved
```

## Guardrails

```text
GUARDRAIL-001 no second remote schema-shape attempt
GUARDRAIL-002 no Supabase connection
GUARDRAIL-003 no SQL execution
GUARDRAIL-004 no migration execution
GUARDRAIL-005 no Supabase writes
GUARDRAIL-006 no staging rows
GUARDRAIL-007 no daily_prices writes
GUARDRAIL-008 no market-data fetch, parse, ingestion, or raw market-data commit
GUARDRAIL-009 no .env.local modification
GUARDRAIL-010 no scoreSource=real
GUARDRAIL-011 no source-depth production readiness promotion
GUARDRAIL-012 no CP3 readiness promotion
GUARDRAIL-013 no public claims
```

## CEO Synthesis

CEO accepts this map as the project bridge from one-time schema-shape evidence into concrete contract work. The fastest safe path is not another validator attempt and not immediate runtime wiring. The fastest safe path is a P0 reconciliation of `twse_stock_day_staging`, followed by P1 contract planning for `market_assets`, `model_runs`, and `data_freshness`. CP3 remains `not_ready`, public data source remains mock, and `scoreSource=real` remains blocked.

## Next Slice Recommendation

```text
NEXT-SLICE-001 create twse_stock_day_staging reconciliation plan
NEXT-SLICE-002 compare remote evidence name against local migration object names without remote access
NEXT-SLICE-003 decide acceptable outcomes: alias, view, table, naming mismatch, or deprecate runtime reliance
NEXT-SLICE-004 keep no SQL, no writes, no second remote attempt, no market data, no scoreSource=real
NEXT-SLICE-005 keep CP3 not_ready until separate post-evidence role review
```

## Verification Expectations

```text
scripts/check-cp3-supabase-schema-shape-evidence-to-action-map.mjs passes
scripts/check-cp3-supabase-schema-shape-one-attempt-post-run-review.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
public claims remain blocked
```
