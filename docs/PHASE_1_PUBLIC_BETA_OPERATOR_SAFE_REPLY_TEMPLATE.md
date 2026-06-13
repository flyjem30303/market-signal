# Phase 1 Public Beta Operator Safe Reply Template

Status: `phase_1_public_beta_operator_safe_reply_template_ready`

Owner: A3 Launch / PM

Date: 2026-06-13

## Purpose

This template is the safe reply shape for the human/operator after checking Vercel or an equivalent hosting dashboard.

It is designed for copy/paste back to PM without secrets. It records labels, pass/fail outcomes, public route smoke, public-claim smoke, rollback label, and next route only.

It does not deploy, change DNS, mutate production environment variables, run SQL, read or write Supabase, create staging rows, modify `daily_prices`, fetch raw market data, print secrets, promote public data to Supabase, set scores to real, or implement Phase 2 membership.

## Required Upstream Evidence

| Evidence | Required status |
| --- | --- |
| Filled chairman/operator decision | `phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded` |
| No-secret manual platform action readiness | `phase_1_public_beta_no_secret_manual_platform_action_readiness_ready` |
| Manual platform checklist | `a3_phase_1_public_beta_manual_platform_action_checklist_ready` |
| Post-platform action report template | `a3_phase_1_public_beta_post_platform_action_report_template_ready` |
| Monitoring and repair runbook | `a3_phase_1_public_beta_monitoring_and_repair_runbook_ready` |
| Public visible residue cleanup | `phase_1_public_beta_public_visible_residue_cleanup_ready_mock_only` |
| PM BRIEF mainline goal | `pm_brief_runtime_mainline_goal_ready` |

## Safe Reply Block

Operator may fill only the following block:

```text
operatorSafeReplyStatus: ready_for_pm_review
decisionId: phase1-public-beta-chairman-operator-decision-20260613-1
chairmanDecision: GO_WITH_DEFERRALS
platformProjectLabel: <public project label only>
repositoryLabel: <owner/repo label only>
branchLabel: <branch label only>
frameworkPreset: Next.js | other_label
rootDirectoryLabel: repository_root | other_label
buildCommandLabel: npm_run_build_compatible | platform_auto_detected | other_label
installCommandLabel: npm_install_compatible | platform_auto_detected | other_label
nodeVersionLabel: compatible | warning_present | unknown
publicUrl: https://example.vercel.app
deploymentLabel: <non-secret deployment label or pending>
rollbackLabel: <last-known-good deployment label or pending>
envPresence_NEXT_PUBLIC_SITE_URL: present | missing | not_checked
envPresence_NEXT_PUBLIC_DATA_SOURCE: present | missing | platform_default | not_checked
envPresence_DATA_FRESHNESS_SOURCE: present | missing | not_required | not_checked
envPresence_NEXT_PUBLIC_SUPABASE_URL: present | absent | not_required | not_checked
envPresence_NEXT_PUBLIC_SUPABASE_ANON_KEY: present | absent | not_required | not_checked
envPresence_SUPABASE_SERVICE_ROLE_KEY: absent | present_but_not_used | not_checked
envPresence_INTERNAL_DIAGNOSTICS_ENABLED: false_or_absent | protected_enabled | not_checked
envPresence_INTERNAL_DIAGNOSTICS_TOKEN: absent | present_for_protected_diagnostics | not_checked
routeSmokeHome: pass | fail | not_run
routeSmokeBriefing: pass | fail | not_run
routeSmokeWeekly: pass | fail | not_run
routeSmokeMethodology: pass | fail | not_run
routeSmokeDisclaimer: pass | fail | not_run
routeSmokeTerms: pass | fail | not_run
routeSmokePrivacy: pass | fail | not_run
routeSmokeStocksTWII: pass | fail | deliberate_unavailable | not_run
routeSmokeStocks2330: pass | fail | deliberate_unavailable | not_run
routeSmokeStocks0050: pass | fail | deliberate_unavailable | not_run
routeSmokeRobotsTxt: pass | fail | not_run
routeSmokeSitemapXml: pass | fail | not_run
publicClaimSmokeNoSecrets: pass | fail | not_run
publicClaimSmokeNoInternalResidue: pass | fail | not_run
publicClaimSmokeNoLiveOfficialDataClaim: pass | fail | not_run
publicClaimSmokeNoCompleteMarketCoverageClaim: pass | fail | not_run
publicClaimSmokeNoInvestmentAdvice: pass | fail | not_run
publicClaimSmokeNoBuySellHoldRecommendation: pass | fail | not_run
rollbackNeeded: yes | no | not_checked
rollbackPathVisible: yes | no | not_checked
actionTaken: none | preview_deploy | production_deploy | rollback
actionResult: succeeded | failed | rolled_back | not_run
publicDataSource: mock
scoreSource: mock
nextRoute: fill_post_platform_action_report_or_repair_failed_smoke
```

## Do Not Include

The operator reply must not include:

- secret values;
- environment values;
- API keys;
- auth tokens;
- private dashboard URLs;
- private preview URLs with auth query strings;
- screenshots that show environment values;
- full build logs if they may contain private values;
- raw market-data payloads;
- database row payloads;
- local filesystem paths;
- SQL snippets;
- Supabase table row contents;
- user account personal details.

## PM Intake Rule

PM accepts the safe reply only if:

- `operatorSafeReplyStatus` is `ready_for_pm_review`;
- `chairmanDecision` is `GO_WITH_DEFERRALS` or `GO`;
- `publicDataSource` is `mock`;
- `scoreSource` is `mock`;
- no forbidden value-like content is present;
- route smoke and public-claim smoke are either `pass`, `deliberate_unavailable`, or `not_run` with a repair route;
- rollback path is visible before any public Beta remains open.

If any required route or claim smoke fails, PM routes to:

`repair_failed_operator_safe_reply_then_recheck`

## Required Local Checks

Run before using this template:

1. `cmd.exe /c npm run check:phase-1-public-beta-operator-safe-reply-template`
2. `cmd.exe /c npm run check:phase-1-public-beta-no-secret-manual-platform-action-readiness`
3. `cmd.exe /c npm run check:a3-phase-1-public-beta-post-platform-action-report-template`
4. `cmd.exe /c npm run check:a3-phase-1-public-beta-monitoring-and-repair-runbook`
5. `cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams`
6. `cmd.exe /c npx tsc --noEmit`

## Stop Lines

Stop and do not accept the reply if it includes:

- a Supabase service key value;
- a publishable or anon key value;
- a private dashboard URL;
- an auth token;
- SQL execution evidence;
- Supabase read/write evidence;
- staging row creation;
- `daily_prices` mutation;
- raw market data fetch or payload;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- live official market-data claim;
- official endorsement claim;
- guaranteed-return claim;
- personalized investment advice;
- buy/sell/hold recommendation;
- Phase 2 membership implementation.

## Next Route

`fill_post_platform_action_report_or_repair_failed_smoke`
