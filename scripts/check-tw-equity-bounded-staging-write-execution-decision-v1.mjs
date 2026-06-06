import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_BOUNDED_STAGING_WRITE_EXECUTION_DECISION_V1.md";
const readinessPath = "docs/TW_EQUITY_STAGING_WRITE_AUTHORIZATION_READINESS_V2.md";
const outcomePath = "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";

const doc = read(docPath);
const readiness = read(readinessPath);
const outcomes = JSON.parse(read(outcomePath));
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

const expectedClassifications = new Map([
  ["permitted-use", "accepted_for_derived_metrics_only"],
  ["attribution", "accepted_for_delayed_public_display"],
  ["delay-incompleteness-public-display", "accepted_for_delayed_public_display"],
  ["derived-score-use", "accepted_for_derived_metrics_only"],
  ["retention", "accepted_for_internal_only"],
  ["redistribution", "unknown_keep_blocked"],
  ["rate-limit-and-outage", "accepted_for_internal_only"]
]);

for (const [id, classification] of expectedClassifications.entries()) {
  const item = outcomes.outcomes?.find((candidate) => candidate.id === id);
  if (!item) {
    problems.push(`${outcomePath} missing outcome: ${id}`);
  } else if (item.classification !== classification) {
    problems.push(`${outcomePath} ${id} expected ${classification} but got ${String(item.classification)}`);
  }
}

for (const phrase of [
  "TW Equity Bounded Staging Write Execution Decision V1",
  "tw_equity_bounded_staging_write_execution_decision_v1_ready_not_executed",
  "inherits `docs/TW_EQUITY_STAGING_WRITE_AUTHORIZATION_READINESS_V2.md`",
  "bounded staging write authorization packet v2 execution decision",
  "`permitted-use` | `accepted_for_derived_metrics_only`",
  "`attribution` | `accepted_for_delayed_public_display`",
  "`delay-incompleteness-public-display` | `accepted_for_delayed_public_display`",
  "`derived-score-use` | `accepted_for_derived_metrics_only`",
  "`retention` | `accepted_for_internal_only`",
  "`redistribution` | `unknown_keep_blocked`",
  "`rate-limit-and-outage` | `accepted_for_internal_only`",
  "`redistribution=unknown_keep_blocked` remains binding",
  "Public redistribution, download, export, API reuse, downstream copies",
  "internal-only staging write may proceed to the next authorization-design stage",
  "The actual bounded staging write remains a separate next GOAL",
  "authorization id",
  "exact command",
  "lane: `tw-equity`",
  "symbols: `2330`, `2382`, `2308`",
  "sessions: `60`",
  "target relation: `tw_equity_daily_prices_staging`",
  "max rows: `180`",
  "source classification reference: `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json`",
  "service-role posture",
  "RLS posture",
  "rollback owner",
  "rollback dry-run posture",
  "retention window",
  "post-run review artifact: `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_<DATE>.md`",
  "no retry",
  "no public redistribution",
  "no public promotion",
  "no row coverage points",
  "no score-source promotion",
  "node scripts/run-tw-equity-staging-write-once.mjs"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

if (!readiness.includes("tw_equity_staging_write_authorization_readiness_v2_complete_not_executable")) {
  problems.push(`${readinessPath} missing v2 complete status`);
}

for (const phrase of [
  "Latest TW equity bounded staging write execution decision v1 slice",
  "docs/TW_EQUITY_BOUNDED_STAGING_WRITE_EXECUTION_DECISION_V1.md",
  "tw_equity_bounded_staging_write_execution_decision_v1_ready_not_executed",
  "inherits TW_EQUITY_STAGING_WRITE_AUTHORIZATION_READINESS_V2",
  "redistribution remains unknown_keep_blocked",
  "internal-only staging write may proceed to the next authorization-design stage",
  "later execution GOAL may create a fail-closed runner skeleton",
  "actual bounded staging write remains a separate next GOAL"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-bounded-staging-write-execution-decision-v1"] !==
  "node scripts/check-tw-equity-bounded-staging-write-execution-decision-v1.mjs"
) {
  problems.push("package.json missing check:tw-equity-bounded-staging-write-execution-decision-v1");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-bounded-staging-write-execution-decision-v1.mjs")) {
    problems.push(`${path} missing bounded staging write execution decision checker`);
  }
  if (!text.includes("tw-equity-bounded-staging-write-execution-decision-v1")) {
    problems.push(`${path} missing tw-equity-bounded-staging-write-execution-decision-v1 name`);
  }
}

if (!reviewGate.includes('"tw-equity-bounded-staging-write-execution-decision-v1"')) {
  problems.push("review gate core set missing tw-equity-bounded-staging-write-execution-decision-v1");
}

if (!fs.existsSync(runnerPath)) {
  problems.push(`${runnerPath} should exist as the later fail-closed runner skeleton`);
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
  /\bwriteFile/u,
  /\bappendFile/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /staging rows are approved/u,
  /daily_prices mutation is approved/u,
  /market-data fetch is approved/u,
  /market-data ingestion is approved/u,
  /publicDataSource=supabase approved/u,
  /scoreSource=real approved/u,
  /ROW_COVERAGE_POINTS_AWARDED/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
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
