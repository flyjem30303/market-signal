# ETF Source Research

Date: 2026-05-29

Status: research only

This note records candidate ETF data sources. It does not approve ingestion,
redistribution, scoring, or public display.

## TWSE Official ETF Surfaces

Observed official TWSE surfaces:

- TWSE ETF overview: https://www.twse.com.tw/en/page/ETF/intro.html
- TWSE ETF daily trading data: https://www.twse.com.tw/en/page/ETF/daily.html
- TWSE ETFortune market overview: https://www.twse.com.tw/en/ETFortune-institute/index
- TWSE ETFortune ETF detail example: https://www.twse.com.tw/en/ETFortune-institute/etfInfo/009804

Potentially useful fields:

```text
fund_category
tracking_index
issuer
aum
nav
premium_discount
distribution
daily close price
trading value
trading volume
```

Open questions:

```text
Is there a stable machine-readable endpoint for every required field?
Are fields licensed for automated ingestion and product display?
Can holdings / constituent count be sourced from TWSE, MOPS, issuer pages, or a vendor?
How should active ETFs be handled when holdings can change daily?
```

## Issuer Official Pages

TWSE materials point to issuer official disclosures as important ETF
transparency surfaces, especially for portfolio disclosure and index
characteristics.

Potentially useful fields:

```text
issuer
tracking_index
top_holdings
portfolio disclosure
fund prospectus
distribution notes
```

Open questions:

```text
Can issuer data be normalized across issuers?
Do issuer terms allow automated collection and product redistribution?
What is the expected delay between holdings disclosure and product use?
```

## Paid Vendor Route

A paid vendor may become the long-term global route if official Taiwan sources
are not enough for normalized ETF coverage.

Decision needs:

```text
global coverage
field completeness
historical depth
redistribution rights
cost
SLA / support
```

## CEO Current Decision

```text
REVISE
```

Research may continue. Ingestion remains blocked until a source is approved.

## Readiness Scoring

Candidate source readiness is now scored by:

```text
field coverage: up to 55
source trust: up to 15
evidence URLs: up to 10
automation status: up to 10
license status: up to 10
```

Current expected winner is TWSE official ETF disclosures, but it remains blocked
until automation endpoint and legal/license review are complete.
