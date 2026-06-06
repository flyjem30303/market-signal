# TW Equity Daily Prices Overlap Classification Post-Run Review

Date: 2026-06-07

Status: `overlap_classification_passed_idempotent_safe_partial_overlap`.

## Scope

- Exactly one bounded Supabase readonly overlap-classification attempt was performed for `AUTH-003`.
- Output is sanitized aggregate evidence only.
- No row payloads, stock ids, secrets, raw market payloads, source payloads, or SQL text were printed.

## Sanitized Aggregate Counts

- `expected_candidate_rows`: observed=`180`, expected=`180`, rule=`exact`, status=`ok`.
- `candidate_symbol_count`: observed=`3`, expected=`3`, rule=`exact`, status=`ok`.
- `candidate_unique_trade_date_count`: observed=`60`, expected=`60`, rule=`informational`, status=`ok`.
- `existing_overlap_count`: observed=`3`, expected=`3`, rule=`informational`, status=`ok`.
- `exact_value_match_count`: observed=`3`, expected=`3`, rule=`must_match_overlap`, status=`ok`.
- `conflicting_overlap_count`: observed=`0`, expected=`0`, rule=`must_be_zero`, status=`ok`.
- `missing_insert_candidate_count`: observed=`177`, expected=`177`, rule=`informational`, status=`ok`.

## Per-Symbol Aggregate Counts

- `2330`: expectedCandidateRows=`60`, existingOverlapCount=`1`, exactValueMatchCount=`1`.
- `2382`: expectedCandidateRows=`60`, existingOverlapCount=`1`, exactValueMatchCount=`1`.
- `2308`: expectedCandidateRows=`60`, existingOverlapCount=`1`, exactValueMatchCount=`1`.

## Classification

- Classification: `idempotent_safe_partial_overlap_skip_existing_insert_missing`.
- Overlap ratio: `0.0167`.
- Accepted for merge preparation: `true`.
- Production merge authorized: `false`.
- Row coverage points awarded: `false`.
- Later production merge authorization remains separate.

## Problems

- `none`.

## Safety Confirmation

- connectionAttempted: `true`.
- SQL execution status: `false`.
- Supabase write status: `false`.
- `daily_prices` mutation status: `false`.
- Market-data fetch status: `false`.
- Ingestion status: `false`.
- Row payload output status: `false`.
- Secret output status: `false`.
- Stock id output status: `false`.
- Public runtime state: `mock`.
- Score runtime state: `mock`.

## Next Slice

- If idempotent-safe, prepare an insert-missing/skip-existing production merge authorization packet.
- If conflicting, keep merge blocked and prepare a reconciliation decision packet.
