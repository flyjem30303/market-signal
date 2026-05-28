# CP3 TWSE Stock Day Staging SQL Design

Status: design only

Date: 2026-05-29

Purpose:

- Define the future SQL migration contract for TWSE `STOCK_DAY` staging.
- Specify table columns, constraints, indexes, RLS posture, and review states.
- Keep this as non-executable design: no migration file, no SQL block, no
  Supabase write, no table creation.

## CEO Decision

```text
REVISE
```

The project may design the future staging SQL contract. It is not approved to
run SQL, create tables, write Supabase, create seed SQL, ingest market rows,
write `daily_prices`, run backtests, or set `scoreSource=real`.

## Inputs

```text
docs/CP3_TWSE_STOCK_DAY_STAGING_BOUNDARY_DESIGN_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_DRY_RUN_HUMAN_REVIEW_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_CONTROLLED_DRY_RUN_2026-05-29.md
```

Accepted evidence:

```text
source_id: twse-stock-day
symbol: 2330
requested_months: 39
successful_months: 39
total_parsed_row_count: 787
duplicate_trade_dates: 0
missing_required_field_count: 0
parser_flag_count: 0
decision: ready_for_review
```

## Non-Negotiable Guardrails

```text
design only
non-executable SQL design
no migration file
no SQL code block
no Supabase writes
no staging writes
no daily_prices writes
no seed SQL
no table creation
no raw market rows stored
no CSV / JSON market data files
no scoreSource=real
no public backtest claims
CP3 source-depth production gate remains not_ready
Keep public data source mock
CEO approval required before migration implementation
```

## Future Migration Scope

Future migration, if separately approved, should define exactly two staging
tables:

```text
staging_twse_stock_day_runs
staging_twse_stock_day_prices
```

Migration must not touch:

```text
daily_prices
stocks
markets
data_runs
public scoring tables
model output tables
```

## Table Contract: staging_twse_stock_day_runs

Future columns:

```text
run_id: uuid primary key
run_type: text, expected staging_candidate
source_id: text, expected twse-stock-day
source_url_template: text
license_url: text
attribution_text: text
requested_symbol_count: integer
requested_month_count: integer
successful_month_count: integer
failed_month_count: integer
total_candidate_row_count: integer
zero_row_months: text array or json list
duplicate_trade_dates: integer
missing_required_field_count: integer
non_numeric_price_count: integer
non_numeric_volume_amount_count: integer
source_note_count: integer
parser_flag_count: integer
http_status_summary: json object
rate_limit_policy: json object
started_at: timestamp with time zone
finished_at: timestamp with time zone
created_by: text
created_at: timestamp with time zone
review_status: text
reviewed_by: text nullable
reviewed_at: timestamp with time zone nullable
review_notes: text nullable
decision: text
```

Future allowed `review_status` values:

```text
draft
pending_review
approved_for_production
rejected
```

Future allowed `decision` values:

```text
blocked
ready_for_review
approved_for_staging_review
```

Required run-level checks:

```text
requested_symbol_count >= 1
requested_month_count >= 1
successful_month_count >= 0
failed_month_count >= 0
total_candidate_row_count >= 0
duplicate_trade_dates >= 0
missing_required_field_count >= 0
non_numeric_price_count >= 0
non_numeric_volume_amount_count >= 0
parser_flag_count >= 0
finished_at >= started_at
reviewed_at is required only after review_status leaves pending_review
```

## Table Contract: staging_twse_stock_day_prices

Future columns:

```text
run_id: uuid foreign key to staging_twse_stock_day_runs
source_id: text, expected twse-stock-day
exchange_code: text, expected TWSE
symbol: text
trade_date: date
open_price: numeric
high_price: numeric
low_price: numeric
close_price: numeric
price_change: numeric nullable
volume: numeric integer-compatible
trade_value: numeric integer-compatible
transaction_count: numeric integer-compatible
note: text nullable
quality_flags: json list
source_fetched_at: timestamp with time zone
source_row_hash: text
created_at: timestamp with time zone
```

Future candidate uniqueness:

```text
unique(run_id, exchange_code, symbol, trade_date)
```

Future value checks:

```text
symbol is not empty
trade_date is not null
open_price >= 0
high_price >= 0
low_price >= 0
close_price >= 0
high_price >= low_price
volume >= 0
trade_value >= 0
transaction_count >= 0
source_row_hash is not empty
```

## Future Index Design

Future indexes should support internal review, cleanup, and later promotion
design:

```text
staging_twse_stock_day_runs by created_at
staging_twse_stock_day_runs by review_status
staging_twse_stock_day_runs by source_id
staging_twse_stock_day_prices by run_id
staging_twse_stock_day_prices by symbol and trade_date
staging_twse_stock_day_prices by source_row_hash
```

## Future RLS And Access Posture

Future security posture:

```text
RLS enabled on both staging tables
no anonymous read
no public authenticated read by default
service role write only for approved staging job
internal review read only through token-gated server route
no browser client direct access
no public API exposes staging rows
```

Required before implementation:

```text
service role usage documented
internal reviewer role model documented
RLS policies reviewed by D / Legal and A / PM+Dev
cleanup policy reviewed before delete capability exists
```

## Future Rollback Contract

Cleanup must be scoped by `run_id`:

```text
dry-run cleanup count required
delete candidate prices by run_id only
mark run review_status as rejected or cleanup_requested before deletion
preserve run metadata unless CEO approves full purge
never delete production daily_prices from staging cleanup
never cascade into production tables
```

## Migration Review Checklist

Before any real migration file is created:

```text
CEO approval recorded for migration implementation
D legal approval recorded for storage and derived use
A parser contract approved for staging fields
C investment limitations recorded
RLS policy text reviewed
rollback and cleanup plan approved
no public UI dependency on staging data
no scoreSource=real dependency
```

## Role Review

A / PM+Dev:

```text
The SQL contract is specific enough for a later migration draft, but this file
is not itself a migration and must not be executed.
```

B / Marketing:

```text
No public claim changes. A staging SQL contract is operational groundwork only.
```

C / Investment:

```text
Candidate price rows are raw-price evidence only. Adjusted-price and universe
methodology remain separate gates before backtest credibility.
```

D / Legal:

```text
RLS, attribution, service role usage, storage purpose, and cleanup policy must
be approved before implementation.
```

E / CEO:

```text
Proceed only to migration review checklist after this design passes. Do not
create migration SQL or run database commands yet.
```

F / Design:

```text
No UI change. Internal review screens remain future work and must be token
gated.
```

## Next Implementation Slice

```text
draft migration review checklist for TWSE STOCK_DAY staging
do not create migration file
do not run SQL
do not write Supabase
do not create staging tables
do not create seed SQL
do not commit raw market data
keep public data source mock
```
