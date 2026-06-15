# Phase 1 ETF Reply PM Acceptance Apply Gate

Status: `phase_1_etf_reply_pm_acceptance_apply_gate_no_row_payloads_ready`

Decision: `ready_to_apply_future_validator_pass_without_reading_rows`

This gate defines how PM may apply a future ETF reply validator pass into the Phase 1 candidate artifact set gate. It does not accept the ETF artifact now, read candidate rows, execute SQL, write Supabase, or promote public runtime data.

## Current State

- `applyAllowedNow=false`
- `futureReplyRequired=true`
- `requiredFutureReplyStatus=validator_passed_future_a1_etf_reply`
- `currentEtfArtifactAccepted=false`
- `futureEtfArtifactAcceptedAfterPass=true`
- `futureArtifactSetCompleteAfterPass=true`
- `futureExpectedMissingRows=178`
- `futureTwiiMissingRows=60`
- `futureEtfMissingRows=118`
- `candidateArtifactReadNow=false`
- `candidateRowsAcceptedNow=false`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `promotionAllowedNow=false`

## Apply Rule

PM may only apply ETF artifact acceptance after all conditions are true:

- A future A1 ETF reply exists.
- `phase_1_etf_sanitized_candidate_artifact_reply_intake_validator_no_row_payloads` passes against that future reply.
- The future reply remains aggregate-only.
- The future reply does not include raw payload, row payload, stock-id payload, credential values, or secrets.

If those conditions pass, PM may move toward:

`phase_1_write_runner_candidate_artifact_set_acceptance_gate_etf_artifact_accepted`

## Safety Boundary

- `publicDataSource=mock`
- `scoreSource=mock`
- No row payload read
- No candidate row acceptance
- No Supabase write
- No public real-data promotion
- No SQL execution
- No `daily_prices` mutation
- No staging rows

## Next Route

`nextRoute=wait_for_future_a1_etf_reply_then_run_pm_intake_validator`
