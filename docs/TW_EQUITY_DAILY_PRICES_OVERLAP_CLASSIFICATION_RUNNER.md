# TW Equity Daily Prices Overlap Classification Runner

Status: `tw_equity_daily_prices_overlap_classification_executed_idempotent_safe_partial_overlap`

Date: 2026-06-07

## CEO Decision

The blocked `staging-to-daily_prices` remote preflight found `3` existing production target rows. CEO directs PM to classify this overlap before any production merge design can proceed.

This slice implements the bounded readonly overlap-classification runner and records exactly one real bounded readonly execution in `docs/reviews/TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_POST_RUN_REVIEW_2026-06-07.md`.

## Runner

- Runner: `scripts/run-tw-equity-daily-prices-overlap-classification-once.mjs`.
- Authorization id: `TW-EQUITY-DAILY-PRICES-OVERLAP-CLASSIFY-2026-06-07-AUTH-001`.
- Staging scope: `AUTH-003`.
- Candidate input: `data/candidates/tw-equity-staging-candidate.json`.
- Confirmation value: `CEO_APPROVED_TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_ONCE`.
- Mock flag for local checker: `TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_MOCK_SUPABASE=enabled`.
- Target relation read scope: `stocks`, `daily_prices`, and accepted candidate artifact only.

## Exact Command

```powershell
$env:TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_CONFIRMATION='CEO_APPROVED_TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_ONCE'; node --env-file=.env.local scripts/run-tw-equity-daily-prices-overlap-classification-once.mjs --authorization-id TW-EQUITY-DAILY-PRICES-OVERLAP-CLASSIFY-2026-06-07-AUTH-001 --staging-scope AUTH-003 --candidate-input data/candidates/tw-equity-staging-candidate.json --post-run-review docs/reviews/TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_POST_RUN_REVIEW_2026-06-07.md --confirm-bounded-readonly-overlap-classification --execute
```

## Sanitized Output

The runner may output only:

- `expected_candidate_rows`;
- `candidate_symbol_count`;
- `candidate_unique_trade_date_count`;
- `existing_overlap_count`;
- `exact_value_match_count`;
- `conflicting_overlap_count`;
- `missing_insert_candidate_count`;
- per-symbol aggregate counts using public symbols only.

The runner must not print row payloads, stock ids, secrets, raw market payloads, source payloads, or SQL text.

## Classification Rules

- `no_overlap_insert_all_candidates_possible`: existing overlap count is `0`.
- `idempotent_safe_partial_overlap_skip_existing_insert_missing`: every existing overlap row also matches candidate values by aggregate exact-value count.
- `blocked_conflicting_overlap_requires_reconciliation`: existing overlap count is greater than exact-value match count.

Passing classification does not authorize production merge. It only allows PM to prepare a separate insert-missing/skip-existing production merge authorization packet.

## 2026-06-07 Execution Result

- Status: `overlap_classification_passed_idempotent_safe_partial_overlap`.
- Classification: `idempotent_safe_partial_overlap_skip_existing_insert_missing`.
- Candidate rows: `180`.
- Existing overlap rows: `3`.
- Exact value match rows: `3`.
- Conflicting overlap rows: `0`.
- Missing insert candidate rows: `177`.
- Overlap ratio: `0.0167`.

The overlap is idempotent-safe for merge preparation only. It does not authorize production merge.

## Safety Boundary

- SQL execution: `false`.
- Supabase write: `false`.
- `daily_prices` mutation: `false`.
- Row coverage points awarded: `false`.
- `publicDataSource`: `mock`.
- `scoreSource`: `mock`.

## Next Slice

Prepare a separate insert-missing/skip-existing production merge authorization packet. It must preserve the `3` existing rows, insert only the `177` missing candidate rows, and remain fail-closed until a separate bounded write authorization is accepted.
