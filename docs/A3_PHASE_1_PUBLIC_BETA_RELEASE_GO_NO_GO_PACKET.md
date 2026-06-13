# A3 Phase 1 Public Beta Release Go/No-Go Packet

Updated: 2026-06-13

Status: `a3_phase_1_public_beta_release_go_no_go_packet_ready`

Owner: A3 Launch / Production Engineering

## Purpose

This packet turns the revised BRIEF into a one-screen CEO/PM release decision for Phase 1.

Phase 1 is the public free index-lighting site: users should quickly understand market atmosphere, core indicator status, risk reminders, and update-time/source boundaries.

Phase 2 membership remains a visible product path, not a Phase 1 launch blocker.

This packet does not deploy production, mutate platform settings, print secrets, execute SQL, write Supabase, fetch market data, or promote real data.

## Decision Options

| Decision | Meaning | Allowed next action |
| --- | --- | --- |
| `GO` | All Phase 1 launch evidence is present and no hard blocker remains. | Prepare the separate manual platform action checklist for deployment. |
| `GO_WITH_DEFERRALS` | Phase 1 user value is ready, and only accepted deferrals remain. | Prepare deployment checklist while tracking accepted deferrals. |
| `NO_GO` | Any hard blocker remains. | Stop launch action and repair the blocker first. |

## Required GO Evidence

All items below must be true before CEO/PM can choose `GO` or `GO_WITH_DEFERRALS`:

- Public route smoke is ok for `/`, `/briefing`, `/weekly`, `/methodology`, `/disclaimer`, `/terms`, `/privacy`, `/stocks/TWII`, `/stocks/2330`, and `/stocks/0050`.
- Metadata and share smoke is ok, including title, description, canonical URL, Open Graph URL, sitemap, and robots behavior.
- Public visible-language checks are ok: no command snippets, local file paths, role labels, env placeholders, raw payload language, database implementation terms, or development-process residue appear on public pages.
- Public visible residue cleanup is ok with `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup`.
- TypeScript is ok with `cmd.exe /c npx tsc --noEmit`.
- Build is ok with `cmd.exe /c npm run build`.
- Focused review gate is ok with `cmd.exe /c npm run check:review-gates`.
- Legal and trust routes are reachable: `/disclaimer`, `/terms`, and `/privacy`.
- Public pages keep clear risk, delay, source, and non-investment-advice language.
- Rollback path is documented: last known good deploy, route smoke after rollback, owner, and next repair route.
- Data posture remains `mock`.
- Score posture remains `mock`.
- `publicDataSource=supabase` remains a stop line.
- `scoreSource=real` remains a stop line.
- No SQL execution occurred.
- No Supabase read/write occurred.
- No staging row was created.
- No `daily_prices` mutation occurred.
- No raw market-data fetch, ingest, storage, logging, or commit occurred.

## Hard Blockers

Any item below forces `NO_GO`:

- `/` is unavailable.
- `/briefing` is unavailable.
- `/disclaimer`, `/terms`, or `/privacy` is unavailable.
- Any public route exposes secrets, tokens, local file paths, command snippets, env placeholders, internal role labels, raw payload language, database implementation terms, or internal execution workflow wording.
- Any public route claims live, official, complete, real-time, or production-grade market data before promotion gates pass.
- Any public route presents scores, lights, rankings, watchlists, summaries, or alerts as investment advice.
- Any public route implies buy/sell/hold guidance, guaranteed return, official endorsement, personal portfolio allocation, or loss avoidance.
- Rollback path is missing.
- Production `NEXT_PUBLIC_SITE_URL` value is missing before the actual deploy action.
- Production deployment action is requested before a separate platform action checklist is accepted.

## Accepted Deferrals

These items do not block Phase 1 if they are clearly tracked:

- custom domain;
- paid monitoring vendor;
- paid analytics vendor wiring;
- long-term SEO growth plan;
- Phase 2 login/member-only pages;
- Phase 2 member-only daily three-layer interpretation;
- Phase 2 watchlist persistence;
- Phase 2 custom alert execution;
- Phase 2 post-market review archive;
- Phase 2 payment/subscription flow;
- real-data promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- full Taiwan all-listed-equity row coverage;
- global-market expansion.

## Phase 2 Membership Deferral

Member three-layer interpretation, watchlist/custom alerts, and post-market review are planned Phase 2 MVP work.

They are not required for Phase 1 `GO`, as long as the public site clearly communicates the free-market-overview value and does not imply member functionality is already available.

## Lane Assignments

| Lane | Current ownership | Phase 1 launch role |
| --- | --- | --- |
| PM | Mainline integration owner | Keep public runtime, route health, reader-facing copy, and final go/no-go status aligned. |
| A1 | Data / source / coverage | Continue legal-free-source and coverage planning independently without raw fetch, SQL, Supabase writes, or real promotion. |
| A2 | Trust / legal / public copy guard | Keep non-advice, source/delay, free/member boundary, and public wording safe. |
| A3 | Launch / production engineering | Own release go/no-go, deployment checklist, post-deploy smoke, rollback, metadata, monitoring, and platform readiness. |
| A4 | Membership MVP planning | Stay standby until PM activates Phase 2 planning; do not block Phase 1. |

## Stop Lines

This packet does not authorize:

- production deploy;
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
- real-time official market-data claim;
- official endorsement claim;
- guaranteed-return claim;
- investment-advice claim;
- buy/sell/hold recommendation.

## CEO Recommendation

Use `GO_WITH_DEFERRALS` only after the A3 release-candidate public smoke report, metadata/public route smoke checker, public visible-language audit, public visible residue cleanup, TypeScript, build, and focused review gate all pass.

Do not wait for Phase 2 membership or full real-data promotion to make the Phase 1 launch decision.

## Next A3 Route

`prepare_phase_1_public_beta_chairman_review_packet`

Expected output:

- chairman-facing Phase 1 release summary;
- exact `GO`, `GO_WITH_DEFERRALS`, or `NO_GO` recommendation;
- hard blockers, accepted deferrals, and manual platform actions;
- clear statement that Phase 2 membership remains deferred and does not block Phase 1.
