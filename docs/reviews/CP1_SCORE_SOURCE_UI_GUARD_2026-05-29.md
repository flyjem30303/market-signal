# CP1 Follow-up: Score Source UI Guard

Checkpoint: CP1 Data Trust Checkpoint
Date: 2026-05-29
Trigger: Score-source and model-status labels are now part of the public stock
page trust surface.

## A / PM+Dev

A added `check:score-source-ui` to protect the UI contract. The check verifies
that freshness snapshots carry score-source metadata, the freshness strip shows
score source, and the stock score area keeps model-status and disclosure links.

## B / Marketing

B approves the guard because it prevents future copy or layout changes from
removing the distinction between data freshness and model readiness.

## C / Investment

C requires this guard until real scoring is approved. Mock score labels must not
be optional while health and risk values are visible.

## D / Legal

D approves the automated guard because it protects the disclaimer path and
reduces the risk of unqualified score claims.

## E / CEO

This does not open CP2. It strengthens CP1 governance by making score-source
visibility executable.

## F / Design

F approves because the guard checks presence, not exact visual styling, leaving
room for future design iteration.

## Conflicts

```text
None.
```

## CEO Synthesis

Score-source visibility is now a protected product requirement. Future work may
change presentation, but cannot silently remove the trust signal.

## Decision

```text
PROCEED
```

## Required Adjustments

```text
Keep check:score-source-ui in review gates while scoreSource is mock or mixed.
```

## Next Implementation Slice

Continue CP1-to-CP2 readiness through stale / partial data states or CP3 model
credibility planning.
