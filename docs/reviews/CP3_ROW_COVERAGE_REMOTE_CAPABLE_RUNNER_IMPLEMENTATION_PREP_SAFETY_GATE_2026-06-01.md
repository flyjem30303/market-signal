# CP3 Row Coverage Remote-Capable Runner Implementation Prep Safety Gate

Status: `CP3 row coverage remote-capable runner implementation prep safety gate recorded`

Decision: `APPROVE_NEXT_LOCAL_IMPLEMENTATION_SLICE_ONLY_NO_REMOTE_EXECUTION`

Trigger: `CP3 row coverage remote-capable runner design gate role review recorded`

## Scope

CEO authorizes the next local code implementation slice to prepare a guarded remote-capable row coverage runner path. This gate does not implement code in this slice, does not add a Supabase client in this slice, does not connect to Supabase, does not execute the runner, does not run SQL, does not write Supabase, does not write staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not output row payloads, does not print secrets, does not set `scoreSource=real`, does not award row coverage points, does not approve public claims, and does not promote CP3 readiness.

## Authorized Next Local Code Slice

```text
AUTHORIZED-001 modify scripts/run-row-coverage-readonly-once.mjs
AUTHORIZED-002 modify scripts/check-row-coverage-readonly-guarded-runner.mjs in the same slice
AUTHORIZED-003 keep package.json run:row-coverage-readonly unchanged
AUTHORIZED-004 keep scripts/check-review-gates.mjs from executing scripts/run-row-coverage-readonly-once.mjs
AUTHORIZED-005 permit exactly one approved import path: @supabase/supabase-js
AUTHORIZED-006 permit createClient only for the guarded readonly runner path
AUTHORIZED-007 require persistSession false when createClient appears
AUTHORIZED-008 read NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY without printing values
AUTHORIZED-009 keep NEXT_PUBLIC_SUPABASE_ANON_KEY presence-only for preflight compatibility
AUTHORIZED-010 target daily_prices only
AUTHORIZED-011 keep allowed symbols TWII, 0050, 006208, 2330, 2382, 2308
AUTHORIZED-012 keep requiredTradingSessions 60
AUTHORIZED-013 read aggregate counts only
AUTHORIZED-014 return sanitized totals and symbol identifiers only
AUTHORIZED-015 keep remote execution blocked during implementation validation
```

## Required Runtime Guard Conditions

```text
GUARD-001 missing confirmation must return status blocked
GUARD-002 missing confirmation must return remoteAttempted false
GUARD-003 missing confirmation must return connectionAttempted false
GUARD-004 preflight blocked must return remoteAttempted false
GUARD-005 preflight blocked must return connectionAttempted false
GUARD-006 confirmation value must remain CP3_ROW_COVERAGE_READONLY_VALIDATE
GUARD-007 confirmation variable must remain ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION
GUARD-008 any remote-capable branch must be unreachable without exact confirmation
GUARD-009 runner output must remain redacted JSON only
GUARD-010 canAwardRowCoveragePoints must remain false
GUARD-011 canClaimCoverage must remain false
GUARD-012 canSetScoreSourceReal must remain false
GUARD-013 publicDataSource must remain mock
GUARD-014 scoreSource must remain mock
GUARD-015 filesWritten must remain false
GUARD-016 mutations must remain false
GUARD-017 sqlExecuted must remain false
GUARD-018 secretsPrinted must remain false
GUARD-019 rowPayloadsPrinted must remain false
```

## Forbidden Implementation Paths

```text
FORBID-001 no insert
FORBID-002 no update
FORBID-003 no upsert
FORBID-004 no delete
FORBID-005 no rpc
FORBID-006 no storage
FORBID-007 no SQL mutation strings
FORBID-008 no fetch market data
FORBID-009 no parse market rows
FORBID-010 no writeFileSync
FORBID-011 no appendFileSync
FORBID-012 no console output of process.env values
FORBID-013 no key prefixes
FORBID-014 no key suffixes
FORBID-015 no key lengths
FORBID-016 no row payload output
FORBID-017 no sample row output
FORBID-018 no raw market data output
FORBID-019 no scoreSource=real
FORBID-020 no row coverage point award in runner
FORBID-021 no source-depth readiness promotion
FORBID-022 no CP3 readiness promotion
FORBID-023 no public claims
FORBID-024 no runner execution from scripts/check-review-gates.mjs
```

## Static Checker Upgrade Requirements

```text
CHECKER-001 allow @supabase/supabase-js only after this gate
CHECKER-002 allow createClient only if persistSession false is present
CHECKER-003 reject any relation other than daily_prices
CHECKER-004 reject forbidden write and SQL patterns
CHECKER-005 reject fetch and file writes
CHECKER-006 reject process.env value logging
CHECKER-007 reject key prefix, suffix, or length output
CHECKER-008 reject row payload and sample row output
CHECKER-009 verify fail-closed execution without confirmation
CHECKER-010 verify review gate does not execute the runner
CHECKER-011 verify publicDataSource mock
CHECKER-012 verify scoreSource mock
CHECKER-013 verify canAwardRowCoveragePoints false
CHECKER-014 verify canSetScoreSourceReal false
CHECKER-015 verify sqlExecuted false and mutations false
CHECKER-016 verify rowPayloadsPrinted false and secretsPrinted false
```

## Required Verification Order

```text
VERIFY-001 run check:row-coverage-remote-capable-runner-implementation-prep-safety-gate
VERIFY-002 run check:row-coverage-readonly-guarded-runner
VERIFY-003 run check:review-gates
VERIFY-004 run npm run build
VERIFY-005 run check:localhost-health
VERIFY-006 recover localhost if Next dev cache returns 500 after build
VERIFY-007 do not run run:row-coverage-readonly against Supabase in the implementation slice
VERIFY-008 do not run SQL
VERIFY-009 do not write Supabase
VERIFY-010 do not commit raw market data
```

## CEO Synthesis

This is the last local safety gate before a code implementation slice. The next slice should be larger and more direct: modify the guarded runner and its static checker together, prove fail-closed behavior locally, keep review gates local-only, and stop before any Supabase execution. This avoids further slow governance loops while preserving the boundaries that protect data, secrets, and public claims.

## Next Slice Recommendation

```text
NEXT-SLICE-001 implement guarded readonly aggregate-count path locally
NEXT-SLICE-002 update static checker to inspect the new code
NEXT-SLICE-003 run local checks and build only
NEXT-SLICE-004 keep Supabase execution for a later explicit one-attempt gate
NEXT-SLICE-005 leave public data source mock
NEXT-SLICE-006 leave scoreSource mock
NEXT-SLICE-007 leave row coverage points unawarded
NEXT-SLICE-008 leave CP3 not_ready
```

## Verification Expectations

```text
scripts/check-row-coverage-remote-capable-runner-implementation-prep-safety-gate.mjs passes
scripts/check-row-coverage-remote-capable-runner-design-gate-role-review.mjs passes
scripts/check-row-coverage-remote-capable-runner-design-gate.mjs passes
scripts/check-row-coverage-readonly-guarded-runner.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
Next build passes
localhost health passes
public data source remains mock
scoreSource=real remains blocked
row coverage points remain unawarded
CP3 remains not_ready
Supabase connection remains blocked in this slice
SQL execution remains blocked
public claims remain blocked
```
