# CP3 Taiwan Stock Dry-Run Contract

Checkpoint: CP3 Model Credibility Checkpoint
Date: 2026-05-29
Trigger: Input readiness shows a limited internal dry-run may be planned with
price-trend and valuation only.

## A / PM+Dev

A defined the internal dry-run input/output contract. It forbids Supabase score
writes and public real-score exposure.

## B / Marketing

B cannot use dry-run output in SEO or marketing copy. It is internal evidence
only.

## C / Investment

C can use the contract to review whether partial module output is still too
misleading. The contract keeps missing modules explicit.

## D / Legal

D approves the internal-only framing and the `not investment advice` warning,
but public usage remains blocked.

## E / CEO

CEO keeps decision at `REVISE`. The contract is ready for review, not yet
implementation.

## F / Design

F should treat future dry-run display as internal diagnostics only, with
public-ineligible and missing-module labels visible.

## Conflicts

```text
Engineering can test mechanics now.
Product trust still forbids real-score claims.
```

## CEO Synthesis

The dry-run contract narrows the next implementation risk. If implemented later,
it must remain internal, non-persistent, and public-ineligible.

## Decision

```text
REVISE
```

## Required Adjustments

```text
Keep scoreSource as mock.
Do not write dry-run outputs to daily_scores or score_modules.
Do not expose dry-run output in public stock pages.
```

## Next Implementation Slice

After role review, implement an internal dry-run reporter only.
