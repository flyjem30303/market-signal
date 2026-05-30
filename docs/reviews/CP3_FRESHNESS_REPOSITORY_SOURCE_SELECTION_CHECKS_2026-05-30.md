# CP3 Freshness Repository Source Selection Checks

Date: 2026-05-30

Status: `CP3 freshness repository source-selection checks recorded`

Decision: `VERIFY_FRESHNESS_REPOSITORY_SELECTION_LOCALLY_WITHOUT_REMOTE_EXECUTION`

## Scope

This larger CEO slice adds a local-only source-selection checker for the freshness repository factory and wires it into the review gate. It does not import `.env.local`, does not instantiate the real Supabase client, does not connect to Supabase, does not run SQL, does not run validators against Supabase, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not fetch or ingest market data, does not commit row payloads, does not print secrets, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Checked Behaviors

```text
BEHAVIOR-001 source=mock with supabaseRuntimeReads=disabled selects mock repository
BEHAVIOR-002 source=mock with supabaseRuntimeReads=enabled still selects mock repository
BEHAVIOR-003 source=supabase with supabaseRuntimeReads=disabled selects mock repository
BEHAVIOR-004 source=supabase with supabaseRuntimeReads=enabled selects data_runs repository candidate
BEHAVIOR-005 createSupabaseClient is not called for mock source
BEHAVIOR-006 createSupabaseClient is not called for disabled Supabase runtime reads
BEHAVIOR-007 createSupabaseClient is called only for source=supabase and supabaseRuntimeReads=enabled
BEHAVIOR-008 data_runs candidate errors fall back to mock freshness
BEHAVIOR-009 data_freshness is not a selectable runtime source
BEHAVIOR-010 public scoreSource remains mock in fallback snapshots
```

## Artifacts

```text
ARTIFACT-001 scripts/check-cp3-freshness-repository-source-selection.mjs exists
ARTIFACT-002 package.json exposes check:cp3-freshness-repository-source-selection
ARTIFACT-003 scripts/check-review-gates.mjs runs cp3-freshness-repository-source-selection
ARTIFACT-004 checker reads src/lib/repositories/freshness-repository.ts
ARTIFACT-005 checker uses a local equivalent model and never imports Supabase runtime clients
```

## Role Review

```text
CEO-FINDING-001 this keeps the larger-slice cadence while increasing implementation confidence
CEO-FINDING-002 the project can now prove the factory gates locally before any future runtime read authorization
PM-FINDING-001 next larger slice may add a safe repository factory unit harness or begin controlled UI-neutral refactor cleanup
ENGINEERING-FINDING-001 source selection is now checked as behavior, not only phrase presence
ENGINEERING-FINDING-002 mock and disabled Supabase paths must not call createSupabaseClient
ENGINEERING-FINDING-003 data_runs remains the only Supabase freshness candidate
DATA-FINDING-001 no row data or market data is needed for this source-selection proof
QA-FINDING-001 fallback behavior is covered for candidate errors
SECURITY-FINDING-001 no env values, secrets, key fragments, or row payloads are read or printed
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

CEO accepts this as the next acceleration slice because it converts the previous factory implementation into executable local proof. The project now has both a repository boundary and a source-selection behavioral guard, without using Supabase or changing public behavior.

## Next Slice Recommendation

```text
NEXT-SLICE-001 add a small UI-neutral cleanup to reduce duplicate mock fallback handling
NEXT-SLICE-002 keep source-selection checks as a hard gate before any future runtime-read authorization
NEXT-SLICE-003 keep data_freshness blocked from runtime repository usage
NEXT-SLICE-004 keep no SQL, no Supabase writes, no market-data ingestion, and no second remote attempt
```

## Verification Expectations

```text
scripts/check-cp3-freshness-repository-source-selection.mjs passes
scripts/check-cp3-freshness-repository-factory-implementation.mjs passes
scripts/check-data-freshness-source-fallback.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
Next build passes
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
public claims remain blocked
```
