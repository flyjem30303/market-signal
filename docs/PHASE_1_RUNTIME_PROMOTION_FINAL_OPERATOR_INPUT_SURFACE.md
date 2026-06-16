# Phase 1 Runtime Promotion Final Operator Input Surface

Updated: 2026-06-16

Status: `phase_1_runtime_promotion_final_operator_input_surface_ready_no_execution`

Decision: `KEEP_MOCK_FINAL_INPUT_SURFACE_READY`

Owner: CEO / PM mainline

## Purpose

This is the final operator-facing input surface before a future bounded Phase 1 runtime promotion attempt can be prepared.

It is not execution authorization. It does not run SQL, connect to Supabase, write Supabase, mutate `daily_prices`, read secrets, fetch market data, expose row payloads, switch `publicDataSource`, or set `scoreSource=real`.

## Phase 1 Universe

Phase 1 is narrowed to:

- `TWII`
- Taiwan listed-stock daily close

ETF coverage, including `0050` and `006208`, is deferred to Phase 1.1 and must not block this Phase 1 input surface.

## Local Evidence Already Accepted

- Source depth accepted for Phase 1 scope.
- Data quality accepted for local Phase 1 scoring.
- Row coverage accepted for the narrowed Phase 1 universe.
- Post-readonly queue has no evidence blocker for Phase 1 scope.
- Runtime remains mock until bounded execution, readback, rollback, claim, and public runtime factory gates pass.

## Operator Input Template

Template path:

`data/evidence-intake/phase-1-runtime-promotion-final-operator-input.template.json`

The template is intentionally fail-closed. Default outcome is:

`NO_GO_KEEP_MOCK`

Allowed operator outcomes:

1. `NO_GO_KEEP_MOCK`
2. `GO_PREPARE_BOUNDED_PACKET_ONLY`

No allowed outcome may directly execute mutation.

## Required Operator Confirmations

A future filled local input may proceed only when every field below is true:

- `phase1UniverseReviewed`
- `sourceDepthAcceptedForPhase1Scope`
- `dataQualityAcceptedForPhase1Scope`
- `boundedExecutionPacketReviewed`
- `aggregateReadbackReviewed`
- `rollbackOrQuarantineReviewed`
- `postRunReviewReviewed`
- `publicRuntimeFactorySwitchReviewed`
- `claimAndDisclosureBoundaryReviewed`
- `noSecretsOrPayloadsIncluded`
- `noDirectMutationRequested`

If any confirmation is missing, false, ambiguous, or unsafe, the result remains:

`NO_GO_KEEP_MOCK`

## Required Stop Conditions

Stop before any of the following:

- SQL execution
- Supabase read/write
- staging-row creation
- `daily_prices` mutation
- raw market-data fetch, ingest, storage, or commit
- raw payload, row payload, stock-id payload, or secret output
- production environment mutation
- public runtime factory switch
- `publicDataSource=supabase`
- `scoreSource=real`
- real-time precision claim
- complete-market coverage claim
- guaranteed-return or investment-advice claim

## Next Route

If the filled local input is accepted as `GO_PREPARE_BOUNDED_PACKET_ONLY`, the next route may become:

`phase_1_runtime_promotion_narrowed_bounded_packet_readiness_no_execution`

If not accepted, keep:

`keep_mock_and_request_repair`
