# CP3 Model Credibility Path

Checkpoint: CP3 Model Credibility Checkpoint
Date: 2026-05-29
Trigger: Public pages now label score source and model status, so the project
needs a formal path before mock scores can become real scores.

## A / PM+Dev

A created `docs/CP3_MODEL_CREDIBILITY_PLAN.md` and
`check:cp3-model-credibility`. The gate intentionally reports `not_ready` while
required model, data-quality, validation, and disclosure approvals remain open.

## B / Marketing

B must not market score accuracy, prediction power, or ETF coverage until CP3
approves user-facing model explanation.

## C / Investment

C owns the model credibility standard: formulas, module weights, market-specific
calibration, data quality thresholds, and backtest requirements.

## D / Legal

D requires non-advisory wording and model limitations near score interpretation
before real-score claims are allowed.

## E / CEO

CP3 is now defined but not open for approval. The project may document formula
candidates and backtest methodology, but public score source remains mock.

## F / Design

F should preserve visible score caveats and avoid making model outputs look like
trade commands.

## Conflicts

```text
Product wants a credible score.
Trust requires evidence before real-score claims.
```

## CEO Synthesis

The next model work must be evidence-first. CP3 will not approve real scores
until data, validation, and disclosure are reviewed together.

## Decision

```text
REVISE
```

## Required Adjustments

```text
Keep check:cp3-model-credibility in review gates.
Keep scoreSource as mock.
Prepare formula and backtest proposals before any real-score implementation.
```

## Next Implementation Slice

Document model formula candidates and required input-source mapping for Taiwan
stocks only.
