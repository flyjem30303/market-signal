# CP3 Model Credibility Plan

Status: not ready

Purpose:

- Define the approval path before mock scores can become real public scores.
- Keep product experience work separate from investment-model approval.
- Prevent real-data freshness from being mistaken for real-score readiness.

## CEO Rule

Real scores cannot be publicly claimed until CP3 produces a written model
credibility review and all required gates are approved.

## Required Before Real Score Claims

### Model Design

- [ ] C / Investment Advisor approves score purpose and non-advisory framing.
- [ ] Health score and risk score formulas are documented.
- [ ] Module weights are documented by asset type.
- [ ] Market-specific model versions are defined for TW stock, TW ETF, US stock,
  and index assets.
- [ ] Score output includes model version.

### Data Quality

- [ ] Required input fields are mapped to approved sources.
- [ ] Missing-field behavior is documented per module.
- [ ] Stale-data flags are documented.
- [ ] Data quality score threshold for public display is approved.
- [ ] Partial-data downgrade rule is approved.

### Validation

- [ ] Backtest sample period is documented.
- [ ] Return horizon is documented.
- [ ] Win rate, average return, and max drawdown are calculated.
- [ ] Regime coverage includes bull, bear, and sideways periods when available.
- [ ] False-positive and false-negative examples are reviewed.

### Disclosure

- [ ] D / Legal approves public model disclosure.
- [ ] D / Legal approves not-investment-advice wording near score areas.
- [ ] B / Marketing approves user-facing explanation without overclaiming.
- [ ] F / Design approves score caveat placement.

## Current Blocking Gates

```text
real scoring model design: not approved
data quality rules: not approved
backtest methodology: not approved
public model disclosure: not approved
market-specific calibration: not approved
```

## CEO Decision

```text
NOT_READY
```

Allowed next work:

```text
document model formula candidates
map required inputs to approved Taiwan stock sources
define backtest methodology
keep public scoreSource as mock
```

Current candidate documents:

```text
docs/CP3_TW_STOCK_MODEL_CANDIDATES.md
docs/CP3_TW_STOCK_BACKTEST_METHOD.md
docs/CP3_TW_STOCK_INPUT_READINESS.md
docs/CP3_TW_STOCK_DRY_RUN_CONTRACT.md
docs/CP3_TW_STOCK_SOURCE_DEPTH_VALIDATION.md
```

Not allowed:

```text
claim real model scores
switch scoreSource to real
market scores as investment recommendations
show ETF scores from unapproved sources
```
