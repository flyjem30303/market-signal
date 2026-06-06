import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_DECISION_PACKET.md";
const reportPath = "scripts/report-tw-equity-supabase-metadata-diagnostic-decision-packet.mjs";
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
  "TW Equity Supabase Metadata Diagnostic Decision Packet",
  "tw_equity_supabase_metadata_diagnostic_decision_packet_ready_not_executed",
  "READY_FOR_SEPARATE_BOUNDED_METADATA_DIAGNOSTIC_AUTHORIZATION",
  "REST insert schema exposure",
  "PostgREST schema cache",
  "TW_EQUITY_RUN_ID_UUID_CONTRACT_REPAIR_GATE",
  "exactly one bounded remote diagnostic run",
  "read-only metadata-safe operations",
  "sanitized aggregate evidence",
  "no third write attempt",
  "no SQL execution",
  "no migration execution",
  "no insert/update/upsert/delete operation",
  "metadata_reachable_insert_blocker_unresolved",
  "metadata_schema_cache_or_object_not_available",
  "metadata_access_or_policy_blocked",
  "metadata_column_contract_or_cache_blocked",
  "metadata_project_or_network_blocked",
  "This packet does not create or run that remote diagnostic runner",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity Supabase metadata diagnostic decision packet slice",
  "docs/TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_DECISION_PACKET.md",
  "scripts/report-tw-equity-supabase-metadata-diagnostic-decision-packet.mjs",
  "scripts/check-tw-equity-supabase-metadata-diagnostic-decision-packet.mjs",
  "tw_equity_supabase_metadata_diagnostic_decision_packet_ready_not_executed",
  "prepares exactly one future bounded read-only metadata diagnostic after UUID contract repair",
  "No remote Supabase connection, SQL, migration execution, write attempt, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-supabase-metadata-diagnostic-decision-packet"] !==
  "node scripts/report-tw-equity-supabase-metadata-diagnostic-decision-packet.mjs"
) {
  problems.push("package.json missing report:tw-equity-supabase-metadata-diagnostic-decision-packet");
}

if (
  pkg.scripts?.["check:tw-equity-supabase-metadata-diagnostic-decision-packet"] !==
  "node scripts/check-tw-equity-supabase-metadata-diagnostic-decision-packet.mjs"
) {
  problems.push("package.json missing check:tw-equity-supabase-metadata-diagnostic-decision-packet");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-supabase-metadata-diagnostic-decision-packet.mjs")) {
    problems.push(`${pathName} missing TW equity Supabase metadata diagnostic decision packet checker`);
  }
  if (!text.includes("tw-equity-supabase-metadata-diagnostic-decision-packet")) {
    problems.push(`${pathName} missing tw-equity-supabase-metadata-diagnostic-decision-packet name`);
  }
}

if (!reviewGate.includes('"tw-equity-supabase-metadata-diagnostic-decision-packet"')) {
  problems.push("review gate core set missing tw-equity-supabase-metadata-diagnostic-decision-packet");
}

const reportRun = spawnSync(process.execPath, [reportPath], { encoding: "utf8" });
if (reportRun.status !== 0) {
  problems.push(`${reportPath} failed to run`);
} else {
  try {
    const report = JSON.parse(reportRun.stdout);
    if (report.status !== "tw_equity_supabase_metadata_diagnostic_decision_packet_ready_not_executed") {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    if (report.futureDiagnosticScope?.executionAllowedByThisPacket !== false) {
      problems.push(`${reportPath} must not allow execution by this packet`);
    }
    if (report.futureDiagnosticScope?.exactlyOneRun !== true) {
      problems.push(`${reportPath} must require exactly one future run`);
    }
    if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
      problems.push(`${reportPath} must keep publicDataSource and scoreSource mock`);
    }
    for (const key of [
      "sqlExecuted",
      "migrationExecuted",
      "remoteSupabaseConnectionAttempted",
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
