import fs from "node:fs";

const docPath = "docs/LOCAL_LAUNCH_PROOF_REFRESH_BEFORE_EXECUTABLE_PACKET.md";
const snapshotPath = "docs/LOCAL_LAUNCH_PROOF_BUNDLE_SNAPSHOT.md";
const defaultsPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_DEFAULTS_AND_REMAINING_GAPS.md";
const candidatePath = "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md";
const preflightPath = "docs/LOCAL_LAUNCH_PREFLIGHT_WITHOUT_EXTERNAL_OPERATOR_VALUES.md";
const runtimeRefreshPath = "docs/RUNTIME_LOCAL_ROUTE_HEALTH_REFRESH_BEFORE_EXECUTABLE_PACKET.md";
const a1PacketPath = "docs/A1_TWII_VENDOR_TERMS_OR_INTERNAL_FEED_OWNER_EVIDENCE_PACKET.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);

for (const phrase of [
  "Status: `local_launch_proof_refresh_before_executable_packet_ready_external_platform_values_pending`",
  "refresh_local_launch_proof_before_waiting_on_platform_values",
  "local_launch_proof_refresh_before_executable_packet",
  "local_proof_refresh_ready_platform_project_and_beta_url_pending",
  "does not deploy",
  "Local proof bundle snapshot remains `local_launch_proof_bundle_snapshot_ready_external_values_pending`",
  "Operator values defaults remain `beta_deployment_operator_values_defaults_and_remaining_gaps_ready_not_executable`",
  "Executable packet candidate gate remains `beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending`",
  "Runtime local route health refresh remains `runtime_local_route_health_refresh_ready_mock_boundary_preserved`",
  "A1 vendor/internal data evidence packet remains `a1_twii_vendor_terms_or_internal_feed_owner_evidence_packet_ready_not_filled`",
  "Public runtime remains `publicDataSource=mock`",
  "Score source remains `scoreSource=mock`",
  "cmd.exe /c npm run check:json",
  "cmd.exe /c npm run check:public-route-loop",
  "cmd.exe /c npm run check:route-local-public-copy-alignment",
  "cmd.exe /c npm run check:public-visible-language-quality",
  "cmd.exe /c npm run check:beta-deployment-operator-values-defaults-and-remaining-gaps",
  "cmd.exe /c npm run check:beta-deployment-executable-packet-candidate-gate",
  "cmd.exe /c npm run check:local-launch-proof-bundle-snapshot",
  "cmd.exe /c npm run check:runtime-local-route-health-refresh-before-executable-packet",
  "cmd.exe /c npm run check:a1-twii-vendor-terms-or-internal-feed-owner-evidence-packet",
  "cmd.exe /c npm run check:review-gates",
  "git diff --check",
  "git status --short",
  "git rev-parse --short HEAD",
  "cmd.exe /c npm run check:localhost-full-health",
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run build",
  "Hosting project name",
  "Temporary Beta URL",
  "`external_platform_value_pending`",
  "`accepted_default_not_command`",
  "`repo_refreshable_not_final`",
  "Do not create an executable deployment packet until platform project and Beta URL are available",
  "Continue `twii_vendor_terms_or_internal_feed_owner_evidence_packet`",
  "fill_platform_project_and_beta_url_or_refresh_heavy_packet_proof",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [path, phrase] of [
  [snapshotPath, "local_launch_proof_bundle_snapshot_ready_external_values_pending"],
  [defaultsPath, "safe_operator_defaults_recorded_platform_values_pending"],
  [candidatePath, "blocked_operator_values_pending"],
  [preflightPath, "local_launch_preflight_without_external_operator_values_ready_external_values_pending"],
  [runtimeRefreshPath, "runtime_local_route_health_refresh_ready_mock_boundary_preserved"],
  [a1PacketPath, "a1_twii_vendor_terms_or_internal_feed_owner_evidence_packet_ready_not_filled"],
  [boardPath, "`docs/LOCAL_LAUNCH_PROOF_REFRESH_BEFORE_EXECUTABLE_PACKET.md` is `accepted` as PM mainline local proof refresh before executable packet"],
  [boardPath, "fill_platform_project_and_beta_url_or_refresh_heavy_packet_proof"],
  [statusPath, "Latest local launch proof refresh before executable packet slice"],
  [statusPath, "local_launch_proof_refresh_before_executable_packet_ready_external_platform_values_pending"],
  [packagePath, "\"check:local-launch-proof-refresh-before-executable-packet\""],
  [reviewGatePath, "scripts/check-local-launch-proof-refresh-before-executable-packet.mjs"],
  [reviewGatePath, "local-launch-proof-refresh-before-executable-packet"]
]) {
  if (!read(path).includes(phrase)) problems.push(`${path} missing phrase: ${phrase}`);
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

const pkg = JSON.parse(read(packagePath));
if (
  pkg.scripts?.["check:local-launch-proof-refresh-before-executable-packet"] !==
  "node scripts/check-local-launch-proof-refresh-before-executable-packet.mjs"
) {
  problems.push(`${packagePath} missing check:local-launch-proof-refresh-before-executable-packet script`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      docPath,
      guardedStatus: "local_launch_proof_refresh_before_executable_packet_ready_external_platform_values_pending",
      outcome: "local_proof_refresh_ready_platform_project_and_beta_url_pending",
      nextRoute: "fill_platform_project_and_beta_url_or_refresh_heavy_packet_proof"
    },
    null,
    2
  )
);

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
