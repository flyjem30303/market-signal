# CP1 Follow-up: Public Release Gate

Date: 2026-05-29

Trigger:

- Supabase market trust review returned `PROCEED_INTERNAL_ONLY`.
- Internal raw market preview can now inspect real quote data.
- Public UI still must not expose real raw data beside mock scores.

## Implemented

- Added `buildPublicReleaseGate()`.
- Internal preview page now shows `Public gate: blocked`.
- Internal raw market API now returns `quality` and `publicGate`.
- ETF missing stock-style fundamentals now maps to an ETF-specific caveat.

## A / PM + Developer

A confirms the gate gives the codebase one reusable place to explain why data
cannot move into public UI yet.

Current blockers:

```text
score-is-mock
score-not-approved-for-public-use
```

## B / Marketing

B approves internal use only. Public marketing copy must wait until the gate can
show an approved release state.

## C / Investment Advisor

C confirms raw quotes may support internal review, but no public investment
interpretation should be attached to mock scores.

ETF note:

- Missing stock-style fundamentals for ETFs should not be described as broken
  data.
- ETF valuation needs a separate ETF-specific model.

## D / Legal

D approves the explicit blocked gate because it prevents accidental public
release of mixed real raw data and mock model output.

## F / Product Design / UIUX

F approves showing the gate in internal diagnostics. Public UI should continue
to avoid mixed-data disclosures until the model and legal copy are ready.

## E / CEO Synthesis

CEO decision:

```text
PROCEED_INTERNAL_ONLY
```

The project may keep improving internal diagnostics. Public release remains
blocked.

## Not Approved

```text
NEXT_PUBLIC_DATA_SOURCE=supabase
Public real-data stock UI
Public mixed raw-data + mock-score UI
Real model score claims
ETF valuation interpretation without ETF-specific data model
```
