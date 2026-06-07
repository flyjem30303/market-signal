import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_PLATFORM_TWO_VALUE_INTAKE_GATE.md";
const platformBridgePath = "docs/BETA_DEPLOYMENT_PLATFORM_VALUES_BRIDGE.md";
const defaultsPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_DEFAULTS_AND_REMAINING_GAPS.md";
const runnerGatePath = "docs/BETA_EXECUTABLE_PACKET_REPO_PROOF_RUNNER_GATE.md";
const packetSelectorPath = "docs/BETA_DEPLOYMENT_PACKET_WINDOW_READINESS_SELECTOR.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `beta_platform_two_value_intake_gate_ready_waiting_two_values`",
  "CEO decision: `compress_beta_platform_intake_to_two_safe_values`",
  "beta_platform_two_value_intake_gate",
  "waiting_for_hosting_project_name_and_temporary_beta_url",
  "Hosting project name",
  "Temporary Beta URL",
  "`platform_generated_value_pending`",
  "Plain project name only",
  "Public `https://...` URL without secret query string",
  "vercel_or_equivalent_managed_nextjs_host",
  "accepted_defer_until_temporary_beta_health_passes",
  "out_of_repo_secret_channel_required",
  "run:beta-executable-packet-repo-proof",
  "beta_deployment_executable_packet_after_platform_values",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const [filePath, phrase] of [
  [platformBridgePath, "Hosting project name"],
  [platformBridgePath, "Temporary Beta URL"],
  [platformBridgePath, "`platform_generated_value_pending`"],
  [defaultsPath, "hosting project name is known as a safe non-secret value"],
  [defaultsPath, "temporary Beta URL is known as a public URL without secret query string"],
  [runnerGatePath, "beta_executable_packet_repo_proof_runner_gate_ready"],
  [packetSelectorPath, "beta_deployment_executable_packet_after_platform_values"],
  [statusPath, "Latest beta platform two value intake gate slice"],
  [statusPath, "beta_platform_two_value_intake_gate_ready_waiting_two_values"],
  [boardPath, "`docs/BETA_PLATFORM_TWO_VALUE_INTAKE_GATE.md` is `accepted` as PM mainline two-value platform intake gate"],
  [boardPath, "waiting_for_hosting_project_name_and_temporary_beta_url"]
]) {
  if (!read(filePath).includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["check:beta-platform-two-value-intake-gate"] !== "node scripts/check-beta-platform-two-value-intake-gate.mjs") {
  problems.push(`${packagePath} missing check:beta-platform-two-value-intake-gate script`);
}

for (const phrase of [
  "scripts/check-beta-platform-two-value-intake-gate.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-platform-two-value-intake-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "production deployment",
  "preview deployment",
  "deployment command execution",
  "hosting project creation",
  "hosting project mutation",
  "DNS change",
  "SSL configuration change",
  "platform env mutation",
  "secret output",
  "secret storage action",
  "SQL execution",
  "Supabase connection",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "raw market-data ingest",
  "raw market-data storage",
  "raw market-data commit",
  "row coverage points",
  "complete MVP coverage claim",
  "Supabase public-source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`",
  "investment advice claim",
  "public launch completion claim"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

const forbiddenPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /vercel deploy/iu,
  /npm run deploy/iu,
  /RUN_DEPLOY_NOW/u,
  /DEPLOYMENT_COMPLETED/u,
  /production deployment completed/iu,
  /preview deployment completed/iu,
  /deployment command executed/iu,
  /hosting project created/iu,
  /platform env mutated/iu,
  /SQL execution is approved/iu,
  /Supabase writes are approved/iu,
  /row coverage points awarded/iu,
  /complete MVP coverage achieved/iu,
  /publicDataSource=supabase is approved/iu,
  /scoreSource=real is approved/iu
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
      guardedStatus: "beta_platform_two_value_intake_gate_ready_waiting_two_values",
      outcome: "waiting_for_hosting_project_name_and_temporary_beta_url",
      requiredValues: ["hostingProjectName", "temporaryBetaUrl"]
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }

  return fs.readFileSync(filePath, "utf8");
}
