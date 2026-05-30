# CP3 Supabase Read-Only Validation Authorization Gate

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: mock-only runtime implementation review checkpoint accepted

Status: CP3 Supabase read-only validation authorization gate recorded

## CEO Decision

```text
AUTHORIZE_READ_ONLY_VALIDATION_DESIGN_ONLY
```

CEO authorizes the next safe slice to prepare a Supabase read-only validation
design. This gate does not authorize connecting to Supabase yet. This gate does
not authorize running SQL yet. This gate does not authorize reading remote rows
yet. This gate does not authorize writing any remote data.

## Authorized Next Slice Scope

```text
AUTHORIZED-SCOPE-001 define read-only validation purpose
AUTHORIZED-SCOPE-002 define exact future command boundary without executing it
AUTHORIZED-SCOPE-003 define required environment key presence checks without printing secrets
AUTHORIZED-SCOPE-004 define tables or views to inspect read-only later
AUTHORIZED-SCOPE-005 define maximum row limits for future read-only inspection
AUTHORIZED-SCOPE-006 define no-secret-output logging rules
AUTHORIZED-SCOPE-007 define pass/fail criteria for a future remote read-only run
AUTHORIZED-SCOPE-008 define rollback and stop conditions for future validation
```

## Environment Boundary

```text
ENV-BOUNDARY-001 may check whether NEXT_PUBLIC_SUPABASE_URL key name is documented
ENV-BOUNDARY-002 may check whether NEXT_PUBLIC_SUPABASE_ANON_KEY key name is documented
ENV-BOUNDARY-003 may check whether SUPABASE_SERVICE_ROLE_KEY key name is documented as server-only
ENV-BOUNDARY-004 must not print actual environment values
ENV-BOUNDARY-005 must not commit environment values
ENV-BOUNDARY-006 must not expose secret key prefixes or suffixes
ENV-BOUNDARY-007 must not write .env.local
ENV-BOUNDARY-008 must not modify Supabase project settings
```

## Explicitly Blocked Now

```text
BLOCKED-NOW-001 no Supabase connection
BLOCKED-NOW-002 no remote read-only query
BLOCKED-NOW-003 no SQL execution
BLOCKED-NOW-004 no SQL migration
BLOCKED-NOW-005 no Supabase writes
BLOCKED-NOW-006 no staging rows
BLOCKED-NOW-007 no daily_prices writes
BLOCKED-NOW-008 no seed SQL
BLOCKED-NOW-009 no market-data fetch
BLOCKED-NOW-010 no market-row parsing
BLOCKED-NOW-011 no scoreSource=real
BLOCKED-NOW-012 no source-depth readiness promotion
BLOCKED-NOW-013 no source-rights readiness promotion
BLOCKED-NOW-014 no public claims
BLOCKED-NOW-015 no production-ready wording
```

## Future Read-Only Validation Candidate Scope

```text
FUTURE-READONLY-001 future run may validate connection health only after separate execution approval
FUTURE-READONLY-002 future run may count selected tables only after separate execution approval
FUTURE-READONLY-003 future run may inspect schema metadata only after separate execution approval
FUTURE-READONLY-004 future run must use row limits
FUTURE-READONLY-005 future run must not insert rows
FUTURE-READONLY-006 future run must not update rows
FUTURE-READONLY-007 future run must not delete rows
FUTURE-READONLY-008 future run must not call RPC functions unless separately approved
FUTURE-READONLY-009 future run must not print secrets
FUTURE-READONLY-010 future run must not set scoreSource=real
```

## Candidate Future Tables Or Views

```text
CANDIDATE-OBJECT-001 daily_prices read-only later
CANDIDATE-OBJECT-002 twse_stock_day_staging read-only later
CANDIDATE-OBJECT-003 market_assets read-only later
CANDIDATE-OBJECT-004 model_runs read-only later
CANDIDATE-OBJECT-005 data_freshness read-only later
```

These candidate objects are not queried by this gate.

## Required Approval Before Any Remote Action

```text
REMOTE-APPROVAL-001 CEO must record a separate remote read-only execution approval gate
REMOTE-APPROVAL-002 PM must name exact command and expected output
REMOTE-APPROVAL-003 Engineering must confirm command cannot write data
REMOTE-APPROVAL-004 QA must confirm row limits and redacted logging
REMOTE-APPROVAL-005 Data must confirm no staging or daily_prices write path exists
REMOTE-APPROVAL-006 Legal must confirm no public claim or real-data readiness wording is implied
REMOTE-APPROVAL-007 Security must confirm secrets are not printed, committed, or transmitted outside Supabase auth flow
```

## CEO Resolution

```text
CEO accelerates toward Supabase by authorizing read-only validation design now
CEO does not authorize remote connection in this gate
CEO does not authorize SQL execution in this gate
CEO does not authorize market-data ingestion in this gate
CEO does not authorize scoreSource=real in this gate
CEO directs PM to prepare the read-only validation design next
```

## Verification Expectations

```text
scripts/check-cp3-supabase-read-only-validation-authorization-gate.mjs passes
scripts/check-cp3-mock-only-runtime-implementation-review-checkpoint.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
scoreSource=real remains blocked
CP3 source-depth production gate remains not_ready
Supabase connection remains blocked
SQL execution remains blocked
public claims remain blocked
```
