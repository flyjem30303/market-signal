import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const runnerPath = "scripts/report-tw-equity-supabase-metadata-diagnostic-once.mjs";
const decisionDocPath = "docs/TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_DECISION_PACKET.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const runner = read(runnerPath);
const decisionDoc = read(decisionDocPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "CEO_APPROVED_TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_ONCE",
  "TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_CONFIRMATION",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "readonlyMetadataProbe",
  "select(\"run_id\", { count: \"exact\", head: true })",
  "writePostRunReview",
  "sanitizedAggregateEvidenceOnly",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "supabaseWriteAttempted: false",
  "sqlExecuted: false",
  "migrationExecuted: false",
  "stagingRowsCreated: false",
  "dailyPricesMutated: false",
  "marketDataFetched: false",
  "marketDataIngested: false",
  "secretsPrinted: false",
  "metadata_reachable_insert_blocker_unresolved",
  "metadata_schema_cache_or_object_not_available",
  "metadata_access_or_policy_blocked",
  "metadata_column_contract_or_cache_blocked",
  "metadata_project_or_network_blocked"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const forbidden of [
  ".insert(",
  ".update(",
  ".delete(",
  ".upsert(",
  "console.log(process.env",
  "sb_secret_",
  "sb_publishable_",
  "sql`"
]) {
  if (runner.includes(forbidden)) problems.push(`${runnerPath} contains forbidden token: ${forbidden}`);
}

for (const phrase of [
  "scripts/report-tw-equity-supabase-metadata-diagnostic-once.mjs",
  "bounded metadata diagnostic runner",
  "one bounded read-only metadata diagnostic"
]) {
  if (!decisionDoc.includes(phrase)) problems.push(`${decisionDocPath} missing runner reference: ${phrase}`);
  if (!status.includes(phrase)) problems.push(`${statusPath} missing runner reference: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-supabase-metadata-diagnostic-once"] !==
  "node scripts/report-tw-equity-supabase-metadata-diagnostic-once.mjs"
) {
  problems.push("package.json missing report:tw-equity-supabase-metadata-diagnostic-once");
}

if (
  pkg.scripts?.["check:tw-equity-supabase-metadata-diagnostic-once"] !==
  "node scripts/check-tw-equity-supabase-metadata-diagnostic-once.mjs"
) {
  problems.push("package.json missing check:tw-equity-supabase-metadata-diagnostic-once");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-supabase-metadata-diagnostic-once.mjs")) {
    problems.push(`${pathName} missing TW equity Supabase metadata diagnostic once checker`);
  }
  if (!text.includes("tw-equity-supabase-metadata-diagnostic-once")) {
    problems.push(`${pathName} missing tw-equity-supabase-metadata-diagnostic-once name`);
  }
}

const runWithoutConfirmation = spawnSync(process.execPath, [runnerPath], { encoding: "utf8" });
if (runWithoutConfirmation.status !== 0) {
  problems.push(`${runnerPath} failed without confirmation`);
} else {
  try {
    const report = JSON.parse(runWithoutConfirmation.stdout);
    if (report.status !== "tw_equity_supabase_metadata_diagnostic_not_run_confirmation_required") {
      problems.push(`${runnerPath} must fail closed without confirmation`);
    }
    if (report.connectionAttempted !== false) problems.push(`${runnerPath} must not connect without confirmation`);
    if (report.postRunReview?.written !== false) problems.push(`${runnerPath} must not write review without confirmation`);
    if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
      problems.push(`${runnerPath} must keep mock sources`);
    }
    for (const key of [
      "sqlExecuted",
      "migrationExecuted",
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
      if (report.safety?.[key] !== false) problems.push(`${runnerPath} safety.${key} must be false`);
    }
  } catch {
    problems.push(`${runnerPath} did not emit JSON without confirmation`);
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
    return "{}";
  }

  return fs.readFileSync(filePath, "utf8");
}
