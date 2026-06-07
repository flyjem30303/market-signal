# Beta Deployment Intake Checklist

Status: `beta_deployment_intake_checklist_ready_not_filled`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `prepare_beta_deployment_intake_checklist_before_operator_values`.

This checklist turns `docs/BETA_DEPLOYMENT_OPERATOR_FILL_GUIDE.md` into a fillable, non-secret intake checklist for the chairman, PM, and launch operator. It does not fill deployment values, does not deploy, does not create or mutate a hosting project, does not upload secrets, does not mutate platform environment variables, does not change DNS or SSL, and does not promote real runtime state.

## Source Gates

This checklist is grounded in:

- `docs/BETA_DEPLOYMENT_OPERATOR_FILL_GUIDE.md`
- `docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md`
- `docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md`
- `docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md`
- `docs/BETA_LAUNCH_PREFLIGHT_PACKET.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Current protected state:

- Operator fill guide is `beta_deployment_operator_fill_guide_ready_not_filled`.
- Operator input packet is `beta_deployment_operator_input_packet_ready_not_filled`.
- Deployment execution packet draft is `beta_deployment_execution_packet_draft_not_executable`.
- Future deployment execution gate is `future_deployment_execution_gate_ready_not_executed`.
- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.
- Selected first Beta hosting posture remains `vercel_or_equivalent_managed_nextjs_host`.
- Canonical URL posture remains `platform_preview_or_beta_url_first_custom_domain_later`.
- DNS/CDN posture remains `defer_custom_domain_until_platform_url_passes_beta_health`.

## Intake Rule

Fill only safe non-secret values. If a field requires a secret, private token, private preview link, account credential, payment action, DNS action, or external legal/source-rights approval, mark the field `blocked_external_operator_input_pending` and stop that action.

## Platform Intake

| Intake item | Current value | Safe answer format | Owner | Review status |
| --- | --- | --- | --- | --- |
| Hosting provider | `TBD_PROVIDER_NAME` | provider name only, such as Vercel or equivalent | PM / I | `not_filled` |
| Hosting project name | `TBD_HOSTING_PROJECT_NAME` | plain project name only | PM / I | `not_filled` |
| Temporary Beta URL | `TBD_TEMPORARY_BETA_URL` | public URL without secret query string | PM / I | `not_filled` |
| Canonical URL decision | `DEFER_CUSTOM_DOMAIN_UNTIL_PLATFORM_URL_HEALTH_PASSES` | keep deferred or write public domain only after platform health passes | PM / I | `deferred` |
| Exact platform action description | `TBD_PLATFORM_ACTION_DESCRIPTION_NO_COMMAND` | human-readable action description only | PM / I | `not_filled` |

## Git And Source Intake

| Intake item | Current value | Safe answer format | Owner | Review status |
| --- | --- | --- | --- | --- |
| Deployment source branch | `TBD_SOURCE_BRANCH` | branch name only | PM | `not_filled` |
| Source commit | `TBD_SOURCE_COMMIT` | commit hash only | PM | `not_filled` |
| Worktree state | `TBD_GIT_STATUS_SHORT_RESULT` | clean or reviewed non-empty status summary | PM | `not_filled` |
| Release proof bundle | `TBD_LOCAL_PROOF_BUNDLE_RESULT` | passed/blocked summary without raw logs containing secrets | PM | `not_filled` |

## Env And Secret Ownership Intake

| Intake item | Current value | Safe answer format | Owner | Review status |
| --- | --- | --- | --- | --- |
| Environment variable owner | `TBD_ENV_OWNER` | person or role name only | PM / I | `not_filled` |
| Secret input owner | `TBD_SECRET_INPUT_OWNER` | person or role name only | PM / I | `not_filled` |
| Secret handling channel | `TBD_SECRET_HANDLING_CHANNEL` | out-of-repo channel name only | PM / I | `not_filled` |
| Env mutation status | `NOT_AUTHORIZED_BY_THIS_CHECKLIST` | must stay not authorized until a later executable packet | PM / I | `not_authorized` |

## Rollback And Incident Intake

| Intake item | Current value | Safe answer format | Owner | Review status |
| --- | --- | --- | --- | --- |
| Rollback owner | `TBD_ROLLBACK_OWNER` | person or role name only | I | `not_filled` |
| Rollback reference | `TBD_ROLLBACK_REFERENCE` | prior deployment label or fallback route, no private token | I | `not_filled` |
| Incident owner | `TBD_INCIDENT_OWNER` | person or role name only | PM / I | `not_filled` |
| First-response channel | `TBD_FIRST_RESPONSE_CHANNEL` | channel name only, no private invite token | PM / I | `not_filled` |
| Maximum downtime before rollback | `TBD_MAX_DOWNTIME_THRESHOLD` | explicit time threshold | PM / I | `not_filled` |

## Public Trust And Route Intake

| Intake item | Current value | Safe answer format | Owner | Review status |
| --- | --- | --- | --- | --- |
| Public runtime decision | `publicDataSource=mock` | must remain mock | PM | `accepted_boundary` |
| Score runtime decision | `scoreSource=mock` | must remain mock | PM | `accepted_boundary` |
| Post-run review path | `docs/reviews/BETA_DEPLOYMENT_POST_RUN_REVIEW_TBD.md` | repo-relative review path | PM | `not_filled` |
| A2 route copy QA owner | `beta_phrase_set_and_shared_trust_surface_patch_scope` | A2 assignment label | PM / A2 | `assigned` |
| Route health target set | `/`, `/briefing`, `/weekly`, `/stocks/2330`, `/stocks/TWII`, `/disclaimer`, `/terms`, `/privacy`, `/methodology` | public routes only | PM / A2 | `accepted_targets` |

## Required Local Proof Before Intake Acceptance

Before PM accepts a filled intake checklist, PM must run:

1. `cmd.exe /c npm run check:beta-deployment-intake-checklist`
2. `cmd.exe /c npm run check:beta-deployment-operator-fill-guide`
3. `cmd.exe /c npm run check:beta-deployment-operator-input-packet`
4. `cmd.exe /c npm run check:beta-deployment-execution-packet-draft`
5. `cmd.exe /c npm run check:public-route-loop`
6. `cmd.exe /c npm run check:localhost-full-health`
7. `cmd.exe /c npm run check:json`
8. `cmd.exe /c npx tsc --noEmit`
9. `node scripts/check-review-gates.mjs`
10. `git diff --check`
11. `git status --short`

Any failed proof keeps the checklist `needs_bounded_repair` or `blocked`.

## A1 / A2 Coordination

A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`.

A1 must not treat this checklist as TWII or ETF source approval, row coverage approval, raw market-data approval, `daily_prices` mutation approval, public source promotion, or real score promotion.

A2 remains assigned to `beta_phrase_set_and_shared_trust_surface_patch_scope`.

A2 may use this checklist to prepare deployment-aftercare route checks and trust-copy placement, but A2 must not capture secrets, private preview tokens, raw payloads, row payloads, or stock id payloads.

## Hard Stops

This checklist does not authorize:

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

The next route is `operator_intake_values_pending_then_executable_packet_candidate`.

If the chairman or launch operator provides safe values later, PM should classify each field as `accepted`, `rejected`, `needs_bounded_repair`, or `blocked`. PM may then create a separate executable deployment packet candidate only after every required value is accepted and proof passes.

## Verification

Focused verification:

- `node scripts/check-beta-deployment-intake-checklist.mjs`
- `cmd.exe /c npm run check:beta-deployment-intake-checklist`
- `node scripts/check-launch-engineering-workstream-board.mjs`
- `node scripts/check-review-gates.mjs`

Milestone verification should also run JSON validation, TypeScript, route health, localhost full health, and `git diff --check`.
