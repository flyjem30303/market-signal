# Beta Deployment Operator Fill Guide

Status: `beta_deployment_operator_fill_guide_ready_not_filled`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `prepare_operator_fill_steps_before_executable_deployment_packet`.

This guide explains how PM and the launch operator should safely fill `docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md` before creating a later executable deployment packet. It does not fill the values, does not deploy, does not create or mutate a hosting project, does not upload secrets, does not mutate platform environment variables, does not change DNS or SSL, and does not promote real runtime state.

## Source Gates

This guide is grounded in:

- `docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md`
- `docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md`
- `docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md`
- `docs/BETA_RELEASE_RUNBOOK_DRAFT.md`
- `docs/BETA_LAUNCH_PREFLIGHT_PACKET.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Current protected state:

- Operator input packet is `beta_deployment_operator_input_packet_ready_not_filled`.
- Deployment execution packet draft is `beta_deployment_execution_packet_draft_not_executable`.
- Future deployment execution gate is `future_deployment_execution_gate_ready_not_executed`.
- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.
- Selected first Beta hosting posture remains `vercel_or_equivalent_managed_nextjs_host`.
- Canonical URL posture remains `platform_preview_or_beta_url_first_custom_domain_later`.
- DNS/CDN posture remains `defer_custom_domain_until_platform_url_passes_beta_health`.

## Fill Sequence

PM should fill the operator inputs in this order:

1. Choose hosting provider and hosting project name.
2. Confirm deployment source branch and source commit from a clean worktree.
3. Record temporary Beta URL after the platform project exists.
4. Keep canonical URL deferred until platform URL health passes.
5. Name env owner and secret input owner without recording any env values.
6. Keep runtime source decision at `publicDataSource=mock`.
7. Keep score source decision at `scoreSource=mock`.
8. Name rollback owner and rollback reference.
9. Name incident owner, first-response channel, and downtime threshold.
10. Create the later post-run review path.
11. Run the required local proof commands.
12. Create a separate executable deployment packet only after all non-secret fields are safely filled.

## Field Fill Rules

| Field | Safe source | Safe repo value | Never write |
| --- | --- | --- | --- |
| `TBD_PROVIDER_NAME` | Hosting dashboard vendor label | `vercel`, `netlify`, or equivalent provider name | access token, API token, account secret |
| `TBD_HOSTING_PROJECT_NAME` | Hosting dashboard project title | plain project name | project token, private dashboard URL with token |
| `TBD_SOURCE_BRANCH` | Git branch selected by PM | branch name only | unreviewed branch, local absolute path |
| `TBD_SOURCE_COMMIT` | `git log -1 --oneline` after clean worktree | commit hash only | patch content, secret-bearing diff |
| `TBD_TEMPORARY_BETA_URL` | Hosting generated public preview/Beta URL | public URL without secret query string | private preview token, invite token, auth token |
| `DEFER_CUSTOM_DOMAIN_UNTIL_PLATFORM_URL_HEALTH_PASSES` | PM launch decision | leave as defer text until platform health passes | DNS token, registrar login, SSL private key |
| `TBD_ENV_OWNER` | PM/I owner decision | person or role name | env value, `.env.local` content |
| `TBD_SECRET_INPUT_OWNER` | PM/I owner decision | person or role name | secret value, service role key, publishable key |
| `TBD_ROLLBACK_OWNER` | PM/I owner decision | person or role name | platform token |
| `TBD_ROLLBACK_REFERENCE` | Hosting deployment history | prior deployment label or fallback route | private rollback link with token |
| `TBD_INCIDENT_OWNER` | PM/I owner decision | person or role name | private phone, private account credential |
| `TBD_FIRST_RESPONSE_CHANNEL` | PM/I owner decision | channel name | private invite token, tokenized chat URL |
| `TBD_MAX_DOWNTIME_THRESHOLD` | PM/I owner decision | explicit time threshold | vague wording such as soon or later |
| `docs/reviews/BETA_DEPLOYMENT_POST_RUN_REVIEW_TBD.md` | PM review naming | repo-relative review path | external private doc URL with token |

## Fill Acceptance Rules

PM can accept a filled operator input packet only when:

- every `TBD_*` value has either a safe non-secret replacement or an explicit deferred value;
- no secret, token, raw payload, row payload, stock id payload, private dashboard token, private preview token, or env value is present;
- `publicDataSource=mock` remains unchanged;
- `scoreSource=mock` remains unchanged;
- the canonical URL remains deferred until platform URL health passes;
- rollback owner and rollback reference are present;
- incident owner, first-response channel, and downtime threshold are present;
- local proof commands are fresh and passing;
- the next artifact is a separate executable deployment packet, not direct deployment.

## Required Proof After Filling

After filling safe values and before creating an executable packet, PM must run:

1. `cmd.exe /c npm run check:beta-deployment-operator-fill-guide`
2. `cmd.exe /c npm run check:beta-deployment-operator-input-packet`
3. `cmd.exe /c npm run check:beta-deployment-execution-packet-draft`
4. `cmd.exe /c npm run check:future-deployment-execution-gate`
5. `cmd.exe /c npm run check:public-route-loop`
6. `cmd.exe /c npm run check:localhost-full-health`
7. `cmd.exe /c npm run check:json`
8. `cmd.exe /c npx tsc --noEmit`
9. `node scripts/check-review-gates.mjs`
10. `git diff --check`
11. `git status --short`

Any failed proof stops execution packet creation.

## A1 / A2 Coordination

A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`.

A1 must not treat filled deployment operator inputs as data-source approval. TWII and ETF source-rights, field-contract, candidate artifact, bounded execution, post-run review, readback, and scoring gates remain separate.

A2 remains assigned to `beta_phrase_set_and_shared_trust_surface_patch_scope`.

A2 should use the final temporary Beta URL only for route-level readability and trust-copy QA after PM authorizes that route check. A2 must not capture secrets, private preview tokens, raw payloads, row payloads, or stock id payloads.

## Hard Stops

This guide does not authorize:

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

The next route is `fill_operator_inputs_safely_then_create_executable_packet`.

If any required safe value cannot be found without exposing a secret or private token, PM must stop that field as `blocked_external_operator_input_pending` and continue other safe local work.

## Verification

Focused verification:

- `node scripts/check-beta-deployment-operator-fill-guide.mjs`
- `cmd.exe /c npm run check:beta-deployment-operator-fill-guide`
- `node scripts/check-launch-engineering-workstream-board.mjs`
- `node scripts/check-review-gates.mjs`

Milestone verification should also run JSON validation, TypeScript, route health, localhost full health, and `git diff --check`.
