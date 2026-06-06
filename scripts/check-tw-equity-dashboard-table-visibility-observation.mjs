import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_DASHBOARD_TABLE_VISIBILITY_OBSERVATION_2026-06-06.md";
const reportPath = "scripts/report-tw-equity-dashboard-table-visibility-observation.mjs";
const migrationPath = "supabase/migrations/0003_twse_stock_day_staging.sql";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const migration = read(migrationPath);
const runner = read(runnerPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Dashboard Table Visibility Observation",
  "tw_equity_dashboard_table_visibility_observation_staging_tables_not_found_in_public_table_list",
  "selected schema: `public`",
  "search query: `staging_twse`",
  "search result: `No results found`",
  "observed table count under the active search: `0 tables`",
  "`staging_twse_stock_day_runs` was not visible in the public table list",
  "`staging_twse_stock_day_prices` was not visible in the public table list",
  "supabase/migrations/0003_twse_stock_day_staging.sql",
  "create table if not exists public.staging_twse_stock_day_runs",
  "create table if not exists public.staging_twse_stock_day_prices",
  "remote_staging_tables_missing_or_not_applied",
  "Prepare a migration-apply decision packet",
  "no SQL executed by PM",
  "no migration executed by PM",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [pathName, text, phrase] of [
  [migrationPath, migration, "create table if not exists public.staging_twse_stock_day_runs"],
  [migrationPath, migration, "create table if not exists public.staging_twse_stock_day_prices"],
  [migrationPath, migration, "Do not execute until CEO approves migration execution"],
  [runnerPath, runner, ".from(\"staging_twse_stock_day_runs\").insert([candidateInput.candidateRun])"],
  [runnerPath, runner, ".from(\"staging_twse_stock_day_prices\").insert(candidateInput.candidatePrices)"]
]) {
  if (!text.includes(phrase)) problems.push(`${pathName} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity Dashboard table visibility observation slice",
  "docs/TW_EQUITY_DASHBOARD_TABLE_VISIBILITY_OBSERVATION_2026-06-06.md",
  "scripts/report-tw-equity-dashboard-table-visibility-observation.mjs",
  "scripts/check-tw-equity-dashboard-table-visibility-observation.mjs",
  "tw_equity_dashboard_table_visibility_observation_staging_tables_not_found_in_public_table_list",
  "remote_staging_tables_missing_or_not_applied",
  "migration-apply decision packet for `supabase/migrations/0003_twse_stock_day_staging.sql`",
  "No SQL, migration execution, Supabase write, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-dashboard-table-visibility-observation"] !==
  "node scripts/report-tw-equity-dashboard-table-visibility-observation.mjs"
) {
  problems.push("package.json missing report:tw-equity-dashboard-table-visibility-observation");
}

if (
  pkg.scripts?.["check:tw-equity-dashboard-table-visibility-observation"] !==
  "node scripts/check-tw-equity-dashboard-table-visibility-observation.mjs"
) {
  problems.push("package.json missing check:tw-equity-dashboard-table-visibility-observation");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-dashboard-table-visibility-observation.mjs")) {
    problems.push(`${pathName} missing TW equity Dashboard table visibility observation checker`);
  }
  if (!text.includes("tw-equity-dashboard-table-visibility-observation")) {
    problems.push(`${pathName} missing tw-equity-dashboard-table-visibility-observation name`);
  }
}

if (!reviewGate.includes('"tw-equity-dashboard-table-visibility-observation"')) {
  problems.push("review gate core set missing tw-equity-dashboard-table-visibility-observation");
}

const reportRun = spawnSync(process.execPath, [reportPath], { encoding: "utf8" });
if (reportRun.status !== 0) {
  problems.push(`${reportPath} failed to run`);
} else {
  for (const pattern of [
    /NEXT_PUBLIC_SUPABASE_URL/,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
    /SUPABASE_SERVICE_ROLE_KEY/,
    /https:\/\/[a-z0-9-]+\.supabase\.co/i,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
    /\brawRows\b/,
    /\browPayload\b/i,
    /\bselect\s+\*\s+from\b/i,
    /\binsert\s+into\b/i,
    /\bupdate\s+[a-z_]+\s+set\b/i,
    /\bdelete\s+from\b/i
  ]) {
    if (pattern.test(reportRun.stdout)) problems.push(`${reportPath} emitted forbidden output pattern: ${String(pattern)}`);
  }

  try {
    const report = JSON.parse(reportRun.stdout);
    if (report.status !== "tw_equity_dashboard_table_visibility_observation_staging_tables_not_found_in_public_table_list") {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    if (report.ceoClassification !== "remote_staging_tables_missing_or_not_applied") {
      problems.push(`${reportPath} emitted unexpected CEO classification`);
    }
    if (report.dashboardObservation?.observedSearchResultTableCount !== 0) {
      problems.push(`${reportPath} must record zero staging search results`);
    }
    if (report.localContractComparison?.localTargetNamingMismatch !== false) {
      problems.push(`${reportPath} must not classify local target naming mismatch`);
    }
    if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
      problems.push(`${reportPath} must keep mock public/score source`);
    }
    for (const key of [
      "sqlExecutedByPm",
      "migrationExecutedByPm",
      "supabaseWriteAttempted",
      "stagingRowsCreated",
      "dailyPricesMutated",
      "marketDataFetched",
      "marketDataIngested",
      "rawPayloadsPrinted",
      "rowPayloadsPrinted",
      "secretsPrinted",
      "publicPromotionAllowed",
      "rowCoveragePointsAllowed",
      "scoreSourceRealAllowed"
    ]) {
      if (report.safety?.[key] !== false) problems.push(`${reportPath} safety.${key} must be false`);
    }
  } catch {
    problems.push(`${reportPath} did not emit JSON`);
  }
}

for (const [pathName, text] of [
  [docPath, doc],
  [reportPath, reportSource]
]) {
  for (const forbidden of [
    ".insert(",
    ".update(",
    ".delete(",
    ".upsert(",
    "await import(\"@supabase/supabase-js\")",
    "sb_secret_",
    "sb_publishable_"
  ]) {
    if (text.includes(forbidden)) problems.push(`${pathName} contains forbidden token: ${forbidden}`);
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
