import fs from "node:fs";

const problems = [];

const reviewPath = "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const review = read(reviewPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Staging Third Write Post-Run Review",
  "tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion",
  "TW-EQUITY-STAGING-WRITE-2026-06-07-AUTH-003",
  "CEO_APPROVED_TW_EQUITY_THIRD_BOUNDED_STAGING_WRITE_ONCE",
  "Execution count: `1`",
  "Retry count in this slice: `0`",
  "Exit code: `0`",
  "\"candidateInputAccepted\": true",
  "\"candidateInputRunRows\": 1",
  "\"candidateInputPriceRows\": 180",
  "\"connectionAttempted\": true",
  "\"exactCommandMatched\": true",
  "\"mockSupabaseUsed\": false",
  "\"mutations\": true",
  "\"problems\": []",
  "\"rollbackDryRunRemoteRunRows\": 0",
  "\"rollbackDryRunRemotePriceRows\": 0",
  "\"status\": \"ok\"",
  "\"writeAttempted\": true",
  "\"writtenRunRows\": 1",
  "\"writtenPriceRows\": 180",
  "\"publicDataSource\": \"mock\"",
  "\"scoreSource\": \"mock\"",
  "\"sqlExecuted\": false",
  "\"secretsPrinted\": false",
  "\"rowPayloadsPrinted\": false",
  "Staging rows were created only in `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices`",
  "No SQL was executed by PM",
  "No `daily_prices` mutation occurred",
  "No market-data fetch or ingestion occurred in this slice",
  "No raw market payloads, row payloads, source URL payloads, or secrets were printed",
  "No public data source promotion occurred",
  "No row coverage points were awarded",
  "`scoreSource=real` remains blocked",
  "NEXT-SLICE-001 create and run a bounded post-write staging verification"
]) {
  if (!review.includes(phrase)) problems.push(`${reviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity staging third write post-run review slice",
  "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md",
  "scripts/check-tw-equity-staging-third-write-post-run-review-2026-06-07.mjs",
  "tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion",
  "third bounded staging write executed once and succeeded",
  "written run rows `1` and written price rows `180`",
  "No SQL, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-staging-third-write-post-run-review-2026-06-07"] !==
  "node scripts/check-tw-equity-staging-third-write-post-run-review-2026-06-07.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-third-write-post-run-review-2026-06-07");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-third-write-post-run-review-2026-06-07.mjs")) {
    problems.push(`${pathName} missing TW equity staging third write post-run review checker`);
  }
  if (!text.includes("tw-equity-staging-third-write-post-run-review-2026-06-07")) {
    problems.push(`${pathName} missing tw-equity-staging-third-write-post-run-review-2026-06-07 name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-third-write-post-run-review-2026-06-07"')) {
  problems.push("review gate core set missing tw-equity-staging-third-write-post-run-review-2026-06-07");
}

if (/sb_secret_/u.test(review) || /sb_publishable_/u.test(review)) {
  problems.push(`${reviewPath} must not contain literal Supabase key material`);
}

if (/"scoreSource": "real"/u.test(review) || /"publicDataSource": "supabase"/u.test(review)) {
  problems.push(`${reviewPath} must not promote public or score source`);
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
