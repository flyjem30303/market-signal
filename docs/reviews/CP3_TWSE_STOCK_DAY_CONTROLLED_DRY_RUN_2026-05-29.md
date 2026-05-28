# CP3 TWSE Stock Day Controlled Dry-Run

Status: controlled dry-run report recorded

Date: 2026-05-29

## CEO Decision

```text
REVISE
```

This is a report-only dry-run. It validates TWSE STOCK_DAY parser behavior and
source depth for one symbol without approving ingestion or public use.

## Guardrails

```text
report-only dry-run
source_id: twse-stock-day
symbol: 2330
exchange_code: TWSE
start_month: 2023-03-01
end_month: 2026-05-01
expected_months: 39
minimum_delay_ms: 800
no raw market rows stored
no CSV / JSON data files written
no Supabase writes
no staging writes
no daily_prices writes
no scoreSource=real
no public backtest claims
CP3 source-depth production gate remains not_ready
Keep public data source mock
```

## Run Metadata

```text
run_type: controlled_report_only_dry_run
decision: ready_for_review
route: https://www.twse.com.tw/exchangeReport/STOCK_DAY
source_url_template: https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=YYYYMMDD&stockNo=SYMBOL
license_url: https://data.gov.tw/license
attribution_text: Data source: Taiwan Stock Exchange / Securities and Futures Bureau, Financial Supervisory Commission, Executive Yuan, R.O.C.; Dataset: Daily Trading Information of Listed Stocks; License: Open Government Data License, version 1.0.
requested_months: 39
successful_months: 39
failed_months: 0
total_parsed_row_count: 787
target_row_count: 756
zero_row_months: none
duplicate_trade_dates: 0
missing_required_field_count: 0
non_numeric_price_count: 0
non_numeric_volume_amount_count: 0
source_note_count: 0
parser_flag_count: 0
http_success_rate: 1.0000
http_status_summary: {"200":39}
first_observed_trade_date: 2023-03-01
last_observed_trade_date: 2026-05-28
started_at: 2026-05-28T19:21:28.418Z
finished_at: 2026-05-28T19:22:11.241Z
```

## Sample Parsed Schema Keys Only

```text
trade_date
source_date
open_price
high_price
low_price
close_price
price_change
volume
trade_value
transaction_count
note
quality_flags
```

## Monthly Validation Summary

month | http_status | parsed_row_count | first_date | last_date | response_bytes | error
--- | ---: | ---: | --- | --- | ---: | ---
2023-03 | 200 | 23 | 2023-03-01 | 2023-03-31 | 3163 | -
2023-04 | 200 | 17 | 2023-04-06 | 2023-04-28 | 2561 | -
2023-05 | 200 | 22 | 2023-05-02 | 2023-05-31 | 3062 | -
2023-06 | 200 | 20 | 2023-06-01 | 2023-06-30 | 2865 | -
2023-07 | 200 | 21 | 2023-07-03 | 2023-07-31 | 2964 | -
2023-08 | 200 | 22 | 2023-08-01 | 2023-08-31 | 3061 | -
2023-09 | 200 | 20 | 2023-09-01 | 2023-09-28 | 2857 | -
2023-10 | 200 | 20 | 2023-10-02 | 2023-10-31 | 2867 | -
2023-11 | 200 | 22 | 2023-11-01 | 2023-11-30 | 3060 | -
2023-12 | 200 | 21 | 2023-12-01 | 2023-12-29 | 2963 | -
2024-01 | 200 | 22 | 2024-01-02 | 2024-01-31 | 3072 | -
2024-02 | 200 | 13 | 2024-02-01 | 2024-02-29 | 2172 | -
2024-03 | 200 | 21 | 2024-03-01 | 2024-03-29 | 2977 | -
2024-04 | 200 | 20 | 2024-04-01 | 2024-04-30 | 2883 | -
2024-05 | 200 | 22 | 2024-05-02 | 2024-05-31 | 3076 | -
2024-06 | 200 | 19 | 2024-06-03 | 2024-06-28 | 2782 | -
2024-07 | 200 | 21 | 2024-07-01 | 2024-07-31 | 3069 | -
2024-08 | 200 | 22 | 2024-08-01 | 2024-08-30 | 3086 | -
2024-09 | 200 | 20 | 2024-09-02 | 2024-09-30 | 2902 | -
2024-10 | 200 | 19 | 2024-10-01 | 2024-10-30 | 2910 | -
2024-11 | 200 | 21 | 2024-11-01 | 2024-11-29 | 3137 | -
2024-12 | 200 | 22 | 2024-12-02 | 2024-12-31 | 3256 | -
2025-01 | 200 | 15 | 2025-01-02 | 2025-01-22 | 2498 | -
2025-02 | 200 | 19 | 2025-02-03 | 2025-02-27 | 2940 | -
2025-03 | 200 | 21 | 2025-03-03 | 2025-03-31 | 3036 | -
2025-04 | 200 | 20 | 2025-04-01 | 2025-04-30 | 2891 | -
2025-05 | 200 | 20 | 2025-05-02 | 2025-05-29 | 2881 | -
2025-06 | 200 | 21 | 2025-06-02 | 2025-06-30 | 3114 | -
2025-07 | 200 | 23 | 2025-07-01 | 2025-07-31 | 3360 | -
2025-08 | 200 | 21 | 2025-08-01 | 2025-08-29 | 3147 | -
2025-09 | 200 | 21 | 2025-09-01 | 2025-09-30 | 3147 | -
2025-10 | 200 | 20 | 2025-10-01 | 2025-10-31 | 3045 | -
2025-11 | 200 | 20 | 2025-11-03 | 2025-11-28 | 3048 | -
2025-12 | 200 | 22 | 2025-12-01 | 2025-12-31 | 3261 | -
2026-01 | 200 | 21 | 2026-01-02 | 2026-01-30 | 3163 | -
2026-02 | 200 | 12 | 2026-02-02 | 2026-02-26 | 2184 | -
2026-03 | 200 | 22 | 2026-03-02 | 2026-03-31 | 3285 | -
2026-04 | 200 | 20 | 2026-04-01 | 2026-04-30 | 3065 | -
2026-05 | 200 | 19 | 2026-05-04 | 2026-05-28 | 2954 | -

## Interpretation

ready_for_review means this report is internally consistent enough for human
review. It does not approve ingestion.

This report does not create staging tables, does not write Supabase, does not
write `daily_prices`, does not store raw market rows, and does not change the
public site data source.

## Remaining Blockers

```text
CEO approval required before ingestion
Legal review required before storage and redistribution
Investment review required before model/backtest use
CP3 source-depth production gate remains not_ready
Public scoreSource=real remains unapproved
```
