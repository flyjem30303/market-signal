# CP1 Follow-up: ETF Source Selection Gate

Date: 2026-05-29

Trigger:

- ETF schema exists.
- ETF ingestion is still not approved.
- The project needs a source approval process before fetching ETF-specific data.

## Implemented

- Added `docs/ETF_SOURCE_SELECTION.md`.
- Added source gate config:

```text
data/source-gates/etf-source-gate.json
```

- Added validation command:

```text
npm run check:etf-source-gate
```

Current expected result:

```text
blocked
```

## A / PM + Developer

A confirms ETF ingestion must not begin until a source is selected and the
minimum required fields are covered.

The gate intentionally fails until `approved_source` is set.

## B / Marketing

B may say ETF coverage is in internal preparation. B must not claim ETF
analytics, ETF valuation, or ETF recommendations are live.

## C / Investment Advisor

C requires the ETF source to support ETF-specific analysis:

```text
tracking index
NAV
premium / discount
AUM
expense ratio
holdings
tracking difference
```

C does not approve PE/PB-only ETF interpretation.

## D / Legal

D requires usage rights and redistribution terms to be reviewed before ETF data
is ingested or displayed.

## F / Product Design / UIUX

F recommends ETF UI modules wait until approved fields are known. Do not design
public ETF modules around unavailable data.

## E / CEO Synthesis

CEO decision:

```text
REVISE
```

The process is approved, but no ETF source is approved. ETF ingestion remains
blocked.

## Next Allowed Work

```text
Research candidate ETF sources.
Record field coverage and legal status.
Keep public release blocked.
```

## Not Approved

```text
ETF ingestion
ETF scoring
ETF public interpretation
NEXT_PUBLIC_DATA_SOURCE=supabase
```
