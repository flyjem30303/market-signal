# CP1 Follow-up: Score Source Freshness Strip

Checkpoint: CP1 Data Trust Checkpoint
Date: 2026-05-29
Trigger: Supabase freshness metadata is visible while public scoring remains
mock.

## A / PM+Dev

The freshness snapshot now carries score-source metadata. The UI can show real
freshness metadata and mock scoring status in the same compact trust surface.

## B / Marketing

Marketing can describe freshness transparency, but must not imply the score is
real while `scoreSource` remains `mock`.

## C / Investment

Investment interpretation remains bounded. A fresh TWSE data date does not make
the score production-ready.

## D / Legal

D approves the distinction because it lowers the risk that users mistake mock
scores for verified investment signals.

## E / CEO

This preserves the staged rollout: real freshness first, real scoring later.
The public UI remains conservative.

## F / Design

The label stays in the compact freshness strip and uses stronger styling only
for non-real score states.

## Conflicts

```text
None.
```

## CEO Synthesis

The project can continue using Supabase freshness metadata locally while keeping
score provenance visible and conservative.

## Decision

```text
PROCEED
```

## Required Adjustments

```text
Keep scoreSource as mock until the scoring model and data contract are approved.
Do not hide the score-source label on stock or briefing pages.
```

## Next Implementation Slice

Continue CP1-to-CP2 readiness by improving public product clarity without
switching `NEXT_PUBLIC_DATA_SOURCE` away from mock.
