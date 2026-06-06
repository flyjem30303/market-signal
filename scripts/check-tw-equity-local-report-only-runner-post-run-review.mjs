import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reviewPath = "docs/reviews/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_POST_RUN_REVIEW_2026-06-06.md";
const runnerPath = "scripts/report-tw-equity-local-report-only-dry-run.mjs";
const runnerCheckerPath = "scripts/check-tw-equity-local-report-only-runner.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const review = read(reviewPath);
const runner = read(runnerPath);
const runnerChecker = read(runnerCheckerPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

const requiredReviewPhrases = [
  "TW Equity Local Report-Only Runner Post-Run Review",
  "tw_equity_local_report_only_runner_post_run_review_accepted_local_only",
  "node scripts/report-tw-equity-local-report-only-dry-run.mjs",
  "scripts/report-tw-equity-local-report-only-dry-run.mjs",
  "scripts/check-tw-equity-local-report-only-runner.mjs",
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_IMPLEMENTATION_GATE.md",
  "docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md",
  "docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md",
  "docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md",
  "Execution type: local stdout-only sample reporter",
  "Execution count: `1`",
  "Status: `blocked_until_source_approval`",
  "Lane id: `tw-equity`",
  "Symbols: `2330`, `2382`, `2308`",
  "Expected trading sessions: `60`",
  "Expected rows: `180`",
  "Latest observed rows: `3`",
  "Latest missing rows: `177`",
  "Source-rights status: `not_source_approved`",
  "Provider terms status: `external_provider_terms_pending`",
  "Redistribution status: `not_approved`",
  "Retention status: `not_approved`",
  "Target table posture: `staging_first`",
  "Production `daily_prices` blocked: `true`",
  "Validation status: `local_packet_consistency_only`",
  "`filesWritten`: `false`",
  "`mutations`: `false`",
  "`sqlExecuted`: `false`",
  "`supabaseConnectionAttempted`: `false`",
  "`supabaseWrites`: `false`",
  "`marketFetchAttempted`: `false`",
  "`marketIngestionAttempted`: `false`",
  "`secretsPrinted`: `false`",
  "`sourcePayloadsPrinted`: `false`",
  "`sourceDerivedRowsStored`: `false`",
  "`publicDataSource`: `mock`",
  "`scoreSource`: `mock`",
  "`problems`: empty array",
  "Accepted for local evidence only",
  "does not approve source use",
  "does not approve source use, provider terms, redistribution, retention, market-data retrieval, ingestion, Supabase connection, SQL, staging rows, production `daily_prices` mutation, public source promotion, row coverage points, or `scoreSource=real`"
];

for (const phrase of requiredReviewPhrases) {
  if (!review.includes(phrase)) problems.push(`${reviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "blocked_until_source_approval",
  "local_packet_consistency_only",
  "supabaseConnectionAttempted: false",
  "marketFetchAttempted: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

if (!runnerChecker.includes("spawnSync(process.execPath, [scriptPath]")) {
  problems.push(`${runnerCheckerPath} must execute the runner`);
}

const requiredStatusPhrases = [
  "Latest TW equity local report-only runner post-run review slice",
  "docs/reviews/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_POST_RUN_REVIEW_2026-06-06.md",
  "tw_equity_local_report_only_runner_post_run_review_accepted_local_only",
  "accepted for local evidence only",
  "blocked_until_source_approval",
  "local_packet_consistency_only"
];

for (const phrase of requiredStatusPhrases) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-local-report-only-runner-post-run-review"] !==
  "node scripts/check-tw-equity-local-report-only-runner-post-run-review.mjs"
) {
  problems.push("package.json missing check:tw-equity-local-report-only-runner-post-run-review script");
}

for (const [path, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-local-report-only-runner-post-run-review.mjs")) {
    problems.push(`${path} missing tw equity local runner post-run review checker`);
  }
  if (!text.includes("tw-equity-local-report-only-runner-post-run-review")) {
    problems.push(`${path} missing tw-equity-local-report-only-runner-post-run-review name`);
  }
}

if (!reviewGate.includes('"tw-equity-local-report-only-runner-post-run-review"')) {
  problems.push("review gate core set missing tw-equity-local-report-only-runner-post-run-review");
}

const result = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (result.status !== 0) {
  problems.push(`${runnerPath} exited with ${result.status}: ${(result.stderr || result.stdout).trim()}`);
} else {
  try {
    validateReport(JSON.parse(result.stdout));
  } catch (error) {
    problems.push(`${runnerPath} did not print valid JSON: ${error.message}`);
  }
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
  if (pattern.test(review)) problems.push(`${reviewPath} contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function validateReport(report) {
  const expected = {
    status: "blocked_until_source_approval",
    laneId: "tw-equity",
    expectedTradingSessions: 60,
    expectedRows: 180,
    latestObservedRows: 3,
    latestMissingRows: 177,
    sourceRightsStatus: "not_source_approved",
    providerTermsStatus: "external_provider_terms_pending",
    redistributionStatus: "not_approved",
    retentionStatus: "not_approved",
    targetTablePosture: "staging_first",
    productionDailyPricesBlocked: true,
    validationStatus: "local_packet_consistency_only",
    filesWritten: false,
    mutations: false,
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseWrites: false,
    marketFetchAttempted: false,
    marketIngestionAttempted: false,
    secretsPrinted: false,
    sourcePayloadsPrinted: false,
    sourceDerivedRowsStored: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  };

  for (const [key, value] of Object.entries(expected)) {
    if (report[key] !== value) problems.push(`report ${key} mismatch`);
  }

  if (JSON.stringify(report.symbols) !== JSON.stringify(["2330", "2382", "2308"])) {
    problems.push("report symbols mismatch");
  }

  if (!Array.isArray(report.problems) || report.problems.length !== 0) {
    problems.push("report problems must be empty array");
  }
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing file: ${path}`);
    return "";
  }

  return fs.readFileSync(path, "utf8");
}
