# CP3 Taiwan Stock Source Depth

Checkpoint: CP3 Model Credibility Checkpoint
Date: 2026-05-29
Trigger: Internal dry-run exists, but CP3 backtest requires historical source
depth.

## A / PM+Dev

A added a source-depth gate that reads the latest market seed and reports
whether price and fundamental histories are deep enough for CP3 backtest.

## B / Marketing

B must not make historical validation claims while the source-depth gate remains
`not_ready`.

## C / Investment

C requires historical depth before interpreting score behavior. A latest-row
dry-run is not model evidence.

## D / Legal

D requires public claims to avoid backtest or performance language until source
depth, methodology, and disclosure are approved.

## E / CEO

CEO keeps CP3 at `REVISE`. The gate protects the project from confusing a
dry-run with validation.

## F / Design

F should not design public validation UI until source-depth gates become ready.

## Conflicts

```text
Dry-run is available now.
Backtest evidence is not available yet.
```

## CEO Synthesis

The current data supports latest-row diagnostics only. Historical validation is
blocked until source depth is approved.

## Decision

```text
REVISE
```

## Required Adjustments

```text
Keep check:cp3-tw-stock-source-depth in review gates.
Keep dry-run public_eligible false.
Do not run CP3 backtest from latest-only seed.
```

## Next Implementation Slice

Research or design approved historical Taiwan stock price / valuation ingestion.
