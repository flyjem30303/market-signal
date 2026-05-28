# CP3 Taiwan Stock Input Readiness

Status: partial, not approved for real scoring

Purpose:

- Map Taiwan stock model candidate inputs to current schema and source approval.
- Identify the minimum dry-run dataset before any backtest implementation.
- Keep unavailable model modules from being treated as real score evidence.

## Readiness Summary

```text
ready_for_real_score: false
dry_run_possible: limited
minimum_viable_modules: price-trend, valuation
blocked_modules: fundamentals, flow, market-context, macro-risk
public_scoreSource: mock
```

The project has enough structure to discuss a dry-run model, but not enough
approved inputs to calculate a real public score.

## Input Readiness Matrix

| Module | Input | Schema Location | Current Data State | Source Approval | Dry-Run Use | Blocker |
|---|---|---|---|---|---|---|
| price-trend | close | `daily_prices.close` | latest bootstrap exists | TWSE OpenAPI freshness validated | yes | historical depth not validated |
| price-trend | volume | `daily_prices.volume` | latest bootstrap exists | TWSE OpenAPI freshness validated | yes | historical depth not validated |
| price-trend | rolling returns | derived from `daily_prices.close` | derivable only if history exists | depends on price source | limited | historical continuity not validated |
| valuation | pe | `daily_fundamentals.pe` | latest bootstrap exists | TWSE OpenAPI freshness validated | yes | historical depth not validated |
| valuation | pb | `daily_fundamentals.pb` | latest bootstrap exists | TWSE OpenAPI freshness validated | yes | historical depth not validated |
| valuation | dividend_yield | `daily_fundamentals.dividend_yield` | latest bootstrap exists | TWSE OpenAPI freshness validated | yes | historical depth not validated |
| fundamentals | revenue_yoy | `daily_fundamentals.revenue_yoy` | schema exists | source not approved | no | source and publication-date handling missing |
| fundamentals | eps_ttm | `daily_fundamentals.eps_ttm` | schema exists | source not approved | no | source and publication-date handling missing |
| fundamentals | gross_margin | not in current schema | unavailable | not approved | no | schema and source missing |
| fundamentals | operating_margin | not in current schema | unavailable | not approved | no | schema and source missing |
| flow | foreign_net_buy | `daily_flows.foreign_net_buy` | schema only | source not approved | no | ingestion not built |
| flow | investment_trust_net_buy | `daily_flows.investment_trust_net_buy` | schema only | source not approved | no | ingestion not built |
| flow | dealer_net_buy | `daily_flows.dealer_net_buy` | schema only | source not approved | no | ingestion not built |
| flow | margin_balance | `daily_flows.margin_balance` | schema only | source not approved | no | ingestion not built |
| flow | short_balance | `daily_flows.short_balance` | schema only | source not approved | no | ingestion not built |
| market-context | TWII trend | future index series | mock only | not approved | no | source and schema path missing |
| market-context | sector breadth | future breadth table | unavailable | not approved | no | source and schema missing |
| market-context | advance/decline | future breadth table | unavailable | not approved | no | source and schema missing |
| macro-risk | SOX | future global macro source | unavailable | not approved | no | source and license missing |
| macro-risk | NASDAQ | future global macro source | unavailable | not approved | no | source and license missing |
| macro-risk | USD/TWD | future global macro source | unavailable | not approved | no | source and license missing |
| macro-risk | US 10Y | future global macro source | unavailable | not approved | no | source and license missing |
| macro-risk | VIX | future global macro source | unavailable | not approved | no | source and license missing |

## Minimum Dry-Run Dataset

A limited dry-run can only use:

```text
stocks
daily_prices
daily_fundamentals.pe
daily_fundamentals.pb
daily_fundamentals.dividend_yield
data_runs
market_exchanges
```

This dry-run must label:

```text
scoreSource: mock
model_version: tw-stock-signal-v0.1-candidate-dry-run
public_eligible: false
missing_module_flags: fundamentals, flow, market-context, macro-risk
```

## Required Before Backtest Implementation

Before implementing even an internal backtest:

```text
confirm historical daily_prices depth
confirm historical daily_fundamentals depth
define corporate-action handling
define delisted / inactive-symbol handling
define score date alignment
define missing-module downgrade behavior
```

## CEO Current Decision

```text
REVISE
```

The input map is useful for planning, but real scoring remains blocked. A
limited internal dry-run may be designed only if it keeps public eligibility
false and labels missing modules clearly.
