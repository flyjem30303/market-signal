# TW Equity Daily Prices Insert-Missing Merge Runner Implementation

Status: `tw_equity_daily_prices_insert_missing_merge_runner_implemented_not_executed`

Date: 2026-06-07

## CEO Decision

The insert-missing/skip-existing merge policy is now ready for a fail-closed runner implementation. This implementation is write-capable, but real Supabase execution remains blocked until a separate execution decision is accepted.

## Runner

- Runner: `scripts/run-tw-equity-daily-prices-insert-missing-merge-once.mjs`.
- Authorization id: `TW-EQUITY-DAILY-PRICES-MERGE-2026-06-07-AUTH-001`.
- Staging scope: `AUTH-003`.
- Candidate input: `data/candidates/tw-equity-staging-candidate.json`.
- Policy id: `insert_missing_skip_existing_no_overwrite`.
- Confirmation value: `CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE`.
- Mock flag for local checker: `TW_EQUITY_DAILY_PRICES_MERGE_MOCK_SUPABASE=enabled`.
- Expected insert rows: `177`.
- Expected skip rows: `3`.
- Expected final target rows: `180`.

## Exact Command

```powershell
$env:TW_EQUITY_DAILY_PRICES_MERGE_CONFIRMATION='CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE'; node --env-file=.env.local scripts/run-tw-equity-daily-prices-insert-missing-merge-once.mjs --authorization-id TW-EQUITY-DAILY-PRICES-MERGE-2026-06-07-AUTH-001 --staging-scope AUTH-003 --policy-id insert_missing_skip_existing_no_overwrite --candidate-input data/candidates/tw-equity-staging-candidate.json --post-run-review docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_2026-06-07.md --confirm-bounded-daily-prices-merge --execute
```

## Fail-Closed Contract

The runner blocks unless all are true:

- authorization id matches exactly;
- staging scope is exactly `AUTH-003`;
- policy id is exactly `insert_missing_skip_existing_no_overwrite`;
- candidate input path is exact and validates to `180` rows;
- confirmation flag is present;
- confirmation env var equals `CEO_APPROVED_TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_ONCE`;
- credentials are present;
- post-run review path is under `docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_*.md`.

## Mutation Policy

The only permitted mutation is `.insert()` into `daily_prices` for missing candidate rows.

Forbidden:

- `.update()`;
- `.upsert()`;
- `.delete()`;
- overwrite existing rows;
- print row payloads;
- print stock ids;
- print secrets or raw market/source payloads.

## Sanitized Post-Run Counts

The runner outputs only aggregate counts:

- candidate rows;
- inserted rows;
- skipped existing rows;
- final target rows after write;
- conflicting rows.

## Boundary

This implementation slice does not execute real Supabase write. It only implements the runner and local mock verification.

Still blocked:

- real production merge execution;
- row coverage points;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public real-data claims.

## Next Slice

After local checks pass, CEO may authorize exactly one bounded real merge execution. That execution must write a post-run review and immediately preserve mock public/scoring state until a separate production readback and row coverage scoring gate accepts the result.
