# A2 Pre-Execution Readiness Recheck Preparation Copy Guard

Status: a2_pre_execution_readiness_recheck_preparation_copy_guard_ready

## Purpose

This document provides copy-safety guardrails for the PM mainline `TWII pre-execution readiness recheck preparation gate`.

It is a preparation copy guard only. It does not confirm that real external values were received, does not approve readiness, does not authorize execution, and does not change any runtime or data-source posture.

The current public/runtime posture must remain explicit:

- `publicDataSource=mock`
- `scoreSource=mock`

## Safe Wording

Use wording that describes preparation, review scope, and pending status:

- "pre-execution readiness recheck preparation"
- "copy guard prepared for PM integration"
- "pending PM review"
- "pending authorized evidence review"
- "mock-source posture remains unchanged"
- "`publicDataSource=mock` remains in force"
- "`scoreSource=mock` remains in force"
- "no SQL executed"
- "no Supabase connection attempted"
- "no Supabase write performed"
- "no market data fetched"
- "no `daily_prices` mutation performed"
- "not investment advice"
- "not a trading instruction"

Acceptable public-facing phrasing:

- "This readiness preparation note is based on mock-source posture only."
- "No real-market execution or real-data publication is authorized by this preparation note."
- "The current output remains for internal review and mock-mode validation."

Acceptable internal operator phrasing:

- "Proceed only with document-level preparation review."
- "Do not execute SQL, connect to Supabase, read secrets, fetch market data, or modify `daily_prices` from this gate."
- "Keep `publicDataSource=mock` and `scoreSource=mock` unless a separate authorized gate explicitly changes them."

## Forbidden Wording

Do not use wording that implies any completed real-data, execution, legal, or trading state.

Forbidden claims include:

- "real external values received"
- "readiness recheck passed"
- "approved to go"
- "go-live approved"
- "execution complete"
- "executed"
- "Supabase write complete"
- "daily_prices updated"
- "real data is live"
- "public data source is now Supabase"
- "`publicDataSource=supabase`"
- "`scoreSource=real`"
- "legal approved"
- "lawyer approved"
- "safe to trade"
- "trade based on this"
- "buy"
- "sell"
- "hold"
- "investment recommendation"
- "guaranteed signal"
- "production data confirmed"

Avoid softer implied versions as well:

- "ready for launch"
- "cleared for launch"
- "validated against real market data"
- "external confirmation received"
- "operator may proceed with live writes"
- "users can rely on this for trading"

## Public Copy Rule

Public copy must preserve a mock-only, non-execution posture.

Required public copy constraints:

- State or preserve `publicDataSource=mock`.
- State or preserve `scoreSource=mock`.
- Say that the material is for preparation or review only.
- Say that it is not investment advice.
- Say that it is not a trading instruction.
- Do not mention secrets, authorization phrases, internal confirmation phrases, or real decision values.
- Do not imply legal approval.
- Do not imply that real data is already live.
- Do not imply that readiness recheck has passed.

Public copy may say:

> This preparation copy is for mock-mode readiness review only. `publicDataSource=mock` and `scoreSource=mock` remain unchanged. It is not investment advice and must not be used as a trading instruction.

## Internal Operator Copy Rule

Internal operator copy may be more explicit about operational stop-lines, but must not include or request restricted values.

Required internal copy constraints:

- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Treat this as a document-level copy guard only.
- Do not execute SQL.
- Do not connect to Supabase.
- Do not read secrets, `.env`, authorization text, confirmation phrases, or real decision values.
- Do not fetch, ingest, store, or commit market data.
- Do not touch `daily_prices`.
- Do not write or imply Supabase writes.
- Do not advance public or scoring posture to real data.

Internal operator copy may say:

> A2 copy guard is ready for PM preparation integration. This is document-only guidance. No SQL, Supabase connection, secret/env read, market-data fetch, `daily_prices` change, or real-data posture change is authorized. Preserve `publicDataSource=mock` and `scoreSource=mock`.

## PM Integration Notes

PM may reference this file as the copy-safety guard for the pre-execution readiness recheck preparation gate.

Integration checklist:

- Use this file to screen PM-facing and public-facing wording before publishing or routing the preparation gate.
- Keep all PM gate language in preparation/pending/review mode.
- Preserve `publicDataSource=mock` and `scoreSource=mock` in any copied summary.
- Add a visible "not investment advice / not for trading" disclaimer wherever the copy could be seen outside the operator workflow.
- If PM needs real external values, source authorization, legal approval, Supabase confirmation, or go/no-go decisions, route those through separate authorized gates. Do not infer them from this A2 copy guard.
- If any copy says or implies readiness passed, execution completed, live data published, Supabase writes occurred, legal approval was granted, or trading action is allowed, block the copy until PM rewrites it.

Suggested PM summary:

> A2 copy guard is ready for PM integration. The readiness recheck remains in preparation mode only. No real external values, execution, Supabase write, legal approval, or trading recommendation is asserted. Preserve `publicDataSource=mock` and `scoreSource=mock`.

## Hard Boundaries

This A2 branch must remain inside the following boundaries:

- No SQL execution.
- No Supabase connection.
- No Supabase reads or writes.
- No secrets, `.env`, authorization text, confirmation phrase, or real decision value reads.
- No market-data fetching.
- No market-data ingestion.
- No market-data storage or commits.
- No `daily_prices` access or mutation.
- No change to `publicDataSource`.
- No change to `scoreSource`.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No legal-approval claim.
- No investment-advice claim.
- No trading instruction.

The only approved posture for this preparation copy guard is:

- `publicDataSource=mock`
- `scoreSource=mock`

