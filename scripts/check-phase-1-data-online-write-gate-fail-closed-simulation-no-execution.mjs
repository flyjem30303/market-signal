import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_WRITE_GATE_FAIL_CLOSED_SIMULATION_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);
const writeGatePreview = runJson(
  "scripts/check-phase-1-data-online-write-gate-dry-run-preview-no-execution.mjs",
  "write-gate dry-run preview"
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
    ? "phase_1_data_online_write_gate_fail_closed_simulation_no_execution_ready"
    : "phase_1_data_online_write_gate_fail_closed_simulation_no_execution_blocked",
  packetMode: "write_gate_fail_closed_simulation_no_execution",
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(writeGatePreview.status, "ok", "write-gate dry-run preview status");
  expect(
    writeGatePreview.guardedStatus,
    "phase_1_data_online_write_gate_dry_run_preview_no_execution_ready",
    "write-gate dry-run preview guarded status"
  );
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_write_gate_fail_closed_simulation_no_execution_ready",
    "write_gate_fail_closed_simulation_no_execution",
    "simulation_matrix_required",
    "all_missing_inputs_block_write",
    "missing_operator_values_blocks_write",
    "missing_credential_presence_blocks_write",
    "missing_rollback_plan_blocks_write",
    "missing_aggregate_readback_plan_blocks_write",
    "missing_post_run_review_blocks_write",
    "missing_duplicate_rejection_blocks_write",
    "missing_schema_cache_exposure_check_blocks_write",
    "missing_dashboard_api_exposure_check_blocks_write",
    "missing_pgrst205_regression_check_blocks_write",
    "writeGateExecutableNow=false",
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
    packageJson.scripts?.["check:phase-1-data-online-write-gate-fail-closed-simulation-no-execution"] !==
    "node scripts/check-phase-1-data-online-write-gate-fail-closed-simulation-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-write-gate-fail-closed-simulation-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-write-gate-fail-closed-simulation-no-execution.mjs")) {
    problems.push("review gate missing write-gate fail-closed simulation checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-write-gate-fail-closed-simulation-no-execution"')) {
    problems.push("focused review gate missing write-gate fail-closed simulation checker");
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
