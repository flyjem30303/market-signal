import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-tw-equity-post-write-staging-verification-once.mjs";
const reviewPath = "docs/reviews/TW_EQUITY_POST_WRITE_STAGING_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md";
const thirdWriteReviewPath = "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const reportSource = read(reportPath);
const review = read(reviewPath);
const thirdWriteReview = read(thirdWriteReviewPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "CONFIRMATION_VALUE",
  "CEO_APPROVED_TW_EQUITY_POST_WRITE_STAGING_VERIFICATION_ONCE",
  "TW_EQUITY_POST_WRITE_STAGING_VERIFICATION",
  "TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md",
  "TW_EQUITY_POST_WRITE_STAGING_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md",
  "head: true",
  "count: \"exact\"",
  "rowPayloadsRead: false",
  "supabaseWriteAttempted: false",
  "stagingRowsCreated: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const forbiddenPattern of [
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /\.rpc\(/u,
  /insert into/u,
  /delete from/u,
  /update public\./u,
  /sb_secret_/u,
  /sb_publishable_/u
]) {
  if (forbiddenPattern.test(reportSource)) problems.push(`${reportPath} contains forbidden token: ${forbiddenPattern}`);
}

if (!thirdWriteReview.includes("tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion")) {
  problems.push(`${thirdWriteReviewPath} must contain accepted third write success status`);
}

for (const phrase of [
  "TW Equity Post-Write Staging Verification Post-Run Review",
  "tw_equity_post_write_staging_verification_counts_match_no_public_promotion",
  "Exactly one bounded post-write staging verification was attempted",
  "Verification uses `head: true` exact counts filtered by the accepted staging `run_id`",
  "No row payloads are read or printed",
  "Expected run rows: `1`",
  "Expected price rows: `180`",
  "`staging_twse_stock_day_runs`: countStatus=`ok`, count=`1`, expectedCount=`1`, matchedExpectedCount=`true`, errorCode=`none`",
  "`staging_twse_stock_day_prices`: countStatus=`ok`, count=`180`, expectedCount=`180`, matchedExpectedCount=`true`, errorCode=`none`",
  "This verification does not authorize `daily_prices` merge, public source promotion, row coverage points, or score-source promotion",
  "no SQL execution by PM",
  "no insert/update/upsert/delete operation",
  "no staging rows created by this verification",
  "no `daily_prices` mutation",
  "no market-data fetch or ingestion",
  "no row payloads read",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!review.includes(phrase)) problems.push(`${reviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity post-write staging verification slice",
  "docs/reviews/TW_EQUITY_POST_WRITE_STAGING_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md",
  "scripts/report-tw-equity-post-write-staging-verification-once.mjs",
  "scripts/check-tw-equity-post-write-staging-verification.mjs",
  "tw_equity_post_write_staging_verification_counts_match_no_public_promotion",
  "bounded readonly count verification confirms the staged `AUTH-003` run row count is `1` and price row count is `180`",
  "No SQL, write, `daily_prices` mutation, row payload read, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-post-write-staging-verification"] !==
  "node scripts/report-tw-equity-post-write-staging-verification-once.mjs"
) {
  problems.push("package.json missing report:tw-equity-post-write-staging-verification");
}

if (
  pkg.scripts?.["check:tw-equity-post-write-staging-verification"] !==
  "node scripts/check-tw-equity-post-write-staging-verification.mjs"
) {
  problems.push("package.json missing check:tw-equity-post-write-staging-verification");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-post-write-staging-verification.mjs")) {
    problems.push(`${pathName} missing TW equity post-write staging verification checker`);
  }
  if (!text.includes("tw-equity-post-write-staging-verification")) {
    problems.push(`${pathName} missing tw-equity-post-write-staging-verification name`);
  }
}

if (!reviewGate.includes('"tw-equity-post-write-staging-verification"')) {
  problems.push("review gate core set missing tw-equity-post-write-staging-verification");
}

const defaultReport = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (defaultReport.status !== 0) {
  problems.push(`${reportPath} must exit 0 without confirmation`);
} else {
  const report = parseJson(defaultReport.stdout);
  if (report.status !== "tw_equity_post_write_staging_verification_not_run_confirmation_required") {
    problems.push(`${reportPath} must default to confirmation-required not-run status`);
  }
  if (report.connectionAttempted !== false) problems.push(`${reportPath} default run must not connect`);
  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push(`${reportPath} default safety must remain mock`);
  }
}

for (const forbidden of [/NEXT_PUBLIC_SUPABASE_URL=/u, /SUPABASE_SERVICE_ROLE_KEY=/u, /sb_secret_/u, /sb_publishable_/u]) {
  if (review.match(forbidden)) problems.push(`${reviewPath} contains forbidden token: ${forbidden}`);
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
    problems.push("report output is not valid JSON");
    return {};
  }
}
