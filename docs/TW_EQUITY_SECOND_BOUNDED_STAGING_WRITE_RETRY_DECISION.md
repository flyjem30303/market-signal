# TW Equity Second Bounded Staging Write Retry Decision

Date: 2026-06-06

Status: `tw_equity_second_bounded_staging_write_retry_named_not_executed`.

Decision: `AUTHORIZE_NEXT_SLICE_SECOND_BOUNDED_STAGING_WRITE_RETRY_IF_RUNNER_CONTRACT_ALIGNED`

Trigger: `docs/TW_EQUITY_PGRST205_ROOT_CAUSE_GATE.md` accepted that canonical staging objects are now readable through bounded read-only diagnostics after the first bounded write attempt failed closed with `run_insert_failed_PGRST205`.

## Scope

This packet names the next one-time retry decision only. It does not execute the retry. It does not modify the write runner. It preserves the no-retry rule by requiring a separate execution slice and a fresh post-run review artifact.

The previous bounded staging write decision is consumed. The next attempt must be treated as a second, separately named, bounded write retry.

## Retry Decision

| Field | Value |
| --- | --- |
| decision id | `TW-EQUITY-STAGING-WRITE-RETRY-DECISION-2026-06-06-001` |
| authorization id | `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002` |
| lane | `tw-equity` |
| symbols | `2330,2382,2308` |
| sessions | `60` |
| target relation set | `staging_twse_stock_day_runs`, `staging_twse_stock_day_prices` |
| candidate input artifact | `data/candidates/tw-equity-staging-candidate.json` |
| maximum price rows | `180` |
| fresh post-run review artifact | `docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md` |
| confirmation value | `CEO_APPROVED_TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_ONCE` |
| retry count authorized by this decision | `1` |

## Exact Future Command

This is the command shape for the next execution slice after runner contract alignment:

```powershell
$env:TW_EQUITY_STAGING_WRITE_CONFIRMATION='CEO_APPROVED_TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_ONCE'
node scripts/run-tw-equity-staging-write-once.mjs --authorization-id "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002" --lane "tw-equity" --symbols "2330,2382,2308" --sessions 60 --target "staging_twse_stock_day_runs,staging_twse_stock_day_prices" --max-rows 180 --post-run-review "docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md" --candidate-input "data/candidates/tw-equity-staging-candidate.json" --rollback-dry-run --execute
```

## Runner Alignment Requirement

The existing write runner was created for the first attempt and pins the first authorization id, confirmation value, and post-run review path. Before the retry execution slice, PM must align the runner contract or create a retry-specific guarded wrapper so that:

- authorization id is `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002`;
- confirmation value is `CEO_APPROVED_TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_ONCE`;
- post-run review path is `docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md`;
- candidate input, target relation set, symbols, sessions, max rows, rollback dry-run, and fail-closed behavior remain unchanged.

Runner alignment is not a write attempt. The actual retry remains blocked until a separate execution slice runs the exact command once.

## Preconditions

- PRECONDITION-001 `docs/TW_EQUITY_PGRST205_ROOT_CAUSE_GATE.md` status is `tw_equity_pgrst205_root_cause_gate_canonical_objects_readable_no_write_retry`.
- PRECONDITION-002 `data/candidates/tw-equity-staging-candidate.json` remains the accepted sanitized candidate input.
- PRECONDITION-003 target relation set remains `staging_twse_stock_day_runs,staging_twse_stock_day_prices`.
- PRECONDITION-004 maximum price rows remain `180`.
- PRECONDITION-005 public runtime remains `publicDataSource=mock`.
- PRECONDITION-006 scoring remains `scoreSource=mock`.

## Stop Lines

- STOP-001 this decision packet does not execute the retry.
- STOP-002 no SQL or migration command may be run in this packet.
- STOP-003 no write may target anything outside `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices`.
- STOP-004 no `daily_prices` mutation may occur.
- STOP-005 no market-data fetch or ingestion may occur.
- STOP-006 no raw source payloads, row payloads, or secrets may be printed.
- STOP-007 no row coverage point may be awarded from this packet.
- STOP-008 no public promotion or `scoreSource=real` may occur from this packet.
- STOP-009 no retry beyond this one named future attempt is authorized.

## Role Review

CEO finding: The project should move forward, but only by separating the retry decision from retry execution. This avoids another hidden write while removing unnecessary governance drag.

PM finding: The next mainline slice should be runner contract alignment for the second attempt, followed by immediate local checks. If alignment passes, the next slice can execute exactly one retry and produce the fresh post-run review.

Engineering finding: The retry command should reuse the existing guarded write path but cannot reuse the first attempt's pinned command contract without adjustment. Alignment must preserve fail-closed behavior and sanitized output.

Data finding: Candidate data remains unchanged and accepted at 1 run row plus 180 price rows. No new market-data fetch or candidate artifact generation is needed.

Security finding: Service-role use remains bounded to server-side guarded execution only. This packet prints no secrets and authorizes no public claims.

Investment finding: This packet does not improve investor-facing evidence yet. Real-data claims remain blocked until a successful post-run review and a separate promotion decision.

## CEO Verdict

Accepted as a second bounded staging write retry decision packet. The retry is named but not executed.

## Next Slice

NEXT-SLICE-001 align the guarded write runner contract for the second attempt without executing the write.

NEXT-SLICE-002 run local checks proving the second attempt command is accepted only with the second confirmation value and fresh post-run review path.

NEXT-SLICE-003 only after alignment passes, open a separate execution slice for exactly one bounded retry.
