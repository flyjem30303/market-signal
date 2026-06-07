# Beta Deployment Operator Input Packet

Status: `beta_deployment_operator_input_packet_ready_not_filled`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `prepare_beta_deployment_operator_inputs_not_deploying_now`.

This packet converts `docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md` into the exact non-secret operator inputs that must be filled before a later deployment execution packet. It is intentionally a preparation packet only. It does not deploy, does not create or mutate a hosting project, does not upload secrets, does not mutate platform environment variables, does not change DNS or SSL, and does not promote real runtime state.

## Source Gates

This packet is grounded in:

- `docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md`
- `docs/BETA_RELEASE_RUNBOOK_DRAFT.md`
- `docs/BETA_LAUNCH_PREFLIGHT_PACKET.md`
- `docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md`
- `docs/PUBLIC_BETA_READINESS_GATE.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Current protected state:

- Future deployment execution gate is `future_deployment_execution_gate_ready_not_executed`.
- Beta release runbook status is `beta_release_runbook_draft_ready_before_any_deploy`.
- Beta launch preflight status is `beta_launch_preflight_packet_ready_not_deployed`.
- Public Beta readiness outcome is `ready_for_local_public_beta_preflight_not_production_deployed`.
- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.
- Selected first Beta hosting posture remains `vercel_or_equivalent_managed_nextjs_host`.
- Canonical URL posture remains `platform_preview_or_beta_url_first_custom_domain_later`.
- DNS/CDN posture remains `defer_custom_domain_until_platform_url_passes_beta_health`.
- TW equity closed loop is accepted at `180/180`.
- Full Level 1 MVP coverage remains `182/360`.
- TWII remains `0/60`.
- ETF remains `2/120`.

## Operator Input Form

All values below are placeholders. They must be replaced in a later reviewed execution packet before any real deploy action.

| Input item | Required value shape | Current packet value | Owner | Stop line |
| --- | --- | --- | --- | --- |
| Hosting provider | Provider name only, no token or command | `TBD_PROVIDER_NAME` | PM / I | Missing provider blocks deploy execution |
| Hosting project name | Human-readable project name only | `TBD_HOSTING_PROJECT_NAME` | PM / I | Missing project name blocks deploy execution |
| Deployment source branch | Branch name or reviewed release branch | `TBD_SOURCE_BRANCH` | PM | Dirty or unreviewed source blocks deploy execution |
| Source commit | Commit hash only | `TBD_SOURCE_COMMIT` | PM | Missing commit blocks deploy execution |
| Temporary Beta URL | Public URL without query secrets | `TBD_TEMPORARY_BETA_URL` | PM / I | Missing URL blocks post-deploy route health |
| Canonical URL | URL or explicit deferred decision | `DEFER_CUSTOM_DOMAIN_UNTIL_PLATFORM_URL_HEALTH_PASSES` | PM / I | Custom domain cannot proceed before platform URL health passes |
| Environment variable owner | Person or role, no env values | `TBD_ENV_OWNER` | PM / I | Unknown owner blocks deploy execution |
| Secret input owner | Person or role, no secret values | `TBD_SECRET_INPUT_OWNER` | PM / I | Unknown owner blocks deploy execution |
| Runtime source decision | Must remain mock for this packet | `publicDataSource=mock` | PM | Any real-source promotion requires a separate promotion gate |
| Score source decision | Must remain mock for this packet | `scoreSource=mock` | PM | Any real-score promotion requires a separate promotion gate |
| Rollback owner | Person or role | `TBD_ROLLBACK_OWNER` | I | Unknown owner blocks public announcement |
| Rollback reference | Prior deployment reference or fallback route | `TBD_ROLLBACK_REFERENCE` | I | Missing reference blocks deploy execution |
| Incident owner | Person or role | `TBD_INCIDENT_OWNER` | PM / I | Unknown owner blocks public announcement |
| First-response channel | Channel name only, no private link token | `TBD_FIRST_RESPONSE_CHANNEL` | PM / I | Missing channel blocks public announcement |
| Maximum downtime before rollback | Time threshold | `TBD_MAX_DOWNTIME_THRESHOLD` | PM / I | Missing threshold blocks public announcement |
| Post-deploy review path | Repo path for later post-run review | `docs/reviews/BETA_DEPLOYMENT_POST_RUN_REVIEW_TBD.md` | PM | Missing review path blocks deploy execution |

## Local Proof Required Before Filling

Before PM turns this packet into an executable deployment packet, PM must run or cite fresh passing proof for:

1. `cmd.exe /c npm run check:beta-deployment-operator-input-packet`
2. `cmd.exe /c npm run check:future-deployment-execution-gate`
3. `cmd.exe /c npm run check:beta-release-runbook-draft`
4. `cmd.exe /c npm run check:beta-launch-preflight-packet`
5. `cmd.exe /c npm run check:public-route-loop`
6. `cmd.exe /c npm run check:localhost-full-health`
7. `cmd.exe /c npm run check:json`
8. `cmd.exe /c npx tsc --noEmit`
9. `node scripts/check-review-gates.mjs`
10. `git diff --check`
11. `git status --short`

Any failed proof stops conversion to a real deployment execution packet.

## Post-Deploy Route Health Targets

A later execution packet must verify these public routes after deployment:

- `/`
- `/briefing`
- `/weekly`
- `/stocks/2330`
- `/stocks/TWII`
- `/disclaimer`
- `/terms`
- `/privacy`
- `/methodology`

Route health must record HTTP status, visible page state, mock-only boundary visibility, trust copy visibility, and absence of diagnostic or secret exposure.

## A1 / A2 Coordination

A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`.

A1 must continue source-rights and market evidence work independently from deployment prep. This packet does not approve TWII probe, ETF probe, raw market-data fetch, candidate generation, storage, `daily_prices` mutation, row coverage points, public source promotion, or real score promotion.

A2 remains assigned to `beta_phrase_set_and_shared_trust_surface_patch_scope`.

A2 should use this packet to prioritize route-level copy that must be visible after deployment: mock-only boundary, partial coverage, missing or delayed data, freshness, model limitation, risk, non-investment-advice, and contact/issue reporting language.

## Hard Stops

This packet does not authorize:

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

## Acceptance Criteria

PM may mark this packet `accepted` only when:

- all required non-secret input fields are present as explicit placeholders or safe filled values;
- no secret value, token, raw payload, row payload, or stock id payload appears;
- mock runtime and mock score decisions are explicit;
- all hard stops remain visible;
- post-deploy route health targets are listed;
- local proof commands are listed;
- A1 and A2 assignments remain bounded;
- `scripts/check-beta-deployment-operator-input-packet.mjs` passes.

The current status is `beta_deployment_operator_input_packet_ready_not_filled`, not deployment ready.

## Verification

Focused verification:

- `node scripts/check-beta-deployment-operator-input-packet.mjs`
- `cmd.exe /c npm run check:beta-deployment-operator-input-packet`
- `node scripts/check-launch-engineering-workstream-board.mjs`
- `node scripts/check-review-gates.mjs`

Milestone verification should also run JSON validation, TypeScript, route health, localhost full health, and `git diff --check` before any later deployment execution packet.
