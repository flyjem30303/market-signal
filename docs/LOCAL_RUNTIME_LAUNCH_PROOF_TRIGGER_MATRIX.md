# Local Runtime Launch Proof Trigger Matrix

Status: `local_runtime_launch_proof_trigger_matrix_ready`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO decision: `use_trigger_matrix_to_prevent_overvalidation`.

The active GOAL now explicitly says validation must serve progress and avoid unnecessary full checks. PM should therefore use this trigger matrix to decide whether a slice stays on focused local proof, escalates to packet-window proof, moves to data/source-rights gate, or pauses for external input.

Current route: `local_runtime_launch_proof_trigger_matrix`.

Current outcome: `trigger_matrix_ready_for_pm_default_routing`.

This matrix does not deploy, does not create or mutate hosting resources, does not connect to Supabase, does not run SQL, does not write Supabase, does not create staging rows, does not modify `daily_prices`, does not fetch or ingest market data, does not promote public runtime state, and does not set real score source.

## Baseline Inputs

This matrix is grounded in:

- `docs/PRE_LAUNCH_EXECUTABLE_STATE_GAP_CONVERGENCE.md`
- `docs/LOCAL_RUNTIME_LAUNCH_PROOF_CONTINUATION.md`
- `docs/RUNTIME_LOCAL_ROUTE_HEALTH_REFRESH_BEFORE_EXECUTABLE_PACKET.md`
- `docs/BETA_DEPLOYMENT_PLATFORM_VALUES_BRIDGE.md`
- `docs/DATA_GATE_READINESS_AFTER_LOCAL_ROUTE_HEALTH_REFRESH.md`
- `docs/PUBLIC_BETA_READINESS_GATE.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Accepted baseline:

- Pre-launch gap convergence is `pre_launch_executable_state_gap_convergence_ready_external_values_and_source_rights_pending`.
- Local runtime launch proof continuation is `local_runtime_launch_proof_continuation_ready_no_external_changes`.
- Runtime local route health refresh is `runtime_local_route_health_refresh_ready_mock_boundary_preserved`.
- Beta deployment platform bridge is `beta_deployment_platform_values_bridge_ready_operator_platform_values_pending`.
- Data gate readiness is `data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked`.
- Public Beta readiness is `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`.
- Public runtime remains `publicDataSource=mock`.
- Score source remains `scoreSource=mock`.

## Trigger Matrix

| Trigger | PM route | Validation level | Stop line |
| --- | --- | --- | --- |
| No platform value change and no source-rights evidence change | `continue_local_runtime_launch_proof_without_external_changes` | Focused local proof only | Do not run packet-window proof. |
| Hosting project name and temporary Beta URL become available | `executable_packet_candidate_after_platform_values` | Packet-window proof | Do not deploy until a separate execution packet passes. |
| TWII source-rights or field-contract evidence changes | `twii_source_rights_and_field_contract_acceptance_or_blocked_record` | Data/source-rights focused gate | Do not probe, generate candidates, write rows, or award coverage points. |
| ETF legal / redistribution evidence changes | `etf_source_rights_outcome_decision_gate` | ETF source-rights focused gate | Do not fetch, store, redistribute, or write ETF data. |
| Runtime or route code changes | `runtime_repair_before_next_gate` then continuation | Route/runtime focused proof; TypeScript/build only if source risk is introduced | Do not infer real promotion from a route fix. |
| TypeScript/build risk is introduced | `packet_window_or_build_risk_validation` | TypeScript/build proof | Do not expand to deployment proof without platform values. |
| Core public route shows Internal Server Error or unavailable page | `runtime_repair_before_next_gate` | Route health proof after repair | Do not continue launch packet work until repaired. |
| Request would reveal secrets or write external systems unsafely | `pause_and_report_external_blocker` | No execution | Stop and report exact blocker. |

## Validation Policy

Focused local proof means:

1. `cmd.exe /c npm run check:local-runtime-launch-proof-continuation`
2. the directly changed checker for the slice;
3. `git diff --check`;
4. `cmd.exe /c npm run check:json` only when JSON or `package.json` changes.

Packet-window proof means the heavier set listed in `docs/BETA_DEPLOYMENT_PLATFORM_VALUES_BRIDGE.md` and only applies after platform project name and temporary Beta URL exist.

Data/source-rights focused gate means the named TWII or ETF source-rights checker plus the directly changed checker. It does not allow remote fetch, candidate generation, Supabase connection, Supabase write, `daily_prices` mutation, row coverage points, public source promotion, or real score promotion.

Runtime repair proof means the route/runtime checker that failed, plus TypeScript/build only if the repair touches TypeScript risk or runtime compilation surfaces.

## PM / A1 / A2 Routing

PM route:

- Use this matrix before choosing validation scope.
- Keep default work on focused local proof while external values are unchanged.
- Switch to packet-window proof only after platform project name and temporary Beta URL exist.
- Switch to data/source-rights focused gates only after new TWII or ETF evidence exists.

A1 route:

- Continue evidence intake for TWII and ETF.
- When evidence changes, provide a no-secret handoff that PM can evaluate with the matching source-rights gate.

A2 route:

- Repair public copy only if a checker or visible route proves a launch-blocking clarity issue.
- Do not spend mainline time on broad visual polish while data and platform blockers dominate the GOAL.

I route:

- Provide hosting project name and temporary Beta URL when available.
- Keep env values, secrets, platform account details, DNS, and SSL outside repo records.

## Acceptance

PM may classify this matrix as `accepted` when:

1. the focused checker passes;
2. focused local proof is the default path;
3. packet-window proof is limited to platform project name and temporary Beta URL availability;
4. data/source-rights gates are limited to changed TWII or ETF evidence;
5. runtime repair proof is limited to route/runtime failures or source risk;
6. `publicDataSource=mock` remains unchanged;
7. `scoreSource=mock` remains unchanged;
8. this matrix does not authorize deployment, SQL, Supabase writes, market-data fetch, broad `daily_prices` mutation, public source promotion, or real score promotion.

## Hard Stops

This matrix does not authorize:

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

CEO recommendation: keep this matrix as the validation selector for the GOAL.

Next PM route:

- `continue_local_runtime_launch_proof_without_external_changes` by default;
- `executable_packet_candidate_after_platform_values` only after platform values exist;
- `twii_source_rights_and_field_contract_acceptance_or_blocked_record` or `etf_source_rights_outcome_decision_gate` only after source-rights evidence changes;
- `runtime_repair_before_next_gate` only when route/runtime proof regresses.

## Verification

Focused verification:

- `node scripts/check-local-runtime-launch-proof-trigger-matrix.mjs`
- `cmd.exe /c npm run check:local-runtime-launch-proof-trigger-matrix`

Milestone integration:

- `cmd.exe /c npm run check:review-gates`
