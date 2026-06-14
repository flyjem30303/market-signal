# Human-Operated Preview Or Production Check Without Data Promotion

Updated: 2026-06-14

Status: `human_operated_preview_or_production_check_without_data_promotion_ready`

Owner: CEO / PM / A3

Decision source: `READY_FOR_HUMAN_OPERATED_PREVIEW_OR_PRODUCTION_CHECK_WITH_MOCK_BOUNDARY`

## Purpose

This is the short operator checklist for a human-operated Vercel preview or production check.

It converts the current Phase 1 public Beta readiness into a no-secret, no-data-promotion action path. It does not press deploy from this repo, change DNS, mutate production environment variables, execute SQL, read/write Supabase, create staging rows, modify `daily_prices`, fetch raw market data, print secrets, promote `publicDataSource=supabase`, or promote `scoreSource=real`.

## Before Opening Vercel

Run the focused local checks:

| Check | Command | Required result |
| --- | --- | --- |
| Operator-safe decision | `cmd.exe /c npm run check:phase-1-public-beta-operator-safe-smoke-or-repair-decision` | `status=ok` |
| Operator-safe smoke packet | `cmd.exe /c npm run check:phase-1-public-route-health-and-operator-safe-smoke-packet` | `status=ok` |
| A3 launch engineering readiness | `cmd.exe /c npm run check:a3-public-beta-minimum-launch-engineering-readiness` | `status=ok` |
| Public visible language | `cmd.exe /c npm run check:public-visible-language-quality` | `status=ok` |
| Public surface audit | `cmd.exe /c npm run check:public-surface-user-facing-audit` | `status=ok` |
| Core route quick proof | `cmd.exe /c npm run check:public-beta-core-route-quick-proof` | `status=ok` |
| TypeScript | `cmd.exe /c npx tsc --noEmit` | pass |

Optional if a fresh platform build will be compared:

`cmd.exe /c npm run build`

If local dev returns 500 after build because `.next` dev cache is stale, run:

`cmd.exe /c npm run dev:recover`

## Human Operator Steps

The human operator may open Vercel or an equivalent host and verify these items by sight:

1. Project/repository matches the intended public Beta project.
2. Source branch is `main` unless PM intentionally names another release branch.
3. Framework preset is Next.js.
4. Build command is compatible with `npm run build`.
5. Public URL is HTTPS and contains no secret query string.
6. Rollback path or previous deployment label is visible.
7. Environment variable names are present where needed, but values are not copied into repo, docs, screenshots, or chat.
8. `NEXT_PUBLIC_SITE_URL` matches the public canonical URL before production launch.
9. `NEXT_PUBLIC_DATA_SOURCE` remains mock-compatible.
10. `NEXT_PUBLIC_SCORE_SOURCE` or equivalent score posture remains mock-compatible.

## Remote Smoke Command

For a public preview or production URL, run:

```cmd
cmd.exe /c "set PUBLIC_BETA_QUICK_PROOF_BASE_URL=https://market-signal-two.vercel.app&& npm run check:public-beta-core-route-quick-proof"
```

Replace only the URL with the public preview or production URL. Do not include Vercel dashboard URLs, tokens, private preview links, secret query strings, or local file paths.

Required result: `status=ok`.

## Manual Route Checks

If the remote command cannot be run immediately, manually open:

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
- `/robots.txt`
- `/sitemap.xml`

Every page must either return 200 or show a deliberate unavailable state that does not imply a platform failure.

## Public Claim Checks

Keep the URL open only if public pages do not show:

- command snippets;
- local paths;
- internal role labels;
- environment placeholders;
- secret values;
- raw payloads;
- database implementation language;
- complete Taiwan market coverage claims;
- live official market-data claims;
- real-time precision claims;
- official endorsement claims;
- guaranteed-return claims;
- investment advice or buy/sell/hold recommendations.

Public pages should still show or imply:

- market-light overview;
- core indicators;
- risk prompt;
- update time or data timing;
- source/coverage boundary;
- mock/formal-data boundary;
- non-investment-advice posture;
- Phase 2 membership is preview/planning only.

## Allowed Operator Reply

The operator reply must contain only no-secret fields:

```text
actionTaken=<none|preview_check|production_check|rollback>
publicUrl=<https public URL or pending>
deploymentLabel=<non-secret deployment label or pending>
routeSmoke=<pass|fail|not_run>
claimSmoke=<pass|fail|not_run>
rollbackReady=<yes|no|not_checked>
nextRoute=<keep_open_with_deferrals|repair_then_recheck|rollback_or_no_go|no_action>
```

Do not include environment values, dashboard URLs, tokens, screenshots with secrets, raw payloads, SQL output, Supabase rows, or market-data rows.

## Decision Outcomes

`KEEP_OPEN_WITH_DEFERRALS`:

- remote or manual route smoke passes;
- public claim checks pass;
- `publicDataSource=mock` remains true;
- `scoreSource=mock` remains true;
- Phase 2 membership remains preview/planning only.

`REPAIR_THEN_RECHECK`:

- a route, copy, metadata, or environment-name issue is bounded;
- no hard stop line is touched;
- PM/A2/A3 can patch or operator can correct a non-secret platform setting and rerun smoke.

`ROLLBACK_OR_NO_GO`:

- home, briefing, legal/trust routes, robots, or sitemap fail hard;
- public pages expose secrets, raw payloads, internal execution wording, database language, investment advice, official endorsement, complete-coverage claims, or real-time precision claims;
- any action would require SQL, Supabase read/write, staging rows, `daily_prices`, raw market data fetch/store/commit, `publicDataSource=supabase`, or `scoreSource=real`.

## Stop Lines

- No SQL.
- No Supabase read/write.
- No staging rows.
- No `daily_prices` mutation.
- No raw market data fetch, store, print, or commit.
- No secrets or raw payload output.
- No platform env value output.
- No private dashboard URL output.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No official endorsement claim.
- No complete Taiwan market coverage claim.
- No real-time precision claim.
- No guaranteed return claim.
- No investment advice claim.
- No Phase 2 membership implementation as a Phase 1 requirement.

## Workstream Routing

- PM mainline: receive operator reply, decide keep-open, repair, rollback, or no-action.
- A1 data/source coverage: continue data/source/coverage separately; no runtime promotion from this checklist.
- A2 public trust copy: review any public copy/claim repair.
- A3 launch operations: own platform smoke, rollback, monitoring, and operator reply intake.
- A4 membership MVP planning: keep membership as Phase 2 preview/spec until Phase 1 public runtime is stable.

## Next PM Route

`record_human_operated_preview_or_production_check_reply_or_continue_public_runtime`

If the operator does not run a platform check, PM continues concrete Phase 1 public runtime, trust copy, source/coverage, and membership-MVP planning without changing data posture.
