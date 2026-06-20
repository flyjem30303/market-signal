# Phase 2B GSC Result Intake Template

Owner: A3 Phase 2B SEO support lane

Governance: CEO-led, PM-integrated, karpathy-guidelines

Status: Intake template only, not a GSC operation

## Purpose

This template lets PM/CEO record Google Search Console observations after a GSC property, sitemap submission, or custom-domain transition.

It does not create or operate a GSC property, submit a sitemap, change DNS, change Vercel settings, write Supabase, run SQL, or fetch market data.

## Intake Summary

- Intake date:
- Reporter:
- GSC property:
- Observed canonical host:
- Sitemap submitted:
- Sitemap URL:
- Observation window:
  - T+1
  - T+7
  - T+14
- Related deployment URL:

## Required GSC Fields

PM/CEO should fill these fields before A3 triage:

- Sitemap status:
- Sitemap discovered URLs:
- Sitemap read time:
- Core route examples:
  - `/`
  - `/briefing`
  - `/weekly`
  - `/methodology`
  - `/privacy`
  - `/terms`
  - `/disclaimer`
- Indexed core route count:
- Not indexed core route count:
- Unexpected indexed `/stocks/*` count:
- Unexpected indexed `/internal/*` count:
- Duplicate canonical examples:
- Alternate canonical chosen by Google:
- Blocked by robots examples:
- Crawled but not indexed examples:
- Discovered but not indexed examples:

## Expected Baseline

- Core routes may be discovered or indexed gradually.
- `/internal/*` should not be indexed.
- `/api/internal` should not be indexed.
- `/stocks/*` should not appear as submitted from sitemap while local index gate reports eligible stock routes as `0`.
- If a custom domain is active, sitemap host, canonical host, and GSC property host should match.

## A3 Triage Categories

Green:

- Sitemap fetched successfully.
- No internal routes indexed.
- No unexpected bulk `/stocks/*` indexing.
- Core routes are discovered or beginning to crawl.

Yellow:

- Core pages are discovered but not indexed within 14 days.
- A few canonical mismatches appear, but not across all core routes.
- Sitemap read is delayed, but not failed.

Red:

- Sitemap cannot be fetched.
- Sitemap host and canonical host differ.
- `/internal/*` appears indexed.
- Large `/stocks/*` indexing appears while local gate remains closed.
- Google chooses a different canonical for most core routes.

## Required Local Checks Before A3 Triage

Run locally and paste summary:

- `cmd /c npm run check:phase-2b-seo-foundation`
- `cmd /c npm run report:phase-2b-seo-index-gate`
- `cmd /c npm run check:phase-2b-gsc-post-submit-observation-checklist`

## A3 Boundary

- A3 can inspect SEO files and local checks.
- A3 can propose technical patches inside Phase 2B SEO scope.
- A3 must not modify PM mainline integration files.
- A3 must not change DNS.
- A3 must not change Vercel project settings.
- A3 must not submit GSC sitemap.
- A3 must not change Supabase.
- No SQL.
- A3 must not fetch or ingest market data.
- A3 must not open `/stocks/*` indexing without CEO/PM mainline approval.

## Requires PM Integration

Requires PM integration: Yes

Reason:

- GSC observations come from an external platform account owned by PM/CEO.
- A3 can triage results after PM/CEO provides the intake, but should not operate platform settings unless CEO explicitly delegates it.
