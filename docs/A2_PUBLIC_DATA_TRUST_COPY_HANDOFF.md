# A2 Public Data Trust Copy Handoff

Status: `a2_public_data_trust_copy_handoff_ready`
Updated: 2026-06-10
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Integration owner: PM mainline
Mode: `local_only_background_copy_inventory`

## Scope

This handoff inventories public-page and public-document copy that may cause users to misunderstand the current data state. It is intentionally local-only and copy-only.

This document does not change runtime behavior, route rendering, source approval, scoring, evidence gates, data ingestion, deployment, or PM mainline state.

## Non-Executable Boundary

- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not fetch, import, store, commit, or print raw market data.
- Do not read or output secrets.
- Do not touch PM mainline data gate files.
- Do not touch A1 data evidence or source-rights artifacts.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not claim complete coverage, live market freshness, real-source approval, provider redistribution approval, validated forecast quality, or investment advice.

## Sources Reviewed

- Public routes: `/`, `/briefing`, `/weekly`, `/stocks/[symbol]`, `/methodology`, `/disclaimer`, `/privacy`, `/terms`.
- Shared trust surfaces:
  - `src/lib/public-runtime-boundary-copy.ts`
  - `src/lib/public-claim-runtime-state.ts`
  - `src/components/public-runtime-state-strip.tsx`
  - `src/components/trust-runtime-boundary-notice.tsx`
  - `src/components/data-freshness-strip.tsx`
  - `src/components/stock-runtime-at-a-glance.tsx`
  - `src/components/stock-seo-content.tsx`
  - `src/app/layout.tsx`
- Prior A2 references:
  - `docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md`
  - `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md`

## Current Public Trust Baseline

- The intended runtime posture is visible in several shared surfaces: `publicDataSource=mock`, `scoreSource=mock`, mock-only public Beta, non-investment-advice, partial coverage, missing/delayed data, and blocked real-score promotion.
- `/briefing` and stock pages have many explicit stop lines such as mock scores, not recommendations, not live data, and no real score promotion.
- `TrustRuntimeBoundaryNotice` gives a usable cross-route trust baseline for methodology, disclaimer, privacy, terms, and weekly pages.
- Footer copy in `src/app/layout.tsx` reinforces mock-only Beta and non-investment-advice, but some labels remain visually corrupted or too internal-facing.

## Most Likely User Misunderstandings

| Surface | Why users may misunderstand | Risk level | Recommended A2/PM action |
|---|---|---:|---|
| Shared public state strip: `src/lib/public-claim-runtime-state.ts` via `PublicRuntimeStateStrip` | The shared state object preserves mock-only flags, but much of the visible text is mojibake. Users may miss the central message that public claims are not approved and data/score sources remain mock. | P0 | Replace shared state strip copy with PM-approved readable Chinese before public launch. Keep exact `publicDataSource=mock` and `scoreSource=mock` stop lines. |
| Data freshness strip: `src/components/data-freshness-strip.tsx` | This component mixes metadata, source labels, freshness interpretation, and stop lines, but visible labels/body include mojibake. Users may read freshness metadata as live-data approval or data-quality proof. | P0 | Add a reader-facing distinction: metadata is display context, not live market-data approval, not data-quality acceptance, and not real score authorization. |
| `/weekly` route-local hero, cadence, market brief, links, and disclaimer | Shared trust notice exists, but first-screen and route-local text contains mojibake. Users may not understand that weekly summaries are product-flow readings, not complete coverage or advice. | P0 | Bounded copy-only patch for `/weekly` after PM phrase-set approval. Keep cadence wording simple and repeat mock-only/non-advice in the first screen. |
| `/methodology` route-local method modules and quick-read copy | The page is where users will infer model credibility. Mojibake and internal terms make it unclear that mock scores are not formal model conclusions or validated forecasts. | P0 | Rewrite route-local methodology copy so every score/module section says mock model, not validated forecast, not personalized recommendation, and coverage may be partial. |
| `/disclaimer`, `/privacy`, `/terms` route-local legal copy | `TrustRuntimeBoundaryNotice` is clear, but surrounding hero/legal cards remain corrupted. Users may not trust the legal/disclosure pages or may miss no-secret/no-raw-data/no-advice boundaries. | P0 | Patch legal route-local text with readable Chinese. Treat unreadable trust/legal copy as launch-blocking even if shared notice exists. |
| `/briefing` route-local action summaries and watchlists | Many stop lines are present and mostly clear, but English/internal wording remains dense: "promotion gate", "Supabase writes", "ingestion/backfill", and "runtime". Users may understand the internal blocker but not the practical meaning. | P1 | Keep explicit technical stop lines in detail areas, but add adjacent reader-facing phrasing: "目前還沒有切換真實資料來源，也沒有把分數當成正式投資訊號。" |
| `/stocks/[symbol]` and stock SEO content | Stock pages are stronger than most surfaces, but score/ranking/news context can still look actionable. Some English text reads like a product explainer and may be quoted out of context. | P1 | Keep a local non-advice line near each score cluster and rank/news/context block. Avoid "latest" unless it clearly says mock/local sample. |
| Footer/site chrome | Footer repeats mock-only concepts, but labels are corrupted and visible on every route. | P1 | Patch footer labels and trust links; use it as the site-wide fallback disclosure. |
| Internal terms shown on public pages | "Supabase", "promotion gate", "row coverage", "runtime", and "scoreSource" are useful for auditability but can confuse public users. | P2 | Keep exact flags in technical disclosure cards; translate their meaning into plain public copy nearby. |

## Launch-Blocking Copy Recommendations

These should block public launch until fixed or explicitly accepted by PM:

1. Replace mojibake in first-screen public copy on `/weekly`, `/methodology`, `/disclaimer`, `/privacy`, `/terms`, footer, shared public state strip, and data freshness strip.
2. Make the shared `PublicRuntimeStateStrip` readable because it is reused across trust surfaces and is currently the most central boundary component.
3. Ensure every public score/action/ranking/watchlist area has a nearby limitation: mock score, may be partial/stale/delayed/unavailable, not validated forecast, not buy/sell/hold, not personalized advice.
4. Clarify that freshness metadata is not live market-data approval, not source-rights approval, and not data-quality acceptance.
5. Clarify that partial coverage means symbols/rows/time ranges may be missing and the UI should not imply complete market coverage.
6. Keep source-rights language generic until PM/legal/A1 approve source-specific public wording.
7. Keep `publicDataSource=mock` and `scoreSource=mock` visible in technical disclosure areas; do not hide these behind friendly copy.
8. Remove or explain internal-only terms when they appear in public hero or primary route copy.

## Suggested Launch-Safe Phrase Set

Use these as A2 draft phrases for PM review:

- Mock-only state: `目前公開 Beta 仍為 mock-only 狀態，畫面資料與分數用於流程展示，不代表真實市場資料已上線。`
- Score state: `目前顯示的是 mock score，不能視為買進、賣出、持有、目標價或個人化投資建議。`
- Freshness state: `資料新鮮度區塊只說明目前畫面資料的顯示狀態，不代表即時行情、來源權利或資料品質已通過正式審核。`
- Coverage state: `目前資料覆蓋仍不完整，部分股票、ETF、指數或日期區間可能缺漏，畫面不代表完整市場覆蓋。`
- Source-rights state: `資料來源與使用權利仍需 PM/A1/D gate 確認，正式來源、授權、保存、公開展示與商業使用尚未全部核准。`
- Non-advice state: `本網站提供研究與決策輔助介面，不提供個人化投資建議；任何投資決策仍需自行判斷風險。`
- Technical stop line: `publicDataSource=mock，scoreSource=mock；在 PM/A1/legal gates 通過前，不得切換真實資料來源或真實分數。`

## Can Be Deferred UI Polish

- Typography, spacing, and visual hierarchy after readable copy lands.
- Tooltip explanations for dense terms after first-screen language is fixed.
- Component consolidation of repeated trust copy after PM freezes phrase set.
- Screenshot annotation and visual QA after route-local copy is no longer corrupted.
- English/Chinese style harmonization across secondary cards after launch blockers are closed.

## Recommended Next A2 Slice

Priority order:

1. Shared components first: `public-claim-runtime-state.ts`, `data-freshness-strip.tsx`, footer labels in `layout.tsx`.
2. High-trust public routes: `/weekly`, `/methodology`, `/disclaimer`, `/privacy`, `/terms`.
3. Product interpretation routes: `/briefing`, `/stocks/[symbol]`, stock SEO/action/ranking blocks.
4. Deferred polish: wording density, tooltip terms, style harmonization, screenshots.

Keep each slice copy-only and update only the smallest relevant checker if PM asks for automated enforcement.

## PM Intake Checklist

- Confirm this handoff is local-only and did not execute SQL, connect to Supabase, write Supabase, fetch/import/store raw market data, read secrets, or touch PM/A1 gate artifacts.
- Decide whether A2 should patch shared trust components first or start with a route-level public page.
- Approve the launch-safe phrase set or provide replacements.
- Confirm that unreadable legal/trust copy is launch-blocking.
- Keep real-source, coverage percentage, freshness timestamp, and real-score wording behind PM/A1/legal/investment gates.
