# Phase 2B.27 Core Page Content Patch

Date: 2026-07-05

Owner: CEO / PM mainline

Status: `phase_2b_27_core_page_content_patch_ready`

## Purpose

Apply the small static content patch recommended by Phase 2B.26 for the core pages that Google Search Console surfaced under `crawled_currently_not_indexed`.

This slice strengthens route-level value for:

```text
/markets
/stocks
/methodology
```

It does not expand sitemap scope, open stock-route indexing, request indexing for all pages, add analytics, add ads, fetch market data, write Supabase, or change scoring.

## Patch Summary

| Route | Patch | Reason |
|---|---|---|
| `/markets` | Added a compact "How to use" static section and clearer metadata description. | Makes the page a Market Explorer, not just a card directory. |
| `/stocks` | Added a static search-scope section with examples for stocks, ETFs, and index targets. | Gives Google and users route-level value beyond the interactive search component. |
| `/methodology` | Strengthened the opening copy and metadata around "why today is this score" and traceable explanation. | Makes the page promise clearer before governance details. |

## `/markets` Patch

Added:

```text
How to use
如何使用市場入口
這頁負責完整市場探索，不取代首頁的每日摘要。
台灣市場頁
標的觀察入口
```

The page now explicitly says:

- `/markets` is the complete market explorer.
- Taiwan is the current production market.
- Planned markets do not show mock scores as public signals.
- Global Composite and cross-market rankings require at least 2 production markets.
- Users can enter `/markets/tw` for market explanation or `/stocks` for target observation.

## `/stocks` Patch

Added:

```text
Search Scope
這頁可以搜尋什麼？
2330、0050 或 TWII
股票
ETF
指數
完整股票頁索引仍維持 gated
```

The page now explicitly says:

- Search supports Taiwan listed stocks, ETFs, and major indices.
- The page is an entry point into target observation.
- Watchlist and rankings are observation aids, not investment advice.
- Full stock route indexing remains gated.

## `/methodology` Patch

Added / strengthened:

```text
這頁說明「為什麼今天是這個分數」。
可追溯的方法論
市場分數、風險、信心度與資料邊界
不是投資建議
```

The page now opens with a more user-facing promise before deeper governance language.

## Explicit Holds

```text
requestIndexingAllPages=false
repeatSitemapSubmissionNow=false
sitemapExpansionNow=false
stockRouteIndexing=keep_existing_gated_scope
globalRouteIndexing=gated
nonTaiwanMarketIndexing=gated
globalRoutePublicExposure=false
mockMarketPublicSeo=false
analyticsRuntime=false
adRuntime=false
supabaseWrite=false
sqlExecution=false
marketDataFetch=false
scoringChange=false
runtimePromotion=false
```

## Post-Deploy Recommendation

After merge and deployment:

1. Confirm `/markets`, `/stocks`, and `/methodology` return 200.
2. Confirm the new static copy appears in production.
3. Let sitemap recrawl naturally.
4. Do not request indexing for all pages.
5. If PM/CEO wants a controlled nudge, request indexing only for these patched core pages.

## Completion Criteria

This slice is complete when:

- `/markets` contains a static "How to use" explanation.
- `/stocks` contains a static "Search Scope" explanation.
- `/methodology` explains that the page answers why today's score is what it is.
- A checker verifies the added route-level content and explicit holds.
- TypeScript and build checks pass.

## Next Recommended Slice

```text
nextRecommendedSlice=phase_2b_28_core_page_post_deploy_observation
```

