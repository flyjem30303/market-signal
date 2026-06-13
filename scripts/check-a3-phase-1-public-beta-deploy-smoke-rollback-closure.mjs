import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_DEPLOY_SMOKE_ROLLBACK_CLOSURE.md";
const releaseOpsPath = "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const releaseOps = read(releaseOpsPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "a3_phase_1_public_beta_deploy_smoke_rollback_closure_ready",
  "Required Inputs",
  "Pre-Deploy Minimum Proof",
  "Post-Deploy Smoke Sequence",
  "Public Claim Smoke",
  "Rollback Triggers",
  "Post-Rollback Verification",
  "Workstream Ownership",
  "Stop Lines",
  "CEO Recommendation",
  "prepare_phase_1_public_beta_operator_action_or_repair_result",
  "rollback_to_last_known_good_and_repair_before_reopen",
  "publicDataSource=mock",
  "scoreSource=mock",
  "publicDataSource=supabase",
  "scoreSource=real"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const status of [
  "a3_phase_1_public_beta_release_ops_index_ready",
  "a3_phase_1_public_beta_chairman_review_packet_ready",
  "a3_phase_1_public_beta_release_go_no_go_packet_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "status=ok"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing required input/status: ${status}`);
}

for (const route of [
  "/",
  "/briefing",
  "/stocks/TWII",
  "/stocks/2330",
  "/stocks/0050",
  "/methodology",
  "/disclaimer",
  "/terms",
  "/privacy",
  "/robots.txt",
  "/sitemap.xml"
]) {
  if (!doc.includes(`\`${route}\``)) problems.push(`${docPath} missing smoke route: ${route}`);
}

for (const claimGuard of [
  "no command snippets visible",
  "no local file paths visible",
  "no development residue visible",
  "no internal role labels visible",
  "no environment placeholders visible",
  "no secret values visible",
  "no raw payload language visible",
  "no database implementation language visible",
  "no live official market-data claim",
  "no complete-market-data claim",
  "no official endorsement claim",
  "no guaranteed-return claim",
  "no investment advice",
  "no buy/sell/hold recommendation"
]) {
  if (!doc.includes(claimGuard)) problems.push(`${docPath} missing claim guard: ${claimGuard}`);
}

for (const trigger of [
  "Any core public route returns 500 or persistent internal server error",
  "Home or briefing cannot communicate market status within the first viewport",
  "Public page exposes command snippets, local paths, env placeholders, secrets, raw payload language, or database implementation language",
  "Public page implies `publicDataSource=supabase`, `scoreSource=real`, live official market data, complete coverage, or official endorsement",
  "Public page gives personalized investment advice, guaranteed return, or buy/sell/hold recommendation",
  "Mobile viewport has blocking horizontal overflow or unreadable first-screen content",
  "Sitemap or robots exposes internal/private routes"
]) {
  if (!doc.includes(trigger)) problems.push(`${docPath} missing rollback trigger: ${trigger}`);
}

for (const lane of ["PM mainline", "A1", "A2", "A3", "A4"]) {
  if (!doc.includes(`| ${lane} |`)) problems.push(`${docPath} missing workstream lane: ${lane}`);
}

for (const command of [
  "cmd.exe /c npm run check:public-visible-language-quality",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "cmd.exe /c npm run check:a3-phase-1-metadata-and-public-route-smoke-checker",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-deploy-smoke-rollback-closure",
  "cmd.exe /c npm run check:review-gates"
]) {
  if (!doc.includes(command)) problems.push(`${docPath} missing command: ${command}`);
}

if (!releaseOps.includes("A3_PHASE_1_PUBLIC_BETA_DEPLOY_SMOKE_ROLLBACK_CLOSURE.md")) {
  problems.push(`${releaseOpsPath} missing deploy smoke rollback closure linkage`);
}

if (
  pkg.scripts?.["check:a3-phase-1-public-beta-deploy-smoke-rollback-closure"] !==
  "node scripts/check-a3-phase-1-public-beta-deploy-smoke-rollback-closure.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-public-beta-deploy-smoke-rollback-closure script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-public-beta-deploy-smoke-rollback-closure.mjs")) {
  problems.push(`${reviewGatePath} missing deploy smoke rollback closure checker`);
}

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "a3_phase_1_public_beta_deploy_smoke_rollback_closure_ready",
      phase: "Phase 1 public free index-lighting site",
      platformActionExecuted: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function forbiddenPatterns() {
  return [
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /SQL execution is approved/u,
    /Supabase writes are approved/u,
    /production deployment is approved/u,
    /production env mutation is approved/u,
    /raw market data fetch is approved/u,
    /publicDataSource\s*=\s*"supabase"/u,
    /scoreSource\s*=\s*"real"/u,
    /real-time official market data is provided/u,
    /official endorsement is provided/u,
    /guaranteed return is provided/u,
    /investment advice is provided/u,
    /buy\/sell recommendation is provided/u
  ];
}
