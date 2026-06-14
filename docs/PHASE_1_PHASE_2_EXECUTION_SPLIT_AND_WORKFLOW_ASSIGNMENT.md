# Phase 1 / Phase 2 Execution Split And Workflow Assignment

Updated: 2026-06-14

Status: `phase_1_phase_2_execution_split_ready`

## Decision

Phase 1 is the public free index-lighting site.

Phase 2 is the membership MVP path.

Phase 2 planning may continue, but Phase 2 implementation must not block Phase 1 public Beta readiness.

GOAL execution should keep PM on Phase 1 product/runtime integration. A1, A2, A3, and A4 may run in parallel only when their output reduces mainline risk or prepares a future gate.

## Current GOAL Operating Shape

The current GOAL is `phase_1_public_free_index_dashboard_usable_loop`.

PM remains the integration owner.

Use larger coherent slices when governance becomes too fine.

Recommended workstream split:

- PM mainline: 55%
- A1 Data / Source / Coverage: 20%
- A2 Public Copy / Product Safety: 10%
- A3 Launch / Production Engineering: 15%
- A4 Membership MVP Planning: standby only

## PM Mainline

PM owns:

- Home / briefing / weekly / stock route integration.
- Public runtime comprehension.
- Public visible residue cleanup.
- Data-boundary readability.
- Non-investment-advice placement.
- Checkers, build health, status, Git backup.

PM must not wait for A1/A2/A3/A4 when local Phase 1 work is safe.

## A1 Data / Source / Coverage

A1 owns:

- Legal/free automated data-source evidence.
- Coverage universe and row coverage planning.
- Field contracts.
- Ingestion/backfill readiness.
- Aggregate-only handoffs.

A1 must not fetch, store, or commit raw market data unless PM/CEO explicitly opens that stage.

## A2 Public Copy / Product Safety

A2 owns:

- Public trust copy.
- Data-source and update-time explanation.
- Delayed/non-real-time wording.
- Non-investment-advice wording.
- No-official-endorsement wording.
- Free/member boundary copy.

A2 should flag comprehension blockers before cosmetic polish.

## A3 Launch / Production Engineering

A3 owns:

- Vercel deployment checks.
- Environment variable inventory.
- Metadata, sitemap, robots.
- Monitoring and rollback.
- Post-deploy smoke reports.

A3 must not mutate production environment, DNS, secrets, or platform settings without PM/CEO approval.

## A4 Membership MVP Planning

A4 owns planning only:

- Membership preview may remain visible.
- Phase 2 content architecture.
- watchlist / alert / post-market review MVP spec.
- Free/member conversion metrics.
- Member content boundary and safety wording.

A4 must not implement login, payment, persisted watchlist, personalized alerts, or member-only content during Phase 1.

## Stop Lines

Do not execute or approve:

- SQL execution.
- Supabase read/write beyond separately authorized bounded readonly checks.
- staging-row creation.
- `daily_prices` mutation.
- raw market-data fetch.
- raw market-data storage or commit.
- `publicDataSource=supabase`.
- `scoreSource=real`.
- Phase 2 login or payment.
- production deploy, DNS change, or production env mutation without A3 and PM readiness.
- operator/governance console text on public pages.

## Review Gates

Before claiming Phase 1 progress:

- Public pages must not show internal role names, commands, local paths, raw data identifiers, or governance packet language.
- Public pages must show data update time, data boundary, and non-investment-advice wording.
- Public pages must remain readable in Traditional Chinese.
- `publicDataSource=mock` and `scoreSource=mock` remain true until promotion gates are explicitly opened.
