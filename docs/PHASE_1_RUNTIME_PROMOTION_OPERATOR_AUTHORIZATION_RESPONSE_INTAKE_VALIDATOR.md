# Phase 1 Runtime Promotion Operator Authorization Response Intake Validator

Updated: 2026-06-16

Status: `phase_1_runtime_promotion_operator_authorization_response_intake_validator_ready_no_execution`

Decision: `KEEP_MOCK_RESPONSE_INTAKE_READY`

Owner: CEO / PM mainline

## Purpose

This validator accepts a local filled operator authorization response only as a no-execution routing signal.

It does not execute mutation, change runtime flags, touch platform settings, connect to Supabase, run SQL, write data, accept candidate rows, or promote public runtime state.

## Evidence Chain

- Response template: `docs/PHASE_1_RUNTIME_PROMOTION_OPERATOR_AUTHORIZATION_RESPONSE_TEMPLATE.md`
- Response template JSON: `data/evidence-intake/phase-1-runtime-promotion-operator-authorization-response.template.json`
- Accepted example: `data/evidence-intake/phase-1-runtime-promotion-operator-authorization-response.accepted-example.json`
- Validator command: `cmd.exe /c scripts\with-node20.cmd npm run check:phase-1-runtime-promotion-operator-authorization-response-intake-validator`

## Accepted Intake Shape

The filled response must include:

- `responseMode=phase_1_runtime_promotion_operator_authorization_response`
- `responseLabel=PHASE_1_OPERATOR_AUTHORIZATION_RESPONSE_FILLED_NO_EXECUTION`
- one allowed `operatorOutcome`
- `confirmationCompleteness=complete`
- `promotionAllowedNow=false`
- `dryRunOnlyAllowedNow=true`
- `publicDataSource=mock`
- `scoreSource=mock`
- every required confirmation set to true

## Allowed Routes

If `operatorOutcome=APPROVE_DRY_RUN_ONLY`, the only allowed next route is:

`phase_1_runtime_promotion_dry_run_only_authorized_no_execution`

If `operatorOutcome=APPROVE_BOUNDED_ATTEMPT_PREP_ONLY`, the only allowed next route is:

`phase_1_runtime_promotion_pre_execution_packet_no_execution`

If `operatorOutcome=REJECT_KEEP_MOCK`, the only allowed next route is:

`keep_mock_and_request_repair`

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

Use this validator before any dry-run-only or bounded-attempt preparation packet. The next step may prepare a dry-run-only authorization route, but still must not mutate production, write Supabase, run SQL, or promote `publicDataSource` / `scoreSource`.
