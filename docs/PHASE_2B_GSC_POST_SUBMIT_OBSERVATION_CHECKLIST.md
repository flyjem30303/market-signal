# Phase 2B GSC Post-submit Observation Checklist

Owner: A3 Phase 2B SEO foundation lane

Governance: CEO-led execution, following `karpathy-guidelines`

Status: Ready for PM/CEO after GSC property and sitemap submission

## Purpose

This checklist defines what PM/CEO should observe after Google Search Console property setup and sitemap submission.

It is an observation plan only. It does not mutate external platforms, does not fetch market data, does not run SQL, and does not write Supabase.

## Preconditions

- `NEXT_PUBLIC_SITE_URL` is set to the current public canonical URL.
- `cmd /c npm run check:phase-2b-seo-foundation` returns `FAIL = 0`.
- `cmd /c npm run report:phase-2b-seo-index-gate` confirms stock pages remain gated unless PM/CEO explicitly opens them.
- PM/CEO has created the GSC property.
- PM/CEO has submitted the sitemap.

## Observation Window

- T+0 to T+1 day:
  - Confirm sitemap was submitted.
  - Confirm sitemap URL and canonical host match.
- T+2 to T+7 days:
  - Watch whether core routes are discovered or crawled.
  - Check `/`, `/methodology`, `/briefing`, and `/weekly` first.
- T+7 to T+14 days:
  - Check for unexpected indexed stock pages.
  - Check for blocked-by-robots, duplicate canonical, or submitted-not-indexed clusters.
- T+14+ days:
  - If crawl/index status remains abnormal, A3 reviews sitemap, robots, canonical, and metadataBase.

## Expected Signals

Core routes should be crawlable:

```text
/
/briefing
/weekly
/methodology
/privacy
/terms
/disclaimer
```

Expected exclusions:

- `/internal/*` remains excluded.
- `/api/internal` remains excluded.
- `/stocks/[symbol]` remains absent from sitemap unless SEO gate passes.
- Current mock/fail-closed stock pages should not become indexed.

## Escalation Triggers

- Sitemap cannot be fetched by GSC.
- Sitemap host differs from canonical host.
- GSC reports many submitted pages as blocked unexpectedly.
- `/internal/*` appears as indexed or submitted.
- Large numbers of `/stocks/*` appear indexed while local gate still reports eligible stock routes as `0`.
- Google selects a different canonical for core routes.
- Core routes remain undiscovered after 14 days.

## A3 Follow-up Actions

Re-run:

```bash
cmd /c npm run check:phase-2b-seo-foundation
cmd /c npm run report:phase-2b-seo-index-gate
```

Inspect:

```text
src/app/sitemap.ts
src/app/robots.ts
src/lib/seo.ts
src/app/layout.tsx
```

Do not:

- change PM mainline integration files without explicit PM integration;
- change Supabase;
- run SQL;
- fetch or ingest market data;
- open stock pages for bulk indexing without CEO decision.

## Requires PM Integration

Requires PM integration: yes.

Reason:

- GSC property management and sitemap submission are external platform operations.
- A3 owns observation criteria and technical follow-up, not platform account execution unless CEO explicitly delegates it.
