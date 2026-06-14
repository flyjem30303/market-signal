# Phase 1 Public Route Health And Operator-Safe Smoke Packet

Updated: 2026-06-14

Status: `phase_1_public_route_health_and_operator_safe_smoke_packet_ready`

Owner: CEO / PM / A3

## Purpose

This packet gives the operator a short, safe path for validating Phase 1 public Beta route health before and after any future platform action.

It bridges the A3 minimum launch-engineering readiness gate into a practical smoke path. It does not deploy production, change DNS, mutate production environment variables, execute SQL, write Supabase, create staging rows, modify `daily_prices`, fetch raw market data, print secrets, promote `publicDataSource=supabase`, or promote `scoreSource=real`.

## Operator-Safe Pre-Action Checks

Run these checks locally before any future platform action:

| Check | Command | Required result |
| --- | --- | --- |
| TypeScript | `cmd.exe /c npx tsc --noEmit` | pass |
| Build | `cmd.exe /c npm run build` | pass |
| A3 minimum launch readiness | `cmd.exe /c npm run check:a3-public-beta-minimum-launch-engineering-readiness` | `status=ok` |
| A3 metadata and public route smoke | `cmd.exe /c npm run check:a3-phase-1-metadata-and-public-route-smoke-checker` | `status=ok` |
| Public visible language | `cmd.exe /c npm run check:public-visible-language-quality` | `status=ok` |
| Public surface audit | `cmd.exe /c npm run check:public-surface-user-facing-audit` | `status=ok` |
| Core route quick proof | `cmd.exe /c npm run check:public-beta-core-route-quick-proof` | `status=ok` |

After `npm run build`, if local dev returns 500 because `.next` dev cache is stale, run:

`cmd.exe /c npm run dev:recover`

Then confirm:

- `http://localhost:3000/` returns 200.
- `http://localhost:3000/briefing` returns 200.
- `http://localhost:3000/stocks/2330` returns 200.

## Minimum Public Route Smoke

The operator-safe route set is:

| Route | Required result | Owner |
| --- | --- | --- |
| `/` | 200 and market-light overview visible | PM / A3 |
| `/briefing` | 200 and market context visible | PM / A3 |
| `/weekly` | 200 and weekly observation path visible | PM / A3 |
| `/membership` | 200 and membership preview boundary visible | PM / A3 / A4 |
| `/methodology` | 200 and signal explanation visible | A2 / A3 |
| `/disclaimer` | 200 and non-investment-advice boundary visible | A2 / A3 |
| `/terms` | 200 and usage boundary visible | A2 / A3 |
| `/privacy` | 200 and privacy boundary visible | A2 / A3 |
| `/stocks/TWII` | 200 or deliberate unavailable state | PM / A3 |
| `/stocks/2330` | 200 or deliberate unavailable state | PM / A3 |
| `/stocks/0050` | 200 or deliberate unavailable state | PM / A3 |
| `/robots.txt` | 200 and internal routes blocked | A3 |
| `/sitemap.xml` | 200 and public routes only | A3 |

## Remote URL Smoke Pattern

For a future preview or production URL, use a no-secret base URL command:

`cmd.exe /c "set PUBLIC_BETA_QUICK_PROOF_BASE_URL=https://market-signal-two.vercel.app&& npm run check:public-beta-core-route-quick-proof"`

Replace the URL only with the public preview or production URL. Do not include tokens, secret query strings, private dashboard URLs, or local file paths.

## Public Claim Guards

Before a public Beta URL is kept open, confirm:

- no command snippets are visible;
- no local paths are visible;
- no internal role labels are visible;
- no environment placeholders are visible;
- no secrets or raw payloads are visible;
- no database implementation language is visible;
- no complete Taiwan market coverage claim appears;
- no live official market-data claim appears;
- no real-time precision claim appears;
- no official endorsement claim appears;
- no guaranteed-return claim appears;
- no investment advice or buy/sell recommendation appears;
- source status, coverage status, update time, and mock/formal-data boundary remain visible.

## Decision Outcomes

`KEEP_OPEN_WITH_DEFERRALS`:

- minimum route smoke passes;
- public claim guards pass;
- `publicDataSource=mock` remains true;
- `scoreSource=mock` remains true;
- Phase 2 membership remains preview/planning only.

`REPAIR_THEN_RECHECK`:

- one or more non-home public routes fail;
- public copy or metadata needs a small correction;
- local repair can be completed and smoke can be rerun quickly.

`ROLLBACK_OR_NO_GO`:

- `/` fails;
- `/briefing` fails;
- `/disclaimer`, `/terms`, or `/privacy` fails;
- public pages expose command snippets, local paths, secrets, raw payloads, database implementation language, investment advice, official endorsement, complete-coverage claims, or real-time precision claims;
- any next action requires SQL, Supabase write, staging rows, `daily_prices`, raw market data fetch/store/commit, `publicDataSource=supabase`, or `scoreSource=real`.

## Workstream Routing

- PM mainline: integrate route health, user-facing readability, and final keep-open decision.
- A1 data/source coverage: continue legal/free/automatable source and coverage work separately; no runtime promotion in this packet.
- A2 public trust copy: verify non-investment-advice, data-source, update-time, and membership-boundary wording.
- A3 launch operations: own route smoke, monitoring, rollback, and operator-safe checklist.
- A4 membership MVP planning: keep Phase 2 membership as preview/spec until Phase 1 public runtime is stable.

## Next Route

`phase_1_public_beta_operator_safe_smoke_or_repair_decision`

If this packet and route smoke pass, CEO/PM may proceed toward a human-operated preview/production check. If not, PM should route to repair and rerun the focused checks.
