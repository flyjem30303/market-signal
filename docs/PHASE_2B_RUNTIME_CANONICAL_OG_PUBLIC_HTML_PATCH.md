# Phase 2B Runtime Canonical OG Public HTML Patch

Owner: A3 Phase 2B SEO support lane

Status: observed pass; ready for PM/CEO GSC submission decision

Slice: `phase_2b_runtime_canonical_og_public_html_observation`

## Trigger

After production redeploy to the product subdomain, public smoke checks confirmed:

```text
https://market-signal.opensignallab.com/ = 200
https://market-signal.opensignallab.com/briefing = 200
https://market-signal.opensignallab.com/robots.txt = 200
https://market-signal.opensignallab.com/sitemap.xml = 200
https://market-signal.opensignallab.com/market-signal = 404
```

`robots.txt` and `sitemap.xml` correctly used:

```text
https://market-signal.opensignallab.com
```

But public HTML did not expose expected canonical or `og:url` tags. The root cause found in this slice was that several core routes still exported only plain `title` / `description` metadata, and the home route did not export route-level metadata. The shared canonical / OG helper existed, but was not wired into those route entries.

## Patch

Core public routes now use `buildRouteMetadata(...)` directly:

- `/`
- `/briefing`
- `/weekly`
- `/methodology`
- `/disclaimer`
- `/privacy`
- `/terms`

This keeps the patch small and route-level. It does not introduce a new SEO package, does not change layout/UI, and does not change market data behavior.

`src/lib/seo.ts` still resolves canonical and OG metadata through:

- `metadataBase: new URL(siteConfig.url)`
- relative `alternates.canonical`
- relative `openGraph.url`
- relative OG/Twitter image path

## Expected After Redeploy

After PM/CEO redeploys production, core pages should expose public HTML tags similar to:

```text
<link rel="canonical" href="https://market-signal.opensignallab.com/">
<meta property="og:url" content="https://market-signal.opensignallab.com/">
```

For briefing:

```text
<link rel="canonical" href="https://market-signal.opensignallab.com/briefing">
<meta property="og:url" content="https://market-signal.opensignallab.com/briefing">
```

## Execution Boundary

```text
noDnsChangeByA3=true
noCloudflareSettingsChangeByA3=true
noVercelSettingsChangeByA3=true
noGscOperationByA3=true
noSitemapSubmissionByA3=true
stockRoutesIndexingFullyOpen=false
noSql=true
noSupabaseWrite=true
noMarketDataFetch=true
```

## Public Observation Result

Observation date: 2026-06-21

Observed public route status:

```text
https://market-signal.opensignallab.com/ = 200
https://market-signal.opensignallab.com/briefing = 200
https://market-signal.opensignallab.com/robots.txt = 200
https://market-signal.opensignallab.com/sitemap.xml = 200
https://market-signal.opensignallab.com/market-signal = 404
```

Observed public HTML metadata:

```text
/ canonical=https://market-signal.opensignallab.com
/ og:url=https://market-signal.opensignallab.com
/briefing canonical=https://market-signal.opensignallab.com/briefing
/briefing og:url=https://market-signal.opensignallab.com/briefing
/weekly canonical=https://market-signal.opensignallab.com/weekly
/methodology canonical=https://market-signal.opensignallab.com/methodology
/disclaimer canonical=https://market-signal.opensignallab.com/disclaimer
/privacy canonical=https://market-signal.opensignallab.com/privacy
/terms canonical=https://market-signal.opensignallab.com/terms
```

Observed negative checks:

```text
hasOldVercel=false
hasSubpathCanonical=false
stockRoutesIndexingFullyOpen=false
```

## Next Step

PM/CEO may proceed to the manual GSC property and sitemap submission steps. A3 should not execute GSC operations directly.
