# Phase 1 Write Runner Aggregate Readback Contract

Status: `phase_1_write_runner_aggregate_readback_contract_no_execution_ready`

Decision: `aggregate_readback_contract_prepared_but_write_execution_still_blocked`

This slice prepares the future post-write readback contract. It only defines aggregate fields that may be summarized after a separately authorized write attempt. It does not connect to Supabase and does not read any rows now.

## Contract State

- `sourceContractStatus=phase_1_write_runner_bounded_insert_missing_only_contract_no_execution_ready`
- `readbackContractPrepared=true`
- `sourceContractReadyForImplementation=false`
- `aggregateOnlyOutput=true`
- `immediateReadbackAllowedNow=false`
- `supabaseReadAllowedNow=false`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `implementationAllowedNow=false`

## Coverage Bound

- `fullLevel1ExpectedRows=360`
- `fullLevel1ObservedRows=182`
- `fullLevel1MissingRows=178`
- `twiiMissingRows=60`
- `etfMissingRows=118`

## allowedAggregateFields

- `attemptId`
- `targetScope`
- `expectedRows`
- `candidateRows`
- `insertedRows`
- `duplicateRows`
- `rejectedRows`
- `readbackRows`
- `missingRowsAfterAttempt`
- `rollbackReady`
- `startedAt`
- `finishedAt`

## forbiddenOutputShapes

- `row_payloads`
- `raw_payloads`
- `stock_id_payloads`
- `source_values`
- `trade_date_lists`
- `secret_values`
- `credential_values`

## Safety Boundary

- `publicDataSource=mock`
- `scoreSource=mock`
- No SQL
- No Supabase read
- No Supabase write
- No row payload output
- No raw payload output
- No public real-data promotion
- No investment advice

## Next Route

`phase_1_write_runner_rollback_or_quarantine_contract_no_execution`
