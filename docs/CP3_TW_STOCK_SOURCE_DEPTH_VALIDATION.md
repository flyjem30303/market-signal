# CP3 Taiwan Stock Source Depth Validation

Status: not ready

Purpose:

- Confirm whether current Taiwan stock data is deep enough for CP3 backtests.
- Separate latest-row dry-run capability from historical validation readiness.
- Prevent dry-run output from being mistaken for backtest evidence.

## Current Source

```text
supabase/seed/002_seed_latest_market_data.sql
```

This file is a latest-row bootstrap seed. It is useful for smoke tests and
limited dry-run reports, but it is not historical backtest data.

## Minimum Depth Requirement

Before CP3 backtest implementation:

```text
price history: at least 756 trading dates
fundamental / valuation history: at least 252 trading dates
preferred start date: 2020-01-01 or earlier
continuous symbol coverage: documented
corporate-action handling: documented
inactive / delisted symbol handling: documented
```

## Current Expected Result

```text
status: not_ready
price-history-depth-not-ready
fundamental-history-depth-not-ready
price-history-starts-after-2020-01-01
fundamental-history-starts-after-2020-01-01
```

## Gate

```text
npm run check:cp3-tw-stock-source-depth
```

This gate is expected to return `not_ready` until historical price and
fundamental data are approved and available.

## CEO Current Decision

```text
REVISE
```

The project may continue internal latest-row dry-run reporting. It must not run
or publish CP3 backtest claims from the current latest-only seed.

Historical data plan:

```text
docs/CP3_TW_STOCK_HISTORICAL_DATA_PLAN.md
```

Historical source research:

```text
docs/CP3_TW_STOCK_HISTORICAL_SOURCE_RESEARCH_2026-05-29.md
```
