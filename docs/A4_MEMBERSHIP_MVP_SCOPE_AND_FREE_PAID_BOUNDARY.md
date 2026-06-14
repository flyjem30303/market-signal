# A4 Membership MVP Scope And Free Member Boundary

Updated: 2026-06-14

Status: `a4_membership_mvp_scope_and_free_paid_boundary_ready`

Owner: A4 Membership / Conversion Planning

## Purpose

This artifact turns the revised `指數燈號網站 BRIEF` into a Phase 2 membership MVP boundary that PM can safely use later.

Phase 2 membership MVP planning-only work may proceed in parallel at a small capacity, but Phase 1 public/free site remains the mainline.

This document does not approve login, payment, persisted watchlists, personalized alert execution, member-only content gating, SQL, Supabase writes, raw market-data fetches, `publicDataSource=supabase`, or `scoreSource=real`.

## CEO Decision

The revised BRIEF is accepted with a two-phase execution split:

- Phase 1 public/free site remains the mainline.
- Phase 2 membership MVP planning-only may continue in parallel.
- A4 uses about 5% capacity and must not slow PM, A1, A2, or A3 work needed for Phase 1 public Beta readiness.
- Membership design should make the product direction clearer, not expand the immediate runtime scope.

## Phase 1 Public Free Scope

Phase 1 must be useful to all visitors without login:

- market overview signal;
- core index and ETF state summaries;
- basic indicator summary;
- risk reminder;
- update time and freshness state;
- methodology and non-investment-advice disclosure;
- source/data boundary wording;
- membership preview only.

The Phase 1 page goal is still: a visitor can understand the market mood in about 30 seconds and decide whether to observe, review, or reduce risk in about 3 minutes.

## Phase 2 Membership MVP Scope

Phase 2 membership MVP may include:

- 每日市場三層解讀;
- 自選追蹤（watchlist）;
- 自訂警示條件;
- 盤後複盤報告;
- historical light-state context;
- conversion metrics and retention metrics;
- member-safe explanatory content that remains non-investment-advice.

The first implementation should stay narrow: one member content page shape, one watchlist behavior, one alert condition, one post-market review structure, and one analytics event set.

## Free/Member Boundary

| Area | Free public site | Member MVP |
| --- | --- | --- |
| Market state | Current public market light and basic status | Deeper reason path behind a light change |
| Indicators | Core public indicator summary | Key indicator change explanation and historical context |
| Risk reminder | Short neutral risk note | Scenario-based observation notes |
| Updates | Update time and freshness boundary | Saved review context and later comparison |
| Watchlist | Preview only | 自選追蹤（watchlist） for selected indices, ETFs, or indicators |
| Alerts | Preview only | One 自訂警示條件 MVP |
| Review | Basic page-level context | 盤後複盤報告 and observation checklist |
| Metrics | Public CTR and route views | conversion metrics, member content reading rate, watchlist usage, post-market review return rate |

## Member MVP Content Shape

每日市場三層解讀 should use this neutral structure:

1. Market overview: what the light is saying now.
2. Key changes: which indicators changed and why they matter.
3. Next observations: what to watch next without giving buy/sell advice.

盤後複盤報告 should use this neutral structure:

1. Today light and main market context.
2. What changed since the prior session.
3. What signals were useful or noisy.
4. What to observe next session.
5. Non-investment-advice reminder.

## Stop Lines

Phase 1 must not implement:

- no login implementation during Phase 1;
- no payment implementation during Phase 1;
- no persisted watchlist during Phase 1;
- no personalized alert execution during Phase 1;
- no member-only content gating during Phase 1.

The full project remains inside these data and trust boundaries unless separately approved:

- no SQL execution;
- no Supabase write;
- no staging row creation;
- no `daily_prices` mutation;
- no raw market-data fetch, store, or commit;
- no secret output;
- keep `publicDataSource=mock`;
- keep `scoreSource=mock`;
- no direct buy/sell instruction;
- no promised-return claim.

## PM Integration Rule

PM may use this artifact to adjust `/membership`, public conversion copy, and the Phase 2 roadmap. PM must not treat it as approval to implement account, payment, personalized storage, or member-only gating.

A2 should review member wording before runtime implementation. A3 should review hosting, auth, and rollback implications before any Phase 2 deployment work. A1 should continue data-source and coverage work separately.

## Completion Definition

This A4 planning slice is complete when:

- the free/member boundary is explicit;
- the Phase 2 membership MVP scope is narrow;
- Phase 1 remains the current mainline;
- the stop lines are documented;
- publicDataSource and scoreSource remain mock;
- the checker is registered in package scripts and review gate.

## Next Route

`phase_1_public_readability_then_a4_membership_scope_review`
