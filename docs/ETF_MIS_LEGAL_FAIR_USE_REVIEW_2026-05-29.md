# ETF MIS Legal / Fair-Use Review

Date: 2026-05-29

Status: blocked for ingestion and adapter scheduling

This is a project risk review, not legal advice.

## Sources Reviewed

```text
https://www.twse.com.tw/zh/terms/use.html
https://www.twse.com.tw/zh/products/information/use.html
https://twse-regulation.twse.com.tw/TW/law/DAT08_print.aspx?FLCODE=FL007129
```

## D / Legal Findings

TWSE website terms restrict unapproved automated downloads, scripts, crawlers,
spiders, scrapers, or similar automated methods for obtaining site software or
data.

TWSE information service guidance says applicants using TWSE information must
follow TWSE trading-information rules, sign the appropriate contract, and pay
the relevant information fees.

TWSE trading-information rules define trading information broadly as TWSE
developed or transmitted centralized securities market information and
derivative information. The rules also restrict retransmission, resale,
transfer, and use of information from parties without a TWSE contract.

## Project Interpretation

The MIS ETF surfaces are technically reachable, but reachability is not
permission.

The project must not treat the following as approved:

```text
scheduled polling
automated ingestion
Supabase persistence
seed data persistence
public display
redistribution
ETF scoring based on MIS payloads
commercial use of MIS payloads
```

The only currently acceptable use is manual, low-frequency, non-persistent
internal validation for source assessment. The validation output may record
HTTP status, parse shape, missing-field counts, sample dates, and blocker notes,
but must not store or republish full payloads.

## Required Approval Path

Before adapter design or ingestion, one of these must exist:

```text
written TWSE permission for the intended use
approved TWSE trading-information contract
approved vendor license with storage, display, and redistribution rights
explicit official API / open-data terms covering the intended use
```

## CEO Decision

```text
REVISE
```

ETF MIS remains an evidence source for due diligence only. It is not a product
data source.

Next allowed work:

```text
document permission questions
prepare TWSE / vendor inquiry checklist
keep smoke reporter manual and non-ingesting
continue non-ETF product work from approved TWSE OpenAPI stock data
```
