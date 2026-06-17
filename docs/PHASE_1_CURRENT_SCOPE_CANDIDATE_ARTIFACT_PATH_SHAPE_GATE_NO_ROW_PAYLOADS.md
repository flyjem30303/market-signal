# Phase 1 Current-Scope Candidate Artifact Path Shape Gate

Updated: 2026-06-17

Status: `phase_1_current_scope_candidate_artifact_path_shape_gate_no_row_payloads_ready`

## Purpose

This gate checks whether the accepted candidate artifact path is usable as a path before any artifact content or rows are considered.

Only the apply result JSON is read. The candidate artifact file is checked with metadata only. The candidate artifact file is not read.

## Commands

- `run:phase-1-current-scope-candidate-artifact-path-shape-gate-once -- --apply-result <apply-result-json-path>`
- `check:phase-1-current-scope-candidate-artifact-path-shape-gate-no-row-payloads`

## Accepted Conditions

- The apply result is accepted.
- The candidate artifact path is present.
- The path exists.
- The path points to a file.
- The path ends with `.json`.

## Required Safe State

- `candidateArtifactReadNow=false`
- `candidateRowsAcceptedNow=false`
- `writeGateOpenedNow=false`
- `publicDataSource=mock`
- `scoreSource=mock`

## Next Route

`prepare_candidate_artifact_header_contract_no_row_payloads`
