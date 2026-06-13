# A3 Phase 1 Public Beta Operator Execution Path Runbook

Updated: 2026-06-13

Status: `a3_phase_1_public_beta_operator_execution_path_runbook_ready`

Owner: CEO / PM / A3 Launch

## Purpose

This runbook explains what PM/A3 should do after the chairman/operator decision record is filled.

It converts the decision into one of two bounded routes:

- accepted route: follow the no-secret manual platform action checklist;
- rejected route: repair the narrow blocker and recheck.

This runbook does not deploy production, change DNS, mutate environment variables, execute SQL, write Supabase, fetch market data, print secrets, or promote real data.

## Required Inputs

| Input | Required status |
| --- | --- |
| Chairman/operator decision record | `a3_phase_1_public_beta_chairman_operator_decision_record_ready` |
| Release review summary for chairman | `a3_phase_1_public_beta_release_review_summary_for_chairman_ready` |
| Manual platform action checklist | `a3_phase_1_public_beta_manual_platform_action_checklist_ready` |
| Post-platform action report template | `a3_phase_1_public_beta_post_platform_action_report_template_ready` |
| Monitoring and repair runbook | `a3_phase_1_public_beta_monitoring_and_repair_runbook_ready` |
| Keep-open/repair decision | `phase_1_public_beta_keep_open_or_repair_decision_ready_mock_only` |

## Decision Branch

| Recorded decision | Operator action allowed | Route |
| --- | --- | --- |
| `GO` | yes | `follow_no_secret_manual_platform_action_checklist` |
| `GO_WITH_DEFERRALS` | yes | `follow_no_secret_manual_platform_action_checklist_with_accepted_deferrals` |
| `NO_GO` | no | `repair_phase_1_public_beta_release_blocker` |

## Accepted Route

When the recorded decision is `GO` or `GO_WITH_DEFERRALS`, PM/A3 may prepare the human/operator to follow:

`docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md`

Before the human/operator opens the hosting dashboard, PM/A3 must confirm:

- decision record is filled and current;
- accepted deferrals are recorded;
- hard blockers are `none`;
- `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup` is `status=ok`;
- `cmd.exe /c npx tsc --noEmit` passes;
- build evidence is current or explicitly scheduled for the manual checklist step;
- `publicDataSource` remains `mock`;
- `scoreSource` remains `mock`;
- no secret value will be pasted into chat, docs, screenshots, logs, or repo files.

After the human/operator action, PM/A3 must fill:

`docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md`

Then PM chooses keep-open, repair, or rollback using:

`docs/PHASE_1_PUBLIC_BETA_KEEP_OPEN_OR_REPAIR_DECISION.md`

## Rejected Route

When the recorded decision is `NO_GO`, PM/A3 must not open the hosting dashboard for deploy action.

Instead:

1. Copy the blocker list from `hardBlockers`.
2. Classify each blocker as route, copy, metadata, platform, trust/legal, source/coverage, or stop-line.
3. Assign owner:
   - PM: route/runtime and product comprehension;
   - A1: source/coverage planning, no raw-row fetch or write;
   - A2: trust/legal, non-advice, source/update wording, free/member boundary;
   - A3: platform/readiness/rollback;
   - A4: Phase 2 membership planning only.
4. Patch only the failing surface.
5. Rerun the smallest relevant checks.
6. Reopen the chairman/operator decision record only after the blocker is repaired.

## Minimum Repair Checks

| Blocker type | Minimum checks |
| --- | --- |
| Public wording or residue | `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup`; `cmd.exe /c npm run check:public-visible-language-quality` |
| Public route usability | `cmd.exe /c npm run check:public-surface-user-facing-audit`; `cmd.exe /c npx tsc --noEmit` |
| A3 launch artifact | relevant `check:a3-*` command |
| Decision or release review artifact | `cmd.exe /c npm run check:a3-phase-1-public-beta-chairman-operator-decision-record`; `cmd.exe /c npm run check:a3-phase-1-public-beta-release-review-summary-for-chairman` |
| Any TypeScript/source change | `cmd.exe /c npx tsc --noEmit` |

## Stop Lines

This runbook does not authorize:

- production deploy by itself;
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
- live official market-data claim;
- official endorsement claim;
- guaranteed-return claim;
- personalized investment advice;
- buy/sell/hold recommendation;
- Phase 2 login, payment, watchlist persistence, alert execution, or member-only content as a Phase 1 requirement.

## Next Route

`phase_1_public_beta_operator_action_or_repair_execution_result`

Expected output:

- if accepted: no-secret platform action result and post-platform report;
- if rejected: blocker repair record and recheck result;
- no SQL, no Supabase write, no raw market-data execution, and no real-data promotion.
