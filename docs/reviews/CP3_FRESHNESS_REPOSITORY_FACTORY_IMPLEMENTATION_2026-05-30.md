# CP3 Freshness Repository Factory Implementation

Date: 2026-05-30

Status: `CP3 freshness repository factory implementation recorded`

Decision: `IMPLEMENT_MOCK_DEFAULT_FRESHNESS_REPOSITORY_FACTORY_WITH_UNCHANGED_RUNTIME_GATES`

## Scope

This larger CEO slice implements the local freshness repository factory, updates the runtime source wrapper to use it, updates fallback static checks, adds a dedicated CP3 checker, and wires that checker into the review gate. It does not enable Supabase runtime reads by default, does not import `data_freshness` into runtime repositories, does not authorize a second remote attempt, does not connect to Supabase unless the existing `DATA_FRESHNESS_SOURCE=supabase` and `DATA_FRESHNESS_SUPABASE_READS=enabled` runtime gate is explicitly set by environment, does not run SQL, does not run validators against Supabase, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not print secrets, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Artifacts

```text
ARTIFACT-001 src/lib/repositories/freshness-repository.ts exists
ARTIFACT-002 createMockFreshnessRepository exists
ARTIFACT-003 createDataRunsFreshnessRepository exists
ARTIFACT-004 createFreshnessRepository exists
ARTIFACT-005 src/lib/data-freshness-source.ts delegates source selection to createFreshnessRepository
ARTIFACT-006 scripts/check-data-freshness-source-fallback.mjs checks the repository factory
ARTIFACT-007 scripts/check-cp3-freshness-repository-factory-implementation.mjs exists
```

## Runtime Behavior

```text
RUNTIME-001 DATA_FRESHNESS_SOURCE still defaults to mock
RUNTIME-002 DATA_FRESHNESS_SUPABASE_READS still defaults to disabled behavior unless exactly enabled
RUNTIME-003 source=mock returns createMockFreshnessRepository
RUNTIME-004 source=supabase with supabaseRuntimeReads=disabled returns createMockFreshnessRepository
RUNTIME-005 source=supabase with supabaseRuntimeReads=enabled returns createDataRunsFreshnessRepository
RUNTIME-006 createDataRunsFreshnessRepository reads through getSupabaseDataFreshnessSnapshot
RUNTIME-007 createDataRunsFreshnessRepository catches failures and returns buildMockDataFreshnessSnapshot
RUNTIME-008 data_freshness is not a source option
RUNTIME-009 scoreSource remains controlled by DataFreshnessSnapshot builders and is not set to real by this slice
RUNTIME-010 public data source remains mock
```

## Role Review

```text
CEO-FINDING-001 this is the intended larger-slice cadence: runtime-safe implementation plus gates in one pass
CEO-FINDING-002 the project now has a real freshness repository abstraction without changing public behavior
PM-FINDING-001 next larger slice can add focused unit-style checks for repository source selection
ENGINEERING-FINDING-001 data-freshness-source now delegates to a repository factory
ENGINEERING-FINDING-002 Supabase client creation remains lazy behind createFreshnessRepository source and read gates
ENGINEERING-FINDING-003 data_freshness remains absent from runtime repository selection
DATA-FINDING-001 data_runs remains the only Supabase freshness candidate
QA-FINDING-001 fallback behavior is still mock when Supabase runtime reads are disabled or fail
SECURITY-FINDING-001 this implementation does not log env values, secrets, or row payloads
LEGAL-FINDING-001 no freshness, global coverage, market-data rights, or investment-advice claim is approved
```

## Guardrails

```text
GUARDRAIL-001 no second remote schema-shape attempt
GUARDRAIL-002 no SQL execution
GUARDRAIL-003 no validator execution against Supabase
GUARDRAIL-004 no Supabase writes
GUARDRAIL-005 no staging rows
GUARDRAIL-006 no daily_prices writes
GUARDRAIL-007 no market-data fetch, parse, ingestion, or raw market-data commit
GUARDRAIL-008 no secrets, key prefixes, key suffixes, key lengths, or row payloads printed
GUARDRAIL-009 no scoreSource=real
GUARDRAIL-010 no public claim approval
GUARDRAIL-011 no CP3 readiness promotion
GUARDRAIL-012 no runtime repository dependency on data_freshness
```

## CEO Synthesis

CEO accepts this as the first larger implementation slice after the contract phase. The code now has a real repository boundary for freshness, but the default behavior remains public-safe mock. The next slice should add source-selection tests or a small local-only preflight that proves mock/default, disabled Supabase fallback, and failure fallback without touching Supabase.

## Next Slice Recommendation

```text
NEXT-SLICE-001 add local-only repository source-selection checks
NEXT-SLICE-002 verify createSupabaseClient is not called for mock or disabled Supabase runtime reads
NEXT-SLICE-003 verify data_runs candidate catches errors and returns mock freshness
NEXT-SLICE-004 keep no SQL, no Supabase writes, no market-data ingestion, and no second remote attempt
```

## Verification Expectations

```text
scripts/check-cp3-freshness-repository-factory-implementation.mjs passes
scripts/check-data-freshness-source-fallback.mjs passes
scripts/check-cp3-freshness-repository-draft-contract.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
Next build passes
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
public claims remain blocked
```
