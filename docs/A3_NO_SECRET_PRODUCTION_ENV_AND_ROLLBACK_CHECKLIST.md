# A3 No-Secret Production Env And Rollback Checklist

Updated: 2026-06-13

Status: `a3_no_secret_production_env_and_rollback_checklist_ready`

Owner: A3 Launch / Production Engineering

## Purpose

This checklist prepares Phase 1 public launch operations without exposing secret values and without changing any production platform setting.

Phase 1 remains the public free index-lighting site. Phase 2 membership architecture remains deferred.

## No-Secret Environment Inventory

Only variable names, launch posture, and owner are recorded. Secret values must not be copied into docs, logs, screenshots, reports, or command output.

| Variable | Phase 1 posture | Owner | Public launch note |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Required | A3 / PM | Must match the public canonical URL before production launch. |
| `NEXT_PUBLIC_DATA_SOURCE` | Required as `mock` | PM | Must not become `supabase` until a later source-promotion gate passes. |
| `NEXT_PUBLIC_SUPABASE_URL` | Present only if needed by approved future read/runtime gates | A1 / A3 | Do not print value. Not a Phase 1 public-real-data switch. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Present only if needed by approved future public read posture | A1 / A3 | Do not print value. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only, not public | A1 / A3 | Never expose to browser, docs, logs, screenshots, or public output. |
| `MARKET_SIGNAL_SUPABASE_READS` | Disabled | PM / A1 | Must remain disabled unless a separate read gate accepts it. |
| `DATA_FRESHNESS_SOURCE` | Mock unless separately gated | PM | Must fail closed and keep public wording clear. |
| `DATA_FRESHNESS_SUPABASE_READS` | Disabled | PM / A1 | Does not authorize main data-source promotion. |
| `INTERNAL_DIAGNOSTICS_ENABLED` | Disabled for public production | PM / A3 | Internal routes should not expose diagnostics publicly. |
| `INTERNAL_DIAGNOSTICS_TOKEN` | Required only if diagnostics are enabled | A3 | Do not print value. |
| `BETA_HOSTING_PROJECT_NAME` | Optional launch metadata | A3 | Plain project label only, no token or dashboard URL. |
| `BETA_TEMPORARY_URL` | Optional public Beta URL | A3 | Public HTTPS URL only; no localhost, private dashboard URL, query token, or secret. |

## Release Smoke Checklist

Run these before any Phase 1 public release decision:

1. `cmd.exe /c npm run check:public-visible-language-quality`
2. `cmd.exe /c npm run check:public-surface-user-facing-audit`
3. `cmd.exe /c npm run check:a3-public-beta-phase-1-launch-readiness-checklist`
4. `cmd.exe /c npm run check:a3-no-secret-production-env-and-rollback-checklist`
5. `cmd.exe /c npm run build`
6. `cmd.exe /c npx tsc --noEmit`
7. `cmd.exe /c npm run check:review-gates`

Post-deploy smoke routes:

- `/`
- `/briefing`
- `/weekly`
- `/methodology`
- `/disclaimer`
- `/terms`
- `/privacy`
- `/stocks/TWII`
- `/stocks/2330`
- `/stocks/0050`

## Rollback Checklist

Rollback is a launch-engineering action only. It does not roll back Supabase data, market rows, `daily_prices`, source rights, or scoring state.

Required rollback facts before public launch:

- hosting provider rollback path is known;
- previous deployment reference can be identified;
- rollback owner is named;
- smoke routes to recheck after rollback are named;
- env rollback owner is named;
- data rollback is explicitly out of scope unless a separate data gate exists;
- public message for temporary degraded state is ready;
- rollback decision threshold is defined.

Minimum rollback threshold:

- public home route unavailable,
- legal/trust routes unavailable,
- public pages expose internal strings or secrets,
- production build serves stale or misleading data-state copy,
- error rate or monitoring alert exceeds the accepted launch threshold.

## Analytics Event Draft

Phase 1 should prepare event names without building Phase 2 membership architecture:

| Event | Meaning |
| --- | --- |
| `view_home_market_signal` | User views the free market-light overview. |
| `open_briefing_market_context` | User opens the market context page. |
| `open_stock_signal_detail` | User opens a representative stock or ETF signal page. |
| `open_methodology` | User checks how signals are explained. |
| `open_member_preview` | User opens future member-content teaser or preview. |
| `click_member_interest` | User clicks a free-to-member interest CTA. |

## SEO And Share Metadata Scope

Phase 1 SEO/share readiness should cover:

- Home title and description;
- briefing title and description;
- stock route title pattern;
- canonical site URL;
- sitemap route availability or tracked absence;
- robots policy;
- social share title/description/image fallback;
- no misleading real-time or investment-advice claim in metadata.

## Stop Lines

This checklist does not authorize:

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
- investment advice.

## Next A3 Route

`prepare_phase_1_post_deploy_smoke_and_monitoring_packet`

Expected output:

- production smoke route checklist;
- monitoring owner and alert path;
- rollback owner and threshold;
- analytics event confirmation;
- SEO/share metadata confirmation.
