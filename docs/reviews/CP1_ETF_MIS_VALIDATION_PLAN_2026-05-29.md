# CP1 Follow-up: ETF MIS Validation Plan

Date: 2026-05-29

Trigger:

- CP1 research found the current TWSE MIS ETF NAV disclosure data surface.
- CEO needs a controlled validation step before any adapter implementation.

## Implemented

```text
data/source-gates/etf-mis-validation-plan.json
scripts/check-etf-mis-validation-plan.mjs
docs/ETF_MIS_VALIDATION_PLAN_2026-05-29.md
```

## A / PM + Developer

A confirms the next step is validation design, not ingestion. The plan defines
endpoint availability, field contract, update / cache behavior, date behavior,
and fair-use checks before adapter design.

## B / Marketing

B should not make ETF coverage claims from this work. This is backend due
diligence only.

## C / Investment Advisor

C confirms the MIS surface helps market-context interpretation but still does
not solve expense ratio, tracking difference, holdings, or constituent count.

## D / Legal

D confirms license / redistribution remains a blocker before ingestion.
Fair-use cadence must be defined before repeated smoke tests run.

## F / Product Design / UIUX

F should keep any ETF MIS validation result internal and diagnostic-only.

## E / CEO Synthesis

CEO decision:

```text
REVISE
```

Proceed only to a non-ingesting validation report. Do not write ETF MIS payloads
to Supabase, seeds, public UI, or scoring modules.

## Next Implementation Slice

```text
Build a non-ingesting ETF MIS smoke test reporter.
```
