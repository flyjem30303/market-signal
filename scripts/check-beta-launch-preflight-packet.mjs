import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_LAUNCH_PREFLIGHT_PACKET.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const publicBetaPath = "docs/PUBLIC_BETA_READINESS_GATE.md";
const formalLaunchPath = "docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const publicBeta = read(publicBetaPath);
const formalLaunch = read(formalLaunchPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `beta_launch_preflight_packet_ready_not_deployed`",
  "CEO decision: `prepare_public_beta_preflight_without_deploying_production`",
  "PM selected route: `beta_release_runbook_draft_before_any_deploy`",
  "docs/PUBLIC_BETA_READINESS_GATE.md",
  "docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md",
  "docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md",
  "docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md",
  "public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked",
  "ready_for_local_public_beta_preflight_not_production_deployed",
  "formal_launch_deployment_readiness_gate_ready_not_deployed",
  "ready_for_deployment_preflight_review_not_deployed",
  "check:localhost-full-health",
  "check:public-route-loop",
  "`/`",
  "`/briefing`",
  "`/weekly`",
  "`/stocks/[symbol]`",
  "`/methodology`",
  "`/disclaimer`",
  "`/terms`",
  "`/privacy`",
  "final target rows `180`",
  "Full Level 1 MVP coverage remains `182/360`",
  "TW equity sub-scope is accepted at `180/180`",
  "TWII remains `0/60`",
  "ETF remains `2/120`",
  "`0050` `1/60`",
  "`006208` `1/60`",
  "publicDataSource=mock",
  "scoreSource=mock",
  "Product route health",
  "Public trust copy",
  "Runtime/data boundary",
  "Score boundary",
  "Data closure evidence",
  "Deployment env",
  "Monitoring and health",
  "Rollback",
  "DNS/SSL",
  "Secrets",
  "Legal/source rights",
  "Incident triage",
  "Deployment action",
  "`accepted_local`",
  "`ready_for_beta_with_known_copy_followups`",
  "`mock_required`",
  "`tw_equity_closed_loop_partial_coverage`",
  "`checklist_ready_external_values_required`",
  "`local_ok_prod_pending`",
  "`human_or_platform_required`",
  "`human_input_required_no_secret_output`",
  "`disclosure_ready_source_rights_blocked`",
  "`not_executed`",
  "A1 next assignment: `source_rights_evidence_intake_for_tWII_and_etf`",
  "A2 next assignment: `beta_phrase_set_and_shared_trust_surface_patch_scope`",
  "Any later remote/read/write/deploy step must have its own named gate"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const requiredHardStops = [
  "production deployment",
  "Vercel production deployment",
  "DNS change",
  "SSL configuration change",
  "production env mutation",
  "secret output",
  "SQL execution",
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
  "public source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`",
  "investment advice claim"
];

for (const phrase of requiredHardStops) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const phrase of [
  "Status: `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`",
  "`ready_for_local_public_beta_preflight_not_production_deployed`",
  "Public runtime boundary remains `publicDataSource=mock`",
  "Score boundary remains `scoreSource=mock`"
]) {
  if (!publicBeta.includes(phrase)) problems.push(`${publicBetaPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `formal_launch_deployment_readiness_gate_ready_not_deployed`",
  "`ready_for_deployment_preflight_review_not_deployed`",
  "Required local proof before deployment review",
  "Required production proof after a future deployment attempt"
]) {
  if (!formalLaunch.includes(phrase)) problems.push(`${formalLaunchPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest Beta launch preflight packet slice",
  "beta_launch_preflight_packet_ready_not_deployed",
  "beta_release_runbook_draft_before_any_deploy"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/BETA_LAUNCH_PREFLIGHT_PACKET.md` is `accepted` as PM mainline Beta launch preflight",
  "beta_launch_preflight_packet_ready_not_deployed",
  "beta_release_runbook_draft_before_any_deploy",
  "source_rights_evidence_intake_for_tWII_and_etf",
  "beta_phrase_set_and_shared_trust_surface_patch_scope"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (pkg.scripts?.["check:beta-launch-preflight-packet"] !== "node scripts/check-beta-launch-preflight-packet.mjs") {
  problems.push(`${packagePath} missing check:beta-launch-preflight-packet script`);
}

for (const phrase of [
  "scripts/check-beta-launch-preflight-packet.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-launch-preflight-packet\"",
  "\"beta-launch-preflight-packet\""
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
      guardedStatus: "beta_launch_preflight_packet_ready_not_deployed",
      nextRoute: "beta_release_runbook_draft_before_any_deploy",
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
