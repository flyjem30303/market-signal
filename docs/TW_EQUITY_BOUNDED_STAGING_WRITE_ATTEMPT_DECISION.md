# TW Equity Bounded Staging Write Attempt Decision

Updated: 2026-06-06

Status: `tw_equity_bounded_staging_write_attempt_named_not_executed`.

## Purpose

This slice records the CEO decision to name exactly one bounded TW equity staging write attempt after PM intake review and candidate pre-execution validation became ready.

This is a decision gate only. It does not execute the write, connect to Supabase, run SQL, write staging rows, mutate production `daily_prices`, fetch or ingest market data, store raw payloads, print secrets, promote public source, award row coverage points, or set `scoreSource=real`.

## Named Attempt

| field | value |
| --- | --- |
| decision id | `TW-EQUITY-STAGING-WRITE-ATTEMPT-DECISION-2026-06-06-001` |
| decision status | `named_not_executed` |
| authorization id | `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001` |
| lane | `tw-equity` |
| symbols | `2330`, `2382`, `2308` |
| sessions | `60` |
| max rows | `180` |
| candidate artifact | `data/candidates/tw-equity-staging-candidate.json` |
| target relation set | `staging_twse_stock_day_runs`, `staging_twse_stock_day_prices` |
| post-run review artifact | `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md` |
| confirmation value | `CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE` |
| no retry | `true` |

## Exact Future Execution Command

The next execution slice may run exactly this command only after same-slice prechecks pass:

```powershell
$env:TW_EQUITY_STAGING_WRITE_CONFIRMATION='CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE'
node scripts/run-tw-equity-staging-write-once.mjs --authorization-id "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001" --lane "tw-equity" --symbols "2330,2382,2308" --sessions 60 --target "staging_twse_stock_day_runs,staging_twse_stock_day_prices" --max-rows 180 --post-run-review "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md" --candidate-input "data/candidates/tw-equity-staging-candidate.json" --rollback-dry-run --execute
```

## Required Immediate Prechecks

Before execution, PM must confirm in the same execution slice:

- `scripts/report-tw-equity-staging-write-execution-readiness.mjs` returns `tw_equity_staging_write_execution_ready_for_one_attempt`;
- PM intake review is ready for CEO bounded staging write decision;
- candidate pre-execution validation accepts 1 run row and 180 price rows;
- `.env.local` has the required Supabase URL and service-role key without printing them;
- rollback dry-run posture is present;
- exact command matches this packet;
- immediate sanitized post-run review will be recorded;
- no retry is allowed without a separate new decision.

No retry is allowed without a separate new decision.

## Still Blocked

- SQL text execution;
- any write outside `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices`;
- production `daily_prices` mutation;
- raw source payload storage or output;
- public redistribution, download, export, API reuse, or downstream copies;
- public source promotion;
- row coverage point award from this attempt alone;
- `scoreSource=real`;
- retry after any failure without a separate new decision.

## CEO / PM Decision

CEO decision: name exactly one bounded TW equity staging write attempt using the accepted sanitized candidate artifact.

PM decision: treat the next slice as an execution slice only if all immediate prechecks pass; otherwise stop and record a sanitized post-run or pre-run blocker review.

## Current Stop Line

The attempt is named but not executed.
