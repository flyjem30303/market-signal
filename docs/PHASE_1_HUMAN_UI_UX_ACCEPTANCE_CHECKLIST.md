# Phase 1 Human UI/UX Acceptance Checklist

Date: 2026-06-14

Status: `phase_1_human_ui_ux_acceptance_checklist_ready`

Owner: CEO / PM mainline

Decision: `READY_FOR_FINAL_HUMAN_UI_UX_ACCEPTANCE_PASS`

## Purpose

This checklist defines the final human UI/UX acceptance pass for the Phase 1 public free index-lighting website.

It is not a new product-design expansion. It exists to verify that a first-time general investor can:

- understand the market or symbol state in 30 seconds;
- review reason, risk, update time, data boundary, and next observation in 3 minutes;
- see that the site is an information and risk-identification tool, not investment advice;
- understand that current public runtime remains demonstrative / mock-only until real-data promotion is separately approved.

## Must Pass Before Phase 1 Public Acceptance

The human reviewer should check these routes:

- `/`
- `/briefing`
- `/weekly`
- `/membership`
- `/methodology`
- `/disclaimer`
- `/terms`
- `/privacy`
- `/stocks/TWII`
- `/stocks/2330`
- `/stocks/0050`

Required public understanding:

- The first screen clearly states the page purpose.
- The user can identify the market or symbol status without reading internal documentation.
- The route contains visible 30-second and 3-minute reading cues where the route is a product decision surface.
- The route explains reason, risk, update time, data boundary, or next observation before pushing the user into secondary content.
- The route clearly states demonstrative-data / mock-boundary language where market signals appear.
- The route clearly states non-investment-advice / no-buy-sell-advice language.
- The route does not expose developer-process wording, command snippets, local file paths, A-lane labels, SQL/Supabase operational terms, `publicDataSource`, `scoreSource`, raw payload terms, or mojibake.
- The membership route is clearly Phase 2 planning only, not live login, payment, persisted watchlist, personalized alert, or member-only content implementation.

## Final Polish Allowed In This Pass

Only polish that directly improves Phase 1 comprehension, trust, accessibility, or first-screen decision flow is allowed:

- route heading clarity;
- confusing card order;
- missing source/update-time/non-advice context near a signal;
- text that is too technical for a general investor;
- mobile text overlap or unreadable stacking;
- visible stale development wording or mojibake.

## Deferred Until After Phase 1 Acceptance

These items must not block Phase 1 public acceptance:

- full brand art direction;
- new illustrations, motion, animation, or decorative redesign;
- member dashboard UI;
- login, payment, persisted watchlist, custom alerts, or member-only gates;
- full real-data promotion;
- complete Taiwan-stock coverage;
- Supabase writes, SQL, ingestion, backfill, or `daily_prices` mutation;
- publicDataSource promotion to Supabase;
- scoreSource promotion to real.

## Automated Evidence Required Before Human Acceptance

The following checks should be green before the human reviewer makes the final call:

- `check:phase-1-public-beta-final-readiness-rollup`
- `check:phase-1-public-beta-human-visual-review`
- `check:phase-1-public-beta-visual-acceptance-and-a3-handoff`
- `check:phase-1-public-beta-chairman-visual-acceptance-record`
- `check:public-beta-core-route-quick-proof`
- `check:public-surface-user-facing-audit`
- `check:public-visible-language-quality`
- `check:phase-1-public-beta-public-visible-residue-cleanup`
- `npx tsc --noEmit`

## Acceptance Result Options

Use one of these results:

- `ACCEPT_PHASE_1_MOCK_ONLY_PUBLIC_UI_UX`
- `ACCEPT_WITH_DEFERRALS_PHASE_1_MOCK_ONLY_PUBLIC_UI_UX`
- `REPAIR_REQUIRED_BEFORE_PHASE_1_PUBLIC_ACCEPTANCE`

Acceptance does not authorize:

- real-data promotion;
- SQL;
- Supabase write;
- `daily_prices` mutation;
- raw market-data fetch/store/commit;
- secrets or raw payload output;
- investment advice claims;
- Phase 2 membership runtime implementation.

## Current Recommendation

PM should run the final human UI/UX acceptance pass using this checklist after the automated final readiness rollup remains green on local and Vercel.

If a reviewer finds a comprehension, trust, accessibility, or first-screen decision-flow defect, repair that defect directly. Otherwise, move to chairman/operator acceptance or A3 no-secret platform checklist.
