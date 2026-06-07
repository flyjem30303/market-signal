import fs from "node:fs";

const problems = [];

const docPath = "docs/PRE_LAUNCH_EXECUTABLE_STATE_GAP_CONVERGENCE.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const publicBetaPath = "docs/PUBLIC_BETA_READINESS_GATE.md";
const routeHealthPath = "docs/RUNTIME_LOCAL_ROUTE_HEALTH_REFRESH_BEFORE_EXECUTABLE_PACKET.md";
const dataGatePath = "docs/DATA_GATE_READINESS_AFTER_LOCAL_ROUTE_HEALTH_REFRESH.md";
const runtimeHandoffPath = "docs/RUNTIME_DATA_PROMOTION_HANDOFF_CHECKLIST.md";
const runtimeSummaryPath = "docs/RUNTIME_SUMMARY_ALIGNMENT_FROM_FIRST_CLOSED_LOOP.md";
const firstClosedLoopPath = "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md";
const platformBridgePath = "docs/BETA_DEPLOYMENT_PLATFORM_VALUES_BRIDGE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);

for (const phrase of [
  "Status: `pre_launch_executable_state_gap_convergence_ready_external_values_and_source_rights_pending`",
  "converge_pre_launch_gaps_without_expanding_governance",
  "pre_launch_executable_state_gap_convergence",
  "pre_launch_gap_map_ready_execution_still_blocked",
  "Public Beta readiness is `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`",
  "Runtime local route health refresh is `runtime_local_route_health_refresh_ready_mock_boundary_preserved`",
  "Data gate readiness after route health refresh is `data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked`",
  "Runtime/data promotion handoff is `runtime_data_promotion_handoff_checklist_ready_mock_boundary_preserved`",
  "Runtime summary alignment is `runtime_summary_alignment_from_first_closed_loop_applied_mock_boundary_preserved`",
  "First TW equity closed loop is `data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked`",
  "Beta deployment platform bridge is `beta_deployment_platform_values_bridge_ready_operator_platform_values_pending`",
  "Public runtime remains `publicDataSource=mock`",
  "Score source remains `scoreSource=mock`",
  "Accepted aggregate row coverage remains `182/360`",
  "TW equity sub-scope remains accepted at `180/180`",
  "TWII remains `0/60`",
  "ETF remains `2/120`",
  "`platform_generated_value_pending`",
  "`blocked_external_rights_field_contract_and_asset_mapping_pending`",
  "`rejected_for_execution_pending_external_rights`",
  "`not_ready_for_real_data_promotion`",
  "executable_packet_candidate_after_platform_values",
  "twii_source_rights_and_field_contract_acceptance_or_blocked_record",
  "runtime_repair_before_next_gate",
  "continue_local_runtime_launch_proof_without_external_changes",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [filePath, phrase] of [
  [publicBetaPath, "public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked"],
  [routeHealthPath, "runtime_local_route_health_refresh_ready_mock_boundary_preserved"],
  [dataGatePath, "data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked"],
  [runtimeHandoffPath, "runtime_data_promotion_handoff_checklist_ready_mock_boundary_preserved"],
  [runtimeSummaryPath, "runtime_summary_alignment_from_first_closed_loop_applied_mock_boundary_preserved"],
  [firstClosedLoopPath, "data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked"],
  [platformBridgePath, "beta_deployment_platform_values_bridge_ready_operator_platform_values_pending"],
  [boardPath, "`docs/PRE_LAUNCH_EXECUTABLE_STATE_GAP_CONVERGENCE.md` is `accepted` as PM mainline pre-launch executable-state gap convergence"],
  [boardPath, "pre_launch_executable_state_gap_convergence_ready_external_values_and_source_rights_pending"],
  [statusPath, "Latest pre-launch executable state gap convergence slice"],
  [statusPath, "pre_launch_executable_state_gap_convergence_ready_external_values_and_source_rights_pending"],
  [packagePath, "\"check:pre-launch-executable-state-gap-convergence\""],
  [reviewGatePath, "scripts/check-pre-launch-executable-state-gap-convergence.mjs"],
  [reviewGatePath, "pre-launch-executable-state-gap-convergence"]
]) {
  if (!read(filePath).includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

const pkg = JSON.parse(read(packagePath));
if (
  pkg.scripts?.["check:pre-launch-executable-state-gap-convergence"] !==
  "node scripts/check-pre-launch-executable-state-gap-convergence.mjs"
) {
  problems.push(`${packagePath} missing check:pre-launch-executable-state-gap-convergence script`);
}

const forbiddenPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /vercel deploy/u,
  /npm run deploy/u,
  /RUN_DEPLOY_NOW/u,
  /DEPLOYMENT_COMPLETED/u,
  /production deployment completed/iu,
  /preview deployment completed/iu,
  /hosting project created/iu,
  /platform env mutated/iu,
  /SQL execution is approved/iu,
  /Supabase connection is approved/iu,
  /Supabase writes are approved/iu,
  /daily_prices mutation is approved/iu,
  /row coverage points awarded/iu,
  /complete MVP coverage achieved/iu,
  /publicDataSource=supabase is approved/iu,
  /scoreSource=real is approved/iu,
  /sb_secret_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "pre_launch_executable_state_gap_convergence_ready_external_values_and_source_rights_pending",
      outcome: "pre_launch_gap_map_ready_execution_still_blocked",
      nextRoute: "executable_packet_candidate_after_platform_values_or_continue_local_runtime_launch_proof",
      docPath
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}
