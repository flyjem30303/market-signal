# Phase 2B Runtime Migration URL Contract Checker

Owner: A3 Phase 2B SEO support lane

Status: implemented

Slice: `phase_2b_runtime_migration_url_contract_checker`

## Purpose

This slice adds an automated checker for the Market Signal product-subdomain URL contract.

It verifies two modes:

- current root mode remains stable;
- future product-subdomain mode keeps root app routes under `market-signal.opensignallab.com`.

## Current Root Contract

When no base path is configured:

```text
siteUrl=https://market-signal-two.vercel.app/
siteBasePath=
absoluteUrl("/") => https://market-signal-two.vercel.app/
absoluteUrl("/briefing") => https://market-signal-two.vercel.app/briefing
absoluteUrl("/sitemap.xml") => https://market-signal-two.vercel.app/sitemap.xml
absoluteUrl("/og-default.svg") => https://market-signal-two.vercel.app/og-default.svg
```

## Future Product Subdomain Contract

When PM/CEO later approves production env configuration:

```text
siteUrl=https://market-signal.opensignallab.com
siteBasePath=
absoluteUrl("/") => https://market-signal.opensignallab.com/
absoluteUrl("/briefing") => https://market-signal.opensignallab.com/briefing
absoluteUrl("/weekly") => https://market-signal.opensignallab.com/weekly
absoluteUrl("/methodology") => https://market-signal.opensignallab.com/methodology
absoluteUrl("/sitemap.xml") => https://market-signal.opensignallab.com/sitemap.xml
absoluteUrl("/og-default.svg") => https://market-signal.opensignallab.com/og-default.svg
```

## Guarded Bad Case

The checker blocks this regression:

```text
absoluteUrl("/briefing") => https://opensignallab.com/briefing
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
noProductionNextPublicSiteUrlChange=true
noProductionNextBasePathChange=true
noProductSubpathMigration=true
stockRoutesIndexingFullyOpen=false
noSql=true
noSupabaseWrite=true
noMarketDataFetch=true
```

## Files Added Or Updated

- `docs/PHASE_2B_RUNTIME_MIGRATION_URL_CONTRACT_CHECKER.md`
- `scripts/check-phase-2b-runtime-migration-url-contract.mjs`
- `docs/PHASE_2B_SEO_HANDOFF_STATUS.md`
- `scripts/check-phase-2b-seo-handoff-status.mjs`
- `package.json`

## Next Step Recommendation

Recommended next A3 slice:

```text
phase_2b_custom_domain_platform_execution_packet_update
```

Purpose:

- update the PM/CEO platform packet with the final parent-brand/product-subdomain sequence;
- keep DNS, Vercel, GSC, redirects, and production env changes as manual PM/CEO actions.


