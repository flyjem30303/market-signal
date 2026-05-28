# CP3 Taiwan Stock Backtest Method

Status: draft, not approved

Purpose:

- Define how Taiwan stock model candidates must be validated before public
  real-score claims.
- Prevent cherry-picked score examples from becoming product claims.
- Keep CP3 evidence review separate from runtime implementation.

## Scope

This method applies to Taiwan common stocks only.

Out of scope:

```text
ETF backtests
US stock backtests
intraday trading systems
personalized portfolio advice
brokerage execution simulation
```

## Required Dataset

Minimum dataset before CP3 validation can be considered:

```text
approved Taiwan common-stock universe
daily adjusted close or comparable close series
daily volume
daily valuation fields where available
corporate action handling note
delisting / inactive symbol handling note
data_runs freshness and source records
model_version for every calculated score
```

Preferred sample period:

```text
2020-01-01 through latest approved complete data date
```

If data cannot start by 2020-01-01, the report must state why and lower the
confidence level.

Current source-depth validation:

```text
docs/CP3_TW_STOCK_SOURCE_DEPTH_VALIDATION.md
npm run check:cp3-tw-stock-source-depth
```

## Trading-Day Alignment

Backtest calculations must:

```text
use Taiwan exchange trading days
avoid look-ahead data
use only fields known on or before score_date
align fundamentals to their publication / availability date where possible
exclude future-revised fields unless revision handling is documented
```

## Return Horizons

Every signal bucket must report forward returns for:

```text
20 trading days
60 trading days
120 trading days
```

Each horizon must show:

```text
sample count
average return
median return
win rate
max drawdown during holding window
best / worst decile examples
```

## Signal Buckets

At minimum, report:

```text
green
yellow
orange
red
deep-red
```

Also report score deciles if sample size allows.

## Regime Split

The validation report must split results by market regime when possible:

```text
bull
bear
sideways
high-volatility
```

Regime definitions must be documented in the report. A simple first-pass
definition may use TWII rolling returns and drawdown, but C must approve it.

## Cost And Slippage

The first CP3 report must include at least two views:

```text
gross return
return after conservative transaction cost assumption
```

The cost assumption must be stated explicitly. If the model is positioned as a
daily / weekly rhythm tool rather than a trading strategy, the report should say
that returns are validation diagnostics, not execution promises.

## Error Review

The report must include examples of:

```text
false positives: high score followed by poor forward return
false negatives: low score followed by strong forward return
stale / partial data failures
sector concentration failures
market shock failures
```

These examples are required even if the aggregate metrics look good.

## Minimum Evidence For CP3 Approval

CP3 cannot approve real public scores unless:

```text
at least 200 signal observations per major signal bucket, or a documented waiver
20 / 60 / 120 day results are reported
cost-adjusted results are reported
false-positive examples are reviewed
data quality threshold is enforced
source and survivorship limitations are disclosed
C / D / E approve the report
```

## Public Claim Limits

Even if CP3 approves the model, public copy must not claim:

```text
guaranteed return
buy / sell instruction
personalized advice
prediction certainty
outperformance without sample-period disclosure
```

Allowed language should stay close to:

```text
market condition score
risk context
historical validation
research model
not investment advice
```

## CEO Current Decision

```text
REVISE
```

This method is ready for role review, but no backtest has been run and no real
score claim is approved.
