# Phase 1 Current-Scope Actual Bounded Write External Execution Runbook No-Execution

## Status

Status: `phase_1_current_scope_actual_bounded_write_external_execution_runbook_no_execution_ready`

Decision: `PREPARE_EXTERNAL_EXECUTION_RUNBOOK_KEEP_MOCK_UNTIL_POST_RUN_REVIEW`

Current route: `await_explicit_external_current_scope_actual_bounded_write_execution_outside_no_execution_gates`

Universe: `twii_plus_listed_stock_daily_close`

Excluded for Phase 1: `0050`, `006208`, `etf_all_phase_1_1`

## CEO Rationale

This is the final local runbook package before a separate external operator may choose to execute one bounded write attempt. It keeps the repository in no-execution mode while removing ambiguity from the next step. The runbook defines the attempt limit, dry-run requirement, insert-missing-only scope, post-run review requirement, and rollback/quarantine default.

This package does not contain SQL, runtime secret values, env values, command values, candidate rows, raw market data, stock id payloads, or a live execution request.

## Runbook Contract

- `maxAttemptCount=1`
- `dryRunFirstRequired=true`
- `insertMissingOnlyRequired=true`
- `actualWriteAttemptAllowedHere=false`
- `publicDataSource=mock`
- `scoreSource=mock`

The external operator must have all required inputs outside this repository before any real attempt can be considered:

- Accepted actual execution final-go packet.
- Server-only runtime values present outside repo artifacts.
- Sanitized candidate artifact path.
- Explicit execute switch.
- Confirmation phrase.
- Post-run review output path.

## Post-Run Review

- `postRunReview.required=true`
- `postRunReview.aggregateOnly=true`
- Required timing: immediate after the attempt.

The post-run review must record only aggregate review fields: attempt id, inserted rows, rejected rows, duplicate rows, readback rows, mutation summary, problems, and promotion recommendation.

## Rollback Or Quarantine

- `rollbackOrQuarantine.defaultAction=quarantine_then_keep_mock`

Promotion remains blocked until the post-run review passes. If inserted rows exceed expectation, duplicate rows are non-zero, readback mismatches, unexpected symbols appear, unexpected date windows appear, or runner problems are non-empty, the default decision is quarantine and keep mock runtime.

## Next Route

`external_operator_may_execute_one_bounded_attempt_then_post_run_review_or_keep_mock`

If the operator does not execute externally, keep mock runtime and continue product/runtime work. If an external attempt is executed, return only an aggregate post-run review; do not paste secrets, env values, row payloads, raw payloads, or stock id payloads into project files.

## Verification

```powershell
cmd.exe /c scripts\with-node20.cmd npm run check:phase-1-current-scope-actual-bounded-write-external-execution-runbook-no-execution
cmd.exe /c scripts\with-node20.cmd npm run check:review-gates
```
