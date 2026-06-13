# Public Beta Phase 1 Launch Gap Rollup

Updated: 2026-06-13

Status: `public_beta_phase_1_launch_gap_rollup_ready_mock_only`

Owner: CEO / PM mainline

CEO decision: `roll_up_phase_1_launch_gap_without_expanding_phase_2_or_real_data_execution`

## Scope

Phase 1 public free index-lighting site comes first.

Phase 2 membership is a planned path, not a Phase 1 blocker.

The current launch posture is `GO_WITH_MOCK_ONLY_PUBLIC_BETA_CANDIDATE`. Phase 1 can publicly explain the market-lighting loop, core indicators, source status, update time, and risk boundaries while `publicDataSource=mock` and `scoreSource=mock` remain visible. A3 operator/platform review remains available only when a real platform action or post-deploy smoke record is needed.

This rollup does not approve real-data promotion. It only clarifies what is ready, what is deferred, and what must stay blocked before any real source or member-only implementation.

Related PM mainline record: `docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md`.

## Current Phase 1 Gap Table

| Area | Phase 1 status | Decision | Evidence |
| --- | --- | --- | --- |
| Public market-lighting loop | Ready | Keep as Phase 1 core | `/`, `/briefing`, stock routes, `public-beta-index-dashboard-brief-loop`, `public-beta-decision-journey-panel`, `public-beta-value-loop-refinement` |
| Public source and coverage readability | Ready as mock-only | Keep visible; do not promote to real | `public-beta-user-value-source-coverage-bridge`, `public-beta-methodology-disclaimer-source-coverage-alignment`, `public-beta-source-coverage-runtime-labels` |
| Trust copy and non-advice boundary | Ready for Phase 1 | Keep every public route neutral and educational | `public-visible-language-quality`, `public-surface-user-facing-audit`, A2 public copy guard |
| A1 data/source coverage | In progress | Continue in background; not a Phase 1 mock-only blocker | A1 data/source coverage workstream, no raw market rows, no source promotion |
| Real data promotion | Blocked | `HOLD_FOR_REAL_DATA` remains rejected for Phase 1 speed | Requires source rights, coverage, quality, rollback, and runtime gates |
| Supabase and SQL write path | Blocked | Keep closed until a separate operator gate | No SQL, No Supabase write, no staging rows, no `daily_prices` mutation |
| A3 launch operations | Ready packet, platform action optional | Keep the no-secret operator path ready; do not expand it unless a platform action is needed | `docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md`, `docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_GO_NO_GO_PACKET.md`, `docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md`, `docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md` |
| Membership MVP | Deferred to Phase 2 | `HOLD_FOR_PHASE_2_MEMBERSHIP` is rejected as a Phase 1 blocker | `docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md` |

## Recommended Decision

Recommended: `GO_WITH_MOCK_ONLY_PUBLIC_BETA`.

Reason:

- Phase 1 value is market status comprehension, not real-data completeness.
- The site can be honest about demonstration data, source status, coverage status, update time, and non-investment-advice boundaries.
- Waiting for full real-data coverage or membership would slow the public learning loop without improving the first public Beta promise enough.

Rejected for now:

- `HOLD_FOR_REAL_DATA`: too slow for Phase 1; keep it as the A1/A3 promotion path.
- `HOLD_FOR_PHASE_2_MEMBERSHIP`: membership is strategically important, but it should not block public Beta.

## Workstream Assignments

PM mainline:

- Keep Phase 1 public pages clean, readable, and focused on market status, risk status, source status, and next observation.
- Prepare the next route: `phase_1_public_beta_mock_launch_candidate_status_summary`.

A1 data/source coverage:

- Continue legal-free automatable source and coverage work in the background.
- Deliver only accepted aggregate-safe evidence until an explicit executable gate is opened.

A2 public trust copy:

- Guard public claims around source status, update time, coverage, non-investment-advice, and membership boundary.
- Prevent official endorsement, real-time, complete-coverage, guaranteed-return, or personalized-advice implications.

A3 launch operations:

- Keep the release ops packet ready for operator and chairman review.
- Prepare post-platform action smoke and rollback reporting only when a platform action occurs.
- Keep the no-secret manual platform checklist as a standby path; do not expand operator governance while PM can still move the Phase 1 public usable loop.

A4 membership MVP planning:

- Stay in planning mode until PM decides Phase 2 can start without slowing Phase 1.
- Prepare membership MVP shape only: daily three-layer interpretation, watchlist and alert conditions, and post-market review.

## Stop Lines

- No SQL.
- No Supabase write.
- No staging rows.
- No `daily_prices` mutation.
- No raw market data fetch, store, or commit.
- No secrets or raw payload output.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No claim of official endorsement, complete Taiwan coverage, real-time precision, guaranteed return, or investment advice.

## Next PM Route

`phase_1_public_beta_mock_launch_candidate_status_summary`

The next slice should convert this rollup into a concise PM/CEO-facing mock launch candidate summary: what can go public now, what remains deferred, which checks prove the mock-only public site is usable, and when A3 platform/operator work actually needs to resume.
