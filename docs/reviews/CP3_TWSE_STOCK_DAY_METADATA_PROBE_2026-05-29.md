# CP3 TWSE Stock Day Metadata Probe

Status: stock day metadata probe recorded

Generated at: 2026-05-28T18:55:40.067Z

## CEO Decision

```text
REVISE
```

This report records metadata for TWSE STOCK_DAY only. It is not historical
ingestion, not a source-depth pass, not a backtest, and not approval for public
scoring.

## Guardrails

```text
metadata-only stock day probe
one TWSE listed symbol only: 2330
maximum 3 month probes: 20260501, 20200101, 20100101
tested routes: exchangeReport/STOCK_DAY, rwd/zh/afterTrading/STOCK_DAY
no raw market rows stored
no CSV / JSON data files written
no Supabase writes
no scoreSource=real
no public backtest claims
response bodies discarded after metadata extraction
source-depth smoke remains not_ready
Keep public data source mock
```

## Probe Results

| Route | Stock No | Tested Month | HTTP | Content Type | Row Count | First Observed Date | Last Observed Date | Title Metadata | Schema Fields | Stat Keys | Body Bytes Read Then Discarded | Error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TWSE-STOCK-DAY-EXCHANGE-REPORT | 2330 | 20260501 | 200 | application/json;charset=UTF-8 | 19 | 115/05/04 | 115/05/28 | 115年05月 2330 台積電 各日成交資訊 | 日期, 成交股數, 成交金額, 開盤價, 最高價, 最低價, 收盤價, 漲跌價差, 成交筆數, 註記 | unavailable | 2954 |  |
| TWSE-STOCK-DAY-RWD | 2330 | 20260501 | 200 | application/json;charset=UTF-8 | 19 | 115/05/04 | 115/05/28 | 115年05月 2330 台積電 各日成交資訊 | 日期, 成交股數, 成交金額, 開盤價, 最高價, 最低價, 收盤價, 漲跌價差, 成交筆數, 註記 | unavailable | 2954 |  |
| TWSE-STOCK-DAY-EXCHANGE-REPORT | 2330 | 20200101 | 200 | application/json;charset=UTF-8 | 15 | 109/01/02 | 109/01/31 | 109年01月 2330 台積電 各日成交資訊 | 日期, 成交股數, 成交金額, 開盤價, 最高價, 最低價, 收盤價, 漲跌價差, 成交筆數, 註記 | unavailable | 2367 |  |
| TWSE-STOCK-DAY-RWD | 2330 | 20200101 | 200 | application/json;charset=UTF-8 | 15 | 109/01/02 | 109/01/31 | 109年01月 2330 台積電 各日成交資訊 | 日期, 成交股數, 成交金額, 開盤價, 最高價, 最低價, 收盤價, 漲跌價差, 成交筆數, 註記 | unavailable | 2367 |  |
| TWSE-STOCK-DAY-EXCHANGE-REPORT | 2330 | 20100101 | 200 | application/json;charset=UTF-8 | 20 | 99/01/04 | 99/01/29 | 99年01月 2330 台積電 各日成交資訊 | 日期, 成交股數, 成交金額, 開盤價, 最高價, 最低價, 收盤價, 漲跌價差, 成交筆數, 註記 | unavailable | 2679 |  |
| TWSE-STOCK-DAY-RWD | 2330 | 20100101 | 200 | application/json;charset=UTF-8 | 20 | 99/01/04 | 99/01/29 | 99年01月 2330 台積電 各日成交資訊 | 日期, 成交股數, 成交金額, 開盤價, 最高價, 最低價, 收盤價, 漲跌價差, 成交筆數, 註記 | unavailable | 2679 |  |

## Observed Range Summary

```text
TWSE-STOCK-DAY-EXCHANGE-REPORT 20260501: rows=19, range=115/05/04..115/05/28
TWSE-STOCK-DAY-RWD 20260501: rows=19, range=115/05/04..115/05/28
TWSE-STOCK-DAY-EXCHANGE-REPORT 20200101: rows=15, range=109/01/02..109/01/31
TWSE-STOCK-DAY-RWD 20200101: rows=15, range=109/01/02..109/01/31
TWSE-STOCK-DAY-EXCHANGE-REPORT 20100101: rows=20, range=99/01/04..99/01/29
TWSE-STOCK-DAY-RWD 20100101: rows=20, range=99/01/04..99/01/29
```

## Interpretation

```text
Changing observed date ranges by requested month suggests STOCK_DAY can provide
month-level historical data for one TWSE-listed stock.
This does not approve bulk crawling, storage, backtests, public scoring, or
derived public claims.
```

## Remaining Blockers

```text
license / terms reviewed by D
rate-limit / fair-use policy documented
confirmed route selected
field mapping reviewed by A and C
corporate-action handling documented
inactive / delisted symbol handling documented
source-depth smoke still not_ready until approved data exists
```
