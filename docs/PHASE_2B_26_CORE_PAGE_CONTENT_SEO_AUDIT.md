# Phase 2B.26 Core Page Content SEO Audit

Date: 2026-07-04

Owner: CEO / PM mainline

Status: `phase_2b_26_core_page_content_seo_audit_ready`

## Purpose

Audit the first core pages that Google Search Console reports as crawled or discovered but not yet indexed.

This slice answers one question:

```text
Do the current core pages make their independent value clear enough for users and Google?
```

This is an audit slice only. It does not rewrite runtime pages, change sitemap policy, open stock-route indexing, add analytics, add ads, fetch market data, write Supabase, or change scoring.

## Input Evidence

Source: PM supplied GSC screenshots and repo inspection after Phase 2 public IA deployment.

```text
productionDomain=https://market-signal.opensignallab.com/
gscIndexedCount=1
gscNotIndexedCount=17
gscReasonObserved=crawled_currently_not_indexed
affectedCoreExamples=/methodology,/stocks,/markets
sitemapSubmitted=true
sitemapStatus=success
phase2SitemapLive=true
stockRouteIndexing=keep_existing_gated_scope
globalRouteIndexing=gated
nonTaiwanMarketIndexing=gated
```

## Audit Summary

| Route | Page role | Current SEO state | Indexing risk | Priority |
|---|---|---|---|---|
| `/markets` | Market Explorer | Has metadata and clear H1, but page can still read like a market directory. | Google may treat it as a thin navigation/listing page unless its unique role is explicit. | P0 |
| `/stocks` | Target Finder | Has metadata and H1, but much of the value is an interactive search component. | Google may see limited static content and not enough route-level explanation. | P0 |
| `/methodology` | Evidence / Methodology | Has unique methodology content and structured explanation. | Valuable, but should make the plain-language promise clearer above the fold. | P1 |

## Route-Level Findings

### `/markets`

Current role:

```text
Market Explorer
```

This page should answer:

```text
Which markets exist in Market Signal, which are production-ready, and where should I go to explore a specific market?
```

Current strengths:

- Clear route ownership: this is the full market explorer, not the homepage.
- Taiwan is marked as the current production market.
- Planned markets are separated from the production market.
- Global Composite remains honest and inactive.

Current SEO risk:

- The route can still look like a directory of cards.
- Planned market entries may dilute the Taiwan production signal.
- Google may not immediately see why `/markets` is meaningfully different from `/`.

Recommended next content patch:

```text
phase_2b_27_core_page_content_patch
route=/markets
```

Patch intent:

- Add a short static explanation near the top:
  - what Market Explorer is
  - why Taiwan is the only production market now
  - why planned markets do not show mock scores
  - when Global Composite unlocks
- Add a compact "how to use this page" section.
- Strengthen internal links to `/markets/tw` and `/stocks`.
- Do not add a full dashboard, rankings, or non-Taiwan market SEO claims.

### `/stocks`

Current role:

```text
Target Finder
```

This page should answer:

```text
How do I search Taiwan stocks, ETFs, and indices, and how does target observation differ from market overview?
```

Current strengths:

- Route purpose is already distinct from `/markets`.
- The search / watchlist interface is valuable for users.
- Metadata states the Taiwan stock, ETF, and index search scope.

Current SEO risk:

- The page depends heavily on an interactive component.
- Above-fold static content may not be enough for Google to understand route value.
- It may be seen as a thin search utility page unless the static route copy explains scope, examples, and boundaries.

Recommended next content patch:

```text
phase_2b_27_core_page_content_patch
route=/stocks
```

Patch intent:

- Add a short static explanation of supported target types:
  - Taiwan stocks
  - ETFs
  - indices
- Explain that watchlist and rankings are observation tools, not investment advice.
- Add example query language such as `2330`, `0050`, and `TWII`.
- Keep full stock route indexing closed; do not expose every `/stocks/[symbol]` route through SEO.

### `/methodology`

Current role:

```text
Evidence / Methodology
```

This page should answer:

```text
How does Market Signal explain scores, risk, confidence, and evidence without giving investment advice?
```

Current strengths:

- The page is the strongest candidate for unique content.
- It already explains QMV1 / Signal Framework status, traceability, and non-investment-advice boundaries.
- It links methodology to explainability and auditability.

Current SEO risk:

- The page can read too internal if the first screen emphasizes framework status before the user benefit.
- It should lead with plain-language value:
  - why a score exists
  - why it is not a prediction
  - how explanations trace back to rules, sources, and values

Recommended next content patch:

```text
phase_2b_27_core_page_content_patch
route=/methodology
```

Patch intent:

- Strengthen the opening paragraph around:
  - "why today is this score"
  - "how evidence is traced"
  - "why this is not investment advice"
- Add a concise component overview if missing from the visible first screen.
- Keep methodology governance language, but avoid making the page feel like an internal audit memo.

## Recommended Execution Order

### P0

Implement a small content patch for:

```text
/markets
/stocks
```

Reason:

- These are the most likely to be treated as navigation/search utility pages.
- They need more static route-level value without changing IA.

### P1

Implement a small content patch for:

```text
/methodology
```

Reason:

- The page has strong unique content already, but the opening should be more user-facing.

### P2

After deployment:

- Let sitemap recrawl naturally.
- Do not mass request indexing.
- Optionally request indexing only for the patched core pages if PM/CEO wants a controlled manual nudge.

## Explicit Holds

```text
runtimePagePatch=false
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

## Completion Criteria

This audit is complete when:

- The three GSC example routes are classified.
- Each route has a route role, current strength, indexing risk, and next content patch recommendation.
- The next slice is explicitly defined as `phase_2b_27_core_page_content_patch`.
- No runtime, UI, sitemap, GSC, stock-indexing, analytics, ads, Supabase, SQL, market-data, or scoring changes are authorized.

## Next Recommended Slice

```text
nextRecommendedSlice=phase_2b_27_core_page_content_patch
patchRoutes=/markets,/stocks,/methodology
patchMode=small_static_content_only
```

