# Phase 1 Public Beta Post-Operator Smoke Packet

Updated: 2026-06-13

Status: `phase_1_public_beta_post_operator_smoke_packet_ready_mock_only`

Owner: CEO / PM / A3

Trigger: `GO_WITH_MOCK_ONLY_PUBLIC_BETA_AFTER_OPERATOR_SMOKE`

## Purpose

This packet is the PM-facing evidence record after a future operator/platform action.

It converts the operator review summary into a concrete post-action smoke record: public URL, route status, public claim status, rollback status, lane outcomes, and next decision.

This packet does not deploy production, change DNS, mutate production environment variables, execute SQL, write Supabase, create staging rows, modify `daily_prices`, fetch raw market data, print secrets, promote `publicDataSource=supabase`, or promote `scoreSource=real`.

## Required Inputs

| Input | Required status |
| --- | --- |
| Operator review summary | `phase_1_public_beta_operator_review_summary_ready_mock_only` |
| Phase 1 launch gap rollup | `public_beta_phase_1_launch_gap_rollup_ready_mock_only` |
| A3 release ops index | `a3_phase_1_public_beta_release_ops_index_ready` |
| A3 manual platform checklist | `a3_phase_1_public_beta_manual_platform_action_checklist_ready` |
| A3 post-platform action report template | `a3_phase_1_public_beta_post_platform_action_report_template_ready` |
| A3 monitoring and repair runbook | `a3_phase_1_public_beta_monitoring_and_repair_runbook_ready` |

## Evidence Chain

- `docs/PHASE_1_PUBLIC_BETA_OPERATOR_REVIEW_SUMMARY.md`
- `docs/PUBLIC_BETA_PHASE_1_LAUNCH_GAP_ROLLUP.md`
- `docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md`
- `docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md`
- `docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md`
- `docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md`

## Post-Operator Identity

| Field | Value |
| --- | --- |
| `packetId` | `phase1-public-beta-post-operator-smoke-YYYYMMDD-N` |
| `publicUrl` | `pending` |
| `operatorActionType` | `preview_deploy`, `production_deploy`, `rollback`, or `no_action` |
| `operatorActionResult` | `succeeded`, `failed`, `rolled_back`, or `not_run` |
| `dataPosture` | `mock` |
| `scorePosture` | `mock` |
| `chairmanDecision` | `GO_WITH_MOCK_ONLY_PUBLIC_BETA_AFTER_OPERATOR_SMOKE`, `REPAIR_THEN_RECHECK`, or `NO_GO` |

## Route Smoke Table

Fill after the operator action. Every public route must be either `pass` or have a deliberate unavailable state.

| Route | Expected public result | Result | Notes |
| --- | --- | --- | --- |
| `/` | Market status, core indicators, risk prompt, update time | pending |  |
| `/briefing` | Market briefing and next observation | pending |  |
| `/weekly` | Weekly observation context | pending |  |
| `/methodology` | Signal method, source, coverage, update-time explanation | pending |  |
| `/disclaimer` | Non-investment-advice, source, coverage, update-time boundary | pending |  |
| `/terms` | Terms and usage boundary | pending |  |
| `/privacy` | Privacy and data boundary | pending |  |
| `/stocks/TWII` | Representative index route or deliberate unavailable state | pending |  |
| `/stocks/2330` | Representative stock route or deliberate unavailable state | pending |  |
| `/stocks/0050` | Representative ETF route or deliberate unavailable state | pending |  |
| `/robots.txt` | No internal route exposure | pending |  |
| `/sitemap.xml` | Public routes only | pending |  |

## Public Claim Smoke Table

Each item must pass before the public Beta remains open.

| Claim guard | Required result |
| --- | --- |
| no command snippets visible | pass |
| no local file paths visible | pass |
| no internal role labels visible | pass |
| no environment placeholders visible | pass |
| no secrets or raw payloads visible | pass |
| no database implementation language visible | pass |
| no live official market-data claim | pass |
| no complete Taiwan market coverage claim | pass |
| no official endorsement claim | pass |
| no real-time precision claim | pass |
| no investment advice or guaranteed-return language | pass |
| mock/formal-data boundary remains visible | pass |
| source status, coverage status, and update time remain visible | pass |

## Workstream Outcome Table

| Lane | Post-operator responsibility | Result |
| --- | --- | --- |
| PM mainline | Decide keep-open, repair, rollback, or no-go based on public smoke | pending |
| A1 data/source coverage | Confirm no real-data promotion happened; continue source coverage separately | pending |
| A2 public trust copy | Confirm public copy is user-facing, neutral, and non-advice | pending |
| A3 launch operations | Confirm route smoke, rollback readiness, monitoring cadence, and repair owner | pending |
| A4 membership MVP planning | Confirm Phase 2 membership remains deferred and non-blocking | pending |

## Decision Outcomes

`KEEP_OPEN_WITH_DEFERRALS`:

- Public routes pass.
- Public claim smoke passes.
- `publicDataSource=mock` and `scoreSource=mock` remain true.
- Accepted deferrals are still visible and not confused with blockers.

`REPAIR_THEN_RECHECK`:

- One or more public routes fail but rollback is not required.
- Public copy or metadata needs correction.
- PM/A2/A3 can repair quickly and rerun route smoke.

`ROLLBACK_OR_NO_GO`:

- Home or briefing is unavailable.
- Trust/legal routes are unavailable.
- Public pages expose internal artifacts, command snippets, local file paths, secrets, raw payloads, database implementation language, investment advice, official endorsement, complete-coverage claims, or real-time precision claims.
- Any action requires SQL, Supabase write, staging rows, `daily_prices`, raw market data fetch/store/commit, `publicDataSource=supabase`, or `scoreSource=real`.

## Next PM Route

`phase_1_public_beta_keep_open_or_repair_decision`

After this packet is filled, PM should either keep Phase 1 public Beta open with accepted deferrals, route to a repair slice, or recommend rollback/no-go.
