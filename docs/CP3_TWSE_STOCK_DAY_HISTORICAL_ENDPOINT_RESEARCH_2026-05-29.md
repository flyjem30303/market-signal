# CP3 TWSE Stock Day Historical Endpoint Research

Status: candidate historical endpoint identified

Date: 2026-05-29

Purpose:

- Record the TWSE individual stock historical query path after `STOCK_DAY_ALL`
  appeared to ignore date parameters.
- Separate true historical endpoint research from bulk collection.
- Define the next metadata-only probe target for CP3 Taiwan stock source depth.

## CEO Decision

```text
REVISE
```

The project may probe the endpoint for metadata only. It may not bulk crawl,
write Supabase, store raw rows, run backtests, or set `scoreSource=real`.

## Why This Exists

Previous probe:

```text
docs/reviews/CP3_TW_STOCK_HISTORICAL_PARAMETER_PROBE_2026-05-29.md
```

Observed result:

```text
STOCK_DAY_ALL returned HTTP 200 for all tested date parameters
STOCK_DAY_ALL returned the same observed date 1150527 for 20260527, 20260526, and 20200102
current interpretation: STOCK_DAY_ALL is likely a latest snapshot endpoint
```

## Candidate Endpoint

Official page:

```text
https://www.twse.com.tw/zh/trading/historical/stock-day.html
```

Candidate query URL:

```text
https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=YYYYMMDD&stockNo=2330
```

Candidate alternate route:

```text
https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY?response=json&date=YYYYMMDD&stockNo=2330
```

Candidate parameters:

```text
response=json
date=YYYYMMDD
stockNo=stock symbol
```

Candidate meaning:

```text
date appears to select the month containing the requested date
stockNo appears to select one listed security
```

## Metadata-Only Probe Scope

Allowed next probe:

```text
one TWSE listed symbol only: 2330
maximum 3 month probes: 20260501, 20200101, 20100101
record HTTP status, content type, row count, schema keys, title/stat metadata, observed date range only
discard response bodies after metadata extraction
write docs/reviews report only
```

Not allowed:

```text
no bulk crawl
no symbol loop
no month loop
no year loop
no raw market rows stored
no CSV / JSON data files written
no Supabase writes
no scoreSource=real
no public backtest claims
```

## Contract Questions

```text
does exchangeReport/STOCK_DAY support pre-2020 dates
does rwd/zh/afterTrading/STOCK_DAY behave the same as exchangeReport/STOCK_DAY
does the endpoint return month-level rows for one stock
does the response include title/stat metadata that confirms symbol and month
does TWSE official page or data.gov.tw license cover automated use of this route
what attribution is required if normalized historical data is eventually used
```

## Role Review

A / PM+Dev:

```text
This is a better historical candidate than STOCK_DAY_ALL. Build a metadata-only
probe reporter before considering any historical-data architecture.
```

B / Marketing:

```text
No public statement should claim historical data coverage. This is only a source
qualification step.
```

C / Investment:

```text
Month-level stock price rows can support future price-history depth, but they
still do not solve adjusted price, delisted symbol, survivorship bias, or
fundamental history.
```

D / Legal:

```text
The endpoint sits on an official TWSE historical page path, but automated
collection, storage, attribution, and derived-score use still require review.
automated collection, storage, attribution, and derived-score use still require review
```

E / CEO:

```text
Proceed to one-symbol metadata-only probe. Do not bulk crawl. Do not ingest.
```

F / Design:

```text
No UI change. If this source later becomes approved, expose coverage and
confidence rather than endpoint mechanics.
```

## Exit Criteria Before Moving On

```text
metadata-only probe report exists
report confirms whether observed month changes by requested date
report confirms no raw rows were stored
review-gates pass
CP3 source-depth remains not_ready
```
