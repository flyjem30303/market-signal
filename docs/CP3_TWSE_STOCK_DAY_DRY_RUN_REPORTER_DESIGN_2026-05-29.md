# CP3 TWSE Stock Day Dry-Run Reporter Design

Status: design only

Date: 2026-05-29

Purpose:

- Define a report-only dry-run reporter for TWSE `STOCK_DAY`.
- Validate parser and run metadata without writing Supabase or staging tables.
- Keep CP3 source-depth production gate closed until separate CEO approval.

## CEO Decision

```text
REVISE
```

The dry-run reporter can be designed. It is not approved for implementation,
not approved for staging writes, not approved for production writes, and not
approved for public `scoreSource=real`.

## Inputs

```text
docs/CP3_TWSE_STOCK_DAY_CONTROLLED_INGESTION_DESIGN_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_LICENSE_RATE_FIELD_CHECKLIST_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_SOURCE_DEPTH_SMOKE_2026-05-29.md
```

## Non-Negotiable Guardrails

```text
design only
report-only dry-run
do not implement reporter yet
do not write Supabase
do not create staging tables
do not write daily_prices
do not commit raw market data
do not commit CSV / JSON market data
do not set scoreSource=real
do not run CP3 backtests
keep CP3 source-depth production gate not_ready
keep public data source mock
CEO approval required before reporter implementation
```

## Reporter Scope

First dry-run reporter, if later approved:

```text
symbol: 2330
exchange_code: TWSE
source_id: twse-stock-day
route: https://www.twse.com.tw/exchangeReport/STOCK_DAY
start_month: 2023-03-01
end_month: 2026-05-01
expected_months: 39
minimum_delay_ms: 800
parallel_requests: 0
max_retries_per_month: 3
output: docs/reviews markdown report only
```

## Parser Dry-Run Summary

The reporter may fetch source responses in memory and immediately discard raw
responses after extracting validation counters.

Allowed output:

```text
run metadata
HTTP status summary
month count
total parsed row count
first observed trade date
last observed trade date
zero-row months
duplicate trade date count
missing required field count
non-numeric price count
non-numeric volume / amount count
source note count
sample parsed schema keys only
decision: report_only / blocked / ready_for_review
```

Not allowed output:

```text
daily row data
raw response body
CSV / JSON market data
SQL inserts
Supabase mutations
price series charts
model scores
backtest metrics
```

## Parser Rules

Required parser behavior:

```text
convert ROC date to ISO date
strip comma separators
parse open_price, high_price, low_price, close_price, price_change as decimals
parse volume, trade_value, transaction_count as integers
preserve source note only as aggregate source note count
flag non-numeric price cells
flag non-numeric volume / amount cells
flag zero-row months
flag duplicate trade dates
flag missing required OHLCV fields
do not infer missing prices silently
discard raw rows after counting validation results
```

## Report Contract

The dry-run reporter output must include:

```text
Status: controlled dry-run report recorded
REVISE
report-only dry-run
source_id: twse-stock-day
symbol: 2330
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
duplicate_trade_dates
missing_required_field_count
non_numeric_price_count
non_numeric_volume_amount_count
decision: report_only / blocked / ready_for_review
CP3 source-depth production gate remains not_ready
```

## Validation Interpretation

```text
ready_for_review means the dry-run output is internally consistent enough for
human review. It does not approve ingestion.
```

Blocked conditions:

```text
HTTP success rate below 0.95
total parsed row count below 756
duplicate trade dates greater than 0
missing required field count greater than 0
zero-row months not reviewed
parser exceptions
rate-limit or fair-use concern
```

## Role Review

A / PM+Dev:

```text
Reporter implementation may be proposed next, but it must remain report-only.
No database client should be imported by this reporter.
```

B / Marketing:

```text
No public copy change. Internal technical plausibility is not public historical
coverage.
```

C / Investment:

```text
Dry-run parser validation is useful for price history only. It does not validate
adjusted returns, fundamental depth, or model credibility.
```

D / Legal:

```text
Reporter must remain rate-limited and report-only until attribution, storage,
redistribution, and derived-score use are approved.
```

E / CEO:

```text
Proceed only to reporter implementation after explicit approval. Keep no-write
policy and public data source mock.
```

F / Design:

```text
No UI change. Future source confidence display remains deferred.
```

## Next Implementation Slice

```text
implement controlled dry-run reporter only if CEO approves
do not create staging tables
do not write Supabase
do not commit raw market data
```

Controlled dry-run report:

```text
docs/reviews/CP3_TWSE_STOCK_DAY_CONTROLLED_DRY_RUN_2026-05-29.md
```
