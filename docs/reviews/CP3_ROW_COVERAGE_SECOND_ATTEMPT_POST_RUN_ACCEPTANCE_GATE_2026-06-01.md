# CP3 Row Coverage Second Attempt Post-Run Acceptance Gate

Status: `CP3 row coverage second attempt post-run acceptance gate recorded`

Decision: `POST_RUN_ACCEPTANCE_RULES_READY_REMOTE_EXECUTION_STILL_PAUSED`

Trigger: `CP3 row coverage second attempt readiness summary local_ready_remote_paused`

## Scope

This gate defines how to classify a future second Supabase readonly row coverage attempt after it runs. It does not run the confirmed command, does not connect to Supabase, does not run SQL, does not write Supabase, does not write staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not print secrets, does not output row payloads, does not print `stock_id` values, does not set `scoreSource=real`, does not award row coverage points, does not approve public claims, and does not promote CP3 readiness.

## Accepted Blocked Outcomes

```text
BLOCKED-ACCEPT-001 status blocked with stock_mapping_unavailable is accepted as diagnostic evidence only
BLOCKED-ACCEPT-002 status blocked with stock_mapping_missing is accepted as diagnostic evidence only
BLOCKED-ACCEPT-003 status blocked with count_unavailable is accepted as diagnostic evidence only
BLOCKED-ACCEPT-004 status blocked with aggregate_count_incomplete is accepted as diagnostic evidence only
BLOCKED-ACCEPT-005 blocked outcomes keep row coverage points unawarded
BLOCKED-ACCEPT-006 blocked outcomes keep scoreSource mock
BLOCKED-ACCEPT-007 blocked outcomes keep CP3 not_ready
```

## Accepted OK Outcome

```text
OK-ACCEPT-001 status ok requires aggregate_count_complete
OK-ACCEPT-002 status ok requires observedTotalRows 360
OK-ACCEPT-003 status ok requires missingRows 0
OK-ACCEPT-004 status ok requires six sanitized symbolsChecked entries
OK-ACCEPT-005 status ok requires no problems
OK-ACCEPT-006 status ok is row coverage evidence only
OK-ACCEPT-007 status ok does not approve scoreSource=real
OK-ACCEPT-008 status ok does not approve publicDataSource real
OK-ACCEPT-009 status ok does not approve public claims
OK-ACCEPT-010 status ok must proceed to post-run review before any readiness change
```

## Rejected Outcomes

```text
REJECT-001 any output containing stock_id is rejected
REJECT-002 any output containing raw rows is rejected
REJECT-003 any output containing Supabase URL is rejected
REJECT-004 any output containing anon key is rejected
REJECT-005 any output containing service role key is rejected
REJECT-006 any output containing key prefix, key suffix, or key length is rejected
REJECT-007 any output with sqlExecuted true is rejected
REJECT-008 any output with mutations true is rejected
REJECT-009 any output with rowPayloadsPrinted true is rejected
REJECT-010 any output with secretsPrinted true is rejected
REJECT-011 any output with canAwardRowCoveragePoints true is rejected
REJECT-012 any output with canSetScoreSourceReal true is rejected
```

## Required Post-Run Actions

```text
POSTRUN-001 record execution count exactly one
POSTRUN-002 record command exit code only
POSTRUN-003 record sanitized status, reason, and aggregate counts
POSTRUN-004 record symbolsChecked as symbol and observedRows only
POSTRUN-005 record no raw rows and no stock_id values
POSTRUN-006 keep publicDataSource mock
POSTRUN-007 keep scoreSource mock
POSTRUN-008 keep CP3 not_ready
POSTRUN-009 keep public claims blocked
POSTRUN-010 create a separate runtime activation gate before any public source promotion
POSTRUN-011 create a separate score-source gate before any scoreSource=real promotion
```

## Role Review

```text
CEO-FINDING-001 this is the last useful local post-run classification work before an approved readonly attempt
PM-FINDING-001 the project should not add more row coverage process gates unless a real run produces a new issue
ENGINEERING-FINDING-001 acceptance rules match the local sample validator and sanitized output contract
DATA-FINDING-001 ok row coverage is necessary but not sufficient for model or public readiness
SECURITY-FINDING-001 any secret, key metadata, raw row, or stock_id output invalidates the run
LEGAL-PUBLIC-CLAIMS-FINDING-001 public claims remain blocked until separate evidence gates pass
```

## Verification Expectations

```text
scripts/check-row-coverage-second-attempt-post-run-acceptance-gate.mjs passes
scripts/check-row-coverage-second-attempt-readiness-summary.mjs passes
scripts/check-row-coverage-second-attempt-output-sample-validation.mjs passes
scripts/check-row-coverage-second-attempt-sanitized-output-contract.mjs passes
scripts/check-review-gates.mjs passes
no second remote attempt occurs
SQL execution remains blocked
Supabase writes remain blocked
```
