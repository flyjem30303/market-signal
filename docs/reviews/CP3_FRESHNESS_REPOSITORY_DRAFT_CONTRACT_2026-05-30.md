# CP3 Freshness Repository Draft Contract

Date: 2026-05-30

Status: `CP3 freshness repository draft contract recorded`

Decision: `CREATE_DRAFT_REPOSITORY_CONTRACT_WITHOUT_RUNTIME_WIRING`

## Scope

This larger CEO slice creates a local TypeScript draft contract, review artifact, static checker, package script, and review-gate entry for the freshness repository boundary. It does not import the draft contract into pages, components, or runtime repositories, does not implement a new runtime Supabase read path, does not import `data_freshness` into runtime repositories, does not authorize a second remote attempt, does not connect to Supabase, does not run SQL, does not run validators against Supabase, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not print secrets, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Artifacts

```text
ARTIFACT-001 src/lib/repositories/freshness-repository-contract.draft.ts exists
ARTIFACT-002 FreshnessRepositoryDraft exists
ARTIFACT-003 MockFreshnessRepositoryDraft exists
ARTIFACT-004 DataRunsFreshnessRepositoryDraft exists
ARTIFACT-005 DataFreshnessRemoteCandidateRepositoryDraft exists but is blocked
ARTIFACT-006 freshnessRepositorySafetyBoundary exists
ARTIFACT-007 canUseFreshnessRepositoryAtPublicRuntime exists
ARTIFACT-008 canUseDataRunsFreshnessCandidate exists and requires source=supabase plus supabaseRuntimeReads=enabled
ARTIFACT-009 canUseDataFreshnessRemoteCandidate always returns false
ARTIFACT-010 getFreshnessRepositoryNextAction exists for CEO/PM queueing
```

## Contract Decisions

```text
CONTRACT-001 DataFreshnessSnapshot remains the UI-facing output boundary
CONTRACT-002 mock repository is the only public-runtime-safe repository in this draft
CONTRACT-003 data_runs is a gated Supabase read candidate only
CONTRACT-004 data_freshness is a blocked remote candidate only
CONTRACT-005 this draft contract does not enable Supabase reads
CONTRACT-006 this draft contract does not enable Supabase writes
CONTRACT-007 this draft contract does not change DATA_FRESHNESS_SOURCE behavior
CONTRACT-008 this draft contract does not change DATA_FRESHNESS_SUPABASE_READS behavior
CONTRACT-009 this draft contract does not change scoreSource behavior
CONTRACT-010 this draft contract does not change public data source behavior
```

## Source Rules

```text
SOURCE-001 sourceKind=mock maps to local_mock_only
SOURCE-002 sourceKind=data_runs maps to gated_supabase_read_candidate
SOURCE-003 sourceKind=data_freshness_candidate maps to blocked
SOURCE-004 public runtime can use only sourceKind=mock in this draft
SOURCE-005 data_runs can become usable only after explicit source=supabase and supabaseRuntimeReads=enabled gate
SOURCE-006 data_freshness cannot become usable from this draft
SOURCE-007 repository errors must preserve mock fallback in later implementation
SOURCE-008 no row payloads, secrets, key prefixes, key suffixes, or key lengths may be logged
```

## Wiring Restrictions

```text
WIRING-001 src/app must not import freshness-repository-contract.draft
WIRING-002 src/components must not import freshness-repository-contract.draft
WIRING-003 runtime repository implementation files must not import freshness-repository-contract.draft
WIRING-004 draft contract is compile-time planning only
WIRING-005 source selection remains centralized behind current getDataFreshnessSnapshot until implementation approval
WIRING-006 public data source remains mock
WIRING-007 scoreSource=real remains blocked
WIRING-008 CP3 remains not_ready
```

## Role Review

```text
CEO-FINDING-001 this larger slice is the new working cadence: contract, checker, gate, validation, and commit together
CEO-FINDING-002 the project now has a typed path toward runtime implementation without touching Supabase
PM-FINDING-001 next slice can implement a mock/default repository factory behind the same behavior
ENGINEERING-FINDING-001 draft types isolate the future repository boundary from UI code
ENGINEERING-FINDING-002 canUseDataFreshnessRemoteCandidate must stay false until data_freshness is contracted
ENGINEERING-FINDING-003 canUseDataRunsFreshnessCandidate must require explicit Supabase runtime-read enablement
DATA-FINDING-001 data_runs remains the only local-baselined freshness candidate
QA-FINDING-001 static checks block accidental runtime wiring of the draft contract
SECURITY-FINDING-001 this slice does not expose env values, secrets, or row payloads
LEGAL-FINDING-001 no freshness, global coverage, market-data rights, or investment-advice claim is approved
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
GUARDRAIL-013 no runtime repository dependency on data_freshness
```

## CEO Synthesis

CEO direction is now larger, smoother slices. This slice moves the project from plan to typed draft contract while preserving all runtime safety gates. The next larger slice should implement the mock/default repository factory and tests/checkers without enabling Supabase reads, so the runtime code can gradually move behind an abstraction without changing user-visible behavior.

## Next Slice Recommendation

```text
NEXT-SLICE-001 implement mock/default freshness repository factory with unchanged behavior
NEXT-SLICE-002 keep DATA_FRESHNESS_SOURCE mock by default
NEXT-SLICE-003 keep DATA_FRESHNESS_SUPABASE_READS required for any data_runs Supabase read candidate
NEXT-SLICE-004 keep data_freshness blocked from runtime repository usage
NEXT-SLICE-005 keep no SQL, no Supabase writes, no market-data ingestion, and no second remote attempt
```

## Verification Expectations

```text
scripts/check-cp3-freshness-repository-draft-contract.mjs passes
scripts/check-cp3-local-only-freshness-repository-abstraction-plan.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
Next build passes
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
public claims remain blocked
```
