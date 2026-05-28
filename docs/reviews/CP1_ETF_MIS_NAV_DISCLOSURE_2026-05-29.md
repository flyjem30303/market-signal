# CP1 Follow-up: ETF MIS NAV Disclosure Surface

Date: 2026-05-29

Trigger:

- Prior CP1 research found that issuer fixed JSON URLs are submitted to TWSE
  before listing.
- The next question was whether TWSE exposes a public market information query
  surface for ETF issued-units and NAV disclosure.

## Research Summary

Reviewed:

```text
TWSE MIS current frontend app
legacy etf_nav.jsp URLs
MIS frontend ETF modules
MIS all_etf.txt data surface
MIS ETF category API
```

Finding:

```text
Legacy etf_nav.jsp URLs are not reliable direct entry points.
The current MIS app exposes all_etf.txt for ETF NAV / premium-discount data.
The current MIS app uses getCategory.jsp for ETF category / instrument metadata.
```

## A / PM + Developer

A confirms there is now a plausible technical surface for a Taiwan ETF NAV
adapter. A does not recommend implementation yet because usage terms, update
behavior, and field stability still need review.

## B / Marketing

B may treat this as internal confidence that ETF coverage is technically
possible. Do not claim live ETF NAV coverage publicly.

## C / Investment Advisor

C confirms the surface includes important ETF market-context fields: issued
units, trading price, estimated NAV, premium / discount, previous NAV, and
timestamp. It still does not solve expense ratio, tracking difference,
constituent count, or holdings.

## D / Legal

D requires terms, license, attribution, storage, and redistribution review
before using MIS data in product workflows. Public availability is not
permission to ingest or republish.

## F / Product Design / UIUX

F should keep ETF NAV evidence in internal diagnostics only until the source is
approved and missing fields have confidence states.

## E / CEO Synthesis

CEO decision:

```text
REVISE
```

The technical blocker is reduced, but the trust/legal/operational blockers
remain. Continue CP1 due diligence; do not implement ingestion.

## Required Adjustment

Update ETF gates with:

```text
MIS all_etf.txt surface found
MIS getCategory.jsp metadata surface found
legacy etf_nav.jsp direct page unreliable
license and operational review still required
```

## Next Implementation Slice

```text
Design a non-ingesting ETF MIS source validation checklist and smoke test plan.
```
