# CP1 Follow-up: Internal Diagnostics Console

Date: 2026-05-29

Trigger:

- Internal raw market preview exists.
- Internal ETF source readiness page exists.
- Review users need a single protected entry point.

## Implemented

- Added:

```text
/internal?token=your-local-token
```

- The console links to:

```text
/internal/raw-market-preview
/internal/etf-source-readiness
```

- The console uses the existing internal diagnostics gate.
- The console is `noindex`.

## A / PM + Developer

A confirms this improves review workflow without changing public routes or data
source behavior.

## B / Marketing

B must not use the console externally.

## C / Investment Advisor

C can use the console to access raw-data and ETF-source review surfaces.

## D / Legal

D approves internal-only access. Public exposure remains blocked.

## F / Product Design / UIUX

F approves a dense internal console rather than a public-facing page.

## E / CEO Synthesis

CEO decision:

```text
PROCEED_INTERNAL_ONLY
```

Internal review ergonomics are approved. Public release remains blocked.

## Not Approved

```text
Public internal console
Public mixed raw-data + mock-score UI
ETF ingestion
NEXT_PUBLIC_DATA_SOURCE=supabase
```
