# A2 Explicit Execution Packet Preparation Copy Guard

Status: a2_explicit_execution_packet_preparation_copy_guard_ready

Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Integration owner: PM mainline
Gate: TWII explicit execution packet preparation
Mode: local_only_fail_closed_no_execution_copy_guard

Required phrase anchors: safe wording; forbidden wording; public copy rule; internal operator copy rule; explicit execution packet preparation; hard boundaries; PM integration notes; publicDataSource=mock; scoreSource=mock.

## Scope

This document is the A2 operator and public copy guard for the PM mainline
`TWII explicit execution packet preparation gate`.

It reviews wording only. It does not approve execution, does not receive real
operator values, does not validate authorization, does not connect to any
runtime service, and does not change market-data or scoring state.

The preparation state may only mean:

- an explicit execution packet preparation surface exists for PM/operator review;
- the packet remains presence-only and placeholder-only;
- execution is still blocked;
- public runtime posture remains `publicDataSource=mock`;
- scoring posture remains `scoreSource=mock`;
- all hard boundaries below remain active.

## Hard Boundaries

These hard boundaries apply to this A2 lane and to any copy derived from this
guard:

- No SQL execution.
- No Supabase connection, read, write, query, or schema inspection.
- No secrets, env values, authorization values, confirmation phrases, execute
  switch values, service-role values, or real decision values are read, printed,
  inferred, stored, summarized, or validated.
- No market data fetch, import, ingest, staging, storage, commit, backfill, or
  raw market-data review.
- No raw payloads, row payloads, stock-id payloads, source bodies, provider
  bodies, candidate rows, or market rows are read, printed, summarized, or
  exposed.
- No `daily_prices` mutation.
- No candidate-row acceptance.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No legal, compliance, source-rights, production, or launch approval claim.
- No investment recommendation, trading instruction, or reliance wording.

## Safe Wording

Use safe wording that keeps the state preparation-only, mock-bound, and
review-only:

- "The TWII explicit execution packet preparation gate is ready for PM/operator
  review."
- "The packet shape is prepared; execution remains blocked."
- "This is explicit execution packet preparation, not authorization and not
  execution."
- "Required fields are placeholder-only and presence-only."
- "No real operator decision, authorization value, confirmation phrase, execute
  switch, secret, env value, or real decision value has been read by this A2
  copy guard."
- "No SQL has been executed by this step."
- "No Supabase connection, read, or write has been performed by this step."
- "No `daily_prices` write has been performed."
- "No candidate rows have been accepted."
- "Public runtime remains `publicDataSource=mock`."
- "Scoring remains `scoreSource=mock`."
- "Any future execution requires a separate explicit authorization, execution
  path, readback, duplicate-proof review, rollback readiness, and post-run
  review."
- "This copy is for product/operator readiness review and is not investment
  advice."

Preferred compact internal status:

> TWII explicit execution packet preparation is ready for PM/operator review; execution remains blocked, no authorization has been accepted, no real values have been read, no SQL has run, no Supabase connection or write has occurred, no `daily_prices` mutation has occurred, no candidate rows have been accepted, `publicDataSource=mock`, `scoreSource=mock`, and this is not investment advice.

## Forbidden Wording

Forbidden wording must not say or imply any of the following:

- 已授權, "authorized", "authorization accepted", or "operator authorization is
  complete".
- 已收到真值, "real values received", "real operator decision received", "real
  decision values captured", or "confirmation phrase received".
- 已 Go, "Go approved", "operator selected Go", "go/no-go passed", or "ready to
  run now".
- 已執行, "executed", "runner executed", "execution completed", or "the attempt
  ran".
- Supabase 已寫入, "Supabase written", "database write completed", "staging rows
  written", or "`daily_prices` updated".
- 資料已真實上線, "real data is live", "public TWII data is online",
  "`publicDataSource=supabase` is active", or "`scoreSource=real` is active".
- 法務核准, "legal approved", "compliance approved", or "source-rights approved"
  unless a separate current approval artifact explicitly says so.
- 投資建議, "investment advice", "recommendation", "buy", "sell", "hold",
  "outperform", "target", "timing", "allocation", "forecast you can rely on",
  or equivalent trading guidance.
- 可依此交易, "users can trade on this", "safe to trade from this signal", or
  "investors can rely on this output".

Also forbidden:

- Treating "prepared" as "approved".
- Treating packet preparation as operator consent.
- Treating placeholder presence as actual value receipt.
- Treating PM review readiness as execution readiness.
- Treating local/mock state as production/live/real-data state.
- Treating this A2 copy guard as a legal, source-rights, runtime, database, or
  market-data gate.

## Public Copy Rule

Public copy rule: public-facing text must remain conservative, mock-bound, and
non-advisory.

Allowed public meaning:

- The product is preparing internal controls and review surfaces.
- Public source and score labels remain mock-bound where applicable.
- Real-data promotion requires separate internal gates, explicit authorization,
  execution evidence, readback evidence, and review.
- Information is for product testing, transparency design, and decision-support
  UX review, not investment advice.

Disallowed public meaning:

- Do not claim the execution packet has been authorized.
- Do not claim real operator values have been supplied or received.
- Do not claim any Go decision has been made.
- Do not claim any runner or execution attempt has started or completed.
- Do not claim Supabase has been written or `daily_prices` has been updated.
- Do not claim TWII data is live, real, complete, production-backed, or publicly
  online.
- Do not claim legal, compliance, regulatory, or source-rights approval.
- Do not frame signals, rankings, scores, dashboard output, or gate status as
  investment advice or tradeable guidance.

Public-safe wording pattern:

> TWII execution controls are under internal preparation and review. Public data and scoring remain mock-bound unless a separate approved gate changes that status. This is not investment advice.

## Internal Operator Copy Rule

Internal operator copy rule: operator-facing wording may be more precise, but it
must stay presence-only, fail-closed, and value-blind.

Allowed internal meaning:

- The explicit execution packet preparation shape is present.
- Required placeholders can be listed as prepared or missing.
- The next route can be described as review-only before a separate authorized
  execution attempt.
- Blocked reasons, rollback placeholders, aggregate readback placeholders,
  duplicate-proof placeholders, and post-run review placeholders may be named.
- The current state may say `publicDataSource=mock` and `scoreSource=mock`.
- The current state may say `executionAllowedNow=false`,
  `writeGateExecutableNow=false`, and `finalExecutionAllowedNow=false`.

Disallowed internal meaning:

- Do not print, store, infer, validate, or paraphrase actual authorization
  values, confirmation phrases, execute switch values, secrets, env values, or
  real decision values.
- Do not instruct any SQL, Supabase, market-data, staging-row, `daily_prices`, or
  candidate-row action.
- Do not convert preparation into execution permission.
- Do not collapse preparation, authorization, execution, readback, and post-run
  review into one completed state.

## PM Integration Notes

PM integration notes:

- PM may reference this file as the A2 wording dependency for the explicit
  execution packet preparation gate.
- PM acceptance copy should include
  `a2_explicit_execution_packet_preparation_copy_guard_ready`.
- PM should keep the packet state as preparation-only, presence-only,
  placeholder-only, local-only, fail-closed, and no-execution.
- PM should keep `publicDataSource=mock` and `scoreSource=mock` unless a separate
  future gate explicitly changes those values.
- PM should treat any proposed wording that implies authorization, real-value
  receipt, Go decision, execution, Supabase write, live data, legal approval, or
  investment advice as blocked.
- PM should route stronger wording to the relevant future approval lane instead
  of accepting it inside this preparation copy guard.

## Copy Review Checklist

Before accepting operator, public, release-note, status-board, handoff, or
support copy, confirm:

- It says explicit execution packet preparation, not execution approval.
- It keeps execution blocked.
- It does not imply 已授權.
- It does not imply 已收到真值.
- It does not imply 已 Go.
- It does not imply 已執行.
- It does not imply Supabase 已寫入.
- It does not imply `daily_prices` was updated.
- It does not imply 資料已真實上線.
- It does not imply `publicDataSource=supabase`.
- It does not imply `scoreSource=real`.
- It does not imply 法務核准.
- It does not imply 投資建議.
- It does not imply 可依此交易.
- It does not expose or reference protected values, raw payloads, row payloads,
  stock-id payloads, candidate rows, or market rows.
- It preserves `publicDataSource=mock`.
- It preserves `scoreSource=mock`.

## Stop Lines

Stop and route back to PM/operator review if requested copy or work:

- asks A2 to execute SQL or connect to Supabase;
- asks A2 to read secrets, env values, authorization phrases, confirmation
  phrases, execute switch values, or real decision values;
- asks A2 to fetch, ingest, inspect, store, stage, or backfill market data;
- asks A2 to modify `daily_prices`;
- asks A2 to accept candidate rows;
- asks A2 to set `publicDataSource=supabase`;
- asks A2 to set `scoreSource=real`;
- claims authorization, Go, execution, Supabase write, live data, legal approval,
  investment advice, or tradeable reliance.
