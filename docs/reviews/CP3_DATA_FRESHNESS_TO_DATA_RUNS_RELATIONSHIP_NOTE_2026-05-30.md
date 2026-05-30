# CP3 Data Freshness To Data Runs Relationship Note

Date: 2026-05-30

Status: `CP3 data_freshness to data_runs relationship note recorded`

Decision: `KEEP_DATA_RUNS_AS_CURRENT_RUNTIME_BASELINE_AND_DATA_FRESHNESS_AS_UNMAPPED_REMOTE_CANDIDATE`

## Scope

This note defines the current relationship between local `data_runs` freshness behavior and the remote-only `data_freshness` object. It does not import `data_freshness` into runtime repositories, does not authorize a second remote attempt, does not connect to Supabase, does not run SQL, does not run validators against Supabase, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not print secrets, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Local Evidence

```text
EVIDENCE-001 supabase/migrations/0001_initial_schema.sql defines public.data_runs
EVIDENCE-002 supabase/migrations/0001_initial_schema.sql indexes data_runs_target_table_idx
EVIDENCE-003 src/lib/supabase/database.types.ts contains data_runs
EVIDENCE-004 src/lib/supabase/database.types.ts does not establish data_freshness as local generated type baseline
EVIDENCE-005 src/lib/repositories/supabase-data-freshness-repository.ts reads from data_runs
EVIDENCE-006 src/lib/repositories/supabase-data-freshness-repository.ts does not read from data_freshness
EVIDENCE-007 src/lib/data-freshness.ts builds Supabase freshness snapshots from DataRunFreshnessRow[]
EVIDENCE-008 src/lib/cp3-remote-only-object-contracts.draft.ts marks data_freshness relationshipToDataRuns as unmapped_pending_decision
```

## Relationship Decision

```text
RELATIONSHIP-001 data_runs remains the current local runtime baseline for freshness behavior
RELATIONSHIP-002 data_freshness remains a remote-only freshness disclosure candidate
RELATIONSHIP-003 data_freshness must not replace data_runs until local migration, generated types, repository contract, and QA gates exist
RELATIONSHIP-004 runtime freshness UI must continue to rely on existing mock/public-safe state unless a separate gate authorizes Supabase reads
RELATIONSHIP-005 DATA_FRESHNESS_SOURCE must remain mock by default
RELATIONSHIP-006 DATA_FRESHNESS_SUPABASE_READS must remain disabled unless a separate runtime-read gate authorizes it
RELATIONSHIP-007 data_freshness reachability is not freshness quality evidence
RELATIONSHIP-008 data_freshness reachability is not row completeness evidence
RELATIONSHIP-009 data_freshness reachability is not public-readiness evidence
```

## Repository Guidance

```text
REPOSITORY-001 current repository contract remains data_runs-based
REPOSITORY-002 future repository abstraction may normalize data_runs and data_freshness into one DataFreshnessSnapshot boundary
REPOSITORY-003 future data_freshness adoption requires explicit object purpose: table, view, summary object, or replacement candidate
REPOSITORY-004 future adoption requires field-level mapping to DataRunFreshnessRow or a new explicit row type
REPOSITORY-005 future adoption requires stale/fresh semantics to be defined before UI copy depends on it
REPOSITORY-006 future adoption requires no secrets, row payloads, or raw market data in logs
```

## Role Review

```text
CEO-FINDING-001 this resolves a runtime ambiguity without slowing down global architecture work
CEO-FINDING-002 the project should continue using data_runs as the known baseline until data_freshness is contracted
PM-FINDING-001 next implementation work can design a repository abstraction without enabling Supabase reads
ENGINEERING-FINDING-001 no runtime import or query should target data_freshness yet
ENGINEERING-FINDING-002 data_runs is the only local-baselined freshness table in this slice
DATA-FINDING-001 data_freshness may become useful as a summary object, but its semantics are not proven
QA-FINDING-001 data_freshness must stay blocked from runtime until migration/type/repository tests exist
SECURITY-FINDING-001 no environment values or row payloads are needed for this note
LEGAL-FINDING-001 no freshness, market-data rights, global coverage, or investment-advice claim is approved
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

CEO direction is to preserve speed by narrowing the runtime dependency: `data_runs` remains the working baseline and `data_freshness` remains a future candidate. This allows the project to move into repository-abstraction design without accidentally enabling real data reads or promoting public readiness.

## Next Slice Recommendation

```text
NEXT-SLICE-001 create a local-only freshness repository abstraction plan
NEXT-SLICE-002 define acceptance checks for keeping DATA_FRESHNESS_SOURCE mock by default
NEXT-SLICE-003 keep data_freshness blocked from runtime repository usage
NEXT-SLICE-004 keep no SQL, no Supabase writes, no market-data ingestion, and no second remote attempt
```

## Verification Expectations

```text
scripts/check-cp3-data-freshness-to-data-runs-relationship-note.mjs passes
scripts/check-cp3-remote-only-object-draft-types.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
Next build passes
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
public claims remain blocked
```
