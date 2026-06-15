import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_EXTERNAL_PLATFORM_EVIDENCE_CHECKLIST_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);
const localLane = runJson(
  "scripts/check-phase-1-data-online-local-lane-checklist-runner-no-execution.mjs",
  "local-lane checklist runner"
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
    ? "phase_1_data_online_external_platform_evidence_checklist_no_execution_ready"
    : "phase_1_data_online_external_platform_evidence_checklist_no_execution_blocked",
  packetMode: "external_platform_evidence_checklist_no_execution",
  writeGateExecutableNow: false,
  externalPlatformEvidenceReady: ok,
  externalPlatformEvidenceItems: [
    "schema_cache_evidence_required",
    "dashboard_api_exposure_evidence_required",
    "pgrst205_regression_evidence_required",
    "metadata_readiness_evidence_required",
    "write_path_exposure_evidence_required"
  ],
  remainingOperatorBlockers: ["operator_values_missing", "credential_presence_unverified"],
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(localLane.status, "ok", "local-lane checklist runner status");
  expect(
    localLane.guardedStatus,
    "phase_1_data_online_local_lane_checklist_runner_no_execution_ready",
    "local-lane checklist runner guarded status"
  );
  expect(localLane.localBlockersPlanned, true, "local-lane checklist runner localBlockersPlanned");
  expect(localLane.writeGateExecutableNow, false, "local-lane checklist runner writeGateExecutableNow");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_external_platform_evidence_checklist_no_execution_ready",
    "external_platform_evidence_checklist_no_execution",
    "schema_cache_evidence_required",
    "dashboard_api_exposure_evidence_required",
    "pgrst205_regression_evidence_required",
    "metadata_readiness_evidence_required",
    "write_path_exposure_evidence_required",
    "no_secret_output_required",
    "external_platform_blockers_mapped",
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
    packageJson.scripts?.["check:phase-1-data-online-external-platform-evidence-checklist-no-execution"] !==
    "node scripts/check-phase-1-data-online-external-platform-evidence-checklist-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-external-platform-evidence-checklist-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-external-platform-evidence-checklist-no-execution.mjs")) {
    problems.push("review gate missing external-platform evidence checklist checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-external-platform-evidence-checklist-no-execution"')) {
    problems.push("focused review gate missing external-platform evidence checklist checker");
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
