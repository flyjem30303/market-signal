# Phase 1 / Phase 2 Execution Split And Workflow Assignment

Updated: 2026-06-14

Status: `phase_1_phase_2_execution_split_ready`

Owner: CEO / PM

## Purpose

This document keeps the revised `指數燈號網站 BRIEF` executable without slowing the project down.

CEO decision:

- Phase 1 is the current mainline.
- Phase 1 is the public free index-lighting site that every visitor can use.
- Phase 2 is the membership MVP path.
- Phase 2 planning may continue, but Phase 2 implementation must not block Phase 1 public Beta readiness.
- The chairman's latest BRIEF revision keeps membership as the next product direction, but it confirms that the first launch must be usable by non-members first.
- GOAL execution should keep PM on Phase 1 product/runtime integration while A1/A2/A3/A4 continue only the support work that does not slow the public free launch.

## Phase 1 Current Mainline

Phase 1 delivers the public free experience.

A general investor should be able to understand:

- current market mood,
- signal status,
- core indicator summary,
- risk reminder,
- update time,
- source/data boundary,
- next observation.

Phase 1 can launch only when public pages are clean, readable, route-healthy, and honest about demonstrative data.

Phase 1 does not require:

- membership login,
- member-only content,
- watchlist persistence,
- custom alert persistence,
- payment,
- broker integration,
- real-data promotion.

## Phase 2 Membership MVP

Phase 2 starts only after PM decides Phase 1 public Beta readiness is stable enough.

Phase 2 scope:

- registration/login,
- member-only daily market three-layer interpretation,
- watchlist,
- one custom alert condition MVP,
- post-market review report,
- conversion and retention metrics.

Phase 2 remains non-investment-advice. It must explain, contextualize, and help users observe; it must not tell users to buy or sell.

## Workflow Assignment

PM mainline:

- Phase 1 product/runtime integration,
- public page readability,
- market-light status hierarchy,
- route health,
- final launch status alignment.

A1 Data / Source / Coverage:

- legal free automated source candidates,
- coverage universe,
- field contracts,
- ingestion/backfill readiness,
- no raw market-row fetch or Supabase write unless explicitly opened later.

A2 Public Copy / Product Safety:

- public trust copy,
- non-investment-advice boundary,
- data-source and update-time disclosure,
- free/member boundary copy.

A3 Launch / Production Engineering:

- Vercel/project/env inventory,
- domain and production routing,
- public route smoke,
- monitoring,
- rollback,
- SEO and analytics readiness.

A4 Membership MVP Planning:

- Phase 2 planning only,
- free/member boundary,
- member information architecture,
- watchlist and alert MVP shape,
- post-market review template.

## Acceleration Rule

Use larger coherent slices when the work is mostly alignment or cleanup.

Do not create a new governance artifact unless it unlocks one of these:

- public route readiness,
- source/data trust,
- launch operator action,
- rollback or repair decision,
- membership boundary clarity,
- checker removal of stale internal/development residue.

## Hard Boundaries

Until a later gate explicitly opens the action, do not:

- run SQL,
- write Supabase,
- create staging rows,
- modify `daily_prices`,
- fetch, store, or commit raw market data,
- print secrets or raw payloads,
- set `publicDataSource=supabase`,
- set `scoreSource=real`,
- claim real-time market data,
- claim investment advice,
- implement Phase 2 membership as a Phase 1 blocker.

## Current Next Route

`phase_1_public_free_index_dashboard_usable_loop`

The next PM route should push Phase 1 as a public product, not as an operator/governance console:

1. make the public home, briefing, weekly, stock, methodology, disclaimer, terms, and privacy routes readable to general investors;
2. keep every public surface centered on market status, signal reason, update time, risk reminder, source/data boundary, and next observation;
3. remove or hide anything that looks like development workflow, internal role work, hard blockers, command snippets, local paths, raw payloads, or platform-operation residue;
4. keep Phase 2 membership visible only as a roadmap until Phase 1 public Beta readiness is stable;
5. hand only the minimum accepted output to A3 launch operations when public-route readability and local checks are green.

If a future operator or platform action is needed, A3 may use the existing no-secret checklist. Until then, PM should keep moving on the Phase 1 public usable loop instead of creating more operator packets.

## Current GOAL Operating Shape

The active GOAL should be interpreted as a multi-line execution system:

- PM stays on the mainline: public free product usability, runtime readability, route health, public page cleanup, and launch integration.
- A1 stays on data/source/coverage: legal free automated source candidates, coverage universe, field contracts, ingestion/backfill readiness, and aggregate-only handoff.
- A2 stays on trust and copy: risk disclosure, source/update-time copy, non-investment-advice wording, free/member boundary, and public residue cleanup.
- A3 stays on launch engineering: Vercel, env inventory, smoke checks, monitoring, rollback, SEO, analytics, and post-deploy evidence.
- A4 stays optional and Phase 2 only: membership MVP planning, information architecture, watchlist/alert/report shape, and conversion metrics design.

CEO may adjust line ratios at any time. Default ratio while Phase 1 is not fully stable: PM 50%, A1 20%, A2 15%, A3 15%, A4 planning only when it removes Phase 2 ambiguity.
