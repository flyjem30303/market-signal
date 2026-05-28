# CP1 Follow-up: ETF Source Reporting

Date: 2026-05-29

Trigger:

- ETF source gate and due-diligence gate exist.
- CEO / roles need one readable report instead of multiple JSON files.

## Implemented

- Added:

```text
npm run report:etf-source
```

- Report includes:

```text
candidate scores
candidate coverage gaps
priority candidate
ingestion blockers
scoring blockers
public release blockers
next allowed work
```

## A / PM + Developer

A confirms this improves review ergonomics without changing any source approval
state.

## B / Marketing

B should not use this report externally. It is internal product planning only.

## C / Investment Advisor

C can use the report to focus on scoring blockers and required ETF fields.

## D / Legal

D can use the report to focus on license and disclosure blockers.

## F / Product Design / UIUX

F can use the report to avoid designing public ETF modules before field coverage
is approved.

## E / CEO Synthesis

CEO decision:

```text
REVISE
```

Reporting is approved. ETF source, ingestion, scoring, and public interpretation
remain blocked.

## Not Approved

```text
Approved ETF source
ETF ingestion
ETF scoring
ETF public interpretation
```
