# TWII Aggregate Readback Contract Preflight

Status: `twii_aggregate_readback_contract_preflight_ready_no_execution`

Outcome: `aggregate_readback_contract_ready_runtime_still_blocked`

Owner: CEO/PM

Gate file: `data/source-gates/twii-aggregate-readback-contract-preflight.json`

This preflight converts the accepted bounded insert missing-only contract into a future aggregate readback contract. It defines what a future post-write readback may summarize, but it does not connect to Supabase, does not read rows, and does not authorize execution.

## Source And Scope

- sourceContractGatePath=data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json
- candidateArtifactPath=data/candidates/twii-sanitized-candidate.json
- targetTable=daily_prices
- targetLane=TWII
- targetScope=twii_index_daily_prices_missing_rows
- maxRows=60
- contractMode=aggregate_readback_contract_no_execution

## Prepared Contract

- aggregateReadbackContractPrepared=true
- readbackFieldsAggregateOnly=true
- readbackCountBoundsPrepared=true
- readbackScopeLockPrepared=true
- readbackNoRowPayloadPrepared=true
- candidateArtifactReferenceOnly=true
- candidateArtifactRowsRead=false
- rowPayloadRead=false
- rawPayloadRead=false
- readbackExecutionAllowedNow=false

The future readback operation is limited to aggregate status and counts. It must not output row bodies, trade-date lists, market values, source payloads, raw payloads, stock id payloads, secrets, or credential values.

## Allowed Aggregate Readback Fields

- `attemptId`
- `targetScope`
- `targetTable`
- `targetLane`
- `maxRows`
- `candidateRows`
- `insertedRows`
- `duplicateRows`
- `rejectedRows`
- `readbackRows`
- `alreadyExistingRows`
- `rollbackReady`
- `readbackStatus`
- `sanitizedErrorCategory`

## Disallowed Readback Fields

- `rowBody`
- `tradeDateList`
- `marketValue`
- `sourcePayload`
- `rawPayload`
- `stockIdPayload`
- `secretValue`
- `credentialValue`

## Stop Lines

- sqlExecuted=false
- supabaseClientImported=false
- supabaseConnectionAttempted=false
- supabaseWritesEnabled=false
- supabaseReadsEnabled=false
- dailyPricesMutated=false
- candidateRowsAccepted=false
- runnerExecutableNow=false
- executionAllowedNow=false
- writeGateExecutableNow=false
- implementationAllowedNow=false

This preflight does not authorize SQL, Supabase read, Supabase write, `daily_prices` mutation, candidate row acceptance, row coverage scoring, public data-source promotion, or real score promotion.

Runtime remains `publicDataSource=mock`. Scoring remains `scoreSource=mock`.

## Next Route

If this contract remains accepted, the next PM mainline step is `prepare_post_run_review_contract_preflight_without_connecting_supabase`.
