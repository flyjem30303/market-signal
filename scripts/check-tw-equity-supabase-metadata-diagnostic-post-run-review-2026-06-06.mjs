import fs from "node:fs";

const problems = [];

const reviewPath = "docs/reviews/TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_POST_RUN_REVIEW_2026-06-06.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const review = read(reviewPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Supabase Metadata Diagnostic Post-Run Review",
  "tw_equity_supabase_metadata_diagnostic_metadata_reachable_insert_blocker_unresolved",
  "Exactly one bounded read-only metadata diagnostic was attempted",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "Evidence is sanitized aggregate evidence only",
  "open_separate_write_path_metadata_or_dashboard_comparison_before_any_third_write_attempt",
  "reachable=`ok`",
  "countStatus=`ok`",
  "errorCategory=`none`",
  "errorCode=`none`",
  "no SQL execution",
  "no migration execution",
  "no insert/update/upsert/delete operation",
  "no staging rows created",
  "no `daily_prices` mutation",
  "no market-data fetch or ingestion",
  "no raw payloads printed",
  "no row payloads printed",
  "no secrets printed",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!review.includes(phrase)) problems.push(`${reviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity Supabase metadata diagnostic post-run review slice",
  reviewPath,
  "tw_equity_supabase_metadata_diagnostic_metadata_reachable_insert_blocker_unresolved",
  "canonical staging metadata is reachable through one bounded read-only diagnostic",
  "next route is write-path metadata or dashboard/API schema comparison before any third write attempt",
  "No SQL, migration execution, insert/update/upsert/delete operation, staging row creation, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-supabase-metadata-diagnostic-post-run-review"] !==
  "node scripts/check-tw-equity-supabase-metadata-diagnostic-post-run-review-2026-06-06.mjs"
) {
  problems.push("package.json missing check:tw-equity-supabase-metadata-diagnostic-post-run-review");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-supabase-metadata-diagnostic-post-run-review-2026-06-06.mjs")) {
    problems.push(`${pathName} missing TW equity Supabase metadata diagnostic post-run review checker`);
  }
  if (!text.includes("tw-equity-supabase-metadata-diagnostic-post-run-review")) {
    problems.push(`${pathName} missing tw-equity-supabase-metadata-diagnostic-post-run-review name`);
  }
}

for (const forbidden of [
  "sb_secret_",
  "sb_publishable_",
  "SUPABASE_SERVICE_ROLE_KEY=",
  "NEXT_PUBLIC_SUPABASE_URL=https://",
  "INSERT INTO",
  "rawPayload",
  "rowPayload"
]) {
  if (review.includes(forbidden)) problems.push(`${reviewPath} contains forbidden token: ${forbidden}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }

  return fs.readFileSync(filePath, "utf8");
}
