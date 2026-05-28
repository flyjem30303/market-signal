# ETF Data Model

Status: internal planning

Purpose:

- Keep ETF data quality separate from common-stock fundamentals.
- Prevent ETF pages from being evaluated by PE/PB-only stock rules.
- Prepare a global-ready structure for Taiwan ETFs first, then US/global ETFs.

## Current Decision

ETF raw price data may be used in internal diagnostics when available.

ETF valuation and interpretation are not approved for public release until the
ETF-specific model exists.

## Required ETF Fields

Minimum internal preview:

```text
country
exchange
symbol
name
currency
timezone
latest price
trade date
volume
turnover
source attribution
freshness state
```

ETF-specific future fields:

```text
fund_category
tracking_index
issuer
expense_ratio
aum
nav
premium_discount
tracking_difference
distribution_frequency
last_distribution
constituent_count
top_holdings
```

## Proposed Tables

```text
etf_profiles
etf_daily_metrics
etf_holdings
```

`etf_profiles` stores stable fund metadata such as issuer, tracking index,
expense ratio, and distribution frequency.

`etf_daily_metrics` stores date-based ETF metrics such as NAV, premium /
discount, AUM, tracking difference, constituent count, and last distribution.

`etf_holdings` stores top holdings snapshots by `as_of_date`.

These tables are designed to stay global-ready by referencing `stocks.id`; the
country / exchange / currency / timezone context still comes from `stocks` and
`market_exchanges`.

## Scoring Difference

Common stocks may use:

```text
earnings
PE
PB
dividend yield
revenue growth
industry comparison
```

ETFs should use:

```text
tracking quality
liquidity
premium / discount
expense ratio
AUM stability
underlying index risk
distribution profile
regional / sector exposure
```

## Public Release Gate

ETF public interpretation remains blocked until:

1. ETF-specific source is selected.
2. ETF-specific fields are ingested.
3. ETF scoring rules are reviewed by C / Investment Advisor.
4. ETF disclosures are reviewed by D / Legal.
5. CEO approves a public release checkpoint.

## Current Code Behavior

- `asset_type=etf` uses ETF policy.
- ETF schema exists as empty tables only; no ETF-specific data source is
  approved yet.
- Missing stock-style fundamentals are marked as:

```text
fundamentals-not-applicable-for-etf
```

- This caveat is informational for internal diagnostics.
- Public release remains blocked by `publicGate`.
