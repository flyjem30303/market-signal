# Phase 1 ETF Sanitized Candidate Artifact Reply Template

Status: `phase_1_etf_sanitized_candidate_artifact_reply_template_no_row_payloads_ready`

Decision: `ready_for_a1_etf_sanitized_aggregate_reply`

This template is for A1 to reply with the ETF sanitized candidate artifact path and aggregate validation summary only. It must not include row payloads, raw payloads, stock-id payloads, credential values, or secrets.

## Contract

- `targetLane=ETF`
- `targetScope=phase_1_core_etf_daily_prices_missing_rows`
- `expectedMissingRows=118`
- `requiredSanitizedAggregateOnly=true`
- `outputContainsRowPayload=false`
- `outputContainsRawPayload=false`
- `outputContainsStockIdPayload=false`
- `outputContainsSecrets=false`

## requiredReplyFields

Use this exact shape when A1 replies:

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

## PM Intake Rule

PM may only continue to ETF artifact path intake when the reply states:

- `candidateMissingRows: 118`
- `expectedRows: 118`
- `sanitizedAggregateOnly: true`
- `rawPayloadIncluded: false`
- `rowPayloadIncluded: false`
- `stockIdPayloadIncluded: false`
- `secretsIncluded: false`

## Safety Boundary

- `publicDataSource=mock`
- `scoreSource=mock`
- No raw market data
- No row payload
- No secret
- No candidate row acceptance
- No Supabase write
- No public real-data promotion

## Next Route

`a1_reply_then_pm_etf_sanitized_candidate_artifact_path_intake`
