# Data Population Route Decision

Updated: 2026-06-06

Status: `data_population_route_selected_design_only`.

Trigger: `docs/reviews/DATA_AUTHORIZATION_READONLY_ATTEMPT_POST_RUN_REVIEW_2026-06-06.md`.

## Decision

CEO selects the data population / backfill route as the next data-line main path.

This is design-only approval. It does not approve SQL, Supabase writes, staging rows, `daily_prices` mutation, market-data fetch, ingestion, raw-data storage, public source promotion, row coverage points, or `scoreSource=real`.

## Evidence

- Latest bounded readonly attempt reached Supabase.
- Outcome category: `aggregate_count_incomplete`.
- Expected rows: `360`.
- Observed rows: `5`.
- Missing rows: `355`.
- Runtime state remains mock.
- Score source remains mock.

## Why This Route

The blocker is no longer permission to read. The blocker is insufficient `daily_prices` coverage for the MVP symbol set.

Another readonly retry would likely repeat the same aggregate result. The next high-value work is to prepare a controlled population route that can later be reviewed for source rights, dry-run output, target table boundaries, rollback, and post-run review before any mutation.

## Selected Route

Selected route: `prepare_backfill_ingestion_design_gate`.

Required before any execution:

- source rights and attribution acceptance;
- target-table boundary: staging first or direct `daily_prices`, with RLS and service-role posture;
- report-only dry-run packet with expected symbols, sessions, row counts, validation rules, and sanitized output;
- rollback, cleanup, retention, and failure classification;
- post-run review before public source, score source, row coverage points, or readiness promotion.

## Lane Split

- A1 Data / Supabase / Market Evidence: prepare source-specific evidence and source-rights inputs for `TWII`, `0050`, `006208`, `2330`, `2382`, and `2308`.
- A2 Public Copy / UX Safety: keep public copy consistent with mock-only and incomplete-data messaging; no real-data or professional indicator claims.
- PM / Engineering mainline: keep the route gate, runtime guard, review gate, and progress panel aligned.

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

Create the backfill / ingestion design gate execution packet as a local-only packet:

- exact future authorization required;
- source-specific lanes;
- report-only dry-run contract;
- target-table write boundary;
- rollback and retention contract;
- post-run review template;
- checks that prove no remote execution occurred.
