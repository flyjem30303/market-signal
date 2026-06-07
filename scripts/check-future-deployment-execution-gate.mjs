import fs from "node:fs";

const problems = [];

const docPath = "docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const runbookPath = "docs/BETA_RELEASE_RUNBOOK_DRAFT.md";
const preflightPath = "docs/BETA_LAUNCH_PREFLIGHT_PACKET.md";
const formalLaunchPath = "docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const runbook = read(runbookPath);
const preflight = read(preflightPath);
const formalLaunch = read(formalLaunchPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `future_deployment_execution_gate_ready_not_executed`",
  "CEO decision: `prepare_future_deployment_execution_gate_not_deploying_now`",
  "vercel_or_equivalent_managed_nextjs_host",
  "platform_preview_or_beta_url_first_custom_domain_later",
  "defer_custom_domain_until_platform_url_passes_beta_health",
  "supabase_backend_available_but_public_runtime_stays_mock",
  "mock_score_until_real_score_promotion_gate",
  "hosting_provider_rollback_to_prior_deployment",
  "pm_primary_i_launch_ops_backup",
  "docs/BETA_RELEASE_RUNBOOK_DRAFT.md",
  "docs/BETA_LAUNCH_PREFLIGHT_PACKET.md",
  "docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md",
  "docs/PUBLIC_BETA_READINESS_GATE.md",
  "beta_release_runbook_draft_ready_before_any_deploy",
  "beta_launch_preflight_packet_ready_not_deployed",
  "formal_launch_deployment_readiness_gate_ready_not_deployed",
  "ready_for_local_public_beta_preflight_not_production_deployed",
  "publicDataSource=mock",
  "scoreSource=mock",
  "TW equity closed loop is accepted at `180/180`",
  "Full Level 1 MVP coverage remains `182/360`",
  "TWII remains `0/60`",
  "ETF remains `2/120`",
  "## Deployment Target Decision",
  "## Required Pre-Execution Local Proof",
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
  "## Later Execution Packet Requirements",
  "exact platform action, without secret values",
  "post-deploy health verification steps",
  "maximum acceptable downtime before rollback",
  "explicit mock runtime decision",
  "explicit mock score decision",
  "post-run review path",
  "## Post-Deploy Review Template",
  "runtime boundary observed as `publicDataSource=mock`",
  "score boundary observed as `scoreSource=mock`",
  "accepted / rejected / needs_bounded_repair / blocked",
  "A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`",
  "A2 remains assigned to `beta_phrase_set_and_shared_trust_surface_patch_scope`"
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
  "deployment command execution",
  "hosting project mutation",
  "DNS change",
  "SSL configuration change",
  "platform env mutation",
  "secret output",
  "secret storage action",
  "SQL execution",
  "Supabase write",
  "Supabase connection for deployment proof",
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
  "Status: `beta_release_runbook_draft_ready_before_any_deploy`",
  "A later deployment execution packet must be created before anyone performs the actual platform action"
]) {
  if (!runbook.includes(phrase)) problems.push(`${runbookPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `beta_launch_preflight_packet_ready_not_deployed`",
  "Any later remote/read/write/deploy step must have its own named gate"
]) {
  if (!preflight.includes(phrase)) problems.push(`${preflightPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `formal_launch_deployment_readiness_gate_ready_not_deployed`",
  "Required production proof after a future deployment attempt",
  "No DNS or SSL change is executed by this gate"
]) {
  if (!formalLaunch.includes(phrase)) problems.push(`${formalLaunchPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest future deployment execution gate slice",
  "future_deployment_execution_gate_ready_not_executed",
  "prepare_future_deployment_execution_gate_not_deploying_now",
  "vercel_or_equivalent_managed_nextjs_host"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md` is `accepted` as PM mainline deployment execution gate preparation",
  "future_deployment_execution_gate_ready_not_executed",
  "prepare_future_deployment_execution_gate_not_deploying_now",
  "vercel_or_equivalent_managed_nextjs_host"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (pkg.scripts?.["check:future-deployment-execution-gate"] !== "node scripts/check-future-deployment-execution-gate.mjs") {
  problems.push(`${packagePath} missing check:future-deployment-execution-gate script`);
}

for (const phrase of [
  "scripts/check-future-deployment-execution-gate.mjs",
  "expectStatus: \"ok\"",
  "name: \"future-deployment-execution-gate\"",
  "\"future-deployment-execution-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
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
      guardedStatus: "future_deployment_execution_gate_ready_not_executed",
      selectedHostPosture: "vercel_or_equivalent_managed_nextjs_host",
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
