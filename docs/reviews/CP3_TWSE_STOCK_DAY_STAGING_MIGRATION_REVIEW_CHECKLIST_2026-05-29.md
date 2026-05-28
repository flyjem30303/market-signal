# CP3 TWSE Stock Day Staging Migration Review Checklist

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: Staging SQL design completed

Status: migration review checklist recorded

## CEO Decision

```text
REVISE
```

The future staging migration is not approved for implementation. This checklist
defines what must be true before any migration file, SQL execution, Supabase
write, staging table creation, or ingestion job can be approved.

## Evidence

```text
docs/CP3_TWSE_STOCK_DAY_STAGING_BOUNDARY_DESIGN_2026-05-29.md
docs/CP3_TWSE_STOCK_DAY_STAGING_SQL_DESIGN_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_DRY_RUN_HUMAN_REVIEW_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_CONTROLLED_DRY_RUN_2026-05-29.md
```

Accepted technical evidence:

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
checklist only
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

## Approval Checklist

A / PM+Dev must confirm:

```text
parser contract maps all staging fields
staging_twse_stock_day_runs fields are complete
staging_twse_stock_day_prices fields are complete
unique(run_id, exchange_code, symbol, trade_date) is accepted
RLS implementation plan exists before migration
service role usage is isolated to approved staging job
cleanup is scoped by run_id only
dry-run cleanup count is required before deletion
no public API exposes staging rows
internal review route will be token-gated
```

C / Investment must confirm:

```text
raw OHLCV rows are not adjusted returns
corporate-action handling remains unresolved
survivorship-bias policy remains unresolved
inactive / delisted symbol policy remains unresolved
common-stock universe filter remains unresolved
ETF exclusion policy remains unresolved
valuation / fundamental depth remains unresolved
no backtest claim can use staging rows yet
```

D / Legal must confirm:

```text
storage purpose is documented
source attribution text is approved
license URL is recorded
derived-score use is reviewed
redistribution boundaries are documented
rate-limit and retry policy is approved
service role access is reviewed
cleanup and retention policy is approved
```

E / CEO must confirm:

```text
migration implementation is explicitly approved
scope is limited to staging tables only
production daily_prices write remains unapproved
scoreSource=real remains unapproved
public data source remains mock
next rollback point is understood
```

F / Design must confirm:

```text
no public UI depends on staging rows
future internal review UI remains token-gated
source confidence and approval state are not shown publicly yet
```

B / Marketing must confirm:

```text
no public coverage claim is made
no SEO page copy claims real model history
no acquisition copy implies production data approval
```

## Explicit Blockers

The migration must stay blocked if any item is true:

```text
legal approval missing
CEO approval missing
RLS plan missing
service role policy missing
rollback plan missing
cleanup dry-run missing
parser contract mismatch
public route can read staging rows
production table write included
scoreSource=real dependency included
raw market file output included
```

## Future Allowed Migration Scope

If all approval items pass in a separate decision, the future migration may only
define:

```text
staging_twse_stock_day_runs
staging_twse_stock_day_prices
RLS posture for staging tables
indexes for staging review and cleanup
constraints for candidate row quality
```

The future migration must not define or modify:

```text
daily_prices
model scores
public scoring state
market repository switching
public pages
seed market data
raw market data files
```

## CEO Synthesis

```text
The migration review checklist is now sufficient to decide whether a future
staging migration draft can be prepared. It does not approve that draft yet.
The next step is a role review of this checklist, not SQL implementation.
```

## Next Implementation Slice

```text
record role review for TWSE STOCK_DAY staging migration checklist
do not create migration file
do not run SQL
do not write Supabase
do not create staging tables
do not create seed SQL
do not commit raw market data
keep public data source mock
```
