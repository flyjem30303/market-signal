# Phase 1 ETF Sanitized Candidate Artifact Path Intake - No Row Payloads

Status: `phase_1_etf_sanitized_candidate_artifact_path_intake_waiting_a1_reply_no_row_payloads`

Intake mode: `pm_intake_waiting_a1_reply_no_row_payloads`

## CEO Decision

Prepare the PM intake gate for A1's future ETF sanitized candidate artifact reply, but do not accept any candidate path yet.

This gate keeps Phase 1 data online moving by making the next validation step executable as soon as A1 replies. It does not read candidate artifacts, row payloads, raw payloads, stock-id payloads, or secrets.

## Current State

- `sourceRequestPath=data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-path-request-no-fetch.json`
- `intakeDecision=blocked_waiting_a1_etf_sanitized_candidate_artifact_reply`
- `blockedUntilA1Reply=true`
- `candidateArtifactPathAccepted=false`
- `candidateArtifactRead=false`
- `candidateRowPayloadRead=false`
- `rawPayloadRead=false`
- `expectedMissingRows=118`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `implementationAllowedNow=false`

## Required A1 Reply Contract

- `candidateMissingRowsMustEqual=118`
- `expectedRowsMustEqual=118`
- `sanitizedAggregateOnlyMustBe=true`
- `rawPayloadIncludedMustBe=false`
- `rowPayloadIncludedMustBe=false`
- `stockIdPayloadIncludedMustBe=false`
- `secretsIncludedMustBe=false`

## Runtime Boundary

- `publicDataSource=mock`
- `scoreSource=mock`

## Hard Boundaries

- No candidate artifact content read
- No row payload read
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
- No staging rows
- No candidate row acceptance
- No market-data fetch
- No market-data ingestion
- No public source promotion
- No public real-data claim
- No score promotion
- No investment advice

## PM Execution Record

This slice creates the PM-side intake gate for the ETF artifact reply. The gate is intentionally blocked until A1 supplies a sanitized aggregate-only artifact path and summary.

## Next Route

Wait for `wait_for_a1_etf_sanitized_candidate_artifact_reply`.
