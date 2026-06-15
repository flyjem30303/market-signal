# Phase 1 ETF Sanitized Candidate Artifact Path Request - No Fetch

Status: `phase_1_etf_sanitized_candidate_artifact_path_request_no_fetch_ready`

Request mode: `a1_etf_sanitized_candidate_artifact_path_request_no_fetch`

## CEO Decision

Ask A1 to provide the ETF sanitized candidate artifact path and aggregate validation summary for the remaining Phase 1 ETF coverage gap.

This request does not fetch market data, create candidate rows, read candidate artifact contents, run SQL, connect to Supabase, or mutate `daily_prices`.

## Request Scope

- `sourcePathShapeGate=phase_1_write_runner_sanitized_candidate_artifact_path_shape_checker_no_row_payloads_ready`
- `sourcePathShapeGatePath=data/evidence-intake/phase-1-write-runner-sanitized-candidate-artifact-path-shape-checker-no-row-payloads.json`
- `requestOwner=PM`
- `requestedLane=A1`
- `targetLane=ETF`
- `targetScope=phase_1_core_etf_daily_prices_missing_rows`
- `targetTable=daily_prices`
- `expectedMissingRows=118`

## Required A1 Reply Fields

A1 should reply with:

- `candidateArtifactPath`
- `artifactId`
- `lane`
- `scope`
- `sourceLane`
- `coverageWindowSessions`
- `candidateMissingRows`
- `expectedRows`
- `aggregateValidation`
- `fieldNames`
- `validationStatus`
- `sanitizedAggregateOnly`
- `rawPayloadIncluded`
- `rowPayloadIncluded`
- `stockIdPayloadIncluded`
- `secretsIncluded`

## Acceptance Criteria

- `candidateArtifactPathRequired=true`
- `artifactMustBeInDataCandidates=true`
- `candidateMissingRowsMustEqual=118`
- `expectedRowsMustEqual=118`
- `duplicateRowsMustEqual=0`
- `rejectedRowsMustEqual=0`
- `missingRowsMustEqual=0`
- `sanitizedAggregateOnlyMustBe=true`
- `rawPayloadIncludedMustBe=false`
- `rowPayloadIncludedMustBe=false`
- `stockIdPayloadIncludedMustBe=false`
- `secretsIncludedMustBe=false`

## Current Gate State

- `blockedUntilA1Reply=true`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `implementationAllowedNow=false`
- `nextRouteIfA1Replies=phase_1_etf_sanitized_candidate_artifact_path_intake_no_row_payloads`
- `nextRouteIfA1CannotReply=phase_1_etf_candidate_gap_remains_blocking_data_online`

## Runtime Boundary

- `publicDataSource=mock`
- `scoreSource=mock`

## Hard Boundaries

- No remote fetch requested
- No market-data fetch
- No market-data ingestion
- No candidate artifact creation in PM mainline
- No candidate artifact content read
- No candidate row payload read
- No raw payload read
- No stock-id payload read
- No row payload output
- No raw payload output
- No secret output
- No SQL
- No Supabase client import
- No Supabase connection
- No Supabase read
- No Supabase write
- No `daily_prices` mutation
- No candidate row acceptance
- No public source promotion
- No public real-data claim
- No score promotion
- No investment advice

## Copy-Paste Prompt For A1

Goal: provide the ETF sanitized candidate artifact path and aggregate validation summary for Phase 1 data online closure, without remote fetch in this lane unless separately authorized.

Use this reply shape:

```text
A1 ETF sanitized artifact reply
candidateArtifactPath:
artifactId:
lane: ETF
scope: phase_1_core_etf_daily_prices_missing_rows
sourceLane:
coverageWindowSessions:
candidateMissingRows: 118
expectedRows: 118
aggregateValidation: expectedRows=118, candidateRows=118, duplicateRows=0, rejectedRows=0, missingRows=0, fieldNames=[...], validationStatus=pending_pm_review
sanitizedAggregateOnly: true
rawPayloadIncluded: false
rowPayloadIncluded: false
stockIdPayloadIncluded: false
secretsIncluded: false
```

## Next Route

If A1 replies: prepare `phase_1_etf_sanitized_candidate_artifact_path_intake_no_row_payloads`.

If A1 cannot reply: keep `phase_1_etf_candidate_gap_remains_blocking_data_online`.
