# A2 Operator Packet Fill Simulation Copy Guard

## Status

status: `a2_operator_packet_fill_simulation_copy_guard_ready`

This guard defines the copy, UI, and report-language boundary for the TWII operator packet fill simulation gate. It is a language and semantic safety layer only. It does not authorize execution, does not fill real decision values, does not write real records, does not connect to Supabase, does not promote real scoring, and does not change runtime data source posture.

## Scope

This document applies to UI labels, report summaries, public beta disclaimers, and internal operator notes that describe a future Chairman/CEO/operator decision-packet fill rehearsal.

The intended gate posture is:

- `placeholder-only fill simulation`
- `future operator fill rehearsal`
- `synthetic values only`
- `execution still blocked`
- `not investment advice`

The fill simulation may demonstrate whether a future operator packet can be completed through a safe workflow shape, but all filled examples must remain placeholders or synthetic values. The simulation must not use real authorization values, confirmation phrases, real decision values, market data, raw rows, candidate rows, or write results.

## Safe Wording

Use wording that keeps the flow in a non-executing rehearsal state:

- `placeholder-only fill simulation`
- `future operator fill rehearsal`
- `synthetic values only`
- `operator packet fill rehearsal`
- `local-only fill simulation`
- `non-executing packet rehearsal`
- `sample values are synthetic`
- `real values are withheld`
- `execution still blocked`
- `real intake remains blocked until separate authorization`
- `not investment advice`
- `not a real scoring result`
- `not a real Supabase write`
- `not a legal, compliance, or investment commitment`

Preferred UI/report sentence:

`This operator packet fill simulation uses placeholder-only synthetic values for a future operator fill rehearsal. Execution is still blocked, and this is not investment advice.`

Preferred short badge set:

- `Placeholder-only`
- `Synthetic values`
- `Fill rehearsal`
- `Execution blocked`
- `Not investment advice`

## Forbidden Wording

Do not use wording that implies authorization, persistence, production launch, real scoring, legal commitment, or investment advice.

Forbidden claims:

- Do not say the packet has been authorized.
- Do not say the packet has been written.
- Do not say a real decision has been recorded.
- Do not say real decision values were filled.
- Do not say real market data is live.
- Do not say the packet has entered Supabase.
- Do not say `scoreSource=real`.
- Do not say `publicDataSource=supabase`.
- Do not say staging rows were created.
- Do not say `daily_prices` was modified.
- Do not say candidate rows were accepted.
- Do not say the simulation is a legal, compliance, or investment approval.

Forbidden strings or equivalent meanings:

- `authorized`
- `real decision authorized`
- `written`
- `write completed`
- `real decision recorded`
- `real decision value filled`
- `real data is live`
- `entered Supabase`
- `Supabase write completed`
- `daily_prices updated`
- `candidate rows accepted`
- `scoreSource=real`
- `publicDataSource=supabase`

Use rehearsal-scoped alternatives instead:

- `placeholder-only fill simulation completed`
- `synthetic packet rehearsal completed`
- `future operator fill workflow reviewed`
- `execution remains blocked`
- `real values remain withheld`

## Public Beta Wording Guard

Public beta copy must stay conservative, non-advisory, and clear that no real intake or real scoring has occurred.

Safe public beta wording:

`Internal placeholder-only fill simulation has been added to strengthen future operator packet review. Public beta remains mock-only; no real decision value, real scoring, Supabase write, or investment advice is included.`

Public beta copy must not:

- Invite users to treat simulated packet values as buy, sell, hold, allocation, or timing guidance.
- Claim that a real decision has been accepted, stored, written, authorized, or executed.
- Claim that real TWII source data is already live.
- Claim that the system now uses real scoring.
- Expose raw payloads, row-level records, stock-id payloads, secrets, env values, authorization values, confirmation phrases, or real decision values.

Public beta copy must preserve `placeholder-only`, `synthetic values only`, `execution still blocked`, and `not investment advice` semantics unless a later separately authorized release changes the runtime posture.

## Disclaimer Wording Guard

Every UI or report surface that shows fill simulation output should include a nearby disclaimer:

`Placeholder-only fill simulation. Synthetic values only. No real authorization, no real decision record, no Supabase write, no real scoring, execution still blocked, and not investment advice.`

Short form for compact UI:

`Synthetic fill rehearsal. Execution blocked. Not investment advice.`

Do not shorten the disclaimer in a way that removes the placeholder-only, synthetic-only, execution-blocked, no-write, no-real-scoring, or not-investment-advice boundaries.

## Internal Operator Wording Guard

Internal operator surfaces may be direct, but must still avoid real authorization and real-value language.

Safe internal wording:

- `Review the fill flow using placeholder-only synthetic values.`
- `Confirm that all sample values remain synthetic and non-executing.`
- `Check whether the packet layout supports a future operator fill rehearsal without entering real decision values.`
- `Confirm execution remains blocked after the simulation.`
- `Escalate missing fields to PM before any separate real authorization path is considered.`

Allowed operator labels:

- `operator_fill_simulation`
- `placeholder_only_fill`
- `synthetic_value_rehearsal`
- `future_operator_fill_rehearsal`
- `execution_blocked_verified`
- `requires_pm_review_before_real_intake`

Forbidden operator labels:

- `operator_authorized_real_intake`
- `real_decision_confirmed`
- `real_decision_value_filled`
- `production_write_ready`
- `supabase_write_ready`
- `scoreSource_real_enabled`
- `supabase_public_data_enabled`

Internal operator notes must not include secrets, env values, authorization phrases, confirmation phrases, raw payloads, row payloads, stock-id payloads, real decision values, candidate rows, market-data rows, Supabase write results, or SQL bodies.

## UI Semantics

Recommended UI labels:

- Page title: `Operator Packet Fill Simulation`
- Primary status: `Placeholder-only fill simulation`
- Value status: `Synthetic values only`
- Execution status: `Execution still blocked`
- Source status: `Mock-only source posture`
- Review action: `Review rehearsal`
- Blocker label: `Real intake blocked`
- Advisory label: `Not investment advice`

Avoid UI labels:

- `Authorize`
- `Execute`
- `Write packet`
- `Write decision`
- `Record real decision`
- `Fill real decision value`
- `Accept candidate rows`
- `Promote to real scoring`
- `Publish Supabase data`

Buttons should use review or rehearsal verbs, not execution verbs:

- Safe: `Review simulation`, `Mark rehearsal reviewed`, `Request PM review`
- Forbidden: `Authorize`, `Write`, `Execute`, `Commit`, `Promote real`, `Fill real values`

## Report Semantics

A fill simulation report may say:

`The operator packet fill simulation is ready as a placeholder-only future operator fill rehearsal. Synthetic values were used only to validate the copy and workflow shape. Execution remains blocked. No real decision value, Supabase write, real scoring, raw payload, secret, authorization phrase, confirmation phrase, candidate row, or market-data fetch is included.`

A fill simulation report must not say:

`The operator has authorized the decision.`

`The real decision has been recorded.`

`The decision has been written to Supabase.`

`The real scoring source is active.`

`The packet contains final real decision values.`

## PM Integration Notes

PM can integrate this guard with the local-only operator packet fill simulation gate as copy validation criteria:

- Require the status string `a2_operator_packet_fill_simulation_copy_guard_ready` before exposing fill simulation copy in UI or reports.
- Gate output should explicitly include `placeholder-only fill simulation`, `future operator fill rehearsal`, `synthetic values only`, `execution still blocked`, and `not investment advice`.
- Gate output should reject or flag copy that says authorized, written, real decision recorded, real values filled, real data launched, Supabase entered, `publicDataSource=supabase`, or `scoreSource=real`.
- Report fields should prefer names around `fillSimulation`, `placeholderOnly`, `syntheticValuesOnly`, `executionBlocked`, `mockSource`, and `notInvestmentAdvice`.
- PM-facing summaries should describe rehearsal readiness only, not approval, execution, persistence, source promotion, legal/compliance completion, or investment advice.
- Any future transition from fill simulation to real intake must require a separate reviewed authorization path outside this document.
- If UI/report copy becomes ambiguous about whether values are synthetic or real, fail closed and route the packet copy back to PM review.

## Hard Boundary Reminder

This guard does not permit SQL, Supabase connection attempts, importing `@supabase/supabase-js`, `createClient`, `.from`, `.insert`, `.update`, `.delete`, `.upsert`, secrets/env reads, authorization phrase reads, confirmation phrase reads, real decision values, market-data fetching, raw payload review, row payload review, stock-id payload review, staging row creation, `daily_prices` mutation, candidate-row acceptance, `publicDataSource=supabase`, or `scoreSource=real`.

## Acceptance Checklist

- Status is `a2_operator_packet_fill_simulation_copy_guard_ready`.
- Copy says `placeholder-only fill simulation`.
- Copy says `future operator fill rehearsal`.
- Copy says `synthetic values only`.
- Copy says `execution still blocked`.
- Disclaimer includes `not investment advice`.
- Public beta wording does not imply live TWII data, real scoring, real writes, or real authorization.
- Internal operator wording avoids real decision values, authorization, confirmation phrases, and production-write claims.
- Forbidden wording does not appear in UI/report output except inside explicit forbidden-wording documentation.
