# Phase 2B.31 Core Route Metadata Consistency Patch

Date: 2026-07-08

Owner: CEO / PM mainline

Status: `phase_2b_31_core_route_metadata_consistency_patch_ready`

## Purpose

Apply the small runtime SEO metadata patch selected by Phase 2B.30.

This slice aligns the remaining core routes with the shared SEO helper contract so canonical, hreflang, OpenGraph, and selected WebPage/Breadcrumb JSON-LD are consistent across the current production IA.

## Scope

Patched routes:

```text
routesPatched=/markets,/stocks,/en/markets,/en/stocks,/en/methodology
```

Runtime metadata patch:

```text
runtimeMetadataPatch=true
canonicalHreflangPatchApplied=true
openGraphPatchApplied=true
structuredDataPatchApplied=/markets,/stocks
englishMetadataParityPatchApplied=true
```

## Route Changes

| Route | Change |
|---|---|
| `/markets` | Uses `buildRouteMetadata`, `buildI18nAlternates("markets")`, and WebPage/Breadcrumb JSON-LD. |
| `/stocks` | Uses `buildRouteMetadata`, `buildI18nAlternates("stocks")`, and WebPage/Breadcrumb JSON-LD. |
| `/en/markets` | Uses `buildRouteMetadata`, `buildI18nAlternates("markets", SECONDARY_LOCALE)`, and `openGraph.locale=en_US`. |
| `/en/stocks` | Uses `buildRouteMetadata`, `buildI18nAlternates("stocks", SECONDARY_LOCALE)`, and `openGraph.locale=en_US`. |
| `/en/methodology` | Uses `buildRouteMetadata`, `buildI18nAlternates("methodology", SECONDARY_LOCALE)`, and `openGraph.locale=en_US`. |

## Explicit Non-Goals

```text
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

## Runtime Impact

| Area | Impact |
|---|---|
| Runtime metadata | Yes, core-route SEO metadata only. |
| Public UI layout | None. |
| Sitemap | None. |
| GSC platform action | None. |
| Supabase / SQL | None. |
| Market data / scoring | None. |
| Ads / analytics runtime | None. |

## Completion Criteria

1. `/markets` and `/stocks` use the shared route metadata helper.
2. `/markets` and `/stocks` expose i18n alternates.
3. `/markets` and `/stocks` include WebPage/Breadcrumb JSON-LD.
4. Selected English core routes use the shared route metadata helper.
5. Selected English core routes set OpenGraph locale to `en_US`.
6. The checker verifies the patch and closed boundaries.

## Next Recommendation

```text
nextRecommendedSlice=phase_2b_32_core_route_metadata_post_deploy_observation
```

After merge and deployment, observe production HTML for `/markets`, `/stocks`, `/en/markets`, `/en/stocks`, and `/en/methodology`. Do not resubmit sitemap or request indexing for all pages from this slice.
