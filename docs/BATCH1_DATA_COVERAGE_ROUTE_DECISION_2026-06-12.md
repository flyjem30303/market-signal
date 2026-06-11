# Batch 1 Data Coverage Route Decision

Updated: 2026-06-12

Status: `batch1_data_coverage_route_selected_twii_first_design_only`.

Trigger: `docs/reviews/BATCH1_ROW_COVERAGE_READONLY_POST_RUN_REVIEW_2026-06-12.md`.

## Decision

CEO selects a `TWII`-first Batch 1 coverage repair route as the next PM mainline path.

This is design-only approval. It does not approve SQL, Supabase writes, staging rows, `daily_prices` mutation, market-data fetch, ingestion, raw-data storage, public source promotion, row coverage points, or `scoreSource=real`.

## Evidence

- Latest bounded readonly attempt reached Supabase.
- Outcome category: `aggregate_count_incomplete`.
- Expected rows: `360`.
- Observed rows: `182`.
- Missing rows: `178`.
- Complete lane: TW equity `2330`, `2382`, and `2308` are aggregate-complete at `180/180`.
- Incomplete lane: `TWII` is `0/60`.
- Incomplete lane: `0050` is `1/60`.
- Incomplete lane: `006208` is `1/60`.
- Runtime state remains mock.
- Score source remains mock.

## Why TWII First

The current blocker is no longer permission to read aggregate counts. The blocker is insufficient `daily_prices` coverage for Batch 1.

PM selects `TWII` first because it is the smallest bounded route that can close a meaningful part of the gap without expanding the symbol universe. It targets `60` missing rows and has more local source-rights and candidate-readiness scaffolding than the ETF lane. The ETF lane remains important, but it needs source-rights and redistribution evidence before any candidate or write route can open.

Another readonly retry would likely repeat the same aggregate result. The next high-value work is a `TWII` coverage repair packet that can later be reviewed for source rights, dry-run output, target table boundaries, rollback, and post-run review before any mutation.

## Selected Route

Selected route: `prepare_twii_coverage_repair_gate`.

Required before any execution:

- source rights and attribution acceptance for the selected `TWII` lane;
- `TWII` source-rights outcome accepted for the intended use;
- `TWII` field contract accepted for `daily_prices` mapping;
- sanitized candidate artifact accepted for the `60` missing rows;
- target-table boundary: staging first or direct `daily_prices`, with RLS and service-role posture;
- report-only dry-run packet with expected sessions, row counts, validation rules, and sanitized output;
- rollback, cleanup, retention, and failure classification;
- post-run review before public source, score source, row coverage points, or readiness promotion.

## Parallel Work Split

- PM / Engineering mainline: prepare the `TWII` coverage repair gate and keep review gates aligned.
- A1 Data / Supabase / Market Evidence: prepare source-specific coverage-gap checklist for `TWII`, `0050`, and `006208`; confirm what non-secret evidence is still needed before a write/backfill gate.
- A2 Public Copy / UX Safety: keep public copy consistent with mock-only and incomplete-data messaging; prepare the future copy shape for a coverage repair status without implying real-data launch.

## Non-Goals

- Do not run SQL.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not fetch, ingest, store, or commit raw market data.
- Do not print secrets or raw payloads.
- Do not retry the readonly attempt.
- Do not promote `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not award row coverage points.

## Next Slice

Create the `TWII` coverage repair gate as a local-only packet:

- exact future authorization required;
- bounded target `TWII`, `daily_prices`, and `60` missing rows;
- source-rights and field-contract prerequisite references;
- report-only dry-run contract;
- target-table write boundary;
- rollback and retention contract;
- post-run review template;
- checks that prove no remote execution occurred.
