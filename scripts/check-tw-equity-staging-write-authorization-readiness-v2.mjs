import fs from "node:fs";

const problems = [];

const docPath = "docs/TW_EQUITY_STAGING_WRITE_AUTHORIZATION_READINESS_V2.md";
const outcomePath = "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const doc = read(docPath);
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
    continue;
  }
  if (item.classification !== classification) {
    problems.push(`${outcomePath} ${id} expected ${classification} but got ${String(item.classification)}`);
  }
}

for (const phrase of [
  "TW Equity Staging Write Authorization Readiness V2",
  "tw_equity_staging_write_authorization_readiness_v2_complete_not_executable",
  "does not authorize execution",
  "does not create a write runner",
  "data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json",
  "scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "`permitted-use` | `accepted_for_derived_metrics_only`",
  "`attribution` | `accepted_for_delayed_public_display`",
  "`delay-incompleteness-public-display` | `accepted_for_delayed_public_display`",
  "`derived-score-use` | `accepted_for_derived_metrics_only`",
  "`retention` | `accepted_for_internal_only`",
  "`redistribution` | `unknown_keep_blocked`",
  "`rate-limit-and-outage` | `accepted_for_internal_only`",
  "public redistribution",
  "download",
  "export",
  "API reuse",
  "downstream copies",
  "internal-only staging write preparation is allowed as a local readiness path",
  "target relation proposal as `tw_equity_daily_prices_staging`",
  "symbols as `2330`, `2382`, and `2308`",
  "bounded session count as `60` and max rows as `180`",
  "creating `scripts/run-tw-equity-staging-write-once.mjs`",
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
  "retention window",
  "post-run review artifact: `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_<DATE>.md`",
  "no retry without a new approval",
  "no public redistribution",
  "no public source promotion by itself",
  "no row coverage points by itself",
  "no score-source promotion by itself",
  "node scripts/run-tw-equity-staging-write-once.mjs",
  "does not exist yet and must not be created or executed by this V2 packet",
  "node scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs",
  "node scripts/check-tw-equity-source-review-readiness-summary.mjs",
  "node scripts/check-tw-equity-staging-first-preflight-runner.mjs",
  "node scripts/check-tw-equity-staging-first-write-authorization-packet-v1.mjs",
  "node scripts/check-tw-equity-staging-first-write-post-run-review-template-v1.mjs",
  "node scripts/check-review-gates.mjs",
  "bounded staging write authorization packet v2 execution decision",
  "stop before runner creation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity staging write authorization readiness v2 slice",
  "docs/TW_EQUITY_STAGING_WRITE_AUTHORIZATION_READINESS_V2.md",
  "tw_equity_staging_write_authorization_readiness_v2_complete_not_executable",
  "7 source/legal classification results",
  "redistribution remains unknown_keep_blocked",
  "internal-only staging write preparation is allowed",
  "authorization id",
  "exact command",
  "service-role posture",
  "RLS posture",
  "post-run review artifact",
  "does not create the future write runner"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-staging-write-authorization-readiness-v2"] !==
  "node scripts/check-tw-equity-staging-write-authorization-readiness-v2.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-write-authorization-readiness-v2");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-write-authorization-readiness-v2.mjs")) {
    problems.push(`${path} missing TW equity staging write authorization readiness v2 checker`);
  }
  if (!text.includes("tw-equity-staging-write-authorization-readiness-v2")) {
    problems.push(`${path} missing tw-equity-staging-write-authorization-readiness-v2 name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-write-authorization-readiness-v2"')) {
  problems.push("review gate core set missing tw-equity-staging-write-authorization-readiness-v2");
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
