# Formal Launch Deployment Readiness Gate

Status: `formal_launch_deployment_readiness_gate_ready_not_deployed`

Date: 2026-06-07

Owner: PM mainline

Support roles: I Launch / Ops, A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO selects deployment readiness as the next PM mainline formal launch engineering slice while A1 works the TWII data-readiness branch and A2 works the route-level public-copy audit.

This gate is a deployment preflight and launch checklist. It does not deploy the site, does not promote public data source, does not enable real score, and does not claim production launch completion.

Current outcome:

`ready_for_deployment_preflight_review_not_deployed`

## PM Selected Route

PM keeps the mainline on formal launch engineering because ETF source rights are blocked and TWII/A2 support work can continue in parallel.

This route advances objective item 6: deployment preconditions across environment variables, platform posture, health checks, monitoring, rollback, DNS/SSL, secret handling, and launch checklist.

## Current Baseline

Launch baseline evidence:

- Product baseline: `docs/MVP_LAUNCH_PRD.md`.
- DevOps local health/recovery evidence: `scripts/report-devops-health-recovery-readiness.mjs`.
- PM/A1/A2 launch workstream board: `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`.
- Current public runtime boundary: `publicDataSource=mock`.
- Current score boundary: `scoreSource=mock`.
- Current row coverage state: `182/360`.
- TW equity sub-scope: `180/180`.
- Remaining TWII sub-scope: `0/60`.
- Remaining ETF sub-scope: `2/120`, blocked by `legal_and_redistribution_terms_unapproved`.

This gate treats launch as blocked until data, runtime promotion, public trust, and deployment gates are all accepted.

## Deployment Platform Posture

Cheapest viable launch posture:

| Area | Preferred MVP choice | Gate requirement |
| --- | --- | --- |
| Hosting | Vercel or equivalent static/Next.js hosting | Build must pass, required routes must return 200, rollback to prior deployment must be documented. |
| Database | Supabase | Production project, schema, policies, readonly/write gates, and secret handling must be reviewed before real runtime promotion. |
| DNS / CDN | Cloudflare or equivalent DNS provider | Domain, DNS records, SSL, redirect policy, and cache behavior must be documented before launch. |
| Source control | GitHub or equivalent remote | Protected branch, reviewed deployment source, and rollback reference must be documented before launch. |
| Monitoring | Vercel/Supabase logs plus uptime check | At least one route-health monitor and one error/log review path must exist before public launch. |

Equivalent platforms are allowed if PM records the same acceptance evidence.

## Environment Variable Matrix

Do not record secret values in this repository. Only variable names, required posture, and owner are recorded.

| Variable | Launch posture | Owner | Stop line |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Required before public deployment | PM / I | Must match public canonical URL before launch. |
| `NEXT_PUBLIC_DATA_SOURCE` | Must remain `mock` until source-promotion gate passes | PM | Must not be set to `supabase` by this gate. |
| `NEXT_PUBLIC_SUPABASE_URL` | Required only for approved Supabase read/write gates or future real runtime | I / A1 | Do not print value. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required only for approved public Supabase read posture | I / A1 | Do not print value. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only, write-gate only | I / A1 | Never expose to browser, logs, docs, or output. |
| `MARKET_SIGNAL_SUPABASE_READS` | Remains disabled unless a separate read gate accepts it | PM / A1 | Does not promote public source by itself. |
| `DATA_FRESHNESS_SOURCE` | May be mock or separately gated Supabase freshness | PM | Must fallback safely. |
| `DATA_FRESHNESS_SUPABASE_READS` | Remains disabled unless freshness read gate accepts it | PM / A1 | Does not authorize main data source promotion. |
| `INTERNAL_DIAGNOSTICS_ENABLED` | Disabled in public production unless separately gated | PM / I | Internal routes must not leak diagnostics. |
| `INTERNAL_DIAGNOSTICS_TOKEN` | Required only if diagnostics are enabled | I | Do not print value. |

## Health Checks

Required local proof before deployment review:

1. `node node_modules/typescript/bin/tsc --noEmit`
2. `cmd.exe /c npm run check:json`
3. `cmd.exe /c npm run build`
4. `cmd.exe /c npm run dev:recover`
5. `node scripts/check-localhost-full-health.mjs`
6. `node scripts/check-review-gates.mjs`

Required production proof after a future deployment attempt:

1. Home `/` returns 200.
2. `/briefing` returns 200.
3. `/weekly` returns 200.
4. `/stocks/2330` returns 200.
5. `/stocks/TWII` returns 200 or a deliberate available/unavailable state.
6. `/disclaimer`, `/terms`, `/privacy`, and `/methodology` return 200.
7. Public pages preserve mock-only copy until promotion gates pass.
8. No route exposes secrets, raw payloads, row payloads, stock id payloads, SQL text, or raw market data.

## Monitoring And Incident Response

Before production launch, PM/I must record:

- primary uptime check URL;
- secondary smoke route;
- error-log location;
- Supabase log location;
- deployment log location;
- owner for first-response triage;
- rollback owner;
- communication channel for launch incidents;
- maximum acceptable downtime before rollback.

Monitoring does not authorize SQL, Supabase writes, market-data fetch, public source promotion, or real score promotion.

## Rollback And Retention

Deployment rollback requirements:

- Vercel or hosting rollback path to prior deployment is documented.
- DNS rollback or temporary maintenance-route behavior is documented.
- Environment-variable rollback owner is named.
- Supabase data rollback is not assumed by deployment rollback; any data rollback must be a separately named data gate.
- `daily_prices` rollback is not authorized by this deployment gate.
- Staging retention and production retention remain governed by their data-specific gates.

## DNS / SSL / Domain Checklist

Before public launch:

- canonical domain is selected;
- DNS provider is selected;
- production host target is recorded;
- SSL certificate posture is documented;
- HTTP-to-HTTPS redirect is documented;
- www/non-www redirect decision is documented;
- cache and CDN behavior is documented;
- DNS rollback owner is named.

No DNS or SSL change is executed by this gate.

## Secret Handling

Secret handling requirements:

- Do not commit `.env.local`.
- Do not print Supabase keys.
- Do not print Vercel, Cloudflare, GitHub, or DNS tokens.
- Use platform secret stores for production secrets.
- Keep service-role keys server-only.
- Rotate any secret if it is ever printed or committed.
- Confirm public routes do not expose internal diagnostics or service-only values.

## Launch Checklist

Formal launch remains blocked until PM records accepted outcomes for:

| Checklist item | Current status |
| --- | --- |
| MVP route health | `local_ready_production_not_verified` |
| Public trust/legal copy | `prepared_route_audit_pending` |
| Row coverage | `182/360_incomplete` |
| Runtime promotion | `publicDataSource=mock_scoreSource=mock` |
| Ingestion/backfill | `partially_complete_twiroutes_pending` |
| Investment indicators | `launch_safe_spec_ready_real_implementation_waits` |
| Deployment platform | `preflight_gate_ready_not_deployed` |
| Monitoring / rollback | `checklist_ready_not_accepted` |
| DNS / SSL | `checklist_ready_not_executed` |
| Secret handling | `checklist_ready_not_verified_in_platform` |

## A1 / A2 Coordination

A1 current assignment:

- Prepare TWII source-rights and candidate readiness packet for `TWII` `0/60`.
- Keep all work local-only and no-execution.

A2 current assignment:

- Prepare route-level launch copy audit across public surfaces.
- Keep all work copy-audit only and no-promotion.

PM will review A1/A2 outputs when their checkers pass, classify them as `accepted`, `rejected`, `needs_bounded_repair`, or `blocked`, and immediately assign the next highest-value task.

## Hard Stop

This gate:

- does not deploy production;
- does not run SQL;
- does not connect to Supabase;
- does not write Supabase;
- does not create staging rows;
- does not modify `daily_prices`;
- does not fetch raw market data;
- does not ingest raw market data;
- does not store raw market data;
- does not commit raw market data;
- does not output secrets;
- does not output raw payload;
- does not output row payload;
- does not output stock id payload;
- does not give row coverage points;
- does not promote `publicDataSource=supabase`;
- does not set `scoreSource=real`;
- does not claim formal launch completion.

## Verification

Use:

- `node scripts/check-formal-launch-deployment-readiness-gate.mjs`
- `cmd.exe /c npm run check:formal-launch-deployment-readiness-gate`

Milestone integration should also run:

- `node scripts/check-launch-engineering-workstream-board.mjs`
- `node scripts/check-review-gates.mjs`
