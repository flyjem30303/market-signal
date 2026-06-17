# Phase 1 Current-Scope Sanitized Candidate Reply Intake Runner

Updated: 2026-06-17

Status: `phase_1_current_scope_sanitized_candidate_reply_intake_runner_no_row_payloads_ready`

## Purpose

This runner lets PM validate a future A1/PM no-secret reply JSON for the current Phase 1 scope.

Only the reply JSON is read. The candidate artifact file is not opened.

## Commands

- `run:phase-1-current-scope-sanitized-candidate-reply-intake-once -- --reply <reply-json-path>`
- `check:phase-1-current-scope-sanitized-candidate-reply-intake-runner-no-row-payloads`

## Accepted Conditions

- `phase1Universe=twii_plus_listed_stock_daily_close`
- `scope=twii_plus_listed_stock_daily_close`
- `sanitizedAggregateOnly=true`
- `rawPayloadIncluded=false`
- `rowPayloadIncluded=false`
- `stockIdPayloadIncluded=false`
- `secretsIncluded=false`
- `publicDataSource=mock`
- `scoreSource=mock`

## Fail-Closed Behavior

- Missing `--reply` is blocked.
- Rejected fixture branches are blocked.
- The runner never reads `candidateArtifactPath`.
- The runner never accepts candidate rows.

## Hard Boundaries

- No raw market data fetch
- No market-data ingestion
- No row payload read or output
- No stock-id payload read or output
- No secret read or output
- No SQL
- No Supabase read/write
- No `daily_prices` mutation
- No public real-data promotion
