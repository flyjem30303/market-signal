# Beta Deployment Operator Values Minimal Sheet

Status: `beta_deployment_operator_values_minimal_sheet_ready_not_filled`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `prepare_minimal_operator_values_sheet_before_executable_packet`.

This sheet is the shortest safe intake artifact before a later executable Beta deployment packet. It does not deploy, does not create or mutate a hosting project, does not run a deployment command, does not upload secrets, does not mutate platform environment variables, does not change DNS or SSL, does not connect to Supabase for deployment proof, and does not promote real runtime state.

Current route: `minimal_operator_values_pending_then_executable_packet_candidate`.

## Source Gates

This sheet is grounded in:

- `docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md`
- `docs/BETA_DEPLOYMENT_INTAKE_CHECKLIST.md`
- `docs/BETA_DEPLOYMENT_OPERATOR_FILL_GUIDE.md`
- `docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md`
- `docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md`
- `docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Current protected state:

- Executable packet candidate gate is `beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending`.
- Candidate gate outcome is `blocked_operator_values_pending`.
- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.
- First Beta hosting posture remains `vercel_or_equivalent_managed_nextjs_host`.
- Canonical URL posture remains `platform_preview_or_beta_url_first_custom_domain_later`.
- DNS/CDN posture remains `defer_custom_domain_until_platform_url_passes_beta_health`.
- A2 shared trust surface patch remains `a2_shared_trust_surface_copy_patch_applied_mock_boundary_preserved`.

## Minimal Fill Sheet

| Field group | Field | Current value | Who can fill | Safe value format | Candidate status |
| --- | --- | --- | --- | --- | --- |
| Repo evidence | Deployment source branch | `AUTO_REFRESH_WITH_git_branch_show_current` | PM | branch name only | `repo_refreshable_not_final` |
| Repo evidence | Source commit | `AUTO_REFRESH_WITH_git_rev_parse_short_HEAD` | PM | commit hash only | `repo_refreshable_not_final` |
| Repo evidence | Worktree state | `AUTO_REFRESH_WITH_git_status_short` | PM | clean or reviewed non-empty summary | `repo_refreshable_not_final` |
| Repo evidence | Local proof bundle | `AUTO_REFRESH_WITH_REQUIRED_PROOF_COMMANDS` | PM | passed/blocked summary only | `repo_refreshable_not_final` |
| Platform | Hosting provider | `TBD_PROVIDER_NAME` | PM / I | provider name only | `external_operator_value_pending` |
| Platform | Hosting project name | `TBD_HOSTING_PROJECT_NAME` | PM / I | plain project name only | `external_operator_value_pending` |
| Platform | Temporary Beta URL | `TBD_TEMPORARY_BETA_URL` | PM / I | public URL without secret query string | `external_operator_value_pending` |
| Platform | Exact platform action | `TBD_PLATFORM_ACTION_DESCRIPTION_NO_COMMAND` | PM / I | human-readable action only, no command | `external_operator_value_pending` |
| Canonical URL | Custom domain decision | `DEFER_CUSTOM_DOMAIN_UNTIL_PLATFORM_URL_HEALTH_PASSES` | PM / I | defer text or public domain after health passes | `accepted_defer_value` |
| Env ownership | Environment variable owner | `TBD_ENV_OWNER` | PM / I | role or person name only | `external_operator_value_pending` |
| Secret ownership | Secret input owner | `TBD_SECRET_INPUT_OWNER` | PM / I | role or person name only | `external_operator_value_pending` |
| Secret ownership | Secret handling channel | `TBD_SECRET_HANDLING_CHANNEL` | PM / I | out-of-repo channel name only | `external_operator_value_pending` |
| Runtime boundary | Public data source | `publicDataSource=mock` | PM | must remain mock | `accepted_boundary` |
| Runtime boundary | Score source | `scoreSource=mock` | PM | must remain mock | `accepted_boundary` |
| Rollback | Rollback owner | `TBD_ROLLBACK_OWNER` | I | role or person name only | `external_operator_value_pending` |
| Rollback | Rollback reference | `TBD_ROLLBACK_REFERENCE` | I | prior deployment label or fallback route | `external_operator_value_pending` |
| Incident | Incident owner | `TBD_INCIDENT_OWNER` | PM / I | role or person name only | `external_operator_value_pending` |
| Incident | First-response channel | `TBD_FIRST_RESPONSE_CHANNEL` | PM / I | channel name only, no private tokenized link | `external_operator_value_pending` |
| Incident | Maximum downtime before rollback | `TBD_MAX_DOWNTIME_THRESHOLD` | PM / I | explicit time threshold | `external_operator_value_pending` |
| Post-run review | Review path | `docs/reviews/BETA_DEPLOYMENT_POST_RUN_REVIEW_TBD.md` | PM | repo-relative path | `external_operator_value_pending` |

## Never Fill In Repo

Never write these values into this sheet, another repo document, logs, issue text, screenshots, or commit messages:

- deployment token;
- API token;
- private preview token;
- private dashboard token;
- registrar credential;
- SSL private key;
- env value;
- service role key;
- Supabase secret;
- raw payload;
- row payload;
- stock id payload;
- private invite token;
- payment credential.

If a needed value falls into this list, mark the corresponding field `blocked_external_operator_input_pending`.

## Promotion Rule

PM may promote this sheet toward a later executable packet candidate only when:

1. every `external_operator_value_pending` field is replaced by a safe non-secret value or an accepted defer value;
2. every `repo_refreshable_not_final` field is refreshed in the same execution-packet creation window;
3. no forbidden value is present;
4. `publicDataSource=mock` remains unchanged;
5. `scoreSource=mock` remains unchanged;
6. A2 shared trust surface copy remains accepted and visible;
7. local proof passes;
8. the later artifact is still reviewed as a separate packet before any deployment action.

Until then, the sheet remains `beta_deployment_operator_values_minimal_sheet_ready_not_filled`.

## Required Proof

Before PM accepts a filled version of this sheet, PM must run:

1. `cmd.exe /c npm run check:beta-deployment-operator-values-minimal-sheet`
2. `cmd.exe /c npm run check:beta-deployment-executable-packet-candidate-gate`
3. `cmd.exe /c npm run check:beta-deployment-intake-checklist`
4. `cmd.exe /c npm run check:beta-deployment-operator-fill-guide`
5. `cmd.exe /c npm run check:beta-deployment-operator-input-packet`
6. `cmd.exe /c npm run check:beta-deployment-execution-packet-draft`
7. `cmd.exe /c npm run check:public-route-loop`
8. `cmd.exe /c npm run check:localhost-full-health`
9. `cmd.exe /c npm run check:json`
10. `cmd.exe /c npx tsc --noEmit`
11. `node scripts/check-review-gates.mjs`
12. `git diff --check`
13. `git status --short`

Any failed proof keeps the sheet `needs_bounded_repair` or `blocked`.

## A1 / A2 Coordination

A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`.

A1 must not treat this sheet as source-rights approval, market-data approval, Supabase write approval, `daily_prices` mutation approval, row coverage approval, public source promotion, or score promotion.

A2 next route is `route_local_legal_weekly_methodology_copy_patch_or_beta_deployment_intake_values` only when PM needs another route-level public readability pass.

A2 must preserve mock-only boundary, partial coverage wording, missing/delayed data wording, freshness metadata, model limitation, risk disclosure, and non-investment-advice wording.

## Hard Stops

This sheet does not authorize:

- production deployment;
- preview deployment;
- deployment command execution;
- hosting project creation;
- hosting project mutation;
- DNS change;
- SSL configuration change;
- platform env mutation;
- secret output;
- secret storage action;
- SQL execution;
- Supabase connection for deployment proof;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- raw market-data fetch;
- raw market-data ingest;
- raw market-data storage;
- raw market-data commit;
- raw payload output;
- row payload output;
- stock id payload output;
- row coverage points;
- complete MVP coverage claim;
- Supabase public-source promotion;
- `publicDataSource=supabase`;
- real score promotion;
- `scoreSource=real`;
- investment advice claim;
- public launch completion claim.

## Next Route

The next route is `operator_values_sheet_fill_then_executable_packet_candidate`, not deployment.

If no operator values are available, PM should continue safe local work on route health, public trust copy, promotion readiness, or data-source gates without changing this sheet.

## Verification

Focused verification:

- `node scripts/check-beta-deployment-operator-values-minimal-sheet.mjs`
- `cmd.exe /c npm run check:beta-deployment-operator-values-minimal-sheet`
- `node scripts/check-review-gates.mjs`

Milestone verification should also run JSON validation, TypeScript, route health, localhost full health, and `git diff --check`.
