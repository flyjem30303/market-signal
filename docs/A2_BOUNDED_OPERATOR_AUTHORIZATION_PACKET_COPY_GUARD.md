# A2 Bounded Operator Authorization Packet Copy Guard

Status: `a2_bounded_operator_authorization_packet_copy_guard_ready`

## Purpose

This A2 copy guard protects the TWII bounded operator authorization packet gate from being misunderstood as completed real authorization, real Supabase write execution, production launch approval, legal approval, or investment advice.

The packet may describe review readiness, bounded authorization shape, operator-facing checklist structure, and blocked execution conditions. It must not imply that SQL may run, Supabase may be connected, `daily_prices` may be mutated, candidate rows may be accepted, live market data is active, legal approval is complete, or any signal is investment guidance.

## Safe Wording

- "The bounded operator authorization packet is prepared for review."
- "The packet remains bounded, review-only, and fail-closed."
- "Operator decision, execute switch, confirmation phrase, credential, and authorization values are not read, filled, printed, stored, or inferred."
- "Any authorization described here is packet-readiness wording only, not runtime execution approval."
- "No SQL is executed."
- "No Supabase connection is attempted."
- "No secrets, env values, authorization values, confirmation phrases, or real decision values are read."
- "No market data is fetched."
- "No raw payload, row payload, or stock-id payload is fetched, stored, printed, or committed."
- "No `daily_prices` row is inserted, updated, deleted, or upserted."
- "No candidate rows are accepted."
- "`publicDataSource=mock` remains locked."
- "`scoreSource=mock` remains locked."
- "A later explicit execution gate is required before any real write, real data-source promotion, or real scoring promotion."

## Forbidden Wording

- "Real operator authorization is complete."
- "The operator has approved the Supabase write."
- "The packet authorizes execution."
- "The runner may now write real rows."
- "SQL has been approved by this packet."
- "Supabase is connected."
- "Supabase write is ready."
- "`daily_prices` is ready to be updated."
- "TWII candidate rows are accepted."
- "The candidate artifact is approved for insertion."
- "Market data is live."
- "The public data source is Supabase."
- "`publicDataSource=supabase` is active."
- "`scoreSource=real` is active."
- "Public beta is legally approved."
- "Source rights are fully cleared for production."
- "The signal is suitable for trading decisions."
- "This is investment advice."
- "Users should buy, sell, hold, reduce, accumulate, or rebalance based on this signal."

## Public Copy Rule

Public-facing copy must not expose or imply internal authorization mechanics. It must describe only the public product posture that is actually approved.

Allowed public framing:

- "This beta experience may use mock, limited, delayed, or review-stage data."
- "Signals are for informational and product-evaluation purposes only."
- "Data coverage, freshness, source rights, and scoring methodology may remain under review."
- "No investment recommendation is provided."

Blocked public framing:

- Do not say the site is live-data-backed, Supabase-backed, production-ready, legally cleared, complete, official, or investment-grade unless a later explicit production promotion gate approves the exact wording.
- Do not mention operator authorization packets, confirmation phrases, execute switches, credentials, secrets, internal gates, or decision values.
- Do not imply that a bounded packet proves source rights, data accuracy, investor suitability, financial reliability, or regulatory compliance.

## Internal Operator Copy Rule

Internal operator copy may describe this as a bounded authorization packet prepared for review, but it must keep the distinction between packet readiness and real execution explicit.

Required internal wording:

- `reviewOnly=true`
- `localOnly=true`
- `presenceOnly=true`
- `boundedPacketPrepared=true`
- `realAuthorizationCompleted=false`
- `realDecisionValueRead=false`
- `confirmationPhraseRead=false`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `finalExecutionAllowedNow=false`
- `sqlExecuted=false`
- `supabaseConnectionAttempted=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`
- `publicDataSource=mock`
- `scoreSource=mock`

Internal copy must not ask an operator to paste, reveal, print, store, or confirm the actual value of any secret, env variable, authorization value, confirmation phrase, execute switch, credential, or real decision value inside the repository, issue tracker, status board, public page, or chat.

## PM Integration Notes

- PM may use this guard when writing bounded operator authorization packet summaries, gate reports, review-board entries, public beta notes, and internal operator instructions.
- PM should treat this guard as a wording and interpretation constraint, not an execution permit.
- PM should reject any wording that turns "packet prepared", "bounded", "review-only", "presence-only", or "placeholder-only" into "authorized", "executed", "connected", "written", "launched", "legally approved", or "investment-ready".
- PM should keep A1 contract evidence and A2 copy guard evidence separate: A1 validates operational contract shape; A2 validates wording safety and user/operator interpretation.
- If a future real execution is authorized, PM must create a separate execution-specific approval path and must not reuse this document as proof of SQL permission, Supabase permission, source-rights clearance, legal approval, production launch, or investment-advice approval.

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

