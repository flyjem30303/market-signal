# A2 Real Decision Acceptance Dry-Run Copy Guard

## Status

`a2_real_decision_acceptance_dry_run_copy_guard_ready`

## Purpose

This document defines the copy, UI, and report-language guardrails for the TWII real decision intake acceptance dry-run gate.

The gate is local-only and fixture-only. It may demonstrate how the intake flow classifies mock decision packets as `accepted`, `rejected`, or `repair_required`, but it must not imply real authorization, real market-data processing, Supabase writes, production launch, or investment-advice approval.

## Safe Wording

Use wording that keeps the boundary visible:

- `dry-run`
- `fixture-only`
- `mock boundary`
- `local-only acceptance rehearsal`
- `no production write performed`
- `no real decision value used`
- `not investment advice`
- `operator review required before any real intake`
- `accepted fixture packet`
- `rejected fixture packet`
- `repair_required fixture packet`

Recommended UI/report phrasing:

- `Dry-run result: accepted fixture packet`
- `Dry-run result: rejected fixture packet`
- `Dry-run result: repair_required fixture packet`
- `This is a fixture-only local rehearsal. No Supabase write, market-data mutation, or real scoring occurred.`
- `This report is for internal runtime acceptance testing only and is not investment advice.`

## Forbidden Wording

Do not use wording that implies real-world authorization, production data, or investment recommendation status:

- `authorized`
- `real decision authorized`
- `approved for live use`
- `production write completed`
- `Supabase write completed`
- `daily_prices updated`
- `real data is live`
- `market data has been updated`
- `investment advice approved`
- `investment recommendation passed`
- `scoreSource=real`
- `publicDataSource=supabase`

Avoid status headlines such as:

- `Real decision accepted`
- `Authorization confirmed`
- `Live data intake complete`
- `Production scoring enabled`
- `Investment advice gate passed`

Use fixture-scoped alternatives instead:

- `Fixture decision packet accepted by dry-run guard`
- `Fixture decision packet rejected by dry-run guard`
- `Fixture decision packet requires repair before future review`

## Public Beta Wording Guard

Public beta surfaces must not expose internal dry-run details as a user-facing promise. If a beta-facing page, banner, changelog, or help text mentions this work, keep the wording conservative:

- Say: `Internal dry-run checks were added to strengthen future data-intake review.`
- Say: `Public beta remains on mock-source behavior until separate production data gates are approved.`
- Say: `Signals are experimental and not investment advice.`
- Do not say: `Real TWII decision intake is live.`
- Do not say: `Production TWII data has been accepted.`
- Do not say: `The system now uses real scoring.`

Public beta copy must preserve `mock boundary` semantics unless a later authorized release explicitly changes the runtime posture.

## Disclaimer Wording Guard

Every UI/report surface that shows dry-run acceptance results should include a nearby disclaimer:

`Dry-run only. Fixture-only local rehearsal. No real authorization, no Supabase write, no market-data mutation, no real scoring, and not investment advice.`

Short form for compact UI:

`Fixture-only dry-run. No production write. Not investment advice.`

Do not shorten the disclaimer in a way that removes the dry-run, fixture-only, no-write, or not-investment-advice boundaries.

## Internal Operator Wording Guard

Internal operator surfaces may be more explicit, but must still avoid real authorization language.

Allowed operator labels:

- `operator_dry_run_review`
- `fixture_packet_status`
- `mock_boundary_verified`
- `no_write_verified`
- `requires_pm_review_before_real_intake`

Forbidden operator labels:

- `operator_authorized_real_intake`
- `real_decision_confirmed`
- `production_write_ready`
- `scoreSource_real_enabled`
- `supabase_public_data_enabled`

Operator notes must not include secrets, env values, authorization phrases, confirmation phrases, raw payloads, row payloads, stock-id payloads, real decision values, or market-data rows.

## PM Integration Notes

PM may integrate this copy guard with the local-only dry-run gate as follows:

- Show dry-run classifications as fixture outcomes only: `accepted`, `rejected`, and `repair_required`.
- Pair every accepted fixture result with copy that says no real authorization, no Supabase write, no market-data mutation, and no real scoring occurred.
- Keep report fields named around `dryRun`, `fixture`, `mockBoundary`, `noWrite`, and `notInvestmentAdvice` where possible.
- Treat any attempt to display `scoreSource=real` or `publicDataSource=supabase` as a copy/runtime guard failure for this dry-run.
- Treat any phrase implying live authorization, production write, production market data, or investment-advice approval as a report failure.
- Keep the gate local-only until a separate authorized workstream explicitly approves production data, production writes, and public-runtime source changes.

## Acceptance Checklist

- Status is `a2_real_decision_acceptance_dry_run_copy_guard_ready`.
- Dry-run copy says `dry-run`, `fixture-only`, or equivalent local rehearsal wording.
- Mock boundary is explicit.
- Public beta copy does not imply live TWII data or real scoring.
- Disclaimer includes `not investment advice`.
- Internal operator wording avoids real authorization and production-write claims.
- Forbidden wording does not appear in UI/report output except inside explicit forbidden-wording documentation.
