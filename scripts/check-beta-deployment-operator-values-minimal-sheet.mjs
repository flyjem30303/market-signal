import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const candidateGatePath = "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const candidateGate = read(candidateGatePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `beta_deployment_operator_values_minimal_sheet_ready_not_filled`",
  "CEO decision: `prepare_minimal_operator_values_sheet_before_executable_packet`",
  "minimal_operator_values_pending_then_executable_packet_candidate",
  "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md",
  "docs/BETA_DEPLOYMENT_INTAKE_CHECKLIST.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_FILL_GUIDE.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md",
  "docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md",
  "beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending",
  "blocked_operator_values_pending",
  "publicDataSource=mock",
  "scoreSource=mock",
  "vercel_or_equivalent_managed_nextjs_host",
  "platform_preview_or_beta_url_first_custom_domain_later",
  "defer_custom_domain_until_platform_url_passes_beta_health",
  "a2_shared_trust_surface_copy_patch_applied_mock_boundary_preserved",
  "## Minimal Fill Sheet",
  "AUTO_REFRESH_WITH_git_branch_show_current",
  "AUTO_REFRESH_WITH_git_rev_parse_short_HEAD",
  "AUTO_REFRESH_WITH_git_status_short",
  "AUTO_REFRESH_WITH_REQUIRED_PROOF_COMMANDS",
  "repo_refreshable_not_final",
  "external_operator_value_pending",
  "accepted_defer_value",
  "accepted_boundary",
  "TBD_PROVIDER_NAME",
  "TBD_HOSTING_PROJECT_NAME",
  "TBD_TEMPORARY_BETA_URL",
  "TBD_PLATFORM_ACTION_DESCRIPTION_NO_COMMAND",
  "TBD_ENV_OWNER",
  "TBD_SECRET_INPUT_OWNER",
  "TBD_SECRET_HANDLING_CHANNEL",
  "TBD_ROLLBACK_OWNER",
  "TBD_ROLLBACK_REFERENCE",
  "TBD_INCIDENT_OWNER",
  "TBD_FIRST_RESPONSE_CHANNEL",
  "TBD_MAX_DOWNTIME_THRESHOLD",
  "docs/reviews/BETA_DEPLOYMENT_POST_RUN_REVIEW_TBD.md",
  "## Never Fill In Repo",
  "blocked_external_operator_input_pending",
  "## Promotion Rule",
  "cmd.exe /c npm run check:beta-deployment-operator-values-minimal-sheet",
  "cmd.exe /c npm run check:beta-deployment-executable-packet-candidate-gate",
  "cmd.exe /c npm run check:beta-deployment-intake-checklist",
  "cmd.exe /c npm run check:beta-deployment-operator-fill-guide",
  "cmd.exe /c npm run check:beta-deployment-operator-input-packet",
  "cmd.exe /c npm run check:beta-deployment-execution-packet-draft",
  "cmd.exe /c npm run check:public-route-loop",
  "cmd.exe /c npm run check:localhost-full-health",
  "cmd.exe /c npm run check:json",
  "cmd.exe /c npx tsc --noEmit",
  "node scripts/check-review-gates.mjs",
  "git diff --check",
  "git status --short",
  "A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`",
  "route_local_legal_weekly_methodology_copy_patch_or_beta_deployment_intake_values",
  "The next route is `operator_values_sheet_fill_then_executable_packet_candidate`, not deployment"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
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
  "Status: `beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending`",
  "The next route is `fill_operator_values_then_create_executable_packet_candidate`, not deployment"
]) {
  if (!candidateGate.includes(phrase)) problems.push(`${candidateGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest beta deployment operator values minimal sheet slice",
  "beta_deployment_operator_values_minimal_sheet_ready_not_filled",
  "prepare_minimal_operator_values_sheet_before_executable_packet",
  "minimal_operator_values_pending_then_executable_packet_candidate",
  "operator_values_sheet_fill_then_executable_packet_candidate"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/BETA_DEPLOYMENT_OPERATOR_VALUES_MINIMAL_SHEET.md` is `accepted` as PM mainline minimal operator values sheet",
  "beta_deployment_operator_values_minimal_sheet_ready_not_filled",
  "prepare_minimal_operator_values_sheet_before_executable_packet",
  "operator_values_sheet_fill_then_executable_packet_candidate"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:beta-deployment-operator-values-minimal-sheet"] !==
  "node scripts/check-beta-deployment-operator-values-minimal-sheet.mjs"
) {
  problems.push(`${packagePath} missing check:beta-deployment-operator-values-minimal-sheet script`);
}

for (const phrase of [
  "scripts/check-beta-deployment-operator-values-minimal-sheet.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-deployment-operator-values-minimal-sheet\"",
  "\"beta-deployment-operator-values-minimal-sheet\""
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
      guardedStatus: "beta_deployment_operator_values_minimal_sheet_ready_not_filled",
      route: "minimal_operator_values_pending_then_executable_packet_candidate",
      nextRoute: "operator_values_sheet_fill_then_executable_packet_candidate",
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
