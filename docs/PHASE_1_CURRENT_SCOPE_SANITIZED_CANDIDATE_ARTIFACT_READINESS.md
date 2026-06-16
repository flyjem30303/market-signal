# Phase 1 Current-Scope Sanitized Candidate Artifact Readiness

Updated: 2026-06-16

Status: `phase_1_current_scope_sanitized_candidate_artifact_readiness_ready_no_market_rows`

Decision: `PREPARE_TWII_PLUS_LISTED_STOCK_CANDIDATE_ARTIFACT_KEEP_MOCK`

Owner: CEO / PM mainline

## Purpose

This is the current Phase 1 candidate artifact readiness contract after scope narrowing.

It replaces the old ETF-scoped candidate request for current Phase 1 planning. The old `TWII + 0050 + 006208` artifact path remains historical only and must not be used as the current bounded write packet input.

## Current Phase 1 Universe

- `TWII`
- Taiwan listed-stock daily close

Deferred to Phase 1.1:

- `0050`
- `006208`

## Delivery Mode

- `deliveryMode=local_or_external_path_only`
- `commitPolicy=do_not_commit_market_row_payloads_by_default`
- `pathPolicy=local_or_external_path_outside_git_or_gitignored`
- `validatorOutput=aggregate_counts_only`
- `rowPayloadAllowedForFutureValidator=true`
- `rowPayloadPrinted=false`
- `rawPayloadIncluded=false`
- `stockIdPayloadIncluded=false`
- `secretsIncluded=false`

## Required Top-Level Fields

A future current-scope candidate artifact should include:

- `artifactId`
- `createdAt`
- `scope`
- `phase1Universe`
- `sourceRightsStatus`
- `fieldContractStatus`
- `sanitizedRowPayloadIncluded`
- `rawPayloadIncluded`
- `stockIdPayloadIncluded`
- `secretsIncluded`
- `expectedRows`
- `rows`

Required values:

- `scope=twii_plus_listed_stock_daily_close`
- `phase1Universe=twii_plus_listed_stock_daily_close`
- `sourceRightsStatus=accepted`
- `fieldContractStatus=accepted`

## Required Row Fields

Rows must include only normalized fields:

- `symbol`
- `trade_date`
- `close`
- `source_name`
- `source_updated_at`
- `source_row_hash`

Optional normalized fields:

- `open`
- `high`
- `low`
- `volume`

Forbidden row fields:

- `stock_id`
- raw source payloads
- raw URLs with query secrets
- authentication headers
- API keys
- unnormalized source row bodies
- investment recommendation labels

## A1 / PM Handoff

A1 or PM should provide only:

- candidate artifact path
- artifact id
- aggregate row count
- symbols covered count
- date bounds
- duplicate count
- rejected count
- missing required-field count
- forbidden-field count
- safety flags

Do not paste row payloads into chat or committed files.

## Hard Boundaries

- No SQL
- No Supabase client import
- No Supabase connection
- No Supabase read
- No Supabase write
- No `daily_prices` mutation
- No staging rows
- No market-data fetch
- No market-data ingestion
- No committed market row payloads
- No raw payload output
- No row payload output
- No stock-id payload output
- No secret output
- No public source promotion
- No score promotion
- No public real-data claim
- No investment advice

## Next Route

`a1_or_pm_prepare_twii_plus_listed_stock_sanitized_candidate_artifact_path_no_execution`
