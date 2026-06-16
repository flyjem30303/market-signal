# Phase 1 Runtime Promotion Operator Authorization Request Packet

Updated: 2026-06-16

Status: `phase_1_runtime_promotion_operator_authorization_request_packet_ready_no_execution`

Decision: `REQUEST_OPERATOR_AUTHORIZATION_KEEP_MOCK`

Owner: CEO / PM mainline

## Purpose

This packet defines the exact authorization request that must exist before any future bounded public-source promotion attempt can be considered.

It is not execution authorization by itself. It does not change runtime flags, touch platform settings, connect to Supabase, run SQL, write data, accept candidate rows, or promote public runtime state.

## Evidence Chain

- Separate bounded attempt review packet: `docs/PHASE_1_RUNTIME_PROMOTION_SEPARATE_BOUNDED_ATTEMPT_REVIEW_PACKET.md`
- Operator review summary: `docs/PHASE_1_RUNTIME_PROMOTION_OPERATOR_REVIEW_SUMMARY.md`
- Operator packet draft: `data/evidence-intake/phase-1-runtime-promotion-operator-packet.draft.json`
- Bounded attempt review check: `cmd.exe /c scripts\with-node20.cmd npm run check:phase-1-runtime-promotion-separate-bounded-attempt-review-packet`
- Operator packet intake check: `cmd.exe /c scripts\with-node20.cmd npm run check:phase-1-runtime-promotion-operator-packet-intake`

## Current Runtime Boundary

- `promotionAllowedNow=false`
- `dryRunOnlyAllowedNow=true`
- `publicDataSource=mock`
- `scoreSource=mock`
- `operatorDecision=RUN_PROMOTION_DRY_RUN_ONLY`

## Authorization Request

Before any future bounded attempt, an operator must explicitly review and answer this request:

`Authorize one bounded public-source promotion attempt preparation from mock toward the reviewed target, with rollback, readback, smoke, and post-run review required before any public real-data claim.`

Allowed request outcome values:

1. `REJECT_KEEP_MOCK`
2. `APPROVE_DRY_RUN_ONLY`
3. `APPROVE_BOUNDED_ATTEMPT_PREP_ONLY`

No request outcome may directly execute mutation.

## Required Operator Confirmations

The operator response must confirm all of the following before the project can prepare the next execution packet:

- runtime flag name reviewed;
- future target value reviewed;
- rollback owner available;
- rollback shape reviewed;
- readback command shape reviewed;
- production smoke command shape reviewed;
- post-run review owner available;
- public fallback copy reviewed;
- freshness fallback copy reviewed;
- no secret values printed or requested;
- no raw row payloads printed or requested;
- no investment advice or real-time guarantee in public copy.

## Fail-Closed Default

If any confirmation is missing, ambiguous, or rejected, the route remains:

`keep_mock_and_request_repair`

If every confirmation is accepted, the next route may become:

`phase_1_runtime_promotion_pre_execution_packet_no_execution`

## Hard Stop Conditions

Stop before any of the following:

- SQL execution;
- Supabase read/write;
- staging-row creation;
- `daily_prices` mutation;
- market-data fetch, ingest, storage, or commit;
- raw payload, row payload, stock-id payload, or secret output;
- production environment mutation;
- runtime flag mutation;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time precision claim;
- complete-market coverage claim;
- guaranteed-return or investment-advice claim.

## Next PM Action

Prepare an operator authorization response template and validator. That response gate must remain no-execution and must not accept secrets, row payloads, or raw market data.
