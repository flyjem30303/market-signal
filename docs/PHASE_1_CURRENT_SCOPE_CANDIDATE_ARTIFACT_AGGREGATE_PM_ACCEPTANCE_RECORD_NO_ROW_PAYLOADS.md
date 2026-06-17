# Phase 1 Current-Scope Candidate Artifact Aggregate PM Acceptance Record

Updated: 2026-06-17

Status: `phase_1_current_scope_candidate_artifact_aggregate_pm_acceptance_record_no_row_payloads_ready`

## Purpose

This gate records an explicit PM decision after the current-scope candidate artifact aggregate gate has accepted aggregate metadata.

The record is not a write authorization. It does not accept candidate rows, open a write gate, promote runtime data, or print candidate artifact content.

## Commands

- `run:phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-once -- --aggregate-result <aggregate-result-json-path> --pm-decision accepted`
- `check:phase-1-current-scope-candidate-artifact-aggregate-pm-acceptance-record-no-row-payloads`

## Accepted Conditions

- Aggregate result is accepted by `phase_1_current_scope_candidate_artifact_aggregate_gate_accepted_no_rows`.
- PM explicitly passes `--pm-decision accepted`.
- Aggregate metadata remains current-scope: `twii_plus_listed_stock_daily_close`.
- Coverage, row, symbol, and date-bound fields remain present and safe.
- Duplicate, rejected, missing-required-field, and forbidden-field counts remain zero.

## Rejected Conditions

- Missing aggregate result
- Missing PM decision
- PM decision other than `accepted`
- Blocked aggregate result
- Row payload, raw payload, stock-id payload, or secret fields
- ETF current-scope mismatch
- real promotion attempt

## Required Safe State

- `pmAcceptanceRecordedNow=true`
- `candidateRowsAcceptedNow=false`
- `writeGateOpenedNow=false`
- `publicDataSource=mock`
- `scoreSource=mock`

## Next Route

`prepare_candidate_artifact_bounded_write_authorization_preflight_no_execution`
