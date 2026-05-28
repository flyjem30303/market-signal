# CP1 Follow-up: ETF Source Research

Date: 2026-05-29

Trigger:

- ETF source selection gate exists.
- Candidate source names need evidence URLs and field coverage review.

## Research Summary

Reviewed official TWSE / ETFortune surfaces:

```text
TWSE ETF overview
TWSE ETF daily trading data
TWSE ETFortune market overview
TWSE ETFortune ETF detail pages
```

Observed useful fields:

```text
fund_category
tracking_index
issuer
aum
nav
premium_discount
distribution
daily close price
trading value
trading volume
```

Current candidate coverage gaps:

```text
expense_ratio
tracking_difference
constituent_count
top_holdings
license / redistribution status
automation endpoint confirmation
```

## A / PM + Developer

A confirms TWSE / ETFortune is a strong first research direction for Taiwan ETF
coverage, but not enough to approve ingestion yet.

The source gate now reports candidate coverage gaps.

## B / Marketing

B may describe ETF coverage as under research only. Do not claim product
readiness.

## C / Investment Advisor

C confirms NAV, premium / discount, AUM, and holdings are necessary for ETF
interpretation. Missing holdings and tracking fields block scoring.

## D / Legal

D requires terms, license, and redistribution review before automated ingestion.

## F / Product Design / UIUX

F should not design final public ETF modules until source fields are known.
Internal diagnostics can show source coverage gaps.

## E / CEO Synthesis

CEO decision:

```text
REVISE
```

Research can continue. ETF ingestion remains blocked.

## Not Approved

```text
ETF ingestion
ETF scoring
ETF public interpretation
Approved ETF source
```
