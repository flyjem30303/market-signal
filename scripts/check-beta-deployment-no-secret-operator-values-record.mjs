import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const completionGatePath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md";
const minimalSheetPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md";
const candidateGatePath = "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const completionGate = read(completionGatePath);
const minimalSheet = read(minimalSheetPath);
const candidateGate = read(candidateGatePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `beta_deployment_no_secret_operator_values_record_ready_not_filled`",
  "CEO decision: `prepare_no_secret_operator_values_record_before_executable_packet_recheck`",
  "no_secret_operator_values_record_fill_then_executable_packet_candidate_recheck",
  "not_filled_external_operator_values_pending",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_COMPLETION_GATE.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md",
  "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md",
  "beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending",
  "blocked_external_operator_values_pending",
  "beta_deployment_operator_values_minimal_sheet_ready_not_filled",
  "beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending",
  "publicDataSource=mock",
  "scoreSource=mock",
  "vercel_or_equivalent_managed_nextjs_host",
  "platform_preview_or_beta_url_first_custom_domain_later",
  "defer_custom_domain_until_platform_url_passes_beta_health",
  "## Fill Policy",
  "## No-Secret Operator Values Record",
  "REFRESH_AT_PACKET_CREATION_WITH_git_branch_show_current",
  "REFRESH_AT_PACKET_CREATION_WITH_git_rev_parse_short_HEAD",
  "REFRESH_AT_PACKET_CREATION_WITH_git_status_short",
  "REFRESH_AT_PACKET_CREATION_WITH_REQUIRED_PROOF_COMMANDS",
  "repo_refreshable_not_final",
  "external_operator_value_pending",
  "accepted_boundary",
  "accepted_defer_value",
  "accepted_local_target",
  "PENDING_SAFE_PROVIDER_NAME",
  "PENDING_SAFE_HOSTING_PROJECT_NAME",
  "PENDING_SAFE_TEMPORARY_BETA_URL",
  "PENDING_SAFE_PLATFORM_ACTION_DESCRIPTION_NO_COMMAND",
  "PENDING_SAFE_ENV_OWNER",
  "PENDING_SAFE_SECRET_INPUT_OWNER",
  "PENDING_SAFE_SECRET_HANDLING_CHANNEL",
  "PENDING_SAFE_ROLLBACK_OWNER",
  "PENDING_SAFE_ROLLBACK_REFERENCE",
  "PENDING_SAFE_INCIDENT_OWNER",
  "PENDING_SAFE_FIRST_RESPONSE_CHANNEL",
  "PENDING_SAFE_MAX_DOWNTIME_THRESHOLD",
  "PENDING_SAFE_HEALTH_CHECK_OWNER",
  "docs/reviews/BETA_DEPLOYMENT_POST_RUN_REVIEW_TBD.md",
  "## Recheck Rule",
  "beta_deployment_no_secret_operator_values_record_ready_not_filled",
  "A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`",
  "## Never Fill In Repo",
  "blocked_external_operator_input_pending",
  "## Hard Stops",
  "cmd.exe /c npm run check:beta-deployment-no-secret-operator-values-record",
  "cmd.exe /c npm run check:beta-deployment-operator-values-completion-gate",
  "cmd.exe /c npm run check:beta-deployment-operator-values-minimal-sheet",
  "cmd.exe /c npm run check:beta-deployment-executable-packet-candidate-gate",
  "cmd.exe /c npm run check:route-local-public-copy-alignment",
  "node scripts/check-review-gates.mjs",
  "git diff --check",
  "The next route is `operator_values_safe_fill_or_executable_packet_candidate_recheck`, not deployment"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const requiredRoutes = [
  "/",
  "/briefing",
  "/weekly",
  "/stocks/2330",
  "/stocks/TWII",
  "/stocks/0050",
  "/stocks/006208",
  "/disclaimer",
  "/terms",
  "/privacy"
];

for (const route of requiredRoutes) {
  if (!doc.includes(route)) problems.push(`${docPath} missing beta route health target: ${route}`);
}

for (const phrase of [
  "Status: `beta_deployment_operator_values_completion_gate_ready_blocked_external_values_pending`",
  "operator_values_record_fill_or_executable_packet_candidate_recheck",
  "external_operator_values_pending"
]) {
  if (!completionGate.includes(phrase)) problems.push(`${completionGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `beta_deployment_operator_values_minimal_sheet_ready_not_filled`",
  "external_operator_value_pending",
  "repo_refreshable_not_final"
]) {
  if (!minimalSheet.includes(phrase)) problems.push(`${minimalSheetPath} missing: ${phrase}`);
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
  "Latest beta deployment no-secret operator values record slice",
  "beta_deployment_no_secret_operator_values_record_ready_not_filled",
  "prepare_no_secret_operator_values_record_before_executable_packet_recheck",
  "not_filled_external_operator_values_pending",
  "operator_values_safe_fill_or_executable_packet_candidate_recheck"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/BETA_DEPLOYMENT_NO_SECRET_OPERATOR_VALUES_RECORD.md` is `accepted` as PM mainline no-secret operator values record candidate",
  "beta_deployment_no_secret_operator_values_record_ready_not_filled",
  "prepare_no_secret_operator_values_record_before_executable_packet_recheck",
  "not_filled_external_operator_values_pending",
  "operator_values_safe_fill_or_executable_packet_candidate_recheck"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:beta-deployment-no-secret-operator-values-record"] !==
  "node scripts/check-beta-deployment-no-secret-operator-values-record.mjs"
) {
  problems.push(`${packagePath} missing check:beta-deployment-no-secret-operator-values-record script`);
}

for (const phrase of [
  "scripts/check-beta-deployment-no-secret-operator-values-record.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-deployment-no-secret-operator-values-record\"",
  "\"beta-deployment-no-secret-operator-values-record\""
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
      guardedStatus: "beta_deployment_no_secret_operator_values_record_ready_not_filled",
      outcome: "not_filled_external_operator_values_pending",
      nextRoute: "operator_values_safe_fill_or_executable_packet_candidate_recheck",
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
