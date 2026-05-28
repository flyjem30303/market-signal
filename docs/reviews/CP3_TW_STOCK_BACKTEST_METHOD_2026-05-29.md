# CP3 Taiwan Stock Backtest Method

Checkpoint: CP3 Model Credibility Checkpoint
Date: 2026-05-29
Trigger: Taiwan stock model candidates exist and need an evidence standard
before any score can be treated as real.

## A / PM+Dev

A documented the Taiwan stock backtest method and added
`check:cp3-tw-stock-backtest`. No runtime score calculation was changed.

## B / Marketing

B must not convert backtest output into performance claims unless the report
includes sample period, cost assumptions, and limitations.

## C / Investment

C must approve trading-day alignment, return horizons, regime definitions,
sample-size requirements, and false-positive review before model approval.

## D / Legal

D requires public copy to avoid guaranteed return, buy / sell instructions, and
personalized advice. Backtest results must include limitations.

## E / CEO

CEO keeps decision at `REVISE`. The method is a necessary step, but no backtest
has been run and no real score claim is approved.

## F / Design

F should eventually make validation context visible without turning the product
into a research paper. Caveats must remain findable near score interpretation.

## Conflicts

```text
Users need simple signals.
Trust requires evidence, costs, and failure cases.
```

## CEO Synthesis

The project can now ask whether a candidate model works in a disciplined way.
The next step is input-source readiness or a dry-run backtest spec, not public
real-score UI.

## Decision

```text
REVISE
```

## Required Adjustments

```text
Keep scoreSource as mock.
Do not publish backtest claims until the report exists and D approves wording.
Use this method for Taiwan common stocks only.
```

## Next Implementation Slice

Map Taiwan stock candidate inputs to current schema readiness and identify the
minimum dry-run dataset.
