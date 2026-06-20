# Phase 2B Domain Usage Decision Record

Owner: CEO / PM mainline

Handoff owner: A3 Phase 2B SEO support lane

Decision date: 2026-06-21

Status: `domain_usage_decision_recorded_for_a3_handoff`

## Decision

CEO selected `opensignallab.com` as the parent brand domain for the project portfolio.

The selected domain is a parent-brand domain, not a Market Signal-only domain.

Canonical naming convention:

- Parent brand URL: `https://opensignallab.com/`
- Market Signal product URL: `https://market-signal.opensignallab.com/`
- Use lowercase host and path in SEO, canonical, sitemap, robots, GSC, and handoff documents.

Initial intended route structure:

```text
https://opensignallab.com/
https://market-signal.opensignallab.com/
https://opensignallab.com/life-pressure-lab/
https://opensignallab.com/project-3/
```

## Rationale

`OpenSignalLab.com` supports the public-data and social-observation brand direction while preserving room for multiple products.

- `Open` supports open data, public evidence, and transparent interpretation.
- `Signal` connects naturally to Market Signal and can also cover life-pressure, social, civic, and future project indicators.
- `Lab` frames the site as a portfolio of experiments and products rather than one financial dashboard.

This avoids locking the parent brand to Taiwan-only, finance-only, or membership-only positioning.

## Product Scope Boundary

| product | intended route | domain role |
|---|---|---|
| Parent brand | `https://opensignallab.com/` | Open Signal Lab home and portfolio entry |
| Market Signal | `https://market-signal.opensignallab.com/` | This project's formal product entry |
| Life Pressure Lab | `https://opensignallab.com/life-pressure-lab/` | Planned product page or product app entry |
| Project 3 | `https://opensignallab.com/project-3/` | Reserved placeholder only until PM defines the product |

The route names are planning anchors. They do not approve UI implementation, routing changes, or deployment changes by themselves.

The parent root must not be treated as the Market Signal canonical URL. Market Signal canonical migration, if later approved, should target the product subdomain `https://market-signal.opensignallab.com/`, not the parent-brand root.

The earlier product-subpath option `https://opensignallab.com/market-signal/` is superseded for production canonical planning.

## Current Execution Boundary

This record does not approve or perform:

- DNS changes;
- Cloudflare settings changes;
- Vercel project settings changes;
- `NEXT_PUBLIC_SITE_URL` changes;
- canonical host migration;
- sitemap host migration;
- robots sitemap host migration;
- Google Search Console property creation;
- sitemap submission;
- stock indexing;
- Supabase reads or writes;
- SQL execution;
- market-data fetch, ingest, storage, or source promotion;
- public claims that real global index data is live.

## A3 Handoff

A3 should treat this record as the selected custom-domain strategy for future Phase 2B SEO and platform planning.

A3 may prepare follow-up checks, templates, and migration steps for `opensignallab.com` and `https://market-signal.opensignallab.com/`, but A3 must not execute DNS, Vercel, Cloudflare, GSC, sitemap, canonical, or runtime source changes without a separate PM/CEO execution decision.

Recommended next A3 status:

```text
custom_domain_strategy_selected_execution_deferred
```

## SEO Transition Notes

Current public URL remains:

```text
https://market-signal-two.vercel.app/
```

Before any custom-domain launch, A3 should re-run the existing SEO foundation and index-gate checks, then prepare a PM/CEO execution checklist that explicitly covers:

- parent-brand root versus Market Signal product subdomain policy;
- `NEXT_PUBLIC_SITE_URL` and/or product subdomain strategy for `https://market-signal.opensignallab.com/`;
- canonical URLs;
- sitemap URLs;
- robots sitemap URL;
- GSC property timing;
- Vercel URL redirect or secondary-host policy;
- rollback to the last known-good public URL.

## Registration Note

CEO reported that `OpenSignalLab.com` was purchased through Cloudflare Registrar on 2026-06-21.

Auto-renewal is intentionally not enabled yet. PM/CEO should track renewal reminders separately. This record does not require or mutate registrar settings.

