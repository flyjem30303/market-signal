# Phase 1 ETF Sanitized Candidate Artifact Reply Execution Brief

Status: `phase_1_etf_sanitized_candidate_artifact_reply_execution_brief_no_row_payloads_ready`

Decision: `a1_can_prepare_etf_reply_aggregate_only_pm_intake_ready`

This brief is the A1 work package for the Phase 1 ETF 118-row coverage gap. A1 may prepare an aggregate-only sanitized candidate artifact reply. PM still cannot accept the artifact path or rows until the future reply passes the PM intake validator.

## Current Execution State

- `a1CanExecuteNow=true`
- `pmCanAcceptNow=false`
- `pmAcceptanceRequiresFutureReply=true`
- `candidateArtifactPathAcceptedNow=false`
- `candidateArtifactReadNow=false`
- `candidateRowsAcceptedNow=false`
- `targetLane=ETF`
- `symbolGroup=ETF`
- `targetScope=phase_1_core_etf_daily_prices_missing_rows`
- `expectedMissingRows=118`

## A1 Reply Format

Use this exact shape:

```text
candidateArtifactPath:
artifactId:
lane: ETF
symbolGroup: ETF
scope: phase_1_core_etf_daily_prices_missing_rows
sourceLane:
coverageWindowSessions:
candidateMissingRows: 118
expectedRows: 118
aggregateValidation:
sanitizedAggregateOnly: true
rawPayloadIncluded: false
rowPayloadIncluded: false
stockIdPayloadIncluded: false
secretsIncluded: false
```

## A1 Stoplines

- `do_not_include_raw_payload`
- `do_not_include_row_payload`
- `do_not_include_stock_id_payload`
- `do_not_include_secret_or_credential_value`
- `do_not_execute_sql`
- `do_not_write_supabase`
- `do_not_claim_public_real_data_promotion`

## PM Intake Rule

PM may only move to `phase_1_etf_sanitized_candidate_artifact_reply_intake_validator_no_row_payloads` after A1 replies with all required fields. If any field is missing, mismatched, or unsafe, PM keeps the candidate gate waiting.

## Safety Boundary

- `publicDataSource=mock`
- `scoreSource=mock`
- No Supabase write
- No public real-data promotion
- No candidate row acceptance
- No raw market data output
- No row payload output
- No secret output

## Next Route

`nextRoute=a1_prepare_etf_sanitized_candidate_artifact_reply_then_pm_intake_validator`
