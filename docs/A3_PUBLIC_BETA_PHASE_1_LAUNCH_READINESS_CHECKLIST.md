# A3 Public Beta Phase 1 Launch Readiness Checklist

Updated: 2026-06-13

Status: `public_beta_phase_1_launch_readiness_checklist_ready`

Owner: A3 Launch / Production Engineering

## Purpose

This checklist turns Phase 1 launch readiness into an executable production-engineering board without touching market-data execution.

Phase 1 means the public free index-lighting site can be used by all users before membership implementation.

## Readiness Summary

| Area | Current state | Owner | Next action |
| --- | --- | --- | --- |
| Public route availability | Local public routes are guarded by visible-language checks. | PM | Keep Home, briefing, weekly, methodology, legal routes, and representative stock routes green. |
| Production deployment | Vercel deployment exists, but production checklist still needs a final owner pass. | A3 | Confirm production env, build command, output behavior, and rollback path. |
| Environment inventory | Required env keys exist in project workflows, but secret values must never be printed. | A3 | Create no-secret env inventory with present/missing/owner only. |
| Domain and DNS | Custom domain is not required for first Beta but should be tracked. | A3 | Decide temporary Vercel URL vs custom domain timing. |
| Monitoring | Local checks exist; production uptime/error monitoring still needs a simple plan. | A3 | Define minimum uptime check, error alert, and manual rollback trigger. |
| Analytics | Conversion targets exist in BRIEF, but event names need Phase 1 definitions. | A3/A4 | Track free-to-member intent without building membership yet. |
| SEO and share metadata | Basic route content exists; sitemap/share-card pass still needs confirmation. | A3 | Confirm title, description, canonical, sitemap, and robots policy. |
| Legal/trust copy | Public non-investment-advice and data-boundary copy exists. | A2 | Confirm terms, privacy, disclaimer, update-time, and source-boundary consistency. |
| Data posture | Public runtime remains mock/demo until source, coverage, quality, rollback, and runtime gates pass. | A1/PM | Keep formal-data upgrade path visible without claiming real data. |
| Release rollback | Not yet a compact checklist. | A3 | Define release step, smoke check, rollback trigger, rollback owner, and post-rollback note. |

## Phase 1 Launch Minimum

Phase 1 can be considered public-Beta launch-ready when:

- Home explains market light, core indicators, risk reminder, and update time.
- `/briefing` explains market context and next observation in user-facing language.
- Representative stock pages explain status, cause, update time, impact level, and next observation.
- `/methodology`, `/disclaimer`, `/terms`, and `/privacy` are reachable and readable.
- Public routes do not expose internal command strings, internal roles, local paths, env placeholders, raw payload terms, or mojibake.
- Production environment is deployable without printing secrets.
- A minimal monitoring and rollback path exists.
- Analytics event names exist for free-to-member intent.
- The site does not claim live real-time data, official endorsement, buy/sell advice, or guaranteed returns.

## Phase 2 Deferred Items

These are not Phase 1 blockers:

- registration/login,
- payment,
- member-only permissioning,
- watchlist storage,
- custom alert execution,
- post-market report publishing workflow,
- member dashboard implementation,
- broker/trading integration.

## Stop Lines

This checklist does not authorize:

- SQL execution,
- Supabase writes,
- Supabase schema changes,
- staging-row creation,
- `daily_prices` mutation,
- raw market-data fetch, ingest, storage, logging, or commit,
- secret output,
- `publicDataSource=supabase`,
- `scoreSource=real`,
- real-time market-data claims,
- investment advice.

## Next A3 Slice

`prepare_no_secret_production_env_inventory_and_release_rollback_checklist`

Expected output:

- no-secret env inventory,
- production deploy smoke checklist,
- rollback checklist,
- analytics event name draft,
- SEO/share metadata check scope.
