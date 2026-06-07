# Pre-Launch Executable State Gap Convergence

Status: `pre_launch_executable_state_gap_convergence_ready_external_values_and_source_rights_pending`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO decision: `converge_pre_launch_gaps_without_expanding_governance`.

The active GOAL is broader than a single data or deployment task. PM should avoid creating more narrow governance loops and should instead converge the remaining pre-launch executable-state gaps into a short decision map.

Current route: `pre_launch_executable_state_gap_convergence`.

Current outcome: `pre_launch_gap_map_ready_execution_still_blocked`.

This convergence does not deploy, does not create or mutate hosting resources, does not connect to Supabase, does not run SQL, does not write Supabase, does not create staging rows, does not modify `daily_prices`, does not fetch or ingest market data, does not promote public runtime state, and does not set real score source.

## Current Evidence Baseline

Accepted local baseline:

- Public Beta readiness is `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`.
- Runtime local route health refresh is `runtime_local_route_health_refresh_ready_mock_boundary_preserved`.
- Data gate readiness after route health refresh is `data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked`.
- Runtime/data promotion handoff is `runtime_data_promotion_handoff_checklist_ready_mock_boundary_preserved`.
- Runtime summary alignment is `runtime_summary_alignment_from_first_closed_loop_applied_mock_boundary_preserved`.
- First TW equity closed loop is `data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked`.
- Beta deployment platform bridge is `beta_deployment_platform_values_bridge_ready_operator_platform_values_pending`.
- Public runtime remains `publicDataSource=mock`.
- Score source remains `scoreSource=mock`.

Current coverage baseline:

- MVP row coverage target remains `360/360`.
- Accepted aggregate row coverage remains `182/360`.
- TW equity sub-scope remains accepted at `180/180`.
- TWII remains `0/60`.
- ETF remains `2/120`.
- Full MVP coverage remains blocked until TWII and ETF rights, field contracts, candidate artifacts, bounded execution, post-run review, readback, and scoring gates pass.

## Converged Gap Map

| Gap | Current state | Owner | Next executable path |
| --- | --- | --- | --- |
| Platform project name | `platform_generated_value_pending` | I / operator, PM integration | Fill only after hosting project exists or is explicitly named. |
| Temporary Beta URL | `platform_generated_value_pending` | I / operator, PM integration | Fill only after the platform generates a public URL without secret query values. |
| Deployment packet proof | `pm_refresh_at_packet_creation` | PM | Refresh branch, commit, worktree, local proof, TypeScript, build, health, and review gate only in the packet window. |
| TWII source rights | `blocked_external_rights_field_contract_and_asset_mapping_pending` | A1, PM acceptance | Accept source rights, field contract, and asset mapping before any probe, candidate generation, write, or row coverage point. |
| ETF source rights | `rejected_for_execution_pending_external_rights` | A1, PM acceptance | Keep ETF as fallback until legal and redistribution terms are accepted. |
| Runtime real promotion | `not_ready_for_real_data_promotion` | PM | Only revisit after coverage, quality, rights, rollback, public copy, and post-run gates pass. |
| Public Beta deployment | `ready_for_local_public_beta_preflight_not_production_deployed` | PM / I | Create executable packet only after platform values exist and packet-window proof passes. |

## PM / A1 / A2 Routing

PM route:

- Use this convergence as the top-level next-step selector.
- If platform project and temporary Beta URL are available, move to `executable_packet_candidate_after_platform_values`.
- If source-rights evidence changes, move to `twii_source_rights_and_field_contract_acceptance_or_blocked_record`.
- If runtime routes regress, move to `runtime_repair_before_next_gate`.
- If no external values changed, continue local runtime proof, launch trust, and data-promotion handoff checks without adding another narrow governance chain.

A1 route:

- Prioritize TWII source-rights and field-contract evidence because it is the shortest blocked data lane from `182/360` to `242/360`.
- Keep ETF as a parallel fallback lane because it can close `118` missing rows only after source-rights acceptance.
- Do not generate candidates, fetch market data, connect to Supabase, write rows, or award row coverage points from this convergence.

A2 route:

- Only repair public trust copy if a route or checker proves a launch-blocking clarity issue.
- Keep visual polish after runtime/data foundations unless comprehension or legal clarity blocks Beta readiness.

I route:

- Treat hosting project name and temporary Beta URL as the only platform-generated values needed before a later executable packet candidate.
- Do not create hosting resources, deploy, upload secrets, mutate platform env, change DNS/SSL, or claim public launch completion from this convergence.

## Acceptance

PM may classify this convergence as `accepted` when:

1. the focused checker passes;
2. launch, data, runtime, and deployment gaps are visible in one place;
3. platform project name and temporary Beta URL remain explicit external blockers;
4. TWII and ETF source-rights blockers remain explicit external blockers;
5. `publicDataSource=mock` remains unchanged;
6. `scoreSource=mock` remains unchanged;
7. next routes are limited to:
   - `executable_packet_candidate_after_platform_values`;
   - `twii_source_rights_and_field_contract_acceptance_or_blocked_record`;
   - `runtime_repair_before_next_gate`;
   - `continue_local_runtime_launch_proof_without_external_changes`;
8. this convergence does not authorize deployment, SQL, Supabase writes, market-data fetch, broad `daily_prices` mutation, public source promotion, or real score promotion.

## Hard Stops

This convergence does not authorize:

- production deployment;
- preview deployment;
- deployment command execution;
- hosting project creation or mutation;
- platform env mutation;
- DNS or SSL change;
- secret output;
- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- broad `daily_prices` mutation;
- raw market-data fetch, ingest, storage, or commit;
- raw payload, row payload, stock id payload, or secret output;
- row coverage points;
- complete MVP coverage claim;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- investment advice claim;
- public launch completion claim.

## Next Route

CEO recommendation: keep GOAL active and use this convergence to avoid over-fragmentation.

Next PM route:

- `executable_packet_candidate_after_platform_values` if platform project and temporary Beta URL are available;
- otherwise `continue_local_runtime_launch_proof_without_external_changes` while A1 continues TWII / ETF source-rights evidence intake.

## Verification

Focused verification:

- `node scripts/check-pre-launch-executable-state-gap-convergence.mjs`
- `cmd.exe /c npm run check:pre-launch-executable-state-gap-convergence`

Milestone integration:

- `cmd.exe /c npm run check:review-gates`
