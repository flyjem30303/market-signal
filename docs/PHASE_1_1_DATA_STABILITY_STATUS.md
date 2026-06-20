# Phase 1.1 Data Stability Status

Updated: 2026-06-20

Status: `phase_1_1_adjusted_listed_equity_coverage_gate_added`

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
2. Classify the listed-equity latest-date coverage gap:
   - active listed equities: `1083`
   - latest price coverage: `1078/1083` (`99.54%`)
   - latest score coverage: `1078/1083` (`99.54%`)
   - missing latest-date symbols: `1470`, `1538`, `1589`, `2380`, `8482`
3. Decide whether each missing symbol is:
   - a stale `stocks.is_active` metadata issue;
   - a suspended/no-trade latest-date condition that should be excluded from same-day coverage;
   - a parser/source matching issue;
   - or a genuine data gap requiring repair.
4. Keep public UI stable unless data-state wording becomes misleading.
5. Do not add news, valuation, or fund-flow modules until those data sources are explicitly adopted.

## Listed-Equity Coverage Rollup

Checker: `check:phase-1-1-listed-equity-coverage-rollup`

Workflow hook: `.github/workflows/daily-after-close-update.yml`

Current result on 2026-06-20: `ok`

Coverage policy:

- Keep raw active listed-equity coverage visible.
- Exclude symbols from the same-day adjusted denominator only when the latest TWSE payload either:
  - does not include the symbol; or
  - includes the symbol but has no parseable closing price.
- Do not treat these denominator exclusions as parser or symbol-mapping success.
- Continue to expose the excluded symbols and reasons for PM review.

Current raw coverage:

- active listed equities: `1083`
- latest price coverage: `1078/1083` (`99.54%`)
- latest score coverage: `1078/1083` (`99.54%`)
- raw missing latest-date symbols: `1470`, `1538`, `1589`, `2380`, `8482`

Current adjusted coverage:

- adjusted listed-equity denominator: `1078`
- adjusted price coverage: `1078/1078` (`100%`)
- adjusted score coverage: `1078/1078` (`100%`)
- excluded from same-day denominator: `5`

## Listed-Equity Gap Classification

Checker: `check:phase-1-1-listed-equity-gap-classification`

Current result on 2026-06-20: `review`

Classification summary:

- `parser_or_mapping_gap_candidate`: `0`
- `present_without_parseable_close`: `3`
  - `1470`
  - `1538`
  - `8482`
- `not_present_in_latest_twse_payload`: `2`
  - `1589`
  - `2380`

Interpretation:

- The five-symbol gap is not currently a parser or symbol-mapping defect.
- Three symbols are present in the TWSE latest payload but do not have a parseable closing price for the latest date.
- Two symbols are absent from the TWSE latest payload.
- These five symbols are excluded from the same-day adjusted coverage denominator while still remaining visible as raw latest-date coverage gaps.
- A separate metadata maintenance route may still decide later whether long-running absent symbols should remain `is_active=true`.

## Listed-Equity Metadata Maintenance Candidates

Checker: `check:phase-1-1-listed-equity-metadata-maintenance-candidates`

Current result on 2026-06-20: `review`

This checker is no-write decision support. It does not update `stocks.is_active`.

Current candidate split:

- keep active because the latest TWSE payload includes the symbol but has no parseable close: `3`
  - `1470`
  - `1538`
  - `8482`
- candidate inactive metadata review because the symbol is absent from the latest TWSE payload and lag exceeds 10 trading days: `2`
  - `1589` (`56` trading days behind)
  - `2380` (`16` trading days behind)

Next decision:

- Keep the adjusted coverage gate as the Phase 1.1 daily workflow gate.
- Review whether `1589` and `2380` should remain active in `stocks` before any metadata write.

## Deployment Observation

Main branch status on 2026-06-20:

- Phase 1.1 gates were fast-forwarded from `codex/phase1.1-data-stability` to `main`.
- `origin/main` includes the core-symbol freshness gate and adjusted listed-equity coverage gate.
- The latest visible scheduled GitHub Actions run before this update was run `#4`, created at `2026-06-19T17:28:37Z`, and failed before the Phase 1.1 gate changes were on `main`.
- The old run `#4` is not evidence that the new adjusted coverage gate fails.
- Public Vercel route health on 2026-06-20:
  - `https://market-signal-two.vercel.app/`: HTTP `200`
  - `https://market-signal-two.vercel.app/stocks/2330`: HTTP `200`
- Deployment observer:
  - checker: `check:phase-1-1-deployment-observation`
  - expected status before the next workflow run reaches current `origin/main`: `waiting_for_current_main_workflow_run`
  - failure status if public routes fail or the current-main workflow run completes unsuccessfully: `action_required`
- Manual workflow observation mode:
  - `workflow_dispatch` now defaults to `write_enabled=false`.
  - Manual default runs execute `run-daily-after-close-update.mjs` without `--write`, then run the same freshness and coverage gates.
  - Scheduled weekday runs still execute with `--write`.
- Next observation target: the next scheduled or manually dispatched `Daily after-close market data update` run on `main`.
