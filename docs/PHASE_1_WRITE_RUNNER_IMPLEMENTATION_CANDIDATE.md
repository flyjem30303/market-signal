# Phase 1 Write Runner Implementation Candidate

Status: `phase_1_write_runner_implementation_candidate_blocked_no_execution`

Packet mode: `implementation_candidate_fail_closed_no_execution`

## CEO Decision

Create a minimal implementation candidate runner before any real write. The runner checks whether the accepted Phase 1 candidate artifacts are sufficient for an insert-missing-only runner.

Current result without an explicit row-payload artifact path: blocked, because the available TWII and ETF artifacts are aggregate/path-only and do not include sanitized row payloads.

This is a useful blocker, not a failure. It prevents the project from treating aggregate-only evidence as writable market rows.

Current local candidate note: PM has a non-committed sanitized row-payload candidate at `tmp/phase-1-sanitized-row-payload-candidate.json`. The runner may inspect only the artifact shape and aggregate counts when this path is explicitly supplied. The runner still must not execute SQL, connect to Supabase, write rows, print row payloads, or promote public runtime sources.

## Current State

- `boundedAttemptScope=twii_and_etf_phase_1_missing_row_closure_only`
- `targetTable=daily_prices`
- `fullLevel1MissingRows=178`
- `twiiMissingRows=60`
- `etfMissingRows=118`
- `runnerStatus=phase_1_write_runner_implementation_candidate_blocked_no_execution`
- `outcome=runner_candidate_fail_closed_before_row_payload_or_write`
- `blockedReason=candidate_row_payloads_missing`
- `nextRoute=provide_sanitized_row_payload_candidate_artifacts_or_keep_data_online_no_go`

## Candidate Artifact Inputs

- `twiiCandidateArtifactPath=data/candidates/twii-sanitized-candidate.json`
- `etfCandidateArtifactPath=data/candidates/phase-1-etf-sanitized-candidate.json`
- optional row-payload candidate path: `--candidate-artifact <LOCAL_JSON_PATH>`
- optional row-payload candidate env: `PHASE_1_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH=<LOCAL_JSON_PATH>`
- optional external authorization response path: `--authorization-response <EXTERNAL_LOCAL_JSON_PATH>`
- optional external authorization response env: `PHASE_1_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_PATH=<EXTERNAL_LOCAL_JSON_PATH>`
- `twiiRowPayloadIncluded=false`
- `etfRowPayloadIncluded=false`
- `twiiRawPayloadIncluded=false`
- `etfRawPayloadIncluded=false`
- `rowPayloadCandidatePathProvided=false`
- `rowPayloadCandidateAccepted=false`

## Row-Payload Candidate Path Intake

When A1 or PM has a separate sanitized row-payload candidate artifact, run:

```powershell
cmd.exe /c npm run validate:phase-1-sanitized-row-payload-candidate-artifact -- --candidate-artifact <LOCAL_JSON_PATH>
cmd.exe /c npm run run:phase-1-write-runner-implementation-candidate -- --candidate-artifact <LOCAL_JSON_PATH>
cmd.exe /c npm run check:phase-1-write-runner-implementation-candidate
```

Current local candidate command:

```powershell
cmd.exe /c "set PHASE_1_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH=tmp\phase-1-sanitized-row-payload-candidate.json&& npm run check:phase-1-data-online-go-no-go-status"
```

Expected safe result after a valid artifact path:

- `rowPayloadCandidatePathProvided=true`
- `rowPayloadCandidateAccepted=true`
- `rowPayloadCandidateRowCount=178`
- `rowPayloadCandidateSymbolsCovered=[0050,006208,TWII]`
- `rowPayloadCandidateSymbolCounts={TWII:60,0050:59,006208:59}`
- `rowPayloadCandidateInvalidTradeDateCount=0`
- `sourceRightsStatus=accepted`
- `fieldContractStatus=accepted`
- `nextRoute=separate_operator_write_execution_review_required`

The runner still does not execute a write. It only proves the candidate path can pass the aggregate-only artifact validator.

## Candidate + Authorization Convergence Intake

When PM also has an external local accepted authorization response, run:

```powershell
cmd.exe /c npm run run:phase-1-write-runner-implementation-candidate -- --candidate-artifact <LOCAL_JSON_PATH> --authorization-response <EXTERNAL_LOCAL_JSON_PATH>
```

Expected safe result after both files validate:

- `authorizationResponsePathProvided=true`
- `authorizationResponseAccepted=true`
- `preRunInputsConverged=true`
- `nextRoute=fresh_pm_go_no_go_required_after_candidate_and_authorization_validation`

This still does not execute a write. It only proves the row-payload candidate and external accepted authorization response can be reviewed together before a fresh PM go/no-go record.

## Hard Boundaries

- No SQL
- No Supabase client import
- No Supabase connection
- No Supabase read
- No Supabase write
- No credential value read
- No market-data fetch
- No market-data ingestion
- No candidate row acceptance
- No `daily_prices` mutation
- No staging rows
- No raw payload output
- No row payload output
- No secret output
- No public source promotion
- No score promotion
- No public real-data claim
- No investment advice

## PM Execution Record

This slice creates a fail-closed runner candidate and checker. It does not execute a write and does not inspect row bodies because row bodies are not present.

The next productive data-line task is to provide separately accepted sanitized row-payload candidate artifacts for `TWII`, `0050`, and `006208`, or keep Phase 1 data online at `NO_GO`.
