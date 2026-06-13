# Phase 1 Public Beta No-Secret Manual Platform Action Readiness

Status: `phase_1_public_beta_no_secret_manual_platform_action_readiness_ready`

Owner: A3 Launch / PM

Date: 2026-06-13

## Purpose

This packet is the handoff between the recorded `GO_WITH_DEFERRALS` decision and a future human/operator platform action.

It prepares the operator to open Vercel or an equivalent hosting dashboard and verify launch readiness without exposing secrets or executing platform changes from this repo.

This packet does not deploy, change DNS, mutate production environment variables, run SQL, read or write Supabase, create staging rows, modify `daily_prices`, fetch raw market data, print secrets, promote public data to Supabase, set scores to real, or implement Phase 2 membership.

## Required Upstream Evidence

| Evidence | Required status |
| --- | --- |
| Filled chairman/operator decision | `phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded` |
| Decision readiness packet | `phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair_ready` |
| Manual platform checklist | `a3_phase_1_public_beta_manual_platform_action_checklist_ready` |
| Post-platform action report template | `a3_phase_1_public_beta_post_platform_action_report_template_ready` |
| Monitoring and repair runbook | `a3_phase_1_public_beta_monitoring_and_repair_runbook_ready` |
| Public visible residue cleanup | `phase_1_public_beta_public_visible_residue_cleanup_ready_mock_only` |
| PM BRIEF mainline goal | `pm_brief_runtime_mainline_goal_ready` |

## Operator May Verify

The operator may verify these items by sight inside the hosting dashboard and report only labels or pass/fail outcomes:

| Area | Allowed report | Do not report |
| --- | --- | --- |
| Project | project label matches intended public Beta project | private dashboard URLs, access tokens |
| Git source | repository and branch label match intended public Beta branch | credentials, personal access tokens |
| Framework | Next.js preset is selected or auto-detected | hidden build logs containing secrets |
| Root directory | root is repository root unless later changed | local private paths |
| Build/install commands | compatible with `npm run build` and npm install | tokenized command output |
| Node version | compatible with current Next.js build | private account details |
| Public URL | HTTPS URL without secret query strings | private preview URLs with auth tokens |
| Rollback path | last-known-good deployment label exists | private dashboard screenshots containing values |
| Environment presence | variable names are present or intentionally absent | environment values |

## Required Environment Presence Check

Record names and presence only:

| Name | Required Phase 1 posture |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | present before public launch |
| `NEXT_PUBLIC_DATA_SOURCE` | present or platform default keeps mock-compatible behavior |
| `DATA_FRESHNESS_SOURCE` | present if freshness source label depends on it |
| `NEXT_PUBLIC_SUPABASE_URL` | optional for Phase 1 mock route |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | optional for Phase 1 mock route |
| `SUPABASE_SERVICE_ROLE_KEY` | absent or not used for Phase 1 public mock route |
| `INTERNAL_DIAGNOSTICS_ENABLED` | false or absent unless intentionally protected |
| `INTERNAL_DIAGNOSTICS_TOKEN` | present only if protected diagnostics are intentionally enabled |

## Local Recheck Before Operator Action

Before operator presses any deploy, rerun:

1. `cmd.exe /c npm run check:phase-1-public-beta-no-secret-manual-platform-action-readiness`
2. `cmd.exe /c npm run check:phase-1-public-beta-chairman-operator-decision-2026-06-13`
3. `cmd.exe /c npm run check:a3-phase-1-public-beta-manual-platform-action-checklist`
4. `cmd.exe /c npm run check:a3-phase-1-public-beta-post-platform-action-report-template`
5. `cmd.exe /c npm run check:a3-phase-1-public-beta-monitoring-and-repair-runbook`
6. `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup`
7. `cmd.exe /c npm run check:public-visible-language-quality`
8. `cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams`
9. `cmd.exe /c npx tsc --noEmit`

## Decision If Recheck Fails

If any required check fails, do not proceed to platform action. Route to:

`repair_phase_1_public_beta_blocker_then_recheck`

PM chooses the repair owner:

- A1 for data/source/coverage posture;
- A2 for public copy, source/update, non-advice, or member-boundary wording;
- A3 for platform checklist, smoke, monitoring, rollback, route, metadata, env-presence, or build issues;
- A4 for Phase 2 membership planning only.

## Manual Action Boundary

Even after this readiness packet passes, the actual platform action is still a human/operator dashboard action. The repo does not press deploy or mutate the platform.

After any future platform action, fill:

`docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md`

Then use:

`docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md`

## Stop Lines

Stop immediately before any of the following:

- platform deploy from this repo;
- DNS change;
- production environment variable mutation from this repo;
- printing environment values;
- SQL execution;
- Supabase read/write;
- staging-row creation;
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
- Phase 2 membership implementation as a Phase 1 requirement.

## Next Route

`operator_uses_no_secret_manual_platform_checklist_or_pm_repairs_recheck_failure`
