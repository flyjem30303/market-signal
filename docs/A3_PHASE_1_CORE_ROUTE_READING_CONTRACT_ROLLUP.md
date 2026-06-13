# A3 Phase 1 Core Route Reading Contract Rollup

Updated: 2026-06-14

Status: `a3_phase_1_core_route_reading_contract_rollup_ready`

Owner: A3 Launch / Production Engineering

## Purpose

This rollup proves that the Phase 1 public routes share one user-facing reading contract before public Beta launch review.

Core Public Reading Contract: Home, Briefing, and Stock routes share one public reading contract. A general investor should be able to finish a 30 秒快讀, then use a 3 分鐘複核 path to decide whether to observe, review, or reduce risk.

This is launch evidence for the Phase 1 public free index-lighting site. It does not authorize real-data promotion or Phase 2 member functionality.

## Route Contract

| Route | URL | Required public reading contract |
| --- | --- | --- |
| Home | / | 30 秒快讀 market mood, 3 分鐘複核, 資料時間, 下一步觀察. |
| Briefing | /briefing | 30 秒快讀 market context, 3 分鐘複核, 資料時間, 下一步觀察. |
| Stock | /stocks/2330 | 30 秒快讀 stock / index state, 3 分鐘複核, 資料時間, 下一步觀察. |

## Phase Boundary

- Phase 1 public free index-lighting site remains the active launch scope.
- Phase 2 membership remains deferred: login, payment, member-only interpretation, persisted watchlist, custom alert execution, and post-market member archive are not launch blockers.
- Data posture remains mock.
- Score posture remains mock.
- The public page can mention that formal market data is not yet enabled, but it must not claim live, official, complete, or real-time market data.

## Required Evidence

- `cmd.exe /c npm run check:public-beta-decision-loop-bridge`
- `cmd.exe /c npm run check:public-beta-production-brief-alignment`
- `cmd.exe /c npm run check:a3-phase-1-core-route-reading-contract-rollup`

## Stop Lines

- No SQL execution occurred.
- No Supabase read/write occurred.
- No staging row was created.
- No `daily_prices` mutation occurred.
- No raw market-data fetch, ingest, storage, logging, or commit occurred.
- `publicDataSource=supabase` remains a stop line.
- `scoreSource=real` remains a stop line.
- This rollup does not provide investment advice, buy/sell recommendations, guaranteed returns, or official endorsement.

## A3 Launch Linkage

This rollup must be present before a future `GO` or `GO_WITH_DEFERRALS` recommendation. It bridges product readability and launch engineering: route health alone is insufficient unless the public user can understand the market state and the next observation step.

## Next Route

`keep_phase_1_release_candidate_public_smoke_report_current`
