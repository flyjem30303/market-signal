# CP3 TWSE Stock Day Controlled Ingestion Design

Status: design only

Date: 2026-05-29

Purpose:

- Define a controlled ingestion architecture for TWSE `STOCK_DAY`.
- Keep architecture separate from implementation and Supabase writes.
- Preserve CP3 governance before any historical data enters production tables.

## CEO Decision

```text
REVISE
```

Controlled ingestion can be designed. It is not approved for implementation,
not approved for Supabase writes, not approved for backtests, and not approved
for public `scoreSource=real`.

## Inputs

```text
docs/reviews/CP3_TWSE_STOCK_DAY_SOURCE_DEPTH_SMOKE_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_LICENSE_RATE_FIELD_CHECKLIST_2026-05-29.md
```

Current evidence:

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

## Non-Negotiable Guardrails

```text
design only
do not implement ingestion yet
do not write Supabase
do not write daily_prices
do not commit raw market data
do not commit CSV / JSON market data
do not set scoreSource=real
do not run CP3 backtests
keep CP3 source-depth production gate not_ready
keep public data source mock
CEO approval required before implementation
```

## Proposed Architecture

```text
fetch plan -> metadata preflight -> source fetch -> parser -> validation -> staging review -> approval gate -> production write
```

Allowed next implementation, if CEO later approves:

```text
dry-run reporter only
metadata + validation summary only
no database writes
no raw response file output
```

Not allowed without separate CEO approval:

```text
staging table writes
production daily_prices writes
all-symbol crawl
scheduled automation
public UI switch
model scoring from historical data
```

## Fetch Plan

Scope for first controlled run:

```text
symbol: 2330
exchange_code: TWSE
route: https://www.twse.com.tw/exchangeReport/STOCK_DAY
start_month: 2023-03-01
end_month: 2026-05-01
expected_months: 39
minimum_delay_ms: 800
parallel_requests: 0
max_retries_per_month: 3
stop_on_repeated_status: 429 / 403 / 5xx
```

## Run Metadata Contract

Every dry-run or later approved ingestion run must record:

```text
run_id
run_type: dry-run / staging / production
source_id: twse-stock-day
source_url_template
license_url
attribution_text
requested_symbol_count
requested_month_count
successful_month_count
failed_month_count
total_row_count
zero_row_months
duplicate_trade_dates
missing_required_field_count
non_numeric_price_count
http_status_summary
started_at
finished_at
decision: report_only / blocked / ready_for_review / approved
```

## Parser Contract

Source field mapping:

```text
日期 -> trade_date
成交股數 -> volume
成交金額 -> trade_value
開盤價 -> open_price
最高價 -> high_price
最低價 -> low_price
收盤價 -> close_price
漲跌價差 -> price_change
成交筆數 -> transaction_count
註記 -> note / quality_flags
```

Required parser behavior:

```text
convert ROC year to Gregorian year
strip comma separators
parse prices as decimal
parse volume, trade_value, transaction_count as integers
preserve source note as quality signal
flag non-numeric price cells
flag zero-row months
flag duplicate trade dates
flag missing required OHLCV fields
do not infer missing prices silently
```

## Validation Gates

Dry-run summary must pass:

```text
http_success_rate >= 0.95
total_row_count >= 756 for the first approved one-symbol window
zero_row_months reviewed
duplicate_trade_dates == 0
missing_required_field_count == 0
non_numeric_price_count reviewed
first_observed_date <= expected_start_window
last_observed_date >= expected_end_window
```

Even if all pass:

```text
production source-depth gate remains not_ready until CEO approves ingestion
```

## Staging Design

Staging is not approved yet. If approved later, staging must be separate from
production tables:

```text
staging_twse_stock_day_prices
staging_ingestion_runs
```

Staging rows should include:

```text
run_id
source_id
exchange_code
symbol
trade_date
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
source_fetched_at
```

## Production Write Gate

Before any `daily_prices` write:

```text
D legal approval recorded
rate-limit / fair-use policy approved
attribution text approved
A parser contract approved
C investment interpretation approved
corporate-action handling documented
inactive / delisted symbol policy documented
common-stock / ETF exclusion policy documented
rollback plan documented
CEO approval recorded
```

## Role Review

A / PM+Dev:

```text
Architecture is ready for a dry-run reporter design, not an ingestion
implementation.
```

B / Marketing:

```text
No public messaging yet. Historical coverage cannot be claimed until production
source-depth and legal gates pass.
```

C / Investment:

```text
Price history alone is not model credibility. Adjusted price, survivorship bias,
inactive symbols, and valuation/fundamental depth remain blockers.
```

D / Legal:

```text
Do not automate collection beyond metadata/dry-run review until attribution,
storage, rate, redistribution, and derived-score use are approved.
```

E / CEO:

```text
Proceed only to controlled dry-run reporter design. No Supabase writes. Keep
public data source mock.
```

F / Design:

```text
No UI change. Future UI should expose source confidence only after approval.
```

## Next Implementation Slice

```text
draft dry-run reporter design for TWSE STOCK_DAY controlled ingestion
do not implement database writes
do not create staging tables yet
do not commit raw market data
```

Dry-run reporter design:

```text
docs/CP3_TWSE_STOCK_DAY_DRY_RUN_REPORTER_DESIGN_2026-05-29.md
```
