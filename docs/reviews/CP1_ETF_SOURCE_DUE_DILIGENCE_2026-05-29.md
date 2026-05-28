# CP1 Follow-up: ETF Source Due Diligence

Date: 2026-05-29

Trigger:

- TWSE official ETF disclosures currently rank highest in ETF source readiness.
- Source scoring is not enough to approve ingestion.
- The project needs role-owned checks before changing data pipelines.

## Implemented

- Added:

```text
data/source-gates/etf-source-due-diligence.json
```

- Added:

```text
npm run check:etf-due-diligence
```

The check separates blockers into:

```text
ingestion
scoring
public-release
```

## A / PM + Developer

A owns endpoint and field-gap checks:

```text
twse-automation-endpoints
etf-field-gap-plan
```

ETF ingestion remains blocked until these are approved.

## B / Marketing

B has no public launch claim yet. Marketing remains research-only.

## C / Investment Advisor

C owns ETF model review:

```text
etf-investment-model-review
```

ETF scoring remains blocked until C approves ETF-specific modules.

## D / Legal

D owns license and disclosure checks:

```text
twse-license-review
etf-public-disclosure-review
```

No ingestion or public display is allowed before legal review.

## F / Product Design / UIUX

F should wait for approved fields before designing public ETF modules.

## E / CEO Synthesis

CEO owns scope decision:

```text
etf-product-scope-review
```

CEO decision:

```text
REVISE
```

Due diligence process is approved. ETF ingestion remains blocked.

## Not Approved

```text
Approved ETF source
ETF ingestion
ETF scoring
ETF public interpretation
```
