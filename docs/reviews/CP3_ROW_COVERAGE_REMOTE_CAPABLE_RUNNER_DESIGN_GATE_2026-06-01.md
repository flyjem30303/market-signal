# CP3 Row Coverage Remote-Capable Runner Design Gate

Status: `CP3 row coverage remote-capable runner design gate recorded`

Decision: `PREPARE_ROW_COVERAGE_REMOTE_CAPABLE_RUNNER_IMPLEMENTATION_ONLY`

Trigger: `CP3 row coverage revised runner second attempt post-run review recorded`

## Scope

CEO authorizes preparation of a future implementation plan for making `scripts/run-row-coverage-readonly-once.mjs` remote-capable under strict confirmation. This gate does not modify the runner further, does not add a Supabase client, does not connect to Supabase, does not read remote rows, does not execute the command, does not run SQL, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not print secrets, does not set `scoreSource=real`, does not award row coverage points, does not approve public claims, and does not promote CP3 readiness.

## Current Implementation Baseline

```text
BASELINE-001 current file remains scripts/run-row-coverage-readonly-once.mjs
BASELINE-002 current runner remains fail-closed without confirmation
BASELINE-003 current runner loads only allowlisted process env from .env.local after confirmation
BASELINE-004 current runner reaches ready_for_guarded_readonly_decision when local preflight env is complete
BASELINE-005 current runner remains no-remote skeleton
BASELINE-006 current runner reports runner_skeleton_no_remote_execution
BASELINE-007 current runner reports remoteAttempted false
BASELINE-008 current runner reports connectionAttempted false
BASELINE-009 current runner reports filesWritten false
BASELINE-010 current runner reports mutations false
BASELINE-011 current runner reports sqlExecuted false
BASELINE-012 current runner reports secretsPrinted false
BASELINE-013 current runner reports rowPayloadsPrinted false
BASELINE-014 current runner reports canAwardRowCoveragePoints false
BASELINE-015 current runner reports canSetScoreSourceReal false
BASELINE-016 scripts/check-review-gates.mjs does not execute scripts/run-row-coverage-readonly-once.mjs
```

## Future Allowed Code Changes

```text
ALLOW-CHANGE-001 may import createClient from @supabase/supabase-js only after implementation approval
ALLOW-CHANGE-002 may instantiate Supabase client with persistSession false only after implementation approval
ALLOW-CHANGE-003 may read NEXT_PUBLIC_SUPABASE_URL without printing value
ALLOW-CHANGE-004 may read SUPABASE_SERVICE_ROLE_KEY without printing value
ALLOW-CHANGE-005 may keep NEXT_PUBLIC_SUPABASE_ANON_KEY as presence-only preflight input
ALLOW-CHANGE-006 may target daily_prices only
ALLOW-CHANGE-007 may read only aggregate counts grouped by allowed symbol and date window
ALLOW-CHANGE-008 may use head/count-style read-only queries when possible
ALLOW-CHANGE-009 may return sanitized symbol-level coverage counts without row payloads
ALLOW-CHANGE-010 may compute expectedTotalRows, observedTotalRows, missingRows, and coverageStatus
ALLOW-CHANGE-011 may keep canAwardRowCoveragePoints false until post-run review accepts evidence
ALLOW-CHANGE-012 may return redacted JSON status only
```

## Future Forbidden Code Paths

```text
FORBID-CODE-001 no insert
FORBID-CODE-002 no update
FORBID-CODE-003 no upsert
FORBID-CODE-004 no delete
FORBID-CODE-005 no rpc
FORBID-CODE-006 no storage
FORBID-CODE-007 no SQL strings for insert, update, delete, truncate, drop, alter, create, migration, or seed
FORBID-CODE-008 no fetch market data
FORBID-CODE-009 no parse market rows
FORBID-CODE-010 no writeFileSync
FORBID-CODE-011 no appendFileSync
FORBID-CODE-012 no console output of process.env values
FORBID-CODE-013 no key prefixes
FORBID-CODE-014 no key suffixes
FORBID-CODE-015 no key lengths
FORBID-CODE-016 no row payload output
FORBID-CODE-017 no sample row output
FORBID-CODE-018 no raw market data output
FORBID-CODE-019 no scoreSource=real
FORBID-CODE-020 no row coverage point award in runner
FORBID-CODE-021 no source-depth readiness promotion
FORBID-CODE-022 no CP3 readiness promotion
FORBID-CODE-023 no public claims
```

## Required Static Safety Checker

```text
STATIC-CHECK-001 must verify scripts/check-review-gates.mjs does not execute scripts/run-row-coverage-readonly-once.mjs
STATIC-CHECK-002 must verify only approved Supabase client import appears
STATIC-CHECK-003 must verify persistSession false appears if createClient appears
STATIC-CHECK-004 must verify target relation remains daily_prices only
STATIC-CHECK-005 must verify allowed symbols remain TWII, 0050, 006208, 2330, 2382, 2308
STATIC-CHECK-006 must verify requiredTradingSessions remains 60
STATIC-CHECK-007 must reject insert, update, upsert, delete, rpc, storage, SQL mutation strings, fetch, writeFileSync, and appendFileSync
STATIC-CHECK-008 must reject console output of environment values
STATIC-CHECK-009 must reject output of key prefixes, suffixes, or lengths
STATIC-CHECK-010 must reject output of row payloads
STATIC-CHECK-011 must reject output of raw market data
STATIC-CHECK-012 must verify filesWritten false
STATIC-CHECK-013 must verify mutations false
STATIC-CHECK-014 must verify sqlExecuted false
STATIC-CHECK-015 must verify secretsPrinted false
STATIC-CHECK-016 must verify rowPayloadsPrinted false
STATIC-CHECK-017 must verify canAwardRowCoveragePoints false
STATIC-CHECK-018 must verify canSetScoreSourceReal false
STATIC-CHECK-019 must verify publicDataSource mock
STATIC-CHECK-020 must verify scoreSource mock
```

## Future Output Contract

```text
OUTPUT-001 status: ok | blocked
OUTPUT-002 mode: row_coverage_readonly_remote_validation
OUTPUT-003 confirmation: present | missing_or_invalid
OUTPUT-004 preflightStatus: ready_for_guarded_readonly_decision | blocked
OUTPUT-005 targetRelation: daily_prices
OUTPUT-006 expectedSymbolCount: 6
OUTPUT-007 requiredTradingSessions: 60
OUTPUT-008 expectedTotalRows: 360
OUTPUT-009 observedTotalRows: number | not_run
OUTPUT-010 missingRows: number | not_run
OUTPUT-011 symbolsChecked: sanitized_list | not_run
OUTPUT-012 coverageStatus: ok | blocked | not_run
OUTPUT-013 calendarStatus: ok | blocked | not_run
OUTPUT-014 remoteAttempted: true | false
OUTPUT-015 connectionAttempted: true | false
OUTPUT-016 filesWritten: false
OUTPUT-017 mutations: false
OUTPUT-018 sqlExecuted: false
OUTPUT-019 secretsPrinted: false
OUTPUT-020 rowPayloadsPrinted: false
OUTPUT-021 publicDataSource: mock
OUTPUT-022 scoreSource: mock
OUTPUT-023 canAwardRowCoveragePoints: false
OUTPUT-024 canClaimCoverage: false
OUTPUT-025 canSetScoreSourceReal: false
OUTPUT-026 problems: sanitized_list
```

## Not Approved By This Gate

```text
NOT-APPROVED-001 do not change scripts/run-row-coverage-readonly-once.mjs further in this slice
NOT-APPROVED-002 do not add Supabase client in this slice
NOT-APPROVED-003 do not run scripts/run-row-coverage-readonly-once.mjs against Supabase
NOT-APPROVED-004 do not connect to Supabase
NOT-APPROVED-005 do not read remote rows
NOT-APPROVED-006 do not run SQL
NOT-APPROVED-007 do not run SQL migration
NOT-APPROVED-008 do not write Supabase
NOT-APPROVED-009 do not write staging rows
NOT-APPROVED-010 do not write daily_prices
NOT-APPROVED-011 do not create seed SQL
NOT-APPROVED-012 do not fetch market data
NOT-APPROVED-013 do not parse market rows
NOT-APPROVED-014 do not commit raw market rows
NOT-APPROVED-015 do not print environment values
NOT-APPROVED-016 do not print key prefixes, key suffixes, or key lengths
NOT-APPROVED-017 do not print row payloads
NOT-APPROVED-018 do not modify .env.local
NOT-APPROVED-019 do not set scoreSource=real
NOT-APPROVED-020 do not award row coverage points
NOT-APPROVED-021 do not clear source-depth not_ready
NOT-APPROVED-022 do not clear CP3 not_ready
NOT-APPROVED-023 do not make public claims
```

## Future Implementation Approval Requirements

```text
FUTURE-APPROVAL-001 role review must accept this implementation gate draft
FUTURE-APPROVAL-002 implementation slice must modify runner and static checker together
FUTURE-APPROVAL-003 implementation slice must run static safety checker before any remote execution
FUTURE-APPROVAL-004 implementation slice must keep aggregate review gate local-only
FUTURE-APPROVAL-005 implementation slice must keep command execution blocked unless exact confirmation is present
FUTURE-APPROVAL-006 implementation slice must not write report files unless a separate redacted retention gate is approved
FUTURE-APPROVAL-007 execution gate must be recorded after implementation review
FUTURE-APPROVAL-008 execution gate must be the only gate that can allow one remote run
FUTURE-APPROVAL-009 post-run review must precede any readiness, score, or public-claim change
```

## CEO Synthesis

This gate draft is the bridge from local pre-remote readiness into a narrow remote-capable row coverage implementation. The next code slice should add only the minimum confirmation-guarded read-only Supabase count path for `daily_prices`, keep row payloads invisible, keep all scoring and public readiness blocked, and still require a separate execution gate before any remote run.

## Next Slice Recommendation

```text
NEXT-SLICE-001 perform role review of this row coverage remote-capable runner design gate
NEXT-SLICE-002 verify code-change boundaries are narrow enough
NEXT-SLICE-003 verify static checker requirements are complete
NEXT-SLICE-004 verify current runner remains no-remote skeleton in this slice
NEXT-SLICE-005 keep scripts/check-review-gates.mjs from executing the runner
NEXT-SLICE-006 keep public data source mock
NEXT-SLICE-007 keep scoreSource=real blocked
NEXT-SLICE-008 keep row coverage points unawarded
NEXT-SLICE-009 keep CP3 not_ready
NEXT-SLICE-010 keep Supabase connection blocked until execution gate
```

## Verification Expectations

```text
scripts/check-row-coverage-remote-capable-runner-design-gate.mjs passes
scripts/check-row-coverage-revised-runner-second-attempt-post-run-review.mjs passes
scripts/check-row-coverage-readonly-guarded-runner.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
scoreSource=real remains blocked
row coverage points remain unawarded
CP3 remains not_ready
Supabase connection remains blocked
SQL execution remains blocked
public claims remain blocked
```
