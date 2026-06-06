import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_SOURCE_APPROVAL_DECISION_PACKET.md";
const postRunPath = "docs/reviews/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_POST_RUN_REVIEW_2026-06-06.md";
const sourceRightsPath = "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md";
const runnerPath = "scripts/report-tw-equity-local-report-only-dry-run.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const postRun = read(postRunPath);
const sourceRights = read(sourceRightsPath);
const runner = read(runnerPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

const requiredDocPhrases = [
  "TW Equity Source-Approval Decision Packet",
  "tw_equity_source_approval_decision_packet_ready_for_review_not_approved",
  "docs/reviews/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_POST_RUN_REVIEW_2026-06-06.md",
  "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md",
  "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md",
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md",
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_IMPLEMENTATION_GATE.md",
  "scripts/report-tw-equity-local-report-only-dry-run.mjs",
  "scripts/check-tw-equity-local-report-only-runner.mjs",
  "`2330`",
  "`2382`",
  "`2308`",
  "blocked_until_source_approval",
  "local_packet_consistency_only",
  "not_source_approved",
  "external_provider_terms_pending",
  "not_approved",
  "publicDataSource mock",
  "scoreSource mock",
  "Option A: Enter Source-Approval Review",
  "Recommended",
  "Option B: Keep Source Approval Deferred",
  "Option C: Reject TW Equity Source Lane For Now",
  "CEO recommends Option A",
  "provider-specific terms review material",
  "source candidate identity",
  "terms review owner",
  "permitted-use question",
  "attribution question",
  "redistribution question",
  "retention question",
  "rate-limit question",
  "outage handling question",
  "delay and incompleteness question",
  "public display question",
  "derived-score use question",
  "no-execution stop lines",
  "This packet does not approve",
  "source use",
  "provider terms",
  "redistribution",
  "retention",
  "public display",
  "derived-score use",
  "SQL",
  "Supabase connection",
  "Supabase writes",
  "staging rows",
  "production `daily_prices` mutation",
  "TWSE source retrieval",
  "market-data ingestion",
  "source-derived row storage",
  "public source promotion",
  "row coverage points",
  "`scoreSource=real`"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [path, text, phrases] of [
  [postRunPath, postRun, ["tw_equity_local_report_only_runner_post_run_review_accepted_local_only", "blocked_until_source_approval"]],
  [sourceRightsPath, sourceRights, ["tw_equity_source_rights_packet_ready_local_review_not_source_approved", "external provider terms pending"]],
  [runnerPath, runner, ["blocked_until_source_approval", "local_packet_consistency_only", "publicDataSource: \"mock\"", "scoreSource: \"mock\""]]
]) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
  }
}

const requiredStatusPhrases = [
  "Latest TW equity source-approval decision packet slice",
  "docs/TW_EQUITY_SOURCE_APPROVAL_DECISION_PACKET.md",
  "tw_equity_source_approval_decision_packet_ready_for_review_not_approved",
  "CEO recommends Option A",
  "enter source-approval review",
  "not source approved"
];

for (const phrase of requiredStatusPhrases) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-source-approval-decision-packet"] !==
  "node scripts/check-tw-equity-source-approval-decision-packet.mjs"
) {
  problems.push("package.json missing check:tw-equity-source-approval-decision-packet script");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-source-approval-decision-packet.mjs")) {
    problems.push(`${path} missing tw equity source approval decision packet checker`);
  }
  if (!text.includes("tw-equity-source-approval-decision-packet")) {
    problems.push(`${path} missing tw-equity-source-approval-decision-packet name`);
  }
}

if (!reviewGate.includes('"tw-equity-source-approval-decision-packet"')) {
  problems.push("review gate core set missing tw-equity-source-approval-decision-packet");
}

const forbiddenPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /\bfetch\s*\(/u,
  /source approval is complete/u,
  /source is approved/u,
  /provider terms approved/u,
  /redistribution approved/u,
  /retention approved/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /market ingestion is approved/u,
  /TWSE fetch is approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u,
  /raw payload/iu
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
