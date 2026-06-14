# Phase 1 Public Beta Operator-Safe Smoke Or Repair Decision

Updated: 2026-06-14

Status: `phase_1_public_beta_operator_safe_smoke_or_repair_decision_ready`

Owner: CEO / PM / A3

CEO decision model: `operator_safe_smoke_ready_or_repair_before_platform_action`

## Purpose

This decision record turns the operator-safe route-health smoke packet into the next PM action.

It is a pre-platform-action decision. It does not deploy production, change DNS, mutate production environment variables, execute SQL, write Supabase, create staging rows, modify `daily_prices`, fetch raw market data, print secrets, promote `publicDataSource=supabase`, or promote `scoreSource=real`.

## Required Inputs

| Input | Required status |
| --- | --- |
| A3 minimum launch engineering readiness | `a3_public_beta_minimum_launch_engineering_ready` |
| Operator-safe route-health smoke packet | `phase_1_public_route_health_and_operator_safe_smoke_packet_ready` |
| A3 metadata and public route smoke checker | `a3_phase_1_metadata_and_public_route_smoke_checker_ready` |
| Phase 1 public visible language check | `status=ok` |
| Phase 1 public surface audit | `status=ok` |
| Core route quick proof | `status=ok` |
| TypeScript | pass |
| Build | pass |

## Current Decision

Decision: `READY_FOR_HUMAN_OPERATED_PREVIEW_OR_PRODUCTION_CHECK_WITH_MOCK_BOUNDARY`

Rationale:

- The Phase 1 public/free runtime has a defined public route smoke set.
- Public visible-language and residue checks are part of the operator-safe path.
- A3 metadata, sitemap, robots, monitoring, and rollback anchors are represented.
- PM/A1/A2/A3/A4 workstream routing is explicit.
- The site still keeps `publicDataSource=mock` and `scoreSource=mock`.
- The known local `.next` dev-cache 500 after `npm run build` has a documented recovery path: `cmd.exe /c npm run dev:recover`.

## Decision Matrix

| Evidence condition | PM decision | Required action |
| --- | --- | --- |
| Required inputs pass; public route smoke packet is ready; mock boundary remains visible; no hard stop is touched | `READY_FOR_HUMAN_OPERATED_PREVIEW_OR_PRODUCTION_CHECK_WITH_MOCK_BOUNDARY` | Prepare a human-operated preview or production check using the no-secret smoke path. |
| One or more focused checks fail; `/`, `/briefing`, or `/stocks/2330` can be restored locally; issue is route/copy/metadata/dev-cache only | `REPAIR_THEN_RECHECK` | Patch the bounded surface, run `cmd.exe /c npm run dev:recover` if needed, then rerun focused checks. |
| Home, briefing, legal/trust routes, metadata, or public claim guards fail in a way that cannot be repaired locally before platform action | `NO_GO_BEFORE_PLATFORM_ACTION` | Do not proceed to platform action; assign PM/A2/A3 repair owner. |
| Any next action requires SQL, Supabase write, staging rows, `daily_prices`, raw market data fetch/store/commit, `publicDataSource=supabase`, or `scoreSource=real` | `NO_GO_BEFORE_PLATFORM_ACTION` | Stop and route to a separate explicit authorization gate. |

## Operator-Safe Next Action

If this decision remains `READY_FOR_HUMAN_OPERATED_PREVIEW_OR_PRODUCTION_CHECK_WITH_MOCK_BOUNDARY`, the next human-operated action may be prepared as:

1. Confirm the target public URL is a preview or production URL with no secret query strings.
2. Confirm environment values are present in the hosting platform without printing secret values.
3. Run the remote URL smoke command from `docs/PHASE_1_PUBLIC_ROUTE_HEALTH_AND_OPERATOR_SAFE_SMOKE_PACKET.md`.
4. Record the result in the existing post-operator smoke packet if a platform action is actually performed.
5. If the remote smoke fails, choose `REPAIR_THEN_RECHECK`, `ROLLBACK_OR_NO_GO`, or `NO_GO_BEFORE_PLATFORM_ACTION`.

This record itself does not execute step 1-5.

## Workstream Routing

- PM mainline: owns this decision, keeps the Phase 1 public/free runtime moving, and prevents Phase 2 membership scope from entering runtime early.
- A1 data/source coverage: continues legal/free/automatable source and coverage work separately without public runtime promotion.
- A2 public trust copy: confirms non-investment-advice, data-source, update-time, and membership-boundary wording.
- A3 launch operations: owns operator-safe smoke, monitoring, rollback, route health, SEO, sitemap, robots, and hosting-readiness proof.
- A4 membership MVP planning: remains Phase 2 planning/spec only until Phase 1 public runtime is stable.

## Hard Stop Lines

- No SQL.
- No Supabase read/write.
- No staging rows.
- No `daily_prices` mutation.
- No raw market data fetch, store, print, or commit.
- No secrets or raw payload output.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No production deployment in this record.
- No DNS change in this record.
- No production environment mutation in this record.
- No official endorsement claim.
- No complete Taiwan market coverage claim.
- No real-time precision claim.
- No investment advice or guaranteed-return language.

## Evidence Chain

- `docs/A3_PUBLIC_BETA_MINIMUM_LAUNCH_ENGINEERING_READINESS.md`
- `docs/PHASE_1_PUBLIC_ROUTE_HEALTH_AND_OPERATOR_SAFE_SMOKE_PACKET.md`
- `docs/A3_PHASE_1_METADATA_AND_PUBLIC_ROUTE_SMOKE_CHECKER.md`
- `docs/PHASE_1_PUBLIC_BETA_POST_OPERATOR_SMOKE_PACKET.md`
- `docs/PHASE_1_PUBLIC_BETA_KEEP_OPEN_OR_REPAIR_DECISION.md`

## Next PM Route

`prepare_human_operated_preview_or_production_check_without_data_promotion`

If the chairman chooses to perform a platform action, PM/A3 should use the operator-safe packet and keep all data/runtime promotion boundaries intact.
