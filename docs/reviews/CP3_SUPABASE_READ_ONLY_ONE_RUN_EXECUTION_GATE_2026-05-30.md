# CP3 Supabase Read-Only One-Run Execution Gate

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: guarded Supabase read-only validator accepted

Status: CP3 Supabase read-only one-run execution gate recorded

## Gate Decision

```text
APPROVE_ONE_FUTURE_READ_ONLY_VALIDATION_RUN
```

This gate records the CEO boundary for one future Supabase read-only validation
run. This document does not execute the validator, does not connect to
Supabase, does not run SQL, and does not approve any write path.

## Exact Future Command Scope

```text
COMMAND-001 npm run db:readonly-validate
COMMAND-002 require SUPABASE_READONLY_VALIDATE_CONFIRMATION=CP3_SUPABASE_READONLY_REMOTE_VALIDATE
COMMAND-003 require NEXT_PUBLIC_SUPABASE_URL to be present
COMMAND-004 require NEXT_PUBLIC_SUPABASE_ANON_KEY to be present
COMMAND-005 require SUPABASE_SERVICE_ROLE_KEY to be present
COMMAND-006 run only once per CEO execution decision
COMMAND-007 do not add the validator command to scripts/check-review-gates.mjs
COMMAND-008 do not run this command from aggregate local gates
```

## Approved Read-Only Checks

```text
READ-ONLY-001 daily_prices head true count exact select check
READ-ONLY-002 twse_stock_day_staging head true count exact select check
READ-ONLY-003 market_assets head true count exact select check
READ-ONLY-004 model_runs head true count exact select check
READ-ONLY-005 data_freshness head true count exact select check
READ-ONLY-006 rowLimit must remain 5 or lower
READ-ONLY-007 connection result may report reachable or blocked only through redacted JSON
READ-ONLY-008 object results may report reachable, blocked, or error only through redacted JSON
```

## Explicitly Forbidden During The Future Run

```text
FORBIDDEN-001 no SQL execution
FORBIDDEN-002 no SQL migration
FORBIDDEN-003 no Supabase writes
FORBIDDEN-004 no insert update upsert delete
FORBIDDEN-005 no RPC calls
FORBIDDEN-006 no storage calls
FORBIDDEN-007 no market-data fetch
FORBIDDEN-008 no market-row parsing
FORBIDDEN-009 no raw market rows committed
FORBIDDEN-010 no row payloads printed
FORBIDDEN-011 no environment values printed
FORBIDDEN-012 no key prefixes printed
FORBIDDEN-013 no key suffixes printed
FORBIDDEN-014 no key lengths printed
FORBIDDEN-015 no .env.local modification
FORBIDDEN-016 no scoreSource=real
FORBIDDEN-017 no CP3 source-depth readiness promotion
FORBIDDEN-018 no public claims
FORBIDDEN-019 no daily_prices writes
FORBIDDEN-020 no twse_stock_day_staging writes
FORBIDDEN-021 no seed SQL
FORBIDDEN-022 no schema changes
```

## Required Pre-Run Checks

```text
PRE-RUN-001 scripts/check-cp3-supabase-read-only-validator-skeleton.mjs passes
PRE-RUN-002 scripts/check-cp3-supabase-read-only-guarded-validator-implementation-review.mjs passes
PRE-RUN-003 scripts/check-cp3-supabase-read-only-one-run-execution-gate.mjs passes
PRE-RUN-004 scripts/check-review-gates.mjs passes
PRE-RUN-005 TypeScript noEmit passes
PRE-RUN-006 git status is reviewed before execution
PRE-RUN-007 operator confirms this is the single intended remote read-only run
```

## Required Output Contract

```text
OUTPUT-001 output must be JSON
OUTPUT-002 output must not include row payloads
OUTPUT-003 output must not include secrets
OUTPUT-004 output must include secretsPrinted false
OUTPUT-005 output must include rowPayloadsPrinted false
OUTPUT-006 output must include sqlExecuted false
OUTPUT-007 output must include mutations false
OUTPUT-008 output must include rpcCalled false
OUTPUT-009 output must include filesWritten false
OUTPUT-010 output must include scoreSourceRealChanged false
OUTPUT-011 output must include sourceDepthReadyChanged false
OUTPUT-012 output must include publicClaimsChanged false
```

## Stop Conditions

```text
STOP-001 stop if any required environment name is missing
STOP-002 stop if confirmation value is absent or different
STOP-003 stop if static checker fails
STOP-004 stop if aggregate gate fails
STOP-005 stop if TypeScript noEmit fails
STOP-006 stop if validator source changes after this gate without review
STOP-007 stop if command would print secrets or row payloads
STOP-008 stop if command would execute SQL or mutate data
STOP-009 stop if user requests real market ingestion in the same run
STOP-010 stop if public data source would change from mock
```

## Post-Run Review Requirements

```text
POST-RUN-001 record whether connection was reachable without printing secrets
POST-RUN-002 record object-level status without printing row payloads
POST-RUN-003 record any blocked object as a follow-up action
POST-RUN-004 record any error message only after confirming it contains no secret
POST-RUN-005 do not commit raw remote output if it contains sensitive material
POST-RUN-006 do not promote scoreSource=real from this run alone
POST-RUN-007 do not promote CP3 source-depth production gate from this run alone
POST-RUN-008 keep public data source mock until separate source-depth and data-quality gates pass
```

## Role Review

```text
CEO-FINDING-001 this is the narrowest useful bridge from local-only preparation to Supabase runtime evidence
CEO-FINDING-002 the gate is intentionally one-run and read-only
PM-FINDING-001 the next execution can be managed as a discrete checkpoint
PM-FINDING-002 this gate prevents the project from mixing validation with ingestion
ENGINEERING-FINDING-001 command scope matches the guarded validator implementation
ENGINEERING-FINDING-002 aggregate gate remains local-only
QA-FINDING-001 pre-run and post-run checks are explicit
DATA-FINDING-001 object checks cover the current CP3 Supabase readiness surface
SECURITY-FINDING-001 secret and row-payload redaction remains mandatory
LEGAL-FINDING-001 no public claim is created by this gate
```

## CEO Synthesis

```text
The project may proceed toward one future Supabase read-only validation run only
inside this exact boundary. The run is evidence gathering, not ingestion, not
SQL execution, not scoreSource=real, and not public readiness promotion.
```

## Next Slice Recommendation

```text
NEXT-SLICE-001 perform role review of this one-run execution gate
NEXT-SLICE-002 keep the actual validator unexecuted during the role review slice
NEXT-SLICE-003 after role review, decide whether to perform the single read-only run
NEXT-SLICE-004 if the run is performed later, immediately record a post-run review
NEXT-SLICE-005 keep public data source mock
NEXT-SLICE-006 keep CP3 source-depth production gate not_ready
```

## Verification Expectations

```text
scripts/check-cp3-supabase-read-only-one-run-execution-gate.mjs passes
scripts/check-cp3-supabase-read-only-guarded-validator-implementation-review.mjs passes
scripts/check-cp3-supabase-read-only-validator-skeleton.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
Supabase remote execution is not performed in this gate slice
SQL execution remains blocked
Supabase writes remain blocked
public data source remains mock
scoreSource=real remains blocked
CP3 source-depth production gate remains not_ready
public claims remain blocked
```
