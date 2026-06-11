# A2 Operator-Visible Decision Packet Copy Guard

## Status

status: `a2_operator_visible_decision_packet_copy_guard_ready`

This guard defines the operator-visible copy boundary for the future decision packet readiness gate. It is a language and reporting safety layer only. It does not authorize execution, does not write real records, does not promote real scoring, and does not change any runtime data source.

## Scope

This document applies to UI labels, report text, review-gate summaries, public beta disclaimers, and internal operator notes that describe the operator-visible decision packet readiness flow.

The intended packet posture is:

- `operator-visible packet`
- `future real intake readiness`
- `mock-derived`
- `execution still blocked`
- `not investment advice`

The packet may be readable, fillable, and reviewable by future Chairman/CEO/operator roles, but only as a readiness format derived from mock recorder records.

## Safe Wording

Use wording that keeps the packet in a preparation and review state:

- `operator-visible packet`
- `operator-visible decision packet readiness`
- `future real intake readiness`
- `mock-derived readiness packet`
- `mock-derived operator review format`
- `prepared from mock recorder records`
- `ready for operator review of format and completeness`
- `execution still blocked`
- `real intake remains blocked until separate authorization`
- `not investment advice`
- `not a real scoring result`
- `not a real data launch`
- `not a Supabase write`
- `not a legal or compliance commitment`

Preferred UI/report sentence:

`This operator-visible packet is mock-derived and supports future real intake readiness review. Execution is still blocked, and this is not investment advice.`

Preferred short badge set:

- `Mock-derived`
- `Operator-visible`
- `Readiness only`
- `Execution blocked`
- `Not investment advice`

## Forbidden Wording

Do not use wording that implies execution, authorization, persistence, production launch, or real scoring.

Forbidden claims:

- Do not say the decision is authorized.
- Do not say the decision has been written.
- Do not say a real decision has been recorded.
- Do not say real market data is live.
- Do not say the packet has entered Supabase.
- Do not say `scoreSource=real`.
- Do not say `publicDataSource=supabase`.
- Do not say staging rows were created.
- Do not say `daily_prices` was modified.
- Do not say candidate rows were accepted.

Forbidden strings or equivalent meanings:

- `已授權`
- `已寫入`
- `已記錄真實決策`
- `已上線真實資料`
- `已進入 Supabase`
- `scoreSource=real`
- `publicDataSource=supabase`

## Public Beta Wording Guard

Public beta copy must stay conservative and non-advisory.

Safe public beta wording:

`This beta view may show mock-derived readiness information for operator review. It does not contain real investment advice, real scoring, real execution, or real write confirmation.`

Public beta copy must not:

- Invite users to treat packet output as a buy, sell, hold, allocation, or timing recommendation.
- Claim that a real decision has been accepted, stored, written, or executed.
- Claim that real source data is already live.
- Expose raw payloads, row-level records, stock-id payloads, secrets, env values, authorization text, or confirmation phrases.

## Disclaimer Guard

Every external-facing or beta-facing packet surface should preserve this meaning:

`Readiness-only. Mock-derived. Execution still blocked. Not investment advice.`

Long-form disclaimer:

`This packet is generated for operator-visible readiness review from mock-derived records. It does not authorize execution, does not record a real decision, does not write to Supabase, does not use real scoring, and is not investment advice.`

Do not weaken the disclaimer by replacing `execution still blocked` with softer terms such as `pending` unless the same copy also states that real execution and real writes remain blocked.

## Internal Operator Wording Guard

Internal operator copy may be more direct, but it must still avoid real decision values and real-write implications.

Safe internal wording:

- `Review whether the packet format is complete enough for future real intake.`
- `Confirm the required operator-visible fields are present without entering real decision values.`
- `Check that the packet remains mock-derived and execution-blocked.`
- `Escalate missing review fields to PM before any future authorization path is considered.`

Internal operator copy must not ask the operator to:

- Enter a real decision value.
- Confirm real authorization.
- Confirm a Supabase write.
- Confirm `scoreSource=real`.
- Confirm real market-data launch.
- Provide secrets, env values, authorization phrases, confirmation phrases, raw payloads, row-level data, or stock-id payloads.

## UI Semantics

Recommended UI labels:

- Page title: `Operator-Visible Packet Readiness`
- Primary status: `Mock-derived readiness packet`
- Execution status: `Execution still blocked`
- Source status: `Mock recorder derived`
- Review action: `Review readiness`
- Blocker label: `Real intake blocked`
- Advisory label: `Not investment advice`

Avoid UI labels:

- `Authorize`
- `Execute`
- `Write decision`
- `Record real decision`
- `Accept candidate rows`
- `Promote to real scoring`
- `Publish Supabase data`

Buttons should use review verbs, not execution verbs:

- Safe: `Review packet`, `Mark format reviewed`, `Request PM review`
- Forbidden: `Authorize`, `Write`, `Execute`, `Commit`, `Promote real`

## Report Semantics

A readiness report may say:

`The operator-visible packet format is ready for PM review as a mock-derived future real intake readiness artifact. Execution remains blocked. No real decision value, Supabase write, real scoring, raw payload, secret, or market-data fetch is included.`

A readiness report must not say:

`The operator has authorized the decision.`

`The decision has been written to Supabase.`

`The real scoring source is active.`

`The packet records the final real decision.`

## PM Integration Notes

PM can integrate this guard into the local-only readiness gate as copy validation criteria:

- The readiness gate should require the status string `a2_operator_visible_decision_packet_copy_guard_ready` before exposing operator-visible packet copy.
- Gate output should explicitly include `mock-derived`, `future real intake readiness`, `execution still blocked`, and `not investment advice`.
- Gate output should reject or flag copy that says authorized, written, real decision recorded, real data launched, Supabase entered, `publicDataSource=supabase`, or `scoreSource=real`.
- PM-facing summaries should describe packet readiness only, not approval, execution, persistence, or legal/compliance completion.
- Any future transition from readiness to real intake must require a separate authorization path outside this document.

## Hard Boundary Reminder

This guard does not permit SQL, Supabase connection attempts, `@supabase/supabase-js`, `createClient`, `.from`, `.insert`, `.update`, `.delete`, `.upsert`, secrets/env reads, authorization phrase reads, confirmation phrase reads, real decision values, market-data fetching, raw payload review, row payload review, stock-id payload review, staging row creation, `daily_prices` mutation, candidate-row acceptance, `publicDataSource=supabase`, or `scoreSource=real`.
