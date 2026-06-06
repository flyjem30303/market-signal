import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_TABLE_API_VISIBILITY_PERMISSION_DIAGNOSTIC_DECISION_PACKET.md";
const reportPath = "scripts/report-tw-equity-table-api-visibility-permission-diagnostic-decision-packet.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Table API Visibility Permission Diagnostic Decision Packet",
  "tw_equity_table_api_visibility_permission_diagnostic_decision_packet_ready_not_executed",
  "READY_FOR_SEPARATE_TABLE_LEVEL_DATA_API_VISIBILITY_PERMISSION_DIAGNOSTIC",
  "accepted non-data-changing schema exposure/cache repair",
  "bounded PostgREST OpenAPI probe rerun",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "still not exposed in OpenAPI",
  "third bounded staging write remains blocked",
  "Are the canonical staging tables enabled for Data API exposure at the table/object level?",
  "table-level permissions, grants, policy posture, or API visibility settings",
  "Allowed only in a separate authorized execution slice",
  "one bounded read-only table-level Data API visibility diagnostic",
  "sanitized aggregate evidence",
  "no third bounded staging write attempt",
  "no SQL execution",
  "no migration execution",
  "no insert/update/upsert/delete operation",
  "table_api_visibility_not_exposed",
  "table_permission_or_policy_visibility_blocked",
  "openapi_metadata_lag_or_cache_incomplete",
  "table_object_missing_or_mismatched",
  "diagnostic_environment_blocked",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity table API visibility permission diagnostic decision packet slice",
  "docs/TW_EQUITY_TABLE_API_VISIBILITY_PERMISSION_DIAGNOSTIC_DECISION_PACKET.md",
  "scripts/report-tw-equity-table-api-visibility-permission-diagnostic-decision-packet.mjs",
  "scripts/check-tw-equity-table-api-visibility-permission-diagnostic-decision-packet.mjs",
  "tw_equity_table_api_visibility_permission_diagnostic_decision_packet_ready_not_executed",
  "classify table-level Data API visibility, permission, policy, direct relation reachability, and object mismatch before any third bounded staging write decision",
  "No remote Supabase connection, SQL, migration execution, write attempt, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-table-api-visibility-permission-diagnostic-decision-packet"] !==
  "node scripts/report-tw-equity-table-api-visibility-permission-diagnostic-decision-packet.mjs"
) {
  problems.push("package.json missing report:tw-equity-table-api-visibility-permission-diagnostic-decision-packet");
}

if (
  pkg.scripts?.["check:tw-equity-table-api-visibility-permission-diagnostic-decision-packet"] !==
  "node scripts/check-tw-equity-table-api-visibility-permission-diagnostic-decision-packet.mjs"
) {
  problems.push("package.json missing check:tw-equity-table-api-visibility-permission-diagnostic-decision-packet");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-table-api-visibility-permission-diagnostic-decision-packet.mjs")) {
    problems.push(`${pathName} missing TW equity table API visibility permission diagnostic decision checker`);
  }
  if (!text.includes("tw-equity-table-api-visibility-permission-diagnostic-decision-packet")) {
    problems.push(`${pathName} missing tw-equity-table-api-visibility-permission-diagnostic-decision-packet name`);
  }
}

if (!reviewGate.includes('"tw-equity-table-api-visibility-permission-diagnostic-decision-packet"')) {
  problems.push("review gate core set missing tw-equity-table-api-visibility-permission-diagnostic-decision-packet");
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
    if (report.status !== "tw_equity_table_api_visibility_permission_diagnostic_decision_packet_ready_not_executed") {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    if (report.futureDiagnosticScope?.executionAllowedByThisPacket !== false) {
      problems.push(`${reportPath} must not allow execution by this packet`);
    }
    if (report.safety?.thirdBoundedStagingWriteAttemptAllowed !== false) {
      problems.push(`${reportPath} must block third bounded staging write`);
    }
    if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
      problems.push(`${reportPath} must keep mock public/score source`);
    }
    for (const key of [
      "connectionAttempted",
      "sqlExecuted",
      "migrationExecuted",
      "supabaseWriteAttempted",
      "stagingRowsCreated",
      "dailyPricesMutated",
      "marketDataFetched",
      "marketDataIngested",
      "rawOpenApiPrinted",
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
