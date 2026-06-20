# Phase 2B GSC Platform Execution Packet

Owner: A3 Phase 2B SEO foundation lane

Status: prepared for PM/CEO manual platform execution

Official site: `https://market-signal-two.vercel.app/`

Selected future parent brand URL: `https://opensignallab.com/`

Selected future Market Signal product URL: `https://market-signal.opensignallab.com/`

## Purpose

This packet gives PM/CEO the exact Google Search Console, sitemap, robots, canonical, and structured data checks needed for Phase 2B SEO platform execution.

A3 does not perform platform operations from this packet.

Execution boundary:

```text
noDnsChange=true
noVercelSettingsChange=true
noGscOperationByA3=true
noSql=true
noSupabaseWrite=true
noMarketDataFetch=true
stockRoutesIndexingFullyOpen=false
```

## Recommended GSC Property

Recommended property type for the current Vercel phase:

- URL prefix property
- Property URL: `https://market-signal-two.vercel.app/`

Reason:

- Current SEO canonical host is the Vercel production URL.
- Custom domain is not active yet.
- Domain property should wait until PM/CEO selects and verifies a custom domain.

Future custom-domain note:

- `https://opensignallab.com/` is the parent-brand root.
- `https://market-signal.opensignallab.com/` is the Market Signal product entry.
- A3 must not submit the parent-brand root as the Market Signal canonical target unless PM/CEO separately changes the product URL policy.
- Custom-domain GSC timing should wait until PM/CEO approves DNS, Vercel, canonical, sitemap, and product subdomain execution.

## PM/CEO Manual GSC Steps

1. Open Google Search Console.
2. Add property.
3. Choose URL prefix.
4. Enter `https://market-signal-two.vercel.app/`.
5. Complete verification using the method PM/CEO prefers.
6. Open Sitemaps.
7. Submit sitemap URL:

```text
https://market-signal-two.vercel.app/sitemap.xml
```

8. Record the result in `docs/PHASE_2B_GSC_RESULT_INTAKE_TEMPLATE.md`.

## URLs To Check

Sitemap URL:

```text
https://market-signal-two.vercel.app/sitemap.xml
```

Robots URL:

```text
https://market-signal-two.vercel.app/robots.txt
```

Core route examples:

```text
https://market-signal-two.vercel.app/
https://market-signal-two.vercel.app/briefing
https://market-signal-two.vercel.app/weekly
https://market-signal-two.vercel.app/methodology
https://market-signal-two.vercel.app/disclaimer
https://market-signal-two.vercel.app/privacy
https://market-signal-two.vercel.app/terms
```

## Robots.txt Check

PM/CEO manually opens:

```text
https://market-signal-two.vercel.app/robots.txt
```

Expected:

- public routes are allowed
- sitemap points to `https://market-signal-two.vercel.app/sitemap.xml`
- `/internal` is disallowed
- `/api/internal` is disallowed
- `/membership` is disallowed
- `/watchlist` is disallowed

## Canonical Check

For each core route, inspect page source or browser devtools.

Expected:

- canonical host uses `https://market-signal-two.vercel.app`
- canonical path matches the route
- no core route canonical points to localhost
- no core route canonical points to a future custom domain before PM/CEO switches domain

## JSON-LD / Structured Data Check

Use Google Rich Results Test or Schema Markup Validator manually.

Check core routes:

- `/`
- `/briefing`
- `/weekly`
- `/methodology`
- `/disclaimer`
- `/privacy`
- `/terms`

Expected:

- `WebSite` JSON-LD is present site-wide
- `WebPage` JSON-LD is present on core routes
- `BreadcrumbList` JSON-LD is present on core routes
- no investment advice, guaranteed return, or real-time quote claim is introduced by structured data

## Stock Routes Indexing Boundary

Stock routes indexing is not fully open.

Current policy:

- `/stocks/*` must not be bulk-submitted
- first-batch cap remains `100`
- mock/fallback/insufficient data pages remain `noindex`
- stock routes require PM/CEO approval before sitemap inclusion

## Success / Failure Recording

Record success or failure in:

- `docs/PHASE_2B_GSC_RESULT_INTAKE_TEMPLATE.md`
- `docs/PHASE_2B_GSC_POST_SUBMIT_OBSERVATION_CHECKLIST.md`

Minimum fields to record:

- submissionDate
- sitemapSubmitted
- discoveredUrls
- indexedUrls
- notIndexedUrls
- structuredDataWarnings
- mobileWarnings
- canonicalWarnings
- serverErrors
- nextAction

## Actions Requiring PM/CEO Manual Execution

- create GSC property
- verify GSC property
- submit sitemap
- inspect GSC coverage reports
- decide custom domain timing
- change DNS
- change Vercel domain settings
- approve any stock first-batch indexing

