# A3 Phase 1 Metadata And Public Route Smoke Checker

Updated: 2026-06-13

Status: `a3_phase_1_metadata_and_public_route_smoke_checker_ready`

Owner: A3 Launch / Production Engineering

## Purpose

This packet turns the Phase 1 public Beta launch surface into a local, no-secret, no-deploy checker.

It verifies public route metadata, canonical URL behavior, sitemap/robots readiness, and the minimum public smoke route set before a future Vercel production deployment.

This packet does not deploy production, mutate platform settings, read secrets, execute SQL, write Supabase, fetch market data, or promote real data.

## Phase 1 Metadata Scope

Required source-level metadata coverage:

| Route | Required metadata behavior | Launch reason |
| --- | --- | --- |
| `/` | Global layout title names `指數燈號`; description explains market status, risk observation, demo-data boundary, and non-investment-advice posture. | Search/share first impression must match the BRIEF. |
| `/briefing` | Page title and description explain the 30-second market mood and 3-minute observation path. | Core BRIEF context route. |
| `/weekly` | Page title and description explain weekly market observation with demo data. | Return-visit content. |
| `/membership` | Page title and description explain next-stage member value while stating that login, payment, watchlist storage, and alerts are not enabled. | Member-conversion preview boundary. |
| `/methodology` | Page title and description explain how signals are interpreted. | Trust and interpretation. |
| `/disclaimer` | Page title and description state risk and non-investment-advice boundary. | Legal/trust boundary. |
| `/terms` | Page title and description state market information use terms and no buy/sell advice. | Legal/trust boundary. |
| `/privacy` | Page title and description state no trading-account, secret, or sensitive-data request. | Trust boundary. |
| `/stocks/[symbol]` | Dynamic metadata includes canonical URL, Open Graph URL, stock symbol/name, signal context, demo-data boundary, and non-investment-advice posture. | Representative stock/ETF/index detail pages. |

## Route Smoke Scope

The route smoke list is inherited from `docs/A3_PHASE_1_POST_DEPLOY_SMOKE_AND_MONITORING_PACKET.md` and must include:

- `/`
- `/briefing`
- `/weekly`
- `/membership`
- `/methodology`
- `/disclaimer`
- `/terms`
- `/privacy`
- `/stocks/TWII`
- `/stocks/2330`
- `/stocks/0050`

`src/app/sitemap.xml/route.ts` must expose the public static routes and stock routes from the repository.

`src/app/robots.txt/route.ts` must allow public routes while blocking `/internal` and `/api/internal`.

## Required Checker

`check:a3-phase-1-metadata-and-public-route-smoke-checker`

The checker must confirm:

- source-level metadata contains the Phase 1 public value proposition;
- metadata and route copy support the revised BRIEF: 30-second market mood, 3-minute observation judgment, data/update boundary, and non-investment-advice posture;
- metadata uses `NEXT_PUBLIC_SITE_URL` through the existing site URL helper;
- sitemap and robots route handlers exist;
- sitemap includes the public static route set and generated stock routes;
- robots blocks internal routes;
- the previous post-deploy smoke packet is present;
- latest public-language and product-readability gates are part of the release smoke chain;
- package scripts and review gate registration are present;
- no production deployment, SQL, Supabase write, raw market-data fetch, real-data promotion, real-time claim, guaranteed-return claim, official-endorsement claim, or investment-advice claim is introduced.

## Deferred But Visible Before Launch

The following are allowed as deferred only if explicitly tracked before launch:

- custom production domain;
- paid monitoring provider;
- analytics vendor instrumentation;
- Phase 2 member login and member-only pages;
- real-data promotion after source rights, coverage, ingestion/backfill, quality, and rollback gates pass.

## Stop Lines

This packet does not authorize:

- production deployment;
- DNS change;
- production env mutation;
- secret output;
- SQL execution;
- Supabase read/write;
- staging-row creation;
- `daily_prices` mutation;
- raw market-data fetch, ingest, storage, logging, or commit;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claim;
- official endorsement claim;
- guaranteed return claim;
- investment advice.

## Next A3 Route

`prepare_phase_1_release_candidate_public_smoke_report`

Expected output:

- release-candidate smoke report template;
- clear pre-deploy / post-deploy comparison fields;
- route health, metadata health, public-language health, and rollback readiness fields;
- no-secret, no-deploy, no-data-execution posture.
