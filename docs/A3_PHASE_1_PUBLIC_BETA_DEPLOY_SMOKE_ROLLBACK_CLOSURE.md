# A3 Phase 1 Public Beta Deploy Smoke Rollback Closure

Updated: 2026-06-14

Status: `a3_phase_1_public_beta_deploy_smoke_rollback_closure_ready`

Owner: A3 Launch / Production Engineering

## Purpose

This packet closes the Phase 1 public Beta deployment operation loop.

It gives the PM, A3 operator, and chairman one compact place to confirm:

- what must be true before a platform deploy;
- what must be checked immediately after deploy;
- what triggers rollback;
- what must be verified after rollback;
- which workstreams own repair if the launch cannot remain open.

This packet does not deploy production, change DNS, mutate hosting environment variables, print secrets, execute SQL, write Supabase, create staging rows, modify `daily_prices`, fetch market data, or promote real data.

## Required Inputs

| Input | Required status |
| --- | --- |
| Release ops index | `a3_phase_1_public_beta_release_ops_index_ready` |
| Chairman review packet | `a3_phase_1_public_beta_chairman_review_packet_ready` |
| Release go/no-go packet | `a3_phase_1_public_beta_release_go_no_go_packet_ready` |
| Manual platform action checklist | `a3_phase_1_public_beta_manual_platform_action_checklist_ready` |
| Post-platform action report template | `a3_phase_1_public_beta_post_platform_action_report_template_ready` |
| Monitoring and repair runbook | `a3_phase_1_public_beta_monitoring_and_repair_runbook_ready` |
| Public visible residue cleanup | `status=ok` |
| Public visible language quality | `status=ok` |
| TypeScript | pass |
| Review gate | `status=ok` |

## Pre-Deploy Minimum Proof

Before any future deploy action, record these proof items without storing secret values:

| Proof | Owner | Required result |
| --- | --- | --- |
| Commit identity | PM | Current git commit label recorded. |
| Public URL target | A3 | HTTPS public URL recorded without private dashboard links. |
| Environment names present | A3 | Required names confirmed, values not printed. |
| Runtime posture | PM | `publicDataSource=mock` and `scoreSource=mock`. |
| Public route readiness | PM | Home, briefing, stock, methodology, disclaimer, terms, and privacy route checks pass locally. |
| User-facing residue scan | PM | No command snippets, local file paths, development role labels, env placeholders, raw payload language, or database implementation language visible. |
| Trust copy scan | A2 | No investment advice, buy/sell/hold recommendation, guaranteed-return claim, official endorsement claim, or live official market-data claim. |
| Chairman/operator decision | Chairman / CEO | `GO` or `GO_WITH_DEFERRALS`; `NO_GO` blocks platform action. |

## Post-Deploy Smoke Sequence

Run this sequence immediately after a future preview or production deploy.

| Step | Route or surface | Pass condition |
| --- | --- | --- |
| 1 | `/` | 200, market signal visible, update time visible, mock/demo data boundary visible. |
| 2 | `/briefing` | 200, 30-second market atmosphere and 3-minute judgment flow visible. |
| 3 | `/stocks/TWII` | 200 or deliberate unavailable state, no internal error, no advice claim. |
| 4 | `/stocks/2330` | 200 or deliberate unavailable state, stock status and source boundary visible. |
| 5 | `/stocks/0050` | 200 or deliberate unavailable state, ETF/stock boundary visible. |
| 6 | `/methodology` | 200, signal logic explained without trading instruction. |
| 7 | `/disclaimer` | 200, non-investment-advice boundary visible. |
| 8 | `/terms` | 200, public terms boundary visible. |
| 9 | `/privacy` | 200, privacy and data-use boundary visible. |
| 10 | `/robots.txt` | 200, public indexing scope does not expose internal routes. |
| 11 | `/sitemap.xml` | 200, public route set only. |

## Public Claim Smoke

All items must pass before the deployment may remain open:

| Claim guard | Required result |
| --- | --- |
| no command snippets visible | pass |
| no local file paths visible | pass |
| no development residue visible | pass |
| no internal role labels visible | pass |
| no environment placeholders visible | pass |
| no secret values visible | pass |
| no raw payload language visible | pass |
| no database implementation language visible | pass |
| no live official market-data claim | pass |
| no complete-market-data claim | pass |
| no official endorsement claim | pass |
| no guaranteed-return claim | pass |
| no investment advice | pass |
| no buy/sell/hold recommendation | pass |

## Rollback Triggers

Rollback is required if any P0 trigger appears after deploy:

| Trigger | Severity | Required action |
| --- | --- | --- |
| Any core public route returns 500 or persistent internal server error | P0 | Roll back to last known good deployment. |
| Home or briefing cannot communicate market status within the first viewport | P0 | Roll back or keep preview closed. |
| Public page exposes command snippets, local paths, env placeholders, secrets, raw payload language, or database implementation language | P0 | Roll back immediately. |
| Public page implies `publicDataSource=supabase`, `scoreSource=real`, live official market data, complete coverage, or official endorsement | P0 | Roll back immediately. |
| Public page gives personalized investment advice, guaranteed return, or buy/sell/hold recommendation | P0 | Roll back immediately. |
| Mobile viewport has blocking horizontal overflow or unreadable first-screen content | P0 | Roll back or keep preview closed. |
| Sitemap or robots exposes internal/private routes | P0 | Roll back or repair before public open. |

P1 repair may stay open only if public understanding and legal boundaries remain intact:

| Trigger | Severity | Required action |
| --- | --- | --- |
| Non-core public route has copy regression without advice or secret exposure | P1 | Repair same day and re-run smoke. |
| Metadata/share copy is stale but route content is safe | P1 | Repair before announcement. |
| Accepted deferral is unclear but not misleading | P1 | A2 repair copy and PM recheck. |

## Post-Rollback Verification

If rollback occurs, record:

| Field | Required value |
| --- | --- |
| `rollbackNeeded` | `yes` |
| `rolledBackFrom` | non-secret deployment label |
| `rolledBackTo` | last known good deployment label |
| `rollbackCompletedAt` | ISO timestamp |
| `postRollbackRouteSmoke` | `pass` before reopening |
| `publicDataSource` | `mock` |
| `scoreSource` | `mock` |
| `nextRepairOwner` | PM, A2, A3, or A1 depending on trigger |

After rollback, at minimum rerun:

- `cmd.exe /c npm run check:public-visible-language-quality`
- `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup`
- `cmd.exe /c npm run check:a3-phase-1-metadata-and-public-route-smoke-checker`
- `cmd.exe /c npm run check:a3-phase-1-public-beta-deploy-smoke-rollback-closure`
- `cmd.exe /c npm run check:review-gates`

## Workstream Ownership

| Lane | Deployment responsibility |
| --- | --- |
| PM mainline | Decide whether Phase 1 public reading contract remains intact after smoke. |
| A1 | Keep data/source/coverage work out of public real-data claims until source and coverage gates pass. |
| A2 | Repair public trust copy, non-advice boundaries, source attribution, and membership/free-content boundary. |
| A3 | Own platform action report, route smoke, monitoring cadence, rollback verification, and release operations index. |
| A4 | Keep Phase 2 membership MVP as roadmap/preview until PM explicitly opens implementation. |

## Stop Lines

This packet does not authorize:

- production deploy;
- DNS change;
- production env mutation;
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
- Phase 2 login, payment, watchlist persistence, alert execution, or member-only content as a Phase 1 requirement.

## CEO Recommendation

A3 should treat this packet as the final compact deployment operations closure before a future manual platform action.

If it passes, the next safe PM route is:

`prepare_phase_1_public_beta_operator_action_or_repair_result`

If any P0 trigger is found in a future deploy smoke, the route is:

`rollback_to_last_known_good_and_repair_before_reopen`
