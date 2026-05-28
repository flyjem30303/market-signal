# CP1 Follow-up: ETF JSON URL Discovery

Date: 2026-05-29

Trigger:

- CP1 endpoint research identified issuer fixed JSON URLs as the main ETF
  automation blocker.
- CEO requested continued source due diligence before ETF ingestion.

## Research Summary

Reviewed official TWSE / DSP surfaces:

```text
TWSE / DSP document download list
TWSE ETF JSON disclosure format PDF
ETF issuer operating notes
ETF subscription / redemption operation basic data file
ETFortune ETF basic data file
TWSE ETF / ETFortune public pages
```

Finding:

```text
The JSON format exists and requires issuer fixed http / https URLs.
ETF issuer operating notes require issuers to provide URL links to TWSE before listing.
The inspected ETF basic-data forms do not publish a public JSON URL index.
No public centralized index of all issuer fixed JSON URLs has been confirmed.
```

## A / PM + Developer

A confirms there is still no implementation-ready endpoint discovery method. The
next engineering-safe action is to investigate whether the TWSE market
information ETF issued-units / real-time NAV disclosure area has a public query
endpoint, without crawling issuer JSON URLs.

## B / Marketing

B should continue treating Taiwan ETF support as internal preparation. No public
claim should mention live ETF NAV, premium / discount monitoring, or ETF signal
coverage.

## C / Investment Advisor

C confirms the available JSON fields are useful for NAV / premium-discount
context, but missing holdings, expenses, and tracking-quality fields still
block ETF interpretation.

## D / Legal

D confirms that endpoint discoverability and technical format do not equal
usage permission. License, storage, redistribution, and attribution must remain
open checks.

## F / Product Design / UIUX

F should keep ETF views internal-only and show the unresolved discovery state in
diagnostic surfaces if ETF source readiness is displayed.

## E / CEO Synthesis

CEO decision:

```text
REVISE
```

ETF source due diligence may continue. ETF ingestion remains blocked until
official URL discovery, license review, and missing-field plans are resolved.

## Required Adjustment

Update ETF gates so the blocker is explicit:

```text
official centralized JSON URL index unconfirmed
inspected TWSE basic-data forms do not expose the JSON URL list
issuer URL submission workflow exists but public access is unconfirmed
```

## Next Implementation Slice

```text
Research TWSE market information ETF NAV disclosure query surface, without ingestion.
```
