# TW Equity Write Pre-Execution Summary

Updated: 2026-06-06

Status: `tw_equity_write_pre_execution_summary_ready_not_mutating`.

## Purpose

This slice adds a local pre-execution summary for the future TW equity bounded staging write.

It does not execute the write. It only lets `scripts/run-tw-equity-staging-write-once.mjs` summarize whether the future one-attempt write packet has the minimum local inputs needed before a separate write-capable implementation and execution gate exists.

## CEO Decision

CEO decision: complete the local pre-execution summary before implementing any Supabase mutation. This keeps the next bounded write decision narrow: the future execution gate should see candidate counts, rollback scope, post-run review requirement, and no-promotion locks in one sanitized runner output.

## Readiness Inputs

`writePreExecutionSummary.ready` may be true only when all of these are true:

- exact command contract is matched;
- `TW_EQUITY_STAGING_WRITE_CONFIRMATION` is present and equals the approved confirmation phrase;
- `NEXT_PUBLIC_SUPABASE_URL` is present;
- `SUPABASE_SERVICE_ROLE_KEY` is present;
- sanitized candidate input artifact is accepted;
- `--rollback-dry-run` is present;
- rollback dry-run count is ready.

## Summary Output Contract

The runner may output:

- `writePreExecutionSummaryReady`;
- `writePreExecutionSummary.ready`;
- `writePreExecutionSummary.candidateRunRows`;
- `writePreExecutionSummary.candidatePriceRows`;
- `writePreExecutionSummary.rollbackScopeRunId`;
- `writePreExecutionSummary.rollbackScopeTargetRelation`;
- `writePreExecutionSummary.postRunReviewRequired=true`;
- `writePreExecutionSummary.noRetry=true`;
- `writePreExecutionSummary.blockedUntilSeparateWriteImplementation=true`.

The summary must keep:

- `writePreExecutionSummary.writeImplementationReady=false`;
- `writePreExecutionSummary.connectionPlanned=false`;
- `writePreExecutionSummary.sqlPlanned=false`;
- `writePreExecutionSummary.mutationsPlanned=false`;
- `writePreExecutionSummary.destructiveRollbackAllowed=false`;
- `writePreExecutionSummary.publicPromotionAllowed=false`;
- `writePreExecutionSummary.rowCoveragePointsAllowed=false`;
- `writePreExecutionSummary.scoreSourcePromotionAllowed=false`.

## Stop Line

Even if `writePreExecutionSummaryReady=true`, the runner still exits blocked in execution mode because `runner_skeleton_has_no_supabase_write_implementation` remains active.

No SQL, Supabase connection, Supabase write, staging row creation, production `daily_prices` mutation, market-data fetch, market-data ingestion, source payload output, row payload output, secret output, public promotion, row coverage points, or `scoreSource=real` occurred.
