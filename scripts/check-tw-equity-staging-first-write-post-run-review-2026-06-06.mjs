import fs from "node:fs";

const problems = [];

const reviewPath = "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md";
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
  "TW Equity Staging First Write Post-Run Review",
  "tw_equity_staging_first_write_attempt_blocked_pgrst205_no_mutation",
  "ONE_ATTEMPT_RECORDED_FAIL_CLOSED_OBJECT_NOT_AVAILABLE",
  "run_insert_failed_PGRST205",
  "object_not_available_or_schema_cache",
  "Execution count: `1`",
  "Exit code: `1`",
  "\"connectionAttempted\": true",
  "\"writeAttempted\": true",
  "\"mutations\": false",
  "\"writtenRunRows\": 0",
  "\"writtenPriceRows\": 0",
  "\"candidateInputPriceRows\": 180",
  "\"publicDataSource\": \"mock\"",
  "\"scoreSource\": \"mock\"",
  "\"sqlExecuted\": false",
  "\"marketDataFetched\": false",
  "\"marketDataIngested\": false",
  "\"rowPayloadsPrinted\": false",
  "\"secretsPrinted\": false",
  "No Supabase URL, service-role key, anon key, raw row payloads",
  "STOP-001 no retry was executed",
  "Do not retry the write in the same slice",
  "NEXT-SLICE-001 create a `PGRST205` root-cause repair gate"
]) {
  if (!review.includes(phrase)) problems.push(`${reviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity staging first write post-run review slice",
  "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md",
  "tw_equity_staging_first_write_attempt_blocked_pgrst205_no_mutation",
  "run_insert_failed_PGRST205",
  "one bounded staging write attempt was executed and failed closed without mutation",
  "No retry, SQL, successful Supabase write, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-staging-first-write-post-run-review-2026-06-06"] !==
  "node scripts/check-tw-equity-staging-first-write-post-run-review-2026-06-06.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-first-write-post-run-review-2026-06-06");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-first-write-post-run-review-2026-06-06.mjs")) {
    problems.push(`${pathName} missing TW equity staging first write post-run review checker`);
  }
  if (!text.includes("tw-equity-staging-first-write-post-run-review-2026-06-06")) {
    problems.push(`${pathName} missing tw-equity-staging-first-write-post-run-review-2026-06-06 name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-first-write-post-run-review-2026-06-06"')) {
  problems.push("review gate core set missing tw-equity-staging-first-write-post-run-review-2026-06-06");
}

if (/sb_secret_/u.test(review) || /sb_publishable_/u.test(review)) {
  problems.push(`${reviewPath} must not contain literal Supabase key material`);
}

if (/"mutations": true/u.test(review) || /"writtenRunRows": [1-9]/u.test(review) || /"writtenPriceRows": [1-9]/u.test(review)) {
  problems.push(`${reviewPath} must not claim successful mutation`);
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
