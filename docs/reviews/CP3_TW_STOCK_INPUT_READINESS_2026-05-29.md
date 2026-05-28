# CP3 Taiwan Stock Input Readiness

Checkpoint: CP3 Model Credibility Checkpoint
Date: 2026-05-29
Trigger: Taiwan stock model and backtest method exist, but inputs need source
readiness review before any dry-run implementation.

## A / PM+Dev

A mapped candidate inputs to current schema and source approval. Only
price-trend and valuation are plausible for a limited internal dry-run.

## B / Marketing

B must not describe the candidate as full coverage because four of six modules
remain blocked or unavailable.

## C / Investment

C should treat any limited dry-run as incomplete evidence. It can test mechanics,
not model credibility.

## D / Legal

D requires public eligibility to remain false while source approval and missing
module handling are incomplete.

## E / CEO

CEO keeps decision at `REVISE`. The next implementation may design a dry-run
only if it is internal, incomplete, and clearly labeled.

## F / Design

F should keep missing-module and public-eligibility states visible in any future
internal diagnostic view.

## Conflicts

```text
Dry-run can help engineering.
Dry-run cannot be marketed as evidence of a real score.
```

## CEO Synthesis

Input readiness is partial. The project can plan an internal dry-run, but CP3
real-score approval is still far away.

## Decision

```text
REVISE
```

## Required Adjustments

```text
Keep scoreSource as mock.
Keep public_eligible false for any dry-run.
Do not use missing modules as zero-quality real evidence.
```

## Next Implementation Slice

Design an internal-only dry-run score contract for price-trend and valuation,
without writing public scores.
