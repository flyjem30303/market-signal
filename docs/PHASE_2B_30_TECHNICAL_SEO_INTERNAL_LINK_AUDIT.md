# Phase 2B.30 Technical SEO / Internal Link Audit

Date: 2026-07-08

Owner: CEO / PM mainline

Status: `phase_2b_30_technical_seo_internal_link_audit_ready`

## Purpose

Audit the technical SEO and internal-link surface after Phase 2B.29 selected this as the next safe SEO slice.

This is audit-only. It answers:

```text
目前核心頁的 canonical、hreflang、metadata、structured data、robots、sitemap 與內部連結是否足夠一致？
```

It does not patch runtime metadata, change sitemap scope, request indexing, modify UI, alter scoring, write Supabase, execute SQL, fetch market data, add analytics, add ads, or expose gated global/mock routes.

## Input Evidence

Source files inspected:

| Surface | Evidence |
|---|---|
| Sitemap | `src/app/sitemap.ts` |
| Robots | `src/app/robots.ts` |
| Root metadata | `src/app/layout.tsx` |
| SEO helpers | `src/lib/seo.ts`, `src/lib/site.ts`, `src/lib/i18n/metadata.ts`, `src/lib/i18n/routes.ts` |
| Navigation | `src/components/site-nav.tsx`, `src/components/site-footer.tsx`, `src/components/homepage-global-shell.tsx` |
| Representative routes | `/`, `/markets`, `/markets/tw`, `/stocks`, `/methodology`, `/en`, `/en/markets`, `/en/markets/tw`, `/en/stocks`, `/en/methodology` |

Current known GSC context:

```text
pagesReportLagAccepted=true
gscWaitingDoesNotBlockSeoPlanning=true
stockRouteIndexing=keep_existing_gated_scope
globalRouteIndexing=gated
nonTaiwanMarketIndexing=gated
```

## Audit Summary

| Area | Status | Finding |
|---|---|---|
| Robots | Pass | `robots.ts` allows public routes and disallows internal/watchlist/member surfaces. |
| Sitemap | Pass | `sitemap.ts` emits i18n route keys and keeps stock routes behind `getSeoStockSitemapAssets(...)` gate. |
| Stock route gate | Pass | Full stock route indexing remains capped/gated; no all-stock SEO opening. |
| Internal links | Pass | Header, footer, homepage, markets, market detail, stocks, and methodology create a crawlable Guide -> Explore -> Explain path. |
| Canonical / hreflang consistency | Needs patch | Some core pages use plain `Metadata` instead of `buildRouteMetadata(...)` plus `buildI18nAlternates(...)`. |
| OpenGraph consistency | Needs patch | Same plain-metadata pages do not define route-specific OpenGraph URL/title/description/image. |
| Structured data coverage | Needs patch | Home and methodology have WebPage/Breadcrumb JSON-LD; markets/stocks/detail English variants are less consistent. |
| English locale metadata | Needs patch | English pages have alternates in several places, but OpenGraph locale and route metadata are not uniformly localized. |

## Route-Level Findings

| Route | Role | Current evidence | Risk | Recommendation |
|---|---|---|---|---|
| `/` | Global Decision Entry | Uses `buildRouteMetadata`, `buildI18nAlternates("home")`, and `SeoJsonLd`. | Low | Keep. |
| `/en` | English Global Decision Entry | Uses `buildRouteMetadata`, `buildI18nAlternates("home", "en")`, and `SeoJsonLd`. | Medium | In 2B.31, verify/patch English OpenGraph locale and description if needed. |
| `/markets` | Market Explorer | Uses plain `Metadata` title/description. Internal links to `/markets/tw` and `/stocks`. | High | In 2B.31, migrate to `buildRouteMetadata({ path: "/markets" })`, add `buildI18nAlternates("markets")`, and consider WebPage/Breadcrumb JSON-LD. |
| `/en/markets` | English Market Explorer | Uses plain `Metadata` plus `buildI18nAlternates("markets", "en")`. | Medium | In 2B.31, align with route metadata helper and English OG locale. |
| `/markets/tw` | Market Explanation | Uses `buildRouteMetadata`, `buildI18nAlternates("marketTw")`, and strong internal links to `/weekly`, `/stocks/TWII`, `/methodology`. | Medium | Add WebPage/Breadcrumb JSON-LD in a later patch if needed; keep content structure. |
| `/en/markets/tw` | English Market Explanation | Uses `generateMetadata`, `buildRouteMetadata`, `buildI18nAlternates("marketTw", "en")`, and `notFound()` for unsupported markets. | Low | Keep route gate; consider JSON-LD parity later. |
| `/stocks` | Target Finder | Uses plain `Metadata` title/description and full search UI. | High | In 2B.31, migrate to `buildRouteMetadata({ path: "/stocks" })`, add `buildI18nAlternates("stocks")`, and consider WebPage/Breadcrumb JSON-LD. |
| `/en/stocks` | English Target Finder | Uses plain `Metadata` plus `buildI18nAlternates("stocks", "en")`. | Medium | In 2B.31, align with route metadata helper and English OG locale. |
| `/methodology` | Evidence / Methodology | Uses `buildRouteMetadata`, `buildI18nAlternates("methodology")`, and `SeoJsonLd`. | Low | Keep. |
| `/en/methodology` | English Evidence / Methodology | Uses plain `Metadata` plus `buildI18nAlternates("methodology", "en")`. | Medium | In 2B.31, align with route metadata helper and consider JSON-LD parity. |

## Internal Link Findings

Current crawl paths:

| Path | Status |
|---|---|
| Header -> `/`, `/markets`, `/stocks`, `/weekly`, `/methodology` | Pass |
| Footer -> `/`, `/markets`, `/stocks`, `/weekly`, `/methodology`, trust pages | Pass |
| Home -> `/markets`, `/stocks`, `/methodology`, `/markets/tw` | Pass |
| `/markets` -> `/markets/tw`, `/stocks` | Pass |
| `/markets/tw` -> `/weekly`, `/stocks/TWII`, `/methodology` | Pass |
| `/stocks` -> `/stocks/[symbol]` via search UI | Pass for users; SEO for all-stock detail routes remains intentionally gated |
| Language switcher -> matching zh/en routes | Pass for public route keys and market detail route pattern |

Conclusion:

```text
internalLinkPatchNeeded=false
```

The current internal-link structure is good enough for the public core route set. The next highest-value patch is metadata/canonical/hreflang consistency, not link rewriting.

## Technical SEO Findings

### Canonical / Hreflang

The i18n route registry is the right source of truth:

```text
I18N_ROUTE_KEYS=home,markets,marketTw,stocks,weekly,methodology,disclaimer,terms,privacy
```

Sitemap alternates are generated from the same route registry. This is good.

Gap:

```text
routeMetadataHelperNotUniversal=true
```

Several public pages still declare plain `Metadata` rather than using `buildRouteMetadata(...)` and then assigning `buildI18nAlternates(...)`.

### OpenGraph

`buildRouteMetadata(...)` generates route-specific OpenGraph fields. Plain metadata pages do not.

Gap:

```text
openGraphPatchNeeded=true
```

### Structured Data

`buildCorePageJsonLd(...)` exists and is used on home, methodology, trust/support pages, weekly, and similar routes.

Gap:

```text
structuredDataParityPatchNeeded=true
```

The next patch can add WebPage/Breadcrumb JSON-LD to `/markets` and `/stocks` first. Market detail and English parity can follow if needed.

### Robots / Private Routes

Robots status remains appropriate:

```text
robotsPublicRoutesAllowed=true
privateRoutesDisallowed=true
```

The `/global` mock/private lane remains out of this SEO slice.

## Recommended Next Slice

Proceed with:

```text
nextRecommendedSlice=phase_2b_31_core_route_metadata_consistency_patch
```

Suggested Phase 2B.31 scope:

1. Patch `/markets` and `/stocks` to use `buildRouteMetadata(...)`.
2. Add `buildI18nAlternates("markets")` and `buildI18nAlternates("stocks")`.
3. Patch `/en/markets`, `/en/stocks`, and `/en/methodology` metadata consistency if low-risk.
4. Add WebPage/Breadcrumb JSON-LD to `/markets` and `/stocks` only if it stays small.
5. Do not change sitemap scope, stock route indexing, `/global`, data, scoring, analytics, ads, Supabase, or SQL.

## Explicit Holds

```text
runtimePagePatch=false
metadataPatch=false
canonicalPatch=false
hreflangPatch=false
structuredDataPatch=false
internalLinkPatch=false
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

## Decision Tokens

```text
phase_2b_30_technical_seo_internal_link_audit_ready
auditMode=technical_seo_internal_link_audit_only
robotsPublicRoutesAllowed=true
privateRoutesDisallowed=true
sitemapI18nRoutesPresent=true
stockRouteIndexing=keep_existing_gated_scope
internalLinkPatchNeeded=false
routeMetadataHelperNotUniversal=true
canonicalHreflangPatchNeeded=true
openGraphPatchNeeded=true
structuredDataParityPatchNeeded=true
englishMetadataParityPatchNeeded=true
requestIndexingAllPages=false
repeatSitemapSubmissionNow=false
sitemapExpansionNow=false
globalRouteIndexing=gated
nonTaiwanMarketIndexing=gated
analyticsRuntime=false
adRuntime=false
supabaseWrite=false
sqlExecution=false
marketDataFetch=false
scoringChange=false
runtimePromotion=false
nextRecommendedSlice=phase_2b_31_core_route_metadata_consistency_patch
```

## Completion Criteria

This audit is complete when:

1. Core technical SEO surfaces are reviewed against current repo code.
2. Internal links are classified as pass or patch-needed.
3. Metadata/canonical/hreflang/OG/JSON-LD gaps are explicitly named.
4. A checker verifies the audit and closed boundaries.
5. Phase 2B handoff status points to Phase 2B.31.
