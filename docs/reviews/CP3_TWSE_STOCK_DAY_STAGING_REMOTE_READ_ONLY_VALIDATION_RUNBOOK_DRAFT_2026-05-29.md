# CP3 TWSE Stock Day Staging Remote Read-Only Validation Runbook Draft

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: Remote read-only validation readiness checklist recorded

Status: remote read-only validation runbook draft recorded

## CEO Decision

```text
REVISE
```

This runbook is a draft only. It does not approve remote execution and does not
authorize connecting to Supabase.

## Purpose

```text
prepare a controlled procedure for future remote read-only validation
make preflight approval requirements explicit
make stop conditions explicit
make output handling explicit
keep production scoring and public UI unchanged
```

## Non-Negotiable Guardrails

```text
runbook draft only
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
```

## Required Approvals Before Any Remote Run

```text
service role usage approval: not_ready
target Supabase environment confirmation: not_ready
legal approval for remote metadata reads: not_ready
validation output retention policy: not_ready
post-validation review owner: not_ready
remote command approval: not_ready
```

## Future Preflight Checklist

```text
confirm target project id and environment name
confirm the validator command is the readonly validator only
confirm TWSE_STOCK_DAY_STAGING_READONLY_CONFIRMATION exact value
confirm NEXT_PUBLIC_SUPABASE_URL is the intended project URL
confirm SUPABASE_SERVICE_ROLE_KEY is available only in local .env.local
confirm output path is docs/reviews only
confirm raw rows will not be exported
confirm the safety checker passes immediately before remote execution
confirm review owner is available to inspect the summary report
```

## Future Execution Command

```text
not approved to run
TWSE_STOCK_DAY_STAGING_READONLY_CONFIRMATION=TWSE_STOCK_DAY_STAGING_READONLY node scripts/validate-supabase-twse-stock-day-staging-readonly.mjs
```

The command is recorded only so reviewers can inspect the intended shape of a
future remote read. It remains blocked until every required approval is recorded.

## Stop Conditions

```text
missing service role approval
unknown target Supabase project
any requested SQL execution
any requested mutation
any request to populate daily_prices
any raw market row export
any mismatch in confirmation token
any failed static safety checker
any unclear output retention policy
```

## Expected Future Output

```text
summary counts only
run count
price count
latest run metadata
latest sample date range
validation status
no raw market rows
```

## CEO Synthesis

```text
The team now has a controlled runbook draft for a future read-only remote
validation. Execution remains blocked. The next safe slice is a role review of
this runbook draft, not a remote run.
```

## Next Implementation Slice

```text
review remote read-only validation runbook draft by role
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
