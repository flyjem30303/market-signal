# A3 Public Beta Minimum Launch Engineering Readiness

Updated: 2026-06-14

Status: `a3_public_beta_minimum_launch_engineering_ready`

Owner: A3 Launch / Production Engineering

## Purpose

This packet condenses the existing A3 launch-engineering work into one minimum readiness gate for the Phase 1 public Beta.

It answers one question: can the public free index-lighting site be treated as launch-engineering ready at the repo level before any platform operator action?

Scope: Phase 1 public Beta route/SEO/metadata/sitemap/robots/monitoring/rollback readiness.

## Minimum Public Route Set

The minimum public route set is:

- `/`
- `/briefing`
- `/weekly`
- `/membership`
- `/stocks/TWII`
- `/stocks/2330`
- `/methodology`
- `/disclaimer`
- `/terms`
- `/privacy`
- `/robots.txt`
- `/sitemap.xml`

These routes must remain user-facing, readable, and free of internal command strings, local paths, role names, packet language, raw-payload terms, and mojibake.

## SEO And Route Metadata

The app must keep:

- global metadata naming `指數燈號`;
- a user-facing description of market mood, risk observation, data/update boundary, and non-investment-advice posture;
- `metadataBase` using `NEXT_PUBLIC_SITE_URL` with a local fallback;
- route metadata for briefing, weekly, methodology, disclaimer, terms, privacy, membership, and stock detail pages;
- stock-detail canonical and Open Graph URLs;
- `sitemap.xml` exposing public routes and stock routes only;
- `robots.txt` allowing public routes while blocking `Disallow: /internal` and `/api/internal`.

## Monitoring And Rollback

Before an operator deploys or keeps a production URL open, A3 must provide:

- a no-secret route smoke checklist for the minimum public route set;
- a manual check for 200-level public page reachability after deploy;
- a visible-language check that confirms no internal residue appears on public pages;
- a mock-boundary check confirming the site does not claim promoted real data;
- a rollback instruction using the last known good Git commit or Vercel deployment;
- a post-rollback note field for cause, route affected, and next repair owner.

## Explicit Boundaries

This packet does not authorize:

- production deployment;
- no production env mutation;
- no DNS change;
- SQL execution;
- Supabase read/write;
- staging-row creation;
- `daily_prices` mutation;
- raw market-data fetch, ingest, storage, logging, or commit;
- secret output;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claim;
- official endorsement claim;
- guaranteed return claim;
- investment advice or buy/sell recommendation.

Public runtime must remain:

- `publicDataSource=mock`
- `scoreSource=mock`

## Workstream Ownership

- CEO: chooses whether this gate is enough to proceed toward a manual operator action or whether a repair slice is needed.
- PM: integrates route, product-readability, and review-gate proof.
- A3: owns launch-engineering readiness, monitoring, rollback, SEO, sitemap, and robots proof.
- A2: reviews public trust copy and legal boundary copy.
- A1: continues data/source/coverage readiness separately without changing public runtime promotion.
- A4: keeps membership as Phase 2 planning or preview only until Phase 1 public runtime is stable.

## Completion Definition

This readiness packet is complete when:

- this file exists with status `a3_public_beta_minimum_launch_engineering_ready`;
- `check:a3-public-beta-minimum-launch-engineering-readiness` is registered;
- the checker confirms metadata, sitemap, robots, monitoring, rollback, and boundary anchors;
- the checker is included in `check:review-gates`;
- TypeScript and build remain passing after the slice.

## Next Route

If this gate passes, the next CEO/PM route is:

`prepare_phase_1_public_route_health_and_operator_safe_smoke_packet`

That route should still avoid deployment, DNS, production env mutation, SQL, Supabase writes, and real-data promotion unless the chairman explicitly asks for the platform action.
