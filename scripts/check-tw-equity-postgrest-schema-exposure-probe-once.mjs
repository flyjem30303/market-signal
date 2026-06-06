import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const runnerPath = "scripts/report-tw-equity-postgrest-schema-exposure-probe-once.mjs";
const packagePath = "package.json";

const runner = read(runnerPath);
const pkg = JSON.parse(read(packagePath));

for (const phrase of [
  "CEO_APPROVED_TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_ONCE",
  "TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_CONFIRMATION",
  "data/source-gates/tw-equity-schema-exposure-repair-outcomes.json",
  "TW_EQUITY_SCHEMA_EXPOSURE_REPAIR_OUTCOME_PATH",
  "tw-equity-postgrest-schema-exposure-cache-repair",
  "tw_equity_postgrest_schema_exposure_probe_blocked_repair_outcome_accepted_required",
  "repair_outcome_accepted_required",
  "application/openapi+json",
  "sanitizedSchemaMetadataOnly",
  "tw_equity_postgrest_schema_exposure_probe_schema_exposure_complete_write_path_still_unresolved",
  "tw_equity_postgrest_schema_exposure_probe_schema_exposure_incomplete",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "supabaseWriteAttempted: false",
  "sqlExecuted: false",
  "migrationExecuted: false"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const forbidden of [".insert(", ".update(", ".delete(", ".upsert(", "console.log(process.env", "sb_secret_", "sb_publishable_"]) {
  if (runner.includes(forbidden)) problems.push(`${runnerPath} contains forbidden token: ${forbidden}`);
}

if (
  pkg.scripts?.["report:tw-equity-postgrest-schema-exposure-probe-once"] !==
  "node scripts/report-tw-equity-postgrest-schema-exposure-probe-once.mjs"
) {
  problems.push("package.json missing report:tw-equity-postgrest-schema-exposure-probe-once");
}

if (
  pkg.scripts?.["check:tw-equity-postgrest-schema-exposure-probe-once"] !==
  "node scripts/check-tw-equity-postgrest-schema-exposure-probe-once.mjs"
) {
  problems.push("package.json missing check:tw-equity-postgrest-schema-exposure-probe-once");
}

const runWithoutConfirmation = spawnSync(process.execPath, [runnerPath], { encoding: "utf8" });
if (runWithoutConfirmation.status !== 0) {
  problems.push(`${runnerPath} failed without confirmation`);
} else {
  try {
    const report = JSON.parse(runWithoutConfirmation.stdout);
    if (report.status !== "tw_equity_postgrest_schema_exposure_probe_not_run_confirmation_required") {
      problems.push(`${runnerPath} must fail closed without confirmation`);
    }
    if (report.connectionAttempted !== false) problems.push(`${runnerPath} must not connect without confirmation`);
    if (report.postRunReview?.written !== false) problems.push(`${runnerPath} must not write review without confirmation`);
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
      "secretsPrinted"
    ]) {
      if (report.safety?.[key] !== false) problems.push(`${runnerPath} safety.${key} must be false`);
    }
  } catch {
    problems.push(`${runnerPath} did not emit JSON without confirmation`);
  }
}

const runWithConfirmationButPendingOutcome = spawnSync(process.execPath, [runnerPath], {
  encoding: "utf8",
  env: {
    ...process.env,
    TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_CONFIRMATION: "CEO_APPROVED_TW_EQUITY_POSTGREST_SCHEMA_EXPOSURE_PROBE_ONCE",
    TW_EQUITY_SCHEMA_EXPOSURE_REPAIR_OUTCOME_PATH: writeTemporaryPendingOutcomeFixture()
  }
});
if (runWithConfirmationButPendingOutcome.status !== 0) {
  problems.push(`${runnerPath} failed with confirmation and pending repair outcome`);
} else {
  try {
    const report = JSON.parse(runWithConfirmationButPendingOutcome.stdout);
    if (report.status !== "tw_equity_postgrest_schema_exposure_probe_blocked_repair_outcome_accepted_required") {
      problems.push(`${runnerPath} must fail closed when repair outcome is not accepted`);
    }
    if (report.repairOutcomeGate?.accepted !== false) {
      problems.push(`${runnerPath} must report repair outcome gate not accepted`);
    }
    if (report.connectionAttempted !== false) problems.push(`${runnerPath} must not connect without accepted repair outcome`);
    if (report.postRunReview?.written !== false) problems.push(`${runnerPath} must not write review without accepted repair outcome`);
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
      "secretsPrinted"
    ]) {
      if (report.safety?.[key] !== false) problems.push(`${runnerPath} safety.${key} must be false with pending repair outcome`);
    }
  } catch {
    problems.push(`${runnerPath} did not emit JSON with confirmation and pending repair outcome`);
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

function writeTemporaryPendingOutcomeFixture() {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "tw-equity-schema-exposure-"));
  const tempPath = path.join(tempDirectory, "repair-outcomes-pending.json");
  const fixture = {
    outcomes: [
      {
        allowedNextStepWhenAccepted: "one_bounded_postgrest_openapi_schema_exposure_probe_rerun_only",
        blockedNextStepWhenRejected: "create_new_schema_exposure_repair_packet_before_any_remote_probe_or_write",
        decisionNote: "Temporary checker fixture keeps repair outcome pending to verify fail-closed behavior.",
        id: "tw-equity-postgrest-schema-exposure-cache-repair",
        outcome: "pending",
        recordedAt: null,
        recordedBy: "not_recorded",
        title: "TW equity PostgREST schema exposure/cache repair"
      }
    ]
  };

  fs.writeFileSync(tempPath, `${JSON.stringify(fixture, null, 2)}\n`);
  return tempPath;
}
