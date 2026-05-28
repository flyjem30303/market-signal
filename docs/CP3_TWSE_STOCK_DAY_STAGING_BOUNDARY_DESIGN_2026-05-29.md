# CP3 TWSE Stock Day Staging Boundary Design

Status: design only

Date: 2026-05-29

Purpose:

- Define the staging boundary for future TWSE `STOCK_DAY` ingestion.
- Document table contracts, approval workflow, audit fields, and rollback plan.
- Keep this as design only: no SQL, no Supabase writes, no table creation.

## CEO Decision

```text
REVISE
```

The project may design the staging boundary. It is not approved to implement
staging tables, write Supabase, write `daily_prices`, produce seed SQL, run
backtests, or switch public scoring to `scoreSource=real`.

## Inputs

```text
docs/reviews/CP3_TWSE_STOCK_DAY_CONTROLLED_DRY_RUN_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_DRY_RUN_HUMAN_REVIEW_2026-05-29.md
docs/CP3_TWSE_STOCK_DAY_CONTROLLED_INGESTION_DESIGN_2026-05-29.md
```

Current accepted evidence:

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
CEO approval required before staging implementation
```

## Boundary Principle

```text
source fetch -> parser -> validation summary -> staging candidate rows -> manual review -> approval gate -> production write
```

This document defines only the future staging candidate boundary. It does not
authorize writing candidate rows.

## Proposed Staging Tables

Future table names, if approved later:

```text
staging_twse_stock_day_runs
staging_twse_stock_day_prices
```

Table responsibility:

```text
staging_twse_stock_day_runs: one row per approved staging attempt metadata
staging_twse_stock_day_prices: normalized candidate price rows tied to run_id
```

Not allowed in this design slice:

```text
CREATE TABLE
ALTER TABLE
INSERT
UPSERT
DELETE
TRUNCATE
Supabase client write
SQL migration file
seed SQL file
```

## Run Table Contract

Future `staging_twse_stock_day_runs` fields:

```text
run_id
run_type: staging_candidate
source_id: twse-stock-day
source_url_template
license_url
attribution_text
requested_symbol_count
requested_month_count
successful_month_count
failed_month_count
total_candidate_row_count
zero_row_months
duplicate_trade_dates
missing_required_field_count
non_numeric_price_count
non_numeric_volume_amount_count
source_note_count
parser_flag_count
http_status_summary
rate_limit_policy
started_at
finished_at
created_by
review_status: draft / pending_review / approved_for_production / rejected
reviewed_by
reviewed_at
review_notes
decision: blocked / ready_for_review / approved_for_staging_review
```

## Candidate Price Row Contract

Future `staging_twse_stock_day_prices` fields:

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
source_row_hash
created_at
```

Candidate uniqueness rule:

```text
unique(run_id, exchange_code, symbol, trade_date)
```

Future production uniqueness rule remains separate:

```text
unique(source_id, exchange_code, symbol, trade_date)
```

## Manual Approval Workflow

```text
1. PM+Dev runs approved staging candidate job.
2. System records run metadata and candidate rows in staging only.
3. PM+Dev reviews row counts, duplicate dates, missing fields, parser flags.
4. Legal reviews attribution, storage scope, redistribution, and derived use.
5. Investment reviews interpretation limits and model/backtest blockers.
6. CEO records approval or rejection.
7. Only after CEO approval can a separate production-write design begin.
```

Approval states:

```text
draft
pending_review
approved_for_production
rejected
```

## Rollback And Cleanup Plan

Rollback requirements before implementation:

```text
delete by run_id only
never delete production daily_prices from staging cleanup
cleanup must preserve run review notes unless CEO approves full purge
failed staging runs must remain auditable until reviewed
cleanup command must be dry-run capable
cleanup command must report candidate row count before deletion
```

## Audit And Governance

Required audit fields:

```text
run_id
created_by
created_at
review_status
reviewed_by
reviewed_at
review_notes
rate_limit_policy
source_url_template
license_url
attribution_text
source_row_hash
```

Required governance checks:

```text
RLS policy reviewed before staging implementation
service role usage documented before staging implementation
no public API exposes staging rows
internal route token gate required before any staging review UI
no raw response body stored
no public score depends on staging rows
```

## Role Review

A / PM+Dev:

```text
The staging boundary is technically coherent. Implementation should wait for a
separate SQL design and explicit CEO approval.
```

B / Marketing:

```text
No public copy change. Staging data is not a product claim.
```

C / Investment:

```text
Staging rows may support future backtest preparation, but adjusted-price,
survivorship, universe, ETF exclusion, and valuation/fundamental depth remain
outside this approval.
```

D / Legal:

```text
Storage and derived use still require explicit approval. This design preserves
attribution and audit requirements but does not approve collection.
```

E / CEO:

```text
Proceed only to staging SQL design after this boundary passes review. Do not
implement table creation or writes yet.
```

F / Design:

```text
No UI change. Future internal review UI should expose run status, source
confidence, and approval state only behind token-gated internal routes.
```

## Next Implementation Slice

```text
draft staging SQL design for TWSE STOCK_DAY
do not run SQL
do not write Supabase
do not create staging tables
do not create seed SQL yet
do not commit raw market data
keep public data source mock
```
