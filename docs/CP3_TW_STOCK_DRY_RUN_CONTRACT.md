# CP3 Taiwan Stock Dry-Run Contract

Status: draft, internal-only

Purpose:

- Define the shape of a limited Taiwan stock dry-run score output.
- Allow engineering to test score mechanics without creating public real-score
  claims.
- Keep CP3 model credibility and CP2 public release gates closed.

## Scope

This contract applies only to an internal dry-run using currently plausible
Taiwan common-stock inputs:

```text
price-trend
valuation
```

The dry-run must not include:

```text
fundamentals
flow
market-context
macro-risk
ETF scores
public scoreSource=real
Supabase writes to daily_scores
public UI display as real model output
```

## Required Input Contract

```text
country: TW
exchange: TWSE or TPEx
symbol: string
score_date: YYYY-MM-DD
price:
  close: number | null
  volume: number | null
  rolling_return_20d: number | null
  rolling_return_60d: number | null
valuation:
  pe: number | null
  pb: number | null
  dividend_yield: number | null
freshness:
  source_name: string
  as_of_date: YYYY-MM-DD
  state: complete | partial | stale | unavailable
```

## Required Output Contract

```text
country: TW
exchange: TWSE or TPEx
symbol: string
score_date: YYYY-MM-DD
model_version: tw-stock-signal-v0.1-candidate-dry-run
scoreSource: mock
public_eligible: false
health_score: number
risk_score: number
composite_score: number
signal: green | yellow | orange | red | deep-red
data_quality_score: number
data_quality_grade: A | B | C | D
module_scores:
  - module_key: price-trend
    health: number
    risk: number
    weight: 0.18
    status: dry_run
  - module_key: valuation
    health: number
    risk: number
    weight: 0.16
    status: dry_run
missing_module_flags:
  - fundamentals
  - flow
  - market-context
  - macro-risk
stale_data_flags: string[]
warnings:
  - internal dry-run only
  - incomplete model modules
  - not investment advice
```

## Quality Rules

The dry-run must force:

```text
public_eligible: false
scoreSource: mock
data_quality_grade: C or D unless C / E approve another dry-run grade rule
missing_module_flags includes all unavailable modules
warnings includes not investment advice
```

If freshness state is `partial`, `stale`, or `unavailable`, the dry-run must
also include the matching stale / missing flag and cannot produce `green`.

## Storage Rule

The first implementation must write reports only:

```text
console output
local ignored scratch output
internal diagnostics response
```

It must not write:

```text
Supabase daily_scores
Supabase score_modules
seed files
public fixtures
static page props
```

## Review Gate

Before implementation, A must confirm:

```text
input fields can be loaded without public repository switch
no writes to production tables
no public route exposes dry-run score as real
review-gates still pass
```

## CEO Current Decision

```text
REVISE
```

The dry-run contract is approved for review, not implementation. Any future
implementation must remain internal-only and public-ineligible.

## Reporter

Internal non-persistent reporter:

```text
npm run report:cp3-tw-stock-dry-run -- 2330
```

Guard:

```text
npm run check:cp3-tw-stock-dry-run-report
```

The reporter reads the latest seed SQL, writes nothing, and emits a report only.
It remains public-ineligible and keeps `scoreSource: mock`.
