# Launch Engineering Workstream Board

Status: `launch_engineering_workstream_board_ready`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO keeps the active GOAL pointed at public Beta readiness plus the first usable data-realification closed loop, not a single sequential data task.

PM should run the mainline while A1 and A2 remove future blockers in parallel. PM remains the only integration owner. A1 and A2 may prepare local-only handoff packets and checkers, but PM decides whether the output is accepted, rejected, repaired, or integrated.

## Current Launch Engineering State

This board uses the current project state as the baseline:

- MVP row coverage target: `360/360`.
- Latest accepted aggregate row coverage evidence: `182/360`.
- Completed TW equity sub-scope: `2330`, `2382`, and `2308` at `180/180`.
- Remaining TWII index sub-scope: `0/60`.
- Remaining ETF sub-scope: `0050` and `006208` at `2/120`, with `118` missing.
- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.
- Public source promotion and real-score promotion remain blocked until separate promotion gates pass.

This board does not claim launch completion, data-source promotion, row coverage points, or real score readiness.

## PM Mainline Route

PM owns the launch path and should keep moving without waiting for A1/A2 when a safe mainline task is available.

Current PM route:

1. Keep Level 1 MVP coverage moving toward `360/360`.
2. Maintain the runtime promotion gate so mock-to-real decisions remain explicit.
3. Keep ingestion/backfill, write/readback, rollback, and retention rules visible before any production data movement.
4. Prepare launch readiness across environment variables, deployment health, monitoring, rollback, DNS/SSL, and secret handling.
5. Integrate A1/A2 handoffs only after the relevant local checker passes.
6. Preserve `publicDataSource=mock` and `scoreSource=mock` until a separate promotion gate accepts the change.

Latest PM mainline completion review:

- `docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md` is `accepted` as PM mainline deployment preflight.
- `docs/PUBLIC_BETA_READINESS_GATE.md` is `accepted` as PM mainline Beta preflight.
- `docs/BETA_LAUNCH_PREFLIGHT_PACKET.md` is `accepted` as PM mainline Beta launch preflight.
- `docs/BETA_RELEASE_RUNBOOK_DRAFT.md` is `accepted` as PM mainline draft runbook before any deploy.
- `docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md` is `accepted` as PM mainline deployment execution gate preparation.
- `docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md` is `accepted` as PM mainline deployment operator input preparation.
- `docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md` is `accepted` as PM mainline non-executable deployment execution packet draft.
- `docs/BETA_DEPLOYMENT_OPERATOR_FILL_GUIDE.md` is `accepted` as PM mainline operator fill guide before executable deployment packet.
- `docs/BETA_DEPLOYMENT_INTAKE_CHECKLIST.md` is `accepted` as PM mainline deployment intake checklist before operator values are filled.
- `docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md` is `accepted` as PM mainline executable packet candidate gate while operator values remain pending.
- `docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md` is `accepted` as PM mainline minimal operator values sheet.
- `docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md` is `accepted` as PM mainline operator values completion gate.
- `docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md` is `accepted` as PM mainline no-secret operator values record candidate.
- `docs/BETA_DEPLOYMENT_OPERATOR_VALUES_SAFE_FILL_RECHECK.md` is `accepted` as PM mainline operator values safe fill recheck.
- `docs/LOCAL_LAUNCH_PREFLIGHT_WITHOUT_EXTERNAL_OPERATOR_VALUES.md` is `accepted` as PM mainline local launch preflight while external operator values remain pending.
- `docs/LOCAL_LAUNCH_PROOF_BUNDLE_SNAPSHOT.md` is `accepted` as PM mainline local proof bundle snapshot while external operator values remain pending.
- `docs/BETA_DEPLOYMENT_OPERATOR_VALUES_GAP_LIST.md` is `accepted` as PM mainline short operator values gap list while external values remain pending.
- `docs/BETA_DEPLOYMENT_OPERATOR_VALUES_DEFAULTS_AND_REMAINING_GAPS.md` is `accepted` as PM mainline operator values defaults and remaining gaps packet.
- `docs/LOCAL_LAUNCH_PROOF_REFRESH_BEFORE_EXECUTABLE_PACKET.md` is `accepted` as PM mainline local proof refresh before executable packet.
- `docs/BETA_DEPLOYMENT_PLATFORM_VALUES_BRIDGE.md` is `accepted` as PM mainline platform values bridge before executable packet.
- `docs/BETA_DEPLOYMENT_PACKET_WINDOW_READINESS_SELECTOR.md` is `accepted` as PM mainline packet-window readiness selector; status is `beta_deployment_packet_window_readiness_selector_ready_platform_values_pending`, outcome is `packet_window_ready_for_platform_values_not_deployment`, and next route is `beta_deployment_executable_packet_after_platform_values`.
- `docs/DATA_REALIFICATION_POST_FIRST_CLOSED_LOOP_NEXT_LANE_SELECTOR.md` is `accepted` as PM/A1 post-first-closed-loop next data lane selector; status is `data_realification_post_first_closed_loop_next_lane_selector_ready`, outcome is `twii_first_if_rights_change_otherwise_beta_runtime_mainline`, PM route is `beta_deployment_executable_packet_after_platform_values_or_runtime_promotion_readiness_with_mock_boundary`, and A1 route is `fill_twii_or_etf_source_rights_evidence_before_candidate_gate`.
- `docs/BETA_RUNTIME_FAST_HEALTH_GATE.md` is `accepted` as PM mainline fast runtime health gate; status is `beta_runtime_fast_health_gate_ready`, outcome is `fast_runtime_health_available_for_beta_mainline`, and `check:localhost-full-health` remains milestone-only instead of routine PM proof.
- `docs/BETA_EXECUTABLE_PACKET_REPO_PROOF_RUNNER_GATE.md` is `accepted` as PM mainline repo proof runner gate; status is `beta_executable_packet_repo_proof_runner_gate_ready`, outcome is `repo_proof_runner_ready_packet_still_blocked_external_platform_values_pending`, and runner `run:beta-executable-packet-repo-proof` refreshes repo-derived packet proof while keeping platform values as blockers.
- `docs/BETA_PLATFORM_TWO_VALUE_INTAKE_GATE.md` is `accepted` as PM mainline two-value platform intake gate; status is `beta_platform_two_value_intake_gate_ready_waiting_two_values`, outcome is `waiting_for_hosting_project_name_and_temporary_beta_url`, and the next packet window waits only for safe hosting project name plus public temporary Beta URL.
- `docs/BETA_PLATFORM_TWO_VALUE_VALIDATOR.md` is `accepted` as PM mainline two-value validator; status is `beta_platform_two_value_validator_ready_waiting_values`, outcome is `validator_ready_waiting_for_two_safe_values`, and `validate:beta-platform-two-values` checks the safe shape of `BETA_HOSTING_PROJECT_NAME` plus `BETA_TEMPORARY_URL` before any packet-window candidate.
- The Beta platform value intake fallback is `accepted` as PM mainline execution support: `validate:beta-platform-two-values` can now read only `BETA_HOSTING_PROJECT_NAME` and `BETA_TEMPORARY_URL` from `.env.local` when shell values are missing, while keeping output boolean/shape-only and not printing either value.
- The Beta platform env template is `accepted` as PM mainline operator support: `.env.example` now carries blank placeholders for `BETA_HOSTING_PROJECT_NAME` and `BETA_TEMPORARY_URL`, and `check:env` verifies both keys without storing actual platform values.
- The Beta packet chain env propagation is `accepted` as PM mainline execution support: validator, dry-run, and candidate renderer now share `scripts/lib/beta-platform-values.mjs`, so `.env.local` values are not lost between packet-window steps.
- `docs/BETA_TWO_VALUE_OPERATOR_HANDOFF.md` is `accepted` as I/PM two-value operator handoff; status is `beta_two_value_operator_handoff_ready_waiting_values`, outcome is `handoff_ready_waiting_for_project_name_and_public_beta_url`, and it keeps the next external input limited to `BETA_HOSTING_PROJECT_NAME` plus `BETA_TEMPORARY_URL`.
- `docs/BETA_LAUNCH_NEXT_ACTION_REPORT.md` is `accepted` as PM mainline next-action router; status is `beta_launch_next_action_report_ready`, current missing-value route is `blocked_waiting_two_platform_values`, and `report:beta-launch-next-action` now routes PM to either the two-value intake, `run:beta-packet-window-proof-map`, or `render:beta-pre-execution-packet-candidate` without reopening broad deployment planning.
- `docs/BETA_PLATFORM_UNBLOCK_KIT.md` is `accepted` as PM mainline two-value blocker support; status is `beta_platform_unblock_kit_ready_waiting_values`, outcome is `two_value_blocker_made_executable_without_value_output`, and `report:beta-platform-unblock-kit` consolidates missing-value status, next PM command, post-value proof-map command, reviewed-artifact recorder command, and A1/A2/I parallel routing without printing values or authorizing deployment.
- `docs/BETA_MAINLINE_CURRENT_ROUTE_REPORT.md` is `accepted` as PM mainline current-route consolidation; status is `beta_mainline_current_route_report_ready`, CEO decision is `keep_beta_mainline_moving_with_a1_a2_parallel_routes`, and `report:beta-mainline-current-route` combines Beta platform unblock state, A1 exact TWII/ETF source-rights evidence state, and A2 public-copy readiness into one route report before PM chooses the next slice.
- `docs/BETA_PACKET_WINDOW_CANDIDATE_DRY_RUN_RUNNER.md` is `accepted` as PM mainline packet-window dry-run runner; status is `beta_packet_window_candidate_dry_run_runner_ready_waiting_values`, outcome is `dry_run_runner_ready_external_values_still_pending`, and `run:beta-packet-window-candidate-dry-run` wires two-value validation to repo proof before any executable packet-window candidate.
- `docs/BETA_PACKET_WINDOW_EXECUTABLE_CANDIDATE_TEMPLATE.md` is `accepted` as PM mainline executable candidate template; status is `beta_packet_window_executable_candidate_template_ready_waiting_values`, outcome is `candidate_template_ready_external_values_still_pending`, and `render:beta-packet-window-candidate-template` prepares a shape-only no-secret candidate object after the dry-run runner becomes ready.
- `docs/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_ACCEPTANCE_GATE.md` is `accepted` as PM mainline reviewed artifact acceptance gate; status is `beta_packet_window_reviewed_artifact_acceptance_gate_ready_waiting_values`, outcome is `acceptance_gate_ready_external_values_still_pending`, and the next packet-window artifact must record `accepted` or `rejected` without changing mock/runtime boundaries.
- `docs/BETA_PACKET_WINDOW_NO_SECRET_ARTIFACT_CREATION_RUNBOOK.md` is `accepted` as PM mainline no-secret artifact creation runbook; status is `beta_packet_window_no_secret_artifact_creation_runbook_ready_waiting_values`, outcome is `artifact_creation_runbook_ready_external_values_still_pending`, and `render:beta-packet-window-reviewed-artifact-record-template` emits only a `pending_pm_review` record template after the candidate template becomes ready.
- `docs/BETA_PACKET_WINDOW_ONE_COMMAND_PROOF_MAP.md` is `accepted` as PM mainline one-command proof map; status is `beta_packet_window_one_command_proof_map_ready_waiting_values`, outcome is `one_command_proof_map_ready_external_values_still_pending`, and `run:beta-packet-window-proof-map` evaluates validator, dry-run, candidate template, and reviewed artifact record template in one safe local sequence.
- `docs/BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_OUTCOME_RECORDER.md` is `accepted` as PM mainline reviewed artifact outcome recorder; status is `beta_packet_window_reviewed_artifact_outcome_recorder_ready_waiting_values`, outcome is `outcome_recorder_ready_external_values_still_pending`, and `record:beta-packet-window-reviewed-artifact-outcome` can record a later `accepted` or `rejected` no-secret review artifact only after the proof map reaches pending PM review and `--apply` is provided.
- `docs/BETA_PACKET_TO_DEPLOYMENT_PRE_EXECUTION_BRIDGE.md` is `accepted` as PM mainline packet-to-deployment pre-execution bridge; status is `beta_packet_to_deployment_pre_execution_bridge_ready_waiting_reviewed_artifact`, outcome is `bridge_ready_waiting_for_accepted_reviewed_artifact`, and an accepted packet-window reviewed artifact may only route to a separate pre-execution packet candidate, not deployment.
- `docs/BETA_PRE_EXECUTION_PACKET_CANDIDATE_TEMPLATE.md` is `accepted` as PM mainline pre-execution packet candidate template; status is `beta_pre_execution_packet_candidate_template_ready_waiting_accepted_artifact`, outcome is `waiting_for_accepted_packet_window_reviewed_artifact`, and `render:beta-pre-execution-packet-candidate` returns a local JSON candidate only after an accepted no-secret reviewed artifact exists while keeping `deploymentAuthorized=false`, `publicDataSource=mock`, and `scoreSource=mock`.
- `docs/CHAIRMAN_BETA_LAUNCH_REVIEW_PACKET.md` is `accepted` as CEO/PM chairman-reviewable Beta launch packet; status is `chairman_beta_launch_review_packet_ready_for_review_not_deployed`, recommended outcome is `accepted_to_continue_beta_packet_window`, and it consolidates the two pending safe platform values, PM/A1/A2/I assignments, current blockers, and no-deployment / mock-boundary hard stops.
- `docs/PRE_LAUNCH_EXECUTABLE_STATE_GAP_CONVERGENCE.md` is `accepted` as PM mainline pre-launch executable-state gap convergence.
- `docs/LOCAL_RUNTIME_LAUNCH_PROOF_CONTINUATION.md` is `accepted` as PM mainline local runtime launch proof continuation.
- `docs/LOCAL_RUNTIME_LAUNCH_PROOF_TRIGGER_MATRIX.md` is `accepted` as PM mainline validation trigger matrix.
- `docs/RUNTIME_LOCAL_ROUTE_HEALTH_REFRESH_BEFORE_EXECUTABLE_PACKET.md` is `accepted` as PM mainline local route health refresh.
- `docs/DATA_GATE_READINESS_AFTER_LOCAL_ROUTE_HEALTH_REFRESH.md` is `accepted` as PM mainline data gate readiness after local route health refresh.
- `docs/RUNTIME_DATA_PROMOTION_HANDOFF_CHECKLIST.md` is `accepted` as PM mainline runtime/data promotion handoff checklist.
- `docs/RUNTIME_SUMMARY_ALIGNMENT_FROM_FIRST_CLOSED_LOOP.md` is `accepted` as PM mainline runtime summary alignment.
- `docs/A1_SOURCE_RIGHTS_UNBLOCK_PRIORITY_PACKET.md` is `accepted` as A1/PM source-rights unblock priority packet.
- `docs/A1_TWII_SOURCE_RIGHTS_UNBLOCK_DECISION_RECORD_CANDIDATE.md` is `accepted` as A1/PM TWII source-rights decision record candidate.
- `docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md` is `accepted` as A1/PM TWII source-rights evidence intake and fallback decision support.
- `docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md` is `accepted` as A1/PM TWII official-source intake fields and vendor terms review packet.
- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md` is `blocked` as a PM mainline data gate because TWII source rights and field contract remain unresolved.
- `docs/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_ACCEPTANCE_OR_BLOCKED_RECORD.md` is `blocked` as PM mainline acceptance-or-blocked record because source rights, field contract, and asset mapping remain unresolved.
- `docs/TWII_VENDOR_INTERNAL_OR_ETF_FALLBACK_SELECTION.md` is `accepted` as PM fallback selection, keeping A1 on vendor/internal-feed evidence while PM mainline continues launch/runtime work that does not require real data promotion.
- `docs/A1_TWII_VENDOR_TERMS_OR_INTERNAL_FEED_OWNER_EVIDENCE_PACKET.md` is `accepted` as A1 no-secret vendor/internal evidence packet; it is not filled and does not approve any source lane.
- `docs/TWII_VENDOR_INTERNAL_EVIDENCE_OUTCOME_LEDGER.md` is `accepted` as PM/A1 no-secret TWII vendor/internal evidence outcome ledger; status is `twii_vendor_internal_evidence_outcome_ledger_ready_pending_evidence`, outcome is `pending_evidence_no_source_rights_acceptance`, and `record:twii-vendor-internal-evidence-outcome` can later classify vendor terms, internal feed owner, field contract, and asset mapping evidence without authorizing execution or promotion.
- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE_BRIDGE.md` is `accepted` as PM TWII source-rights outcome bridge; status is `twii_source_rights_outcome_gate_bridge_ready_evidence_pending`, current outcome is `blocked_waiting_twii_vendor_internal_evidence`, and `report:twii-source-rights-outcome-gate-bridge` now converts the four ledger outcomes into a single PM stop/go signal before any separate TWII source-rights outcome gate can open.
- `docs/A1_SOURCE_RIGHTS_NEXT_ACTION_REPORT.md` is `accepted` as PM/A1 source-rights next-action router; status is `a1_source_rights_next_action_report_ready_source_rights_pending`, current outcome is `blocked_waiting_source_rights_evidence`, and `report:a1-source-rights-next-action` now consolidates TWII `4/4` pending evidence and ETF blocked source-rights state into one PM route without reopening broad governance.
- `docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_INTAKE_COMMAND_MAP.md` is `accepted` as the PM/A1 exact evidence-intake command map; status is `a1_exact_source_rights_evidence_intake_command_map_ready_local_only_not_filled`, PM route is `a1_exact_twii_etf_source_rights_evidence_intake_then_separate_outcome_gate`, and `report:a1-exact-source-rights-evidence-intake-command-map` now names exact TWII/ETF evidence slots before any separate source-rights outcome gate can open.
- `docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_OUTCOME_LEDGER.md` is `accepted` as the PM/A1 recordable exact evidence outcome ledger; status is `a1_exact_source_rights_evidence_outcome_ledger_ready_pending_evidence`, data file is `data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json`, and `record:a1-exact-source-rights-evidence-outcome` can dry-run/apply no-secret classifications for the four TWII slots and six ETF slots without opening execution.
- `report:a1-source-rights-next-action` now reads the exact outcome ledger directly; current exact ledger status is `awaiting_a1_exact_source_rights_evidence`, TWII pending slots are `4/4`, ETF pending slots are `6/6`, and the PM router can later route to the separate TWII or ETF source-rights outcome gate after all required exact slots for that lane are accepted.
- The formal launch deployment readiness gate is `formal_launch_deployment_readiness_gate_ready_not_deployed`.
- The public Beta readiness gate is `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`.
- The Beta launch preflight packet is `beta_launch_preflight_packet_ready_not_deployed`.
- The Beta release runbook draft is `beta_release_runbook_draft_ready_before_any_deploy`.
- The future deployment execution gate is `future_deployment_execution_gate_ready_not_executed`.
- The Beta deployment operator input packet is `beta_deployment_operator_input_packet_ready_not_filled`.
- The Beta deployment execution packet draft is `beta_deployment_execution_packet_draft_not_executable`.
- The Beta deployment operator fill guide is `beta_deployment_operator_fill_guide_ready_not_filled`.
- The Beta deployment intake checklist is `beta_deployment_intake_checklist_ready_not_filled`.
- The Beta deployment executable packet candidate gate is `beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending`.
- The Beta deployment operator values minimal sheet is `beta_deployment_operator_values_minimal_sheet_ready_not_filled`.
- The Beta deployment operator values completion gate is `beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending`.
- The Beta deployment no-secret operator values record is `beta_deployment_no_secret_operator_values_record_ready_not_filled`.
- The Beta deployment operator values safe fill recheck is `beta_deployment_operator_values_safe_fill_recheck_ready_external_values_pending`.
- The local launch preflight without external operator values is `local_launch_preflight_without_external_operator_values_ready_external_values_pending`.
- The local launch proof bundle snapshot is `local_launch_proof_bundle_snapshot_ready_external_values_pending`.
- The local launch proof bundle snapshot now includes `report:beta-launch-next-action` and `report:a1-source-rights-next-action`, so PM can reuse one local snapshot while seeing both the blocked Beta platform-values route and the latest A1 TWII/ETF source-rights evidence route.
- The Beta deployment operator values gap list is `beta_deployment_operator_values_gap_list_ready_external_values_pending`.
- The Beta deployment operator values defaults and remaining gaps packet is `beta_deployment_operator_values_defaults_and_remaining_gaps_ready_not_executable`; current outcome is `safe_operator_defaults_recorded_platform_values_pending`; next route is `executable_packet_candidate_after_platform_project_and_beta_url`.
- The local launch proof refresh before executable packet is `local_launch_proof_refresh_before_executable_packet_ready_external_platform_values_pending`; current outcome is `local_proof_refresh_ready_platform_project_and_beta_url_pending`; next route is `fill_platform_project_and_beta_url_or_refresh_heavy_packet_proof`.
- The beta deployment platform values bridge is `beta_deployment_platform_values_bridge_ready_operator_platform_values_pending`; current outcome is `packet_bridge_ready_platform_project_and_beta_url_pending`; next route is `create_executable_packet_candidate_after_platform_values`.
- The pre-launch executable state gap convergence is `pre_launch_executable_state_gap_convergence_ready_external_values_and_source_rights_pending`; current outcome is `pre_launch_gap_map_ready_execution_still_blocked`; next route is `executable_packet_candidate_after_platform_values` if platform values arrive, otherwise `continue_local_runtime_launch_proof_without_external_changes` while A1 continues source-rights evidence.
- The local runtime launch proof continuation is `local_runtime_launch_proof_continuation_ready_no_external_changes`; current outcome is `local_runtime_launch_proof_ready_external_values_still_pending`; next route is `continue_local_runtime_launch_proof_without_external_changes` until platform values or source-rights evidence change.
- The local runtime launch proof trigger matrix is `local_runtime_launch_proof_trigger_matrix_ready`; current outcome is `trigger_matrix_ready_for_pm_default_routing`; next route is `continue_local_runtime_launch_proof_without_external_changes` by default unless platform values, source-rights evidence, runtime failure, or TypeScript/build risk changes the route.
- The runtime local route health refresh is `runtime_local_route_health_refresh_ready_mock_boundary_preserved`; current outcome is `local_route_health_refresh_ready_for_next_preflight_proof`; next route is `data_gate_readiness_after_local_route_health_refresh`, `executable_packet_candidate_after_platform_values`, or `runtime_repair_before_next_gate`.
- The data gate readiness after local route health refresh is `data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked`; current outcome is `twii_first_data_gate_ready_execution_blocked_external_rights_pending`; next route is `twii_source_rights_and_field_contract_acceptance_or_blocked_record`.
- The TWII source-rights field-contract acceptance-or-blocked record is `twii_source_rights_field_contract_acceptance_or_blocked_record_blocked_external_evidence_pending`; current outcome is `blocked_external_rights_field_contract_and_asset_mapping_pending`; next route is `twii_vendor_or_internal_feed_fallback_selection_or_etf_source_rights_fallback_decision_support`.
- The TWII vendor/internal or ETF fallback selection is `twii_vendor_internal_or_etf_fallback_selection_ready_no_execution`; current outcome is `fallback_selection_ready_data_execution_still_blocked`; next A1 route is `twii_vendor_terms_or_internal_feed_owner_evidence_packet`; next PM route is `executable_packet_candidate_after_platform_project_and_beta_url`.
- The A1 TWII vendor terms or internal feed owner evidence packet is `a1_twii_vendor_terms_or_internal_feed_owner_evidence_packet_ready_not_filled`; current outcome is `fillable_vendor_internal_evidence_ready_not_filled`; next route is `continue_executable_packet_candidate_after_platform_project_and_beta_url` or `launch_runtime_mainline_until_external_source_rights_change`.
- The runtime/data promotion handoff checklist is `runtime_data_promotion_handoff_checklist_ready_mock_boundary_preserved`.
- The runtime summary alignment from first closed loop is `runtime_summary_alignment_from_first_closed_loop_applied_mock_boundary_preserved`.
- The A1 source-rights unblock priority packet is `a1_source_rights_unblock_priority_packet_ready_local_only_not_executable`.
- The A1 TWII source-rights decision record candidate is `a1_twii_source_rights_unblock_decision_record_candidate_ready_local_only_not_approved`; current outcome is `decision_record_candidate_ready_rights_still_blocked`; next route is `twii_source_rights_evidence_intake_or_vendor_fallback_decision_support`.
- The A1 TWII source-rights evidence intake and fallback decision support is `a1_twii_source_rights_evidence_intake_or_vendor_fallback_decision_support_ready_local_only_not_executable`; current outcome is `official_lane_intake_ready_fallback_route_prepared_rights_still_blocked`; next route is `twii_official_source_intake_fields_or_vendor_terms_review_packet`.
- The A1 TWII official-source intake fields and vendor terms review packet is `a1_twii_official_source_intake_fields_or_vendor_terms_review_packet_ready_not_filled`; current outcome is `fillable_intake_ready_rights_evidence_not_filled`; next route is `twii_filled_source_rights_intake_review_or_blocked_fallback_selection`.
- Current public Beta outcome is `ready_for_local_public_beta_preflight_not_production_deployed`.
- The TWII source-rights outcome gate is `twii_source_rights_outcome_gate_blocked_external_rights_pending`.
- Current TWII outcome is `rejected_for_execution_pending_external_rights_and_field_contract`.
- TWII remains `not_approved_for_probe_or_ingestion`.
- PM selected this route because ETF source rights are blocked and launch deployment preconditions can progress without source promotion.
- PM selected the Beta route because TW equity has a verified first `daily_prices` closed loop, public surfaces can continue as mock-visible Beta, and real promotion can remain blocked until coverage and source-rights gates pass.
- PM selected the next route `beta_release_runbook_draft_before_any_deploy` so deployment ordering, secret input, post-deploy health, rollback, legal/source-rights, and mock/real boundaries are explicit before any production action.
- PM accepts CEO decision `draft_beta_release_runbook_before_any_deploy`; the next deployment-facing action must be a separate future deployment execution gate after deployment target decision, not an automatic deploy.
- PM accepts CEO decision `prepare_future_deployment_execution_gate_not_deploying_now`; first public Beta target posture is `vercel_or_equivalent_managed_nextjs_host`, while deployment, DNS/SSL, platform env mutation, secret upload, public source promotion, and real score promotion remain separate future actions.
- PM accepts CEO decision `prepare_beta_deployment_operator_inputs_not_deploying_now`; operator placeholders such as `TBD_PROVIDER_NAME` and `TBD_TEMPORARY_BETA_URL` must be safely filled before a separate execution packet can be created.
- PM accepts CEO decision `draft_beta_deployment_execution_packet_before_operator_inputs_are_filled`; next route is `fill_operator_inputs_then_create_separate_executable_deployment_packet`, not deployment.
- PM accepts CEO decision `prepare_operator_fill_steps_before_executable_deployment_packet`; next route is `fill_operator_inputs_safely_then_create_executable_packet`, with any unsafe missing value stopped as `blocked_external_operator_input_pending`.
- PM accepts CEO decision `prepare_beta_deployment_intake_checklist_before_operator_values`; next route is `operator_intake_values_pending_then_executable_packet_candidate`, with each future operator value classified as accepted, rejected, needs_bounded_repair, or blocked.
- PM accepts CEO decision `prepare_executable_packet_candidate_gate_without_operator_values`; current outcome is `blocked_operator_values_pending`; next route is `fill_operator_values_then_create_executable_packet_candidate`, not deployment.
- PM accepts CEO decision `prepare_minimal_operator_values_sheet_before_executable_packet`; current route is `minimal_operator_values_pending_then_executable_packet_candidate`; next route is `operator_values_sheet_fill_then_executable_packet_candidate`, not deployment.
- PM accepts CEO decision `classify_operator_values_completion_before_executable_packet`; current outcome is `blocked_external_operator_values_pending`; next route is `operator_values_record_fill_or_executable_packet_candidate_recheck`, not deployment.
- PM accepts CEO decision `prepare_no_secret_operator_values_record_before_executable_packet_recheck`; current outcome is `not_filled_external_operator_values_pending`; next route is `operator_values_safe_fill_or_executable_packet_candidate_recheck`, not deployment.
- PM accepts CEO decision `recheck_operator_values_safe_fill_before_executable_packet_candidate`; current outcome is `external_operator_values_still_pending_executable_packet_blocked`; next route is `external_operator_values_or_continue_local_launch_preflight`, not deployment.
- PM accepts CEO decision `continue_local_launch_preflight_while_external_operator_values_pending`; current outcome is `local_preflight_ready_external_operator_values_pending`; next route is `external_operator_values_or_executable_packet_candidate_after_local_preflight`, not deployment.
- PM accepts CEO decision `capture_local_launch_proof_bundle_before_executable_packet`; current outcome is `local_proof_bundle_ready_external_operator_values_pending`; next route is `operator_values_or_executable_packet_candidate_after_local_proof_bundle_snapshot`, not deployment.
- PM accepts CEO decision `compress_operator_values_gap_before_executable_packet_candidate`; current outcome is `external_operator_values_gap_identified_packet_blocked`; next route is `fill_safe_operator_values_or_continue_local_launch_runtime_data_work`, not deployment.
- PM accepts CEO decision `align_runtime_promotion_gate_with_data_coverage_route_without_real_promotion`; current outcome is `runtime_data_handoff_ready_runtime_summary_alignment_pending`; next route is `runtime_summary_alignment_from_first_closed_loop_evidence_or_coverage_gate`, not real promotion.
- PM accepts CEO decision `align_runtime_summary_to_accepted_first_closed_loop_without_real_promotion`; current outcome is `runtime_summary_aligned_real_promotion_blocked`; next route is `coverage_gate_or_operator_values_after_runtime_summary_alignment`, not real promotion.
- PM accepts CEO decision `prioritize_twii_source_rights_unblock_before_etf_while_preserving_etf_parallel_option`; current outcome is `source_rights_priority_ready_execution_blocked`; next route is `twii_source_rights_unblock_decision_record_candidate`, not execution.
- PM accepts CEO decision `refresh_runtime_local_route_health_before_executable_packet_or_data_gate`; current outcome is `local_route_health_refresh_ready_for_next_preflight_proof`; next route is `data_gate_readiness_after_local_route_health_refresh`, `executable_packet_candidate_after_platform_values`, or `runtime_repair_before_next_gate`, not deployment or real promotion.
- PM accepts CEO decision `move_from_runtime_local_route_health_refresh_to_data_gate_readiness`; current outcome is `twii_first_data_gate_ready_execution_blocked_external_rights_pending`; next route is `twii_source_rights_and_field_contract_acceptance_or_blocked_record`, not TWII probe execution, ETF fetch, Supabase write, `daily_prices` mutation, or real promotion.
- PM accepts CEO decision `record_twii_source_rights_field_contract_block_and_route_parallel_work`; current outcome is `blocked_external_rights_field_contract_and_asset_mapping_pending`; next route is `twii_vendor_or_internal_feed_fallback_selection_or_etf_source_rights_fallback_decision_support`, not TWII candidate generation, TWII probe execution, Supabase connection/write, `daily_prices` mutation, or real promotion.
- PM accepts CEO decision `split_data_blocker_into_vendor_internal_fallback_and_launch_runtime_mainline`; current outcome is `fallback_selection_ready_data_execution_still_blocked`; next A1 route is `twii_vendor_terms_or_internal_feed_owner_evidence_packet`, while PM mainline may continue `executable_packet_candidate_after_platform_project_and_beta_url` without source promotion.
- PM accepts CEO decision `prepare_twii_vendor_internal_feed_evidence_packet_after_official_lane_block`; current outcome is `fillable_vendor_internal_evidence_ready_not_filled`; PM should continue launch/runtime mainline until external source-rights evidence changes.
- PM accepts CEO decision `refresh_local_launch_proof_before_waiting_on_platform_values`; current outcome is `local_proof_refresh_ready_platform_project_and_beta_url_pending`; next route is `fill_platform_project_and_beta_url_or_refresh_heavy_packet_proof`, not deployment.
- PM accepts CEO decision `converge_pre_launch_gaps_without_expanding_governance`; current outcome is `pre_launch_gap_map_ready_execution_still_blocked`; next route is `executable_packet_candidate_after_platform_values`, `twii_source_rights_and_field_contract_acceptance_or_blocked_record`, `runtime_repair_before_next_gate`, or `continue_local_runtime_launch_proof_without_external_changes`, not deployment or real promotion.
- PM accepts CEO decision `continue_local_runtime_launch_proof_without_external_changes`; current outcome is `local_runtime_launch_proof_ready_external_values_still_pending`; PM should run focused local proof only and reserve heavy packet-window proof for platform values, runtime code change, TypeScript/build risk, core route health regression, or deployment packet preparation.
- PM accepts CEO decision `use_trigger_matrix_to_prevent_overvalidation`; current outcome is `trigger_matrix_ready_for_pm_default_routing`; PM should default to focused local proof and only escalate validation when the matrix trigger changes.
- The gate covers environment variables, platform posture, local and future production health checks, monitoring, rollback, DNS/SSL, secret handling, and launch checklist.
- It does not deploy production, run SQL, connect to Supabase, write Supabase, create staging rows, modify `daily_prices`, fetch market data, award row coverage points, promote `publicDataSource=supabase`, or set `scoreSource=real`.

## A1 Active Assignment

A1 owns the data coverage and evidence support lane.

Latest PM completion review:

- `docs/A1_NEXT_DATA_COVERAGE_HANDOFF.md` is `accepted` for PM mainline review.
- `docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md` is `accepted` for PM mainline review.
- `docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md` is `accepted` for PM mainline review.
- `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md` is `accepted` for PM mainline review.
- `docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md` is `accepted` for PM mainline review.
- `docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md` is `accepted` for PM mainline review.
- `docs/A1_TWII_ETF_SOURCE_RIGHTS_EVIDENCE_INTAKE_PACKET.md` is `accepted` as A1 shared source-rights evidence intake for the remaining TWII and ETF coverage lanes.
- The handoff stayed bounded and local-only.
- The checker `cmd.exe /c npm run check:a1-next-data-coverage-handoff` passed.
- The checker `cmd.exe /c npm run check:etf-source-rights-and-candidate-readiness-packet` passed.
- The checker `cmd.exe /c npm run check:a1-etf-source-rights-outcome-decision-support` passed.
- The checker `cmd.exe /c npm run check:a1-twii-source-rights-and-candidate-readiness-packet` passed.
- The checker `cmd.exe /c npm run check:a1-twii-index-field-contract-decision-support` passed.
- The checker `cmd.exe /c npm run check:a1-mvp-coverage-closure-route-support` passed.
- PM accepts ETF as the current data-coverage route because `docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md` selects ETF as the next completion route while source rights remain blocked.
- `docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md` is `blocked` as a PM mainline execution gate because no ETF source lane is accepted for storage, redistribution, derived analysis, candidate generation, or write execution.
- PM acceptance means the handoff and ETF readiness packet can guide a later source-rights or execution decision; it does not authorize ETF candidate generation, remote fetch, Supabase connection, Supabase write, `daily_prices` mutation, row coverage points, public source promotion, or real score promotion.

Active assignment:

- ETF source-rights outcome decision is open and currently blocked at `rejected_for_execution_pending_external_rights`.
- TWII source-rights and candidate readiness is accepted as the next alternative data branch while ETF remains blocked.
- PM accepts A1's TWII field-contract decision support as local-only planning evidence.
- PM accepts A1's MVP coverage closure route support as the current coverage-route map from `182/360` to `360/360`.
- PM assigns A1 next to `source_rights_evidence_intake_for_twii_and_etf` as a local-only unblocker for TWII `0/60` and ETF `2/120`.
- Legacy deployment packets still refer to this A1 assignment as `source_rights_evidence_intake_for_tWII_and_etf`; PM treats it as the same local-only intake route.
- PM accepts the shared intake packet as the current A1 evidence intake surface; next route is `twii_or_etf_candidate_artifact_gate_after_pm_acceptance`, otherwise `continue_public_beta_runtime_mainline_mock_visible`.
- PM should reassign A1 next to a TWII sanitized candidate artifact readiness gate only after source rights and field contract are accepted.
- If TWII and ETF source rights remain unresolved, PM should reassign A1 to source-rights evidence intake, vendor/internal-feed decision support, or a blocked-route alternative map.
- PM should reassign A1 to a blocked-route alternative map or TWII readiness branch when ETF source-rights evidence remains unresolved.
- PM accepts the A1 source-rights next-action router as the current combined TWII/ETF evidence route. A1 should collect or classify exact TWII vendor/internal/field/asset evidence and ETF legal/redistribution evidence while PM keeps Beta mainline work moving.
- PM accepts the A1 exact evidence-intake command map as the next A1 assignment layer; A1 must return one no-secret classification per required TWII/ETF slot before PM can open a separate TWII or ETF source-rights outcome gate.
- PM accepts the A1 exact evidence outcome ledger as the recording layer for those classifications; dry-run is safe, but any applied `accepted` outcome still only permits a later separately named source-rights outcome gate.
- Any next data action must stop before remote fetch, candidate generation from source data, SQL, Supabase connection, Supabase write, staging row creation, `daily_prices` mutation, row coverage points, public source promotion, or real score promotion.

Completed first assignment:

- Produce `docs/A1_NEXT_DATA_COVERAGE_HANDOFF.md`.
- The handoff should identify the current `360/360` gap, source-specific lanes, allowed local-only next actions, and remote/write gates that require PM/CEO approval.
- The handoff must not execute SQL, connect to Supabase, write Supabase, create staging rows, modify `daily_prices`, fetch raw market data, output row payloads, output stock id payloads, output secrets, promote public data source, or set real score source.

Completed second assignment:

- Produce `docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`.
- Define source-rights outcome intake, ETF `daily_prices` field contract, sanitized candidate artifact shape, and execution-readiness criteria for `0050` and `006208`.
- Stop before any remote fetch, candidate generation from source data, SQL, Supabase connection, Supabase write, staging row creation, `daily_prices` mutation, row coverage points, public source promotion, or real score promotion.

Completed third assignment:

- Produce `docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md`.
- Confirm no ETF source lane is accepted by current local evidence.
- Recommend keeping `legal_and_redistribution_terms_unapproved` until external source-rights evidence is accepted.
- Identify the next safe data-lane options as a blocked-route alternative map or TWII readiness branch.
- Preserve `publicDataSource=mock` and `scoreSource=mock`.

Completed fourth assignment:

- Produce `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`.
- Record TWII as `0/60` and Level 1 MVP coverage as `182/360`.
- Preserve ETF blocker `legal_and_redistribution_terms_unapproved`.
- Define TWII source-rights intake, index `daily_prices` field contract, sanitized candidate artifact shape, and future execution-readiness criteria.
- Keep TWII `not_approved_for_probe_or_ingestion` until a separate PM/CEO gate accepts source rights and field contract.

Completed fifth assignment:

- Produce `docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md`.
- Keep the output local-only and not executable.
- Define TWII daily index field-contract questions for `trade_date`, `index_close`, optional OHLC/turnover fields, calendar/session rules, timezone, precision, missing-session vs source-gap classification, and safe asset-id mapping.
- Preserve TWII `0/60`, `publicDataSource=mock`, `scoreSource=mock`, no source-rights approval, no parser approval, no probe approval, no candidate generation, no Supabase write, and no row coverage points.

Completed sixth assignment:

- Produce `docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md`.
- Map the shortest local-only coverage closure route from current Level 1 MVP coverage `182/360` to target `360/360`.
- Keep TW equity accepted at `180/180`, TWII blocked at `0/60`, ETF blocked at `2/120`, and full coverage blocked until source-rights, field-contract, candidate artifact, bounded execution, post-run review, readback, and scoring gates pass.
- Preserve `publicDataSource=mock`, `scoreSource=mock`, no SQL, no Supabase connection, no write, no staging rows, no `daily_prices` mutation, no market-data fetch, no row payload, no stock id payload, no row coverage points, and no real promotion.

PM intake criteria for A1:

- Current evidence is sanitized and aggregate-only.
- Missing rows are grouped by lane.
- The next data action is bounded and names the stop line.
- Any remote/read/write action is marked as a future gate, not as executed work.
- The checker passes before PM accepts the handoff.

Next A1 task when PM reopens the data lane:

- If ETF source-rights can be decided locally, prepare an ETF source-rights outcome decision packet.
- If TWII source-rights can be decided locally, prepare a TWII source-rights outcome decision packet.
- If both source-rights lanes remain blocked, prepare a source-rights evidence intake checklist that names the exact external evidence needed for TWII and ETF.
- If TWII source-rights and field contract are accepted later, prepare a TWII sanitized candidate artifact readiness gate.
- If both execution lanes are blocked, update the Taiwan all-listed universe manifest as Level 2 planning evidence only.

## A2 Active Assignment

A2 owns the public trust, UX readability, and launch copy support lane.

Latest PM completion review:

- `docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md` is `accepted` for PM mainline review.
- `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md` is `accepted` for PM mainline review.
- `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md` is `accepted` for PM mainline review.
- A2 copy-only launch-blocking wording pass is `accepted` for PM mainline review.
- `docs/A2 briefing copy-only patch` is `accepted` for PM mainline review.
- `docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md` is `accepted` for PM mainline review.
- `docs/A2_BETA_PHRASE_SET_AND_SHARED_TRUST_SURFACE_PATCH_SCOPE.md` is `accepted` for PM mainline review.
- `A2 bounded shared trust-surface copy patch` is `accepted` for PM mainline review.
- `docs/A2_ROUTE_LOCAL_LEGAL_WEEKLY_METHODOLOGY_COPY_REGRESSION_GATE.md` is `accepted` for PM mainline review.
- `docs/A2_BOUNDED_ROUTE_LOCAL_TRUST_COPY_PATCH.md` is `accepted` for PM mainline review.
- `docs/A2_ROUTE_LOCAL_TRUST_COPY_ROUTE_HEALTH.md` is `accepted` for PM mainline review.
- `src/lib/briefing-market-action-summary.ts` briefing market-action copy repair is `accepted` as a launch-blocking trust-copy repair, not visual polish.
- A2 first-screen public-copy repair is `accepted` as a launch-blocking trust-copy repair: `/briefing` and the site footer no longer expose machine tokens such as `publicDataSource=mock` or `scoreSource=mock` in first-screen/public chrome copy, while the underlying report safety state remains mock/mock.
- The handoff stayed bounded and local-only.
- The checker `cmd.exe /c npm run check:a2-public-trust-launch-copy-handoff` passed.
- The checker `cmd.exe /c npm run check:a2-route-level-launch-copy-placement-criteria` passed.
- The checker `cmd.exe /c npm run check:a2-route-level-launch-copy-audit` passed.
- The copy pass checkers passed: `check:runtime-mock-disclosure-readability`, `check:trust-runtime-boundary-notice`, `check:home-runtime-status-panel`, `check:stock-runtime-at-a-glance`, `check:public-runtime-boundary-coverage`, and `check:public-visible-language-quality`.
- The briefing copy patch checker `cmd.exe /c npm run check:a2-briefing-copy-patch` passed.
- The checker `cmd.exe /c npm run check:a2-public-beta-trust-copy-readiness` passed.
- The checker `cmd.exe /c npm run check:a2-beta-phrase-set-and-shared-trust-surface-patch-scope` passed.
- The checker `cmd.exe /c npm run check:a2-route-local-legal-weekly-methodology-copy-regression-gate` passed.
- The checker `cmd.exe /c npm run check:a2-bounded-route-local-trust-copy-patch` passed.
- The checker `cmd.exe /c npm run check:a2-route-local-trust-copy-route-health` passed.
- The shared trust-surface copy patch focused checks passed: `check:runtime-mock-disclosure-readability`, `check:trust-runtime-boundary-notice`, `check:site-chrome-readability`, `check:public-runtime-boundary-coverage`, and `check:public-visible-language-quality`.
- The A2 first-screen public-copy checker `cmd.exe /c npm run check:a2-public-copy-readability-candidates` passed with `urgentFirstScreenCandidates: 0`.
- PM acceptance means the handoff can guide launch-copy integration; it does not authorize runtime promotion, real-source wording, or visual polish.

Active assignment:

- Route-level launch copy placement criteria are accepted as a local-only criteria packet.
- Route-level launch copy audit is accepted as a local-only audit packet.
- PM should reassign A2 next to a bounded `/briefing` copy-only patch or a launch-visible language regression checker when mainline needs public trust support.
- PM accepts the bounded `/briefing` copy-only patch and should reassign A2 next to `/weekly` or footer/legal launch-copy risk after PM finishes this integration.
- PM accepts A2's public Beta trust-copy readiness support and should prioritize shared trust surfaces, footer/legal, home/stocks, briefing, weekly, and empty/error state copy before visual polish.
- PM assigns A2 next to `beta_phrase_set_and_shared_trust_surface_patch_scope` to keep public Beta language ready without delaying data and runtime foundations.
- PM accepts A2's Beta phrase set and shared trust surface patch scope as `a2_beta_phrase_set_and_shared_trust_surface_patch_scope_ready`; CEO decision is `approve_a2_beta_phrase_set_before_shared_trust_surface_patch`, and next route is `bounded_shared_trust_surface_copy_patch_then_route_health`.
- PM accepts the bounded shared trust-surface copy patch as `a2_shared_trust_surface_copy_patch_applied_mock_boundary_preserved`; CEO decision is `apply_shared_trust_surface_copy_patch_before_route_local_legal_copy`; next route is `route_local_legal_weekly_methodology_copy_patch_or_beta_deployment_intake_values`.
- PM accepts the route-local legal/weekly/methodology copy regression gate as `a2_route_local_legal_weekly_methodology_copy_regression_gate_ready`; CEO decision is `promote_route_local_trust_copy_regression_before_visual_polish`; next route is `bounded_weekly_methodology_legal_copy_patch_or_data_coverage_source_rights_unblock`.
- PM accepts the bounded route-local trust copy patch as `a2_bounded_route_local_trust_copy_patch_applied_mock_boundary_preserved`; CEO decision is `apply_route_local_trust_copy_patch_before_visual_polish`; next route is `route_health_for_weekly_methodology_legal_pages_or_data_coverage_source_rights_unblock`.
- PM accepts route-local trust copy route health as `a2_route_local_trust_copy_route_health_ready`; CEO decision is `verify_route_local_trust_copy_health_before_returning_to_data_coverage`; next route is `data_coverage_source_rights_unblock_after_route_health_green`.
- PM accepts the briefing market-action summary helper repair; `check:public-visible-language-quality` now guards this helper against mojibake regression while preserving `publicDataSource=mock`, `scoreSource=mock`, and non-investment-advice wording.
- PM accepts the first-screen public-copy repair; `check:a2-public-copy-readability-candidates` now treats reader-facing boundary phrases such as `示範資料`, `示範分數`, and `尚未切換為正式市場資料` as acceptable public Beta disclosures while preserving the report safety values `publicDataSource=mock` and `scoreSource=mock`.
- Any next A2 task must preserve `publicDataSource=mock`, `scoreSource=mock`, non-investment-advice wording, data freshness limitations, missing/delayed data wording, partial coverage wording, and score/model limitations.

Completed first assignment:

- Produce `docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md`.
- The handoff should identify launch-blocking public copy, mock/real wording rules, coverage and freshness disclosure gaps, non-investment-advice wording, and UI polish that should wait until later.
- The handoff must not edit data evidence, Supabase logic, source promotion toggles, score-source promotion, or raw market artifacts.

Completed second assignment:

- Run a copy-only launch-blocking wording pass on the highest-trust public surfaces.
- Update public boundary copy and trust/runtime notice wording for public trust readability, mock-only state, data freshness, partial coverage, missing/delayed data, non-investment-advice, and score/model limitations.
- Keep exact stop lines `publicDataSource=mock` and `scoreSource=mock`.
- Update public language and boundary checkers so they validate readable launch copy instead of stale wording tokens.

Completed third assignment:

- Produce `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md`.
- Define required launch trust copy by route or surface: home, stock detail, briefing, weekly, shared runtime boundary, footer/legal, and empty/error states.
- Split launch-blocking copy from non-blocking visual polish.
- Preserve mock-only, non-investment-advice, partial coverage, freshness limitation, missing/delayed data, and score/model limitation wording.

Completed fourth assignment:

- Produce `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md`.
- Classify public routes and surfaces as `satisfies_now`, `needs_small_copy_patch`, `wait_for_phrase_set`, or `lower_priority_visual_polish`.
- Identify `/briefing`, `/weekly`, legal route-local copy, footer/legal copy, and empty/error/unavailable copy as the next copy-risk areas.
- Keep home, stock detail, and shared runtime boundary as current `satisfies_now` baselines.

Completed fifth assignment:

- Apply a bounded `/briefing` copy-only patch.
- Make briefing copy more readable about mock-only state, `publicDataSource=mock`, `scoreSource=mock`, partial coverage, missing/delayed data, data freshness, model limitation, and non-investment-advice.
- Keep the patch out of Supabase, data evidence, source promotion toggles, score-source promotion, raw market artifacts, and visual-polish-only scope.

Completed sixth assignment:

- Produce `docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md`.
- Classify public Beta trust-copy readiness across home, stocks, briefing, weekly, disclaimer, footer/legal shared chrome, shared runtime boundary surfaces, data freshness strip, empty/error/unavailable states, and visual polish.
- Mark shared trust/copy risks as Beta blockers when visible text hides mock-only, partial coverage, missing/delayed data, data freshness, model limitation, or non-investment-advice.
- Keep visual polish after launch-blocking copy readability and preserve `publicDataSource=mock`, `scoreSource=mock`, no real-source wording, no complete-coverage claim, no investment advice, and no runtime toggle changes.

Completed seventh assignment:

- Produce `docs/A2_BETA_PHRASE_SET_AND_SHARED_TRUST_SURFACE_PATCH_SCOPE.md`.
- Approve the first Beta phrase set for `mock-only`, `publicDataSource=mock`, `scoreSource=mock`, data freshness metadata, partial coverage, missing/delayed data, model limitation, non-investment advice, and risk disclosure.
- Prioritize shared trust surfaces before broad visual polish: `src/lib/public-runtime-boundary-copy.ts`, `src/components/trust-runtime-boundary-notice.tsx`, `src/components/public-runtime-state-strip.tsx`, `src/components/data-freshness-strip.tsx`, and `src/app/layout.tsx`.
- Set the next route to `bounded_shared_trust_surface_copy_patch_then_route_health` while preserving no SQL, no Supabase connection/write, no `daily_prices` mutation, no raw market data, no deployment, no public source promotion, and no real score promotion.

Completed eighth assignment:

- Apply a bounded shared trust-surface copy patch.
- Make `src/lib/public-runtime-boundary-copy.ts`, `src/components/trust-runtime-boundary-notice.tsx`, `src/components/data-freshness-strip.tsx`, `src/app/layout.tsx`, and `src/components/site-nav.tsx` readable for public Beta.
- Preserve `mock-only`, `publicDataSource=mock`, `scoreSource=mock`, data freshness metadata, partial coverage, missing/delayed data, model limitation, non-investment advice, and risk disclosure.
- Update focused language checkers to validate the new phrase set and site chrome labels instead of stale mojibake tokens.
- Keep the patch out of SQL, Supabase connection/write, staging rows, `daily_prices` mutation, raw market data, deployment, DNS/SSL mutation, platform env mutation, row coverage points, public source promotion, and real score promotion.

Completed ninth assignment:

- Produce `docs/A2_ROUTE_LOCAL_LEGAL_WEEKLY_METHODOLOGY_COPY_REGRESSION_GATE.md`.
- Add `scripts/check-a2-route-local-legal-weekly-methodology-copy-regression-gate.mjs` and register it in review gates.
- Guard `/weekly`, `/methodology`, `/disclaimer`, `/terms`, `/privacy`, footer/legal shared chrome, and shared trust notice from drifting into real-data, complete-coverage, real-score, provider-rights, raw-payload, secret-output, or investment-advice claims.
- Keep the route-local regression work out of SQL, Supabase connection/write, staging rows, `daily_prices` mutation, raw market data, deployment, DNS/SSL mutation, platform env mutation, row coverage points, public source promotion, real score promotion, and visual-polish-only scope.

Completed tenth assignment:

- Add `src/components/route-local-trust-copy-panel.tsx`.
- Wire `RouteLocalTrustCopyPanel` into `/weekly`, `/methodology`, `/disclaimer`, `/terms`, and `/privacy`.
- Add bounded responsive styles for `.route-local-trust-copy` and `.route-local-trust-copy-grid`.
- Add `docs/A2_BOUNDED_ROUTE_LOCAL_TRUST_COPY_PATCH.md` and `scripts/check-a2-bounded-route-local-trust-copy-patch.mjs`.
- Preserve `publicDataSource=mock`, `scoreSource=mock`, mock-only Beta state, data freshness metadata, partial coverage, missing/delayed data, model limitation, non-investment advice, risk disclosure, source-rights gates, and no raw-payload/secret-output boundaries.
- Keep the copy patch out of SQL, Supabase connection/write, staging rows, `daily_prices` mutation, raw market data, deployment, DNS/SSL mutation, platform env mutation, row coverage points, public source promotion, real score promotion, and visual-polish-only scope.

Completed eleventh assignment:

- Produce `docs/A2_ROUTE_LOCAL_TRUST_COPY_ROUTE_HEALTH.md`.
- Add `scripts/check-a2-route-local-trust-copy-route-health.mjs` and register it in review gates.
- Validate `/weekly`, `/methodology`, `/disclaimer`, `/terms`, and `/privacy` for HTTP `200`, route-local trust-copy tokens, `publicDataSource=mock`, `scoreSource=mock`, and `mock-only`.
- Preserve the ability to validate an already running localhost server or start a temporary non-default-port local server if needed.
- Keep the route-health work out of SQL, Supabase connection/write, staging rows, `daily_prices` mutation, raw market data, deployment, DNS/SSL mutation, platform env mutation, row coverage points, public source promotion, real score promotion, and visual-polish-only scope.

Completed twelfth assignment:

- Repair launch-blocking public readability on `/briefing` first-screen and primary runtime summaries.
- Convert visible boundary copy from internal tokens to public Beta language: `示範資料`, `示範分數`, `正式資料`, `正式分數`, `後端物件可讀性`, and `不是投資建議`.
- Update action-summary, public-visible-language, localhost health, and A2 public-copy checkers so `/briefing` can use reader-facing boundary wording while checker self-contracts still guard `publicDataSource=mock` and `scoreSource=mock`.
- Add display-layer sanitization for PM progress and post-readonly runtime summaries without changing underlying gate state.
- Accept `urgentFirstScreenCandidates: 0` as the launch-blocking A2 outcome for this slice.
- Defer deep internal governance panel cleanup to the next bounded public-summary route; those panels should become public summaries or sanitized display layers before public Beta.
- Keep the copy repair out of SQL, Supabase connection/write, staging rows, `daily_prices` mutation, raw market data, deployment, DNS/SSL mutation, platform env mutation, row coverage points, public source promotion, real score promotion, and visual-polish-only scope.

Completed thirteenth assignment:

- Replace deep `/briefing` internal governance panels with `BriefingPublicBetaGateSummary`.
- Preserve public-facing progress, runtime, backend evidence, coverage gap, source-depth, blocker readiness, oral-review, and next-gate signals in a bounded summary.
- Remove public DOM exposure of raw internal guard terms from the briefing page.
- Confirm Browser DOM token scan on `/briefing` returns no hits for `publicDataSource`, `scoreSource`, `Object reachability`, `investment advice`, `claimApproval`, or `mock_runtime_hardening`.
- Update localhost health expectations from the former internal `Supabase readonly attempt` phrase to the public summary's `遠端唯讀檢查` wording.
- Keep the panel replacement out of SQL, Supabase connection/write, staging rows, `daily_prices` mutation, raw market data, deployment, DNS/SSL mutation, platform env mutation, row coverage points, public source promotion, real score promotion, and visual-polish-only scope.

Completed fourteenth assignment:

- Add `scripts/check-briefing-public-beta-gate-summary.mjs`.
- Register `check:briefing-public-beta-gate-summary` in `package.json` and `scripts/check-review-gates.mjs`.
- Verify `/briefing` renders the public Beta summary anchors after the deep internal panel replacement.
- Block visible regressions that expose raw internal runtime/governance tokens such as `publicDataSource`, `scoreSource`, `Object reachability`, `investment advice`, `claimApproval`, and `mock_runtime_hardening`.
- Verify `src/app/briefing/page.tsx` keeps `BriefingPublicBetaGateSummary` and does not re-import/render the removed internal panels.
- Keep this regression gate out of SQL, Supabase connection/write, staging rows, `daily_prices` mutation, raw market data, deployment, DNS/SSL mutation, platform env mutation, row coverage points, public source promotion, real score promotion, and visual-polish-only scope.

PM intake criteria for A2:

- Copy gaps are split into launch-blocking and non-blocking polish.
- Mock-only state stays visible until promotion gates pass.
- Real-source and real-score wording is conditional, not prematurely published.
- Non-investment-advice, risk, source freshness, coverage, missing-data, and model-limitation wording are covered.
- The checker passes before PM accepts the handoff.

Next A2 task when PM reopens the copy lane:

- Extend the public-summary replacement pattern to other public routes if Browser DOM scans show raw internal guard terms.
- Prepare a stricter route-level checker for `/briefing` public Beta summary if PM wants this pattern locked before deployment readiness.
- If copy placement is already covered and route health is stable, continue data coverage source-rights unblock as the next mainline route.
- Visual polish remains lower priority unless comprehension or legal clarity is blocked.

## PM Integration Loop

When A1 or A2 completes a task, PM must do this loop:

1. Review the changed files and checker output.
2. Classify the handoff as `accepted`, `rejected`, `needs_bounded_repair`, or `blocked`.
3. If accepted, integrate it into the PM mainline only after local checks pass.
4. If rejected or repair is needed, assign the bounded fix back to the same lane.
5. Immediately assign the next highest-value lane task when useful work remains.
6. Record the new task or accepted result in project status when it changes launch direction.

PM should not let A1 or A2 idle after a completed task unless no safe lane-specific work remains.

## Launch Gate Map

Formal launch engineering requires these gates to move from blocked to accepted:

| Gate | Current state | PM action |
| --- | --- | --- |
| MVP row coverage | `182/360`, incomplete | Drive remaining TWII/ETF lanes through source-specific gates |
| Ingestion / backfill | Partially designed, not launch-complete | Require candidate artifact, write/readback, post-run review, rollback, retention |
| Runtime promotion | Mock-only public boundary | Keep promotion gate explicit before source or score switch |
| Investment indicators | Launch-safe direction exists, full real-data implementation waits | Do not implement real decision scoring before data and promotion gates |
| Public trust / legal copy | Prepared but needs route-level launch handoff | Accept A2 copy handoff and wire only launch-blocking wording first |
| Deployment readiness | `formal_launch_deployment_readiness_gate_ready_not_deployed` | Prepare env, health, monitoring, rollback, DNS/SSL, and secret checklist before production |

## Safety Boundaries

This board does not authorize:

- SQL execution;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- raw market-data fetch, ingest, storage, or commit;
- raw payload, row payload, stock id payload, or secret output;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- production launch claims.

Any later remote/read/write step must have its own named gate, exact command, post-run review, sanitized aggregate evidence, and stop line.

## Verification

Small updates to this board should run:

- `node scripts/check-launch-engineering-workstream-board.mjs`
- `git diff --check`

Milestone integration should also run the related lane checker and review gate.
