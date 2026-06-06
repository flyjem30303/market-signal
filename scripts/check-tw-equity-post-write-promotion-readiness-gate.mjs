import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_POST_WRITE_PROMOTION_READINESS_GATE.md";
const reportPath = "scripts/report-tw-equity-post-write-promotion-readiness-gate.mjs";
const postWriteReviewPath = "docs/reviews/TW_EQUITY_POST_WRITE_STAGING_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md";
const thirdWriteReviewPath = "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const postWriteReview = read(postWriteReviewPath);
const thirdWriteReview = read(thirdWriteReviewPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Post-Write Promotion Readiness Gate",
  "tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked",
  "The TW equity staging write closed loop is accepted for staging evidence only",
  "`AUTH-003` bounded staging write succeeded",
  "tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion",
  "tw_equity_post_write_staging_verification_counts_match_no_public_promotion",
  "Verified staging run rows: `1`",
  "Verified staging price rows: `180`",
  "| `daily_prices` merge | `blocked` |",
  "| Row coverage points | `blocked` |",
  "| Public data source | `blocked` |",
  "| `scoreSource=real` | `blocked` |",
  "Create staging-to-`daily_prices` merge design packet",
  "Do not mutate `daily_prices` from this gate",
  "Do not run SQL from this gate",
  "Do not insert/update/upsert/delete from this gate",
  "Do not fetch or ingest market data from this gate",
  "Do not award row coverage points from staging rows alone",
  "Do not set `publicDataSource=supabase`",
  "Do not set `scoreSource=real`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion",
  "\"writtenRunRows\": 1",
  "\"writtenPriceRows\": 180"
]) {
  if (!thirdWriteReview.includes(phrase)) problems.push(`${thirdWriteReviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_post_write_staging_verification_counts_match_no_public_promotion",
  "`staging_twse_stock_day_runs`: countStatus=`ok`, count=`1`",
  "`staging_twse_stock_day_prices`: countStatus=`ok`, count=`180`"
]) {
  if (!postWriteReview.includes(phrase)) problems.push(`${postWriteReviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_post_write_promotion_readiness_gate",
  "tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked",
  "staging_to_daily_prices_merge_design_packet",
  "daily_prices_merge",
  "row_coverage_points",
  "publicDataSource=supabase",
  "scoreSource=real",
  "dailyPricesMerge: \"blocked\"",
  "rowCoveragePoints: \"blocked\"",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "supabaseWriteAttempted: false",
  "sqlExecuted: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity post-write promotion readiness gate slice",
  "docs/TW_EQUITY_POST_WRITE_PROMOTION_READINESS_GATE.md",
  "scripts/report-tw-equity-post-write-promotion-readiness-gate.mjs",
  "scripts/check-tw-equity-post-write-promotion-readiness-gate.mjs",
  "tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked",
  "staging evidence is accepted after `AUTH-003` write and post-write count verification",
  "`daily_prices` merge, row coverage points, public source promotion, and `scoreSource=real` remain blocked",
  "next route is a staging-to-`daily_prices` merge design packet"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-post-write-promotion-readiness-gate"] !==
  "node scripts/report-tw-equity-post-write-promotion-readiness-gate.mjs"
) {
  problems.push("package.json missing report:tw-equity-post-write-promotion-readiness-gate");
}

if (
  pkg.scripts?.["check:tw-equity-post-write-promotion-readiness-gate"] !==
  "node scripts/check-tw-equity-post-write-promotion-readiness-gate.mjs"
) {
  problems.push("package.json missing check:tw-equity-post-write-promotion-readiness-gate");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-post-write-promotion-readiness-gate.mjs")) {
    problems.push(`${pathName} missing TW equity post-write promotion readiness gate checker`);
  }
  if (!text.includes("tw-equity-post-write-promotion-readiness-gate")) {
    problems.push(`${pathName} missing tw-equity-post-write-promotion-readiness-gate name`);
  }
}

if (!reviewGate.includes('"tw-equity-post-write-promotion-readiness-gate"')) {
  problems.push("review gate core set missing tw-equity-post-write-promotion-readiness-gate");
}

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (reportRun.status !== 0) {
  problems.push(`${reportPath} must exit 0`);
} else {
  const report = parseJson(reportRun.stdout);
  if (report.status !== "tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked") {
    problems.push("promotion readiness report status mismatch");
  }
  if (report.readinessMatrix?.stagingEvidence !== "accepted") problems.push("staging evidence must be accepted");
  for (const key of ["dailyPricesMerge", "rowCoveragePoints", "publicDataSource", "scoreSourceReal"]) {
    if (report.readinessMatrix?.[key] !== "blocked") problems.push(`${key} must remain blocked`);
  }
  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push("promotion readiness report must keep mock sources");
  }
  for (const key of [
    "dailyPricesMutated",
    "marketDataFetched",
    "marketDataIngested",
    "publicPromotionAllowed",
    "rowCoveragePointsAwarded",
    "scoreSourceRealAllowed",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseWriteAttempted"
  ]) {
    if (report.safety?.[key] !== false) problems.push(`safety.${key} must be false`);
  }
}

for (const [pathName, text] of [
  [docPath, doc],
  [reportPath, reportSource]
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
    problems.push("report output is not valid JSON");
    return {};
  }
}
