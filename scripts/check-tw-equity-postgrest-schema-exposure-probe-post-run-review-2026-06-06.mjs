import fs from "node:fs";

const problems = [];

const reviewPath = "docs/reviews/TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_POST_RUN_REVIEW_2026-06-06.md";
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
  "TW Equity PostgREST Schema Exposure Probe Post-Run Review",
  "tw_equity_postgrest_schema_exposure_probe_schema_exposure_incomplete",
  "Exactly one bounded PostgREST OpenAPI schema exposure probe was attempted",
  "Evidence is sanitized schema metadata only",
  "OpenAPI reachable: `true`",
  "OpenAPI parsed: `true`",
  "staging_twse_stock_day_runs_not_exposed_in_openapi_schema",
  "staging_twse_stock_day_prices_not_exposed_in_openapi_schema",
  "exposed=`false`",
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
  "Latest TW equity PostgREST schema exposure probe slice",
  reviewPath,
  "tw_equity_postgrest_schema_exposure_probe_schema_exposure_incomplete",
  "OpenAPI endpoint is reachable and parseable, but both canonical staging tables are not exposed in the OpenAPI schema",
  "strong current root-cause candidate for readonly-visible but write-path PGRST205 behavior",
  "No SQL, migration execution, insert/update/upsert/delete operation, staging row creation, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:tw-equity-postgrest-schema-exposure-probe-post-run-review"] !==
  "node scripts/check-tw-equity-postgrest-schema-exposure-probe-post-run-review-2026-06-06.mjs"
) {
  problems.push("package.json missing check:tw-equity-postgrest-schema-exposure-probe-post-run-review");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-postgrest-schema-exposure-probe-post-run-review-2026-06-06.mjs")) {
    problems.push(`${pathName} missing TW equity PostgREST schema exposure probe post-run checker`);
  }
  if (!text.includes("tw-equity-postgrest-schema-exposure-probe-post-run-review")) {
    problems.push(`${pathName} missing tw-equity-postgrest-schema-exposure-probe-post-run-review name`);
  }
}

for (const forbidden of [
  "sb_secret_",
  "sb_publishable_",
  "SUPABASE_SERVICE_ROLE_KEY=",
  "NEXT_PUBLIC_SUPABASE_URL=https://",
  "INSERT INTO",
  "rawOpenApi",
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
