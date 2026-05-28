# CP3 Taiwan Stock Model Candidates

Status: draft, not approved

Purpose:

- Propose a Taiwan stock model shape for CP3 discussion.
- Map each module to required inputs and current source readiness.
- Keep real-score implementation blocked until C / D / E approve the model.

## Scope

This document covers Taiwan common stocks only.

Out of scope:

```text
Taiwan ETF scoring
US stock scoring
index scoring
personalized investment advice
production scoreSource=real
```

## Candidate Model Version

```text
tw-stock-signal-v0.1-candidate
```

This name is a draft identifier only. It must not appear as a production model
version until CP3 approves it.

## Candidate Modules

| Module | Candidate Weight | Health Direction | Risk Direction | Required Inputs | Current Readiness |
|---|---:|---|---|---|---|
| price-trend | 18% | price above moving averages, positive momentum | stretched rise, sharp downside momentum | close, volume, rolling returns | partial |
| valuation | 16% | reasonable PE/PB/dividend yield vs own range | expensive vs own range or missing valuation | pe, pb, dividend_yield | partial |
| fundamentals | 18% | revenue growth, EPS support, margin stability | revenue contraction, EPS pressure | revenue_yoy, eps_ttm, gross_margin, operating_margin | partial |
| flow | 16% | foreign / trust / dealer accumulation | synchronized selling, leverage stress | foreign_net_buy, investment_trust_net_buy, dealer_net_buy, margin_balance, short_balance | not_ready |
| market-context | 14% | TW market breadth and sector participation | narrow rally, weak breadth | index trend, sector breadth, advance/decline | not_ready |
| macro-risk | 18% | supportive global risk backdrop | SOX/NASDAQ weakness, USD/TWD stress, VIX / 10Y pressure | SOX, NASDAQ, USD/TWD, US 10Y, VIX | not_ready |

## Candidate Score Shape

```text
module_health = 0..100
module_risk = 0..100
health_score = weighted average(module_health)
risk_score = weighted average(module_risk)
composite_score = clamp(health_score - risk_score * 0.35 + 35, 0, 100)
```

This formula is intentionally simple for review. C must decide whether the risk
penalty, weights, and thresholds are defensible.

## Candidate Signal Bands

| Signal | Candidate Rule | Public Meaning |
|---|---|---|
| green | composite >= 76 and risk < 62 | trend and context are supportive |
| yellow | composite >= 62 and risk < 70 | constructive but not clean |
| orange | composite >= 48 or risk < 78 | mixed / caution |
| red | composite < 48 or risk >= 78 | weak or high-risk |
| deep-red | risk >= 88 | stress condition |

These are not trading instructions.

## Input Source Mapping

| Input Group | Fields | Candidate Source | Approval State | Blocker |
|---|---|---|---|---|
| stock master | symbol, name, exchange, industry | TWSE OpenAPI / bootstrap seed | approved for bootstrap | public repository contract still open |
| daily price | open, high, low, close, volume | TWSE OpenAPI / Supabase `daily_prices` | freshness validated | historical depth and public repository contract open |
| valuation | pe, pb, dividend_yield | TWSE OpenAPI / Supabase `daily_fundamentals` | freshness validated | public repository contract open |
| fundamentals | revenue_yoy, eps_ttm, margins | future financial statement source | not_ready | source and schema not approved |
| flow | foreign, trust, dealer, margin, short | future TWSE / TPEx source | not_ready | source and schema not approved |
| market context | TWII, sector breadth | future market breadth source | not_ready | source and schema not approved |
| macro risk | SOX, NASDAQ, USD/TWD, US 10Y, VIX | future global macro source | not_ready | source and license not approved |

## Data Quality Candidate Rules

Minimum for public real score:

```text
data_quality_score >= 80
price-trend approved
valuation approved
at least 4 of 6 modules available
no critical stale flags
model_version present
source attribution present
```

If data quality is below threshold:

```text
scoreSource must remain mock or unavailable
public UI must show partial / unavailable state
signal must not be marketed as real model output
```

## Backtest Candidate Requirements

Before CP3 approval:

```text
sample period starts no later than 2020-01-01 if data allows
forward returns checked at 20, 60, and 120 trading days
win rate, average return, max drawdown, and false-positive examples reported
results split by bull, bear, and sideways regimes when possible
transaction cost assumptions documented
survivorship-bias limitation documented
```

## Role Review Questions

A / PM+Dev:

```text
Can each input be calculated repeatably from approved sources?
Can missing modules degrade gracefully?
```

B / Marketing:

```text
Can the model be explained without prediction claims?
Which phrases are forbidden in SEO copy?
```

C / Investment:

```text
Are weights and score bands defensible?
What minimum backtest evidence is required?
```

D / Legal:

```text
Does public copy avoid personalized advice?
Are source and redistribution rights sufficient?
```

E / CEO:

```text
Does this model create user trust before complexity?
Should TW stock scoring be approved before ETF or global scoring?
```

F / Design:

```text
Can confidence, caveats, and missing-data states be understood quickly?
```

## CEO Current Decision

```text
REVISE
```

This candidate is useful for discussion, but not approved for implementation as
real scoring.
