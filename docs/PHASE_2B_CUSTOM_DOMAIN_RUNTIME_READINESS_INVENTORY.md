# Phase 2B Custom Domain Runtime Readiness Inventory

Owner: A3 Phase 2B SEO support lane

Status: prepared, runtime migration not executed

Slice: `phase_2b_custom_domain_runtime_readiness_inventory`

## Target Domain Structure

```text
parentBrandUrl=https://opensignallab.com/
marketSignalProductUrl=https://market-signal.opensignallab.com/
currentPublicUrl=https://market-signal-two.vercel.app/
```

## Current Runtime Finding

The current app is not yet runtime-ready for a direct `/market-signal/` subpath migration.

Reason:

- `next.config.mjs` has no `basePath`.
- `src/lib/site.ts` sets `siteConfig.url` from `NEXT_PUBLIC_SITE_URL`.
- `src/lib/site.ts` builds URLs with `new URL(path, siteConfig.url)`.
- Most SEO callers pass leading-slash paths such as `/briefing`, `/weekly`, and `/sitemap.xml`.
- With JavaScript URL resolution, a leading slash resets the path to the host root.

Example risk:

```text
siteConfig.url=https://market-signal.opensignallab.com/
absoluteUrl("/briefing") => https://opensignallab.com/briefing
expected future URL => https://market-signal.opensignallab.com/briefing
```

Therefore, PM/CEO should not switch `NEXT_PUBLIC_SITE_URL` directly to `https://market-signal.opensignallab.com/` until runtime URL composition and routing strategy are updated together.

## Files Expected To Be In Scope For A Future Runtime Migration

Likely runtime files:

- `next.config.mjs`
- `src/lib/site.ts`
- `src/lib/seo.ts`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/layout.tsx`

Likely checker/docs files:

- `docs/PHASE_2B_SEO_HANDOFF_STATUS.md`
- `docs/PHASE_2B_CUSTOM_DOMAIN_PRODUCT_SUBPATH_EXECUTION_PREFLIGHT.md`
- `docs/PHASE_2B_CUSTOM_DOMAIN_RUNTIME_READINESS_INVENTORY.md`
- `scripts/check-phase-2b-custom-domain-runtime-readiness-inventory.mjs`
- `scripts/check-phase-2b-seo-handoff-status.mjs`

This inventory does not authorize changing those runtime files.

## Future Implementation Options

Option A: Use Next.js `basePath disabled for subdomain production`.

- Strong alignment with serving the whole product under `/market-signal/`.
- Requires checking internal links, static assets, sitemap, robots, OG images, JSON-LD, and redirects.
- Requires coordinated Vercel/DNS/GSC execution.

Option B: Keep the app at root and put the product under a proxy/rewrite.

- Platform-dependent.
- Requires very careful canonical and asset validation.
- Higher risk of hidden mismatch between route paths and SEO paths.

Option C: Keep current Vercel URL until the parent-brand site architecture is ready.

- Lowest operational risk.
- SEO accumulation stays on the Vercel URL for now.
- Defers final canonical migration.

A3 recommendation:

```text
Prefer Option A only after PM/CEO approves a coordinated runtime + Vercel + GSC migration slice.
```

## Execution Boundary

```text
noDnsChange=true
noCloudflareSettingsChange=true
noVercelSettingsChange=true
noGscOperationByA3=true
noCanonicalHostMigration=true
noSitemapHostMigration=true
noRobotsSitemapHostMigration=true
noNextPublicSiteUrlChange=true
noNextBasePathChange=true
noProductSubpathMigration=true
stockRoutesIndexingFullyOpen=false
noSql=true
noSupabaseWrite=true
noMarketDataFetch=true
```

## Success Criteria For This Slice

This slice is complete when:

- the runtime readiness blocker is documented;
- the leading-slash URL composition risk is explicit;
- the future affected runtime files are listed;
- no runtime file is changed;
- PM/CEO still owns DNS, Vercel, GSC, canonical, sitemap, and stock indexing execution;
- the checker passes.


