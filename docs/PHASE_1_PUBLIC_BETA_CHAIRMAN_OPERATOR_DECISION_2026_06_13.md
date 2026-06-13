# Phase 1 Public Beta Chairman Operator Decision - 2026-06-13

Status: `phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded`

Owner: Chairman-delegated CEO / PM / A3

Decision date: 2026-06-13

## Purpose

This is the filled chairman/operator decision record for the revised `指數燈號網站 BRIEF`.

It records the Phase 1 release direction only. It does not deploy, change DNS, mutate environment variables, run SQL, read or write Supabase, create staging rows, modify `daily_prices`, fetch raw market data, print secrets, promote public data to Supabase, set scores to real, or implement Phase 2 membership.

## Source Evidence

| Evidence | Current status |
| --- | --- |
| Phase 1 / Phase 2 execution split | `phase_1_phase_2_execution_split_ready` |
| Chairman/operator decision readiness packet | `phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair_ready` |
| Operator decision/manual platform readiness refresh | `phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh_ready` |
| Release review summary for chairman | `a3_phase_1_public_beta_release_review_summary_for_chairman_ready` |
| Chairman review packet | `a3_phase_1_public_beta_chairman_review_packet_ready` |
| Chairman/operator decision record template | `a3_phase_1_public_beta_chairman_operator_decision_record_ready` |
| Manual platform action checklist | `a3_phase_1_public_beta_manual_platform_action_checklist_ready` |
| Public visible residue cleanup | `phase_1_public_beta_public_visible_residue_cleanup_ready_mock_only` |
| Public status surface alignment | `phase_1_public_beta_public_status_surface_alignment_ready_mock_only` |
| PM BRIEF mainline goal and workstreams | `pm_brief_runtime_mainline_goal_ready` |

## Filled Decision Record

| Field | Value |
| --- | --- |
| `decisionId` | `phase1-public-beta-chairman-operator-decision-20260613-1` |
| `decisionTimestamp` | `2026-06-13T00:00:00+08:00` |
| `decisionOwner` | `Chairman-delegated CEO / PM` |
| `decision` | `GO_WITH_DEFERRALS` |
| `decisionScope` | Phase 1 public free index-lighting site only |
| `acceptedDeferrals` | Phase 2 member registration and login; Phase 2 member-only daily three-layer interpretation; Phase 2 watchlist persistence; Phase 2 custom alert execution; Phase 2 post-market review archive; payment/subscription flow; real-data promotion; full Taiwan all-listed-equity coverage; global market expansion; custom domain; paid vendor feeds; complete source automation. |
| `hardBlockers` | `none_for_phase_1_local_decision_packet` |
| `operatorActionAllowed` | `yes_manual_platform_checklist_only` |
| `operatorActionRoute` | `prepare_phase_1_public_beta_manual_platform_action_checklist` |
| `repairRouteIfRecheckFails` | `repair_phase_1_public_beta_blocker_then_recheck` |
| `publicDataSource` | `mock` |
| `scoreSource` | `mock` |

## Decision Rationale

CEO selects `GO_WITH_DEFERRALS` because the Phase 1 public free surface is separated from Phase 2 membership work, public route residue checks pass, public status wording stays user-facing, and the site still clearly marks mock/source/update/non-advice boundaries.

The accepted deferrals are not small omissions; they are deliberate Phase 2 or data-realization tracks. They must remain visible in planning, but they must not slow Phase 1 public Beta unless they create misleading public claims.

## What This Allows

This decision allows PM/A3 to prepare the human/operator to follow:

`docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md`

It also allows PM to keep A1, A2, A3, and A4 moving in parallel:

- A1 continues legal-free automated source, coverage, ingestion/backfill planning, and data-realization gates.
- A2 continues public trust copy, non-investment-advice language, source/update-time disclosure, and free/member boundary guard.
- A3 continues Vercel/platform checklist, smoke report, monitoring, rollback, SEO/domain/env readiness, and no-secret operator packets.
- A4 continues Phase 2 membership MVP planning without implementing login, payment, watchlist persistence, alerts, or member-only content in Phase 1.

## What This Does Not Allow

This decision does not authorize:

- platform deploy by this repo;
- DNS change;
- production environment variable mutation;
- SQL execution;
- Supabase read/write;
- staging row creation;
- `daily_prices` mutation;
- raw market data fetch, storage, logging, or commit;
- secret or raw payload output;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time official market-data claim;
- official endorsement claim;
- guaranteed-return claim;
- personalized investment advice;
- buy/sell/hold recommendation;
- Phase 2 membership implementation as a Phase 1 blocker.

## Required Recheck Before Any Manual Platform Action

Before any operator action, rerun:

1. `cmd.exe /c npm run check:phase-1-public-beta-chairman-operator-decision-2026-06-13`
2. `cmd.exe /c npm run check:phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair`
3. `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup`
4. `cmd.exe /c npm run check:phase-1-public-beta-public-status-surface-alignment`
5. `cmd.exe /c npm run check:a3-phase-1-public-beta-manual-platform-action-checklist`
6. `cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams`
7. `cmd.exe /c npx tsc --noEmit`

## Next Route

`prepare_no_secret_manual_platform_action_or_repair_recheck_failure`
