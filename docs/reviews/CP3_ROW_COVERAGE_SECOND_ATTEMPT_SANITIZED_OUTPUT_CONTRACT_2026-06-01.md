# CP3 Row Coverage Second Attempt Sanitized Output Contract

Status: `CP3 row coverage second attempt sanitized output contract recorded`

Decision: `SANITIZED_OUTPUT_CONTRACT_READY_REMOTE_EXECUTION_STILL_PAUSED`

Trigger: `CP3 row coverage second attempt final local preflight recorded`

## Scope

This contract defines the only acceptable output shape for a future second Supabase readonly row coverage attempt. It does not run the confirmed command, does not connect to Supabase, does not run SQL, does not write Supabase, does not write staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not print secrets, does not print key prefixes, suffixes, or lengths, does not output row payloads, does not print `stock_id` values, does not set `scoreSource=real`, does not award row coverage points, does not approve public claims, and does not promote CP3 readiness.

## Required Output Fields

```text
OUTPUT-FIELD-001 mode
OUTPUT-FIELD-002 status
OUTPUT-FIELD-003 reason
OUTPUT-FIELD-004 remoteAttempted
OUTPUT-FIELD-005 connectionAttempted
OUTPUT-FIELD-006 preflightStatus
OUTPUT-FIELD-007 targetRelation
OUTPUT-FIELD-008 expectedSymbolCount
OUTPUT-FIELD-009 requiredTradingSessions
OUTPUT-FIELD-010 expectedTotalRows
OUTPUT-FIELD-011 observedTotalRows
OUTPUT-FIELD-012 missingRows
OUTPUT-FIELD-013 coverageStatus
OUTPUT-FIELD-014 calendarStatus
OUTPUT-FIELD-015 symbolsChecked with symbol and observedRows only
OUTPUT-FIELD-016 problems with sanitized symbol-level reasons only
OUTPUT-FIELD-017 filesWritten false
OUTPUT-FIELD-018 mutations false
OUTPUT-FIELD-019 sqlExecuted false
OUTPUT-FIELD-020 secretsPrinted false
OUTPUT-FIELD-021 rowPayloadsPrinted false
OUTPUT-FIELD-022 publicDataSource mock
OUTPUT-FIELD-023 scoreSource mock
OUTPUT-FIELD-024 canAwardRowCoveragePoints false
OUTPUT-FIELD-025 canClaimCoverage false
OUTPUT-FIELD-026 canSetScoreSourceReal false
```

## Forbidden Output

```text
FORBID-OUTPUT-001 no stock_id values
FORBID-OUTPUT-002 no raw rows
FORBID-OUTPUT-003 no price rows
FORBID-OUTPUT-004 no Supabase URL
FORBID-OUTPUT-005 no anon key
FORBID-OUTPUT-006 no service role key
FORBID-OUTPUT-007 no key prefix
FORBID-OUTPUT-008 no key suffix
FORBID-OUTPUT-009 no key length
FORBID-OUTPUT-010 no environment dump
FORBID-OUTPUT-011 no SQL text
FORBID-OUTPUT-012 no stack trace containing secrets
```

## Acceptance Rules

```text
ACCEPT-001 status ok only means aggregate count completeness; it does not approve scoreSource=real
ACCEPT-002 status blocked keeps row coverage points unawarded
ACCEPT-003 stock_mapping_unavailable is a blocked diagnostic result
ACCEPT-004 stock_mapping_missing is a blocked diagnostic result
ACCEPT-005 count_unavailable is a blocked diagnostic result
ACCEPT-006 aggregate_count_incomplete is a blocked diagnostic result
ACCEPT-007 aggregate_count_complete can move only to post-run review, not directly to public readiness
ACCEPT-008 any forbidden output invalidates the run for public claims
ACCEPT-009 post-run review must be created before any readiness change
ACCEPT-010 publicDataSource remains mock until a separate runtime activation gate accepts evidence
ACCEPT-011 scoreSource remains mock until a separate score-source gate accepts evidence
```

## Static Evidence

```text
EVIDENCE-001 runner printSanitized appends canAwardRowCoveragePoints false
EVIDENCE-002 runner printSanitized appends canClaimCoverage false
EVIDENCE-003 runner printSanitized appends canSetScoreSourceReal false
EVIDENCE-004 runner printSanitized appends filesWritten false
EVIDENCE-005 runner printSanitized appends mutations false
EVIDENCE-006 runner printSanitized appends publicDataSource mock
EVIDENCE-007 runner printSanitized appends rowPayloadsPrinted false
EVIDENCE-008 runner printSanitized appends scoreSource mock
EVIDENCE-009 runner printSanitized appends secretsPrinted false
EVIDENCE-010 runner printSanitized appends sqlExecuted false
EVIDENCE-011 runner symbolsChecked includes symbol and observedRows only
EVIDENCE-012 runner does not include stock_id in symbolsChecked
EVIDENCE-013 runner does not console.log process.env
```

## Role Review

```text
CEO-FINDING-001 this contract is enough; the project should not add more local-only gates before a future approved readonly attempt
PM-FINDING-001 this gives the post-run reviewer a short deterministic acceptance checklist
ENGINEERING-FINDING-001 runner output remains aggregate and deterministic
DATA-FINDING-001 output can distinguish stock mapping issues from row count incompleteness
SECURITY-FINDING-001 secrets and internal stock ids remain out of output
LEGAL-PUBLIC-CLAIMS-FINDING-001 no output from this runner can directly approve public claims
```

## Verification Expectations

```text
scripts/check-row-coverage-second-attempt-sanitized-output-contract.mjs passes
scripts/check-row-coverage-second-attempt-final-local-preflight.mjs passes
scripts/check-row-coverage-query-contract-revision-implementation-review.mjs passes
scripts/check-row-coverage-readonly-guarded-runner.mjs passes
scripts/check-review-gates.mjs passes
no second remote attempt occurs
SQL execution remains blocked
Supabase writes remain blocked
```
