import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const intakePath = "docs/BETA_DEPLOYMENT_INTAKE_CHECKLIST.md";
const operatorPath = "docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md";
const executionDraftPath = "docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const intake = read(intakePath);
const operatorPacket = read(operatorPath);
const executionDraft = read(executionDraftPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending`",
  "CEO decision: `prepare_executable_packet_candidate_gate_without_operator_values`",
  "blocked_operator_values_pending",
  "docs/BETA_DEPLOYMENT_INTAKE_CHECKLIST.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md",
  "docs/BETA_DEPLOYMENT_OPERATOR_FILL_GUIDE.md",
  "docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md",
  "beta_deployment_intake_checklist_ready_not_filled",
  "beta_deployment_operator_input_packet_ready_not_filled",
  "beta_deployment_operator_fill_guide_ready_not_filled",
  "beta_deployment_execution_packet_draft_not_executable",
  "future_deployment_execution_gate_ready_not_executed",
  "ready_for_local_public_beta_preflight_not_production_deployed",
  "publicDataSource=mock",
  "scoreSource=mock",
  "vercel_or_equivalent_managed_nextjs_host",
  "platform_preview_or_beta_url_first_custom_domain_later",
  "defer_custom_domain_until_platform_url_passes_beta_health",
  "a2_shared_trust_surface_copy_patch_applied_mock_boundary_preserved",
  "## Candidate Readiness Summary",
  "repo_derived_candidate_available_refresh_at_packet_creation",
  "external_operator_value_pending",
  "accepted_boundary",
  "not_authorized",
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
  "blocked_external_operator_input_pending",
  "## Candidate Creation Rule",
  "## Required Proof Before Candidate Promotion",
  "cmd.exe /c npm run check:beta-deployment-executable-packet-candidate-gate",
  "cmd.exe /c npm run check:beta-deployment-intake-checklist",
  "cmd.exe /c npm run check:beta-deployment-operator-fill-guide",
  "cmd.exe /c npm run check:beta-deployment-operator-input-packet",
  "cmd.exe /c npm run check:beta-deployment-execution-packet-draft",
  "cmd.exe /c npm run check:future-deployment-execution-gate",
  "cmd.exe /c npm run check:public-route-loop",
  "cmd.exe /c npm run check:localhost-full-health",
  "cmd.exe /c npm run check:json",
  "cmd.exe /c npx tsc --noEmit",
  "node scripts/check-review-gates.mjs",
  "git diff --check",
  "git status --short",
  "A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`",
  "A2 has completed `a2_shared_trust_surface_copy_patch_applied_mock_boundary_preserved`",
  "route_local_legal_weekly_methodology_copy_patch_or_beta_deployment_intake_values",
  "The next route is `fill_operator_values_then_create_executable_packet_candidate`, not deployment",
  "accepted"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
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
  "Status: `beta_deployment_intake_checklist_ready_not_filled`",
  "operator_intake_values_pending_then_executable_packet_candidate"
]) {
  if (!intake.includes(phrase)) problems.push(`${intakePath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `beta_deployment_operator_input_packet_ready_not_filled`",
  "TBD_PROVIDER_NAME",
  "TBD_TEMPORARY_BETA_URL"
]) {
  if (!operatorPacket.includes(phrase)) problems.push(`${operatorPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `beta_deployment_execution_packet_draft_not_executable`",
  "NOT_EXECUTABLE_OPERATOR_INPUTS_PENDING",
  "fill_operator_inputs_then_create_separate_executable_deployment_packet"
]) {
  if (!executionDraft.includes(phrase)) problems.push(`${executionDraftPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest beta deployment executable packet candidate gate slice",
  "beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending",
  "prepare_executable_packet_candidate_gate_without_operator_values",
  "blocked_operator_values_pending",
  "fill_operator_values_then_create_executable_packet_candidate"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/BETA_DEPLOYMENT_EXECUTABLE_PACKET_CANDIDATE_GATE.md` is `accepted` as PM mainline executable packet candidate gate",
  "beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending",
  "prepare_executable_packet_candidate_gate_without_operator_values",
  "blocked_operator_values_pending",
  "fill_operator_values_then_create_executable_packet_candidate"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:beta-deployment-executable-packet-candidate-gate"] !==
  "node scripts/check-beta-deployment-executable-packet-candidate-gate.mjs"
) {
  problems.push(`${packagePath} missing check:beta-deployment-executable-packet-candidate-gate script`);
}

for (const phrase of [
  "scripts/check-beta-deployment-executable-packet-candidate-gate.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-deployment-executable-packet-candidate-gate\"",
  "\"beta-deployment-executable-packet-candidate-gate\""
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
      guardedStatus: "beta_deployment_executable_packet_candidate_gate_ready_blocked_operator_values_pending",
      outcome: "blocked_operator_values_pending",
      nextRoute: "fill_operator_values_then_create_executable_packet_candidate",
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
