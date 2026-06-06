import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const runbookPath = "docs/TW_EQUITY_SCHEMA_EXPOSURE_REPAIR_RUNBOOK.md";
const outcomePath = "data/source-gates/tw-equity-schema-exposure-repair-outcomes.json";
const reportPath = "scripts/report-tw-equity-schema-exposure-repair-runbook.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const runbook = read(runbookPath);
const outcomeData = JSON.parse(read(outcomePath));
const reportSource = read(reportPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Schema Exposure Repair Runbook",
  "tw_equity_schema_exposure_repair_runbook_ready_awaiting_manual_outcome",
  "PostgREST schema exposure or schema cache mismatch",
  "non-data-changing path",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "Record the outcome in `data/source-gates/tw-equity-schema-exposure-repair-outcomes.json`",
  "Accepted outcome only allows the next bounded OpenAPI schema exposure probe",
  "It does not authorize a third staging write attempt",
  "no SQL execution",
  "no migration execution",
  "no insert/update/upsert/delete operation",
  "no market-data fetch or ingestion",
  "no secret output",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!runbook.includes(phrase)) problems.push(`${runbookPath} missing: ${phrase}`);
}

const outcomes = Array.isArray(outcomeData.outcomes) ? outcomeData.outcomes : [];
if (outcomes.length !== 1) problems.push(`${outcomePath} must contain exactly one outcome`);
const outcome = outcomes[0] ?? {};
if (outcome.id !== "tw-equity-postgrest-schema-exposure-cache-repair") {
  problems.push(`${outcomePath} missing expected repair outcome id`);
}
if (!["pending", "accepted", "rejected"].includes(outcome.outcome)) {
  problems.push(`${outcomePath} invalid outcome`);
}
if (outcome.outcome === "pending" && (outcome.recordedBy !== "not_recorded" || outcome.recordedAt !== null)) {
  problems.push(`${outcomePath} pending outcome must use not_recorded and null recordedAt`);
}
if (outcome.outcome !== "pending" && (typeof outcome.recordedAt !== "string" || !["CEO", "Chairman"].includes(outcome.recordedBy))) {
  problems.push(`${outcomePath} recorded outcome must include CEO/Chairman and recordedAt`);
}
if (typeof outcome.decisionNote !== "string" || outcome.decisionNote.length < 40) {
  problems.push(`${outcomePath} decisionNote too short`);
}
if (outcome.allowedNextStepWhenAccepted !== "one_bounded_postgrest_openapi_schema_exposure_probe_rerun_only") {
  problems.push(`${outcomePath} accepted next step must be bounded OpenAPI probe only`);
}
if (outcome.blockedNextStepWhenRejected !== "create_new_schema_exposure_repair_packet_before_any_remote_probe_or_write") {
  problems.push(`${outcomePath} rejected next step must block probe/write`);
}

for (const phrase of [
  "Latest TW equity schema exposure repair runbook slice",
  "docs/TW_EQUITY_SCHEMA_EXPOSURE_REPAIR_RUNBOOK.md",
  "data/source-gates/tw-equity-schema-exposure-repair-outcomes.json",
  "scripts/report-tw-equity-schema-exposure-repair-runbook.mjs",
  "scripts/check-tw-equity-schema-exposure-repair-runbook.mjs",
  "tw_equity_schema_exposure_repair_runbook_ready_awaiting_manual_outcome",
  "one accepted/rejected non-data-changing dashboard/manual schema exposure or cache repair outcome",
  "does not authorize SQL, migration execution, schema cache refresh execution, Supabase write, third write attempt, staging row creation, market-data fetch, public promotion, row coverage point, or real score source"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-schema-exposure-repair-runbook"] !==
  "node scripts/report-tw-equity-schema-exposure-repair-runbook.mjs"
) {
  problems.push("package.json missing report:tw-equity-schema-exposure-repair-runbook");
}
if (
  pkg.scripts?.["check:tw-equity-schema-exposure-repair-runbook"] !==
  "node scripts/check-tw-equity-schema-exposure-repair-runbook.mjs"
) {
  problems.push("package.json missing check:tw-equity-schema-exposure-repair-runbook");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-schema-exposure-repair-runbook.mjs")) {
    problems.push(`${pathName} missing TW equity schema exposure repair runbook checker`);
  }
  if (!text.includes("tw-equity-schema-exposure-repair-runbook")) {
    problems.push(`${pathName} missing tw-equity-schema-exposure-repair-runbook name`);
  }
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
    if (![
      "tw_equity_schema_exposure_repair_runbook_ready_awaiting_manual_outcome",
      "tw_equity_schema_exposure_repair_runbook_outcome_accepted_probe_rerun_ready",
      "tw_equity_schema_exposure_repair_runbook_outcome_rejected_probe_blocked"
    ].includes(report.status)) {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    if (report.currentRootCauseCandidate !== "postgrest_schema_exposure_or_schema_cache_mismatch") {
      problems.push(`${reportPath} emitted unexpected root cause candidate`);
    }
    for (const key of [
      "connectionAttempted",
      "sqlExecuted",
      "migrationExecuted",
      "supabaseWriteAttempted",
      "thirdWriteAttemptAllowed",
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
  [runbookPath, runbook],
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

