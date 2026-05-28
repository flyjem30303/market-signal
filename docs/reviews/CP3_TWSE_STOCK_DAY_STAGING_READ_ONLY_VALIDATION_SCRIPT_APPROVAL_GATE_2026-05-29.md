# CP3 TWSE Stock Day Staging Read-Only Validation Script Approval Gate

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: Read-only validation script design completed

Status: CEO read-only validation script approval gate recorded

## CEO Decision

```text
PROCEED
```

CEO approves creating a read-only validation script draft and a static safety
checker. CEO does not approve running the script against Supabase yet. Remote
validation, database reads, service role usage, SQL execution, Supabase writes,
staging writes, `daily_prices` writes, seed SQL, raw market files, and
`scoreSource=real` remain unapproved.

## Evidence

```text
docs/CP3_TWSE_STOCK_DAY_STAGING_READ_ONLY_VALIDATION_SCRIPT_DESIGN_2026-05-29.md
docs/CP3_TWSE_STOCK_DAY_STAGING_POST_MIGRATION_VALIDATION_ROLLBACK_PLAN_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_EXECUTION_READINESS_2026-05-29.md
```

## Approved Next Slice

```text
create read-only validation script draft
create static safety checker for read-only validator
update package script for static checker
update review gate aggregator
update manifest and checkpoint list
do not run the validator against Supabase
do not connect to Supabase
do not run SQL
do not write database rows
```

Approved candidate files:

```text
scripts/validate-supabase-twse-stock-day-staging-readonly.mjs
scripts/check-twse-stock-day-staging-readonly-validator-safety.mjs
docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_READ_ONLY_VALIDATOR_DRAFT_REVIEW_2026-05-29.md
```

## Non-Negotiable Guardrails

```text
draft approval only
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not write staging rows
do not write daily_prices
do not create seed SQL
do not store raw market rows
do not commit CSV / JSON market data files
do not set scoreSource=real
do not make public backtest claims
CP3 source-depth production gate remains not_ready
Keep public data source mock
CEO approval required before remote read-only validation
```

## Validator Draft Constraints

The draft may include:

```text
environment variable validation
explicit target confirmation guard
metadata-only query plan
JSON summary output contract
no mutation helper functions
fail-closed behavior
```

The draft must not include:

```text
insert
upsert
update
delete
rpc mutation
raw market row export
CSV writer
JSON market data writer
automatic execution against Supabase
```

## Next Implementation Slice

```text
create read-only validator draft and static safety checker
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
