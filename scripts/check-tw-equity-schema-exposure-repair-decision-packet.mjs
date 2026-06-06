import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_SCHEMA_EXPOSURE_REPAIR_DECISION_PACKET.md";
const reportPath = "scripts/report-tw-equity-schema-exposure-repair-decision-packet.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Schema Exposure Repair Decision Packet",
  "tw_equity_schema_exposure_repair_decision_packet_ready_no_repair_executed",
  "PostgREST schema exposure or schema cache mismatch",
  "not candidate generation, runner target naming, or local insert column shape",
  "inspect Supabase Dashboard API schema exposure",
  "dashboard/manual schema cache reload",
  "rerun exactly one bounded PostgREST schema exposure probe",
  "only if OpenAPI exposure becomes complete",
  "no third staging write attempt",
  "no SQL execution",
  "no migration execution",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity schema exposure repair decision packet slice",
  "docs/TW_EQUITY_SCHEMA_EXPOSURE_REPAIR_DECISION_PACKET.md",
  "scripts/report-tw-equity-schema-exposure-repair-decision-packet.mjs",
  "scripts/check-tw-equity-schema-exposure-repair-decision-packet.mjs",
  "tw_equity_schema_exposure_repair_decision_packet_ready_no_repair_executed",
  "root-cause candidate is PostgREST schema exposure or schema cache mismatch",
  "does not authorize SQL, migration execution, schema cache refresh, Supabase write, third write attempt, staging row creation, market-data fetch, public promotion, row coverage point, or real score source"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-schema-exposure-repair-decision-packet"] !==
  "node scripts/report-tw-equity-schema-exposure-repair-decision-packet.mjs"
) {
  problems.push("package.json missing report:tw-equity-schema-exposure-repair-decision-packet");
}

if (
  pkg.scripts?.["check:tw-equity-schema-exposure-repair-decision-packet"] !==
  "node scripts/check-tw-equity-schema-exposure-repair-decision-packet.mjs"
) {
  problems.push("package.json missing check:tw-equity-schema-exposure-repair-decision-packet");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-schema-exposure-repair-decision-packet.mjs")) {
    problems.push(`${pathName} missing TW equity schema exposure repair decision checker`);
  }
  if (!text.includes("tw-equity-schema-exposure-repair-decision-packet")) {
    problems.push(`${pathName} missing tw-equity-schema-exposure-repair-decision-packet name`);
  }
}

const reportRun = spawnSync(process.execPath, [reportPath], { encoding: "utf8" });
if (reportRun.status !== 0) {
  problems.push(`${reportPath} failed to run`);
} else {
  try {
    const report = JSON.parse(reportRun.stdout);
    if (report.status !== "tw_equity_schema_exposure_repair_decision_packet_ready_no_repair_executed") {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    if (report.ceoDecision?.rootCauseCandidate !== "postgrest_schema_exposure_or_schema_cache_mismatch") {
      problems.push(`${reportPath} emitted unexpected root cause candidate`);
    }
    if (report.futureAllowedActions?.thirdWriteAttemptAllowedByThisPacket !== false) {
      problems.push(`${reportPath} must not allow third write attempt`);
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
    if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
      problems.push(`${reportPath} must keep mock public/score source`);
    }
  } catch {
    problems.push(`${reportPath} did not emit JSON`);
  }
}

for (const [pathName, text] of [
  [docPath, doc],
  [reportPath, reportSource]
]) {
  for (const forbidden of [".insert(", ".update(", ".delete(", ".upsert(", "sb_secret_", "sb_publishable_"]) {
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
    return "{}";
  }

  return fs.readFileSync(filePath, "utf8");
}
