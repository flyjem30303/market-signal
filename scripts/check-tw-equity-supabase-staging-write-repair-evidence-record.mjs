import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_SUPABASE_STAGING_WRITE_REPAIR_EVIDENCE_RECORD.md";
const reportPath = "scripts/report-tw-equity-supabase-staging-write-repair-evidence-record.mjs";
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
  "TW Equity Supabase Staging Write Repair Evidence Record",
  "tw_equity_supabase_staging_write_repair_evidence_record_local_mismatch_found_no_remote_action",
  "LOCAL_PAYLOAD_CONTRACT_REPAIR_REQUIRED_BEFORE_ANY_REMOTE_REPAIR_OR_THIRD_ATTEMPT",
  "C1 REST Insert Schema Exposure",
  "C2 PostgREST Schema Cache",
  "C3 Object And Schema Name Match",
  "C4 RLS And Policy Posture",
  "C5 Read-Only Versus Insert Path Match",
  "C6 Insert Payload And Column Contract",
  "local_payload_contract_mismatch_run_id_not_uuid",
  "migration declares `staging_twse_stock_day_runs.run_id` as `uuid primary key`",
  "current runner validator only requires `run_id` to be a non-empty string",
  "Do not perform a third bounded write attempt",
  "require UUID-shaped `candidateRun.run_id`",
  "TW_EQUITY_RUN_ID_UUID_CONTRACT_REPAIR_GATE",
  "no remote Supabase connection",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity Supabase staging write repair evidence record slice",
  "docs/TW_EQUITY_SUPABASE_STAGING_WRITE_REPAIR_EVIDENCE_RECORD.md",
  "scripts/report-tw-equity-supabase-staging-write-repair-evidence-record.mjs",
  "scripts/check-tw-equity-supabase-staging-write-repair-evidence-record.mjs",
  "tw_equity_supabase_staging_write_repair_evidence_record_local_mismatch_found_no_remote_action",
  "local payload contract mismatch: staging run ids are UUID columns but the accepted candidate run id is not UUID-shaped",
  "No remote Supabase connection, SQL, migration execution, write attempt, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-supabase-staging-write-repair-evidence-record"] !==
  "node scripts/report-tw-equity-supabase-staging-write-repair-evidence-record.mjs"
) {
  problems.push("package.json missing report:tw-equity-supabase-staging-write-repair-evidence-record");
}

if (
  pkg.scripts?.["check:tw-equity-supabase-staging-write-repair-evidence-record"] !==
  "node scripts/check-tw-equity-supabase-staging-write-repair-evidence-record.mjs"
) {
  problems.push("package.json missing check:tw-equity-supabase-staging-write-repair-evidence-record");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-supabase-staging-write-repair-evidence-record.mjs")) {
    problems.push(`${pathName} missing TW equity Supabase staging write repair evidence record checker`);
  }
  if (!text.includes("tw-equity-supabase-staging-write-repair-evidence-record")) {
    problems.push(`${pathName} missing tw-equity-supabase-staging-write-repair-evidence-record name`);
  }
}

if (!reviewGate.includes('"tw-equity-supabase-staging-write-repair-evidence-record"')) {
  problems.push("review gate core set missing tw-equity-supabase-staging-write-repair-evidence-record");
}

const reportRun = spawnSync(process.execPath, [reportPath], { encoding: "utf8" });
if (reportRun.status !== 0) {
  problems.push(`${reportPath} failed to run`);
} else {
  try {
    const report = JSON.parse(reportRun.stdout);
    if (report.status !== "tw_equity_supabase_staging_write_repair_evidence_record_local_mismatch_found_no_remote_action") {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    if (report.checklistClassification?.c6InsertPayloadAndColumnContract !== "local_payload_contract_mismatch_run_id_not_uuid") {
      problems.push(`${reportPath} must classify C6 as local_payload_contract_mismatch_run_id_not_uuid`);
    }
    if (report.localEvidence?.candidateRunIdIsUuidShaped !== false) {
      problems.push(`${reportPath} must detect non-UUID candidate run id`);
    }
    if (report.localEvidence?.migrationDeclaresRunsRunIdUuid !== true) {
      problems.push(`${reportPath} must detect UUID run_id in local migration`);
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
