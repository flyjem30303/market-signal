import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const futureGatePath = "docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const futureGate = read(futureGatePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `beta_deployment_operator_input_packet_ready_not_filled`",
  "CEO decision: `prepare_beta_deployment_operator_inputs_not_deploying_now`",
  "docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md",
  "future_deployment_execution_gate_ready_not_executed",
  "beta_release_runbook_draft_ready_before_any_deploy",
  "beta_launch_preflight_packet_ready_not_deployed",
  "ready_for_local_public_beta_preflight_not_production_deployed",
  "publicDataSource=mock",
  "scoreSource=mock",
  "vercel_or_equivalent_managed_nextjs_host",
  "platform_preview_or_beta_url_first_custom_domain_later",
  "defer_custom_domain_until_platform_url_passes_beta_health",
  "TW equity closed loop is accepted at `180/180`",
  "Full Level 1 MVP coverage remains `182/360`",
  "TWII remains `0/60`",
  "ETF remains `2/120`",
  "## Operator Input Form",
  "TBD_PROVIDER_NAME",
  "TBD_HOSTING_PROJECT_NAME",
  "TBD_SOURCE_BRANCH",
  "TBD_SOURCE_COMMIT",
  "TBD_TEMPORARY_BETA_URL",
  "DEFER_CUSTOM_DOMAIN_UNTIL_PLATFORM_URL_HEALTH_PASSES",
  "TBD_ENV_OWNER",
  "TBD_SECRET_INPUT_OWNER",
  "TBD_ROLLBACK_OWNER",
  "TBD_ROLLBACK_REFERENCE",
  "TBD_INCIDENT_OWNER",
  "TBD_FIRST_RESPONSE_CHANNEL",
  "TBD_MAX_DOWNTIME_THRESHOLD",
  "docs/reviews/BETA_DEPLOYMENT_POST_RUN_REVIEW_TBD.md",
  "## Local Proof Required Before Filling",
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
  "## Post-Deploy Route Health Targets",
  "mock-only boundary visibility",
  "trust copy visibility",
  "absence of diagnostic or secret exposure",
  "A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`",
  "A2 remains assigned to `beta_phrase_set_and_shared_trust_surface_patch_scope`",
  "## Acceptance Criteria",
  "The current status is `beta_deployment_operator_input_packet_ready_not_filled`, not deployment ready"
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
  "Status: `future_deployment_execution_gate_ready_not_executed`",
  "A later deployment execution packet must be created before anyone performs the actual platform action",
  "exact platform action, without secret values"
]) {
  if (!futureGate.includes(phrase)) problems.push(`${futureGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest beta deployment operator input packet slice",
  "beta_deployment_operator_input_packet_ready_not_filled",
  "prepare_beta_deployment_operator_inputs_not_deploying_now",
  "TBD_PROVIDER_NAME",
  "TBD_TEMPORARY_BETA_URL"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/BETA_DEPLOYMENT_OPERATOR_INPUT_PACKET.md` is `accepted` as PM mainline deployment operator input preparation",
  "beta_deployment_operator_input_packet_ready_not_filled",
  "prepare_beta_deployment_operator_inputs_not_deploying_now",
  "TBD_PROVIDER_NAME",
  "TBD_TEMPORARY_BETA_URL"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (pkg.scripts?.["check:beta-deployment-operator-input-packet"] !== "node scripts/check-beta-deployment-operator-input-packet.mjs") {
  problems.push(`${packagePath} missing check:beta-deployment-operator-input-packet script`);
}

for (const phrase of [
  "scripts/check-beta-deployment-operator-input-packet.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-deployment-operator-input-packet\"",
  "\"beta-deployment-operator-input-packet\""
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
      guardedStatus: "beta_deployment_operator_input_packet_ready_not_filled",
      nextRoute: "operator_inputs_can_be_filled_then_separate_deployment_execution_packet",
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
