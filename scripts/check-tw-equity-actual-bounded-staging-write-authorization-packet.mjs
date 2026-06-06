import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_ACTUAL_BOUNDED_STAGING_WRITE_AUTHORIZATION_PACKET.md";
const decisionPath = "docs/TW_EQUITY_BOUNDED_STAGING_WRITE_EXECUTION_DECISION_V1.md";
const designPath = "docs/TW_EQUITY_WRITE_RUNNER_FAIL_CLOSED_DESIGN.md";
const outcomePath = "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";

const doc = read(docPath);
const decision = read(decisionPath);
const design = read(designPath);
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
  "TW Equity Actual Bounded Staging Write Authorization Packet",
  "tw_equity_actual_bounded_staging_write_authorization_packet_ready_not_executed",
  "docs/TW_EQUITY_BOUNDED_STAGING_WRITE_EXECUTION_DECISION_V1.md",
  "docs/TW_EQUITY_WRITE_RUNNER_FAIL_CLOSED_DESIGN.md",
  "authorization id | `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001`",
  "node scripts/run-tw-equity-staging-write-once.mjs --authorization-id",
  "--lane \"tw-equity\"",
  "--symbols \"2330,2382,2308\"",
  "--sessions 60",
  "--target \"tw_equity_daily_prices_staging\"",
  "--max-rows 180",
  "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md",
  "lane | `tw-equity`",
  "symbols | `2330`, `2382`, `2308`",
  "sessions | `60`",
  "target relation | `tw_equity_daily_prices_staging`",
  "max rows | `180`",
  "source classification reference | `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json`",
  "service-role posture | `required_for_future_execution_but_not_loaded_or_printed_by_this_packet`",
  "RLS posture | `staging_relation_write_requires_explicit_service_role_or_policy_review`",
  "rollback owner | `PM`",
  "rollback dry-run posture | `required_before_actual_execution_not_run_by_this_packet`",
  "retention window | `internal_staging_validation_window_7_days_then_review_or_purge`",
  "no retry | `true`",
  "no public redistribution | `true`",
  "no public promotion | `true`",
  "no row coverage points | `true`",
  "no score-source promotion | `true`",
  "`permitted-use` | `accepted_for_derived_metrics_only`",
  "`attribution` | `accepted_for_delayed_public_display`",
  "`delay-incompleteness-public-display` | `accepted_for_delayed_public_display`",
  "`derived-score-use` | `accepted_for_derived_metrics_only`",
  "`retention` | `accepted_for_internal_only`",
  "`redistribution` | `unknown_keep_blocked`",
  "`rate-limit-and-outage` | `accepted_for_internal_only`",
  "`redistribution=unknown_keep_blocked` remains active",
  "Public redistribution, download, export, API reuse, downstream copies",
  "ready for a one-attempt bounded staging write execution gate",
  "the current GOAL does not execute the write",
  "fail-closed runner skeleton",
  "refuses execution while target relation reconciliation is blocked",
  "This packet makes the project ready to decide on one actual bounded staging write execution"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [path, text, phrase] of [
  [decisionPath, decision, "tw_equity_bounded_staging_write_execution_decision_v1_ready_not_executed"],
  [designPath, design, "tw_equity_write_runner_fail_closed_design_ready_no_runner_created"]
]) {
  if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity actual bounded staging write authorization packet slice",
  "docs/TW_EQUITY_ACTUAL_BOUNDED_STAGING_WRITE_AUTHORIZATION_PACKET.md",
  "tw_equity_actual_bounded_staging_write_authorization_packet_ready_not_executed",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  "one-attempt bounded staging write execution gate",
  "does not execute the write"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-actual-bounded-staging-write-authorization-packet"] !==
  "node scripts/check-tw-equity-actual-bounded-staging-write-authorization-packet.mjs"
) {
  problems.push("package.json missing check:tw-equity-actual-bounded-staging-write-authorization-packet");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-actual-bounded-staging-write-authorization-packet.mjs")) {
    problems.push(`${path} missing actual bounded staging write authorization packet checker`);
  }
  if (!text.includes("tw-equity-actual-bounded-staging-write-authorization-packet")) {
    problems.push(`${path} missing tw-equity-actual-bounded-staging-write-authorization-packet name`);
  }
}

if (!reviewGate.includes('"tw-equity-actual-bounded-staging-write-authorization-packet"')) {
  problems.push("review gate core set missing tw-equity-actual-bounded-staging-write-authorization-packet");
}

if (!fs.existsSync(runnerPath)) {
  problems.push(`${runnerPath} must exist as fail-closed runner skeleton in this execution GOAL`);
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
