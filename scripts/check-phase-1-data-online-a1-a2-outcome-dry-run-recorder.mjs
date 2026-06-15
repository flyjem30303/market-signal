import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_A1_A2_OUTCOME_INTAKE_LEDGER.md";
const ledgerPath = "data/source-gates/phase-1-data-online-a1-a2-handoff-outcomes.json";
const recorderPath = "scripts/record-phase-1-data-online-a1-a2-outcome-dry-run.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const ledgerBefore = readText(ledgerPath);
const recorder = readText(recorderPath);
const packageJsonText = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const ledger = parseJson(ledgerBefore, "ledger");
const dryRunAccepted = runRecorder([
  "--dry-run",
  "--id",
  "a1_etf_source_rights_acceptance_evidence_outcome",
  "--status",
  "accepted",
  "--recordedBy",
  "PM",
  "--safe-summary",
  "No-secret ETF source-rights evidence accepted for PM receiver routing only.",
  "--source-reference-label",
  "a1-no-secret-etf-evidence-label",
  "--remaining-risk",
  "No execution, write, readback, row coverage, or runtime promotion is authorized."
]);
const dryRunRepair = runRecorder([
  "--dry-run",
  "--id",
  "a1_twii_operator_presence_shape_outcome",
  "--status",
  "repair_required",
  "--recordedBy",
  "PM",
  "--safe-summary",
  "TWII operator presence shape is missing required no-secret fields.",
  "--source-reference-label",
  "twii-operator-shape-review-label",
  "--remaining-risk",
  "TWII remains blocked before any separate authorization gate."
]);
const ledgerAfter = readText(ledgerPath);

validateDoc();
validateLedgerUnchanged();
validateRecorderSource();
validateRegistration();
validateDryRunReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_a1_a2_outcome_dry_run_recorder_ready_no_apply"
    : "phase_1_data_online_a1_a2_outcome_dry_run_recorder_blocked",
  decision: "ALLOW_DRY_RUN_OUTCOME_RECORDING_ONLY",
  recorderPath,
  ledgerPath,
  ledgerUnchanged: ledgerBefore === ledgerAfter,
  acceptedRoute: dryRunAccepted.pmReceiverRoute ?? null,
  repairRoute: dryRunRepair.pmReceiverRoute ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateDoc() {
  const requiredTokens = [
    "cmd.exe /c npm run record:phase-1-data-online-a1-a2-outcome-dry-run",
    "phase_1_data_online_a1_a2_outcome_dry_run_recorder_ready_no_apply",
    "Dry-run recording does not modify the ledger",
    "`accepted` routes to `open_separate_lane_authorization_gate_before_any_write_or_promotion`",
    "`rejected` routes to `return_rejected_lane_to_repair_without_runtime_promotion`",
    "`repair_required` routes to `return_lane_to_a1_a2_repair_with_missing_fields_only`",
    "`deferred` routes to `keep_data_online_no_go_and_continue_mock_runtime_truthfulness`"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);
}

function validateLedgerUnchanged() {
  if (ledgerBefore !== ledgerAfter) problems.push("dry-run recorder modified the ledger");
  if (!Array.isArray(ledger.outcomes) || ledger.outcomes.length !== 3) problems.push("ledger should still have exactly 3 outcomes");
  for (const item of ledger.outcomes ?? []) {
    if (item.status !== "pending") problems.push(`${item.id} should remain pending before real PM review`);
  }
}

function validateRecorderSource() {
  if (!recorder.includes("mode: \"phase_1_data_online_a1_a2_outcome_dry_run_recording\"")) {
    problems.push("recorder missing mode marker");
  }
  if (!recorder.includes("status: \"dry_run\"")) problems.push("recorder must only emit dry_run");
  for (const token of [
    "fs.writeFileSync",
    "@supabase/supabase-js",
    "createClient",
    ".from(",
    ".insert(",
    ".upsert(",
    "SUPABASE_SERVICE_ROLE_KEY"
  ]) {
    if (recorder.includes(token)) problems.push(`recorder contains forbidden token ${token}`);
  }
}

function validateRegistration() {
  const scriptName = "record:phase-1-data-online-a1-a2-outcome-dry-run";
  const scriptCommand = "node scripts/record-phase-1-data-online-a1-a2-outcome-dry-run.mjs";
  const checkName = "check:phase-1-data-online-a1-a2-outcome-dry-run-recorder";
  const checkCommand = "node scripts/check-phase-1-data-online-a1-a2-outcome-dry-run-recorder.mjs";
  const packageJson = parseJson(packageJsonText, "package.json");
  if (packageJson.scripts?.[scriptName] !== scriptCommand) problems.push(`${scriptName} not registered in package.json`);
  if (packageJson.scripts?.[checkName] !== checkCommand) problems.push(`${checkName} not registered in package.json`);
  if (!reviewGate.includes("scripts/check-phase-1-data-online-a1-a2-outcome-dry-run-recorder.mjs")) {
    problems.push("review gate does not execute dry-run recorder checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-a1-a2-outcome-dry-run-recorder"')) {
    problems.push("review gate focused set missing dry-run recorder checker");
  }
}

function validateDryRunReports() {
  expect(dryRunAccepted.status, "dry_run", "accepted dry-run status");
  expect(dryRunAccepted.target, "a1_etf_source_rights_acceptance_evidence_outcome", "accepted target");
  expect(dryRunAccepted.requestedStatus, "accepted", "accepted requestedStatus");
  expect(
    dryRunAccepted.pmReceiverRoute,
    "open_separate_lane_authorization_gate_before_any_write_or_promotion",
    "accepted pmReceiverRoute"
  );
  expect(dryRunRepair.status, "dry_run", "repair dry-run status");
  expect(dryRunRepair.requestedStatus, "repair_required", "repair requestedStatus");
  expect(
    dryRunRepair.pmReceiverRoute,
    "return_lane_to_a1_a2_repair_with_missing_fields_only",
    "repair pmReceiverRoute"
  );
  for (const [label, report] of Object.entries({ dryRunAccepted, dryRunRepair })) {
    expect(report.publicDataSource, "mock", `${label} publicDataSource`);
    expect(report.scoreSource, "mock", `${label} scoreSource`);
    for (const key of [
      "executionAllowedNow",
      "supabaseReadAllowedNow",
      "supabaseWriteAllowedNow",
      "rowCoverageAwardAllowedNow",
      "marketDataFetchAllowedNow",
      "runtimePromotionAllowedNow",
      "secretsPrinted"
    ]) {
      expect(report.safety?.[key], false, `${label} safety.${key}`);
    }
  }
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

function runRecorder(args) {
  const run = spawnSync(process.execPath, [recorderPath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 30000,
    windowsHide: true
  });
  if (run.status !== 0) {
    problems.push(`recorder exited ${run.status}: ${(run.stderr ?? "").slice(0, 200)}`);
    return {};
  }
  return parseJson(run.stdout, "recorder stdout");
}
