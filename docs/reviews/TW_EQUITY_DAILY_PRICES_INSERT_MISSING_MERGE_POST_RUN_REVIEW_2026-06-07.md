# TW Equity Daily Prices Insert-Missing Merge Post-Run Review

Date: 2026-06-07

Status: `insert_missing_merge_passed_readback_complete`.

## Scope

- Exactly one bounded insert-missing/skip-existing merge attempt was classified or executed.
- Output is sanitized aggregate evidence only.
- No row payloads, stock ids, secrets, raw market payloads, source payloads, or SQL text were printed.

## Sanitized Aggregate Counts

- `candidate_rows`: observed=`180`, expected=`180`, status=`ok`.
- `inserted_rows`: observed=`177`, expected=`177`, status=`ok`.
- `skipped_existing_rows`: observed=`3`, expected=`3`, status=`ok`.
- `final_target_rows_after_write`: observed=`180`, expected=`180`, status=`ok`.
- `conflicting_rows`: observed=`0`, expected=`0`, status=`ok`.

## Decision

- Policy: `insert_missing_skip_existing_no_overwrite`.
- Inserted rows: `177`.
- Skipped existing rows: `3`.
- Final target rows after write: `180`.
- Row coverage points awarded: `false`.
- Public source promotion: `false`.
- Score source promotion: `false`.

## Problems

- `none`.

## Safety Confirmation

- connectionAttempted: `true`.
- Supabase write attempted: `true`.
- daily_prices mutation status: `true`.
- SQL execution status: `false`.
- Market-data fetch status: `false`.
- Ingestion status: `false`.
- Row payload output status: `false`.
- Secret output status: `false`.
- Stock id output status: `false`.
- Public runtime state: `mock`.
- Score runtime state: `mock`.

## Next Slice

- If passed, prepare production readback and row coverage scoring gate.
- If blocked, do not retry until CEO records a revised merge decision.
