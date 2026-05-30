# CP3 Remote-Only Object Draft Types

Date: 2026-05-30

Status: `CP3 remote-only object draft types recorded`

Decision: `CREATE_LOCAL_DRAFT_TYPES_WITHOUT_RUNTIME_WIRING`

## Scope

This slice creates local draft TypeScript contracts for `market_assets`, `model_runs`, and `data_freshness`. It does not import the draft contracts into pages, components, or repositories, does not authorize a second remote attempt, does not connect to Supabase, does not run SQL, does not run validators against Supabase, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not print secrets, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Artifact

```text
ARTIFACT-001 src/lib/cp3-remote-only-object-contracts.draft.ts exists
ARTIFACT-002 Cp3MarketAssetContractDraft exists
ARTIFACT-003 Cp3ModelRunContractDraft exists
ARTIFACT-004 Cp3DataFreshnessContractDraft exists
ARTIFACT-005 cp3RemoteOnlyObjectContractDrafts exists
ARTIFACT-006 cp3RemoteOnlyContractGuardrails exists
ARTIFACT-007 canUseRemoteOnlyObjectAtRuntime exists and stays false for pending contracts
ARTIFACT-008 getRemoteOnlyContractNextAction exists for CEO/PM queueing
```

## Draft Contract Decisions

```text
MARKET-ASSETS-001 contract role is global_asset_identity_candidate_only
MARKET-ASSETS-002 required categories include marketId, assetId, symbol, displayName, exchange, country, currency, timezone, assetType, and activeFlag
MARKET-ASSETS-003 runtimeDependencyState is blocked
MODEL-RUNS-001 contract role is score_provenance_candidate_only
MODEL-RUNS-002 required categories include modelVersion, runStatus, sourceMode, targetObject, startedAt, finishedAt, reviewStatus, notes, and errorMessage
MODEL-RUNS-003 sourceMode includes real_blocked, not real
MODEL-RUNS-004 runtimeDependencyState is blocked
DATA-FRESHNESS-001 contract role is freshness_disclosure_candidate_only
DATA-FRESHNESS-002 required categories include targetTable, sourceName, latestDataDate, freshnessStatus, runStatus, finishedAt, rowCount, and staleReason
DATA-FRESHNESS-003 relationshipToDataRuns is unmapped_pending_decision
DATA-FRESHNESS-004 runtimeDependencyState is blocked
```

## Wiring Restrictions

```text
WIRING-001 src/app must not import cp3-remote-only-object-contracts.draft
WIRING-002 src/components must not import cp3-remote-only-object-contracts.draft
WIRING-003 src/lib/repositories must not import cp3-remote-only-object-contracts.draft
WIRING-004 draft contracts are compile-time planning artifacts only
WIRING-005 repository abstractions remain the future integration boundary
WIRING-006 public data source remains mock
WIRING-007 scoreSource=real remains blocked
WIRING-008 CP3 remains not_ready
```

## Role Review

```text
CEO-FINDING-001 this is the fastest safe acceleration from governance to implementation preparation
CEO-FINDING-002 draft types make global expansion concrete without pretending runtime readiness
PM-FINDING-001 this slice gives Engineering a typed queue for the next runtime-design step
ENGINEERING-FINDING-001 draft types are local-only and must not be imported by runtime routes or repositories
ENGINEERING-FINDING-002 canUseRemoteOnlyObjectAtRuntime must remain false for remote_only_pending_contract objects
DATA-FINDING-001 field categories are enough for contract discussion but not enough for data-quality claims
QA-FINDING-001 static checks must block accidental runtime wiring
SECURITY-FINDING-001 no secrets or row payloads are represented
LEGAL-FINDING-001 no public global coverage, market-data rights, or investment-advice claim is approved
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

CEO accepts this as a controlled acceleration slice. The project moves from pure review documentation into typed implementation preparation, while still refusing runtime dependency, database writes, real market data, and public-readiness claims.

## Next Slice Recommendation

```text
NEXT-SLICE-001 create data_freshness to data_runs relationship note
NEXT-SLICE-002 decide repository abstraction shape for freshness without enabling Supabase runtime reads
NEXT-SLICE-003 keep public data source mock and scoreSource=real blocked
NEXT-SLICE-004 keep no SQL, no Supabase writes, no market-data ingestion, and no second remote attempt
```

## Verification Expectations

```text
scripts/check-cp3-remote-only-object-draft-types.mjs passes
scripts/check-cp3-remote-only-object-contract-plan.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
Next build passes
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
public claims remain blocked
```
