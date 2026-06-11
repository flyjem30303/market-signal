# A2 External Values Shape Recheck Preparation Alignment Copy Guard

Status: a2_external_values_shape_recheck_preparation_alignment_copy_guard_ready

## Scope

This local-only A2 copy guard supports PM review of `external values shape recheck preparation alignment`.

The phrase `external values shape recheck preparation alignment` means copy alignment for a future, value-hidden, shape-only review. It does not mean that real external values, real decision values, authorization, execution approval, Supabase writes, real public data, legal approval, or row coverage closure exist.

Required retained posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## safe wording

Use wording that keeps the surface preparation-only, shape-only, value-hidden, mock-backed, non-executing, and non-advisory:

- External values shape recheck preparation alignment copy is ready for PM review.
- This is a wording guard for future shape-only review, not real-value intake.
- Real external values have not been requested, received, read, accepted, validated, stored, or used.
- Authorization, Go/No-Go, execution, Supabase write, public data promotion, legal approval, and launch approval remain outside this copy guard.
- Runtime copy must preserve `publicDataSource=mock`.
- Score copy must preserve `scoreSource=mock`.
- No investment advice or tradable signal is provided.
- Row coverage remains a separate blocked prerequisite unless a separately authorized PM-owned gate closes it.

Preferred compact status wording:

> External values shape recheck preparation alignment copy guard is ready for PM review only. It is local-only, value-hidden, non-executing, mock-backed, and non-advisory. `publicDataSource=mock` and `scoreSource=mock` remain locked.

## forbidden wording

Do not use wording that states or implies any of the following:

- Real values have already been received.
- Real decision values have already been received, recorded, accepted, validated, or used.
- Authorization has already been granted.
- A Go decision has already been given.
- Execution has already run.
- Supabase has already been connected, written, updated, or used as proof.
- `daily_prices` has already been written, repaired, updated, or promoted.
- Staging rows or candidate rows have been accepted.
- Public data is real, live, production-backed, or already online.
- Legal approval, source-rights approval, public redistribution approval, or launch approval has been completed.
- The surface is investment advice.
- The surface is a tradable signal, buy/sell/hold signal, rebalance signal, or market-timing signal.
- Row coverage has been completed, filled, repaired, closed, or made sufficient.
- `publicDataSource=supabase`
- `scoreSource=real`

Forbidden examples include equivalent claims such as:

- external values received
- real values confirmed
- operator authorized
- Go approved
- execution completed
- Supabase write completed
- real TWII data online
- production data active
- legal cleared
- investment signal ready
- row coverage complete

## public copy rule

Public copy may describe only conservative transparency about preparation and review. It must not describe internal mechanics as completed action or make readiness sound like real-data availability.

Public copy must:

- say this is preparation, alignment, wording, or review-only work;
- preserve `publicDataSource=mock`;
- preserve `scoreSource=mock`;
- keep TWII status informational and non-advisory;
- avoid any claim that real values, authorization, Go, execution, Supabase writes, real-data launch, legal approval, or row coverage completion has happened;
- avoid any wording that could be read as investment advice or a tradable signal.

Safe public copy:

> We prepared wording for a future value-hidden TWII external-values shape review. The public experience remains mock-backed and informational; no real values, Supabase writes, real scoring, legal approval, execution approval, row coverage closure, or investment advice is included.

## internal operator copy rule

Internal operator copy may identify blocked categories and PM review requirements, but it must stay value-hidden and non-executing.

Internal operator copy must:

- describe field names, presence placeholders, and wording alignment only;
- avoid real external values, real decision values, authorization values, confirmation phrases, secrets, env values, row payloads, candidate rows, and market data;
- keep `publicDataSource=mock` and `scoreSource=mock` visible in summaries and handoffs;
- mark ambiguous claims as repair-required when they could imply real values received, authorization, Go, execution, Supabase writes, real online data, legal approval, investment advice, tradable signals, or row coverage closure;
- route stronger claims to a separate PM-owned gate without changing runtime state.

Safe internal operator copy:

> External values shape recheck preparation alignment copy is ready for PM review only. This confirms copy guardrails for value-hidden shape preparation, not real value receipt, authorization, Go, execution, Supabase write, real public data, legal approval, row coverage closure, investment advice, or tradable signal readiness. `publicDataSource=mock` and `scoreSource=mock` remain locked.

## hard boundaries

This file is a local-only copy guard. It must not be used as permission to perform operational work.

- Do not run SQL.
- Do not connect to Supabase.
- Do not read Supabase.
- Do not read secrets, env values, authorization values, confirmation phrase values, credentials, or real decision values.
- Do not request, infer, fill, compare, validate, store, or display real external values.
- Do not fetch market data.
- Do not write, repair, update, or inspect `daily_prices` for row mutation purposes.
- Do not create staging rows.
- Do not accept candidate rows.
- Do not perform row coverage scoring or claim row coverage closure.
- Do not set, request, or imply `publicDataSource=supabase`.
- Do not set, request, or imply `scoreSource=real`.
- Do not turn copy readiness into legal approval, launch approval, execution approval, investment advice, or a tradable signal.

## PM integration notes

PM may cite this file as the A2 copy guard for `external values shape recheck preparation alignment`.

Integration requirements:

- Treat `a2_external_values_shape_recheck_preparation_alignment_copy_guard_ready` as copy guard readiness only.
- Keep this guard attached to any UI label, report row, release note, status board, or operator handoff that mentions external values shape recheck preparation alignment.
- Use `repair_required` for any wording that implies real values received, authorization granted, Go granted, execution completed, Supabase written, real public data online, legal approved, investment advice, tradable signal, or row coverage completed.
- Keep downstream status as `preparation alignment copy guard ready / execution blocked / publicDataSource=mock / scoreSource=mock / not investment advice`.
- Any future real-value intake, authorization, Go/No-Go decision, Supabase use, write execution, candidate-row acceptance, row coverage closure, legal approval, real scoring, public data promotion, launch approval, or trading-related claim requires a separate explicitly authorized PM-owned gate.

## Final Review Test

Before publishing or handing off any related copy, ask:

> Could a reader reasonably think real values were received, authorization was granted, Go was given, execution ran, Supabase was written, real data is online, legal approved, investment advice is being provided, a tradable signal exists, or row coverage is complete?

If yes, the copy fails this guard and must be rewritten as preparation-only, value-hidden, mock-backed, non-executing, and non-advisory.
