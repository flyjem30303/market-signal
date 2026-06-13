import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_RECORD.md";
const summaryPath = "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_REVIEW_SUMMARY_FOR_CHAIRMAN.md";
const manualPath = "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md";
const postPlatformPath = "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md";
const keepOpenPath = "docs/PHASE_1_PUBLIC_BETA_KEEP_OPEN_OR_REPAIR_DECISION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const summary = read(summaryPath);
const manual = read(manualPath);
const postPlatform = read(postPlatformPath);
const keepOpen = read(keepOpenPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  "a3_phase_1_public_beta_chairman_operator_decision_record_ready",
  "Source Review",
  "Decision Record Template",
  "Decision Rules",
  "Accepted Deferrals",
  "Hard Stop Lines",
  "Operator Handoff After Accepted Decision",
  "operator_follows_phase_1_public_beta_manual_platform_action_checklist_or_pm_repairs_blocker",
  "publicDataSource",
  "scoreSource",
  "publicDataSource=supabase",
  "scoreSource=real"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const status of [
  "a3_phase_1_public_beta_release_review_summary_for_chairman_ready",
  "a3_phase_1_public_beta_release_ops_index_ready",
  "a3_phase_1_public_beta_chairman_review_packet_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "phase_1_public_beta_public_visible_residue_cleanup_ready_mock_only",
  "phase_1_public_beta_keep_open_or_repair_decision_ready_mock_only"
]) {
  if (!doc.includes(status)) problems.push(`${docPath} missing source status: ${status}`);
}

for (const field of [
  "decisionId",
  "decisionTimestamp",
  "decisionOwner",
  "decision",
  "acceptedDeferrals",
  "hardBlockers",
  "operatorActionAllowed",
  "operatorActionRoute",
  "publicDataSource",
  "scoreSource"
]) {
  if (!doc.includes(`\`${field}\``)) problems.push(`${docPath} missing decision field: ${field}`);
}

for (const decision of ["`GO`", "`GO_WITH_DEFERRALS`", "`NO_GO`"]) {
  if (!doc.includes(decision)) problems.push(`${docPath} missing decision option: ${decision}`);
}

for (const route of [
  "prepare_phase_1_public_beta_manual_platform_action_checklist",
  "repair_phase_1_public_beta_release_blocker"
]) {
  if (!doc.includes(route)) problems.push(`${docPath} missing decision route: ${route}`);
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
  "production deploy by itself",
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

for (const handoff of [
  "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md",
  "docs/PHASE_1_PUBLIC_BETA_KEEP_OPEN_OR_REPAIR_DECISION.md"
]) {
  if (!doc.includes(handoff)) problems.push(`${docPath} missing handoff artifact: ${handoff}`);
}

if (!summary.includes("chairman_or_operator_reviews_phase_1_public_beta_release_summary")) {
  problems.push(`${summaryPath} missing decision record route linkage`);
}

if (!manual.includes("public visible residue cleanup passed")) {
  problems.push(`${manualPath} missing public residue pre-platform condition`);
}

if (!postPlatform.includes("no development residue visible")) {
  problems.push(`${postPlatformPath} missing post-platform development residue claim guard`);
}

if (!keepOpen.includes("development residue harms public trust")) {
  problems.push(`${keepOpenPath} missing public trust residue rollback condition`);
}

if (
  pkg.scripts?.["check:a3-phase-1-public-beta-chairman-operator-decision-record"] !==
  "node scripts/check-a3-phase-1-public-beta-chairman-operator-decision-record.mjs"
) {
  problems.push(`${packagePath} missing check:a3-phase-1-public-beta-chairman-operator-decision-record script`);
}

if (!reviewGate.includes("scripts/check-a3-phase-1-public-beta-chairman-operator-decision-record.mjs")) {
  problems.push(`${reviewGatePath} missing chairman operator decision checker`);
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
      guardedStatus: "a3_phase_1_public_beta_chairman_operator_decision_record_ready",
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
