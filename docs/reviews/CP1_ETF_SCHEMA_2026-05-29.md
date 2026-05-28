# CP1 Follow-up: ETF Schema

Date: 2026-05-29

Trigger:

- ETF data model has been defined.
- ETF public interpretation remains blocked.
- The project needs a global-ready place for ETF-specific metadata before source
  ingestion begins.

## Implemented

- Added `supabase/migrations/0002_etf_data_model.sql`.
- Added empty ETF tables:

```text
etf_profiles
etf_daily_metrics
etf_holdings
```

- Updated Supabase TypeScript database types.
- Updated bootstrap generator and split-bootstrap generator to include the ETF
  schema.

## A / PM + Developer

A confirms this migration is additive and empty-data safe. It does not alter
current public pages or existing raw market data.

## B / Marketing

B should still avoid public ETF claims. The schema only prepares future ETF
coverage.

## C / Investment Advisor

C confirms the proposed fields are more appropriate for ETF review than PE/PB
alone.

Further review is required before ETF scoring.

## D / Legal

D approves schema preparation only. Public ETF interpretation remains blocked.

## F / Product Design / UIUX

F recommends ETF diagnostics eventually use ETF-specific modules and labels.

## E / CEO Synthesis

CEO decision:

```text
PROCEED_INTERNAL_ONLY
```

The schema can move forward as preparation. No ETF public release, scoring, or
marketing claim is approved.

## Not Approved

```text
ETF scoring
ETF public interpretation
NEXT_PUBLIC_DATA_SOURCE=supabase
Public mixed raw-data + mock-score UI
```
