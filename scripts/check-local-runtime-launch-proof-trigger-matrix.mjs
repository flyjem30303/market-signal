import fs from "node:fs";

const problems = [];

const docPath = "docs/LOCAL_RUNTIME_LAUNCH_PROOF_TRIGGER_MATRIX.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const convergencePath = "docs/PRE_LAUNCH_EXECUTABLE_STATE_GAP_CONVERGENCE.md";
const continuationPath = "docs/LOCAL_RUNTIME_LAUNCH_PROOF_CONTINUATION.md";
const routeHealthPath = "docs/RUNTIME_LOCAL_ROUTE_HEALTH_REFRESH_BEFORE_EXECUTABLE_PACKET.md";
const platformBridgePath = "docs/BETA_DEPLOYMENT_PLATFORM_VALUES_BRIDGE.md";
const dataGatePath = "docs/DATA_GATE_READINESS_AFTER_LOCAL_ROUTE_HEALTH_REFRESH.md";
const publicBetaPath = "docs/PUBLIC_BETA_READINESS_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);

for (const phrase of [
  "Status: `local_runtime_launch_proof_trigger_matrix_ready`",
  "use_trigger_matrix_to_prevent_overvalidation",
  "local_runtime_launch_proof_trigger_matrix",
  "trigger_matrix_ready_for_pm_default_routing",
  "pre_launch_executable_state_gap_convergence_ready_external_values_and_source_rights_pending",
  "local_runtime_launch_proof_continuation_ready_no_external_changes",
  "runtime_local_route_health_refresh_ready_mock_boundary_preserved",
  "beta_deployment_platform_values_bridge_ready_operator_platform_values_pending",
  "data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked",
  "public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked",
  "publicDataSource=mock",
  "scoreSource=mock",
  "continue_local_runtime_launch_proof_without_external_changes",
  "executable_packet_candidate_after_platform_values",
  "twii_source_rights_and_field_contract_acceptance_or_blocked_record",
  "etf_source_rights_outcome_decision_gate",
  "runtime_repair_before_next_gate",
  "packet_window_or_build_risk_validation",
  "pause_and_report_external_blocker",
  "Focused local proof means",
  "Packet-window proof means",
  "Data/source-rights focused gate means",
  "Runtime repair proof means",
  "Do not spend mainline time on broad visual polish",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [filePath, phrase] of [
  [convergencePath, "pre_launch_executable_state_gap_convergence_ready_external_values_and_source_rights_pending"],
  [convergencePath, "continue_local_runtime_launch_proof_without_external_changes"],
  [continuationPath, "local_runtime_launch_proof_continuation_ready_no_external_changes"],
  [continuationPath, "Do not run the heavier packet-window proof unless"],
  [routeHealthPath, "runtime_local_route_health_refresh_ready_mock_boundary_preserved"],
  [platformBridgePath, "beta_deployment_platform_values_bridge_ready_operator_platform_values_pending"],
  [platformBridgePath, "Packet Window Proof"],
  [dataGatePath, "data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked"],
  [publicBetaPath, "public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked"],
  [boardPath, "`docs/LOCAL_RUNTIME_LAUNCH_PROOF_TRIGGER_MATRIX.md` is `accepted` as PM mainline validation trigger matrix"],
  [boardPath, "local_runtime_launch_proof_trigger_matrix_ready"],
  [statusPath, "Latest local runtime launch proof trigger matrix slice"],
  [statusPath, "local_runtime_launch_proof_trigger_matrix_ready"],
  [packagePath, "\"check:local-runtime-launch-proof-trigger-matrix\""],
  [reviewGatePath, "scripts/check-local-runtime-launch-proof-trigger-matrix.mjs"],
  [reviewGatePath, "local-runtime-launch-proof-trigger-matrix"]
]) {
  if (!read(filePath).includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

const pkg = JSON.parse(read(packagePath));
if (
  pkg.scripts?.["check:local-runtime-launch-proof-trigger-matrix"] !==
  "node scripts/check-local-runtime-launch-proof-trigger-matrix.mjs"
) {
  problems.push(`${packagePath} missing check:local-runtime-launch-proof-trigger-matrix script`);
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
      guardedStatus: "local_runtime_launch_proof_trigger_matrix_ready",
      outcome: "trigger_matrix_ready_for_pm_default_routing",
      nextRoute: "continue_local_runtime_launch_proof_without_external_changes",
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
