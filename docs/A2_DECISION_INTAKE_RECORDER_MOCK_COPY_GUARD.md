# A2 Decision Intake Recorder Mock Copy Guard

Status: `a2_decision_intake_recorder_mock_copy_guard_ready`
Updated: 2026-06-11
Owner lane: A2 Runtime / Copy Guard
Integration owner: PM mainline
PM mainline target: `TWII decision intake recorder mock gate`
Mode: `local_only_fixture_derived_mock_recorder_copy_guard`

## Purpose

This document defines the UI, report, operator, public beta, and disclaimer wording guardrails for the TWII decision intake recorder mock gate.

The PM mainline may build a local-only recorder mock gate that turns the prior dry-run synthetic fixture outcomes `accepted`, `rejected`, and `repair_required` into mock recorder records. Those records are fixture-derived test records only. They are not real authorization, not a real write, not a legal commitment, not investment advice, not real market-data intake, not Supabase activity, and not real scoring.

Core interpretation:

- `mock recorder` means a local test recorder surface or report artifact, not a production recorder and not a persisted real decision log.
- `local-only` means the gate stays inside the local mock workflow and does not connect to Supabase, staging tables, `daily_prices`, market-data sources, or public runtime data promotion.
- `fixture-derived` means records are generated only from synthetic dry-run fixtures, not from real operator decisions, real decision values, secrets, confirmation phrases, raw payloads, row payloads, stock-id payloads, or market-data rows.
- `accepted`, `rejected`, and `repair_required` are fixture outcome labels only.
- `execution still blocked` means no runtime execution, SQL, Supabase write, data mutation, source promotion, or real scoring is authorized by this gate.
- `not investment advice` must remain visible wherever recorder labels, decision labels, scores, TWII references, or public beta wording could be interpreted as guidance.

## Non-Executable Boundary

This copy guard does not authorize, perform, request, or imply any execution action.

Do not:

- Run SQL.
- Connect to Supabase.
- Import `@supabase/supabase-js`.
- Use `createClient`.
- Use `.from`, `.insert`, `.update`, `.delete`, or `.upsert`.
- Read, output, summarize, infer, or validate secrets, env values, authorization values, confirmation phrases, or real decision values.
- Fill real decision values.
- Fetch, ingest, store, print, summarize, or refresh market data.
- Read raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or market-data rows.
- Create staging rows.
- Modify `daily_prices`.
- Accept candidate rows.
- Set, request, or imply `publicDataSource=supabase`.
- Set, request, or imply `scoreSource=real`.
- Claim legal approval, source-rights approval, production write readiness, live data readiness, or investment-advice approval.

## Safe Wording

Use wording that keeps the recorder clearly mock, local, fixture-derived, blocked from execution, and non-advisory:

- `mock recorder`
- `local-only`
- `fixture-derived`
- `fixture-derived mock recorder record`
- `synthetic fixture outcome`
- `mock recorder record prepared`
- `mock recorder record accepted as fixture-derived only`
- `mock recorder record rejected as fixture-derived only`
- `mock recorder record requires repair before fixture reuse`
- `execution still blocked`
- `no SQL executed`
- `no Supabase connection`
- `no Supabase write`
- `no real decision value used`
- `no market-data mutation`
- `no daily_prices mutation`
- `publicDataSource remains mock`
- `scoreSource remains mock`
- `not investment advice`

Recommended UI/report phrasing:

- `Mock recorder status: fixture-derived accepted record prepared. Execution still blocked.`
- `Mock recorder status: fixture-derived rejected record prepared. Execution still blocked.`
- `Mock recorder status: fixture-derived repair_required record prepared. Execution still blocked.`
- `This is a local-only mock recorder generated from synthetic dry-run fixtures. No real decision value, SQL, Supabase write, market-data mutation, public data promotion, or real scoring occurred.`
- `Recorder labels are internal fixture-review labels only and are not investment advice.`

Required short guard sentence when a mock recorder record appears:

> Local-only fixture-derived mock recorder record. Execution still blocked; no Supabase write, no real decision value, no `daily_prices` mutation, no `publicDataSource=supabase`, no `scoreSource=real`, and not investment advice.

## Forbidden Wording

Do not use wording that implies real authorization, real persistence, production data, Supabase activity, real scoring, legal clearance, or investment guidance.

Forbidden phrases include:

- `authorized`
- `real decision authorized`
- `authorization confirmed`
- `real decision recorded`
- `true decision recorded`
- `recorded real decision`
- `real recorder entry`
- `production recorder entry`
- `write completed`
- `Supabase write completed`
- `entered Supabase`
- `stored in Supabase`
- `Supabase-backed record`
- `daily_prices updated`
- `staging rows created`
- `candidate rows accepted`
- `real data is live`
- `live TWII data is active`
- `production market data enabled`
- `publicDataSource=supabase`
- `scoreSource=real`
- `real scoring enabled`
- `legal approval granted`
- `source rights approved`
- `investment advice approved`
- `investment recommendation passed`

Avoid status headlines such as:

- `Decision recorded`
- `Real decision accepted`
- `Authorization accepted`
- `Live recorder ready`
- `Supabase intake complete`
- `Production TWII recorder is live`
- `Real scoring is active`
- `Investment signal approved`

Use fixture-scoped alternatives instead:

- `Fixture-derived mock recorder record prepared`
- `Mock recorder record rejected for fixture wording`
- `Mock recorder record requires bounded repair`
- `Execution remains blocked after mock recorder preparation`

## Outcome Label Guard

The mock recorder may mirror the prior synthetic dry-run labels only as local fixture outcomes.

### accepted

Safe wording:

- `Fixture-derived accepted mock recorder record prepared.`
- `Accepted means the synthetic fixture passed the local mock recorder shape check only.`
- `Accepted does not mean a real decision was authorized, written, stored, promoted, scored, or legally approved.`

Required boundary:

> Accepted is a fixture-derived mock recorder label only; execution still blocked.

### rejected

Safe wording:

- `Fixture-derived rejected mock recorder record prepared.`
- `Rejected means the synthetic fixture must not be reused as accepted recorder wording.`
- `Rejected does not prove or reject any real decision, row, source, legal position, market-data value, or investment signal.`

Required boundary:

> Rejected is a fixture-derived mock recorder label only; execution still blocked.

### repair_required

Safe wording:

- `Fixture-derived repair_required mock recorder record prepared.`
- `Repair is limited to bounded fixture wording or recorder-shape cleanup before PM review.`
- `Repair does not authorize execution, Supabase activity, market-data work, row acceptance, source promotion, or real scoring.`

Required boundary:

> Repair_required is a fixture-derived mock recorder label only; execution still blocked.

## Public Beta Wording Guard

Public beta surfaces must not expose the mock recorder as a live feature, a production data claim, a Supabase-backed log, or a real decision record.

Safe public beta wording:

- `Internal mock-recorder checks were added to strengthen future data-intake review.`
- `Public beta remains on mock/local data behavior until separate production data gates are approved.`
- `Recorder testing is fixture-derived and local-only.`
- `Signals are experimental and not investment advice.`
- `Some data, coverage, source-rights, and scoring paths may remain mock, local, simulated, or under review.`

Forbidden public beta wording:

- `TWII decision recording is live.`
- `Real decisions are now recorded.`
- `Production TWII data intake is active.`
- `Supabase-backed recording is enabled.`
- `Real TWII scoring is active.`
- `The public beta now uses real decision records.`

Public beta copy must preserve mock/local semantics unless a later authorized release separately approves public runtime data promotion, real scoring, and legal copy.

## Disclaimer Wording Guard

Every UI or report surface that shows mock recorder labels should include a nearby disclaimer.

Full form:

> Local-only fixture-derived mock recorder. No real authorization, no real decision value, no SQL, no Supabase connection or write, no staging rows, no `daily_prices` mutation, no candidate-row acceptance, no public data promotion, no real scoring, and not investment advice.

Compact UI form:

> Mock recorder only. Local fixture-derived record; execution still blocked. Not investment advice.

Do not shorten the disclaimer in a way that removes the mock recorder, local-only, fixture-derived, execution-blocked, no-Supabase, no-real-score, or non-advice boundaries.

## Internal Operator Wording Guard

Internal operator surfaces may be more explicit, but they must not include real values or imply real authorization.

Allowed operator labels:

- `mock_recorder_record`
- `fixture_derived_recorder_record`
- `local_only_recorder_gate`
- `synthetic_outcome_label`
- `execution_still_blocked`
- `no_supabase_write_verified`
- `no_real_decision_value_used`
- `mock_public_data_source_preserved`
- `mock_score_source_preserved`
- `not_investment_advice`

Forbidden operator labels:

- `operator_authorized_real_decision`
- `real_decision_recorded`
- `production_decision_record`
- `supabase_record_created`
- `staging_row_created`
- `candidate_rows_accepted`
- `publicDataSource_supabase_enabled`
- `scoreSource_real_enabled`
- `investment_advice_approved`

Operator notes must not include secrets, env values, authorization phrases, confirmation phrases, real decision values, raw payloads, row payloads, stock-id payloads, market-data rows, or source/provider bodies.

## PM Integration Notes

PM may integrate this guard with the local-only recorder mock gate as follows:

- Generate recorder records only from the prior synthetic dry-run fixtures for `accepted`, `rejected`, and `repair_required`.
- Name records around `mockRecorder`, `localOnly`, `fixtureDerived`, `syntheticOutcome`, `executionStillBlocked`, `publicDataSourceMock`, `scoreSourceMock`, and `notInvestmentAdvice` where possible.
- Pair every mock recorder record with copy that says no real authorization, no real decision value, no SQL, no Supabase connection/write, no staging rows, no `daily_prices` mutation, no candidate-row acceptance, no public data promotion, and no real scoring occurred.
- Treat any attempt to display `publicDataSource=supabase` or `scoreSource=real` as a copy/runtime guard failure.
- Treat any phrase implying live authorization, real persistence, production write, production market data, source-rights approval, legal approval, or investment-advice approval as a report failure.
- Keep the gate local-only until a separate authorized workstream explicitly approves production data, production writes, source-rights/legal posture, public runtime source changes, and scoring-source changes.
- Do not wire this guard into runtime config, source-promotion files, scoring-source files, data files, market-data fetchers, Supabase clients, staging tables, or `daily_prices`.

## Copy Review Checklist

Before UI, report, operator, release-note, support, status-board, or handoff copy is accepted, confirm:

- Status is `a2_decision_intake_recorder_mock_copy_guard_ready`.
- Copy says `mock recorder`.
- Copy says `local-only`.
- Copy says `fixture-derived`.
- Copy says `execution still blocked`.
- Copy includes `not investment advice` where TWII, decision labels, scores, recorder labels, rankings, or public beta wording could be interpreted as guidance.
- `accepted`, `rejected`, and `repair_required` are framed as synthetic fixture outcomes only.
- Copy does not claim real authorization, real decision recording, Supabase entry, production write, staging rows, candidate-row acceptance, live data, legal approval, source-rights approval, or investment advice.
- Copy does not mention, output, or infer secrets, env values, authorization values, confirmation phrases, real decision values, raw payloads, row payloads, stock-id payloads, or market-data rows.
- Copy does not claim or imply `publicDataSource=supabase`.
- Copy does not claim or imply `scoreSource=real`.
- Copy preserves `publicDataSource=mock` and `scoreSource=mock` semantics until a separate PM/operator/legal gate changes them.
