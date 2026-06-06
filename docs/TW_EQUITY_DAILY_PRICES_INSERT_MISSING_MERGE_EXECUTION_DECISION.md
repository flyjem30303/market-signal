# TW Equity Daily Prices Insert-Missing Merge Execution Decision

Status: `tw_equity_daily_prices_insert_missing_merge_execution_decision_ready_for_one_attempt`

Date: 2026-06-07

## CEO Decision

CEO authorizes PM to execute exactly one bounded production `daily_prices` merge using the accepted `AUTH-003` staging candidate and the implemented fail-closed runner.

This decision exists because the prior authorization packet approved the insert-missing/skip-existing policy and runner preparation, while the runner implementation explicitly required a separate execution decision before any real Supabase mutation.

## Execution Scope

- Authorization id: `TW-EQUITY-DAILY-PRICES-MERGE-2026-06-07-AUTH-001`.
- Confirmation value: `CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE`.
- Staging scope: `AUTH-003`.
- Candidate input: `data/candidates/tw-equity-staging-candidate.json`.
- Policy id: `insert_missing_skip_existing_no_overwrite`.
- Runner: `scripts/run-tw-equity-daily-prices-insert-missing-merge-once.mjs`.
- Post-run review: `docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_2026-06-07.md`.

## Expected Sanitized Counts

- candidate rows: `180`;
- expected existing exact-match skipped rows: `3`;
- expected inserted rows: `177`;
- expected conflicts: `0`;
- expected final target rows after write: `180`.

## Exact Command

```powershell
$env:TW_EQUITY_DAILY_PRICES_MERGE_CONFIRMATION='CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE'; node --env-file=.env.local scripts/run-tw-equity-daily-prices-insert-missing-merge-once.mjs --authorization-id TW-EQUITY-DAILY-PRICES-MERGE-2026-06-07-AUTH-001 --staging-scope AUTH-003 --policy-id insert_missing_skip_existing_no_overwrite --candidate-input data/candidates/tw-equity-staging-candidate.json --post-run-review docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_2026-06-07.md --confirm-bounded-daily-prices-merge --execute
```

## Required Immediate Post-Run Review

The execution must write a post-run review and record only sanitized aggregate evidence:

- execution status;
- inserted rows;
- skipped existing rows;
- final target rows after write;
- conflicts;
- whether mutation occurred;
- whether public/scoring promotion remains blocked.

## Boundaries

Allowed by this decision:

- one bounded Supabase connection through the runner;
- one insert-only `daily_prices` mutation attempt for missing candidate rows;
- immediate aggregate readback after the attempted insert;
- sanitized post-run review output.

Still forbidden:

- SQL execution;
- dashboard/manual data edits;
- `daily_prices` update/upsert/delete;
- overwriting existing production rows;
- printing secrets, stock ids, raw row payloads, or raw market/source payloads;
- running the command more than once in this decision slice;
- awarding row coverage points in this decision slice;
- setting `publicDataSource=supabase`;
- setting `scoreSource=real`;
- making public real-data claims.

## Next Slice

After the one bounded execution, PM must validate the post-run review with a local checker, then create or update a production readback/row coverage scoring gate. Row coverage points remain blocked until that separate gate accepts the production readback evidence.
