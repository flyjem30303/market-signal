import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_DEPLOYMENT_PLATFORM_VALUES_BRIDGE.md";
const launchRefreshPath = "docs/LOCAL_LAUNCH_PROOF_REFRESH_BEFORE_EXECUTABLE_PACKET.md";
const candidateGatePath = "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md";
const defaultsPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_DEFAULTS_AND_REMAINING_GAPS.md";
const gapPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_GAP_LIST.md";
const proofBundlePath = "docs/LOCAL_LAUNCH_PROOF_BUNDLE_SNAPSHOT.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);

for (const phrase of [
  "Status: `beta_deployment_platform_values_bridge_ready_operator_platform_values_pending`",
  "separate_platform_generated_values_from_pm_refreshable_packet_proof",
  "platform_values_bridge_then_executable_packet_candidate",
  "packet_bridge_ready_platform_project_and_beta_url_pending",
  "does not deploy",
  "Local launch proof refresh remains `local_launch_proof_refresh_before_executable_packet_ready_external_platform_values_pending`",
  "Executable packet candidate gate remains `beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending`",
  "Operator values defaults remain `beta_deployment_operator_values_defaults_and_remaining_gaps_ready_not_executable`",
  "Operator values gap list remains `beta_deployment_operator_values_gap_list_ready_external_values_pending`",
  "Local proof bundle snapshot remains `local_launch_proof_bundle_snapshot_ready_external_values_pending`",
  "Public runtime remains `publicDataSource=mock`",
  "Score source remains `scoreSource=mock`",
  "`pm_refresh_at_packet_creation`",
  "`platform_generated_value_pending`",
  "Hosting project name",
  "Temporary Beta URL",
  "cmd.exe /c npm run check:beta-deployment-platform-values-bridge",
  "cmd.exe /c npm run check:localhost-full-health",
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run build",
  "Continue source-rights and data coverage evidence work",
  "create_executable_packet_candidate_after_platform_values",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [filePath, phrase] of [
  [launchRefreshPath, "local_launch_proof_refresh_before_executable_packet_ready_external_platform_values_pending"],
  [candidateGatePath, "beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending"],
  [defaultsPath, "safe_operator_defaults_recorded_platform_values_pending"],
  [gapPath, "beta_deployment_operator_values_gap_list_ready_external_values_pending"],
  [proofBundlePath, "local_launch_proof_bundle_snapshot_ready_external_values_pending"],
  [boardPath, "`docs/BETA_DEPLOYMENT_PLATFORM_VALUES_BRIDGE.md` is `accepted` as PM mainline platform values bridge before executable packet"],
  [boardPath, "create_executable_packet_candidate_after_platform_values"],
  [statusPath, "Latest beta deployment platform values bridge slice"],
  [statusPath, "beta_deployment_platform_values_bridge_ready_operator_platform_values_pending"],
  [packagePath, "\"check:beta-deployment-platform-values-bridge\""],
  [reviewGatePath, "scripts/check-beta-deployment-platform-values-bridge.mjs"],
  [reviewGatePath, "beta-deployment-platform-values-bridge"]
]) {
  if (!read(filePath).includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

const pkg = JSON.parse(read(packagePath));
if (
  pkg.scripts?.["check:beta-deployment-platform-values-bridge"] !==
  "node scripts/check-beta-deployment-platform-values-bridge.mjs"
) {
  problems.push(`${packagePath} missing check:beta-deployment-platform-values-bridge script`);
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
  /vercel deploy --prod/u,
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
      guardedStatus: "beta_deployment_platform_values_bridge_ready_operator_platform_values_pending",
      outcome: "packet_bridge_ready_platform_project_and_beta_url_pending",
      nextRoute: "create_executable_packet_candidate_after_platform_values",
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
