import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_WRITE_GATE_DRY_RUN_PREVIEW_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);
const finalReview = runJson(
  "scripts/check-phase-1-data-online-final-preexecution-review-artifact-no-execution.mjs",
  "final preexecution review artifact"
);
const serverOnlyPresenceRecheck = runJson(
  "scripts/check-phase-1-data-online-server-only-presence-recheck-no-execution.mjs",
  "server-only presence recheck"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_write_gate_dry_run_preview_no_execution_ready"
    : "phase_1_data_online_write_gate_dry_run_preview_no_execution_blocked",
  packetMode: "write_gate_dry_run_preview_no_execution",
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(finalReview.status, "ok", "final preexecution review artifact status");
  expect(
    finalReview.guardedStatus,
    "phase_1_data_online_final_preexecution_review_artifact_no_execution_ready",
    "final preexecution review artifact guarded status"
  );
  expect(serverOnlyPresenceRecheck.status, "ok", "server-only presence recheck status");
  expect(
    serverOnlyPresenceRecheck.guardedStatus,
    "phase_1_data_online_server_only_presence_recheck_no_execution_ready",
    "server-only presence recheck guarded status"
  );
  expect(
    serverOnlyPresenceRecheck.presenceRecheckStatus,
    "prepared_waiting_external_presence",
    "server-only presence recheck status"
  );
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_write_gate_dry_run_preview_no_execution_ready",
    "write_gate_dry_run_preview_no_execution",
    "fail_closed_default_required",
    "write_gate_must_not_execute",
    "server_only_presence_recheck_required",
    "prepared_waiting_external_presence",
    "operator_values_absent_blocks_write",
    "credential_presence_absent_blocks_write",
    "rollback_plan_absent_blocks_write",
    "aggregate_readback_plan_absent_blocks_write",
    "post_run_review_absent_blocks_write",
    "duplicate_rejection_absent_blocks_write",
    "schema_cache_exposure_check_required",
    "dashboard_api_exposure_check_required",
    "pgrst205_regression_check_required",
    "twii_and_etf_phase_1_missing_row_closure_only",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No SQL",
    "No Supabase read or write",
    "No staging rows",
    "No `daily_prices` mutation",
    "No market-row fetch",
    "No raw payload output",
    "No source promotion",
    "No score promotion",
    "No public real-data claim",
    "No investment advice"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-data-online-write-gate-dry-run-preview-no-execution"] !==
    "node scripts/check-phase-1-data-online-write-gate-dry-run-preview-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-write-gate-dry-run-preview-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-write-gate-dry-run-preview-no-execution.mjs")) {
    problems.push("review gate missing write-gate dry-run preview checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-write-gate-dry-run-preview-no-execution"')) {
    problems.push("focused review gate missing write-gate dry-run preview checker");
  }
}

function validateBoundaries() {
  const forbidden = [
    "executeSwitchValue=",
    "confirmationPhraseValue=",
    "SUPABASE_SERVICE_ROLE_KEY=",
    "sqlExecuted=true",
    "supabaseReadAllowedNow=true",
    "supabaseWriteAllowedNow=true",
    "stagingRowsCreated=true",
    "dailyPricesMutated=true",
    "marketRowsFetched=true",
    "rawPayloadStored=true",
    "writeGateExecutableNow=true",
    "publicDataSource=supabase",
    "scoreSource=real",
    "executionAllowedNow=true"
  ];
  for (const token of forbidden) if (doc.includes(token)) problems.push(`doc contains unsafe token ${token}`);
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}

function runJson(filePath, label) {
  const run = spawnSync(process.execPath, [filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) {
    problems.push(`${label} exited ${run.status}`);
    return {};
  }
  return parseJson(run.stdout, label);
}
