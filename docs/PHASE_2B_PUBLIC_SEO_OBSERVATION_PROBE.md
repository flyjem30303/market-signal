# Phase 2B Public SEO Observation Probe

Owner: A3 Phase 2B SEO support lane

Status: implemented

Slice: `phase_2b_public_seo_observation_probe`

## Purpose

This probe turns the manual public SEO smoke checks into a repeatable command while GSC Pages data is still processing.

It checks public SEO observability only. It does not mutate GSC, DNS, Vercel, Supabase, SQL, market data, or stock indexing policy.

## Command

```bash
cmd /c npm run check:phase-2b-public-seo-observation-probe
```

Optional override:

```bash
set PHASE_2B_PUBLIC_SEO_SITE_URL=https://market-signal.opensignallab.com
cmd /c npm run check:phase-2b-public-seo-observation-probe
```

## Checks

- Core public routes return 200:
  - `/`
  - `/briefing`
  - `/weekly`
  - `/methodology`
  - `/disclaimer`
  - `/privacy`
  - `/terms`
- Core public routes expose canonical URL on `https://market-signal.opensignallab.com`.
- Core public routes expose `og:url` on `https://market-signal.opensignallab.com`.
- Public HTML does not contain `market-signal-two.vercel.app`.
- Public HTML does not contain `opensignallab.com/market-signal`.
- `/robots.txt` returns 200 and points to the product subdomain sitemap.
- `/sitemap.xml` returns 200 and contains 15 `loc` entries, matching GSC T1 discovery count.
- `/market-signal` returns 404, matching product-subdomain strategy.

## Boundary

```text
externalPlatformMutation=false
gscOperation=false
sql=false
supabaseWrite=false
marketDataFetch=false
stockRoutesIndexingFullyOpen=false
```

## Expected Use

Run this after production redeploys, before interpreting GSC warnings, or whenever canonical/OG/sitemap drift is suspected.

The next GSC-dependent slice remains:

```text
phase_2b_gsc_post_submit_observation_t2_t3
```
