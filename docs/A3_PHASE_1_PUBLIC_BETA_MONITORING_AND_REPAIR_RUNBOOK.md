# A3 Phase 1 Public Beta Monitoring And Repair Runbook

Updated: 2026-06-13

Status: `a3_phase_1_public_beta_monitoring_and_repair_runbook_ready`

Owner: A3 Launch / Production Engineering

## Purpose

This runbook defines how PM/A3 monitors and repairs the Phase 1 public Beta after a future platform action.

It keeps the site operational as a public free index-lighting experience while Phase 2 membership and real-data promotion remain deferred.

This runbook does not deploy production, change DNS, mutate environment variables, print secrets, execute SQL, write Supabase, fetch market data, or promote real data.

## Required Inputs

Before this runbook is used for a real public Beta, the following artifacts must exist:

| Input | Required status |
| --- | --- |
| Manual platform action checklist | `a3_phase_1_public_beta_manual_platform_action_checklist_ready` |
| Post-platform action report template | `a3_phase_1_public_beta_post_platform_action_report_template_ready` |
| Chairman review packet | `a3_phase_1_public_beta_chairman_review_packet_ready` |
| Go/no-go packet | `a3_phase_1_public_beta_release_go_no_go_packet_ready` |

## Monitoring Cadence

| Window | Owner | What to check | Required action |
| --- | --- | --- | --- |
| First 15 minutes after deploy | A3 | `/`, `/briefing`, `/disclaimer`, build/runtime errors, wrong-branch signs | Roll back if any P0 trigger appears. |
| First 60 minutes after deploy | A3 + PM | Home first-screen clarity, core route health, legal/trust routes, metadata/share preview | Repair or roll back based on severity. |
| First 24 hours | PM + A2 | Public copy, non-advice boundary, demo-data boundary, source/delay wording, no internal residue | Patch copy only if public misunderstanding risk appears. |
| Every business day during Beta | PM | `/`, `/briefing`, `/stocks/TWII`, `/stocks/2330`, `/stocks/0050`, public claim smoke, public visible residue cleanup | Record result and open repair route if needed. |
| After each future deploy | A3 | full post-platform route smoke and rollback path | Fill the post-platform action report. |
| Weekly during Beta | CEO + PM | Phase 1 value loop, accepted deferrals, Phase 2 membership timing, A1/A2/A3/A4 lane status | Decide whether to continue, repair, or widen scope. |

## Route Health Review Owner

| Route group | Primary owner | Backup owner | P0 condition |
| --- | --- | --- | --- |
| Home and briefing | PM | A3 | `/` or `/briefing` unavailable, blank, or misleading. |
| Legal/trust routes | A2 | PM | `/disclaimer`, `/terms`, or `/privacy` unavailable. |
| Stock routes | PM | A1 | Representative route unavailable without deliberate unavailable state. |
| Robots and sitemap | A3 | PM | Internal route appears in sitemap or robots behavior exposes internal paths. |
| Internal boundaries | A3 | PM | Internal diagnostics or raw-market route is public without protection. |

## Public Copy Regression Owner

A2 owns copy regression triage.

Patch immediately if public copy:

- implies live official market data;
- implies complete-market coverage;
- implies official endorsement;
- implies guaranteed return;
- presents scores, lights, rankings, summaries, watchlists, or alerts as investment advice;
- implies buy/sell/hold guidance;
- exposes command snippets, local file paths, env placeholders, internal role labels, raw payload language, or database implementation language;
- exposes development residue that makes the public site look like an internal launch console.

PM owns final product wording when the issue affects the 30-second market atmosphere or 3-minute action judgment.

## Rollback Verification Cadence

| Situation | Required verification |
| --- | --- |
| Rollback considered | Confirm last known good deployment label and affected routes. |
| Rollback executed | Recheck `/`, `/briefing`, `/disclaimer`, `/terms`, `/privacy`, `/robots.txt`, and `/sitemap.xml`. |
| Rollback successful | Record post-rollback route smoke and next repair route. |
| Rollback failed | Escalate to `NO_GO` and keep public Beta closed until repaired. |

## Repair Priority Ladder

| Priority | Condition | Owner | Response |
| --- | --- | --- | --- |
| P0 | Site unavailable, trust route unavailable, secret/internal exposure, live official data claim, investment-advice implication, visible development residue that harms trust, wrong branch deploy, repeated 5xx | A3 + PM | Roll back or close public Beta path immediately. |
| P1 | Main value loop unclear, update/source boundary missing, stock route confusing, metadata/share misleading, robots/sitemap incomplete | PM + A2 + A3 | Patch same day and rerun focused checks. |
| P2 | Copy polish, visual density, non-blocking analytics gap, custom domain gap, paid monitoring gap, Phase 2 teaser clarity | PM / A4 | Track as accepted deferral unless it harms Phase 1 comprehension. |

## Required Local Checks After Repair

After any Phase 1 repair, run the smallest relevant set plus the focused review gate:

| Repair type | Minimum check set |
| --- | --- |
| Copy or public route wording | `cmd.exe /c npm run check:public-visible-language-quality`; `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup`; `cmd.exe /c npm run check:public-surface-user-facing-audit` |
| Route or metadata behavior | `cmd.exe /c npm run check:a3-phase-1-metadata-and-public-route-smoke-checker`; `cmd.exe /c npm run check:public-surface-user-facing-audit` |
| Launch/runbook artifact | relevant `check:a3-*` command |
| Any TypeScript/source change | `cmd.exe /c npx tsc --noEmit` |
| Any coherent slice | `cmd.exe /c npm run check:review-gates` |

## Workstream Loop

| Lane | During public Beta |
| --- | --- |
| PM | Own Phase 1 value loop, public route usability, and final triage. |
| A1 | Continue source/coverage work without raw fetch, SQL, Supabase writes, or real promotion. |
| A2 | Own trust copy, non-advice language, delay/source wording, and free/member boundary. |
| A3 | Own route health, platform smoke, monitoring record, rollback, and repair runbook. |
| A4 | Prepare Phase 2 membership MVP only after Phase 1 public Beta is stable enough. |

## Stop Lines

This runbook does not authorize:

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

## Next A3 Route

`prepare_phase_1_public_beta_release_ops_index`

Expected output:

- a single index of A3 launch artifacts;
- current A3 readiness status;
- what is ready, what is deferred, and what still requires manual platform action.
