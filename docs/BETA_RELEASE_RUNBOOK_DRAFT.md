# Beta Release Runbook Draft

Status: `beta_release_runbook_draft_ready_before_any_deploy`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO decision: `draft_beta_release_runbook_before_any_deploy`.

PM converts `docs/BETA_LAUNCH_PREFLIGHT_PACKET.md` into an ordered release runbook so the project can move from local Beta readiness toward a future public Beta deployment without losing the mock/real boundary, secret-handling boundary, or post-deploy verification requirements.

This runbook is draft-only and pre-deploy. It does not execute a deploy, mutate platform settings, change DNS, change SSL, upload secrets, run SQL, write Supabase, or promote real public runtime state.

## Source Gates

This runbook is grounded in:

- `docs/BETA_LAUNCH_PREFLIGHT_PACKET.md`
- `docs/PUBLIC_BETA_READINESS_GATE.md`
- `docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`
- `docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md`
- `docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md`

Current protected state:

- Beta preflight status is `beta_launch_preflight_packet_ready_not_deployed`.
- Public Beta readiness outcome is `ready_for_local_public_beta_preflight_not_production_deployed`.
- Formal launch deployment readiness is `formal_launch_deployment_readiness_gate_ready_not_deployed`.
- PM selected route is `beta_release_runbook_draft_before_any_deploy`.
- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.
- TW equity closed loop is accepted at `180/180`.
- Full Level 1 MVP coverage remains `182/360`.
- TWII remains `0/60`.
- ETF remains `2/120`.

## Release Phases

| Phase | Owner | Action | Required proof | Stop line |
| --- | --- | --- | --- | --- |
| 1. Local proof collection | PM | Run local proof commands and collect status only | `check:beta-launch-preflight-packet`, `check:public-route-loop`, `check:localhost-full-health`, TypeScript, JSON, review gate | Stop if any required local proof is blocked |
| 2. Deployment target decision | PM / I | Choose production host and canonical URL | Host target, branch/source, rollback path, canonical URL, owner recorded | No deploy command may run in this draft |
| 3. Secret and env input plan | I / PM | Prepare variable names and platform owner flow | Required variables named without values, owner named, browser/server boundary recorded | Do not print, paste, commit, or log secret values |
| 4. Pre-deploy copy and legal spot check | A2 / PM | Confirm public trust surfaces are Beta-safe | Mock-only, partial coverage, missing/delayed data, freshness, model limits, non-investment-advice wording visible | No real-source wording and no investment advice claim |
| 5. Data and source-rights spot check | A1 / PM | Confirm real-data blockers remain explicit | TW equity `180/180`, full coverage `182/360`, TWII `0/60`, ETF `2/120`, rights blockers named | No source promotion and no row coverage points |
| 6. Future deploy execution gate | PM / I | Create a separate deployment execution gate later | Exact platform action, precheck, post-run review path, rollback owner, stop line | This draft does not execute deployment |
| 7. Post-deploy health verification | PM / I | Verify routes after a future deployment | `/`, `/briefing`, `/weekly`, `/stocks/2330`, `/stocks/TWII`, `/disclaimer`, `/terms`, `/privacy`, `/methodology` return expected states | Stop if a route returns an unexpected error or leaks internals |
| 8. Monitoring and rollback confirmation | PM / I | Confirm uptime route, logs, rollback, incident owner | Uptime URL, error-log path, deploy-log path, rollback reference, downtime threshold | No public launch claim before this proof exists |
| 9. Public Beta go/no-go review | CEO / PM | Decide whether public Beta is visible enough to announce | All prior phases accepted, mock/real state visible, legal copy visible, route health accepted | Keep `publicDataSource=mock` and `scoreSource=mock` unless later promotion gates pass |

## Required Local Proof Commands

PM should run these before any future deployment execution gate:

1. `cmd.exe /c npm run check:beta-launch-preflight-packet`
2. `cmd.exe /c npm run check:public-route-loop`
3. `cmd.exe /c npm run check:localhost-full-health`
4. `cmd.exe /c npm run check:json`
5. `cmd.exe /c npx tsc --noEmit`
6. `node scripts/check-review-gates.mjs`
7. `git diff --check`

If any command blocks, PM repairs local files first or records a blocked decision. A blocked local proof does not authorize deployment.

## Future Deployment Execution Gate Requirements

A later deployment execution gate must be separate from this draft and must include:

A later deployment execution packet must be created before anyone performs the actual platform action.

- selected host;
- selected production branch or source;
- canonical URL;
- platform environment variable owner;
- secret input owner;
- exact platform action or exact command;
- pre-deploy local proof timestamp;
- post-deploy health verification command;
- rollback owner;
- rollback reference;
- incident triage owner;
- maximum acceptable downtime before rollback;
- explicit decision that public runtime remains `publicDataSource=mock`;
- explicit decision that score remains `scoreSource=mock`.

Without that separate execution gate, PM must not perform a production deployment.

## A1 Next Assignment

A1 assignment from this runbook: `source_rights_evidence_intake_for_tWII_and_etf`.

A1 should prepare source-rights evidence intake for TWII and ETF so the remaining MVP coverage gaps can later move through source-rights, field-contract, candidate artifact, bounded execution, post-run review, readback, and scoring gates.

A1 must keep work local-only until PM accepts a later source-specific gate.

## A2 Next Assignment

A2 assignment from this runbook: `beta_phrase_set_and_shared_trust_surface_patch_scope`.

A2 should prepare a Beta phrase set and shared trust-surface patch scope that keeps mock-only state, partial coverage, missing/delayed data, data freshness, model limitation, risk, and non-investment-advice visible.

A2 must keep visual polish behind launch-blocking copy clarity.

## Hard Stops

This runbook draft does not authorize:

- production deployment;
- Vercel production deployment;
- deployment command execution;
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

Any later deployment or promotion action must have a separate named gate, exact command or platform action, precheck, post-run review, sanitized evidence, rollback owner, and stop line.

## PM Logging Requirements

Every future release run should record:

- CEO decision;
- PM selected route;
- A1/A2 assignment or completion review;
- command executed or skipped reason;
- route health status;
- deployment target decision;
- secret-handling owner without values;
- accepted / rejected / needs_bounded_repair / blocked result;
- mock / real promotion status;
- next route;
- Beta launch readiness effect.

## Verification

Focused verification:

- `node scripts/check-beta-release-runbook-draft.mjs`
- `cmd.exe /c npm run check:beta-release-runbook-draft`
- `node scripts/check-launch-engineering-workstream-board.mjs`
- `node scripts/check-review-gates.mjs`

Milestone verification should also run route health, JSON validation, TypeScript, and `git diff --check`.
