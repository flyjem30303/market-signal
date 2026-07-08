# Phase 2B.28 Core Page Post-Deploy Observation

Date: 2026-07-08

Owner: CEO / PM mainline

Status: `phase_2b_28_core_page_post_deploy_observation_ready`

## Purpose

Record the first post-deploy observation baseline after Phase 2B.27 core page content patch reached production.

This slice is intentionally observation-only. It does not change sitemap scope, request indexing for all pages, open full stock-route SEO, add analytics, add ads, fetch market data, write Supabase, run SQL, or change scoring.

## Production Observation Baseline

Observed production host:

```text
https://market-signal.opensignallab.com
```

Observed at:

```text
2026-07-08
```

Core route status:

| Route | HTTP status | Production note |
|---|---:|---|
| `/` | 200 | Homepage reachable. |
| `/markets` | 200 | Market Explorer reachable. |
| `/markets/tw` | 200 | Taiwan market explanation page reachable. |
| `/stocks` | 200 | Target Finder reachable. |
| `/methodology` | 200 | Methodology page reachable. |

Phase 2B.27 copy presence:

| Route | Expected content | Result |
|---|---|---|
| `/markets` | `如何使用市場入口` | present |
| `/stocks` | `這頁可以搜尋什麼` | present |
| `/methodology` | `為什麼今天是這個分數` | present |

Sitemap baseline:

| Route | Sitemap status |
|---|---|
| `/` | listed |
| `/markets` | listed |
| `/markets/tw` | listed |
| `/stocks` | listed |
| `/methodology` | listed |

Observed sitemap URL count:

```text
urlCount=26
```

## GSC Interpretation

Current GSC observation should be interpreted with this hierarchy:

1. URL Inspection is route-specific and can show a page is crawlable or already indexed.
2. Sitemap discovery confirms Google has a current URL inventory.
3. Pages report is an aggregate report and may lag behind URL Inspection and sitemap submission.

Therefore, a slow Pages report is not by itself a reason to change sitemap structure, resubmit repeatedly, or request indexing for every URL.

## Recommended GSC Handling

Use controlled observation:

```text
requestIndexingAllPages=false
repeatSitemapSubmissionNow=false
massUrlInspection=false
waitObservationWindow=48-72h
```

If PM wants a manual nudge, only core patched pages are eligible:

```text
manualRequestEligible=/markets,/stocks,/methodology
```

Do not request indexing for all stock detail routes.

## Decision Tokens

```text
phase_2b_28_core_page_post_deploy_observation_ready
observedHost=https://market-signal.opensignallab.com
observedDate=2026-07-08
coreRoutes200=true
phase2b27CopyPresent=true
coreRoutesInSitemap=true
sitemapUrlCount=26
pagesReportLagAccepted=true
requestIndexingAllPages=false
repeatSitemapSubmissionNow=false
sitemapExpansionNow=false
stockRouteIndexing=keep_existing_gated_scope
globalRouteIndexing=gated
nonTaiwanMarketIndexing=gated
analyticsRuntime=false
adRuntime=false
supabaseWrite=false
sqlExecution=false
marketDataFetch=false
scoringChange=false
runtimePromotion=false
nextRecommendedSlice=phase_2b_29_content_seo_next_action_selector
```

## Next Decision Point

After 48-72 hours, PM should classify GSC status:

| Outcome | Next action |
|---|---|
| Core pages start indexing | Continue content SEO planning. |
| Core pages remain `crawled_currently_not_indexed` | Consider a second content-depth patch, not sitemap churn. |
| Duplicate/canonical issues appear | Fix canonical first. |
| Sitemap discovery drops or core pages disappear | Run technical indexability audit again. |
| Stock detail pages appear as a large issue | Keep stock route indexing gated and review only representative examples. |

## Explicit Non-Goals

- No runtime UI patch.
- No metadata rewrite.
- No sitemap expansion.
- No all-page manual indexing request.
- No stock detail route SEO opening.
- No non-Taiwan market SEO exposure.
- No `/global` exposure.
- No analytics runtime.
- No ads runtime.
- No Supabase write.
- No SQL execution.
- No market data fetch.
- No scoring or methodology runtime change.

## Completion Criteria

This slice is complete when:

1. The production observation baseline is recorded.
2. Core routes and sitemap status are captured.
3. GSC handling rules are explicit.
4. A checker verifies the observation contract and closed boundaries.
5. Phase 2B handoff status points to the next SEO decision slice.

