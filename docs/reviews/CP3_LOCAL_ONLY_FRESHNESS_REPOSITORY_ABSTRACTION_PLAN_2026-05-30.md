# CP3 Local-Only Freshness Repository Abstraction Plan

Date: 2026-05-30

Status: `CP3 local-only freshness repository abstraction plan recorded`

Decision: `DESIGN_FRESHNESS_REPOSITORY_ABSTRACTION_WITHOUT_ENABLING_REMOTE_RUNTIME_READS`

## Scope

This plan defines the next local repository abstraction for freshness behavior after the `data_freshness` to `data_runs` relationship note. It does not implement a new runtime Supabase read path, does not import `data_freshness` into runtime repositories, does not authorize a second remote attempt, does not connect to Supabase, does not run SQL, does not run validators against Supabase, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not print secrets, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Current Baseline

```text
BASELINE-001 src/lib/data-freshness-source.ts defaults DATA_FRESHNESS_SOURCE to mock
BASELINE-002 src/lib/data-freshness-source.ts requires DATA_FRESHNESS_SUPABASE_READS=enabled before Supabase freshness reads
BASELINE-003 src/lib/data-freshness-source.ts falls back to buildMockDataFreshnessSnapshot when Supabase read is not enabled
BASELINE-004 src/lib/repositories/supabase-data-freshness-repository.ts currently reads data_runs, not data_freshness
BASELINE-005 src/lib/data-freshness.ts exposes DataFreshnessSnapshot as the UI-facing boundary
BASELINE-006 CP3_DATA_FRESHNESS_TO_DATA_RUNS_RELATIONSHIP_NOTE_2026-05-30 keeps data_runs as current runtime baseline
BASELINE-007 CP3_REMOTE_ONLY_OBJECT_DRAFT_TYPES_2026-05-30 keeps data_freshness relationshipToDataRuns unmapped_pending_decision
```

## Abstraction Design Target

```text
TARGET-001 introduce a FreshnessRepository boundary in a later implementation slice
TARGET-002 repository output remains DataFreshnessSnapshot
TARGET-003 mock implementation remains the default public-safe implementation
TARGET-004 data_runs implementation remains the only local-baselined Supabase implementation candidate
TARGET-005 data_freshness implementation remains blocked until migration/type/repository/QA gates exist
TARGET-006 source selection must remain centralized behind getDataFreshnessSnapshot or a successor factory
TARGET-007 repository factory must preserve mock fallback for unsupported or disabled runtime states
TARGET-008 repository factory must not print secrets or row payloads
```

## Proposed Interface Shape

```text
INTERFACE-001 FreshnessRepository.getSnapshot returns Promise<DataFreshnessSnapshot>
INTERFACE-002 MockFreshnessRepository wraps buildMockDataFreshnessSnapshot
INTERFACE-003 DataRunsFreshnessRepository wraps getSupabaseDataFreshnessSnapshot only behind an explicit runtime-read gate
INTERFACE-004 DataFreshnessRemoteCandidateRepository is not implemented until data_freshness contract is mapped
INTERFACE-005 repository errors must fall back to mock for public runtime surfaces
INTERFACE-006 internal diagnostics may report blocked states without row payloads or secrets
```

## Runtime Gating Rules

```text
GATE-001 DATA_FRESHNESS_SOURCE defaults to mock
GATE-002 DATA_FRESHNESS_SOURCE=supabase is insufficient by itself
GATE-003 DATA_FRESHNESS_SUPABASE_READS=enabled is still required for any Supabase freshness read
GATE-004 data_freshness remains unavailable as a source option
GATE-005 scoreSource remains mock even when freshness data is partially real
GATE-006 public data source remains mock unless a separate market-data runtime gate changes it
GATE-007 CP3 remains not_ready
GATE-008 public claims remain blocked
```

## Role Review

```text
CEO-FINDING-001 this is the right acceleration point because the project can now prepare runtime architecture without touching Supabase
CEO-FINDING-002 the abstraction lets global markets share one freshness boundary later
PM-FINDING-001 next implementation slice should be a draft TypeScript repository contract, not remote execution
ENGINEERING-FINDING-001 DataFreshnessSnapshot should remain the stable UI-facing shape
ENGINEERING-FINDING-002 data_runs remains the only local-baselined Supabase freshness repository candidate
ENGINEERING-FINDING-003 data_freshness must stay absent from runtime repository selection
DATA-FINDING-001 freshness source semantics still need source-depth and row-quality evidence before public claims
QA-FINDING-001 static checks must verify mock default and disabled Supabase read fallback
SECURITY-FINDING-001 repository abstraction must not expose env values, secrets, or row payloads
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

CEO direction is to move from relationship documentation into a local repository boundary. The next slice should create a draft TypeScript repository contract and static checks while preserving the same runtime behavior: mock by default, Supabase reads disabled unless separately gated, `data_runs` as the only local-baselined candidate, and `data_freshness` blocked from runtime.

## Next Slice Recommendation

```text
NEXT-SLICE-001 create src/lib/repositories/freshness-repository-contract.draft.ts
NEXT-SLICE-002 define FreshnessRepository, MockFreshnessRepositoryDraft, and DataRunsFreshnessRepositoryDraft types
NEXT-SLICE-003 add static checks that pages/components/repositories do not import the draft until implementation approval
NEXT-SLICE-004 keep no SQL, no Supabase writes, no market-data ingestion, and no second remote attempt
```

## Verification Expectations

```text
scripts/check-cp3-local-only-freshness-repository-abstraction-plan.mjs passes
scripts/check-cp3-data-freshness-to-data-runs-relationship-note.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
Next build passes
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
public claims remain blocked
```
