# CP3 Taiwan Stock Historical Data Plan

Checkpoint: CP3 Model Credibility Checkpoint
Date: 2026-05-29
Trigger: Source-depth gate shows latest-row data is not sufficient for CP3
backtesting.

## A / PM+Dev

A documented the historical data plan and added a guard. No historical ingestion
was implemented.

## B / Marketing

B cannot claim historical validation until a licensed source, backtest report,
and disclosure copy exist.

## C / Investment

C requires price and valuation history before assessing model behavior. Latest
dry-run output is not evidence.

## D / Legal

D must review source terms before any historical bulk collection or storage.

## E / CEO

CEO keeps decision at `REVISE`. Historical data work may proceed as research
only, not ingestion.

## F / Design

F should not design public backtest UI until historical source and validation
are approved.

## Conflicts

```text
Backtest requires historical data.
Historical data requires source and license approval.
```

## CEO Synthesis

The project now has a path to historical readiness without confusing research,
ingestion, and public claims.

## Decision

```text
REVISE
```

## Required Adjustments

```text
Keep historical ingestion unapproved.
Research official / licensed source paths first.
Do not commit downloaded historical datasets.
```

## Next Implementation Slice

Research official TWSE / TPEx historical source options and document candidate
endpoints plus legal blockers.
