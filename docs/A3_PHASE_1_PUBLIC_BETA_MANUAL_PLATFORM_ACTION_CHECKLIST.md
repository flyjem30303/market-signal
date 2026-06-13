# A3 Phase 1 Public Beta Manual Platform Action Checklist

Updated: 2026-06-13

Status: `a3_phase_1_public_beta_manual_platform_action_checklist_ready`

Owner: A3 Launch / Production Engineering

## Purpose

This checklist defines the manual platform actions needed for a future Phase 1 public Beta deployment.

It is intentionally no-secret and no-execution: it tells PM/operator what to verify in Vercel or an equivalent Next.js host without printing tokens, changing environment values from this repo, executing SQL, writing Supabase, fetching raw market data, or promoting real data.

Phase 1 remains the public free index-lighting site. Phase 2 membership is deferred and does not block this checklist.

## Required Decision Before Use

Use this checklist only after one of these chairman decisions is recorded in `docs/A3_PHASE_1_PUBLIC_BETA_CHAIRMAN_REVIEW_PACKET.md`:

- `GO`
- `GO_WITH_DEFERRALS`

If the decision is `NO_GO`, stop and repair the blocker first.

Also require `docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_VISUAL_ACCEPTANCE_RECORD.md` to be `phase_1_public_beta_chairman_visual_acceptance_recorded` before any platform movement. The chairman visual acceptance record accepts only the mock-only Phase 1 visual/product candidate; it does not authorize deployment by itself.

## Pre-Platform Local Evidence

Before opening the hosting dashboard for launch action, run and record:

| Evidence | Command | Required result |
| --- | --- | --- |
| TypeScript | `cmd.exe /c npx tsc --noEmit` | pass |
| Build | `cmd.exe /c npm run build` | pass |
| Public visible-language guard | `cmd.exe /c npm run check:public-visible-language-quality` | `status=ok` |
| Public visible residue cleanup | `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup` | `status=ok` |
| Public surface audit | `cmd.exe /c npm run check:public-surface-user-facing-audit` | `status=ok` |
| Final public readiness scan | `cmd.exe /c npm run check:phase-1-public-beta-candidate-final-public-readiness-scan` | `status=ok` |
| Human/browser visual review | `cmd.exe /c npm run check:phase-1-public-beta-human-visual-review` | `status=ok` |
| Visual acceptance / A3 handoff | `cmd.exe /c npm run check:phase-1-public-beta-visual-acceptance-and-a3-handoff` | `status=ok` |
| Chairman visual acceptance record | `cmd.exe /c npm run check:phase-1-public-beta-chairman-visual-acceptance-record` | `status=ok` |
| A3 metadata smoke | `cmd.exe /c npm run check:a3-phase-1-metadata-and-public-route-smoke-checker` | `status=ok` |
| A3 release candidate smoke report | `cmd.exe /c npm run check:a3-phase-1-release-candidate-public-smoke-report` | `status=ok` |
| A3 go/no-go packet | `cmd.exe /c npm run check:a3-phase-1-public-beta-release-go-no-go-packet` | `status=ok` |
| A3 chairman review packet | `cmd.exe /c npm run check:a3-phase-1-public-beta-chairman-review-packet` | `status=ok` |
| Focused review gate | `cmd.exe /c npm run check:review-gates` | `status=ok` |

## Manual Vercel / Platform Checklist

Operator verifies these items in the hosting dashboard. Do not paste secret values into chat or repo files.

| Area | Manual action | Required outcome |
| --- | --- | --- |
| Project | Confirm the imported Git project is the intended repository. | Project name and repository match the public Beta project. |
| Framework | Confirm framework preset is Next.js. | Build uses the platform Next.js integration. |
| Root directory | Confirm root directory is the repository root unless a later monorepo decision changes it. | Root directory is correct. |
| Build command | Confirm platform build command is compatible with `npm run build`. | Build command is set or auto-detected correctly. |
| Install command | Confirm install command uses npm. | Dependency install is platform standard. |
| Node version | Confirm Node version is compatible with the current Next.js build. | No platform Node mismatch warning. |
| Branch | Confirm deploy branch is the intended public Beta branch. | No accidental stale branch deploy. |
| Public URL | Record the public test URL without secret query strings. | URL is an HTTPS public page. |
| Rollback | Identify last known good deployment and rollback button/path. | Operator can roll back without code changes. |

## Required Environment Names

The operator may set platform environment variables only through the hosting dashboard.

Record names and presence only. Do not record values in repo, docs, screenshots, logs, or chat.

| Environment name | Phase 1 requirement | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Required before public launch | Must match the public canonical URL. |
| `NEXT_PUBLIC_DATA_SOURCE` | Required | Must remain mock-compatible for Phase 1. |
| `DATA_FRESHNESS_SOURCE` | Required if freshness surface needs explicit source labeling | Must not imply real live market data. |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional for Phase 1 public mock route | Presence does not authorize Supabase reads or writes. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional for Phase 1 public mock route | Public key presence does not authorize data promotion. |
| `SUPABASE_SERVICE_ROLE_KEY` | Not required for Phase 1 public mock route | Do not set unless a future server-only write/read gate explicitly requires it. |
| `INTERNAL_DIAGNOSTICS_ENABLED` | Optional | Should be false or absent for public launch unless protected diagnostics are intentionally enabled. |
| `INTERNAL_DIAGNOSTICS_TOKEN` | Optional | Required only if internal diagnostics are enabled. |

## Deployment Action Boundary

This checklist prepares a future manual deployment action, but this document itself does not execute deployment.

Before pressing deploy, operator must confirm:

- chairman decision is `GO` or `GO_WITH_DEFERRALS`;
- chairman visual acceptance record is `phase_1_public_beta_chairman_visual_acceptance_recorded`;
- no hard blocker remains;
- local evidence above is current;
- public visible residue cleanup passed and no development residue appears on public routes;
- `NEXT_PUBLIC_SITE_URL` is present in platform env for production/canonical behavior;
- data posture remains `mock`;
- score posture remains `mock`;
- no secret value is copied into repo or chat;
- rollback path is visible.

## Post-Deploy Public Smoke

After a future deploy, verify:

Core remote route command:

`cmd.exe /c "set PUBLIC_BETA_QUICK_PROOF_BASE_URL=https://market-signal-two.vercel.app&& npm run check:public-beta-core-route-quick-proof"`

Required result: `status=ok`. If `/membership` returns 404 after deployment, the deployed build is stale or the wrong branch/artifact is live.

| Route | Required result |
| --- | --- |
| `/` | 200 and first screen explains market status. |
| `/briefing` | 200 and supports the 3-minute action judgment. |
| `/weekly` | 200 and supports return-visit observation. |
| `/methodology` | 200 and explains signal interpretation. |
| `/disclaimer` | 200 and states non-investment-advice boundary. |
| `/terms` | 200 and states information-use terms. |
| `/privacy` | 200 and does not ask for trading-account data. |
| `/stocks/TWII` | 200 or deliberate unavailable state. |
| `/stocks/2330` | 200 or deliberate unavailable state. |
| `/stocks/0050` | 200 or deliberate unavailable state. |
| `/robots.txt` | 200 and does not expose internal routes. |
| `/sitemap.xml` | 200 and includes public routes only. |

## Post-Deploy Public Claim Smoke

Verify public pages do not show:

- command snippets;
- local file paths;
- development residue;
- internal role labels;
- environment placeholders;
- secret values;
- raw payload or database implementation language;
- live official market-data claims;
- complete-market-data claims;
- official endorsement claims;
- guaranteed-return claims;
- investment advice;
- buy/sell/hold recommendation.

## Rollback Trigger

Rollback immediately if any of the following occurs:

- `/` fails;
- `/briefing` fails;
- legal/trust routes fail;
- public route exposes secrets or internal execution wording;
- public route implies live official market data;
- public route implies investment advice;
- repeated 5xx or blocking client errors affect public use;
- wrong branch or stale build is deployed.

Rollback record must include:

- failed route or claim;
- deployment label rolled back from;
- last known good deployment label;
- route smoke result after rollback;
- owner;
- next repair route.

## Stop Lines

This checklist does not authorize:

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
- payment, login, watchlist persistence, or member-only content for Phase 1.

## Next A3 Route

`prepare_phase_1_public_beta_post_platform_action_report_template`

Expected output:

- post-deploy report template;
- route smoke result table;
- public-claim smoke result table;
- rollback result table;
- final `GO`, `GO_WITH_DEFERRALS`, or `NO_GO` launch note.
