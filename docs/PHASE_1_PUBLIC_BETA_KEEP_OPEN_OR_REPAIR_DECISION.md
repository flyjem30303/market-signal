# Phase 1 Public Beta Keep-Open Or Repair Decision

Updated: 2026-06-13

Status: `phase_1_public_beta_keep_open_or_repair_decision_ready_mock_only`

Owner: CEO / PM / A3

CEO decision model: `keep_open_repair_or_no_go_after_post_operator_smoke`

## Purpose

This decision record defines how PM turns a filled post-operator smoke packet into one of three actions:

- `KEEP_OPEN_WITH_DEFERRALS`
- `REPAIR_THEN_RECHECK`
- `ROLLBACK_OR_NO_GO`

It exists so Phase 1 public Beta does not drift after operator action. The site either remains open as a clearly labeled mock-only public Beta, enters a bounded repair loop, or is rolled back/held.

This record does not deploy production, change DNS, mutate production environment variables, execute SQL, write Supabase, create staging rows, modify `daily_prices`, fetch raw market data, print secrets, promote `publicDataSource=supabase`, or promote `scoreSource=real`.

## Required Inputs

| Input | Required status |
| --- | --- |
| Post-operator smoke packet | `phase_1_public_beta_post_operator_smoke_packet_ready_mock_only` |
| A3 post-platform action report template | `a3_phase_1_public_beta_post_platform_action_report_template_ready` |
| Operator review summary | `phase_1_public_beta_operator_review_summary_ready_mock_only` |
| Phase 1 launch gap rollup | `public_beta_phase_1_launch_gap_rollup_ready_mock_only` |
| A3 monitoring and repair runbook | `a3_phase_1_public_beta_monitoring_and_repair_runbook_ready` |

## Decision Matrix

| Evidence condition | PM decision | Required action |
| --- | --- | --- |
| All public route smoke rows pass or show deliberate unavailable state; public claim smoke passes; public visible residue cleanup passes; mock/formal-data boundary visible; rollback path known | `KEEP_OPEN_WITH_DEFERRALS` | Keep Phase 1 public Beta open. Record accepted deferrals and monitor. |
| One or more non-critical routes fail; copy or metadata issue is bounded; no hard stop line is touched; rollback is available | `REPAIR_THEN_RECHECK` | Assign PM/A2/A3 repair owner, patch, rerun route smoke and claim smoke. |
| Home or briefing unavailable; legal/trust route unavailable; internal artifacts visible; development residue harms public trust; secret/raw payload/database language visible; investment advice or guaranteed-return language visible | `ROLLBACK_OR_NO_GO` | Roll back or hold public Beta. Do not keep open. |
| Any action requires SQL, Supabase write, staging rows, `daily_prices`, raw market data fetch/store/commit, `publicDataSource=supabase`, or `scoreSource=real` | `ROLLBACK_OR_NO_GO` | Stop and route to separate authorization gate. |

## Accepted Deferrals For Keep-Open

These may remain open after `KEEP_OPEN_WITH_DEFERRALS`:

Keep-open requires `publicDataSource=mock` and `scoreSource=mock`.

- Phase 2 membership implementation.
- Member registration and login.
- Watchlist and custom alerts.
- Post-market review implementation.
- Full real-data source promotion.
- All-listed-equity coverage.
- Supabase write path.
- SQL write execution.
- Real score promotion.
- Advanced analytics tuning.

## Repair Loop Rules

Repair loop must stay narrow:

1. PM classifies the failed item as route, copy, metadata, runtime, or platform.
2. PM assigns owner:
   - route/runtime: PM + A3;
   - trust/legal copy: A2 + PM;
   - source/coverage wording: A1 + A2 + PM;
   - monitoring/rollback: A3.
3. Owner patches only the failing surface.
4. PM reruns the relevant local checks and public smoke.
   - Copy or public route wording repairs must include `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup`.
5. PM chooses `KEEP_OPEN_WITH_DEFERRALS`, another `REPAIR_THEN_RECHECK`, or `ROLLBACK_OR_NO_GO`.

## Hard Stop Lines

- No SQL.
- No Supabase write.
- No staging rows.
- No `daily_prices` mutation.
- No raw market data fetch, store, print, or commit.
- No secrets or raw payload output.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No official endorsement claim.
- No complete Taiwan market coverage claim.
- No real-time precision claim.
- No investment advice or guaranteed-return language.

## Evidence Chain

- `docs/PHASE_1_PUBLIC_BETA_POST_OPERATOR_SMOKE_PACKET.md`
- `docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md`
- `docs/PHASE_1_PUBLIC_BETA_OPERATOR_REVIEW_SUMMARY.md`
- `docs/PUBLIC_BETA_PHASE_1_LAUNCH_GAP_ROLLUP.md`
- `docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md`

## Next PM Route

`phase_1_public_beta_public_status_surface_alignment`

After this decision model is accepted, PM should make sure public-facing status surfaces express the same message: mock-only Beta can be useful, real-data and membership are planned gates, and users should not read the site as investment advice.
