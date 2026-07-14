# Phase 2B.35 Seed URL Intake

Date: 2026-07-14

Owner: CEO / PM mainline

Status: `phase_2b_35_seed_url_intake_ready`

## Purpose

Record the first concrete external discovery seed URLs for Market Signal.

This slice documents the URLs that PM created or provided. It does not claim indexing, ranking, referral traffic, or SEO impact yet.

## Seed URL Intake

```text
externalSeedUrlsProvidedInThread=true
externalSeedUrlCount=3
seedResultIntakePossibleNow=true
gscObservationWindowStarted=true
gscObservationStartDate=2026-07-14
gscObservationWindowDays=7-14
seedImpactClaim=false
```

| Type | URL | Source |
|---|---|---|
| GitHub repository | `https://github.com/flyjem30303/market-signal` | README website link merged before this slice. |
| Facebook page | `https://www.facebook.com/people/Market-Signal%E5%B8%82%E5%A0%B4%E7%87%88%E8%99%9F/61591770246953/` | User-provided Facebook fan page URL. |
| Facebook post | `https://www.facebook.com/share/p/1Bm9vCXzpW/` | User-provided public Facebook post URL. |

## Interpretation

This is enough to start an SEO observation window.

It is not enough to conclude:

- that Google has crawled these external pages,
- that they pass useful discovery signals,
- that they improved indexing,
- that they created meaningful referral traffic,
- or that the project should add analytics/ad runtime.

## Closed Actions

```text
requestIndexingAllPages=false
repeatSitemapSubmissionNow=false
sitemapExpansionNow=false
stockRouteIndexing=keep_existing_gated_scope
globalRouteIndexing=gated
nonTaiwanMarketIndexing=gated
globalRoutePublicExposure=false
analyticsRuntime=false
adRuntime=false
supabaseWrite=false
sqlExecution=false
marketDataFetch=false
scoringChange=false
runtimePromotion=false
```

## Observation Checklist

After 7 to 14 days, check:

1. GSC Pages indexed / not-indexed counts.
2. Whether the same core pages remain in "crawled currently not indexed" or "discovered currently not indexed."
3. Search appearance for branded queries such as `Market Signal 市場燈號`.
4. Whether additional legitimate external seeds exist.

Do not treat a lack of immediate improvement as a technical failure.

## Next Recommendation

```text
nextRecommendedSlice=phase_2b_36_seed_observation_window_or_phase_2c_resume
```

Recommended operational path:

1. Let the external discovery seeds sit for 7 to 14 days.
2. Continue Phase 2C planning or product work in parallel.
3. Return to Phase 2B only when GSC has a new meaningful snapshot or PM adds more seed URLs.

