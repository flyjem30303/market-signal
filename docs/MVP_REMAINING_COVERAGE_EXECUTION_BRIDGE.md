# MVP Remaining Coverage Execution Bridge

Status: `mvp_remaining_coverage_execution_bridge_ready_source_rights_split`

Date: 2026-06-07

## CEO Decision

CEO keeps the active data-coverage GOAL focused on Level 1 MVP row coverage `360/360`.

The remaining MVP gap is now small enough to split into two source-specific execution lanes instead of another broad governance loop:

1. `TWII` index lane: `60` missing rows.
2. ETF lane for `0050` and `006208`: `118` missing rows.

This bridge does not execute either lane. It defines the exact next execution-readiness requirements so PM can move directly into the first source-specific candidate artifact path when source-rights and field contracts are accepted.

## Current Coverage State

Latest accepted row coverage state:

- MVP universe: `TWII`, `0050`, `006208`, `2330`, `2382`, `2308`.
- Session policy: `60` sessions per symbol.
- Expected rows: `360`.
- Observed rows: `182`.
- Missing rows: `178`.
- Complete sub-scope: TW equity `2330`, `2382`, `2308` is `180/180`.
- Remaining index sub-scope: `TWII` is `0/60`.
- Remaining ETF sub-scope: `0050` is `1/60` and `006208` is `1/60`, or `2/120`.

## Lane Priority

PM should prioritize the `TWII` lane first if source-rights review can accept internal testing and validation use, because:

- the missing count is bounded at `60`;
- there is already a local report-only probe skeleton at `scripts/run-twii-report-only-probe-once.mjs`;
- `daily_prices` allows nullable `volume` and `turnover`, so index rows can fit the production table shape if the field contract accepts null volume/turnover;
- completing `TWII` would move MVP coverage from `182/360` to `242/360`.

ETF remains the larger missing block at `118` rows, but current ETF source evidence remains blocked by `legal_and_redistribution_terms_unapproved`. ETF candidate generation should not begin until the source-rights outcome changes.

## TWII Index Lane Readiness

Before any `TWII` row can be written to staging or `daily_prices`, PM must have:

1. Source-rights decision for `official-exchange-index` that allows internal storage and derived validation for the selected coverage window.
2. Field contract for index OHLC fields mapped to `daily_prices.open`, `daily_prices.high`, `daily_prices.low`, and `daily_prices.close`.
3. Explicit nullable policy for `daily_prices.volume` and `daily_prices.turnover`.
4. Sanitized candidate artifact shape for exactly `60` target sessions or a documented calendar reason for a different count.
5. Candidate validation gate that rejects duplicate trade dates, non-numeric OHLC values, unsorted sessions, missing stock mapping, and unexpected source id.
6. Bounded staging-first write decision or an explicit proof that staging is unnecessary.
7. Post-run review and bounded production readback before any row coverage credit.

The existing `scripts/run-twii-report-only-probe-once.mjs` remains report-only. It is not an ingestion runner, does not write files, and does not award row coverage points.

## ETF Lane Readiness

Before any `0050` or `006208` row can be written to staging or `daily_prices`, PM must have:

1. ETF source-rights decision outcome that closes `legal_and_redistribution_terms_unapproved` for internal storage and derived validation.
2. ETF field contract that separates market-price OHLCV coverage from ETF NAV, premium/discount, holdings, and issuer metadata.
3. Candidate source decision among TWSE official ETF disclosures, issuer official pages, or licensed vendor.
4. Sanitized ETF candidate artifact shape for exactly `118` missing rows or a documented calendar/duplicate reason for a different count.
5. Candidate validation gate that rejects duplicate trade dates, mixed source-rights status, missing price fields, and unauthorized source lanes.
6. Bounded staging-first write decision or explicit safe reuse decision for a proven runner.
7. Post-run review and bounded production readback before any row coverage credit.

ETF currently stays blocked because `data/source-gates/etf-source-gate.json` and `data/source-gates/etf-source-due-diligence.json` keep the source decision blocked.

## Shared Candidate Artifact Contract

Each remaining lane must produce a sanitized artifact before write execution. The artifact must include:

- `authorization_id`;
- `lane_id`;
- `symbols`;
- `expected_sessions`;
- `expected_rows`;
- `source_id`;
- `source_rights_status`;
- `coverage_window`;
- `calendar_policy`;
- `target_relation`;
- `rows_sanitized_count`;
- `duplicate_trade_date_count`;
- `missing_session_count`;
- `field_parse_failure_count`;
- `quality_flags`;
- `post_run_review_path`.

The artifact must not include raw payloads, row payload dumps, secrets, service-role keys, or external-source response bodies.

## Promotion And Scoring Boundary

This bridge does not approve:

- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- market-data fetch;
- market-data ingestion;
- raw market-data storage;
- row payload output;
- stock id payload output;
- secret output;
- row coverage points;
- public source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`.

`publicDataSource=mock` and `scoreSource=mock` remain required until a separate runtime promotion gate accepts coverage, source rights, data quality, model credibility, and public-claim readiness.

## Next PM Route

The next highest-value mainline slice is a `TWII` source-rights and candidate artifact readiness packet. It should reuse the existing report-only probe contract as evidence that a sanitized aggregate probe path exists, but it must stop before remote execution unless the packet explicitly names one bounded attempt and immediate post-run review.

If the `TWII` source-rights packet remains blocked, PM should switch to the ETF source-rights outcome intake route and keep execution blocked until legal/source terms are accepted.
