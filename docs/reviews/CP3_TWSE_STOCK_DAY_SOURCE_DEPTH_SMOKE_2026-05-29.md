# CP3 TWSE Stock Day Source Depth Smoke

Status: source-depth metadata smoke recorded

Generated at: 2026-05-28T19:04:36.986Z

## CEO Decision

```text
REVISE
```

This report records metadata-only source-depth smoke for one TWSE stock. It is
not historical ingestion, not production source-depth approval, not a backtest,
and not approval for public scoring.

## Guardrails

```text
one TWSE listed symbol only: 2330
one selected route only: exchangeReport/STOCK_DAY
start_month: 2023-03-01
end_month: 2026-05-01
maximum 39 month probes
minimum 800 ms delay between requests
no parallel requests
no raw market rows stored
no CSV / JSON data files written
no Supabase writes
no daily_prices writes
no scoreSource=real
no public backtest claims
source-depth gate remains not_ready unless CEO separately approves ingestion
Keep public data source mock
```

## Summary

```text
month_count: 39
total_row_count: 787
target_row_count: 756
unique_observed_month_count: 39
first_observed_date: 112/03/01
last_observed_date: 115/05/28
zero_row_months: none
smoke_status: technically_plausible
HTTP status summary: 200:39
schema fields: 日期, 成交股數, 成交金額, 開盤價, 最高價, 最低價, 收盤價, 漲跌價差, 成交筆數, 註記
```

## Monthly Metadata

| Month | HTTP | Row Count | First Observed Date | Last Observed Date | Body Bytes Read Then Discarded | Error |
| --- | --- | --- | --- | --- | --- | --- |
| 2023-03 | 200 | 23 | 112/03/01 | 112/03/31 | 3163 |  |
| 2023-04 | 200 | 17 | 112/04/06 | 112/04/28 | 2561 |  |
| 2023-05 | 200 | 22 | 112/05/02 | 112/05/31 | 3062 |  |
| 2023-06 | 200 | 20 | 112/06/01 | 112/06/30 | 2865 |  |
| 2023-07 | 200 | 21 | 112/07/03 | 112/07/31 | 2964 |  |
| 2023-08 | 200 | 22 | 112/08/01 | 112/08/31 | 3061 |  |
| 2023-09 | 200 | 20 | 112/09/01 | 112/09/28 | 2857 |  |
| 2023-10 | 200 | 20 | 112/10/02 | 112/10/31 | 2867 |  |
| 2023-11 | 200 | 22 | 112/11/01 | 112/11/30 | 3060 |  |
| 2023-12 | 200 | 21 | 112/12/01 | 112/12/29 | 2963 |  |
| 2024-01 | 200 | 22 | 113/01/02 | 113/01/31 | 3072 |  |
| 2024-02 | 200 | 13 | 113/02/01 | 113/02/29 | 2172 |  |
| 2024-03 | 200 | 21 | 113/03/01 | 113/03/29 | 2977 |  |
| 2024-04 | 200 | 20 | 113/04/01 | 113/04/30 | 2883 |  |
| 2024-05 | 200 | 22 | 113/05/02 | 113/05/31 | 3076 |  |
| 2024-06 | 200 | 19 | 113/06/03 | 113/06/28 | 2782 |  |
| 2024-07 | 200 | 21 | 113/07/01 | 113/07/31 | 3069 |  |
| 2024-08 | 200 | 22 | 113/08/01 | 113/08/30 | 3086 |  |
| 2024-09 | 200 | 20 | 113/09/02 | 113/09/30 | 2902 |  |
| 2024-10 | 200 | 19 | 113/10/01 | 113/10/30 | 2910 |  |
| 2024-11 | 200 | 21 | 113/11/01 | 113/11/29 | 3137 |  |
| 2024-12 | 200 | 22 | 113/12/02 | 113/12/31 | 3256 |  |
| 2025-01 | 200 | 15 | 114/01/02 | 114/01/22 | 2498 |  |
| 2025-02 | 200 | 19 | 114/02/03 | 114/02/27 | 2940 |  |
| 2025-03 | 200 | 21 | 114/03/03 | 114/03/31 | 3036 |  |
| 2025-04 | 200 | 20 | 114/04/01 | 114/04/30 | 2891 |  |
| 2025-05 | 200 | 20 | 114/05/02 | 114/05/29 | 2881 |  |
| 2025-06 | 200 | 21 | 114/06/02 | 114/06/30 | 3114 |  |
| 2025-07 | 200 | 23 | 114/07/01 | 114/07/31 | 3360 |  |
| 2025-08 | 200 | 21 | 114/08/01 | 114/08/29 | 3147 |  |
| 2025-09 | 200 | 21 | 114/09/01 | 114/09/30 | 3147 |  |
| 2025-10 | 200 | 20 | 114/10/01 | 114/10/31 | 3045 |  |
| 2025-11 | 200 | 20 | 114/11/03 | 114/11/28 | 3048 |  |
| 2025-12 | 200 | 22 | 114/12/01 | 114/12/31 | 3261 |  |
| 2026-01 | 200 | 21 | 115/01/02 | 115/01/30 | 3163 |  |
| 2026-02 | 200 | 12 | 115/02/02 | 115/02/26 | 2184 |  |
| 2026-03 | 200 | 22 | 115/03/02 | 115/03/31 | 3285 |  |
| 2026-04 | 200 | 20 | 115/04/01 | 115/04/30 | 3065 |  |
| 2026-05 | 200 | 19 | 115/05/04 | 115/05/28 | 2954 |  |

## Interpretation

```text
If total_row_count is at least 756 and first_observed_date reaches the expected
window, TWSE STOCK_DAY is technically plausible for one-symbol price-history
depth.
This does not approve legal use, automated collection, production storage,
all-symbol coverage, fundamental depth, corporate-action adjustment, backtest
validity, or public scoring.
```

## Remaining Blockers

```text
license / terms reviewed by D
rate-limit / fair-use policy documented
route selected for approved collection
field mapping reviewed by A and C
zero-row month handling documented
corporate-action handling documented
inactive / delisted symbol handling documented
fundamental / valuation history still unverified
CP3 source-depth production gate remains not_ready
```
