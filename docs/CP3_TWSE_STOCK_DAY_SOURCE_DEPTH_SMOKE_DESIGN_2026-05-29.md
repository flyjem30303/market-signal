# CP3 TWSE Stock Day Source Depth Smoke Design

Status: smoke design drafted

Date: 2026-05-29

Purpose:

- Define a safe source-depth smoke approach for TWSE `STOCK_DAY`.
- Estimate whether one listed stock can reach the CP3 756-trading-date target.
- Keep the work separate from ingestion, backtesting, and public scoring.

## CEO Decision

```text
REVISE
```

Design may proceed. Execution is limited to metadata-only probes until legal,
rate-limit, and field-contract blockers are cleared. No ingestion is approved.

## Evidence So Far

```text
docs/reviews/CP3_TWSE_STOCK_DAY_METADATA_PROBE_2026-05-29.md
```

Observed result:

```text
STOCK_DAY returned month-level historical ranges for 2330
20260501: 115/05/04..115/05/28
20200101: 109/01/02..109/01/31
20100101: 99/01/04..99/01/29
exchangeReport/STOCK_DAY and rwd/zh/afterTrading/STOCK_DAY behaved consistently
```

## Smoke Goal

```text
confirm price history can plausibly reach at least 756 trading dates
confirm preferred start date 2020-01-01 or earlier is technically reachable
confirm route behavior is stable enough for a later approved source-depth run
do not validate fundamentals yet
do not validate all symbols yet
```

## Proposed Metadata-Only Method

Allowed method:

```text
one TWSE listed symbol only: 2330
one selected route only: exchangeReport/STOCK_DAY
monthly metadata probes only
record month, HTTP status, row count, first observed date, last observed date, title metadata, schema fields
discard response bodies after metadata extraction
write docs/reviews report only
```

Initial smoke window:

```text
start_month: 2023-06-01
end_month: 2026-05-01
expected_months: 36
expected_trading_dates_target: 756
```

Rationale:

```text
36 months is the minimum practical window for 756 trading dates.
It is small enough for one-symbol metadata validation.
It is not sufficient to approve production crawling or public scoring.
```

## Run Limits

```text
maximum 36 month probes
minimum 800 ms delay between requests
one symbol only
one route only
no retry storm
stop on repeated HTTP 429 / 403 / 5xx
no parallel requests
```

## Not Allowed

```text
no bulk crawl
no symbol loop
no market-wide scan
no year loop beyond defined smoke window
no raw market rows stored
no CSV / JSON data files written
no Supabase writes
no daily_prices writes
no scoreSource=real
no public backtest claims
```

## Report Contract

The source-depth smoke report must include:

```text
Status: source-depth metadata smoke recorded
REVISE
one TWSE listed symbol only: 2330
one selected route only: exchangeReport/STOCK_DAY
start_month: 2023-06-01
end_month: 2026-05-01
month_count
total_row_count
unique_observed_month_count
first_observed_date
last_observed_date
schema fields
HTTP status summary
no raw market rows stored
no Supabase writes
no scoreSource=real
no public backtest claims
source-depth gate remains not_ready unless CEO separately approves ingestion
```

## Acceptance Interpretation

```text
If total_row_count is at least 756 and first_observed_date is 2023-06 or earlier,
then TWSE STOCK_DAY is technically plausible for price-history depth.
```

This still does not approve:

```text
legal use
automated collection
production storage
all-symbol coverage
fundamental depth
corporate-action adjustment
backtest validity
public scoring
```

## Role Review

A / PM+Dev:

```text
Implement only a metadata reporter. Do not create ingestion helpers or database
write paths.
```

B / Marketing:

```text
No public claim should mention historical coverage. This remains internal
source qualification.
```

C / Investment:

```text
This can only support a price-history feasibility claim. CP3 still needs
valuation/fundamental depth, adjusted-price policy, and survivorship-bias policy.
```

D / Legal:

```text
The probe must be rate-limited and metadata-only. Automated collection,
storage, attribution, and derived-score rights remain unresolved.
Automated collection, storage, attribution, and derived-score rights remain unresolved
```

E / CEO:

```text
Proceed to one-symbol metadata-only source-depth smoke. Do not ingest. Keep
public data source mock.
Keep public data source mock
```

F / Design:

```text
No UI change. Later coverage should be shown as confidence and freshness state,
not endpoint mechanics.
```

## Exit Criteria

```text
source-depth smoke reporter exists
metadata report exists
guardrail check passes
review-gates pass
CP3 source-depth production gate remains not_ready
```
