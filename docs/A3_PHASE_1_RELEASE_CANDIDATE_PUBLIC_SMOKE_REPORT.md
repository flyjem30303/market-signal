# A3 Phase 1 Release Candidate Public Smoke Report

Updated: 2026-06-13

Status: `a3_phase_1_release_candidate_public_smoke_report_ready`

Owner: A3 Launch / Production Engineering

## Purpose

This report template defines the minimum release-candidate evidence that must be collected before and after a future Phase 1 public Beta deployment.

It keeps the BRIEF launch path practical: verify public value, route health, metadata health, public-language health, rollback readiness, and data-source boundaries without adding unnecessary governance.

This template does not deploy production, mutate platform settings, read secrets, execute SQL, write Supabase, fetch market data, or promote real data.

## Release Candidate Identity

| Field | Required value shape | Notes |
| --- | --- | --- |
| `releaseCandidateId` | short label such as `phase1-public-beta-rc-YYYYMMDD-N` | No secret or raw payload values. |
| `commitOrBuildLabel` | commit hash, Vercel build label, or local build label | Use non-secret release reference only. |
| `preparedBy` | PM / A3 owner label | Role label is internal record only, not public page copy. |
| `preparedAt` | ISO timestamp | Local time note is acceptable. |
| `targetEnvironment` | `local`, `preview`, or `production` | Production value does not authorize deploy by itself. |
| `publicUrl` | public test URL or `pending` | No secret query strings. |
| `dataPosture` | `mock` | Must remain mock until promotion gates pass. |
| `scorePosture` | `mock` | Must remain mock until promotion gates pass. |

## Pre-Deploy Local Checks

Required before a future deploy:

| Check | Command | Required result |
| --- | --- | --- |
| TypeScript | `cmd.exe /c npx tsc --noEmit` | pass |
| Public visible language | `cmd.exe /c npm run check:public-visible-language-quality` | `status=ok` |
| Home first-screen hierarchy | `cmd.exe /c npm run check:home-product-first-information-hierarchy` | `status=ok` |
| Core indicator readout | `cmd.exe /c npm run check:home-core-indicator-readout` | `status=ok` |
| Weekly action summary | `cmd.exe /c npm run check:weekly-market-action-summary` | `status=ok` |
| Stock product-first readability | `cmd.exe /c npm run check:stock-product-first-runtime-readability` | `status=ok` |
| Free/member phase split | `cmd.exe /c npm run check:phase-1-phase-2-execution-split-and-workflow-assignment` | `status=ok` |
| Member roadmap public boundary | `cmd.exe /c npm run check:public-beta-membership-mvp-roadmap` | `status=ok` |
| Core route quick proof | `cmd.exe /c npm run check:public-beta-core-route-quick-proof` | `status=ok` |
| Public surface audit | `cmd.exe /c npm run check:public-surface-user-facing-audit` | `status=ok` |
| Public visible residue cleanup | `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup` | `status=ok` |
| A3 metadata smoke | `cmd.exe /c npm run check:a3-phase-1-metadata-and-public-route-smoke-checker` | `status=ok` |
| A3 post-deploy packet | `cmd.exe /c npm run check:a3-phase-1-post-deploy-smoke-and-monitoring-packet` | `status=ok` |
| Focused review gate | `cmd.exe /c npm run check:review-gates` | `status=ok` |
| Build | `cmd.exe /c npm run build` | pass |

## Remote Public URL Smoke Command

After a future preview or production deployment, rerun the core route proof against the public URL:

`cmd.exe /c "set PUBLIC_BETA_QUICK_PROOF_BASE_URL=https://market-signal-two.vercel.app&& npm run check:public-beta-core-route-quick-proof"`

Required result: `status=ok`.

If `/membership` returns 404, or if any public route returns a stale page, classify the result as `stale_deployment_or_wrong_branch` and do not use the public URL as acceptance evidence until redeploy / rollback / branch repair is complete.

## Post-Deploy Public Route Smoke

Required after a future preview or production deployment:

| Route | Required result | Notes |
| --- | --- | --- |
| `/` | 200 and first screen explains market state | Must show Phase 1 free public value. |
| `/briefing` | 200 and market context path visible | Must support 3-minute observation flow. |
| `/weekly` | 200 and weekly observation path visible | Must support return visit. |
| `/membership` | 200 and membership preview boundary visible | Must explain next-stage member value without enabling login, payment, watchlist storage, or alerts. |
| `/methodology` | 200 and signal interpretation visible | Must explain how to read the site. |
| `/disclaimer` | 200 and risk boundary visible | Must state no investment advice. |
| `/terms` | 200 and use terms visible | Must state information-use boundary. |
| `/privacy` | 200 and privacy/data statement visible | Must not request trading account, secret, or sensitive data. |
| `/stocks/TWII` | 200 or deliberate unavailable state | Index anchor. |
| `/stocks/2330` | 200 or deliberate unavailable state | Representative listed-equity route. |
| `/stocks/0050` | 200 or deliberate unavailable state | Representative ETF route. |
| `/robots.txt` | 200 and blocks internal paths | Must not expose `/internal` or `/api/internal`. |
| `/sitemap.xml` | 200 and includes public routes | Must not include internal routes. |

## Public Claim Smoke

Each release candidate must confirm:

- no command strings are visible;
- no local file paths are visible;
- no internal role labels are visible;
- no development residue appears on public routes;
- no Phase 1 / Phase 2 / Membership MVP internal labels are visible on public pages, including the membership preview route;
- no env placeholders are visible;
- no secret values are visible;
- no raw payload or database terms are visible;
- no real-time market-data claim appears;
- no official endorsement claim appears;
- no guaranteed-return claim appears;
- no investment-advice wording appears;
- the free/member boundary is clear without opening member login, payment, watchlist persistence, alert execution, or member-only content during Phase 1;
- the user can understand the market mood within 30 seconds;
- the user can decide whether to observe, review, or reduce risk within 3 minutes.

## Metadata And Share Smoke

Each release candidate must confirm:

- home title names `指數燈號`;
- home description explains market status, risk observation, demo-data boundary, and non-investment-advice posture;
- briefing title and description explain market context;
- weekly title and description explain weekly observation;
- methodology title and description explain signal interpretation;
- legal/trust route metadata is direct and readable;
- stock-route metadata includes symbol/name, signal context, canonical URL, Open Graph URL, demo-data boundary, and non-investment-advice posture;
- canonical URL uses `NEXT_PUBLIC_SITE_URL` through `src/lib/site.ts`;
- sitemap and robots route handlers are present.

## Rollback Readiness

Rollback is required if any of the following is true:

- `/` fails;
- `/briefing` fails;
- legal/trust routes fail;
- public route exposes secrets or internal execution strings;
- public route implies real-time official market data before promotion gates pass;
- public route implies investment advice;
- production build deploys unintended commit or stale artifact;
- repeated 5xx or blocking client errors affect public route use.

Rollback evidence must record:

- last known good deployment;
- rollback action;
- public route smoke result after rollback;
- public visible-language result after rollback;
- owner and next repair route.

Data rollback is out of scope for this report. Any future Supabase, market-row, `daily_prices`, ingestion, or candidate artifact rollback must use a separate data gate.

## Stop Lines

This report does not authorize:

- production deployment;
- DNS change;
- production env mutation;
- secret output;
- SQL execution;
- Supabase read/write;
- staging-row creation;
- `daily_prices` mutation;
- raw market-data fetch, ingest, storage, logging, or commit;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claim;
- official endorsement claim;
- guaranteed-return claim;
- investment advice.

## Next A3 Route

`prepare_phase_1_public_beta_release_go_no_go_packet`

Expected output:

- one-screen CEO/PM go/no-go packet;
- Phase 1 launch blockers and accepted deferrals;
- explicit Phase 2 membership deferral line;
- no-secret, no-deploy, no-data-execution posture unless a future separate launch action is approved.
