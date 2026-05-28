# CP3 Taiwan Stock Dry-Run Reporter

Checkpoint: CP3 Model Credibility Checkpoint
Date: 2026-05-29
Trigger: Dry-run contract exists and can now be exercised as an internal,
non-persistent report.

## A / PM+Dev

A added an internal reporter and guard. The reporter reads latest seed SQL,
emits JSON, and writes nothing.

## B / Marketing

B must not use the reporter output publicly. It is not a model performance
claim.

## C / Investment

C can inspect the output shape, but the dry-run uses only price-trend and
valuation, so it is incomplete evidence.

## D / Legal

D approves the forced `scoreSource: mock`, `public_eligible: false`, and
`not investment advice` warning.

## E / CEO

CEO keeps CP3 at `REVISE`. The reporter is useful for internal discussion, not
for public product claims.

## F / Design

F should not expose the reporter on public pages. Any future display must be
internal diagnostics only.

## Conflicts

```text
Internal visibility improves engineering.
Public visibility would create premature trust risk.
```

## CEO Synthesis

The reporter is approved as an internal artifact. It must remain non-persistent
and public-ineligible.

## Decision

```text
REVISE
```

## Required Adjustments

```text
Keep check:cp3-tw-stock-dry-run-report in review gates.
Keep reporter output out of public UI.
Do not write dry-run output to Supabase.
```

## Next Implementation Slice

Add an internal diagnostics link or continue CP3 source-depth validation before
any UI work.
