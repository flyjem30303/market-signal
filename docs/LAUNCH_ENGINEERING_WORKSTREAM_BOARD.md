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
- The Beta deployment operator values gap list is `beta_deployment_operator_values_gap_list_ready_external_values_pending`.
- The Beta deployment operator values defaults and remaining gaps packet is `beta_deployment_operator_values_defaults_and_remaining_gaps_ready_not_executable`; current outcome is `safe_operator_defaults_recorded_platform_values_pending`; next route is `executable_packet_candidate_after_platform_project_and_beta_url`.
- The runtime local route health refresh is `runtime_local_route_health_refresh_ready_mock_boundary_preserved`; current outcome is `local_route_health_refresh_ready_for_next_preflight_proof`; next route is `data_gate_readiness_after_local_route_health_refresh`, `executable_packet_candidate_after_platform_values`, or `runtime_repair_before_next_gate`.
- The data gate readiness after local route health refresh is `data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked`; current outcome is `twii_first_data_gate_ready_execution_blocked_external_rights_pending`; next route is `twii_source_rights_and_field_contract_acceptance_or_blocked_record`.
- The TWII source-rights field-contract acceptance-or-blocked record is `twii_source_rights_field_contract_acceptance_or_blocked_record_blocked_external_evidence_pending`; current outcome is `blocked_external_rights_field_contract_and_asset_mapping_pending`; next route is `twii_vendor_or_internal_feed_fallback_selection_or_etf_source_rights_fallback_decision_support`.
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
- PM assigns A1 next to `source_rights_evidence_intake_for_tWII_and_etf` as a local-only unblocker for TWII `0/60` and ETF `2/120`.
- PM should reassign A1 next to a TWII sanitized candidate artifact readiness gate only after source rights and field contract are accepted.
- If TWII and ETF source rights remain unresolved, PM should reassign A1 to source-rights evidence intake, vendor/internal-feed decision support, or a blocked-route alternative map.
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
- The handoff stayed bounded and local-only.
- The checker `cmd.exe /c npm run check:a2-public-trust-launch-copy-handoff` passed.
- The checker `cmd.exe /c npm run check:a2-route-level-launch-copy-placement-criteria` passed.
- The checker `cmd.exe /c npm run check:a2-route-level-launch-copy-audit` passed.
- The copy pass checkers passed: `check:runtime-mock-disclosure-readability`, `check:trust-runtime-boundary-notice`, `check:home-runtime-status-panel`, `check:stock-runtime-at-a-glance`, `check:public-runtime-boundary-coverage`, and `check:public-visible-language-quality`.
- The briefing copy patch checker `cmd.exe /c npm run check:a2-briefing-copy-patch` passed.
- The checker `cmd.exe /c npm run check:a2-public-beta-trust-copy-readiness` passed.
- The checker `cmd.exe /c npm run check:a2-beta-phrase-set-and-shared-trust-surface-patch-scope` passed.
- The shared trust-surface copy patch focused checks passed: `check:runtime-mock-disclosure-readability`, `check:trust-runtime-boundary-notice`, `check:site-chrome-readability`, `check:public-runtime-boundary-coverage`, and `check:public-visible-language-quality`.
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

PM intake criteria for A2:

- Copy gaps are split into launch-blocking and non-blocking polish.
- Mock-only state stays visible until promotion gates pass.
- Real-source and real-score wording is conditional, not prematurely published.
- Non-investment-advice, risk, source freshness, coverage, missing-data, and model-limitation wording are covered.
- The checker passes before PM accepts the handoff.

Next A2 task when PM reopens the copy lane:

- Prepare a bounded shared trust-surface copy patch for `src/lib/public-runtime-boundary-copy.ts`, `src/components/trust-runtime-boundary-notice.tsx`, and footer/legal copy if PM chooses UI implementation next.
- If PM keeps A2 document-only, prepare a Beta phrase set for mock-only, data freshness metadata, partial coverage, missing/delayed data, model limitation, risk, and non-investment-advice.
- If copy placement is already covered, prepare a launch-visible language regression checker.
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
