# Phase 1 Runtime Promotion External Authorization Quickstart

Status: `phase_1_runtime_promotion_external_authorization_quickstart_no_execution_ready`

Decision: `GUIDE_EXTERNAL_AUTHORIZATION_FILE_KEEP_MOCK`

This quickstart is the shortest safe path for a future operator to prepare and validate a real accepted bounded-write authorization response without committing that response to the repository.

## When To Use

Use this only after PM decides a bounded write attempt may be considered and the chairman or CEO is ready to provide one explicit operator authorization response.

## External File Path

Create the filled response outside tracked project files, for example:

`D:\指數燈號\tmp\phase-1-runtime-promotion-bounded-write-authorization-response.local.json`

Do not place a filled accepted authorization response under `data/`, `docs/`, `scripts/`, `app/`, or any tracked source folder.

## Fill Required Values

The external JSON must keep these fixed values:

- `responseMode=phase_1_runtime_promotion_bounded_write_authorization_response`
- `responseLabel=PHASE_1_RUNTIME_PROMOTION_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_FILLED_NO_EXECUTION`
- `operatorDecision=APPROVE_ONE_BOUNDED_WRITE_ATTEMPT`
- `targetTable=daily_prices`
- `targetScope=twii_and_etf_phase_1_missing_row_closure_only`
- `maxRowsPerAttempt=178`
- `confirmationCompleteness=complete`

All required confirmations must be `true`.

## Validate The External File

Run:

`cmd.exe /c scripts\with-node20.cmd node scripts/check-phase-1-runtime-promotion-bounded-write-authorization-response-intake-validator.mjs --response D:\指數燈號\tmp\phase-1-runtime-promotion-bounded-write-authorization-response.local.json`

Passing this validator still does not execute any write. It only proves the external authorization response is shaped correctly.

## After A Passing Validation

PM must create a fresh go/no-go record before any bounded write attempt can be considered.

Until that fresh go/no-go record exists:

- `boundedAttemptExecutableNow=false`
- `writeGateExecutableNow=false`
- `runnerExecutableNow=false`
- `promotionAllowedNow=false`
- `publicDataSource=mock`
- `scoreSource=mock`

## Never Do

- Do not commit a filled accepted authorization response.
- Do not print secrets or raw row payloads.
- Do not run SQL from this quickstart.
- Do not connect to Supabase from this quickstart.
- Do not mutate `daily_prices` from this quickstart.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not claim real-time data, complete-market coverage, or investment advice.

## Next Route

`external_authorization_validated_then_create_fresh_pm_go_no_go_or_keep_mock`
