# A3 Phase 1 Post-Deploy Smoke And Monitoring Packet

Updated: 2026-06-13

Status: `a3_phase_1_post_deploy_smoke_and_monitoring_packet_ready`

Owner: A3 Launch / Production Engineering

## Purpose

This packet defines the minimum post-deploy verification and monitoring path for Phase 1 public Beta.

It is a launch-engineering packet only. It does not deploy production, mutate platform settings, read secrets, execute SQL, write Supabase, fetch market data, or promote real data.

## Phase 1 Post-Deploy Smoke Routes

These routes are the minimum public smoke set after a future deployment:

| Route | Expected result | Owner | Why it matters |
| --- | --- | --- | --- |
| `/` | 200 and public market-light overview visible | PM / A3 | First screen must explain the market state. |
| `/briefing` | 200 and market context visible | PM / A3 | Users need the 3-minute context path. |
| `/weekly` | 200 and weekly observation path visible | PM / A3 | Return-visit content must load. |
| `/membership` | 200 and membership preview boundary visible | PM / A3 / A4 | Member-conversion preview must load without implying Phase 2 is built. |
| `/methodology` | 200 and signal explanation visible | A2 / A3 | Trust and interpretation support. |
| `/disclaimer` | 200 and risk statement visible | A2 / A3 | Required public boundary. |
| `/terms` | 200 and terms visible | A2 / A3 | Required public boundary. |
| `/privacy` | 200 and privacy statement visible | A2 / A3 | Required public boundary. |
| `/stocks/TWII` | 200 or deliberate unavailable state | PM / A3 | Index anchor route. |
| `/stocks/2330` | 200 or deliberate unavailable state | PM / A3 | Representative listed-equity route. |
| `/stocks/0050` | 200 or deliberate unavailable state | PM / A3 | Representative ETF route. |

Smoke verification must also confirm:

- no command strings are visible;
- no local file paths are visible;
- no internal role labels are visible;
- no env placeholders are visible;
- no secret values are visible;
- no raw payload or database terms are visible;
- no real-time market-data claim appears;
- no investment-advice wording appears.

## Monitoring Owner And Alert Path

Minimum Phase 1 monitoring:

| Monitor | Owner | Alert path | Trigger |
| --- | --- | --- | --- |
| Home uptime | A3 | Hosting dashboard and manual incident note | `/` is unavailable or returns a blocking error. |
| Briefing uptime | A3 | Hosting dashboard and manual incident note | `/briefing` is unavailable or returns a blocking error. |
| Public visible-language regression | PM / A2 | Local checker result before release and after repair | Public routes expose internal strings, mojibake, secrets, or misleading data claims. |
| Build health | PM / A3 | Build output and deployment log | Production build fails or deploy output changes unexpectedly. |
| Legal/trust route availability | A2 / A3 | Manual route smoke result | `/disclaimer`, `/terms`, or `/privacy` is unavailable. |

Phase 1 does not require paid monitoring tooling. Manual checks plus hosting logs are acceptable for public Beta if the rollback threshold is explicit.

## Rollback Owner And Threshold

Rollback owner: A3, with PM approval.

Rollback threshold:

- `/` fails after deploy;
- `/briefing` fails after deploy;
- legal/trust routes fail after deploy;
- public page exposes secrets or internal execution strings;
- public page implies real-time official market data before promotion gates pass;
- public page implies investment advice;
- production build deploys an unintended commit or stale artifact;
- repeated 5xx or blocking client errors affect public route use.

Rollback steps:

1. Identify last known good deployment.
2. Roll back hosting deployment through platform UI or provider-supported rollback path.
3. Re-run the post-deploy smoke routes.
4. Confirm public visible-language smoke is clean.
5. Record incident note with cause, rollback action, and next repair owner.

Data rollback is out of scope for this packet. Any future Supabase, market-row, `daily_prices`, or ingestion rollback must have a separate data gate.

## Analytics Event Confirmation

Phase 1 event names are allowed as planning identifiers only. They do not require a tracking vendor before public Beta.

| Event | Required properties | Phase |
| --- | --- | --- |
| `view_home_market_signal` | route, timestamp, data_state | Phase 1 |
| `open_briefing_market_context` | route, timestamp, entry_source | Phase 1 |
| `open_stock_signal_detail` | route, symbol, timestamp, data_state | Phase 1 |
| `open_methodology` | route, timestamp, entry_source | Phase 1 |
| `open_member_preview` | route, timestamp, source_section | Phase 1 planning |
| `click_member_interest` | route, timestamp, source_section | Phase 1 planning |

Membership conversion analytics are prepared but do not imply Phase 2 login, payment, watchlist storage, or alert execution is built.

## SEO And Share Metadata Confirmation

Phase 1 metadata scope:

- Home title names the index-lighting site.
- Home description explains market status, risk, and observation support.
- Briefing title and description explain market context.
- Stock route title pattern includes symbol and signal context.
- Legal/trust routes have direct titles.
- Canonical site URL uses `NEXT_PUBLIC_SITE_URL` after production value is set.
- Metadata must not claim real-time precision, official endorsement, guaranteed return, or investment advice.
- Sitemap and robots readiness can be tracked as ready, missing, or deferred; absence must be explicit before launch.

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
- investment advice.

## Next A3 Route

`prepare_phase_1_metadata_and_public_route_smoke_checker`

Expected output:

- local checker for required public smoke routes;
- metadata scope checker for high-value routes;
- explicit deferred list for sitemap/robots if not implemented;
- no-secret, no-deploy, no-data-execution posture.
