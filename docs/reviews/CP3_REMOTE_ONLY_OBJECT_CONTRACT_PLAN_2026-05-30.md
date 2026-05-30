# CP3 Remote-Only Object Contract Plan

Date: 2026-05-30

Status: `CP3 remote-only object contract plan recorded`

Decision: `MAP_REMOTE_ONLY_OBJECTS_TO_LOCAL_RUNTIME_CONTRACTS_WITHOUT_RUNTIME_RELIANCE`

## Scope

This plan converts the accepted one-attempt schema-shape evidence for `market_assets`, `model_runs`, and `data_freshness` into local runtime-contract work. It does not authorize a second remote attempt, does not connect to Supabase, does not run SQL, does not run validators, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not print secrets, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Evidence Inputs

```text
INPUT-001 CP3_SUPABASE_SCHEMA_SHAPE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-05-30 is accepted as narrow schema-shape evidence
INPUT-002 CP3_SUPABASE_SCHEMA_SHAPE_EVIDENCE_TO_ACTION_MAP_2026-05-30 requires remote-only object contract planning
INPUT-003 CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30 says market_assets has no local migration or generated type baseline
INPUT-004 CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30 says model_runs has no local migration or generated type baseline
INPUT-005 CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30 says data_freshness has no confirmed local migration or generated type baseline
INPUT-006 market_assets reachable ok but remote-only-pending-contract
INPUT-007 model_runs reachable ok but remote-only-pending-contract
INPUT-008 data_freshness reachable ok but remote-only-pending-contract
INPUT-009 local freshness baseline currently uses data_runs, not confirmed data_freshness
INPUT-010 twse_stock_day_staging remains separate P0 naming reconciliation and is not runtime-ready
```

## Contract Plan Matrix

| Object | Intended contract role | Minimum field categories | Current allowed usage | Runtime dependency decision | Owner roles | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `market_assets` | Global asset identity registry candidate | market identity, asset identity, symbol, display name, exchange, country, currency, timezone, asset type, active flag | planning only | no runtime reliance until local migration/type/contract alignment exists | CEO, Data, Engineering | P1 |
| `model_runs` | Score provenance and audit trail candidate | model version, run status, source mode, target object, started timestamp, finished timestamp, review status, notes or error message | review design only | no score-source promotion and no runtime reliance until provenance semantics and gates exist | Data, QA, Engineering | P1 |
| `data_freshness` | Freshness disclosure candidate | target table, source name, latest data date, freshness status, run status, finished timestamp, row count, stale reason | relationship mapping only | no replacement of `data_runs` behavior until relationship is documented | PM, Engineering, QA | P1 |

## Object Decisions

### `market_assets`

Contract decision: `GLOBAL_ASSET_IDENTITY_CANDIDATE_ONLY`

`market_assets` is important for the future global website direction because it can become the canonical object for Taiwan stocks, global equities, ETFs, indices, and later multi-country user routing. For now, reachability does not prove that the field contract is complete, stable, or aligned with local generated types.

Required next local work:

```text
MARKET-ASSETS-001 define canonical asset id and market id semantics
MARKET-ASSETS-002 define exchange, country, currency, and timezone expectations for global rollout
MARKET-ASSETS-003 define asset type taxonomy before UI or scoring code depends on this object
MARKET-ASSETS-004 add local type or migration alignment before runtime reads
MARKET-ASSETS-005 keep public global-coverage claims blocked
```

### `model_runs`

Contract decision: `SCORE_PROVENANCE_CANDIDATE_ONLY`

`model_runs` can support future auditability, but it must not be used to imply model credibility or production scoring readiness. This object is a provenance candidate, not a permission to set `scoreSource=real`.

Required next local work:

```text
MODEL-RUNS-001 define model version naming and source mode semantics
MODEL-RUNS-002 define run status and review status lifecycle
MODEL-RUNS-003 define target object relationship for stock, ETF, index, and market-level scores
MODEL-RUNS-004 define safe error or notes handling without secrets or row payloads
MODEL-RUNS-005 keep scoreSource=real blocked until separate runtime/source gates pass
```

### `data_freshness`

Contract decision: `FRESHNESS_DISCLOSURE_CANDIDATE_ONLY`

`data_freshness` is relevant to runtime trust disclosure, but local runtime behavior currently has `data_runs` as the known baseline. The next safe step is a relationship note between `data_freshness`, `data_runs`, and the UI freshness state, not a database write or runtime dependency.

Required next local work:

```text
DATA-FRESHNESS-001 document whether data_freshness is a view, table, summary object, or future replacement candidate
DATA-FRESHNESS-002 map data_freshness fields to current data_runs-driven freshness behavior
DATA-FRESHNESS-003 decide whether runtime should read data_runs, data_freshness, or a repository abstraction
DATA-FRESHNESS-004 keep freshness quality claims blocked until row quality and source-depth evidence exist
DATA-FRESHNESS-005 keep DATA_FRESHNESS_SOURCE and Supabase runtime reads off unless a separate gate authorizes them
```

## Runtime Dependency Decisions

```text
RUNTIME-001 daily_prices is schema-shape checked but not data-quality, freshness, or historical-depth ready
RUNTIME-002 twse_stock_day_staging remains review/support-only until naming and object identity are reconciled
RUNTIME-003 market_assets has no runtime reliance until local migration, generated type, and field contract alignment exist
RUNTIME-004 model_runs has no runtime reliance until score provenance semantics and review gates exist
RUNTIME-005 data_freshness has no runtime reliance until its relationship to data_runs is documented
RUNTIME-006 public data source remains mock
RUNTIME-007 CP3 remains not_ready
RUNTIME-008 public claims remain blocked
```

## Role Review

```text
CEO-FINDING-001 the project should accelerate by converting remote evidence into contract work, not by repeating remote checks
CEO-FINDING-002 global readiness depends first on market_assets contract clarity
CEO-FINDING-003 scoreSource=real remains blocked even if model_runs exists remotely
PM-FINDING-001 this slice removes ambiguity for the next implementation queue without needing a meeting
PM-FINDING-002 next work should be local type contracts or data_freshness-to-data_runs mapping
ENGINEERING-FINDING-001 no runtime code should depend on remote-only objects yet
ENGINEERING-FINDING-002 repository abstractions should protect UI code from object-name changes
ENGINEERING-FINDING-003 no SQL, migration execution, or Supabase write is approved by this plan
DATA-FINDING-001 reachable objects still need field-level semantics before source-depth or quality claims
DATA-FINDING-002 global asset taxonomy should be settled before adding more markets
QA-FINDING-001 schema-shape evidence is not freshness, correctness, or completeness evidence
SECURITY-FINDING-001 this slice avoids secrets and row payloads entirely
LEGAL-FINDING-001 no market-data rights, public coverage claim, or investment-advice claim is approved
```

## Guardrails

```text
GUARDRAIL-001 no second remote schema-shape attempt
GUARDRAIL-002 no Supabase connection
GUARDRAIL-003 no SQL execution
GUARDRAIL-004 no validator execution against Supabase
GUARDRAIL-005 no Supabase writes
GUARDRAIL-006 no staging rows
GUARDRAIL-007 no daily_prices writes
GUARDRAIL-008 no market-data fetch, parse, ingestion, or raw market-data commit
GUARDRAIL-009 no secrets, key prefixes, key suffixes, key lengths, or row payloads printed
GUARDRAIL-010 no scoreSource=real
GUARDRAIL-011 no public claim approval
GUARDRAIL-012 no CP3 readiness promotion
```

## CEO Synthesis

CEO direction is to speed up by making fewer, larger, decision-quality slices. This plan says the remote-only objects are useful signals, but not yet runtime contracts. The fastest safe path is local implementation preparation: define draft TypeScript/domain contracts for `market_assets`, `model_runs`, and `data_freshness`, then map `data_freshness` to the current `data_runs` freshness behavior before any runtime read is enabled.

## Next Slice Recommendation

```text
NEXT-SLICE-001 create draft local TypeScript/domain contracts for remote-only objects without runtime wiring
NEXT-SLICE-002 create data_freshness to data_runs relationship note for repository and UI behavior
NEXT-SLICE-003 keep public data source mock and scoreSource=real blocked
NEXT-SLICE-004 keep no SQL, no Supabase writes, no market-data ingestion, and no second remote attempt
```

## Verification Expectations

```text
scripts/check-cp3-remote-only-object-contract-plan.mjs passes
scripts/check-cp3-supabase-schema-shape-evidence-to-action-map.mjs passes
scripts/check-cp3-twse-stock-day-staging-canonical-naming-rule-decision-ledger.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
public claims remain blocked
```
