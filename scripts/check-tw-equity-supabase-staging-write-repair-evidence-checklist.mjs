import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_SUPABASE_STAGING_WRITE_REPAIR_EVIDENCE_CHECKLIST.md";
const reportPath = "scripts/report-tw-equity-supabase-staging-write-repair-evidence-checklist.mjs";
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
  "TW Equity Supabase Staging Write Repair Evidence Checklist",
  "tw_equity_supabase_staging_write_repair_evidence_checklist_ready_no_remote_action",
  "REPAIR_EVIDENCE_CHECKLIST_READY_BEFORE_ANY_REPAIR_OR_THIRD_ATTEMPT",
  "REST Insert Schema Exposure",
  "PostgREST Schema Cache",
  "Object And Schema Name Match",
  "RLS And Policy Posture",
  "Read-Only Versus Insert Path Match",
  "Insert Payload And Column Contract",
  "ROUTE-A dashboard/manual schema cache repair",
  "ROUTE-B SQL/migration repair packet",
  "ROUTE-C runner target or payload repair",
  "ROUTE-D bounded read-only diagnostic",
  "ROUTE-E third bounded write attempt",
  "no third write retry",
  "no SQL execution",
  "no migration execution",
  "no insert, update, upsert, or delete operation",
  "no Supabase staging row creation",
  "no production `daily_prices` mutation",
  "no market-data fetch or ingestion",
  "no raw row payload, raw market payload, or secret output",
  "no public data source promotion",
  "no row coverage points",
  "no `scoreSource=real`",
  "Create or fill a repair evidence collection record"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity Supabase staging write repair evidence checklist slice",
  "docs/TW_EQUITY_SUPABASE_STAGING_WRITE_REPAIR_EVIDENCE_CHECKLIST.md",
  "scripts/report-tw-equity-supabase-staging-write-repair-evidence-checklist.mjs",
  "scripts/check-tw-equity-supabase-staging-write-repair-evidence-checklist.mjs",
  "tw_equity_supabase_staging_write_repair_evidence_checklist_ready_no_remote_action",
  "REST insert schema exposure, PostgREST schema cache, object/schema name match, RLS/policy posture, read-only versus insert path match, and insert payload/column contract",
  "No remote Supabase connection, SQL, migration execution, write attempt, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-supabase-staging-write-repair-evidence-checklist"] !==
  "node scripts/report-tw-equity-supabase-staging-write-repair-evidence-checklist.mjs"
) {
  problems.push("package.json missing report:tw-equity-supabase-staging-write-repair-evidence-checklist");
}

if (
  pkg.scripts?.["check:tw-equity-supabase-staging-write-repair-evidence-checklist"] !==
  "node scripts/check-tw-equity-supabase-staging-write-repair-evidence-checklist.mjs"
) {
  problems.push("package.json missing check:tw-equity-supabase-staging-write-repair-evidence-checklist");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-supabase-staging-write-repair-evidence-checklist.mjs")) {
    problems.push(`${pathName} missing TW equity Supabase staging write repair evidence checklist checker`);
  }
  if (!text.includes("tw-equity-supabase-staging-write-repair-evidence-checklist")) {
    problems.push(`${pathName} missing tw-equity-supabase-staging-write-repair-evidence-checklist name`);
  }
}

if (!reviewGate.includes('"tw-equity-supabase-staging-write-repair-evidence-checklist"')) {
  problems.push("review gate core set missing tw-equity-supabase-staging-write-repair-evidence-checklist");
}

const reportRun = spawnSync(process.execPath, [reportPath], { encoding: "utf8" });
if (reportRun.status !== 0) {
  problems.push(`${reportPath} failed to run`);
} else {
  try {
    const report = JSON.parse(reportRun.stdout);
    if (report.status !== "tw_equity_supabase_staging_write_repair_evidence_checklist_ready_no_remote_action") {
      problems.push(`${reportPath} emitted unexpected status`);
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
