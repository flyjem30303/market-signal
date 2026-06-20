# Phase 2B Custom Domain Preflight Checklist

Owner: A3 Phase 2B SEO support lane

Governance: CEO-led, PM-integrated, karpathy-guidelines

Status: Preflight checklist only, not a DNS or platform execution approval

## Purpose

This checklist defines the minimum checks before moving from the Vercel URL to a custom domain.

It does not change DNS, change Vercel settings, create a GSC property, submit a sitemap, write Supabase, run SQL, or fetch market data.

## Current State

- Current public URL: `https://market-signal-two.vercel.app/`
- Current SEO posture:
  - Core routes are SEO-ready.
  - `/stocks/[symbol]` remains gated.
  - Stock sitemap first-batch maximum remains `100`.
  - Mock / fallback / insufficient data / non-real score pages remain `noindex`.

## Required Decisions Before Custom Domain

- CEO/PM selected `OpenSignalLab.com` as the parent brand domain in `docs/PHASE_2B_DOMAIN_USAGE_DECISION_RECORD.md`.
- CEO/PM must still separately approve the final canonical-host switch timing before any launch.
- CEO/PM must decide whether the Vercel URL remains accessible as a redirect or secondary host.
- CEO/PM must decide when to create the new GSC property for the custom domain.
- CEO/PM must decide whether the temporary Vercel GSC property remains monitored during transition.

## Preflight Gates

### Gate 1: SEO Foundation

- `cmd /c npm run check:phase-2b-seo-foundation`
- Required:
  - `FAIL = 0`
  - Remaining WARN items are known governance items only.

### Gate 2: Index Gate Report

- `cmd /c npm run report:phase-2b-seo-index-gate`
- Required:
  - No full-stock sitemap exposure.
  - No unexpected eligible stock routes before source/score/data-quality gate approval.

### Gate 3: Canonical Host Update

- Before custom domain launch, set:
  - `NEXT_PUBLIC_SITE_URL=https://<custom-domain>`
- Then confirm:
  - canonical URLs use the custom domain.
  - sitemap URLs use the custom domain.
  - robots sitemap URL uses the custom domain.

### Gate 4: GSC Transition

- Create or verify GSC property for the custom domain.
- Submit the custom-domain sitemap only after Gate 1 and Gate 2 pass.
- Keep observing the temporary Vercel URL for transition anomalies.

### Gate 5: Rollback Path

- If custom-domain sitemap or canonical errors appear:
  - Keep Vercel URL available.
  - Restore `NEXT_PUBLIC_SITE_URL` to the last known-good public URL.
  - Re-run SEO foundation check.
  - Do not open stock indexing while canonical host is unstable.

## Non-goals

- Do not change DNS from this checklist.
- Do not change Vercel project settings from this checklist.
- Do not modify PM mainline integration files.
- Do not change Supabase.
- No SQL.
- Do not fetch or ingest market data.
- Do not change stock sitemap gate.
- Do not start Google Ads.
- Do not implement membership.

## Requires PM Integration

Requires PM integration: Yes

Reason:

- Domain purchase/selection, DNS, Vercel domain setup, GSC property creation, and sitemap submission are platform/PM operations.
- A3 owns readiness criteria and technical follow-up only unless CEO explicitly delegates platform execution.
