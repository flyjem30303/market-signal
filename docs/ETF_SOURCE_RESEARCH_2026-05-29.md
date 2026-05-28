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
- TWSE ETF JSON disclosure format PDF: https://dsp.twse.com.tw/public/static/downloads/tradingDepartment/ETF%20%E7%94%B3%E8%B4%96%E8%B3%87%E8%A8%8A%E5%8F%8A%E5%8D%B3%E6%99%82%E6%B7%A8%E5%80%BC%E6%8F%AD%E9%9C%B2%E5%B0%88%E5%8D%80%E4%BB%8B%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AA%AA%E6%98%8E_20250109142554.pdf

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
estimated NAV
estimated premium / discount
previous business day NAV
data timestamp
```

Open questions:

```text
Is there a stable machine-readable endpoint for every required field?
Can issuer fixed JSON URLs be discovered in a reliable official index?
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
