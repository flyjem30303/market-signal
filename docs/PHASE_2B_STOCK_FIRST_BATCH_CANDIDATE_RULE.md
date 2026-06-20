# Phase 2B Stock First-batch Candidate Rule

Owner: A3 Phase 2B SEO foundation lane

Governance: CEO-led execution, following `karpathy-guidelines`

Status: Candidate rule only, not an indexing approval

## Purpose

This document defines how `/stocks/[symbol]` pages may later enter the first SEO sitemap/index batch.

It is not an approval to index stock pages. It does not change sitemap behavior, does not change the stock index gate, does not fetch market data, does not run SQL, and does not write Supabase.

## CEO Decision Boundary

- `/stocks/*` must not be bulk-indexed.
- First batch maximum: `100`.
- First batch candidates are only candidates until PM/CEO confirms all gates.
- When runtime is mock/fallback, data is insufficient, or score source is not real, stock pages remain `noindex`.
- No candidate rule may override PM/CEO source, score, data quality, and sitemap decisions.

## Eligibility Gates

A stock route can become a first-batch candidate only if all gates pass.

### 1. Runtime Gate

- `NEXT_PUBLIC_DATA_SOURCE=supabase`
- `NEXT_PUBLIC_SCORE_SOURCE=real`
- `MARKET_SIGNAL_SUPABASE_READS=enabled`
- `NEXT_PUBLIC_SITE_URL` is set to a public HTTPS URL

### 2. Data Quality Gate

- stock snapshot is available
- latest price and score are fresh enough for the public claim
- `dataQualityScore >= 70`
- `dataQualityGrade !== "D"`

### 3. Route Quality Gate

- route has readable title and description
- route has canonical metadata
- route has Open Graph and Twitter card metadata
- route has non-advisory public copy
- route does not expose internal debug, raw payload, or governance text

### 4. Sitemap Gate

- candidate count must not exceed `SEO_STOCK_SITEMAP_LIMIT = 100`
- sitemap must not output the full stock universe
- only PM/CEO-approved candidates may enter sitemap

## Candidate Ranking Rule

When more than `100` eligible routes exist, rank candidates by:

1. Core market representation:
   - include routes that users most naturally expect in a Taiwan market signal product.
2. Existing product relevance:
   - prefer symbols already used by home, briefing, weekly, or methodology flows.
3. Data completeness:
   - prefer higher `dataQualityScore`;
   - prefer deeper valid historical price/score coverage.
4. User intent:
   - prefer high-search or high-recognition symbols and core ETFs after data/source gates pass.
5. Diversity:
   - avoid filling the first batch with a single industry or narrow segment.

## Non-goals

- Do not index all `1086` stock routes.
- Do not change `src/app/sitemap.ts`.
- Do not change `/stocks/[symbol]` index gate.
- Do not change data source settings.
- Do not write Supabase.
- No SQL.
- Do not fetch or ingest market data.
- Do not start Google Ads.
- Do not submit sitemap from this document.

## PM Integration Requirement

Requires PM integration: yes.

Reason:

- First-batch candidate selection directly affects sitemap and search exposure.
- A3 defines the rule only; PM/CEO must confirm data/source/score gates before any stock route enters sitemap.
