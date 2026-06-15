# Phase 1 A1 ETF Sanitized Reply Task Packet

Status: `phase_1_a1_etf_sanitized_reply_task_packet_no_row_payloads_ready`

Decision: `send_to_a1_prepare_aggregate_only_reply`

This packet gives A1 a copyable task for the remaining ETF Phase 1 coverage closure handoff. It does not contain market rows, raw payloads, stock-id payloads, secrets, SQL output, Supabase writes, or real-data promotion.

## Task Scope

- `ownerLane=A1/Data`
- `targetLane=ETF`
- `symbolGroup=ETF`
- `targetScope=phase_1_core_etf_daily_prices_missing_rows`
- `expectedRows=118`
- `candidateMissingRows=118`
- `pmAcceptsNow=false`
- `a1MayReplyNow=true`

## Copyable A1 Task

```text
A1 ETF sanitized artifact reply task
Goal: prepare an aggregate-only sanitized candidate artifact reply for Phase 1 ETF coverage closure.
Do not include raw payload, row payload, stock-id payload, market rows, source values, secrets, SQL output, or Supabase write evidence.

Reply with this exact shape:
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

## Stoplines

- `do_not_include_raw_payload`
- `do_not_include_row_payload`
- `do_not_include_stock_id_payload`
- `do_not_include_secret_or_credential_value`
- `do_not_execute_sql`
- `do_not_write_supabase`
- `do_not_read_or_output_market_rows`
- `do_not_claim_public_real_data_promotion`

## PM Next Route

After A1 replies, PM should run:

`nextPmRouteAfterReply=phase_1_etf_sanitized_candidate_artifact_reply_intake_validator_no_row_payloads`

## Safety Boundary

- `publicDataSource=mock`
- `scoreSource=mock`
- No Supabase write
- No public real-data promotion
- No row payload read
- No raw payload read
- No candidate row acceptance
