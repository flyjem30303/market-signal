# CP1 Follow-up: ETF Data Model

Date: 2026-05-29

Trigger:

- Supabase market trust review found `0050` and `006208` have prices but no
  stock-style fundamentals.
- Public release gate remains blocked.
- The next risk is accidentally treating ETFs as common stocks.

## Implemented

- Added asset-type policy helper.
- ETF missing fundamentals now maps to an ETF-specific policy.
- ETF missing PE/PB no longer reduces internal quality score.
- Added `docs/ETF_DATA_MODEL.md`.

## A / PM + Developer

A confirms the code now separates asset-type rules before public release work.

Next engineering work should add ETF fields only after source selection.

## B / Marketing

B should not describe ETF valuation or recommendations until ETF-specific
signals exist.

Marketing may still say the product is preparing ETF coverage internally.

## C / Investment Advisor

C confirms ETFs require different indicators from common stocks:

```text
tracking quality
liquidity
premium / discount
expense ratio
AUM stability
underlying index risk
```

C does not approve PE/PB-based ETF interpretation.

## D / Legal

D requires ETF-specific disclosure because ETF risks differ from single-stock
risks.

Public ETF interpretation remains blocked.

## F / Product Design / UIUX

F recommends ETF pages eventually display different modules from stock pages.
Do not reuse stock valuation labels for ETF diagnostics.

## E / CEO Synthesis

CEO decision:

```text
PROCEED_INTERNAL_ONLY
```

ETF support remains in internal planning. The code may distinguish ETF data
quality internally, but public ETF interpretation is not approved.

## Not Approved

```text
Public ETF valuation claims
PE/PB-based ETF scoring
NEXT_PUBLIC_DATA_SOURCE=supabase
Public mixed raw-data + mock-score UI
```
