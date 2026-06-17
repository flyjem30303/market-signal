# Phase 1 Current-Scope Candidate Artifact Aggregate Gate

Updated: 2026-06-17

Status: `phase_1_current_scope_candidate_artifact_aggregate_gate_no_row_payloads_ready`

## Purpose

This gate validates the aggregate-only contract of a current-scope candidate artifact after the header gate has accepted the artifact shape.

The candidate artifact JSON may be parsed only for aggregate metadata. No row payload, stock-id payload, raw payload, secret, or full artifact content is printed.

## Commands

- `run:phase-1-current-scope-candidate-artifact-aggregate-gate-once -- --header-result <header-result-json-path> --candidate-artifact <candidate-artifact-json-path>`
- `check:phase-1-current-scope-candidate-artifact-aggregate-gate-no-row-payloads`

## Accepted Conditions

- Header result is accepted by `phase_1_current_scope_candidate_artifact_header_gate_accepted_no_rows`.
- `phase1Universe=twii_plus_listed_stock_daily_close`
- `scope=twii_plus_listed_stock_daily_close`
- `coverageWindowSessions` is a positive number.
- `aggregateRowCount` is a positive number.
- `symbolsCoveredCount` is a positive number.
- `aggregateRowCount >= symbolsCoveredCount`
- `dateBounds.start` and `dateBounds.end` are present and are not `EXAMPLE_ONLY`.
- `duplicateCount=0`
- `rejectedCount=0`
- `missingRequiredFieldCount=0`
- `forbiddenFieldCount=0`
- `sanitizedAggregateOnly=true`
- `rawPayloadIncluded=false`
- `rowPayloadIncluded=false`
- `stockIdPayloadIncluded=false`
- `secretsIncluded=false`
- safety flags remain mock-only and no-write

## Rejected Conditions

- Missing or rejected header result
- `EXAMPLE_ONLY` date bounds
- non-positive aggregate counts
- duplicate, rejected, missing-required-field, or forbidden-field count above zero
- row arrays or row payload keys
- raw payload keys
- stock-id payload keys
- secrets
- ETF current-scope mismatch
- real promotion attempt

## Required Safe State

- `candidateRowsAcceptedNow=false`
- `writeGateOpenedNow=false`
- `publicDataSource=mock`
- `scoreSource=mock`

## Next Route

`prepare_candidate_artifact_aggregate_pm_acceptance_record_no_row_payloads`
