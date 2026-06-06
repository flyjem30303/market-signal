# TW Equity Write-Capable Runner Implementation Readiness Gate

Updated: 2026-06-06

Status: `tw_equity_write_capable_runner_implementation_readiness_gate_ready_not_implemented`.

## Purpose

This gate defines the minimum implementation readiness contract before `scripts/run-tw-equity-staging-write-once.mjs` may become write-capable.

It inherits:

- `docs/TW_EQUITY_ACTUAL_BOUNDED_STAGING_WRITE_AUTHORIZATION_PACKET.md`;
- `docs/TW_EQUITY_ONE_ATTEMPT_STAGING_WRITE_PREFLIGHT_GATE.md`;
- `docs/reviews/TW_EQUITY_TARGET_RELATION_RECONCILIATION_REVIEW_2026-06-06.md`;
- `supabase/migrations/0003_twse_stock_day_staging.sql`.

This gate does not implement writes. It does not connect to Supabase, run SQL, write Supabase, create staging rows, mutate production `daily_prices`, fetch market data, ingest market data, store source-derived rows, print secrets, print source payloads, promote public source, award row coverage points, or set `scoreSource=real`.

## CEO Decision

CEO decision: target relation reconciliation is accepted, so the next high-value work is to prepare write-capable runner implementation under strict fail-closed controls.

The runner may become write-capable only after all required controls below are implemented and verified. Until then, the existing runner must keep `runner_skeleton_has_no_supabase_write_implementation` as the execution blocker.

## Required Implementation Controls

| control | requirement |
| --- | --- |
| confirmation | require `TW_EQUITY_STAGING_WRITE_CONFIRMATION=CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE` |
| authorization id | require `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001` |
| exact command | require the reconciled command with target `staging_twse_stock_day_runs,staging_twse_stock_day_prices` |
| dotenv allowlist | load only `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` |
| secret posture | never print secret values, key fragments, source payloads, inserted rows, or row payloads |
| public source posture | keep `publicDataSource=mock` |
| score source posture | keep `scoreSource=mock` |
| source posture | do not fetch market data in the write runner; consume only a future sanitized candidate input artifact authorized by a separate gate |
| target tables | write only `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices` |
| production tables | never mutate `daily_prices`, `stocks`, `market_exchanges`, model tables, public tables, or source-rights ledgers |
| run id | generate or require one scoped `run_id` and use it for every candidate row |
| row cap | enforce `maxRows=180` before any remote mutation |
| RLS posture | use service-role only after explicit confirmation; do not use anon key for writes |
| rollback dry-run | support a dry-run cleanup count by `run_id` before destructive rollback is allowed |
| rollback execution | destructive rollback remains blocked unless a separate rollback execution gate exists |
| post-run review | write no local post-run review automatically; print sanitized aggregate output for PM to record in the approved artifact |
| retry | no retry; any error stops the attempt |

## Required Sanitized Output Fields

A future write-capable runner may output only these fields:

- `authorizationId`;
- `connectionAttempted`;
- `executionAttempted`;
- `filesWritten`;
- `marketDataFetched`;
- `marketDataIngested`;
- `maxRows`;
- `mode`;
- `mutations`;
- `postRunReview`;
- `problems`;
- `publicDataSource`;
- `rollbackDryRunAvailable`;
- `rowPayloadsPrinted`;
- `scoreSource`;
- `secretsPrinted`;
- `serviceRoleKeyPrinted`;
- `sourcePayloadsPrinted`;
- `sqlExecuted`;
- `status`;
- `targetRelation`;
- `writeImplementationReady`.

## Current Stop Line

Current decision: implementation readiness is defined, but write-capable runner implementation is not created in this slice.

The next slice may update the runner to perform local preflight checks for confirmation, credential presence, exact command, target tables, row cap, rollback dry-run posture, and sanitized output shape. It must still stop before any Supabase mutation unless a separate one-attempt execution gate approves the run.
