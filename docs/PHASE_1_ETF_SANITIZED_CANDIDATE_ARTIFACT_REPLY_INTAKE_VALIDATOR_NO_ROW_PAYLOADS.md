# Phase 1 ETF Sanitized Candidate Artifact Reply Intake Validator

Status: `phase_1_etf_sanitized_candidate_artifact_reply_intake_validator_no_row_payloads_ready`

Decision: `ready_to_validate_future_a1_etf_reply_shape_only`

This validator prepares PM to review a future A1 ETF sanitized candidate artifact reply. It validates reply shape and safety flags only. It does not accept a candidate artifact path now, read artifact contents, accept candidate rows, write Supabase, or promote public runtime data.

## Current State

- `futureReplyPresentNow=false`
- `replyAcceptedNow=false`
- `candidateArtifactPathAcceptedNow=false`
- `candidateArtifactReadNow=false`
- `candidateRowsAcceptedNow=false`
- `targetLane=ETF`
- `targetScope=phase_1_core_etf_daily_prices_missing_rows`
- `expectedMissingRows=118`

## Required Future Reply Shape

A future A1 reply must match these values before PM can proceed:

- `candidateMissingRows=118`
- `expectedRows=118`
- `sanitizedAggregateOnly=true`
- `rawPayloadIncluded=false`
- `rowPayloadIncluded=false`
- `stockIdPayloadIncluded=false`
- `secretsIncluded=false`

## PM Intake Rule

If the future A1 reply fails any required boolean or numeric match, PM keeps the candidate artifact set gate waiting and does not proceed to artifact path intake.

If the future A1 reply passes all required shape checks, PM may continue to:

`phase_1_etf_sanitized_candidate_artifact_path_intake_no_row_payloads`

## Safety Boundary

- `publicDataSource=mock`
- `scoreSource=mock`
- No artifact content read
- No candidate row acceptance
- No Supabase write
- No public real-data promotion
- No raw market data
- No row payload
- No secret

## Next Route

`nextRoute=wait_for_a1_etf_sanitized_candidate_artifact_reply`
