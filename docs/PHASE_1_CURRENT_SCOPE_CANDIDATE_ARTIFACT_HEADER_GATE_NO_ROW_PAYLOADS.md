# Phase 1 Current-Scope Candidate Artifact Header Gate

Updated: 2026-06-17

Status: `phase_1_current_scope_candidate_artifact_header_gate_no_row_payloads_ready`

## Purpose

This gate validates only the header and aggregate metadata contract of a current-scope candidate artifact.

The candidate artifact JSON may be parsed only for header and aggregate metadata. No artifact content is printed.

## Commands

- `run:phase-1-current-scope-candidate-artifact-header-gate-once -- --path-result <path-result-json-path>`
- `check:phase-1-current-scope-candidate-artifact-header-gate-no-row-payloads`

## Accepted Conditions

- `phase1Universe=twii_plus_listed_stock_daily_close`
- `scope=twii_plus_listed_stock_daily_close`
- `sanitizedAggregateOnly=true`
- `rawPayloadIncluded=false`
- `rowPayloadIncluded=false`
- `stockIdPayloadIncluded=false`
- `secretsIncluded=false`
- aggregate counts and date bounds are present
- safety flags remain mock-only and no-write

## Rejected Conditions

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

`prepare_candidate_artifact_aggregate_contract_gate_no_row_payloads`
