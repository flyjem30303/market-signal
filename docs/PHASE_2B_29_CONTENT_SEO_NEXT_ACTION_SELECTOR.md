# Phase 2B.29 Content SEO Next Action Selector

Date: 2026-07-08

Owner: CEO / PM mainline

Status: `phase_2b_29_content_seo_next_action_selector_ready`

## Purpose

Decide what SEO work can continue while Google Search Console indexing reports continue to settle.

This slice answers:

```text
除了等待 GSC 以外，SEO 下一步應該先推哪一條？
```

It is a selector slice only. It does not change runtime UI, sitemap scope, stock indexing policy, metadata, canonical tags, hreflang, structured data, analytics, ads, Supabase, SQL, market data, or scoring.

## Current Input

Latest completed SEO slices:

| Slice | Outcome |
|---|---|
| Phase 2B.26 | Audited `/markets`, `/stocks`, and `/methodology` as core pages surfaced by GSC. |
| Phase 2B.27 | Added small static content to `/markets`, `/stocks`, and `/methodology`. |
| Phase 2B.28 | Confirmed production deployment, core route 200s, 2B.27 copy presence, and sitemap inclusion. |

Current safe assumptions:

```text
productionHost=https://market-signal.opensignallab.com
coreRoutes200=true
coreRoutesInSitemap=true
phase2b27CopyPresent=true
pagesReportLagAccepted=true
stockRouteIndexing=keep_existing_gated_scope
globalRouteIndexing=gated
nonTaiwanMarketIndexing=gated
```

## Candidate Workstreams

### Option A: Content Depth Patch

Scope:

- Add more static explanatory content to existing public pages.
- Candidate routes: `/markets/tw`, `/methodology`, `/stocks`.
- Keep all content factual and bounded to Taiwan production data.

Value:

- Helps thin-route risk if pages remain `crawled_currently_not_indexed`.
- Improves user comprehension.

Risk:

- Easy to over-edit pages that are already acceptable.
- Could turn pages into verbose SEO copy instead of product pages.

Verdict:

```text
optionA=hold_until_next_gsc_snapshot_or_specific_page_gap
```

### Option B: Technical SEO and Internal Link Audit

Scope:

- Audit route-level metadata, canonical, alternate/hreflang, OpenGraph, structured data, robots, sitemap inclusion, and core internal links.
- No runtime patch in this slice.
- Use `/`, `/markets`, `/markets/tw`, `/stocks`, `/methodology`, `/en`, `/en/markets`, `/en/stocks`, `/en/methodology` as representative routes.

Value:

- Can find blocking SEO issues without waiting for Pages report.
- Fits current GSC state: crawlable pages need stronger technical confidence before more content churn.
- Low risk because it is audit-only.

Risk:

- Audit may discover issues that require a later patch.
- Does not directly create new content.

Verdict:

```text
optionB=selected_next
```

### Option C: Off-Page Discovery Preparation

Scope:

- Prepare external discovery checklist: GitHub README link, Bing Webmaster Tools, launch note, parent-brand references.
- No tracking, ads, or outreach automation.

Value:

- Helps new domain discovery.
- Does not depend on GSC Pages report.

Risk:

- Some actions are outside repo and require manual PM execution.
- Lower priority than confirming technical SEO surfaces.

Verdict:

```text
optionC=plan_after_technical_audit
```

### Option D: Analytics / Conversion Measurement Readiness

Scope:

- Policy-only analytics planning.
- No GA4, no Clarity, no ad tags, no runtime tracking beyond existing safe product telemetry.

Value:

- Useful later when traffic exists.

Risk:

- Premature for current indexing state.
- User has kept analytics/ad runtime closed unless explicitly reopened.

Verdict:

```text
optionD=hold_policy_only
```

## CEO Decision

Proceed with:

```text
selectedNext=phase_2b_30_technical_seo_internal_link_audit
```

Reason:

1. Core content has already received a first patch.
2. GSC Pages report can lag, so more content churn is not justified yet.
3. A technical SEO and internal-link audit can proceed safely without changing runtime.
4. This audit will decide whether the next real patch should be:
   - canonical / hreflang / metadata fix,
   - structured data fix,
   - internal link patch,
   - content depth patch,
   - or off-page discovery preparation.

## Phase 2B.30 Recommended Scope

Create an audit-only packet:

```text
PHASE_2B_30_TECHNICAL_SEO_INTERNAL_LINK_AUDIT.md
```

Audit these surfaces:

| Surface | Check |
|---|---|
| Canonical | Each core route points to its intended production URL. |
| Hreflang | Chinese and English alternates are consistent where public English routes exist. |
| Metadata | Titles and descriptions are route-specific, not generic duplicates. |
| OpenGraph | Route OG tags are coherent and not misleading. |
| Structured data | WebSite, WebPage, BreadcrumbList usage is consistent. |
| Robots | Public routes are indexable; private/mock/global routes remain gated. |
| Sitemap | Core routes remain listed; stock detail indexing remains gated. |
| Internal links | Home -> Markets -> Market Detail -> Methodology path is clear. |
| Footer links | Core public pages are reachable without relying on search UI. |

Representative route set:

```text
/
/markets
/markets/tw
/stocks
/methodology
/en
/en/markets
/en/stocks
/en/methodology
```

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
phase_2b_29_content_seo_next_action_selector_ready
selectedNext=phase_2b_30_technical_seo_internal_link_audit
optionA=hold_until_next_gsc_snapshot_or_specific_page_gap
optionB=selected_next
optionC=plan_after_technical_audit
optionD=hold_policy_only
gscWaitingDoesNotBlockSeoPlanning=true
pagesReportLagAccepted=true
stockRouteIndexing=keep_existing_gated_scope
requestIndexingAllPages=false
repeatSitemapSubmissionNow=false
sitemapExpansionNow=false
analyticsRuntime=false
adRuntime=false
supabaseWrite=false
sqlExecution=false
marketDataFetch=false
scoringChange=false
runtimePromotion=false
nextRecommendedSlice=phase_2b_30_technical_seo_internal_link_audit
```

## Completion Criteria

This selector is complete when:

1. SEO candidate workstreams are compared.
2. The next slice is selected.
3. Explicit non-goals prevent premature runtime/indexing changes.
4. A checker verifies the selector and closed boundaries.
5. Phase 2B handoff status points to Phase 2B.30.

