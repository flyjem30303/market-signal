# Phase 2B Runtime Migration Minimal Patch

Owner: A3 Phase 2B SEO support lane

Status: implemented, platform migration not executed

Slice: `phase_2b_runtime_migration_minimal_patch`

## What Changed

This slice adds runtime support for a future Market Signal product subdomain without switching the live site.

Target future structure:

```text
parentBrandUrl=https://opensignallab.com/
marketSignalProductUrl=https://market-signal.opensignallab.com/
currentPublicUrl=https://market-signal-two.vercel.app/
```

Implemented behavior:

- `NEXT_PUBLIC_SITE_BASE_PATH` is now supported.
- Default base path remains empty, so the current Vercel root deployment behavior is preserved.
- `next.config.mjs` uses `basePath` only when `NEXT_PUBLIC_SITE_BASE_PATH` is set.
- `src/lib/site.ts` now exposes `siteConfig.origin`, `siteConfig.basePath`, and a subpath-safe `siteConfig.url`.
- `absoluteUrl("/")`, `absoluteUrl("/briefing")`, `absoluteUrl("/sitemap.xml")`, and `absoluteUrl("/og-default.svg")` preserve the configured product subdomain.

## Expected Future URL Contract

When a future approved deployment sets:

```text
NEXT_PUBLIC_SITE_URL=https://opensignallab.com
NEXT_PUBLIC_SITE_BASE_PATH=
```

Expected URL helper behavior:

```text
absoluteUrl("/") => https://market-signal.opensignallab.com/
absoluteUrl("/briefing") => https://market-signal.opensignallab.com/briefing
absoluteUrl("/sitemap.xml") => https://market-signal.opensignallab.com/sitemap.xml
absoluteUrl("/og-default.svg") => https://market-signal.opensignallab.com/og-default.svg
```

If `NEXT_PUBLIC_SITE_URL=https://market-signal.opensignallab.com/` is used without `NEXT_PUBLIC_SITE_BASE_PATH`, the helper infers `/market-signal` from the URL path.

## Current Live Behavior

With the current default local or Vercel root setup:

```text
NEXT_PUBLIC_SITE_BASE_PATH is unset
```

The app remains root-based and does not activate `/market-signal/`.

## Platform Actions Still Not Performed

```text
noDnsChange=true
noCloudflareSettingsChange=true
noVercelSettingsChange=true
noGscOperationByA3=true
noCanonicalHostMigration=true
noSitemapHostMigration=true
noRobotsSitemapHostMigration=true
noProductionNextPublicSiteUrlChange=true
noProductionNextBasePathChange=true
noProductSubpathMigration=true
stockRoutesIndexingFullyOpen=false
noSql=true
noSupabaseWrite=true
noMarketDataFetch=true
```

## Files Modified

- `next.config.mjs`
- `src/lib/site.ts`
- `docs/PHASE_2B_RUNTIME_MIGRATION_MINIMAL_PATCH.md`
- `docs/PHASE_2B_SEO_HANDOFF_STATUS.md`
- `scripts/check-phase-2b-runtime-migration-minimal-patch.mjs`
- `scripts/check-phase-2b-seo-handoff-status.mjs`
- `package.json`

## Next Step Recommendation

Recommended next A3 slice:

```text
phase_2b_runtime_migration_url_contract_checker
```

Purpose:

- verify the helper contract under a simulated `/market-signal` environment;
- verify current default behavior remains root-based;
- keep platform migration blocked until PM/CEO approves DNS, Vercel, GSC, redirect, and production environment changes.


