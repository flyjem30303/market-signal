# A2 Real Operator Intake Checklist Packet Copy Guard

## Status

status: `a2_real_operator_intake_checklist_packet_copy_guard_ready`

This document defines wording and UI/report semantic guardrails for the TWII real operator intake checklist packet gate. The packet gate is a local-only intake checklist aid for future Chairman/CEO/operator review. It turns known blocker gaps into fillable and reviewable checklist items, but it does not authorize execution, accept real decision values, write runtime data, clear legal obligations, provide investment advice, or enable real scoring.

## Scope

Use this guard when PM integrates checklist packet copy, UI labels, report summaries, handoff notes, or blocker explanations for the TWII real operator intake checklist packet gate.

The approved meaning is:

- A checklist packet can list missing required values for future operator completion and PM review.
- A checklist packet can make blocker gaps easier to inspect, assign, and repair.
- A filled-looking checklist format is not itself a filled real decision packet.
- Checklist readiness is not operator authorization.
- Checklist review is not legal, compliance, source-rights, or vendor-terms approval.
- Checklist output is not a real write, real market-data intake, real scoring result, or investment recommendation.
- Runtime posture remains local/mock unless a separate approved gate explicitly changes it.

## Non-Executable Boundary

This copy guard does not permit any runtime, data, credential, or market-data action.

Do not:

- Execute SQL.
- Connect to Supabase.
- Import `@supabase/supabase-js`.
- Use `createClient`.
- Use `.from`, `.insert`, `.update`, `.delete`, or `.upsert`.
- Read, print, summarize, or validate secrets, env values, credentials, authorization values, confirmation phrases, or real decision values.
- Fill true decision values into any checklist item.
- Fetch, import, ingest, refresh, store, commit, print, or summarize market data.
- Read raw payloads, row payloads, stock-id payloads, or provider/source bodies.
- Create staging rows.
- Modify `daily_prices`.
- Accept candidate rows.
- Set, request, or imply `publicDataSource=supabase`.
- Set, request, or imply `scoreSource=real`.

## Safe Wording

Use wording that keeps the packet in a missing-value checklist and future-review posture:

- `real operator intake checklist packet`
- `local-only checklist packet`
- `future operator review checklist`
- `missing required values`
- `blocker gaps`
- `checklist readiness`
- `fillable review aid`
- `repair and review only`
- `execution still blocked`
- `authorization not granted`
- `no real decision values supplied`
- `no Supabase write performed`
- `no real scoring performed`
- `not investment advice`

Preferred UI/report sentence:

> This local-only checklist packet lists missing required values for future operator and PM review. Execution remains blocked; no authorization, Supabase write, real decision value, legal approval, investment advice, or real scoring is implied.

Preferred short badge set:

- `Local-only`
- `Checklist packet`
- `Missing values`
- `Future review`
- `Execution blocked`
- `Not investment advice`

Safe action labels:

- `Review checklist`
- `Mark checklist item reviewed`
- `Request PM review`
- `Flag missing value`
- `Export checklist summary`
- `Prepare repair notes`

## Forbidden Wording

Do not use wording that makes checklist readiness sound like authorization, execution, persistence, legal clearance, public launch, advice, or real scoring.

Forbidden strings or equivalent meanings:

- `authorized`
- `authorization accepted`
- `execution approved`
- `execute`
- `write`
- `written`
- `saved to Supabase`
- `inserted into Supabase`
- `upserted`
- `real decision accepted`
- `real decision recorded`
- `real operator decision supplied`
- `confirmation phrase verified`
- `legal approved`
- `source rights approved`
- `vendor terms cleared`
- `candidate rows accepted`
- `staging rows created`
- `daily_prices updated`
- `live real data enabled`
- `production data active`
- `real scoring enabled`
- `investment recommendation`
- `buy`
- `sell`
- `hold`
- `target`
- `entry`
- `exit`
- `publicDataSource=supabase`
- `scoreSource=real`

Explicitly forbidden claims:

- Do not say the checklist authorizes any run.
- Do not say the checklist records, validates, or accepts true decision values.
- Do not say a missing-value checklist is a completed decision packet.
- Do not say Supabase has been connected, read, written, inserted, updated, deleted, or upserted.
- Do not say `daily_prices` has been changed.
- Do not say raw rows, stock identifiers, raw market payloads, secrets, env values, authorization phrases, confirmation phrases, or real decision values were reviewed.
- Do not say the checklist clears legal, compliance, source-rights, or vendor-terms risk.
- Do not say public users can rely on the output as a trading, allocation, timing, or investment signal.

## Public Beta Wording Guard

Public beta copy must keep the checklist packet framed as an internal/local readiness aid, not as a public real-data launch milestone.

Allowed public beta wording:

- `Beta experience; data, source rights, methodology, and runtime paths may remain under review.`
- `This checklist packet is an internal review aid for missing required values.`
- `Real-data execution remains blocked until separate review and approval.`
- `Not investment advice.`
- `Do not use checklist output as trading, allocation, timing, or reliance guidance.`

Forbidden public beta wording:

- `TWII real data is live.`
- `Real scoring is available.`
- `Operator authorization is active.`
- `Real decisions are being accepted.`
- `Checklist acceptance means source rights are cleared.`
- `The beta now writes to Supabase.`
- `The system is ready for investor reliance.`

Public beta surfaces should not expose raw payloads, row-level records, stock-id payloads, secrets, env values, authorization text, confirmation phrases, or real decision values.

## Disclaimer Guard

Every external, semi-public, stakeholder, or operator-facing report that mentions this checklist packet should preserve these meanings:

- This is not investment advice.
- This is not a recommendation to buy, sell, hold, allocate, trade, enter, exit, or time the market.
- This is not legal, compliance, source-rights, vendor-terms, or redistribution approval.
- This is not operator authorization.
- This is not a real decision record.
- This is not a Supabase write confirmation.
- This is not a real-data launch confirmation.
- This is not real scoring.

Recommended disclaimer:

> This checklist packet is a local-only review aid for missing required values. It does not authorize execution, record real decision values, connect to or write Supabase, modify `daily_prices`, clear legal or source-rights obligations, activate real scoring, or provide investment advice.

Do not soften `execution still blocked` into only `pending` unless the same copy clearly states that real execution, writes, real decision recording, public real-data activation, and real scoring remain blocked.

## Internal Operator Wording Guard

Internal operator copy may be direct about missing fields, but it must not request or reveal true decision values, secrets, authorization phrases, confirmation phrases, raw payloads, row payloads, stock-id payloads, or market-data records.

Use:

- `Checklist item missing`
- `Required value not supplied`
- `Repair required before review`
- `Future operator review only`
- `PM review required`
- `Execution still blocked`
- `Authorization not granted`
- `No real decision value entered`
- `No runtime write performed`

Avoid:

- `Enter the real decision value`
- `Confirm authorization`
- `Verify confirmation phrase`
- `Approve execution`
- `Write to Supabase`
- `Accept candidate rows`
- `Create staging rows`
- `Update daily_prices`
- `Enable real scoring`
- `Launch public real data`

When a checklist item is missing, UI/report copy must state the blocker outcome before any next-step language.

Example:

```text
Checklist blocker: required value missing.
Future operator review only; execution still blocked.
Prepare repair notes for PM review without entering real decision values.
Not investment advice.
```

## UI Semantics

Recommended UI labels:

- Page title: `Real Operator Intake Checklist`
- Primary status: `Local-only checklist packet`
- Blocker status: `Missing required values`
- Execution status: `Execution still blocked`
- Source status: `Mock/local posture unchanged`
- Review status: `Future operator and PM review`
- Advisory status: `Not investment advice`

Recommended button labels:

- `Review checklist`
- `Flag missing item`
- `Mark reviewed`
- `Request PM review`
- `Prepare repair notes`

Forbidden button labels:

- `Authorize`
- `Execute`
- `Submit real decision`
- `Write decision`
- `Save to Supabase`
- `Accept rows`
- `Promote real data`
- `Enable real scoring`

Checklist item states should describe review state, not runtime state:

- Safe: `missing`, `needs PM review`, `repair required`, `format reviewed`
- Forbidden: `authorized`, `executed`, `written`, `real accepted`, `legal cleared`, `score real`

## Report Semantics

A report may say:

> The TWII real operator intake checklist packet is ready as a local-only missing-value review aid. It lists blocker gaps for future operator and PM review. Execution remains blocked, and no true decision value, authorization phrase, confirmation phrase, Supabase activity, `daily_prices` mutation, raw payload, candidate-row acceptance, public data-source promotion, real scoring, legal approval, or investment advice is included.

A report must not say:

> The operator has authorized execution.

> The checklist has accepted the real decision.

> The decision has been written to Supabase.

> The checklist clears source rights or legal approval.

> The public beta now uses real TWII scoring.

## PM Integration Notes

PM can attach this document to the local-only checklist packet gate as the wording contract for UI, reports, handoffs, and review-gate summaries.

Integration requirements:

- Require status `a2_real_operator_intake_checklist_packet_copy_guard_ready` before using this copy guard as ready.
- Keep checklist completeness separate from authorization, source rights, legal review, runtime execution, row coverage, row acceptance, and scoring approval.
- Treat missing required values as blocker gaps, not as accepted decisions.
- Keep any checklist output local-only and review-only.
- Preserve `publicDataSource=mock` unless a separate approved gate explicitly changes it.
- Preserve `scoreSource=mock` unless a separate approved gate explicitly changes it.
- Reject copy that implies SQL, Supabase connection, Supabase read/write, staging-row creation, candidate-row acceptance, `daily_prices` mutation, public real-data activation, real scoring, legal clearance, or investment advice.
- Do not expose or ask for secrets, env values, authorization phrases, confirmation phrases, true decision values, raw payloads, row payloads, stock-id payloads, or raw market data.
- Do not connect this copy guard to runtime ingestion, market-data fetches, Supabase clients, scoring-source changes, or source-promotion changes.

Suggested PM handoff line:

```text
A2 copy guard ready: use checklist packet wording only for local-only missing-value review. Execution remains blocked; no authorization, true decision value, Supabase write, candidate-row acceptance, daily_prices mutation, legal approval, investment advice, public real-data launch, or real scoring is implied.
```

## Acceptance Checklist

- Status line is present.
- Safe wording includes `real operator intake checklist packet`, `missing required values`, `future operator review`, `execution still blocked`, and `not investment advice`.
- Forbidden wording blocks authorization, true decision values, Supabase activity, `daily_prices` mutation, candidate rows, legal clearance, public real-data launch, and `scoreSource=real`.
- Public beta wording remains conservative, non-advisory, and non-executing.
- Disclaimer wording rejects investment, legal, authorization, write, data-launch, and scoring implications.
- Internal operator wording frames checklist items as repair and review tasks only.
- PM integration notes preserve local/mock posture and avoid runtime, secret, raw-payload, row-payload, stock-id, market-data, and real-scoring surfaces.
