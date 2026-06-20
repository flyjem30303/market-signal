# Phase 2B Runtime Canonical OG Public HTML Patch

Owner: A3 Phase 2B SEO support lane

Status: implemented, requires redeploy observation

Slice: `phase_2b_runtime_canonical_og_public_html_patch`

## Trigger

After production redeploy to the product subdomain, public smoke checks confirmed:

```text
https://market-signal.opensignallab.com/ = 200
https://market-signal.opensignallab.com/briefing = 200
https://market-signal.opensignallab.com/robots.txt = 200
https://market-signal.opensignallab.com/sitemap.xml = 200
```

`robots.txt` and `sitemap.xml` correctly used:

```text
https://market-signal.opensignallab.com
```

But public HTML did not expose expected canonical or `og:url` tags before this patch.

## Patch

`src/lib/seo.ts` now makes `buildRouteMetadata` provide:

- `metadataBase: new URL(siteConfig.url)`
- relative `alternates.canonical`
- relative `openGraph.url`
- relative OG/Twitter image path

This keeps Next.js metadata resolution tied to the configured canonical host while preserving root-based product-subdomain routes.

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

## Next Step

PM/CEO should redeploy production, then A3 should run public HTML observation again before GSC submission.

