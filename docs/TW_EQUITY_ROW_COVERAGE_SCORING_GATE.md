# TW Equity Row Coverage Scoring Gate

Status: `tw_equity_row_coverage_subscope_accepted_overall_coverage_blocked`

Date: 2026-06-07

## CEO Decision

CEO accepts the TW equity sub-scope coverage result after bounded production merge and post-merge readonly readback.

This gate does not promote the full MVP to real-data readiness. It records partial coverage progress and keeps public/scoring promotion blocked.

## Accepted Evidence

- Merge execution decision: `tw_equity_daily_prices_insert_missing_merge_execution_decision_ready_for_one_attempt`.
- Merge post-run review: `insert_missing_merge_passed_readback_complete`.
- Post-merge row coverage readback: `tw_equity_post_merge_row_coverage_readback_executed_overall_blocked_tw_equity_complete`.

## Coverage Scoring

TW equity sub-scope:

- symbols: `2330`, `2382`, `2308`;
- expected rows: `180`;
- observed rows: `180`;
- missing rows: `0`;
- sub-scope status: `accepted_complete`.

Full MVP row coverage:

- symbols: `TWII`, `0050`, `006208`, `2330`, `2382`, `2308`;
- expected rows: `360`;
- observed rows: `182`;
- missing rows: `178`;
- full-scope status: `blocked_incomplete`.

## Blocked Symbols

- `TWII`: `0/60`;
- `0050`: `1/60`;
- `006208`: `1/60`.

## Promotion Boundary

Still blocked:

- full MVP row coverage readiness;
- public source promotion;
- real score source promotion;
- public real-data claims;
- SQL execution;
- additional Supabase writes;
- market-data fetch or ingestion.

## Next Route

The next data coverage work should target the remaining blocked universe:

1. `TWII` index daily coverage route.
2. `0050` ETF daily coverage route.
3. `006208` ETF daily coverage route.

Each route needs its own source-rights boundary, candidate artifact, bounded write/readback path, and post-run review before public/scoring promotion can be considered.
