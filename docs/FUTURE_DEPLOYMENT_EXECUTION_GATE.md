# Future Deployment Execution Gate

Status: `future_deployment_execution_gate_ready_not_executed`

Date: 2026-06-07

Owner: PM mainline

Support lanes: I Launch / Ops, A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `prepare_future_deployment_execution_gate_not_deploying_now`.

CEO selects the cheapest viable public Beta deployment posture: Vercel or an equivalent managed Next.js host for the first public Beta, Supabase as the backend project already used by the data gates, and Cloudflare or an equivalent DNS provider only when a custom domain is ready.

This gate records the later deployment execution requirements after `docs/BETA_RELEASE_RUNBOOK_DRAFT.md`. It is not an execution slice. It does not deploy production, does not create a hosting project, does not change DNS, does not upload secrets, does not mutate platform environment variables, and does not promote real runtime state.

## Source Gates

This gate is grounded in:

- `docs/BETA_RELEASE_RUNBOOK_DRAFT.md`
- `docs/BETA_LAUNCH_PREFLIGHT_PACKET.md`
- `docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md`
- `docs/PUBLIC_BETA_READINESS_GATE.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Current protected state:

- Beta release runbook status is `beta_release_runbook_draft_ready_before_any_deploy`.
- Beta launch preflight status is `beta_launch_preflight_packet_ready_not_deployed`.
- Formal deployment readiness is `formal_launch_deployment_readiness_gate_ready_not_deployed`.
- Public Beta readiness outcome is `ready_for_local_public_beta_preflight_not_production_deployed`.
- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.
- TW equity closed loop is accepted at `180/180`.
- Full Level 1 MVP coverage remains `182/360`.
- TWII remains `0/60`.
- ETF remains `2/120`.

## Deployment Target Decision

Deployment target decision:

| Decision item | Selected Beta posture | Owner | Evidence needed before execution |
| --- | --- | --- | --- |
| Hosting target | `vercel_or_equivalent_managed_nextjs_host` | PM / I | Hosting project exists and is linked to the intended Git source |
| Deployment source | `main_branch_or_reviewed_release_branch` | PM | Git status clean and latest release commit identified |
| Canonical URL | `platform_preview_or_beta_url_first_custom_domain_later` | PM / I | URL recorded without secrets and route health targets listed |
| DNS/CDN | `defer_custom_domain_until_platform_url_passes_beta_health` | I | DNS owner named before any DNS change |
| Database/runtime | `supabase_backend_available_but_public_runtime_stays_mock` | PM / A1 | Public source promotion remains blocked until a separate promotion gate |
| Score runtime | `mock_score_until_real_score_promotion_gate` | PM | Score promotion remains blocked until a separate promotion gate |
| Rollback | `hosting_provider_rollback_to_prior_deployment` | I | Prior deployment or fallback reference recorded before public announcement |
| Incident owner | `pm_primary_i_launch_ops_backup` | PM / I | First-response channel and downtime threshold recorded |

## Required Pre-Execution Local Proof

Before any later deployment execution slice, PM must collect these local proofs:

1. `cmd.exe /c npm run check:beta-release-runbook-draft`
2. `cmd.exe /c npm run check:beta-launch-preflight-packet`
3. `cmd.exe /c npm run check:public-route-loop`
4. `cmd.exe /c npm run check:localhost-full-health`
5. `cmd.exe /c npm run check:json`
6. `cmd.exe /c npx tsc --noEmit`
7. `node scripts/check-review-gates.mjs`
8. `git diff --check`
9. `git status --short`

Any non-empty `git status --short` must be reviewed by PM before deployment execution. Any blocked proof stops deployment execution until repaired or explicitly rejected by CEO/PM.

## Later Execution Packet Requirements

A later deployment execution packet must be created before anyone performs the actual platform action. It must include:

- selected hosting target;
- selected deployment source;
- canonical URL or temporary Beta URL;
- exact platform action, without secret values;
- pre-execution proof summary;
- expected public routes;
- post-deploy health verification steps;
- rollback owner;
- rollback reference;
- incident triage owner;
- first-response channel;
- maximum acceptable downtime before rollback;
- secret input owner;
- environment variable owner;
- explicit mock runtime decision;
- explicit mock score decision;
- post-run review path.

Required post-deploy route health targets:

- `/`
- `/briefing`
- `/weekly`
- `/stocks/2330`
- `/stocks/TWII`
- `/disclaimer`
- `/terms`
- `/privacy`
- `/methodology`

## Post-Deploy Review Template

The later post-deploy review must record:

- deployment attempted: `yes` or `no`;
- hosting target;
- source commit;
- canonical or temporary URL;
- route health summary;
- secret exposure check summary with no secret values;
- runtime boundary observed as `publicDataSource=mock`;
- score boundary observed as `scoreSource=mock`;
- public trust copy observed;
- rollback status;
- incident status;
- accepted / rejected / needs_bounded_repair / blocked;
- next route.

If any public route returns an unexpected error, leaks diagnostics, leaks secrets, or hides the mock-only boundary, the deployment review must be `needs_bounded_repair` or `blocked`.

## A1 / A2 Coordination

A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`.

A1 must not treat a deployment gate as data-source approval. TWII and ETF source-rights, field-contract, candidate artifact, bounded execution, post-run review, readback, and scoring gates remain separate.

A2 remains assigned to `beta_phrase_set_and_shared_trust_surface_patch_scope`.

A2 should prioritize Beta-visible trust language and copy clarity before visual polish. A2 must keep mock-only, partial coverage, missing/delayed data, freshness, model limitation, risk, and non-investment-advice wording visible.

## Hard Stops

This gate does not authorize:

- production deployment;
- deployment command execution;
- hosting project mutation;
- DNS change;
- SSL configuration change;
- platform env mutation;
- secret output;
- secret storage action;
- SQL execution;
- Supabase write;
- Supabase connection for deployment proof;
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

Any later deployment or promotion action must have a separate named gate, exact platform action, precheck, post-run review, sanitized evidence, rollback owner, and stop line.

## Verification

Focused verification:

- `node scripts/check-future-deployment-execution-gate.mjs`
- `cmd.exe /c npm run check:future-deployment-execution-gate`
- `node scripts/check-launch-engineering-workstream-board.mjs`
- `node scripts/check-review-gates.mjs`

Milestone verification should also run route health, JSON validation, TypeScript, localhost full health, and `git diff --check`.
