# Phase 2B Custom Domain Product Subdomain Execution Preflight

Owner: A3 Phase 2B SEO support lane

Status: prepared, not executed

Slice: `phase_2b_custom_domain_product_subpath_execution_preflight`

## Decision Context

PM/CEO has selected the future domain structure:

```text
parentBrandUrl=https://opensignallab.com/
marketSignalProductUrl=https://market-signal.opensignallab.com/
```

Current live public URL remains:

```text
https://market-signal-two.vercel.app/
```

This preflight does not approve or perform the migration. It only records what must be checked before PM/CEO authorizes a future platform execution slice.

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

## Required PM/CEO Decisions Before Execution

PM/CEO must decide all of the following before A3 or any implementation lane changes runtime behavior:

- Whether `https://market-signal.opensignallab.com/` will be served by the current Next.js app using a subdomain/root-routing strategy.
- Whether `https://opensignallab.com/` will be a separate parent-brand site, landing page, redirect, or route in the same Vercel project.
- Whether the old Vercel URL should redirect, remain accessible, or remain as a fallback non-canonical host.
- Whether GSC should use a domain property, URL-prefix properties, or both.
- When to change `NEXT_PUBLIC_SITE_URL`.
- When to submit the new sitemap.
- Whether any stock routes are approved for indexing after migration.

## Technical Items To Inspect Before Migration

Before a future execution slice, inspect and plan:

- `NEXT_PUBLIC_SITE_URL` target for `https://market-signal.opensignallab.com/`.
- Next.js `basePath` or routing strategy for `/market-signal/`.
- Static asset paths, including OG images and favicon paths.
- sitemap host and path strategy.
- robots sitemap URL strategy.
- canonical URL strategy for every core route.
- Open Graph URL and image URL strategy.
- Twitter card URL and image URL strategy.
- JSON-LD `url`, `@id`, breadcrumb, and WebSite/WebPage URL strategy.
- Redirect policy from `https://market-signal-two.vercel.app/`.
- GSC verification and sitemap submission sequence.

## Canonical Migration Rule

The parent-brand root must not become the Market Signal canonical URL.

If PM/CEO approves custom-domain execution, Market Signal canonical URLs should point under:

```text
https://market-signal.opensignallab.com/
```

Examples:

```text
https://market-signal.opensignallab.com/
https://market-signal.opensignallab.com/briefing
https://market-signal.opensignallab.com/weekly
https://market-signal.opensignallab.com/methodology
```

This rule prevents accidental canonical collapse from the product into the parent-brand homepage.

## GSC Preflight Recommendation

For the current phase, do not change GSC execution from the existing Vercel URL packet.

For a future custom-domain execution, PM/CEO should prepare either:

- Domain property: `opensignallab.com`
- URL prefix property: `https://market-signal.opensignallab.com/`

The URL-prefix property is more directly aligned with the Market Signal product subdomain. The domain property is useful for the parent-brand portfolio as a whole.

## Stock Indexing Boundary

Stock routes remain gated.

This preflight does not approve:

- full `/stocks/*` indexing;
- sitemap inclusion for all stock routes;
- relaxing mock/fallback/noindex rules;
- increasing the first-batch stock cap.

## Success Criteria For This Preflight

This slice is complete when:

- the parent-brand URL is documented as `https://opensignallab.com/`;
- the Market Signal product URL is documented as `https://market-signal.opensignallab.com/`;
- execution boundaries explicitly prevent DNS, Vercel, GSC, canonical, sitemap, and runtime env changes;
- the parent root is explicitly blocked as the Market Signal canonical target;
- stock indexing remains gated;
- the checker passes.


