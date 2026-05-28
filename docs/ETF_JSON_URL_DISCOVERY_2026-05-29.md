# ETF JSON URL Discovery Research

Date: 2026-05-29

Status: research only

This note records the follow-up search for a reliable discovery method for ETF
issuer fixed JSON disclosure URLs. It does not approve ingestion,
redistribution, scoring, or public display.

## Official Surfaces Checked

TWSE / DSP document download list:

```text
https://dsp.twse.com.tw/tradingFileDownload/list
```

Observed official downloadable documents:

```text
ETF JSON disclosure format specification
ETF issuer operating notes
ETF subscription / redemption operation basic data file
ETFortune ETF basic data file
ETF securities code application form
```

TWSE ETF JSON disclosure format PDF:

```text
https://dsp.twse.com.tw/public/static/downloads/tradingDepartment/ETF%20%E7%94%B3%E8%B4%96%E8%B3%87%E8%A8%8A%E5%8F%8A%E5%8D%B3%E6%99%82%E6%B7%A8%E5%80%BC%E6%8F%AD%E9%9C%B2%E5%B0%88%E5%8D%80%E4%BB%8B%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AA%AA%E6%98%8E_20250109142554.pdf
```

Confirmed:

```text
The format expects each issuer to provide a fixed http / https URL.
The response payload is JSON.
The payload includes ETF code, ETF name, trading price, estimated NAV,
estimated premium / discount, previous NAV, data date, data time, reference URL,
update interval, rtMessage, and rtCode.
```

## Downloadable Document Inspection

Inspected local copies of the official downloadable files:

```text
ETF issuer operating notes
ETF subscription / redemption operation basic data file
ETFortune ETF basic data file
```

Observed:

```text
ETF issuer operating notes require issuers to provide two URLs to TWSE before
listing: an intraday estimated NAV URL and a formatted data URL for the TWSE
market information ETF issued-units / real-time NAV disclosure area.

ETF subscription / redemption operation basic data file contains fund code,
fund name, issuer, ETF type, approved issued units, creation / redemption
method, settlement timing, order cutoff time, available positions, and contact
information. It does not expose a public JSON URL index.

ETFortune ETF basic data file contains ETF name, security code, listing date,
asset class, issuer, topic tags, distribution frequency / months, return type,
and active ETF investment strategy. It does not expose a public JSON URL index.
```

## Discovery Result

Current conclusion:

```text
No public centralized index of all issuer fixed JSON URLs has been confirmed.
TWSE appears to receive issuer URL submissions through a listing workflow, but
the inspected public downloadable forms do not publish the URL list.
```

This means the project cannot yet build a reliable ETF JSON ingestion job. The
best next research path is to find whether TWSE's market information ETF
issued-units / real-time NAV disclosure area has a public query endpoint or
whether URL access is limited to the exchange workflow.

Follow-up finding:

```text
docs/ETF_MIS_NAV_DISCLOSURE_RESEARCH_2026-05-29.md
```

## Product Impact

Allowed:

```text
continue documentation research
continue internal source readiness scoring
prepare a non-ingesting endpoint probe design
```

Not allowed:

```text
ETF ingestion
issuer JSON crawling
public ETF NAV display
ETF scoring
ETF signal interpretation
```

## CEO Current Decision

```text
REVISE
```

The format evidence improves confidence, but discovery is still unresolved.
