# CP3 Taiwan Stock Historical Parameter Probe Plan

Status: probe plan drafted

Date: 2026-05-29

Purpose:

- Define a safe probe for historical date parameters before any source-depth smoke.
- Confirm whether official endpoints can answer specified dates without bulk crawling.
- Keep the project away from accidental historical ingestion.

## CEO Decision

```text
REVISE
```

The next probe may test endpoint parameters for metadata only. It may not store
raw market rows, write Supabase, generate scores, run a backtest, or claim
historical coverage.

## Allowed Probe Scope

```text
metadata-only parameter probe
one endpoint family at a time
maximum 3 test dates per endpoint
maximum 5 endpoints per run
record HTTP status, content type, row count, schema keys, detected date range only
discard response bodies after metadata extraction
write docs/reviews report only
```

## Not Allowed

```text
no bulk crawl
no symbol loop
no month loop
no year loop
no committed CSV / JSON market data
no Supabase writes
no daily_prices writes
no daily_fundamentals writes
no scoreSource=real
no public backtest claims
```

## Candidate Test Dates

```text
latest_known_trade_date: 2026-05-27
recent_prior_trade_date: 2026-05-26
historical_depth_probe_date: 2020-01-02
```

Rationale:

```text
2026-05-27 checks parity with current latest bootstrap data.
2026-05-26 checks whether one prior trading date is accessible.
2020-01-02 checks whether the preferred historical start range is technically reachable.
```

## Candidate Endpoint Families

### TWSE Listed Daily Price

```text
id: TWSE-PRICE-DATE-PARAM
base endpoint family: exchangeReport/STOCK_DAY_ALL
known current endpoint: https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL
candidate date parameter names: date, response, queryDate
expected metadata fields: Date, Code, Name, TradeVolume, TradeValue, OpeningPrice, HighestPrice, LowestPrice, ClosingPrice, Change, Transaction
result status before probe: unknown_parameter_contract
```

### TWSE Listed Valuation

```text
id: TWSE-VALUATION-DATE-PARAM
base endpoint family: exchangeReport/BWIBBU_d
known current endpoint: https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_d
candidate date parameter names: date, response, queryDate
expected metadata fields: Date, Code, Name, ClosePrice, DividendYield, DividendYear, PEratio, PBratio, FiscalYearQuarter
result status before probe: unknown_parameter_contract
```

### TPEx Daily Price

```text
id: TPEX-PRICE-DATE-PARAM
base endpoint family: tpex_mainboard_daily_close_quotes
known current endpoint: https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes
candidate date parameter names: date, d
expected metadata fields: Date, SecuritiesCompanyCode, CompanyName, Close, Change, Open, High, Low, TradingShares, TransactionAmount, TransactionNumber
result status before probe: unknown_parameter_contract
```

### TPEx Valuation

```text
id: TPEX-VALUATION-DATE-PARAM
base endpoint family: tpex_mainboard_peratio_analysis
known current endpoint: https://www.tpex.org.tw/openapi/v1/tpex_mainboard_peratio_analysis
candidate date parameter names: date, d
expected metadata fields: Date, SecuritiesCompanyCode, CompanyName, PriceEarningRatio, DividendPerShare, YieldRatio, PriceBookRatio
result status before probe: unknown_parameter_contract
```

## Report Contract

The parameter probe report must include:

```text
Status: parameter metadata probe recorded
REVISE
no raw market rows stored
no Supabase writes
no scoreSource=real
no public backtest claims
tested endpoint family
tested parameter names
tested dates
HTTP status
content type
row count
schema keys
observed Date values only as metadata
source-depth smoke remains not_ready
```

## Role Review

A / PM+Dev:

```text
The probe should be implemented as a reporter that writes one Markdown review
file only. It should not create reusable ingestion helpers yet.
```

B / Marketing:

```text
No copy or public page should mention historical coverage until the source-depth
gate passes.
```

C / Investment:

```text
Date reachability is necessary but not sufficient. The next blockers are
adjusted prices, suspended trading, delisted symbols, and valuation gaps.
```

D / Legal:

```text
The probe may remain metadata-only. Any automated historical collection still
requires terms, attribution, rate-limit, storage, and derived-use review.
```

E / CEO:

```text
Proceed only to metadata-only parameter probing. Do not build ingestion. Keep
public data source mock.
Keep public data source mock
```

F / Design:

```text
No UI change. Historical depth should eventually appear as confidence and
coverage state, not raw endpoint details.
```

## Exit Criteria

```text
parameter probe report exists
report passes guardrail check
review-gates pass
CP3 source-depth remains not_ready
no market data files are created
```

Historical parameter probe report:

```text
docs/reviews/CP3_TW_STOCK_HISTORICAL_PARAMETER_PROBE_2026-05-29.md
```
