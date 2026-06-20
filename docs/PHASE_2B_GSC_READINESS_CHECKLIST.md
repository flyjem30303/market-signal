# Phase 2B Google Search Console Readiness Checklist

Owner: A3 Phase 2B SEO foundation lane

Governance: CEO-led execution, following `karpathy-guidelines`

Status: Draft for CEO/PM execution timing

## Purpose

This checklist defines the minimum readiness gates before connecting Google Search Console, submitting sitemap, or moving canonical signals from the temporary Vercel URL to a custom domain.

It is a planning/checklist artifact only. It does not mutate external platforms, does not fetch market data, does not run SQL, and does not write Supabase.

## Current Canonical Host

- Current public URL: `https://market-signal-two.vercel.app/`
- Required environment value before GSC submission:
  - `NEXT_PUBLIC_SITE_URL=https://market-signal-two.vercel.app`
- Custom domain timing:
  - Do not switch canonical host until the custom domain is selected, DNS is stable, and the sitemap/canonical/robots baseline has passed again.

## GSC Readiness Gates

### Gate 1: Technical SEO Baseline

Status target: required before GSC

- Run `cmd /c npm run check:phase-2b-seo-foundation`.
- Required result:
  - `FAIL = 0`
  - Remaining `WARN` items must be known governance reminders only.

### Gate 2: Site URL Consistency

Status target: required before GSC

- `NEXT_PUBLIC_SITE_URL` must point to the current public URL.
- Temporary Vercel URL phase:
  - `https://market-signal-two.vercel.app`
- Before custom domain launch:
  - update `NEXT_PUBLIC_SITE_URL` to the selected custom domain
  - rerun SEO foundation check
  - rerun production build

### Gate 3: Sitemap Policy

Status target: required before GSC

`sitemap.xml` must include the core public routes:

```text
/
/briefing
/weekly
/methodology
/privacy
/terms
/disclaimer
```

Stock detail routes must not be bulk-included. They follow the CEO decision:

- first batch maximum: `100`
- only include routes that pass data/source/score/quality gates
- keep stock pages gated/noindex when runtime or data quality is not ready

### Gate 4: Robots Policy

Status target: required before GSC

Robots policy must:

- allow public core pages
- disallow unreleased/internal routes such as `/internal`, `/api/internal`, `/membership`, and `/watchlist`
- expose the sitemap URL

### Gate 5: Public Claim Boundary

Status target: required before GSC

Metadata and public copy must not claim:

- investment advice
- buy/sell recommendations
- guaranteed returns
- real-time quotes
- production-grade score coverage when runtime remains gated

`/stocks/[symbol]` must stay out of broad sitemap inclusion unless runtime, source rights, score quality, and freshness gates pass.

## Recommended CEO Sequence

1. Keep current Vercel URL while SEO baseline matures.
2. Set `NEXT_PUBLIC_SITE_URL=https://market-signal-two.vercel.app`.
3. Run SEO foundation check.
4. Run production build.
5. Connect GSC for the temporary Vercel URL.
6. Submit sitemap only after `FAIL = 0`.
7. Observe initial crawl/index status.
8. Decide custom domain.
9. Update canonical host to the custom domain.
10. Rerun checks and resubmit sitemap under the custom domain property.

## Requires PM Integration

Requires PM integration: yes.

Reason:

- GSC setup, sitemap submission, and custom domain timing are platform/PM execution decisions.
- A3 can provide readiness gates and local checks, but should not perform external platform integration unless CEO explicitly delegates that operation.
