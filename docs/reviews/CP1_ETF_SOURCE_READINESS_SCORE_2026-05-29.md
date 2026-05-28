# CP1 Follow-up: ETF Source Readiness Score

Date: 2026-05-29

Trigger:

- ETF source research matrix exists.
- CEO needs prioritization among candidate ETF source paths.

## Implemented

- `npm run check:etf-source-gate` now calculates candidate readiness scores.
- Scoring dimensions:

```text
field coverage: up to 55
source trust: up to 15
evidence URLs: up to 10
automation status: up to 10
license status: up to 10
```

Current scores:

```text
TWSE official ETF disclosures: 61
Issuer official ETF pages: 31
Paid market data vendor: 12
```

Current gate:

```text
blocked
```

## A / PM + Developer

A recommends pursuing TWSE official ETF disclosures first because they have the
highest current field coverage and official-source trust.

Engineering blockers remain:

```text
automation endpoint confirmation
coverage for expense_ratio
coverage for tracking_difference
coverage for constituent_count
```

## B / Marketing

B should not use the readiness score publicly. It is an internal prioritization
score only.

## C / Investment Advisor

C confirms TWSE surfaces are a plausible Taiwan wedge, but scoring cannot start
without holdings, expense, and tracking-quality fields.

## D / Legal

D confirms score does not replace license review. Unknown license status keeps
ingestion blocked.

## F / Product Design / UIUX

F can use the score to plan internal diagnostics, not public ETF modules.

## E / CEO Synthesis

CEO decision:

```text
REVISE
```

Prioritize TWSE official ETF disclosures for research. Do not approve ingestion.

## Not Approved

```text
Approved ETF source
ETF ingestion
ETF scoring
ETF public interpretation
```
