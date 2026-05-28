# CP1 Follow-up: ETF Endpoint Research

Date: 2026-05-29

Trigger:

- ETF source gate exists.
- TWSE / ETFortune source research found candidate official surfaces.
- Endpoint-level evidence is needed before any ingestion design can proceed.

## Research Summary

Reviewed official TWSE / ETFortune surfaces:

```text
TWSE ETF daily trading page
TWSE ETFortune ETF detail page
TWSE ETF JSON disclosure format PDF
```

Observed useful endpoint evidence:

```text
daily ETF trading page supports date query and CSV download
ETFortune detail pages show fund profile, AUM, distribution, NAV, and premium / discount surfaces
TWSE disclosure format describes issuer fixed http / https JSON URLs
TWSE disclosure format defines UTF-8 JSON, normal status codes, ETF code / name, trading price, estimated NAV, estimated premium / discount, previous NAV, data date / time, and update interval fields
```

Current unresolved gaps:

```text
issuer fixed JSON URL discovery method
official index of issuer disclosure URLs
license / redistribution permission
stable chart data endpoints
expense_ratio
tracking_difference
constituent_count
top_holdings
```

## A / PM + Developer

A confirms the DSP format evidence is strong enough to guide the next research
task, but it is not enough to implement ingestion. The missing discovery method
for issuer fixed JSON URLs blocks automation.

## B / Marketing

B may use this only as internal confidence that Taiwan ETF coverage is feasible.
No public copy should claim ETF coverage, NAV monitoring, or holdings insight.

## C / Investment Advisor

C confirms estimated NAV, premium / discount, previous NAV, and timestamps are
material for ETF interpretation. Missing holdings, tracking difference, and
expense fields still block any ETF signal or score.

## D / Legal

D requires terms, license, and redistribution review before storing or
republishing issuer / exchange ETF data. The presence of a JSON format is not
permission to ingest or display it.

## F / Product Design / UIUX

F should keep ETF surfaces internal-only. Any future UI must show source,
freshness, and missing-field confidence before public exposure.

## E / CEO Synthesis

CEO decision:

```text
REVISE
```

Endpoint research may continue. The next best step is to identify whether TWSE
or issuer pages provide an official, reliable index of fixed JSON disclosure
URLs, then bring the finding back to CP1 before implementation.

## Approved

```text
continue endpoint research
record source evidence
update internal source gates
```

## Not Approved

```text
ETF ingestion
ETF scoring
ETF public interpretation
repository switch to ETF data
```
