# Phase 1 Public Beta Operator Decision Or Manual Platform Action Readiness Refresh

Updated: 2026-06-13

Status: `phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh_ready`

Owner: CEO / PM / A3 Launch

## Purpose

This refresh is the pre-action routing page for Phase 1 public Beta.

It decides whether PM should:

1. ask for a chairman/operator `GO`, `GO_WITH_DEFERRALS`, or `NO_GO` decision;
2. follow the no-secret manual platform action checklist after an accepted decision;
3. repair a blocker before any operator/platform action.

This refresh does not deploy, change DNS, mutate platform environment variables, execute SQL, read/write Supabase, fetch market data, print secrets, or promote real data.

## Required Inputs

| Input | Required status |
| --- | --- |
| Phase split and workflow assignment | `phase_1_phase_2_execution_split_ready` |
| Pre-operator keep-open status dashboard alignment | `phase_1_public_beta_pre_operator_keep_open_status_dashboard_alignment_ready` |
| Chairman/operator decision record | `a3_phase_1_public_beta_chairman_operator_decision_record_ready` |
| Manual platform action checklist | `a3_phase_1_public_beta_manual_platform_action_checklist_ready` |
| Public status surface alignment | `phase_1_public_beta_public_status_surface_alignment_ready_mock_only` |
| Public visible residue cleanup | `phase_1_public_beta_public_visible_residue_cleanup_ready_mock_only` |
| A3 keep-open/repair/no-go rollup | `a3_phase_1_public_beta_keep_open_repair_or_no_go_result_rollup_ready` |
| PM BRIEF runtime mainline | `pm_brief_runtime_mainline_goal_ready` |

## Routing Decision

| Condition | PM route | Meaning |
| --- | --- | --- |
| Evidence is current, public residue cleanup passes, public status surface is clean, and no hard blocker remains | `request_chairman_operator_go_or_go_with_deferrals_decision` | PM may ask for a chairman/operator decision, but no platform action occurs inside this repo. |
| Chairman/operator decision is already `GO` or `GO_WITH_DEFERRALS`, no hard blocker remains, and local evidence is current | `follow_no_secret_manual_platform_action_checklist` | Operator may use the hosting dashboard checklist manually. |
| Public route, trust copy, source/update wording, metadata, build, or platform evidence is stale or failing but bounded | `repair_phase_1_public_beta_blocker_then_recheck` | PM/A2/A3 repairs the narrow blocker and reruns focused checks. |
| Any hard stop line is touched | `hold_or_no_go_until_separate_authorization` | Do not request platform action. Route to repair or separate authorization. |

## Chairman/Operator Decision Readiness

Before asking for `GO` or `GO_WITH_DEFERRALS`, PM must confirm:

- Phase 1 is still the public free index-lighting site.
- Phase 2 membership remains deferred and non-blocking.
- Public pages do not expose internal execution states.
- Public pages show source/update and demonstrative-data boundaries.
- Public pages state non-investment-advice clearly.
- Public visible residue cleanup passes.
- Rollback path is documented.
- Accepted deferrals are named.

## Manual Platform Action Readiness

Before any operator follows the manual checklist, PM/A3 must confirm:

- a chairman/operator `GO` or `GO_WITH_DEFERRALS` decision is recorded;
- the no-secret manual platform action checklist is current;
- `NEXT_PUBLIC_SITE_URL` presence can be checked in the platform dashboard without printing values;
- public route smoke and public claim smoke are defined;
- rollback button/path is known in the platform dashboard;
- post-platform action report template is ready;
- no secret value will be copied into chat, docs, screenshots, or repository files.

## Repair Before Operator Action

Repair first when any of these are true:

- `/` or `/briefing` route health is stale or failing;
- legal/trust routes are stale or failing;
- public status surface exposes internal execution language;
- public visible residue cleanup fails;
- update/source wording implies live official data;
- copy implies investment advice, guaranteed return, complete coverage, or official endorsement;
- build or TypeScript evidence is stale;
- branch, root directory, or framework preset is uncertain.

## Workstream Assignment

PM mainline:

- owns the readiness refresh and decides the next PM route.
- keeps public pages user-facing and avoids reopening broad governance.

A1 data/source/coverage:

- remains parallel and does not block Phase 1 manual platform readiness unless public source/update wording becomes misleading.

A2 public copy/product safety:

- owns copy repairs for non-advice, source/update, formal-data, and free/member boundary wording.

A3 launch/production engineering:

- owns manual checklist freshness, route smoke shape, platform action boundaries, monitoring, and rollback readiness.

A4 membership MVP planning:

- remains Phase 2 planning-only; it does not implement login, payment, watchlist, alerts, persistence, or member-only content in this refresh.

## Required Checks

- `cmd.exe /c npm run check:phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment`
- `cmd.exe /c npm run check:phase-1-public-beta-public-status-surface-alignment`
- `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup`
- `cmd.exe /c npm run check:a3-phase-1-public-beta-chairman-operator-decision-record`
- `cmd.exe /c npm run check:a3-phase-1-public-beta-manual-platform-action-checklist`
- `cmd.exe /c npm run check:a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup`
- `cmd.exe /c npm run check:phase-1-phase-2-execution-split-and-workflow-assignment`
- `cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams`
- `cmd.exe /c npx tsc --noEmit`

## Stop Lines

This refresh does not authorize:

- platform deploy;
- DNS change;
- production env mutation;
- SQL execution;
- Supabase read/write;
- staging-row creation;
- `daily_prices` mutation;
- raw market-data fetch, ingest, storage, logging, or commit;
- secret or raw payload output;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claim;
- official endorsement claim;
- guaranteed-return claim;
- personalized investment advice;
- buy/sell/hold recommendation;
- Phase 2 membership implementation.

## Next Route

`phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair`

If the evidence remains current and no blocker is found, PM should prepare a concise chairman/operator readiness packet. If any evidence is stale or failing, PM should repair the smallest blocker and rerun the focused checks above.
