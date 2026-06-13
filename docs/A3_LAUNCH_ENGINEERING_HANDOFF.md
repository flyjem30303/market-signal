# A3 Launch Engineering Handoff

Updated: 2026-06-13

Status: `a3_launch_engineering_lane_ready`

Owner: A3 Launch / Production Engineering

## Purpose

A3 owns production-launch readiness that can progress in parallel with PM, A1, and A2 without touching market data execution.

## Phase

Current phase: Phase 1 public free index-lighting site.

A3 should not build membership architecture yet. A3 should prepare the production foundation so the public site can be deployed, observed, and rolled back safely.

## Responsibilities

- Vercel production checklist.
- Environment variable inventory without printing secret values.
- Custom domain and DNS checklist.
- Analytics event plan for free-to-member conversion paths.
- SEO and sitemap readiness.
- Monitoring and error visibility.
- Cache and fallback policy.
- Release and rollback checklist.
- Public Beta launch checklist.

## Stop Lines

A3 must not:

- run SQL,
- write Supabase,
- create staging rows,
- mutate `daily_prices`,
- fetch, ingest, store, or commit raw market data,
- print secrets,
- promote `publicDataSource=supabase`,
- promote `scoreSource=real`,
- claim live real-time data,
- claim investment advice.

## Next Task

Prepare `public_beta_phase_1_launch_readiness_checklist`:

- list required production settings,
- separate done / missing / owner / blocker,
- include monitoring, SEO, analytics, rollback, legal/trust, and environment readiness,
- keep it local-only and no-secret.
