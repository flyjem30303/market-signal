# TWII Rollback Readiness Contract Preflight

Status: `twii_rollback_readiness_contract_preflight_ready_no_execution`

Outcome: `rollback_readiness_contract_ready_runtime_still_blocked`

Owner: CEO/PM

Gate file: `data/source-gates/twii-rollback-readiness-contract-preflight.json`

This preflight converts the accepted post-run review contract into a future rollback readiness contract. It defines the aggregate-only signals needed to know whether a future bounded write attempt has a locked rollback scope. It does not connect to Supabase, does not read rows, and does not authorize execution.

## Source And Scope

- sourcePostRunReviewGatePath=data/source-gates/twii-post-run-review-contract-preflight.json
- candidateArtifactPath=data/candidates/twii-sanitized-candidate.json
- targetTable=daily_prices
- targetLane=TWII
- targetScope=twii_index_daily_prices_missing_rows
- maxRows=60
- contractMode=rollback_readiness_contract_no_execution

## Prepared Contract

- rollbackReadinessContractPrepared=true
- rollbackScopeLockPrepared=true
- rollbackSummaryAggregateOnly=true
- rollbackStateVocabularyPrepared=true
- postRunReviewDependencyPrepared=true
- promotionLocksPrepared=true
- candidateArtifactReferenceOnly=true
- candidateArtifactRowsRead=false
- rowPayloadRead=false
- rawPayloadRead=false
- rollbackExecutionAllowedNow=false

## Allowed Rollback States

- `ready`
- `not_required`
- `blocked`
- `failed_closed`
- `not_executed`

## Allowed Aggregate Rollback Fields

- `attemptId`
- `reviewOutcome`
- `rollbackState`
- `targetScope`
- `targetTable`
- `targetLane`
- `maxRows`
- `candidateRows`
- `attemptedRows`
- `insertedRows`
- `rollbackEligibleRows`
- `rollbackBlockedRows`
- `duplicateRows`
- `rejectedRows`
- `readbackRows`
- `sanitizedErrorCategory`
- `promotionAllowed`
- `rowCoverageScoringAllowed`
- `publicDataSource`
- `scoreSource`

## Disallowed Rollback Fields

- `rowBody`
- `tradeDateList`
- `marketValue`
- `sourcePayload`
- `rawPayload`
- `stockIdPayload`
- `secretValue`
- `credentialValue`
- `personalizedAdvice`
- `buySellHoldSignal`

## Promotion Locks

- `promotionAllowed=false`
- `rowCoverageScoringAllowed=false`
- `publicDataSource=mock`
- `scoreSource=mock`

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

This preflight does not authorize SQL, Supabase read, Supabase write, `daily_prices` mutation, candidate row acceptance, rollback execution, row coverage scoring, public data-source promotion, or real score promotion.

Runtime remains `publicDataSource=mock`. Scoring remains `scoreSource=mock`.

## Next Route

If this contract remains accepted, the next PM mainline step is `prepare_final_execution_packet_preflight_without_connecting_supabase`.
