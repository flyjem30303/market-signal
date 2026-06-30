# Phase 2B.23 GSC Core URL Manual Request Or Wait Decision

Owner: CEO / PM mainline

Status: `phase_2b_23_gsc_core_url_manual_request_or_wait_decision_ready`

Date: 2026-06-30

Governance: karpathy-guidelines

## Purpose

This slice closes the immediate Google Search Console follow-up after the technical indexability audit.

It answers one question:

> After the five core URLs were manually requested for indexing once, should PM keep pressing GSC actions or move back to observation?

## Decision Snapshot

```text
selectedSlice=phase_2b_23_gsc_core_url_manual_request_or_wait_decision
priorSlice=phase_2b_22_technical_indexability_audit
decision=core_urls_requested_once_then_wait_for_gsc_processing
productionDomain=https://market-signal.opensignallab.com/
publicScope=taiwan_only
productionMarket=tw

technicalIndexabilityStatus=pass
gscLiveTestIndexable=true
gscPagesIndexingReportStatus=processing_or_pending_concrete_result
coreUrlManualRequestStatus=completed_by_pm_once
requestIndexingAllPages=false
repeatRequestIndexingNow=false
sitemapResubmissionNow=false
sitemapUrlExpansionNow=false
gscActionNow=false

coreUrlsRequested=/
coreUrlsRequested=/markets
coreUrlsRequested=/markets/tw
coreUrlsRequested=/stocks
coreUrlsRequested=/methodology

stockRouteIndexing=keep_existing_gated_scope
globalRouteIndexing=gated
nonTaiwanMarketIndexing=gated
phase2aLiveMarketExpansion=paused
globalPublicDataSource=mock
marketDataFetch=false
supabaseWrite=false
sqlExecution=false
runtimePromotion=false
nextRecommendedSlice=phase_2b_gsc_observation_result_intake_when_report_available
```

## CEO / PM Decision

PM has already performed the only recommended manual GSC acceleration action for the current Taiwan-only public surface: request indexing once for the five core pages.

Do not continue pressing Request Indexing page by page.

Do not resubmit the sitemap unless Google Search Console reports a concrete sitemap fetch error or the sitemap materially changes.

Do not expand sitemap scope, stock route scope, English route scope, `/global`, or non-Taiwan market routes to force discovery.

## Core URL Scope

The manually requested pages are:

- `/`
- `/markets`
- `/markets/tw`
- `/stocks`
- `/methodology`

This is the maximum manual request scope for this slice.

## Observation Rule

Use this rule until GSC produces a concrete Pages or Sitemap report:

- If GSC is still processing: wait.
- If GSC shows `Google can index this URL` in live test: treat the page as technically indexable.
- If GSC later reports a specific blocker, classify the blocker before changing code.
- If GSC discovers non-Taiwan mock routes, treat that as a route-exposure boundary bug.

## Explicit Holds

- No additional Request Indexing campaign.
- No repeated sitemap submission.
- No sitemap URL expansion.
- No `/global` exposure.
- No non-Taiwan market SEO exposure.
- No stock-route indexing expansion.
- No briefing / weekly i18n exposure expansion.
- No analytics or ad runtime.
- No Supabase write.
- No SQL execution.
- No market-data fetch.
- No Signal Framework production scoring migration.

## Result Classification When GSC Reports

When GSC Pages or Sitemap reports finish processing, classify the result into one of:

| Result | Action |
| --- | --- |
| Indexed / discovered via sitemap | Record success and keep observation mode. |
| Crawled but currently not indexed | Do not panic; inspect canonical, duplicate, thin-content, and crawl timing details. |
| Sitemap fetch error | Patch sitemap / robots only if the error is current and reproducible. |
| Blocked by robots / noindex | Patch immediately if confirmed on current production HTML or headers. |
| Alternate canonical | Compare canonical source and patch only if production canonical is wrong. |
| Non-Taiwan mock route discovered | Remove exposure path and keep route out of sitemap / navigation. |

## Next Recommendation

```text
phase_2b_gsc_observation_result_intake_when_report_available
```

CEO recommendation: keep Phase 2B in observation mode. The next action should be driven by concrete GSC output, not by the processing delay itself.
