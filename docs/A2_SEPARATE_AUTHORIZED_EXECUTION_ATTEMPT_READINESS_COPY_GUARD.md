# A2 Separate Authorized Execution Attempt Readiness Copy Guard

Status: `a2_separate_authorized_execution_attempt_readiness_copy_guard_ready`

## Scope

A2 reviewed wording for the TWII separate authorized execution attempt readiness gate. The copy must help operators understand the future attempt shape without implying execution, real data promotion, legal approval, or investment advice.

## Safe Wording

Safe wording may say:

- The gate is a readiness gate.
- The gate is review-only, presence-only, and fail-closed.
- The gate prepares future controls for authorization presence, execute switch presence, confirmation phrase presence, server-only credential presence, rollback dry-run, aggregate readback, post-run review, and duplicate proof.
- `publicDataSource=mock` remains active.
- `scoreSource=mock` remains active.
- SQL, Supabase connection, Supabase write, `daily_prices` mutation, candidate row acceptance, raw payload output, and promotion are still blocked.

## Forbidden Wording

Forbidden wording includes any claim that:

- a write was executed
- Supabase was connected
- rows were inserted, updated, accepted, backfilled, or promoted
- TWII coverage was completed by this gate
- candidate rows were accepted
- `daily_prices` was changed
- `publicDataSource=supabase` is active
- `scoreSource=real` is active
- secrets, env values, authorization values, confirmation phrases, execute switch values, or real decision values are known or stored
- readiness prepared means execution approved
- review-only route means write route

## Public Copy Rule

Public copy should state that the service is still using mock runtime data and mock score data until a separate promotion gate passes. It should not mention secret handling details, confirmation phrases, credentials, SQL commands, raw payloads, or internal operator values.

## Internal Operator Copy Rule

Internal operator copy may list readiness requirements and blocked reasons. It must not ask the operator to paste secret values into repo files, docs, logs, JSON artifacts, comments, or public runtime UI.

## PM Integration Notes

PM can use this copy guard to keep the gate language concise and clear:

- use "readiness gate", not "execution complete"
- use "presence requirement", not "value verified"
- use "review-only next route", not "write route"
- keep the mock boundary visible
- keep all stop lines visible before any future final authorization stop line

## Hard Boundaries

- no SQL
- no Supabase connection
- no secrets/env/authorization/confirmation phrase output
- no real decision value output
- no market-data fetch or ingestion
- no `daily_prices` mutation
- no candidate row acceptance
- no `publicDataSource=supabase`
- no `scoreSource=real`
