# TW Equity One-Attempt Staging Write Preflight Gate

Updated: 2026-06-06

Status: `tw_equity_one_attempt_staging_write_preflight_gate_blocked_by_target_relation_reconciliation`.

## Purpose

This gate checks whether the actual bounded staging write can proceed after `docs/TW_EQUITY_ACTUAL_BOUNDED_STAGING_WRITE_AUTHORIZATION_PACKET.md`.

CEO decision: execution is explicitly blocked in this GOAL because the authorized target relation `tw_equity_daily_prices_staging` is not the canonical local staging schema. The local migration defines `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices`.

## Required Inputs Checked

- authorization id: `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001`;
- exact command recorded in the authorization packet;
- lane: `tw-equity`;
- symbols: `2330`, `2382`, `2308`;
- sessions: `60`;
- target relation: `tw_equity_daily_prices_staging`;
- max rows: `180`;
- source classification reference: `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json`;
- service-role posture: present but not executed;
- RLS posture: present but not executed;
- rollback owner: `PM`;
- rollback dry-run posture: present but not run;
- retention window: `internal_staging_validation_window_7_days_then_review_or_purge`;
- post-run review artifact: `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md`;
- no retry;
- no public redistribution;
- no public promotion;
- no row coverage points;
- no score-source promotion.

## Blocker

The authorized target relation is `tw_equity_daily_prices_staging`, but the canonical local staging contract is:

- `staging_twse_stock_day_runs`;
- `staging_twse_stock_day_prices`.

This mismatch blocks actual execution until CEO creates either:

- a reconciled authorization packet using the canonical local staging objects; or
- a reviewed schema compatibility decision that proves `tw_equity_daily_prices_staging` exists and is safe to write.

## Current Execution Decision

Current decision: blocked, not executed.

No SQL, Supabase connection, Supabase write, staging row creation, `daily_prices` mutation, market-data fetch, market-data ingestion, source payload output, secret output, public promotion, row coverage points, or `scoreSource=real` occurred.
