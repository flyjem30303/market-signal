# Phase 1.1 Data Stability Status

Updated: 2026-06-20

Status: `phase_1_1_core_symbol_freshness_gate_added`

Owner: CEO / PM mainline

## Purpose

Phase 1.1 focuses on keeping the Phase 1 public runtime trustworthy after launch:

- daily after-close update stability;
- ETF and listed-equity coverage monitoring;
- formal deployment observation;
- fail-closed behavior when data freshness regresses.

This document records the first Phase 1.1 gate: core-symbol freshness verification after the daily update loop.

## New Gate

Checker: `check:phase-1-1-core-symbol-freshness`

Workflow hook: `.github/workflows/daily-after-close-update.yml`

The gate verifies the Phase 1.1 core symbols one by one:

- `TWII`
- `2330`
- `0050`
- `006208`

For each symbol it requires:

- an active `stocks` row;
- a latest `daily_prices` date;
- a latest `daily_scores` date for `phase1-price-derived-v1`;
- matching latest price and score dates;
- aligned dates across all required core symbols;
- no calendar lag beyond the configured threshold.

This closes the earlier blind spot where table-level freshness could pass even if one ETF or TWII lagged behind.

## Current Evidence

Fresh local checks on 2026-06-20:

- `npm run check:daily-after-close-update`
  - status: `dry_run_ok`
  - source: `TWSE OpenAPI`
  - dataDate: `2026-06-18`
  - activeAssetsRead: `1086`
  - priceRowsPrepared: `1081`
  - scoreRowsPrepared: `1081`
- `npm run db:freshness`
  - status: `ok`
  - `daily_prices` data_end_date: `2026-06-18`
  - `daily_scores` data_end_date: `2026-06-18`
  - row_count: `1081` for each table
- `npm run check:phase-1-1-core-symbol-freshness`
  - status: `ok`
  - `TWII`: price `2026-06-18`, score `2026-06-18`
  - `2330`: price `2026-06-18`, score `2026-06-18`
  - `0050`: price `2026-06-18`, score `2026-06-18`
  - `006208`: price `2026-06-18`, score `2026-06-18`
- `npx tsc --noEmit`: passed
- `npm run build`: passed

## Next Phase 1.1 Work

1. Observe the next scheduled GitHub Actions run and confirm this new core-symbol gate passes in CI.
2. Add a compact coverage rollup for listed equities, separating:
   - expected active TWSE listed equities;
   - latest-date covered equities;
   - missing latest-date equities;
   - ETF baseline coverage versus full ETF Phase 1.1 deferral.
3. Keep public UI stable unless data-state wording becomes misleading.
4. Do not add news, valuation, or fund-flow modules until those data sources are explicitly adopted.

