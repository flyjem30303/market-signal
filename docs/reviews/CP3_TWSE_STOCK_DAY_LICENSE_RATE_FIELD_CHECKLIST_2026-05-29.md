# CP3 TWSE Stock Day License Rate And Field Checklist

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: TWSE `STOCK_DAY` 39-month metadata smoke reached 756-row threshold

## CEO Decision

```text
REVISE
```

TWSE `STOCK_DAY` is technically plausible for one-symbol price-history depth.
It is not approved for ingestion, production storage, public backtests, public
real scoring, or `scoreSource=real`.

## Evidence

```text
docs/reviews/CP3_TWSE_STOCK_DAY_SOURCE_DEPTH_SMOKE_2026-05-29.md
```

Observed metadata:

```text
symbol: 2330
route: exchangeReport/STOCK_DAY
start_month: 2023-03-01
end_month: 2026-05-01
month_count: 39
total_row_count: 787
target_row_count: 756
zero_row_months: none
smoke_status: technically_plausible
```

## Official Source References

```text
TWSE daily trading dataset on data.gov.tw
https://data.gov.tw/en/datasets/11549

Government Open Data License
https://data.gov.tw/license

Government Open Data License, English
https://data.gov.tw/en/license

Government Open Data Platform FAQ on use scope
https://data.gov.tw/en/faqs/903

TWSE stock-day historical page
https://www.twse.com.tw/zh/trading/historical/stock-day.html
```

## D / Legal Checklist

Current decision:

```text
not approved for ingestion
not approved for automated historical collection
not approved for production storage
not approved for public raw redistribution
not approved for public backtest claims
not approved for scoreSource=real
```

Promising signals:

```text
data.gov.tw dataset 11549 lists License: Open Government Data License, version 1.0
data.gov.tw dataset 11549 lists Charge: free
data.gov.tw dataset 11549 lists Update frequency: Every day
data.gov.tw dataset 11549 lists Dataset type: Primary data
data.gov.tw FAQ says open data may be used to develop products or services when complying with source citation obligations
```

Required before controlled ingestion design:

```text
confirm STOCK_DAY route is covered by the same dataset/license family as dataset 11549
define attribution text and placement
document no trademark / endorsement implication
document rate-limit / fair-use policy
document retry and backoff policy
document storage scope and retention
document raw-field redistribution restrictions
document derived-score use
record CEO approval for controlled ingestion design
```

Required attribution draft:

```text
Data source: Taiwan Stock Exchange / Securities and Futures Bureau, Financial Supervisory Commission, Executive Yuan, R.O.C.
Dataset: Daily Trading Information of Listed Stocks
License: Open Government Data License, version 1.0
License URL: https://data.gov.tw/license
```

## Rate-Limit / Fair-Use Checklist

Proposed minimum policy:

```text
one request at a time
minimum 800 ms delay between requests
no parallel requests
no retry storm
maximum 3 retries per month after backoff
stop on repeated HTTP 429 / 403 / 5xx
log HTTP status summary
record fetch run metadata
allow manual pause / resume
```

Current status:

```text
rate-limit policy drafted
not approved for production automation
```

## A / PM+Dev Field Mapping Contract

Source route:

```text
https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=YYYYMMDD&stockNo=SYMBOL
```

Source fields observed:

```text
日期
成交股數
成交金額
開盤價
最高價
最低價
收盤價
漲跌價差
成交筆數
註記
```

Normalized `daily_prices` mapping:

```text
source_id: twse-stock-day
exchange_code: TWSE
symbol: stockNo parameter
trade_date: 日期, convert ROC date to ISO date
volume: 成交股數, parse integer after removing separators
trade_value: 成交金額, parse integer after removing separators
open_price: 開盤價, parse decimal or null if non-numeric
high_price: 最高價, parse decimal or null if non-numeric
low_price: 最低價, parse decimal or null if non-numeric
close_price: 收盤價, parse decimal or null if non-numeric
price_change: 漲跌價差, parse signed decimal or null if non-numeric
transaction_count: 成交筆數, parse integer after removing separators
note: 註記, preserve as source note / quality flag input
raw_currency: TWD
raw_unit: share / TWD
source_fetched_at: fetch timestamp
quality_flags: parser and data-quality flags
```

Required parser rules:

```text
convert ROC year to Gregorian year
strip comma separators before numeric parsing
preserve source note as quality signal
flag non-numeric price cells
flag zero-row months
flag duplicate trade dates
flag missing required OHLCV fields
do not infer missing prices silently
```

## C / Investment Checklist

Approved interpretation:

```text
TWSE STOCK_DAY is technically plausible for listed-stock price-history depth
```

Not approved:

```text
adjusted-price return backtests
dividend-adjusted performance claims
survivorship-bias-free universe tests
all-symbol model scoring
valuation/fundamental modules
public CP3 scoreSource=real
```

Required before backtest evidence:

```text
corporate-action handling documented
inactive / delisted symbol policy documented
common-stock universe filter documented
ETF exclusion documented
missing / suspended trading policy documented
valuation / fundamental historical source verified
```

## CEO Synthesis

```text
TWSE STOCK_DAY can move to controlled ingestion design only after D approves
license/rate/attribution requirements and A/C approve parser + interpretation
rules. Until then, keep CP3 source-depth production gate not_ready.
```

## Next Implementation Slice

```text
draft controlled ingestion design for TWSE STOCK_DAY
do not implement ingestion yet
do not write Supabase
do not commit raw market data
keep public data source mock
```

Controlled ingestion design:

```text
docs/CP3_TWSE_STOCK_DAY_CONTROLLED_INGESTION_DESIGN_2026-05-29.md
```
