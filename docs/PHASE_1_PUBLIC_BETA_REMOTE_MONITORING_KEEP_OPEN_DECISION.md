# Phase 1 Public Beta Remote Monitoring Keep-Open Decision

Updated: 2026-06-14

Status: `phase_1_public_beta_remote_monitoring_keep_open_decision_ready`

Owner: PM mainline / A3 Launch

## Purpose

This decision record converts the current remote monitoring snapshot into a practical PM keep-open / repair / pause decision.

It is for the already deployed public alias:

- `https://market-signal-two.vercel.app`

It does not execute deploy, change DNS, mutate environment variables, run SQL, read or write Supabase, create staging rows, modify `daily_prices`, fetch or store raw market data, print secrets, promote `publicDataSource=supabase`, promote `scoreSource=real`, implement login, implement watchlist persistence, execute alerts, or publish member-only content.

## Required Upstream Statuses

| Upstream artifact | Required status |
| --- | --- |
| A3 remote monitoring snapshot | `a3_phase_1_public_beta_remote_monitoring_snapshot_ready` |
| A3 monitoring and repair runbook | `a3_phase_1_public_beta_monitoring_and_repair_runbook_ready` |
| A3 release ops index | `a3_phase_1_public_beta_release_ops_index_ready` |
| Phase 1 / Phase 2 execution split | `phase_1_phase_2_execution_split_ready` |
| PM BRIEF runtime mainline goal | `pm_brief_runtime_mainline_goal_ready` |

## Current Remote Monitor Decision

| Field | Current value |
| --- | --- |
| `decisionId` | `phase1-public-beta-remote-monitoring-keep-open-20260614-1` |
| `remoteBaseUrl` | `https://market-signal-two.vercel.app` |
| `remoteMonitoringStatus` | `pass` |
| `routeSmokeSummary` | `pass` |
| `publicClaimSmokeSummary` | `pass` |
| `publicVisibleResidueSummary` | `pass` |
| `membershipBoundarySummary` | `pass_phase_2_preview_only` |
| `publicDataSource` | `mock` |
| `scoreSource` | `mock` |
| `decision` | `KEEP_OPEN_WITH_DEFERRALS_FROM_REMOTE_MONITOR` |
| `nextRoute` | `continue_remote_monitoring_cadence_and_repair_if_regression` |

## Keep-Open Conditions

PM may keep the public alias open under the mock/demo boundary when all conditions remain true:

- remote route monitor passes for `/`, `/briefing`, `/weekly`, `/membership`, representative stock/index routes, trust routes, `/robots.txt`, and `/sitemap.xml`;
- public copy still says formal market data is not enabled;
- public copy still says the current data is demo/mock-style reading support;
- public copy does not imply live official market data, complete market coverage, official endorsement, guaranteed returns, investment advice, or buy/sell/hold guidance;
- membership is still presented as Phase 2 roadmap/preview, not as a live login/payment/watchlist/alert system;
- `publicDataSource=mock`;
- `scoreSource=mock`;
- no SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch, or secret output occurred.

## Repair / Pause Rules

| Monitor result | PM decision | Owner | Next action |
| --- | --- | --- | --- |
| all checks pass | `KEEP_OPEN_WITH_DEFERRALS_FROM_REMOTE_MONITOR` | PM + A3 | Continue monitoring cadence and keep accepted deferrals visible. |
| route 5xx, route unavailable, robots/sitemap exposes internal paths | `REPAIR_THEN_RECHECK_REMOTE_ROUTE` | A3 | Repair route/platform issue, then rerun remote monitor. |
| misleading source/update/coverage/no-advice wording | `REPAIR_THEN_RECHECK_PUBLIC_COPY` | A2 | Patch public copy and rerun public language / residue checks plus remote monitor. |
| membership page implies login/payment/watchlist/alerts are live | `REPAIR_THEN_RECHECK_MEMBERSHIP_BOUNDARY` | A4 + PM | Restore Phase 2 preview wording and rerun remote monitor. |
| secret/internal/raw payload exposure, investment-advice implication, live official data claim, complete coverage claim, repeated 5xx | `PAUSE_OR_ROLLBACK_UNTIL_REPAIRED` | A3 + PM | Close/rollback/pause public Beta path until repaired. |
| data-source or coverage work remains incomplete but public copy stays honest | `KEEP_OPEN_ACCEPTED_DATA_DEFERRAL` | A1 + PM | Continue data work in A1; do not block Phase 1 public alias. |

## Monitoring Cadence

| Window | Owner | Command / evidence |
| --- | --- | --- |
| After each deployment | A3 | `cmd.exe /c npm run check:a3-phase-1-public-beta-remote-monitoring-snapshot` |
| Each business day during Beta | PM | Remote monitor result plus public visible residue cleanup status. |
| After copy repair | A2 + PM | Public language quality, public surface audit, and remote monitor. |
| After route/platform repair | A3 | Remote monitor, metadata route smoke, and TypeScript if source changed. |
| Weekly CEO/PM review | CEO + PM | Decide whether to keep Phase 1 open, widen Phase 2 planning, or focus A1 data-source promotion prerequisites. |

## Accepted Deferrals While Keep-Open

The public alias can remain open while these remain explicit deferrals:

- real-data promotion;
- full Taiwan all-listed-equity coverage;
- repeatable ingestion/backfill execution;
- Phase 2 member login;
- Phase 2 watchlist persistence;
- Phase 2 custom alert execution;
- Phase 2 member-only three-layer interpretation;
- payment/subscription flow;
- custom domain;
- paid monitoring/analytics vendor;
- global market expansion.

## Required Checks

Run:

1. `cmd.exe /c npm run check:a3-phase-1-public-beta-remote-monitoring-snapshot`
2. `cmd.exe /c npm run check:phase-1-public-beta-remote-monitoring-keep-open-decision`
3. `cmd.exe /c npm run check:a3-phase-1-public-beta-release-ops-index`
4. `cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams`
5. `cmd.exe /c npx tsc --noEmit`

## Stop Lines

This decision does not authorize:

- production deploy;
- DNS change;
- production env mutation;
- SQL execution;
- Supabase read/write;
- staging-row creation;
- `daily_prices` mutation;
- raw market-data fetch, ingest, storage, logging, or commit;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- live official market-data claim;
- official endorsement claim;
- guaranteed-return claim;
- personalized investment advice;
- buy/sell/hold recommendation;
- Phase 2 login, payment, watchlist persistence, alert execution, or member-only content implementation.

## Next Route

`continue_remote_monitoring_cadence_and_repair_if_regression`

Expected PM behavior:

- keep the public alias open only while remote monitoring passes;
- repair copy, route, membership-boundary, or trust regressions through the smallest owner lane;
- keep A1 data work and A4 membership planning moving in parallel without claiming they are live;
- rerun the remote monitor after each future deploy or public-copy repair.

