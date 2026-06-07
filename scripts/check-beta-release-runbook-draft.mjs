import fs from "node:fs";

const problems = [];

const docPath = "docs/BETA_RELEASE_RUNBOOK_DRAFT.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const preflightPath = "docs/BETA_LAUNCH_PREFLIGHT_PACKET.md";
const publicBetaPath = "docs/PUBLIC_BETA_READINESS_GATE.md";
const formalLaunchPath = "docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const preflight = read(preflightPath);
const publicBeta = read(publicBetaPath);
const formalLaunch = read(formalLaunchPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `beta_release_runbook_draft_ready_before_any_deploy`",
  "CEO decision: `draft_beta_release_runbook_before_any_deploy`",
  "docs/BETA_LAUNCH_PREFLIGHT_PACKET.md",
  "docs/PUBLIC_BETA_READINESS_GATE.md",
  "docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md",
  "beta_launch_preflight_packet_ready_not_deployed",
  "ready_for_local_public_beta_preflight_not_production_deployed",
  "formal_launch_deployment_readiness_gate_ready_not_deployed",
  "beta_release_runbook_draft_before_any_deploy",
  "publicDataSource=mock",
  "scoreSource=mock",
  "TW equity closed loop is accepted at `180/180`",
  "Full Level 1 MVP coverage remains `182/360`",
  "TWII remains `0/60`",
  "ETF remains `2/120`",
  "## Release Phases",
  "1. Local proof collection",
  "2. Deployment target decision",
  "3. Secret and env input plan",
  "4. Pre-deploy copy and legal spot check",
  "5. Data and source-rights spot check",
  "6. Future deploy execution gate",
  "7. Post-deploy health verification",
  "8. Monitoring and rollback confirmation",
  "9. Public Beta go/no-go review",
  "## Required Local Proof Commands",
  "cmd.exe /c npm run check:beta-launch-preflight-packet",
  "cmd.exe /c npm run check:public-route-loop",
  "cmd.exe /c npm run check:localhost-full-health",
  "cmd.exe /c npm run check:json",
  "cmd.exe /c npx tsc --noEmit",
  "node scripts/check-review-gates.mjs",
  "git diff --check",
  "## Future Deployment Execution Gate Requirements",
  "exact platform action or exact command",
  "post-deploy health verification command",
  "rollback owner",
  "incident triage owner",
  "maximum acceptable downtime before rollback",
  "A1 assignment from this runbook: `source_rights_evidence_intake_for_tWII_and_etf`",
  "A2 assignment from this runbook: `beta_phrase_set_and_shared_trust_surface_patch_scope`",
  "## PM Logging Requirements",
  "accepted / rejected / needs_bounded_repair / blocked result",
  "Beta launch readiness effect"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const requiredHardStops = [
  "production deployment",
  "Vercel production deployment",
  "deployment command execution",
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
  "Status: `beta_launch_preflight_packet_ready_not_deployed`",
  "PM selected route: `beta_release_runbook_draft_before_any_deploy`",
  "Any later remote/read/write/deploy step must have its own named gate"
]) {
  if (!preflight.includes(phrase)) problems.push(`${preflightPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`",
  "`ready_for_local_public_beta_preflight_not_production_deployed`"
]) {
  if (!publicBeta.includes(phrase)) problems.push(`${publicBetaPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `formal_launch_deployment_readiness_gate_ready_not_deployed`",
  "`ready_for_deployment_preflight_review_not_deployed`",
  "Required production proof after a future deployment attempt"
]) {
  if (!formalLaunch.includes(phrase)) problems.push(`${formalLaunchPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest Beta release runbook draft slice",
  "beta_release_runbook_draft_ready_before_any_deploy",
  "draft_beta_release_runbook_before_any_deploy",
  "future deployment execution gate"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/BETA_RELEASE_RUNBOOK_DRAFT.md` is `accepted` as PM mainline draft runbook before any deploy",
  "beta_release_runbook_draft_ready_before_any_deploy",
  "draft_beta_release_runbook_before_any_deploy",
  "future deployment execution gate"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

if (pkg.scripts?.["check:beta-release-runbook-draft"] !== "node scripts/check-beta-release-runbook-draft.mjs") {
  problems.push(`${packagePath} missing check:beta-release-runbook-draft script`);
}

for (const phrase of [
  "scripts/check-beta-release-runbook-draft.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-release-runbook-draft\"",
  "\"beta-release-runbook-draft\""
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
      guardedStatus: "beta_release_runbook_draft_ready_before_any_deploy",
      nextRoute: "future_deployment_execution_gate_after_target_decision",
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
