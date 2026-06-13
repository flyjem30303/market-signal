# Phase 1 Public Beta Operator Safe Reply PM Intake Recorder

Status: `phase_1_public_beta_operator_safe_reply_pm_intake_recorder_ready`

Owner: PM / A3 Launch

Date: 2026-06-13

## Purpose

This recorder defines how PM reviews an operator safe reply after a future Vercel or equivalent hosting-dashboard check.

It classifies the reply as `ACCEPT_FOR_POST_PLATFORM_REPORT`, `REPAIR_REQUIRED`, or `REJECT_UNSAFE_REPLY`.

It does not deploy, change DNS, mutate production environment variables, run SQL, read or write Supabase, create staging rows, modify `daily_prices`, fetch raw market data, print secrets, promote public data to Supabase, set scores to real, or implement Phase 2 membership.

## Required Upstream Evidence

| Evidence | Required status |
| --- | --- |
| Operator safe reply template | `phase_1_public_beta_operator_safe_reply_template_ready` |
| No-secret manual platform action readiness | `phase_1_public_beta_no_secret_manual_platform_action_readiness_ready` |
| Filled chairman/operator decision | `phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded` |
| Post-platform action report template | `a3_phase_1_public_beta_post_platform_action_report_template_ready` |
| Monitoring and repair runbook | `a3_phase_1_public_beta_monitoring_and_repair_runbook_ready` |
| PM BRIEF mainline goal | `pm_brief_runtime_mainline_goal_ready` |

## Intake Record Shape

PM records only this shape:

```text
pmIntakeStatus: ACCEPT_FOR_POST_PLATFORM_REPORT | REPAIR_REQUIRED | REJECT_UNSAFE_REPLY
sourceReplyStatus: ready_for_pm_review | incomplete | unsafe
decisionId: phase1-public-beta-chairman-operator-decision-20260613-1
chairmanDecision: GO_WITH_DEFERRALS | GO | NO_GO | missing
safeFieldCompleteness: complete | incomplete
forbiddenContentDetected: yes | no
routeSmokeSummary: pass | repair_required | not_run
publicClaimSmokeSummary: pass | repair_required | not_run
rollbackPathStatus: visible | missing | not_checked
actionResultSummary: succeeded | failed | rolled_back | not_run
publicDataSource: mock
scoreSource: mock
repairOwner: none | PM | A2 | A3 | A1 | A4
repairReason: none | route_smoke_failed | public_claim_failed | rollback_missing | unsafe_content | incomplete_reply | wrong_decision | wrong_data_posture | wrong_score_posture
nextRoute: fill_post_platform_action_report | repair_failed_operator_safe_reply_then_recheck | reject_and_request_safe_reply_again
```

## Accept Conditions

Use `ACCEPT_FOR_POST_PLATFORM_REPORT` only if all conditions are true:

- `sourceReplyStatus` is `ready_for_pm_review`;
- `chairmanDecision` is `GO_WITH_DEFERRALS` or `GO`;
- `safeFieldCompleteness` is `complete`;
- `forbiddenContentDetected` is `no`;
- `publicDataSource` is `mock`;
- `scoreSource` is `mock`;
- `routeSmokeSummary` is `pass`, or route smoke is `not_run` only because no platform action happened;
- `publicClaimSmokeSummary` is `pass`, or claim smoke is `not_run` only because no platform action happened;
- `rollbackPathStatus` is `visible` before public Beta remains open;
- `nextRoute` is `fill_post_platform_action_report`.

## Repair Conditions

Use `REPAIR_REQUIRED` when the reply is safe but incomplete or reveals a bounded operational issue:

| Condition | repairOwner | repairReason |
| --- | --- | --- |
| A public route smoke fails | `A3` | `route_smoke_failed` |
| Public claim smoke fails | `A2` | `public_claim_failed` |
| Rollback path is missing | `A3` | `rollback_missing` |
| Required safe field is missing | `PM` | `incomplete_reply` |
| Data posture is not `mock` | `PM` | `wrong_data_posture` |
| Score posture is not `mock` | `PM` | `wrong_score_posture` |

Repair route:

`repair_failed_operator_safe_reply_then_recheck`

## Reject Conditions

Use `REJECT_UNSAFE_REPLY` if the reply contains any forbidden content:

- secret values;
- environment values;
- API keys;
- auth tokens;
- private dashboard URLs;
- private preview URLs with auth query strings;
- screenshots containing environment values;
- raw market-data payloads;
- database row payloads;
- SQL snippets;
- Supabase table row contents;
- local filesystem paths;
- user account personal details;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- live official market-data claim;
- official endorsement claim;
- guaranteed-return claim;
- personalized investment advice;
- buy/sell/hold recommendation.

Reject route:

`reject_and_request_safe_reply_again`

## PM Conversion To Post-Platform Report

If the intake status is `ACCEPT_FOR_POST_PLATFORM_REPORT`, PM may use the safe reply to fill:

`docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md`

PM must still keep values no-secret:

- copy public URL only if it has no secret query string;
- copy deployment label only if it is non-secret;
- copy rollback label only if it is non-secret;
- summarize route smoke and public-claim smoke as pass/fail;
- keep `publicDataSource=mock`;
- keep `scoreSource=mock`.

## Required Local Checks

Run before using this recorder:

1. `cmd.exe /c npm run check:phase-1-public-beta-operator-safe-reply-pm-intake-recorder`
2. `cmd.exe /c npm run check:phase-1-public-beta-operator-safe-reply-template`
3. `cmd.exe /c npm run check:phase-1-public-beta-no-secret-manual-platform-action-readiness`
4. `cmd.exe /c npm run check:a3-phase-1-public-beta-post-platform-action-report-template`
5. `cmd.exe /c npm run check:a3-phase-1-public-beta-monitoring-and-repair-runbook`
6. `cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams`
7. `cmd.exe /c npx tsc --noEmit`

## Stop Lines

This recorder does not accept or authorize:

- platform deploy from this repo;
- DNS change;
- production env mutation from this repo;
- secret output;
- environment value output;
- SQL execution;
- Supabase read/write;
- staging-row creation;
- `daily_prices` mutation;
- raw market data fetch, storage, logging, or commit;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time official market-data claim;
- official endorsement claim;
- guaranteed-return claim;
- personalized investment advice;
- buy/sell/hold recommendation;
- Phase 2 membership implementation.

## Next Route

`fill_post_platform_action_report_or_repair_failed_operator_intake`
