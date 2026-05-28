# CP3 Taiwan Stock Dry-Run Internal View

Checkpoint: CP3 Model Credibility Checkpoint
Date: 2026-05-29
Trigger: CP3 dry-run reporter exists and needs a protected review surface for
roles.

## A / PM+Dev

A added `/internal/cp3-dry-run`, protected by the existing internal diagnostics
gate. The page invokes the dry-run reporter, displays the report, and writes
nothing.

## B / Marketing

B must not link to this page publicly or use its output in SEO copy.

## C / Investment

C can use the view to inspect dry-run shape and missing modules, but it is not
evidence for model approval.

## D / Legal

D approves only internal access. Public eligibility remains false and the page
is noindex.

## E / CEO

CEO keeps CP3 at `REVISE`. The page improves role review ergonomics without
changing public product behavior.

## F / Design

F approves a dense internal diagnostic view. This is not a public UX pattern.

## Conflicts

```text
Internal review needs visibility.
Public trust requires no exposure of incomplete dry-run scores.
```

## CEO Synthesis

The internal view is allowed because it is token-gated, noindex, and clearly
public-ineligible.

## Decision

```text
REVISE
```

## Required Adjustments

```text
Keep /internal/cp3-dry-run out of public navigation and sitemap.
Keep internal route exposure guard updated.
Keep scoreSource mock.
```

## Next Implementation Slice

Continue source-depth validation before expanding dry-run modules.
