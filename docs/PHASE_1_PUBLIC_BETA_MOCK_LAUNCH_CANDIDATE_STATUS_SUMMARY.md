# Phase 1 Public Beta Mock Launch Candidate Status Summary

Updated: 2026-06-13

Status: `phase_1_public_beta_mock_launch_candidate_status_summary_ready`

Owner: CEO / PM mainline

CEO decision: `GO_WITH_MOCK_ONLY_PUBLIC_BETA_CANDIDATE`

## Purpose

This summary gives PM and CEO one concise candidate-state view after the revised `指數燈號網站 BRIEF` Phase 1 / Phase 2 split.

Phase 1 can move as a public free index-lighting site candidate while the runtime stays mock-only.

This summary does not approve deployment, SQL, Supabase writes, raw market-data fetch, source promotion, real scoring, or Phase 2 membership implementation.

## What Can Go Public Now

The public Beta candidate can show:

- market-lighting status for the public free dashboard;
- 30-second market mood reading;
- 3-minute action judgment;
- core indicator readout;
- alert list with status, cause, update time, impact level, and next step;
- source, update-time, coverage, and data-boundary explanation;
- non-investment-advice and no-trading-basis copy;
- Phase 2 membership roadmap as deferred product direction.

## What Remains Deferred

The following are intentionally deferred and must not block the Phase 1 mock-only candidate:

- real data promotion;
- complete Taiwan market coverage;
- SQL execution;
- Supabase write or staging row creation;
- `daily_prices` mutation;
- raw market-data fetch, storage, or commit;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- member login, payment, member-only content, watchlist persistence, custom alert execution, and post-market review implementation.

## Candidate Evidence

The current candidate depends on these evidence paths and checks:

| Evidence | Proof |
| --- | --- |
| Revised BRIEF and phase split | `docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md`, `check:phase-1-phase-2-execution-split-and-workflow-assignment` |
| PM/A1/A2/A3/A4 workstream ownership | `docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md`, `check:pm-brief-runtime-mainline-goal-and-workstreams` |
| Launch gap rollup | `docs/PUBLIC_BETA_PHASE_1_LAUNCH_GAP_ROLLUP.md`, `check:public-beta-phase-1-launch-gap-rollup` |
| Mock launch proof bundle | `check:public-beta-mock-launch-proof-bundle` |
| Core route health | `check:public-beta-core-route-quick-proof` |
| Public copy and residue guard | `check:public-visible-language-quality`, `check:public-surface-user-facing-audit` |
| Home core indicators | `check:home-core-indicator-readout` |
| Alert actionability | `check:public-beta-alert-list-actionability` |
| Membership roadmap visibility and deferral | `check:public-beta-membership-mvp-roadmap` |

## A3 Resume Conditions

A3 launch / production engineering should resume only when at least one condition is true:

- a real Vercel/platform action is about to be performed;
- production env, domain, monitoring, SEO, cache, rollback, or post-deploy smoke evidence must be recorded;
- a public route smoke failure requires launch-engineering repair;
- CEO/PM asks for a no-secret platform checklist or post-platform report.

Until one of those conditions is true, PM should keep moving on the public usable loop and A1/A2/A4 support lanes.

## Workstream Assignments

PM mainline:

- keep Phase 1 public pages usable and readable;
- maintain the mock-only launch candidate evidence;
- integrate A1/A2/A3/A4 outputs only at coherent checkpoints.

A1 data/source/coverage:

- continue lawful free automated source, coverage, field-contract, ingestion/backfill preparation;
- no raw row fetch, no SQL, no Supabase write, no real promotion.

A2 public trust copy:

- guard source/update/coverage wording;
- keep non-investment-advice, no-trading-basis, and free/member boundary clear.

A3 launch operations:

- stay ready with no-secret launch/runbook artifacts;
- resume only under the A3 resume conditions above.

A4 membership MVP planning:

- keep Phase 2 path executable in planning;
- do not open login, payment, persistence, alert execution, or member-only content during Phase 1.

## Stop Lines

- No SQL.
- No Supabase write.
- No staging rows.
- No `daily_prices` mutation.
- No raw market data fetch, store, or commit.
- No secrets or raw payload output.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No claim of official endorsement.
- No complete Taiwan coverage claim.
- No real-time precision claim.
- No guaranteed return claim.
- No investment advice claim.

## Next PM Route

`phase_1_public_beta_candidate_final_public_readiness_scan`

The next PM slice should scan the public candidate one more time from a user perspective: can a first-time visitor understand the market light, core indicators, risk reminder, update time, data boundary, and Phase 2 membership path without seeing internal process residue?
