import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_REVIEW_SUMMARY_FOR_CHAIRMAN.md";
const releaseOpsPath = "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md";
const keepOpenPath = "docs/PHASE_1_PUBLIC_BETA_KEEP_OPEN_OR_REPAIR_DECISION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const releaseOps = read(releaseOpsPath);
const keepOpen = read(keepOpenPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "a3_phase_1_public_beta_release_review_summary_for_chairman_ready",
  "GO_WITH_DEFERRALS_TO_OPERATOR_REVIEW",
  "Phase 1 is the public free index-lighting site",
  "Phase 2 membership remains planned but non-blocking",
  "Phase Decision",
  "What Is Ready",
  "What Still Requires Operator Action",
  "Accepted Deferrals",
  "Hard Stop Lines",
  "Chairman Decision Options",
  "chairman_or_operator_reviews_phase_1_public_beta_release_summary",
  "publicDataSource=mock",
  "scoreSource=mock",
  "publicDataSource=supabase",
  "scoreSource=real"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const evidence of [
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "a3_phase_1_public_beta_release_ops_index_ready",
  "a3_phase_1_public_beta_chairman_review_packet_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "phase_1_public_beta_keep_open_or_repair_decision_ready_mock_only"
]) {
  if (!doc.includes(evidence)) problems.push(`${docPath} missing evidence: ${evidence}`);
}

for (const decision of ["`GO`", "`GO_WITH_DEFERRALS`", "`NO_GO`"]) {
  if (!doc.includes(decision)) problems.push(`${docPath} missing chairman decision: ${decision}`);
}

for (const deferral of [
  "Phase 2 member registration and login",
  "Phase 2 member-only daily three-layer interpretation",
  "Phase 2 watchlist persistence",
  "Phase 2 custom alert execution",
  "Phase 2 post-market review archive",
  "real-data promotion",
  "full Taiwan all-listed-equity coverage",
  "global market expansion"
]) {
  if (!doc.includes(deferral)) problems.push(`${docPath} missing deferral: ${deferral}`);
}

for (const stopLine of [
  "SQL execution",
  "Supabase read/write",
  "staging-row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "secret or raw payload output",
  "live official market-data claim",
  "personalized investment advice",
  "Phase 2 membership implementation as a Phase 1 requirement"
]) {
  if (!doc.includes(stopLine)) problems.push(`${docPath} missing stop line: ${stopLine}`);
}

if (!releaseOps.includes("prepare_phase_1_public_beta_release_review_summary_for_chairman")) {
  problems.push(`${releaseOpsPath} missing chairman summary route linkage`);
}

if (!keepOpen.includes("public visible residue cleanup passes")) {
  problems.push(`${keepOpenPath} missing public residue keep-open condition`);
}

if (
  pkg.scripts?.["check:a3-phase-1-public-beta-release-review-summary-for-chairman"] !==
  "node scripts/check-a3-phase-1-public-beta-release-review-summary-for-chairman.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-public-beta-release-review-summary-for-chairman script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-public-beta-release-review-summary-for-chairman.mjs")) {
  problems.push(`${reviewGatePath} missing release review summary checker`);
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
      guardedStatus: "a3_phase_1_public_beta_release_review_summary_for_chairman_ready",
      recommendation: "GO_WITH_DEFERRALS_TO_OPERATOR_REVIEW",
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
