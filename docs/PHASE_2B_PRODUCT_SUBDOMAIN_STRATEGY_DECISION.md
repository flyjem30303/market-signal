# Phase 2B Product Subdomain Strategy Decision

Owner: CEO / PM mainline

Handoff owner: A3 Phase 2B SEO support lane

Decision date: 2026-06-21

Status: `product_subdomain_strategy_selected`

## Decision

PM/CEO selected a product-subdomain strategy for Market Signal.

```text
parentBrandUrl=https://opensignallab.com/
marketSignalProductUrl=https://market-signal.opensignallab.com/
previousProductSubpath=https://opensignallab.com/market-signal/
```

The previous `/market-signal/` product-subpath strategy is superseded for production canonical planning.

## Rationale

The product subdomain is preferred because:

- Market Signal can keep root-based app routes such as `/`, `/briefing`, `/weekly`, and `/stocks/[symbol]`.
- Production does not need Next.js `basePath`.
- sitemap, robots, canonical, Open Graph, Twitter card, and JSON-LD URLs become simpler.
- future products can use separate subdomains without coupling route architecture.

## Production Environment Recommendation

When PM/CEO approves production env migration:

```text
NEXT_PUBLIC_SITE_URL=https://market-signal.opensignallab.com
NEXT_PUBLIC_SITE_BASE_PATH=
```

`NEXT_PUBLIC_SITE_BASE_PATH` should be unset or empty for the product-subdomain production strategy.

## Platform Status From Operator Screenshot

PM/CEO operator screenshot shows:

```text
market-signal.opensignallab.com=Valid Configuration
opensignallab.com=Valid Configuration
market-signal-two.vercel.app=Valid Configuration
```

This record does not itself perform DNS, Vercel, GSC, redirect, sitemap submission, or production redeploy actions.

## Execution Boundary

```text
noDnsChangeByA3=true
noCloudflareSettingsChangeByA3=true
noVercelSettingsChangeByA3=true
noGscOperationByA3=true
noCanonicalHostMigrationByA3=true
noSitemapSubmissionByA3=true
stockRoutesIndexingFullyOpen=false
noSql=true
noSupabaseWrite=true
noMarketDataFetch=true
```

## Next Manual Platform Step

Recommended next manual PM/CEO step:

```text
Set Vercel production env to NEXT_PUBLIC_SITE_URL=https://market-signal.opensignallab.com and clear NEXT_PUBLIC_SITE_BASE_PATH, then redeploy production.
```

