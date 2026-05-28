# CP3 Taiwan Stock Data Quality Downgrade Matrix

Status: draft, not approved

Purpose:

- Define how Taiwan stock scoring must degrade when inputs are missing, stale,
  partial, or legally unavailable.
- Prevent partial data from being presented as a real public score.
- Give PM, Investment, Legal, Design, and Engineering one shared decision table.

## Scope

This matrix applies to Taiwan common stocks only.

Out of scope:

```text
Taiwan ETF scoring
US stock scoring
index scoring
personalized advice
production scoreSource=real
remote Supabase validation
```

## Non-Negotiable Guardrails

```text
draft matrix only
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not write staging rows
do not write daily_prices
do not create seed SQL
do not store raw market rows
do not commit CSV / JSON market data files
do not set scoreSource=real
do not make public backtest claims
CP3 source-depth production gate remains not_ready
Keep public data source mock
```

## Module Readiness Downgrade Matrix

| Missing Or Stale Area | Model Behavior | UI State | Public Claim Limit | Approval Needed |
|---|---|---|---|---|
| price-trend unavailable | no real score | unavailable | no score claim | A / C / E |
| price-trend stale | no real score unless freshness waiver exists | stale | freshness note only | A / C / D / E |
| valuation unavailable | exclude valuation, cap data quality | partial | no valuation claim | C / D |
| fundamentals unavailable | exclude fundamentals, cap data quality | partial | no fundamentals claim | C / D |
| flow unavailable | exclude flow, cap confidence | partial | no fund-flow claim | C / D |
| market-context unavailable | exclude context, cap confidence | partial | no market-breadth claim | C / D |
| macro-risk unavailable | exclude macro risk, cap confidence | partial | no global-risk claim | C / D |
| source rights unclear | no real score | unavailable | no source-backed claim | D / E |

## Candidate Data Quality Caps

```text
price-trend missing: max data_quality_score = 0
price-trend stale: max data_quality_score = 49
valuation missing: max data_quality_score = 82
fundamentals missing: max data_quality_score = 76
flow missing: max data_quality_score = 78
market-context missing: max data_quality_score = 84
macro-risk missing: max data_quality_score = 84
any source-rights blocker: max data_quality_score = 0
```

The caps are draft values. C / Investment must decide whether each cap is
defensible, and D / Legal must approve the source-rights blocker behavior.

## Public State Rules

```text
data_quality_score >= 80 and all critical approvals complete: real score candidate
data_quality_score 50..79: partial / internal review only
data_quality_score 1..49: unavailable / stale
data_quality_score 0: unavailable
```

Even if a score is a real score candidate, public release remains blocked until
CP3 approval, disclosure approval, and source-depth approval are complete.

## UI Copy Boundaries

Allowed internal labels:

```text
complete
partial
stale
unavailable
internal review
```

Forbidden public claims before CP3 approval:

```text
real score
validated signal
buy signal
sell signal
prediction
outperformance
investment recommendation
```

## Global Expansion Rule

```text
Every market must have its own data-quality matrix before public real scores.
```

Taiwan stock rules may become the template, but US stocks, Taiwan ETFs, indices,
and other markets need market-specific stale-data, source-rights, and model
module rules.

## CEO Current Decision

```text
REVISE
```

This matrix is ready for role review. It is not approved for runtime scoring,
public claims, or production `scoreSource=real`.

## Next Implementation Slice

```text
review Taiwan stock data-quality downgrade matrix by role
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
