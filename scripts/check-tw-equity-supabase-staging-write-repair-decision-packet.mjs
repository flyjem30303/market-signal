import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_SUPABASE_STAGING_WRITE_REPAIR_DECISION_PACKET.md";
const reportPath = "scripts/report-tw-equity-supabase-staging-write-repair-decision-packet.mjs";
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
  "TW Equity Supabase Staging Write Repair Decision Packet",
  "tw_equity_supabase_staging_write_repair_decision_packet_ready_no_repair_executed",
  "REPAIR_PACKET_READY_STOP_RETRY_UNTIL_CAUSE_ISOLATED",
  "run_insert_failed_PGRST205",
  "tw_equity_staging_first_write_attempt_blocked_pgrst205_no_mutation",
  "tw_equity_pgrst205_root_cause_gate_canonical_objects_readable_no_write_retry",
  "tw_equity_staging_second_write_retry_blocked_pgrst205_no_mutation",
  "REST insert schema exposure",
  "PostgREST schema cache",
  "table object existence in exposed schema",
  "RLS and policy posture",
  "hidden target mismatch",
  "insert payload and column contract",
  "no third write retry",
  "no SQL execution",
  "no migration execution",
  "no insert, update, upsert, or delete operation",
  "no Supabase staging rows may be created",
  "no production `daily_prices` mutation",
  "no market-data fetch or ingestion",
  "no raw market-data payload, row payload, or secret output",
  "no public data source promotion",
  "no row coverage points",
  "no `scoreSource=real`",
  "NEXT-SLICE-001 create `TW_EQUITY_SUPABASE_STAGING_WRITE_REPAIR_EVIDENCE_CHECKLIST`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity Supabase staging write repair decision packet slice",
  "docs/TW_EQUITY_SUPABASE_STAGING_WRITE_REPAIR_DECISION_PACKET.md",
  "scripts/report-tw-equity-supabase-staging-write-repair-decision-packet.mjs",
  "scripts/check-tw-equity-supabase-staging-write-repair-decision-packet.mjs",
  "tw_equity_supabase_staging_write_repair_decision_packet_ready_no_repair_executed",
  "stop write retries and isolate REST insert schema exposure, PostgREST schema cache, table object existence, RLS/policy posture, hidden target mismatch, and insert payload/column contract",
  "No third retry, SQL, migration execution, successful Supabase write, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-supabase-staging-write-repair-decision-packet"] !==
  "node scripts/report-tw-equity-supabase-staging-write-repair-decision-packet.mjs"
) {
  problems.push("package.json missing report:tw-equity-supabase-staging-write-repair-decision-packet");
}

if (
  pkg.scripts?.["check:tw-equity-supabase-staging-write-repair-decision-packet"] !==
  "node scripts/check-tw-equity-supabase-staging-write-repair-decision-packet.mjs"
) {
  problems.push("package.json missing check:tw-equity-supabase-staging-write-repair-decision-packet");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-supabase-staging-write-repair-decision-packet.mjs")) {
    problems.push(`${pathName} missing TW equity Supabase staging write repair decision packet checker`);
  }
  if (!text.includes("tw-equity-supabase-staging-write-repair-decision-packet")) {
    problems.push(`${pathName} missing tw-equity-supabase-staging-write-repair-decision-packet name`);
  }
}

if (!reviewGate.includes('"tw-equity-supabase-staging-write-repair-decision-packet"')) {
  problems.push("review gate core set missing tw-equity-supabase-staging-write-repair-decision-packet");
}

const reportRun = spawnSync(process.execPath, [reportPath], { encoding: "utf8" });
if (reportRun.status !== 0) {
  problems.push(`${reportPath} failed to run`);
} else {
  try {
    const report = JSON.parse(reportRun.stdout);
    if (report.status !== "tw_equity_supabase_staging_write_repair_decision_packet_ready_no_repair_executed") {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
      problems.push(`${reportPath} must keep publicDataSource and scoreSource mock`);
    }
    for (const key of [
      "sqlExecuted",
      "migrationExecuted",
      "realSupabaseConnectionAttempted",
      "realSupabaseWrites",
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
