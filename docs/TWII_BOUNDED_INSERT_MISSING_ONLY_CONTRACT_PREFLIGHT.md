# TWII Bounded Insert Missing-Only Contract Preflight

Status: `twii_bounded_insert_missing_only_contract_preflight_ready_no_execution`

Outcome: `bounded_insert_missing_only_contract_ready_runtime_still_blocked`

Owner: CEO/PM

Gate file: `data/source-gates/twii-bounded-insert-missing-only-contract-preflight.json`

This preflight converts the accepted TWII execute-switch confirmation preflight into a bounded insert missing-only contract shape. It prepares the contract terms a future write runner must satisfy, but it does not execute the runner and does not authorize data writes.

## Source And Scope

- sourcePreflightGatePath=data/source-gates/twii-execute-switch-confirmation-preflight.json
- candidateArtifactPath=data/candidates/twii-sanitized-candidate.json
- targetTable=daily_prices
- targetLane=TWII
- targetScope=twii_index_daily_prices_missing_rows
- maxRows=60
- contractMode=bounded_insert_missing_only_contract_no_execution

## Prepared Contract

- insertContractPrepared=true
- missingOnlySemanticsPrepared=true
- duplicateProtectionPrepared=true
- maxRowsContract=60
- readbackContractPrepared=true
- postRunReviewContractPrepared=true
- rollbackReadinessContractPrepared=true
- candidateArtifactReferenceOnly=true
- candidateArtifactRowsRead=false
- rowPayloadRead=false
- rawPayloadRead=false

The future operation is limited to `future_insert_missing_only`. It must keep the target scope at TWII only, reject duplicates before any mutation attempt, avoid updating existing rows, avoid deleting rows, avoid upsert behavior, avoid staging rows, and preserve the 60-row upper bound.

## Aggregate Contract

The prepared contract allows only aggregate fields for a later run review:

- `attemptId`
- `targetScope`
- `maxRows`
- `candidateRows`
- `insertedRows`
- `duplicateRows`
- `rejectedRows`
- `readbackRows`
- `rollbackReady`

The candidate artifact is referenced by path only in this gate. The report may check whether the file exists, but it does not read candidate rows or output market values.

## Stop Lines

- sqlExecuted=false
- supabaseClientImported=false
- supabaseConnectionAttempted=false
- supabaseWritesEnabled=false
- dailyPricesMutated=false
- candidateRowsAccepted=false
- runnerExecutableNow=false
- executionAllowedNow=false
- writeGateExecutableNow=false
- implementationAllowedNow=false

This preflight does not authorize SQL, Supabase connection, Supabase write, `daily_prices` mutation, candidate row acceptance, row coverage scoring, public data-source promotion, or real score promotion.

Runtime remains `publicDataSource=mock`. Scoring remains `scoreSource=mock`.

## Parallel Support Inputs

- A1 input consolidation: `docs/A1_TWII_BOUNDED_INSERT_CONTRACT_INPUTS.md`
- A2 shared copy queue: `docs/A2_SHARED_TRUST_COPY_PATCH_READY_QUEUE.md`

A1 supplied the data-contract input shape. A2 supplied public trust copy work that can continue later without blocking the TWII data gate.

## Next Route

If this contract remains accepted, the next PM mainline step is `prepare_aggregate_readback_contract_preflight_without_connecting_supabase`.
