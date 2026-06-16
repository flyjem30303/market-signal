# Phase 1 Current-Scope Sanitized Candidate Reply Fixtures

Updated: 2026-06-17

Status: `phase_1_current_scope_sanitized_candidate_reply_fixtures_no_row_payloads_ready`

Decision: `ready_to_verify_future_reply_accept_reject_branches_without_row_payloads`

## Purpose

This fixture contract makes the next A1/PM reply easier to review.

It proves the accepted/rejected branches for a future `TWII + 台灣上市股票日收盤價` sanitized candidate reply without reading candidate artifacts, rows, raw payloads, stock-id payloads, secrets, SQL, Supabase, or `daily_prices`.

## Accepted Reply Shape

An accepted future reply must keep:

- `phase1Universe=twii_plus_listed_stock_daily_close`
- `scope=twii_plus_listed_stock_daily_close`
- `sanitizedAggregateOnly=true`
- `rawPayloadIncluded=false`
- `rowPayloadIncluded=false`
- `stockIdPayloadIncluded=false`
- `secretsIncluded=false`
- `publicDataSource=mock`
- `scoreSource=mock`

It may provide only:

- `candidateArtifactPath`
- `artifactId`
- aggregate metadata such as row count, symbol count, date bounds, duplicate count, rejected count, missing-field count, and forbidden-field count

## Rejected Branches Covered

- raw payload included
- row payload included
- stock-id payload included
- secrets included
- ETF current-scope mismatch
- real-data promotion attempt

## Hard Boundaries

- No artifact content read
- No candidate row acceptance
- No raw market data
- No row payload
- No stock-id payload
- No secret
- No SQL
- No Supabase read/write
- No `daily_prices` mutation
- No public real-data promotion
- No `publicDataSource=supabase`
- No `scoreSource=real`

## Next Route

`future_a1_or_pm_reply_can_be_checked_against_accept_reject_fixture_contract`
