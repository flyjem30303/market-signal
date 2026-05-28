# CP3 Taiwan Stock Model Candidates

Checkpoint: CP3 Model Credibility Checkpoint
Date: 2026-05-29
Trigger: CP3 model credibility path exists and needs a first Taiwan-stock model
candidate for role review.

## A / PM+Dev

A documented a candidate Taiwan common-stock model and input-source mapping.
The document is review material only and does not change score calculation or
public `scoreSource`.

## B / Marketing

B can use the candidate to plan model explanation later, but cannot market it as
prediction, accuracy, or real-score coverage.

## C / Investment

C must review module weights, score bands, risk penalty, minimum evidence, and
backtest requirements before any implementation is approved.

## D / Legal

D must review source rights and public score wording. The candidate keeps
non-advisory language and does not approve real-score claims.

## E / CEO

CEO keeps decision at `REVISE`: useful model direction, not implementation
approval. Taiwan stock remains the only model scope for this candidate.

## F / Design

F should plan for confidence, caveats, and missing-data states before public
real-score UI.

## Conflicts

```text
The product needs a simple score.
The model needs evidence before trust claims.
```

## CEO Synthesis

The candidate gives CP3 something concrete to review without changing runtime
behavior. Next work should define backtest methodology or input-source readiness.

## Decision

```text
REVISE
```

## Required Adjustments

```text
Keep scoreSource as mock.
Do not implement real scoring from this candidate yet.
Use the candidate for C / D / E review.
```

## Next Implementation Slice

Document CP3 backtest methodology for Taiwan stocks.
