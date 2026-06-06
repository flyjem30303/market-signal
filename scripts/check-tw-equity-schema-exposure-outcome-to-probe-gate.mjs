import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-tw-equity-schema-exposure-outcome-to-probe-gate.mjs";
const outcomePath = "data/source-gates/tw-equity-schema-exposure-repair-outcomes.json";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const reportSource = read(reportPath);
const outcomeData = JSON.parse(read(outcomePath));
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "tw_equity_schema_exposure_outcome_to_probe_gate",
  "tw_equity_schema_exposure_outcome_to_probe_gate_ready_for_one_bounded_probe_rerun",
  "tw_equity_schema_exposure_outcome_to_probe_gate_blocked_repair_rejected",
  "tw_equity_schema_exposure_outcome_to_probe_gate_blocked_outcome_pending",
  "oneBoundedOpenApiProbeRerunAllowed",
  "thirdStagingWriteAttemptAllowed: false",
  "manual_non_data_changing_schema_exposure_repair_outcome_accepted",
  "CEO_APPROVED_TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_ONCE",
  "stillDoesNotAuthorize"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

if (!Array.isArray(outcomeData.outcomes)) problems.push(`${outcomePath} missing outcomes array`);
const outcome = outcomeData.outcomes?.find((item) => item.id === "tw-equity-postgrest-schema-exposure-cache-repair");
if (!outcome) {
  problems.push(`${outcomePath} missing tw-equity-postgrest-schema-exposure-cache-repair`);
} else {
  if (!["pending", "accepted", "rejected"].includes(outcome.outcome)) {
    problems.push(`${outcomePath} invalid outcome`);
  }
}

for (const phrase of [
  "Latest TW equity schema exposure outcome-to-probe gate slice",
  "scripts/report-tw-equity-schema-exposure-outcome-to-probe-gate.mjs",
  "scripts/check-tw-equity-schema-exposure-outcome-to-probe-gate.mjs",
  "tw_equity_schema_exposure_outcome_to_probe_gate_blocked_outcome_pending",
  "accepted outcome is required before the one bounded OpenAPI schema exposure probe rerun",
  "does not execute Supabase read, Supabase write, SQL, migration, third write attempt, staging rows, market-data fetch, public promotion, row coverage point, or real score source"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-schema-exposure-outcome-to-probe-gate"] !==
  "node scripts/report-tw-equity-schema-exposure-outcome-to-probe-gate.mjs"
) {
  problems.push("package.json missing report:tw-equity-schema-exposure-outcome-to-probe-gate");
}
if (
  pkg.scripts?.["check:tw-equity-schema-exposure-outcome-to-probe-gate"] !==
  "node scripts/check-tw-equity-schema-exposure-outcome-to-probe-gate.mjs"
) {
  problems.push("package.json missing check:tw-equity-schema-exposure-outcome-to-probe-gate");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-schema-exposure-outcome-to-probe-gate.mjs")) {
    problems.push(`${pathName} missing TW equity schema exposure outcome-to-probe gate checker`);
  }
  if (!text.includes("tw-equity-schema-exposure-outcome-to-probe-gate")) {
    problems.push(`${pathName} missing tw-equity-schema-exposure-outcome-to-probe-gate name`);
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
      "tw_equity_schema_exposure_outcome_to_probe_gate_ready_for_one_bounded_probe_rerun",
      "tw_equity_schema_exposure_outcome_to_probe_gate_blocked_repair_rejected",
      "tw_equity_schema_exposure_outcome_to_probe_gate_blocked_outcome_pending"
    ].includes(report.status)) {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    if (report.decision?.thirdStagingWriteAttemptAllowed !== false) {
      problems.push(`${reportPath} must not allow third write attempt`);
    }
    if (report.acceptedInput?.observedOutcome === "accepted") {
      if (report.decision?.oneBoundedOpenApiProbeRerunAllowed !== true) {
        problems.push(`${reportPath} accepted outcome must allow exactly one bounded probe rerun`);
      }
    } else if (report.decision?.oneBoundedOpenApiProbeRerunAllowed !== false) {
      problems.push(`${reportPath} non-accepted outcome must block probe rerun`);
    }
    for (const key of [
      "connectionAttempted",
      "sqlExecuted",
      "migrationExecuted",
      "supabaseReadAttempted",
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

for (const forbidden of [".insert(", ".update(", ".delete(", ".upsert(", "sb_secret_", "sb_publishable_"]) {
  if (reportSource.includes(forbidden)) problems.push(`${reportPath} contains forbidden token: ${forbidden}`);
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

