# A2 Server-Only Pre-Execution Integration Copy Guard

Status: `a2_server_only_pre_execution_integration_copy_guard_ready`

## Purpose

This A2 copy guard protects the TWII server-only pre-execution integration gate from being misunderstood as real authorization, real Supabase write execution, production launch approval, legal approval, or investment advice.

The gate may describe readiness, integration shape, review-only routing, and blocked execution conditions. It must not imply that the project is allowed to execute SQL, connect to Supabase, read secrets, write rows, accept candidate data, promote real scoring, or publish investment conclusions.

## Safe Wording

- "Server-only pre-execution integration gate is prepared for review."
- "The gate remains review-only and fail-closed."
- "Credential, authorization, confirmation phrase, and decision values are presence-only or placeholder-only."
- "No secret, env, authorization, confirmation phrase, raw payload, row payload, or decision value is read, printed, stored, or inferred."
- "No SQL is executed."
- "No Supabase connection is attempted."
- "No `daily_prices` row is inserted, updated, deleted, or upserted."
- "No candidate rows are accepted."
- "`publicDataSource=mock` and `scoreSource=mock` remain locked."
- "This prepares the operator decision path; it does not perform the operator action."
- "Any future real execution requires a separate explicit authorization step and a dedicated post-run review."

## Forbidden Wording

- "Authorized for production execution."
- "Ready to write real TWII rows."
- "Supabase write is approved."
- "SQL has been validated by this gate."
- "Credential values are available."
- "Confirmation phrase is verified."
- "Decision values are complete."
- "TWII candidate rows are accepted."
- "The market data is live."
- "The data source has been promoted to Supabase."
- "`scoreSource=real` is active."
- "Public beta is legally approved."
- "This is investment advice."
- "The signal recommends buying, selling, or holding."
- "The source terms are finally cleared for all production use."

## Public Copy Rule

Public-facing copy must only say that the system is still in a mock-data or review-preparation state unless a later approved production promotion explicitly changes that status.

Allowed public framing:

- "This page is in preparation and may use mock or limited review data."
- "Signals are for product testing and educational review only."
- "Data freshness and source coverage may be incomplete."
- "No investment recommendation is provided."

Blocked public framing:

- Do not say the data is complete, live, official, production-ready, legally cleared, or investment-grade.
- Do not reference server-only credentials, confirmation phrases, authorization values, internal gates, or operator decision values.
- Do not imply that this gate proves market-data rights, user suitability, financial accuracy, or regulatory compliance.

## Internal Operator Copy Rule

Internal operator copy may describe the gate as a pre-execution integration checkpoint, but must keep every execution condition explicit and blocked until a later authorized run.

Required internal wording:

- `reviewOnly=true`
- `localOnly=true`
- `presenceOnly=true`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `finalExecutionAllowedNow=false`
- `sqlExecuted=false`
- `supabaseConnectionAttempted=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`
- `publicDataSource=mock`
- `scoreSource=mock`

Internal copy must not ask an operator to paste, expose, print, store, or confirm the actual value of any secret, env variable, authorization value, confirmation phrase, execute switch, or real decision value inside the repository or chat.

## PM Integration Notes

- PM may use this guard when writing reports, gate summaries, progress briefs, and review-board entries for the server-only pre-execution integration slice.
- PM should treat this guard as a wording constraint, not an execution permit.
- PM should block any report that converts "prepared", "review-only", "presence-only", or "placeholder-only" into "approved", "executed", "connected", "written", or "launched".
- PM should keep A1 contract evidence and A2 copy guard evidence separate: A1 validates the operational contract shape; A2 validates interpretation and wording safety.
- If future execution is authorized, PM must create a separate execution-specific review path and must not reuse this document as proof of SQL, Supabase, market-data, legal, or investment approval.

## Hard Boundaries

- No SQL.
- No Supabase connection.
- No secrets, env values, authorization values, or confirmation phrases are read.
- No real decision value is read, filled, inferred, printed, or stored.
- No market data is fetched.
- No raw payload, row payload, or stock-id payload is fetched, stored, printed, or committed.
- No `daily_prices` mutation.
- No candidate rows are accepted.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.

