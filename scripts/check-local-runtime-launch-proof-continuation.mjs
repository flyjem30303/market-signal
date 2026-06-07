import fs from "node:fs";

const problems = [];

const docPath = "docs/LOCAL_RUNTIME_LAUNCH_PROOF_CONTINUATION.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const selectorPath = "docs/PRE_LAUNCH_EXECUTABLE_STATE_GAP_CONVERGENCE.md";
const routeHealthPath = "docs/RUNTIME_LOCAL_ROUTE_HEALTH_REFRESH_BEFORE_EXECUTABLE_PACKET.md";
const dataGatePath = "docs/DATA_GATE_READINESS_AFTER_LOCAL_ROUTE_HEALTH_REFRESH.md";
const runtimeHandoffPath = "docs/RUNTIME_DATA_PROMOTION_HANDOFF_CHECKLIST.md";
const runtimeSummaryPath = "docs/RUNTIME_SUMMARY_ALIGNMENT_FROM_FIRST_CLOSED_LOOP.md";
const publicBetaPath = "docs/PUBLIC_BETA_READINESS_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);

for (const phrase of [
  "Status: `local_runtime_launch_proof_continuation_ready_no_external_changes`",
  "continue_local_runtime_launch_proof_without_external_changes",
  "local_runtime_launch_proof_ready_external_values_still_pending",
  "pre_launch_executable_state_gap_convergence_ready_external_values_and_source_rights_pending",
  "public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked",
  "runtime_local_route_health_refresh_ready_mock_boundary_preserved",
  "data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked",
  "runtime_summary_alignment_from_first_closed_loop_applied_mock_boundary_preserved",
  "runtime_data_promotion_handoff_checklist_ready_mock_boundary_preserved",
  "publicDataSource=mock",
  "scoreSource=mock",
  "platform_generated_value_pending",
  "blocked_external_rights_field_contract_and_asset_mapping_pending",
  "rejected_for_execution_pending_external_rights",
  "Full MVP coverage remains blocked at `182/360`",
  "not_ready_for_real_data_promotion",
  "cmd.exe /c npm run check:pre-launch-executable-state-gap-convergence",
  "cmd.exe /c npm run check:runtime-local-route-health-refresh-before-executable-packet",
  "cmd.exe /c npm run check:data-gate-readiness-after-local-route-health-refresh",
  "cmd.exe /c npm run check:runtime-data-promotion-handoff-checklist",
  "cmd.exe /c npm run check:runtime-summary-alignment-from-first-closed-loop",
  "cmd.exe /c npm run check:public-beta-readiness-gate",
  "cmd.exe /c npm run check:local-runtime-launch-proof-continuation",
  "git diff --check",
  "Do not run the heavier packet-window proof unless",
  "executable_packet_candidate_after_platform_values",
  "twii_source_rights_and_field_contract_acceptance_or_blocked_record",
  "runtime_repair_before_next_gate",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [filePath, phrase] of [
  [selectorPath, "pre_launch_executable_state_gap_convergence_ready_external_values_and_source_rights_pending"],
  [selectorPath, "continue_local_runtime_launch_proof_without_external_changes"],
  [routeHealthPath, "runtime_local_route_health_refresh_ready_mock_boundary_preserved"],
  [dataGatePath, "data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked"],
  [runtimeHandoffPath, "runtime_data_promotion_handoff_checklist_ready_mock_boundary_preserved"],
  [runtimeSummaryPath, "runtime_summary_alignment_from_first_closed_loop_applied_mock_boundary_preserved"],
  [publicBetaPath, "public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked"],
  [boardPath, "`docs/LOCAL_RUNTIME_LAUNCH_PROOF_CONTINUATION.md` is `accepted` as PM mainline local runtime launch proof continuation"],
  [boardPath, "local_runtime_launch_proof_continuation_ready_no_external_changes"],
  [statusPath, "Latest local runtime launch proof continuation slice"],
  [statusPath, "local_runtime_launch_proof_continuation_ready_no_external_changes"],
  [packagePath, "\"check:local-runtime-launch-proof-continuation\""],
  [reviewGatePath, "scripts/check-local-runtime-launch-proof-continuation.mjs"],
  [reviewGatePath, "local-runtime-launch-proof-continuation"]
]) {
  if (!read(filePath).includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

const pkg = JSON.parse(read(packagePath));
if (
  pkg.scripts?.["check:local-runtime-launch-proof-continuation"] !==
  "node scripts/check-local-runtime-launch-proof-continuation.mjs"
) {
  problems.push(`${packagePath} missing check:local-runtime-launch-proof-continuation script`);
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
      guardedStatus: "local_runtime_launch_proof_continuation_ready_no_external_changes",
      outcome: "local_runtime_launch_proof_ready_external_values_still_pending",
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
