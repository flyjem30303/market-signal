# CP3 Taiwan Stock Endpoint Metadata Probe

Status: metadata probe recorded

Generated at: 2026-05-28T18:42:23.676Z

## CEO Decision

```text
REVISE
```

This report records endpoint metadata only. It is not historical ingestion, not
a source-depth pass, not a backtest, and not approval for public scoring.

## Guardrails

```text
metadata-only endpoint probe
no raw market rows stored
no CSV / JSON data files written
no Supabase writes
no scoreSource=real
no public backtest claims
response bodies discarded after metadata extraction
```

## Probe Results

| ID | HTTP | Content Type | Sample Row Count | Body Bytes Read Then Discarded | Schema Keys | Error |
| --- | --- | --- | --- | --- | --- | --- |
| TWSE-PRICE-DAILY-ALL | 200 | application/json | 1361 | 316394 | Date, Code, Name, TradeVolume, TradeValue, OpeningPrice, HighestPrice, LowestPrice, ClosingPrice, Change, Transaction |  |
| TWSE-PRICE-AVG-ALL | 200 | application/json | 26846 | 3089479 | Date, Code, Name, ClosingPrice, MonthlyAveragePrice |  |
| TWSE-VALUATION-DATE | 200 | application/json | 1077 | 193871 | Date, Code, Name, ClosePrice, DividendYield, DividendYear, PEratio, PBratio, FiscalYearQuarter |  |
| TPEX-PRICE-DAILY | 200 | application/json | 10506 | 4124492 | Date, SecuritiesCompanyCode, CompanyName, Close, Change, Open, High, Low, Average, TradingShares, TransactionAmount, TransactionNumber, LatestBidPrice, LatesAskPrice, Capitals, NextReferencePrice, NextLimitUp, NextLimitDown |  |
| TPEX-VALUATION | 200 | application/json | 887 | 156268 | Date, SecuritiesCompanyCode, CompanyName, PriceEarningRatio, DividendPerShare, YieldRatio, PriceBookRatio |  |

## Interpretation

```text
HTTP 200 with schema keys means the endpoint is reachable for metadata review.
It does not prove historical depth, legal permission, common-stock coverage, or
model readiness.
```

## Remaining Blockers

```text
license / terms reviewed by D
rate-limit / fair-use policy documented
historical date parameter confirmed
field mapping reviewed by A and C
corporate-action handling documented
inactive / delisted symbol handling documented
source-depth smoke still not_ready until approved data exists
```
