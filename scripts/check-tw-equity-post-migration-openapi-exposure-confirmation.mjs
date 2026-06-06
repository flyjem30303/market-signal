import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-tw-equity-post-migration-openapi-exposure-confirmation-once.mjs";
const reviewPath = "docs/reviews/TW_EQUITY_POST_MIGRATION_OPENAPI_EXPOSURE_CONFIRMATION_POST_RUN_REVIEW_2026-06-07.md";
const readonlyReviewPath = "docs/reviews/TW_EQUITY_POST_MIGRATION_READONLY_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const reportSource = read(reportPath);
const review = read(reviewPath);
const readonlyReview = read(readonlyReviewPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "CONFIRMATION_VALUE",
  "CEO_APPROVED_TW_EQUITY_POST_MIGRATION_OPENAPI_EXPOSURE_CONFIRMATION_ONCE",
  "TW_EQUITY_POST_MIGRATION_OPENAPI_EXPOSURE_CONFIRMATION",
  "TW_EQUITY_POST_MIGRATION_READONLY_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "probeOpenApiSchema",
  "accept: \"application/openapi+json\"",
  "rawOpenApiPrinted: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "sqlExecutedByPm: false",
  "migrationExecutedByPm: false",
  "supabaseWriteAttempted: false",
  "stagingRowsCreated: false",
  "serviceRoleKeyPrinted: false"
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

if (!readonlyReview.includes("tw_equity_post_migration_readonly_verification_tables_reachable_no_write")) {
  problems.push(`${readonlyReviewPath} must contain accepted readonly verification status`);
}

for (const phrase of [
  "TW Equity Post-Migration OpenAPI Exposure Confirmation Post-Run Review",
  "tw_equity_post_migration_openapi_exposure_confirmation_schema_exposure_complete_write_path_ready_for_decision",
  "Exactly one bounded PostgREST OpenAPI exposure confirmation was attempted",
  "Raw OpenAPI output is not stored or printed",
  "OpenAPI reachable: `true`",
  "OpenAPI parsed: `true`",
  "Problems: `none`",
  "`staging_twse_stock_day_runs`: exposed=`true`, exposedExpectedColumnCount=`25`, expectedColumnCount=`25`, missingExpectedColumns=`none`",
  "`staging_twse_stock_day_prices`: exposed=`true`, exposedExpectedColumnCount=`16`, expectedColumnCount=`16`, missingExpectedColumns=`none`",
  "REST/OpenAPI exposure is complete enough to prepare a separate bounded staging write decision",
  "no SQL execution by PM",
  "no migration execution by PM",
  "no insert/update/upsert/delete operation",
  "no staging rows created",
  "no `daily_prices` mutation",
  "no raw OpenAPI printed",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!review.includes(phrase)) problems.push(`${reviewPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity post-migration OpenAPI exposure confirmation slice",
  "docs/reviews/TW_EQUITY_POST_MIGRATION_OPENAPI_EXPOSURE_CONFIRMATION_POST_RUN_REVIEW_2026-06-07.md",
  "scripts/report-tw-equity-post-migration-openapi-exposure-confirmation-once.mjs",
  "scripts/check-tw-equity-post-migration-openapi-exposure-confirmation.mjs",
  "tw_equity_post_migration_openapi_exposure_confirmation_schema_exposure_complete_write_path_ready_for_decision",
  "both staging tables are exposed through PostgREST OpenAPI",
  "all expected staging columns are exposed",
  "PGRST205 schema exposure blocker is treated as closed for planning",
  "next route is a separate bounded staging write decision"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-post-migration-openapi-exposure-confirmation"] !==
  "node scripts/report-tw-equity-post-migration-openapi-exposure-confirmation-once.mjs"
) {
  problems.push("package.json missing report:tw-equity-post-migration-openapi-exposure-confirmation");
}

if (
  pkg.scripts?.["check:tw-equity-post-migration-openapi-exposure-confirmation"] !==
  "node scripts/check-tw-equity-post-migration-openapi-exposure-confirmation.mjs"
) {
  problems.push("package.json missing check:tw-equity-post-migration-openapi-exposure-confirmation");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-post-migration-openapi-exposure-confirmation.mjs")) {
    problems.push(`${pathName} missing TW equity post-migration OpenAPI exposure confirmation checker`);
  }
  if (!text.includes("tw-equity-post-migration-openapi-exposure-confirmation")) {
    problems.push(`${pathName} missing tw-equity-post-migration-openapi-exposure-confirmation name`);
  }
}

if (!reviewGate.includes('"tw-equity-post-migration-openapi-exposure-confirmation"')) {
  problems.push("review gate core set missing tw-equity-post-migration-openapi-exposure-confirmation");
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
  if (report.status !== "tw_equity_post_migration_openapi_exposure_confirmation_not_run_confirmation_required") {
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
