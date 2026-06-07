import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const operatorPath = "docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const operatorPacket = read(operatorPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `beta_deployment_execution_packet_draft_not_executable`",
  "CEO decision: `draft_beta_deployment_execution_packet_before_operator_inputs_are_filled`",
  "docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md",
  "beta_deployment_operator_input_packet_ready_not_filled",
  "future_deployment_execution_gate_ready_not_executed",
  "beta_release_runbook_draft_ready_before_any_deploy",
  "beta_launch_preflight_packet_ready_not_deployed",
  "ready_for_local_public_beta_preflight_not_production_deployed",
  "publicDataSource=mock",
  "scoreSource=mock",
  "vercel_or_equivalent_managed_nextjs_host",
  "platform_preview_or_beta_url_first_custom_domain_later",
  "defer_custom_domain_until_platform_url_passes_beta_health",
  "## Non-Executable Draft Fields",
  "NOT_EXECUTABLE_OPERATOR_INPUTS_PENDING",
  "TBD_PROVIDER_NAME",
  "TBD_HOSTING_PROJECT_NAME",
  "TBD_SOURCE_BRANCH",
  "TBD_SOURCE_COMMIT",
  "TBD_TEMPORARY_BETA_URL",
  "TBD_PLATFORM_ACTION_DESCRIPTION_NO_COMMAND",
  "TBD_ENV_OWNER",
  "TBD_SECRET_INPUT_OWNER",
  "TBD_ROLLBACK_OWNER",
  "TBD_ROLLBACK_REFERENCE",
  "TBD_INCIDENT_OWNER",
  "TBD_FIRST_RESPONSE_CHANNEL",
  "TBD_MAX_DOWNTIME_THRESHOLD",
  "docs/reviews/BETA_DEPLOYMENT_POST_RUN_REVIEW_TBD.md",
  "## Required Pre-Execution Proof",
  "cmd.exe /c npm run check:beta-deployment-execution-packet-draft",
  "cmd.exe /c npm run check:beta-deployment-operator-input-packet",
  "cmd.exe /c npm run check:future-deployment-execution-gate",
  "cmd.exe /c npm run check:beta-release-runbook-draft",
  "cmd.exe /c npm run check:beta-launch-preflight-packet",
  "cmd.exe /c npm run check:public-route-loop",
  "cmd.exe /c npm run check:localhost-full-health",
  "cmd.exe /c npm run check:json",
  "cmd.exe /c npx tsc --noEmit",
  "node scripts/check-review-gates.mjs",
  "git diff --check",
  "git status --short",
  "## Required Post-Deploy Route Health",
  "no Internal Server Error",
  "no diagnostic exposure",
  "no secret exposure",
  "mock-only boundary visible where relevant",
  "trust/legal copy visible where relevant",
  "no investment advice claim",
  "## Required Post-Run Review Outcome",
  "accepted",
  "rejected",
  "needs_bounded_repair",
  "blocked",
  "runtime boundary observed as `publicDataSource=mock`",
  "score boundary observed as `scoreSource=mock`",
  "A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`",
  "A2 remains assigned to `beta_phrase_set_and_shared_trust_surface_patch_scope`",
  "The next route is `fill_operator_inputs_then_create_separate_executable_deployment_packet`, not deployment"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const route of [
  "`/`",
  "`/briefing`",
  "`/weekly`",
  "`/stocks/2330`",
  "`/stocks/TWII`",
  "`/disclaimer`",
  "`/terms`",
  "`/privacy`",
  "`/methodology`"
]) {
  if (!doc.includes(route)) problems.push(`${docPath} missing route: ${route}`);
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
  "Status: `beta_deployment_operator_input_packet_ready_not_filled`",
  "The current status is `beta_deployment_operator_input_packet_ready_not_filled`, not deployment ready",
  "TBD_PROVIDER_NAME",
  "TBD_TEMPORARY_BETA_URL"
]) {
  if (!operatorPacket.includes(phrase)) problems.push(`${operatorPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest beta deployment execution packet draft slice",
  "beta_deployment_execution_packet_draft_not_executable",
  "draft_beta_deployment_execution_packet_before_operator_inputs_are_filled",
  "NOT_EXECUTABLE_OPERATOR_INPUTS_PENDING",
  "fill_operator_inputs_then_create_separate_executable_deployment_packet"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/BETA_DEPLOYMENT_EXECUTION_PACKET_DRAFT.md` is `accepted` as PM mainline non-executable deployment execution packet draft",
  "beta_deployment_execution_packet_draft_not_executable",
  "draft_beta_deployment_execution_packet_before_operator_inputs_are_filled",
  "fill_operator_inputs_then_create_separate_executable_deployment_packet"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (pkg.scripts?.["check:beta-deployment-execution-packet-draft"] !== "node scripts/check-beta-deployment-execution-packet-draft.mjs") {
  problems.push(`${packagePath} missing check:beta-deployment-execution-packet-draft script`);
}

for (const phrase of [
  "scripts/check-beta-deployment-execution-packet-draft.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-deployment-execution-packet-draft\"",
  "\"beta-deployment-execution-packet-draft\""
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
      guardedStatus: "beta_deployment_execution_packet_draft_not_executable",
      nextRoute: "fill_operator_inputs_then_create_separate_executable_deployment_packet",
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
