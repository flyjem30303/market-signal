# CP3 TWSE Stock Day Staging Canonical Naming Rule Decision Ledger

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: CP3 TWSE stock day staging local reference audit recorded

Status: CP3 TWSE stock day staging canonical naming rule decision ledger recorded

## CEO Decision

```text
PROCEED_LOCAL_CANONICAL_NAMING_RULE_ONLY
```

This decision ledger records the canonical staging naming rule after the local reference audit. It is local-only decision tracking and local implementation guidance. It does not authorize a second remote attempt, does not connect to Supabase, does not run a validator, does not run SQL, does not create or edit migrations, does not write Supabase, does not create staging rows, does not write daily_prices, does not modify .env.local, does not fetch or ingest market data, does not parse market rows, does not commit raw market data, does not set scoreSource=real, does not approve public claims, does not promote runtime readiness, and does not promote CP3 readiness.

## Canonical Naming Rule

```text
CANONICAL-STAGING-NAME-001 staging_twse_stock_day_runs is the canonical local run metadata object name
CANONICAL-STAGING-NAME-002 staging_twse_stock_day_prices is the canonical local candidate price row object name
CANONICAL-STAGING-NAME-003 twse_stock_day_staging is evidence-only pending remote contract
CANONICAL-STAGING-NAME-004 twse_stock_day_staging must not be used as a runtime dependency
CANONICAL-STAGING-NAME-005 twse_stock_day_staging must not be treated as a canonical alias
CANONICAL-STAGING-NAME-006 twse_stock_day_staging must not be treated as a local view
CANONICAL-STAGING-NAME-007 twse_stock_day_staging must not be treated as a local table
CANONICAL-STAGING-NAME-008 future compatibility object design requires a separate approval gate
CANONICAL-STAGING-NAME-009 future runtime implementation may reference approved staging concepts only through the local canonical contract
CANONICAL-STAGING-NAME-010 public UI must not expose staging object names as trust or data-quality claims
```

## Decision Ledger Entries

```text
LEDGER-CP3-STAGING-001 closed: classify twse_stock_day_staging as naming mismatch pending remote contract
LEDGER-CP3-STAGING-002 closed: preserve staging_twse_stock_day_runs as canonical local run metadata name
LEDGER-CP3-STAGING-003 closed: preserve staging_twse_stock_day_prices as canonical local price row name
LEDGER-CP3-STAGING-004 open: decide later whether a compatibility view or alias is needed
LEDGER-CP3-STAGING-005 open: decide later whether generated Supabase types need refresh after approved schema action
LEDGER-CP3-STAGING-006 open: decide later whether remote-only objects market_assets model_runs and data_freshness require local contract docs
LEDGER-CP3-STAGING-007 blocked: runtime reliance on twse_stock_day_staging until separate remote contract exists
LEDGER-CP3-STAGING-008 blocked: any SQL migration or compatibility object action in this slice
LEDGER-CP3-STAGING-009 blocked: any real market ingestion or daily_prices write in this slice
```

## Runtime Implementation Guidance

```text
RUNTIME-GUIDANCE-001 runtime implementation must not import twse_stock_day_staging as a data source
RUNTIME-GUIDANCE-002 runtime implementation must not query twse_stock_day_staging
RUNTIME-GUIDANCE-003 runtime implementation must not display twse_stock_day_staging to public users
RUNTIME-GUIDANCE-004 runtime implementation may use mock-only state labels that refer to approved local contract concepts
RUNTIME-GUIDANCE-005 runtime implementation must keep public data source mock
RUNTIME-GUIDANCE-006 runtime implementation must keep scoreSource=real blocked
RUNTIME-GUIDANCE-007 runtime implementation must keep CP3 not_ready until separate source-depth and runtime gates pass
RUNTIME-GUIDANCE-008 runtime implementation must keep Supabase and SQL actions behind separate approval gates
```

## Role Responsibilities

```text
CEO-FINDING-001 CEO accepts the local canonical naming rule as sufficient to unblock the next mock-only runtime planning slice
CEO-FINDING-002 CEO does not approve SQL, Supabase writes, real-data ingestion, or scoreSource=real in this ledger
PM-FINDING-001 PM must use this ledger as the naming source of truth for the next runtime-adjacent work slice
ENGINEERING-FINDING-001 Engineering must reject direct runtime coupling to twse_stock_day_staging
ENGINEERING-FINDING-002 Engineering may plan against staging_twse_stock_day_runs and staging_twse_stock_day_prices as canonical local concepts
DATA-FINDING-001 Data must treat twse_stock_day_staging as unresolved remote evidence until contract approval
QA-FINDING-001 QA must keep this checker in the review gate so naming drift is visible
SECURITY-FINDING-001 Security keeps all remote access and secrets outside this naming ledger
LEGAL-FINDING-001 Legal public-claim review remains required before any public reliability wording
```

## Stop Conditions

```text
STOP-STAGING-NAMING-001 stop before any Supabase connection
STOP-STAGING-NAMING-002 stop before running SQL
STOP-STAGING-NAMING-003 stop before creating or editing migrations
STOP-STAGING-NAMING-004 stop before creating compatibility SQL
STOP-STAGING-NAMING-005 stop before writing staging rows
STOP-STAGING-NAMING-006 stop before writing daily_prices
STOP-STAGING-NAMING-007 stop before fetching market data
STOP-STAGING-NAMING-008 stop before parsing market rows
STOP-STAGING-NAMING-009 stop before wiring twse_stock_day_staging into runtime
STOP-STAGING-NAMING-010 stop before setting scoreSource=real
STOP-STAGING-NAMING-011 stop before public claims
STOP-STAGING-NAMING-012 stop before promoting CP3 readiness
```

## CEO Pace Assessment

```text
CEO pace assessment: this slice is necessary but should be the last naming-only staging governance slice before returning to runtime-adjacent implementation
CEO pace assessment: the prior A-style governance was useful, but the project should now accelerate toward bounded mock-only runtime work
CEO pace assessment: do not add a role review unless the naming rule changes or creates public copy risk
CEO pace assessment: do not spend more cycles on twse_stock_day_staging unless compatibility object design becomes necessary
```

## Next Safe Slice Recommendation

```text
Next safe slice: prepare mock-only runtime implementation against approved local contract concepts
Alternative next safe slice: map remote-only contract docs for market_assets model_runs and data_freshness if runtime needs them first
CEO recommendation: prepare mock-only runtime implementation against approved local contract concepts
The next safe slice must remain mock-only
The next safe slice must not connect to Supabase
The next safe slice must not run SQL
The next safe slice must not fetch market data
The next safe slice must not parse market rows
The next safe slice must not write staging rows
The next safe slice must not write daily_prices
The next safe slice must not use twse_stock_day_staging as runtime dependency
The next safe slice must not set scoreSource=real
The next safe slice must not make public claims
```

## Verification Expectations

```text
scripts/check-cp3-twse-stock-day-staging-canonical-naming-rule-decision-ledger.mjs passes
scripts/check-cp3-twse-stock-day-staging-local-reference-audit.mjs passes
scripts/check-cp3-twse-stock-day-staging-reconciliation-plan.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
public claims remain blocked
```
