import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_THIRD_BOUNDED_STAGING_WRITE_DECISION.md";
const reportPath = "scripts/report-tw-equity-third-bounded-staging-write-decision.mjs";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const readonlyReviewPath = "docs/reviews/TW_EQUITY_POST_MIGRATION_READONLY_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md";
const openApiReviewPath = "docs/reviews/TW_EQUITY_POST_MIGRATION_OPENAPI_EXPOSURE_CONFIRMATION_POST_RUN_REVIEW_2026-06-07.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const runner = read(runnerPath);
const readonlyReview = read(readonlyReviewPath);
const openApiReview = read(openApiReviewPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Third Bounded Staging Write Decision",
  "tw_equity_third_bounded_staging_write_decision_ready_not_executed",
  "THIRD_WRITE_DECISION_AUTH_003_READY",
  "TW-EQUITY-STAGING-WRITE-2026-06-07-AUTH-003",
  "CEO_APPROVED_TW_EQUITY_THIRD_BOUNDED_STAGING_WRITE_ONCE",
  "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md",
  "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
  "no_retry_in_same_slice",
  "No SQL is authorized by this decision",
  "No `daily_prices` mutation is authorized",
  "`publicDataSource=mock` and `scoreSource=mock` must remain unchanged"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_post_migration_readonly_verification_tables_reachable_no_write",
  "staging_twse_stock_day_runs`: reachable=`ok`, countStatus=`ok`, count=`0`",
  "staging_twse_stock_day_prices`: reachable=`ok`, countStatus=`ok`, count=`0`"
]) {
  if (!readonlyReview.includes(phrase)) problems.push(`${readonlyReviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_post_migration_openapi_exposure_confirmation_schema_exposure_complete_write_path_ready_for_decision",
  "OpenAPI reachable: `true`",
  "OpenAPI parsed: `true`",
  "Problems: `none`",
  "`staging_twse_stock_day_runs`: exposed=`true`",
  "`staging_twse_stock_day_prices`: exposed=`true`"
]) {
  if (!openApiReview.includes(phrase)) problems.push(`${openApiReviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "TW-EQUITY-STAGING-WRITE-2026-06-07-AUTH-003",
  "CEO_APPROVED_TW_EQUITY_THIRD_BOUNDED_STAGING_WRITE_ONCE",
  "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md",
  "candidateAuthorizationIds"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const phrase of [
  "TW-EQUITY-STAGING-WRITE-2026-06-07-AUTH-003",
  "tw_equity_third_bounded_staging_write_decision_ready_not_executed",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "sqlAuthorized: false",
  "retryAllowedInSameSlice: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity third bounded staging write decision slice",
  "docs/TW_EQUITY_THIRD_BOUNDED_STAGING_WRITE_DECISION.md",
  "scripts/report-tw-equity-third-bounded-staging-write-decision.mjs",
  "scripts/check-tw-equity-third-bounded-staging-write-decision.mjs",
  "tw_equity_third_bounded_staging_write_decision_ready_not_executed",
  "runner now accepts the third `AUTH-003` command contract in local mock mode",
  "No real Supabase connection, SQL, real write, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-third-bounded-staging-write-decision"] !==
  "node scripts/report-tw-equity-third-bounded-staging-write-decision.mjs"
) {
  problems.push("package.json missing report:tw-equity-third-bounded-staging-write-decision");
}

if (
  pkg.scripts?.["check:tw-equity-third-bounded-staging-write-decision"] !==
  "node scripts/check-tw-equity-third-bounded-staging-write-decision.mjs"
) {
  problems.push("package.json missing check:tw-equity-third-bounded-staging-write-decision");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-third-bounded-staging-write-decision.mjs")) {
    problems.push(`${pathName} missing third bounded staging write decision checker`);
  }
  if (!text.includes("tw-equity-third-bounded-staging-write-decision")) {
    problems.push(`${pathName} missing tw-equity-third-bounded-staging-write-decision name`);
  }
}

if (!reviewGate.includes('"tw-equity-third-bounded-staging-write-decision"')) {
  problems.push("review gate core set missing tw-equity-third-bounded-staging-write-decision");
}

const reportResult = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (reportResult.status !== 0) {
  problems.push(`${reportPath} must exit 0`);
} else {
  const report = parseJson(reportResult.stdout);
  if (report.status !== "tw_equity_third_bounded_staging_write_decision_ready_not_executed") {
    problems.push("third write decision report status mismatch");
  }
  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push("third write decision report must keep mock sources");
  }
  if (report.safety?.sqlAuthorized !== false || report.safety?.retryAllowedInSameSlice !== false) {
    problems.push("third write decision report safety flags mismatch");
  }
}

const mockResult = spawnSync(
  process.execPath,
  [
    runnerPath,
    "--authorization-id",
    "TW-EQUITY-STAGING-WRITE-2026-06-07-AUTH-003",
    "--lane",
    "tw-equity",
    "--symbols",
    "2330,2382,2308",
    "--sessions",
    "60",
    "--target",
    "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
    "--max-rows",
    "180",
    "--post-run-review",
    "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md",
    "--candidate-input",
    "data/candidates/tw-equity-staging-candidate.json",
    "--rollback-dry-run",
    "--execute"
  ],
  {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      TW_EQUITY_STAGING_WRITE_CONFIRMATION: "CEO_APPROVED_TW_EQUITY_THIRD_BOUNDED_STAGING_WRITE_ONCE",
      TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE: "enabled"
    },
    shell: false
  }
);

if (mockResult.status !== 0) {
  problems.push(`${runnerPath} AUTH-003 mock execution must exit 0`);
} else {
  const report = parseJson(mockResult.stdout);
  if (report.authorizationId !== "TW-EQUITY-STAGING-WRITE-2026-06-07-AUTH-003") problems.push("AUTH-003 report authorization mismatch");
  if (report.exactCommandMatched !== true) problems.push("AUTH-003 exact command must match");
  if (report.confirmationPresent !== true) problems.push("AUTH-003 confirmation must be present");
  if (report.candidateInputAccepted !== true) problems.push("AUTH-003 must accept candidate artifact");
  if (report.candidateInputPriceRows !== 180) problems.push("AUTH-003 candidate price rows must be 180");
  if (report.connectionAttempted !== false) problems.push("AUTH-003 mock must not connect remotely");
  if (report.mockSupabaseUsed !== true) problems.push("AUTH-003 must use mock Supabase");
  if (report.writeAttempted !== true) problems.push("AUTH-003 mock must enter write path");
  if (report.writtenRunRows !== 1 || report.writtenPriceRows !== 180) problems.push("AUTH-003 mock written row counts must match candidate");
  if (report.postRunReview !== "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md") {
    problems.push("AUTH-003 post-run review path mismatch");
  }
  if (report.publicDataSource !== "mock" || report.scoreSource !== "mock") problems.push("AUTH-003 must keep mock sources");
  if (report.sqlExecuted !== false || report.secretsPrinted !== false || report.rowPayloadsPrinted !== false) {
    problems.push("AUTH-003 must keep sanitized safety flags false");
  }
}

for (const [pathName, text] of [
  [docPath, doc],
  [reportPath, reportSource],
  [runnerPath, runner]
]) {
  if (/sb_secret_/u.test(text) || /sb_publishable_/u.test(text)) {
    problems.push(`${pathName} must not contain literal Supabase key material`);
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push("JSON output is not valid");
    return {};
  }
}
