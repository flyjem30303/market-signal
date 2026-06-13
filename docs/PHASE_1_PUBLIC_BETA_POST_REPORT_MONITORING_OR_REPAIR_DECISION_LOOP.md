# Phase 1 Public Beta Post-Report Monitoring Or Repair Decision Loop

Updated: 2026-06-13

Status: `phase_1_public_beta_post_report_monitoring_or_repair_decision_loop_ready`

Owner: PM mainline / A3 Launch

## Purpose

This decision loop starts after the post-platform report has been filled from a no-secret operator safe reply.

It tells PM whether Phase 1 public Beta can stay open with deferrals, must enter bounded repair, or must roll back / no-go.

It does not execute deploy, change DNS, mutate environment variables, run SQL, read or write Supabase, create staging rows, modify `daily_prices`, fetch or store raw market data, print secrets, promote `publicDataSource=supabase`, promote `scoreSource=real`, implement login, implement watchlist persistence, execute alerts, or publish member-only content.

## Required Upstream Statuses

| Upstream artifact | Required status |
| --- | --- |
| Post-platform report filled-placeholder or repair scaffold | `phase_1_public_beta_post_platform_report_filled_placeholder_or_repair_scaffold_ready` |
| Operator safe reply PM intake recorder | `phase_1_public_beta_operator_safe_reply_pm_intake_recorder_ready` |
| A3 post-platform action report template | `a3_phase_1_public_beta_post_platform_action_report_template_ready` |
| A3 monitoring and repair runbook | `a3_phase_1_public_beta_monitoring_and_repair_runbook_ready` |
| A3 keep-open/repair/no-go rollup | `a3_phase_1_public_beta_keep_open_repair_or_no_go_result_rollup_ready` |
| Phase 1 / Phase 2 execution split | `phase_1_phase_2_execution_split_ready` |
| PM BRIEF runtime mainline goal | `pm_brief_runtime_mainline_goal_ready` |

## Decision Inputs

PM reads only no-secret summary values from the post-platform report:

| Field | Allowed values |
| --- | --- |
| `reportFillStatus` | `READY_TO_FILL_FROM_SAFE_REPLY`, `REPAIR_REQUIRED`, `REJECT_UNSAFE_REPLY` |
| `routeSmokeSummary` | `pass`, `fail`, `not_run` |
| `publicClaimSmokeSummary` | `pass`, `fail`, `not_run` |
| `rollbackLabel` | non-secret label or `pending` |
| `publicDataSource` | `mock` |
| `scoreSource` | `mock` |
| `remainingHardBlockers` | `none` or no-secret blocker list |
| `acceptedDeferrals` | Phase 2 membership; real-data promotion; full Taiwan all-listed-equity coverage; global expansion; custom domain; paid vendor feeds; complete source automation |

## Decision Outcomes

| Outcome | Condition | PM action |
| --- | --- | --- |
| `KEEP_OPEN_WITH_DEFERRALS` | `routeSmokeSummary=pass`, `publicClaimSmokeSummary=pass`, `publicDataSource=mock`, `scoreSource=mock`, `remainingHardBlockers=none` | Start monitoring cadence and keep Phase 2/data/global deferrals explicit. |
| `REPAIR_THEN_RECHECK` | route or public claim is `fail`, report is incomplete, rollback label is missing but no P0 exposure exists | Send to the owner-specific repair queue and rerun the smallest relevant checks. |
| `ROLLBACK_OR_NO_GO` | P0 route outage, trust route unavailable, secret/internal exposure, live official data claim, investment-advice implication, wrong branch deploy, repeated 5xx, or unsafe reply content | Close or roll back the public Beta route and repair before reopening. |
| `NOT_RUN` | operator action/report has not happened yet | Stay in no-secret readiness mode; do not invent platform results. |

## Owner-Specific Repair Queue

| Repair type | Owner | Minimum local checks |
| --- | --- | --- |
| Route unavailable, repeated 5xx, metadata/share preview, robots/sitemap, rollback label | A3 | `cmd.exe /c npm run check:a3-phase-1-metadata-and-public-route-smoke-checker`; `cmd.exe /c npm run check:a3-phase-1-public-beta-monitoring-and-repair-runbook`; `cmd.exe /c npx tsc --noEmit` |
| Misleading source/update/coverage/member/free boundary, live-data implication, investment-advice implication | A2 | `cmd.exe /c npm run check:public-visible-language-quality`; `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup`; `cmd.exe /c npm run check:public-surface-user-facing-audit` |
| PM intake mismatch, wrong posture, incomplete safe fields, decision alignment | PM | `cmd.exe /c npm run check:phase-1-public-beta-operator-safe-reply-pm-intake-recorder`; `cmd.exe /c npm run check:phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold`; `cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams` |
| Data/source blocker that affects only future real-data promotion | A1 | Keep as accepted deferral; do not block Phase 1 unless public copy claims formal data is live. |
| Membership/watchlist/alerts/member content blocker | A4 | Keep as Phase 2 deferral; do not block Phase 1 unless public page promises the feature is available now. |

## Monitoring Cadence To Start After Keep-Open

| Window | Owner | Action |
| --- | --- | --- |
| First 15 minutes | A3 | Confirm Home, `/briefing`, trust routes, and rollback path stay reachable. |
| First 60 minutes | PM + A3 | Confirm 30-second market mood and 3-minute action path remain understandable. |
| First 24 hours | PM + A2 | Confirm source/update delay, mock boundary, free/member boundary, and non-advice copy are still clear. |
| Every business day during public Beta | PM | Record route health, public claim smoke, and accepted deferrals. |
| Weekly during public Beta | CEO + PM | Decide continue, repair, or widen scope toward Phase 2 / data promotion. |

## Public Beta Keep-Open Record Shape

```text
postReportDecisionStatus: KEEP_OPEN_WITH_DEFERRALS | REPAIR_THEN_RECHECK | ROLLBACK_OR_NO_GO | NOT_RUN
reportId: phase1-public-beta-platform-action-YYYYMMDD-N
routeSmokeSummary: pass | fail | not_run
publicClaimSmokeSummary: pass | fail | not_run
publicDataSource: mock
scoreSource: mock
acceptedDeferrals: Phase 2 membership; real-data promotion; full Taiwan all-listed-equity coverage; global expansion; custom domain; paid vendor feeds; complete source automation
repairOwner: none | PM | A1 | A2 | A3 | A4
repairReason: none | route_smoke_failed | public_claim_failed | rollback_missing | incomplete_reply | wrong_data_posture | wrong_score_posture | unsafe_content | phase_2_deferral_only | data_promotion_deferral_only
nextRoute: keep_open_monitoring_cadence | repair_then_recheck_post_report_decision_loop | rollback_or_no_go_until_repaired | wait_for_operator_safe_reply
```

## Required Local Checks

Run these after editing this loop or related Phase 1 launch-operation artifacts:

1. `cmd.exe /c npm run check:phase-1-public-beta-post-report-monitoring-or-repair-decision-loop`
2. `cmd.exe /c npm run check:phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold`
3. `cmd.exe /c npm run check:a3-phase-1-public-beta-monitoring-and-repair-runbook`
4. `cmd.exe /c npm run check:a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup`
5. `cmd.exe /c npm run check:phase-1-phase-2-execution-split-and-workflow-assignment`
6. `cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams`
7. `cmd.exe /c npx tsc --noEmit`

## Stop Lines

This loop does not authorize:

- SQL execution;
- Supabase read/write;
- staging-row creation;
- `daily_prices` mutation;
- raw market-data fetch, ingest, storage, logging, or commit;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- live official market-data claim;
- official endorsement claim;
- guaranteed-return claim;
- personalized investment advice;
- buy/sell/hold recommendation;
- Phase 2 login, payment, watchlist persistence, alert execution, or member-only content as a Phase 1 requirement.

## Next Route

`keep_open_monitoring_cadence_or_repair_then_recheck_phase_1_public_beta`

Expected PM behavior:

- do not claim public Beta is open until a real post-platform report exists;
- keep mock/source boundaries visible and truthful;
- start monitoring only after route and public-claim smoke pass;
- route failures to the smallest owner-specific repair loop;
- keep data promotion and membership MVP moving in A1/A4 lanes without blocking the Phase 1 public free site.
