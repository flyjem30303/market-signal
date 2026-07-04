# Phase 2B.25a GSC Indexing Result Intake And Watchlist

Date: 2026-07-04

Owner: CEO / PM mainline

Status: `phase_2b_25a_gsc_indexing_result_intake_and_watchlist_ready`

## Purpose

Record the first concrete Google Search Console indexing feedback after Phase 2 public IA and sitemap updates.

This slice turns GSC screenshots into an operating watchlist. It does not change runtime behavior, sitemap policy, public UI, market data, or scoring.

## Current GSC Snapshot

Source: PM supplied GSC screenshots and post-deploy verification.

```text
productionDomain=https://market-signal.opensignallab.com/
gscPagesReportAvailable=true
gscIndexedCount=1
gscNotIndexedCount=17
gscReasonCount=3
sitemapSubmitted=true
sitemapStatus=success
sitemapUrlCountProduction=26
sitemapUrlCountGscDisplay=25_pending_refresh
duplicateValidationRequested=true
duplicateValidationRequestedAt=2026-07-04
```

## GSC Buckets

| Bucket | Count | Current interpretation | Action |
|---|---:|---|---|
| Indexed | 1 | Google has accepted at least one core page. | Observe. |
| Duplicate, user did not select canonical | 1 | Affected example: `/markets/tw`. Canonical/hreflang/og:url patch deployed. | Validation requested; wait. |
| Discovered, currently not indexed | 13 | Google knows the URLs but has not crawled/indexed yet. Common for a new low-authority domain. | Watch, no mass requests. |
| Crawled, currently not indexed | 3 | Google crawled but did not index yet. Needs URL-level review when examples are available. | Review examples later; no broad rewrite now. |

## Fixed Item

The duplicate canonical item has been addressed by the deployed Phase 2B.24 patch.

Verified production output:

```text
/markets/tw selfCanonical=true
/markets/tw hreflang.zh-Hant-TW=true
/markets/tw hreflang.en=true
/markets/tw hreflang.x-default=true
/markets/tw ogUrlSelf=true
/en/markets/tw selfCanonical=true
/en/markets/tw hreflang.zh-Hant-TW=true
/en/markets/tw hreflang.en=true
/en/markets/tw hreflang.x-default=true
/en/markets/tw ogUrlSelf=true
/sitemap.xml contains /markets/tw=true
/sitemap.xml contains /en/markets/tw=true
/sitemap.xml reciprocalAlternates=true
```

## Watchlist

### Watch A: Duplicate Canonical Validation

```text
issue=duplicate_user_not_selected_canonical
exampleUrl=https://market-signal.opensignallab.com/markets/tw
fixStatus=deployed
gscValidationStatus=requested
nextCheckWindow=24_to_72_hours
```

Decision rule:

- If validation passes: close the item.
- If validation fails with the same example URL: inspect Google-selected canonical and rendered HTML.
- If validation fails with a different URL: create a new targeted intake entry.

### Watch B: Discovered, Currently Not Indexed

```text
issue=discovered_currently_not_indexed
currentCount=13
actionNow=observe
massRequestIndexing=false
```

Decision rule:

- Do not request indexing for all URLs.
- If the count stays flat for more than 7 days, inspect URL examples.
- If the examples are low-priority stock pages, keep stock indexing gated.
- If the examples are core pages, review internal links and page quality.

### Watch C: Crawled, Currently Not Indexed

```text
issue=crawled_currently_not_indexed
currentCount=3
actionNow=wait_for_url_examples
```

Decision rule:

- When examples are available, classify each URL as:
  - core page
  - English parity page
  - stock page
  - stale route
  - noindex/private route leak
- Core pages get content/metadata review.
- Stock pages stay under stock-route indexing gate unless CEO opens a controlled batch.

### Watch D: Sitemap Count Lag

```text
productionSitemapUrlCount=26
gscDisplayedSitemapUrlCount=25
interpretation=gsc_display_lag
actionNow=wait
```

Decision rule:

- Do not repeatedly resubmit the sitemap.
- Re-check after the next GSC crawl or after 24 hours.
- If GSC remains at 25 while production remains 26 for more than 72 hours, re-check sitemap fetch status.

## Explicit Holds

```text
requestIndexingAllPages=false
repeatSitemapSubmissionNow=false
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
runtimePromotion=false
```

## Next Actions

### P0

Continue observation until GSC updates validation and URL examples:

```text
nextRecommendedSlice=phase_2b_26_core_page_content_seo_audit
parallelObservation=phase_2b_25a_gsc_watchlist
```

### P1

If GSC surfaces URL examples under crawled/discovered buckets, create a targeted intake addendum instead of broadly changing site architecture.

### P2

Only after core pages stabilize, consider a controlled first stock-page indexing batch under a separate CEO decision.

## Completion Criteria

This slice is complete when:

- Current GSC counts are recorded.
- Duplicate canonical fix and validation request are recorded.
- Sitemap count difference is classified as display lag, not production failure.
- Discovered/crawled buckets have explicit watch rules.
- No runtime, sitemap expansion, stock indexing, analytics, ads, Supabase, SQL, or market-data changes are authorized.

