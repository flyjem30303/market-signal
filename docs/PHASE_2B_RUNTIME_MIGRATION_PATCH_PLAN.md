# Phase 2B Runtime Migration Patch Plan

Owner: A3 Phase 2B SEO support lane

Status: planned, runtime patch not executed

Slice: `phase_2b_runtime_migration_patch_plan`

## Target Domain Structure

```text
parentBrandUrl=https://opensignallab.com/
marketSignalProductUrl=https://market-signal.opensignallab.com/
currentPublicUrl=https://market-signal-two.vercel.app/
```

## Recommendation

A3 recommends a coordinated runtime migration patch only after PM/CEO approval.

Preferred technical direction:

```text
Use Next.js basePath disabled for subdomain production together with an explicit site URL helper that preserves the product subdomain.
```

Reason:

- Market Signal is intended to live under the product subdomain.
- sitemap, robots, canonical, Open Graph, Twitter card, and JSON-LD URLs must agree.
- changing only `NEXT_PUBLIC_SITE_URL` is unsafe because leading-slash paths currently reset to the domain root.

## Minimal Future Runtime Patch Scope

If PM/CEO approves execution, the smallest coherent patch should update:

- `next.config.mjs`: add an explicit `basePath` plan for `/market-signal`.
- `src/lib/site.ts`: split site origin from product base path or otherwise make `absoluteUrl` preserve `/market-signal/`.
- `src/lib/seo.ts`: ensure OG image URLs, canonical URLs, and JSON-LD URLs use the same helper.
- `src/app/sitemap.ts`: confirm sitemap emits product-subdomain URLs.
- `src/app/robots.ts`: confirm robots sitemap URL points to the product-subdomain sitemap if served there.
- `src/app/layout.tsx`: confirm metadataBase and global OG/Twitter URLs resolve consistently.

The future patch should not touch Supabase, SQL, data fetching, scoring, stock data logic, membership, or ads.

## Suggested Future URL Helper Contract

Future implementation should make these cases explicit:

```text
siteOrigin=https://opensignallab.com
siteBasePath=
absoluteUrl("/") => https://market-signal.opensignallab.com/
absoluteUrl("/briefing") => https://market-signal.opensignallab.com/briefing
absoluteUrl("/sitemap.xml") => https://market-signal.opensignallab.com/sitemap.xml
absoluteUrl("/og-default.svg") => https://market-signal.opensignallab.com/og-default.svg
```

The helper must avoid this known bad result:

```text
absoluteUrl("/briefing") => https://opensignallab.com/briefing
```

## Suggested Future Execution Order

1. Add URL helper support for product subdomain.
2. Add or configure Next.js `basePath disabled for subdomain production`.
3. Update sitemap/robots/canonical/OG/Twitter/JSON-LD to use the shared URL contract.
4. Add a checker that validates expected product-subdomain URLs in generated metadata helpers.
5. Run local checks.
6. Only after PM/CEO approval, coordinate Vercel domain, DNS, redirects, and GSC.

## Future Verification Commands

At minimum, a future implementation patch should run:

```text
cmd /c npm run check:phase-2b-seo-foundation
cmd /c npm run check:phase-2b-custom-domain-runtime-readiness-inventory
cmd /c npm run check:phase-2b-runtime-migration-patch-plan
cmd /c npm run check:phase-2b-seo-handoff-status
```

If runtime code is changed, PM/CEO may also require:

```text
cmd /c npm run build
```

## Execution Boundary

This plan does not approve or perform:

```text
noRuntimePatch=true
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

## PM/CEO Approval Needed Before Patch

Before implementation, PM/CEO must approve:

- whether to use Next.js `basePath disabled for subdomain production`;
- whether the parent-brand root will be a separate site, a route, or a landing page;
- whether the current Vercel URL will redirect or remain as fallback;
- whether custom-domain GSC should start with `opensignallab.com`, `https://market-signal.opensignallab.com/`, or both;
- whether to keep all stock indexing gates unchanged during migration.

## Success Criteria For This Slice

This slice is complete when:

- the future patch shape is documented;
- the URL helper contract is explicit;
- the known bad URL composition is documented;
- runtime execution remains blocked until PM/CEO approval;
- stock indexing remains gated;
- the checker passes.


