# Beta Deployment Execution Packet Draft

Status: `beta_deployment_execution_packet_draft_not_executable`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `draft_beta_deployment_execution_packet_before_operator_inputs_are_filled`.

This draft defines the exact structure of a future public Beta deployment execution packet. It is not executable because `docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md` is still `beta_deployment_operator_input_packet_ready_not_filled`. This draft does not deploy, does not create or mutate a hosting project, does not upload secrets, does not mutate platform environment variables, does not change DNS or SSL, and does not promote public runtime state.

## Source Gates

This draft is grounded in:

- `docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md`
- `docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md`
- `docs/BETA_RELEASE_RUNBOOK_DRAFT.md`
- `docs/BETA_LAUNCH_PREFLIGHT_PACKET.md`
- `docs/PUBLIC_BETA_READINESS_GATE.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Current protected state:

- Operator input packet is `beta_deployment_operator_input_packet_ready_not_filled`.
- Future deployment execution gate is `future_deployment_execution_gate_ready_not_executed`.
- Beta release runbook status is `beta_release_runbook_draft_ready_before_any_deploy`.
- Beta launch preflight status is `beta_launch_preflight_packet_ready_not_deployed`.
- Public Beta readiness outcome is `ready_for_local_public_beta_preflight_not_production_deployed`.
- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.
- Selected first Beta hosting posture remains `vercel_or_equivalent_managed_nextjs_host`.
- Canonical URL posture remains `platform_preview_or_beta_url_first_custom_domain_later`.
- DNS/CDN posture remains `defer_custom_domain_until_platform_url_passes_beta_health`.

## Non-Executable Draft Fields

The future executable packet must replace every `TBD_*` field with a safe non-secret value and keep mock runtime decisions explicit.

| Execution field | Draft value | Required before execution |
| --- | --- | --- |
| Execution status | `NOT_EXECUTABLE_OPERATOR_INPUTS_PENDING` | Must become a later accepted execution packet status |
| Hosting provider | `TBD_PROVIDER_NAME` | Provider name only, no token |
| Hosting project name | `TBD_HOSTING_PROJECT_NAME` | Human-readable hosting project name |
| Deployment source branch | `TBD_SOURCE_BRANCH` | Reviewed branch with clean local status |
| Source commit | `TBD_SOURCE_COMMIT` | Commit hash from a clean worktree |
| Temporary Beta URL | `TBD_TEMPORARY_BETA_URL` | Public URL without query secrets |
| Canonical URL | `DEFER_CUSTOM_DOMAIN_UNTIL_PLATFORM_URL_HEALTH_PASSES` | Custom domain stays deferred unless platform URL health passes |
| Exact platform action | `TBD_PLATFORM_ACTION_DESCRIPTION_NO_COMMAND` | Human-readable action only; no executable command in this draft |
| Environment variable owner | `TBD_ENV_OWNER` | Owner name or role, no env values |
| Secret input owner | `TBD_SECRET_INPUT_OWNER` | Owner name or role, no secret values |
| Public runtime decision | `publicDataSource=mock` | Must stay mock until a separate promotion gate accepts a change |
| Score runtime decision | `scoreSource=mock` | Must stay mock until a separate promotion gate accepts a change |
| Rollback owner | `TBD_ROLLBACK_OWNER` | Owner name or role |
| Rollback reference | `TBD_ROLLBACK_REFERENCE` | Prior deployment reference or fallback route |
| Incident owner | `TBD_INCIDENT_OWNER` | Owner name or role |
| First-response channel | `TBD_FIRST_RESPONSE_CHANNEL` | Channel name only, no private tokenized link |
| Maximum downtime before rollback | `TBD_MAX_DOWNTIME_THRESHOLD` | Explicit time threshold |
| Post-run review path | `docs/reviews/BETA_DEPLOYMENT_POST_RUN_REVIEW_TBD.md` | Repo path for the later review |

## Required Pre-Execution Proof

A later executable packet must include fresh proof for:

1. `cmd.exe /c npm run check:beta-deployment-execution-packet-draft`
2. `cmd.exe /c npm run check:beta-deployment-operator-input-packet`
3. `cmd.exe /c npm run check:future-deployment-execution-gate`
4. `cmd.exe /c npm run check:beta-release-runbook-draft`
5. `cmd.exe /c npm run check:beta-launch-preflight-packet`
6. `cmd.exe /c npm run check:public-route-loop`
7. `cmd.exe /c npm run check:localhost-full-health`
8. `cmd.exe /c npm run check:json`
9. `cmd.exe /c npx tsc --noEmit`
10. `node scripts/check-review-gates.mjs`
11. `git diff --check`
12. `git status --short`

Any failed proof stops deployment execution. Any non-empty worktree must be reviewed by PM before a deployment action is allowed.

## Required Post-Deploy Route Health

A later deployment post-run review must verify:

- `/`
- `/briefing`
- `/weekly`
- `/stocks/2330`
- `/stocks/TWII`
- `/disclaimer`
- `/terms`
- `/privacy`
- `/methodology`

For each route, the review must record:

- HTTP status;
- visible page state;
- no Internal Server Error;
- no diagnostic exposure;
- no secret exposure;
- mock-only boundary visible where relevant;
- trust/legal copy visible where relevant;
- no investment advice claim.

## Required Post-Run Review Outcome

The post-run review must end with exactly one PM outcome:

- `accepted`
- `rejected`
- `needs_bounded_repair`
- `blocked`

The review must also record:

- deployment attempted: `yes` or `no`;
- source commit;
- public URL tested;
- route health summary;
- runtime boundary observed as `publicDataSource=mock`;
- score boundary observed as `scoreSource=mock`;
- rollback status;
- incident status;
- next route.

Any route error, diagnostic leak, secret leak, missing trust boundary, missing mock boundary, or accidental real-source promotion forces `needs_bounded_repair` or `blocked`.

## A1 / A2 Coordination

A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`.

A1 must not treat this draft as data-source approval. TWII and ETF source-rights, field-contract, candidate artifact, bounded execution, post-run review, readback, and scoring gates remain separate.

A2 remains assigned to `beta_phrase_set_and_shared_trust_surface_patch_scope`.

A2 should prioritize route-level public copy that will be inspected after deployment: mock-only boundary, partial coverage, missing/delayed data, freshness, model limitation, risk, non-investment-advice, and issue-reporting language.

## Hard Stops

This draft does not authorize:

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

PM may mark this draft `accepted` only when:

- the draft status remains `beta_deployment_execution_packet_draft_not_executable`;
- operator input dependency remains explicit;
- every required future execution field is present;
- every required pre-execution proof command is listed;
- every post-deploy route health target is listed;
- accepted/rejected/needs_bounded_repair/blocked outcomes are listed;
- mock runtime and score decisions are explicit;
- all hard stops remain visible;
- A1 and A2 assignments remain bounded;
- `scripts/check-beta-deployment-execution-packet-draft.mjs` passes.

The next route is `fill_operator_inputs_then_create_separate_executable_deployment_packet`, not deployment.

## Verification

Focused verification:

- `node scripts/check-beta-deployment-execution-packet-draft.mjs`
- `cmd.exe /c npm run check:beta-deployment-execution-packet-draft`
- `node scripts/check-launch-engineering-workstream-board.mjs`
- `node scripts/check-review-gates.mjs`

Milestone verification should also run JSON validation, TypeScript, route health, localhost full health, and `git diff --check`.
