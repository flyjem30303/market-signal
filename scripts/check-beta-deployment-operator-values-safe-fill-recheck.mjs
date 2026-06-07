import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_SAFE_FILL_RECHECK.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const recordPath = "docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md";
const completionGatePath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md";
const candidateGatePath = "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const record = read(recordPath);
const completionGate = read(completionGatePath);
const candidateGate = read(candidateGatePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `beta_deployment_operator_values_safe_fill_recheck_ready_external_values_pending`",
  "CEO decision: `recheck_operator_values_safe_fill_before_executable_packet_candidate`",
  "operator_values_safe_fill_recheck_then_external_values_or_packet_candidate",
  "external_operator_values_still_pending_executable_packet_blocked",
  "docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md",
  "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md",
  "beta_deployment_no_secret_operator_values_record_ready_not_filled",
  "not_filled_external_operator_values_pending",
  "beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending",
  "blocked_external_operator_values_pending",
  "beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending",
  "publicDataSource=mock",
  "scoreSource=mock",
  "vercel_or_equivalent_managed_nextjs_host",
  "platform_preview_or_beta_url_first_custom_domain_later",
  "defer_custom_domain_until_platform_url_passes_beta_health",
  "## Safe Fill Recheck Matrix",
  "pm_refreshable_at_packet_creation_not_now",
  "external_operator_value_required",
  "external_operator_value_required_no_command",
  "accepted_defer_custom_domain",
  "accepted_boundary_publicDataSource_mock",
  "accepted_boundary_scoreSource_mock",
  "accepted_local_route_health_targets",
  "external_operator_values_still_pending",
  "executable_packet_candidate_blocked",
  "external_operator_values_or_continue_local_launch_preflight",
  "A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`",
  "## Never Fill In Repo",
  "blocked_external_operator_input_pending",
  "## Hard Stops",
  "cmd.exe /c npm run check:beta-deployment-operator-values-safe-fill-recheck",
  "cmd.exe /c npm run check:beta-deployment-no-secret-operator-values-record",
  "cmd.exe /c npm run check:beta-deployment-operator-values-completion-gate",
  "cmd.exe /c npm run check:beta-deployment-executable-packet-candidate-gate",
  "cmd.exe /c npm run check:route-local-public-copy-alignment",
  "node scripts/check-review-gates.mjs",
  "git diff --check",
  "The next route is `external_operator_values_or_continue_local_launch_preflight`, not deployment"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const requiredFields = [
  "Deployment source branch",
  "Source commit",
  "Worktree state",
  "Local proof bundle",
  "Hosting provider",
  "Hosting project name",
  "Temporary Beta URL",
  "Exact platform action",
  "Custom domain decision",
  "Environment variable owner",
  "Secret input owner",
  "Secret handling channel",
  "Public data source",
  "Score source",
  "Rollback owner",
  "Rollback reference",
  "Incident owner",
  "First-response channel",
  "Maximum downtime before rollback",
  "Beta health check owner",
  "Beta route health target",
  "Review path"
];

for (const phrase of requiredFields) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing recheck field: ${phrase}`);
}

for (const phrase of [
  "Status: `beta_deployment_no_secret_operator_values_record_ready_not_filled`",
  "operator_values_safe_fill_or_executable_packet_candidate_recheck",
  "PENDING_SAFE_PROVIDER_NAME",
  "PENDING_SAFE_HEALTH_CHECK_OWNER"
]) {
  if (!record.includes(phrase)) problems.push(`${recordPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending`",
  "blocked_external_operator_values_pending",
  "operator_values_record_fill_or_executable_packet_candidate_recheck"
]) {
  if (!completionGate.includes(phrase)) problems.push(`${completionGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending`",
  "blocked_operator_values_pending",
  "fill_operator_values_then_create_executable_packet_candidate"
]) {
  if (!candidateGate.includes(phrase)) problems.push(`${candidateGatePath} missing: ${phrase}`);
}

const requiredNeverFill = [
  "deployment token",
  "API token",
  "private preview token",
  "private dashboard token",
  "registrar credential",
  "SSL private key",
  "env value",
  "service role key",
  "Supabase secret",
  "raw payload",
  "row payload",
  "stock id payload",
  "private invite token",
  "payment credential"
];

for (const phrase of requiredNeverFill) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing never-fill item: ${phrase}`);
}

const requiredHardStops = [
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
  "Supabase connection for deployment proof",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "raw market-data ingest",
  "raw market-data storage",
  "raw market-data commit",
  "raw payload output",
  "row payload output",
  "stock id payload output",
  "row coverage points",
  "complete MVP coverage claim",
  "Supabase public-source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`",
  "investment advice claim",
  "public launch completion claim"
];

for (const phrase of requiredHardStops) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const phrase of [
  "Latest beta deployment operator values safe fill recheck slice",
  "beta_deployment_operator_values_safe_fill_recheck_ready_external_values_pending",
  "recheck_operator_values_safe_fill_before_executable_packet_candidate",
  "external_operator_values_still_pending_executable_packet_blocked",
  "external_operator_values_or_continue_local_launch_preflight"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/BETA_DEPLOYMENT_OPERATOR_VALUES_SAFE_FILL_RECHECK.md` is `accepted` as PM mainline operator values safe fill recheck",
  "beta_deployment_operator_values_safe_fill_recheck_ready_external_values_pending",
  "recheck_operator_values_safe_fill_before_executable_packet_candidate",
  "external_operator_values_still_pending_executable_packet_blocked",
  "external_operator_values_or_continue_local_launch_preflight"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:beta-deployment-operator-values-safe-fill-recheck"] !==
  "node scripts/check-beta-deployment-operator-values-safe-fill-recheck.mjs"
) {
  problems.push(`${packagePath} missing check:beta-deployment-operator-values-safe-fill-recheck script`);
}

for (const phrase of [
  "scripts/check-beta-deployment-operator-values-safe-fill-recheck.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-deployment-operator-values-safe-fill-recheck\"",
  "\"beta-deployment-operator-values-safe-fill-recheck\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /\b[A-Za-z0-9_-]{32,}\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/u,
  /vercel deploy --prod/u,
  /npm run deploy/u,
  /RUN_DEPLOY_NOW/u,
  /DEPLOYMENT_COMPLETED/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /production deployment completed/u,
  /preview deployment completed/u,
  /DNS configured/u,
  /full MVP coverage complete/u,
  /investment advice approved/u
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
      guardedStatus: "beta_deployment_operator_values_safe_fill_recheck_ready_external_values_pending",
      outcome: "external_operator_values_still_pending_executable_packet_blocked",
      nextRoute: "external_operator_values_or_continue_local_launch_preflight",
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
