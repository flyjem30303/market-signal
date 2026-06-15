import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_DASHBOARD_API_EXPOSURE_EVIDENCE.md";
const evidencePath = "data/evidence-intake/phase-1-dashboard-api-exposure-evidence.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const evidence = parseJson(readText(evidencePath), evidencePath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const readonlyResult = runJson(
  "scripts/check-phase-1-data-online-bounded-readonly-attempt-result-20260615-a.mjs",
  "bounded readonly attempt result"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validateEvidence();
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_dashboard_api_exposure_evidence_ready"
    : "phase_1_data_online_dashboard_api_exposure_evidence_blocked",
  evidenceMode: "no_secret_dashboard_api_exposure_evidence",
  dashboardApiExposureStatus: evidence.dashboardApiExposureStatus ?? null,
  reducedBlocker: "dashboard_api_exposure_unverified",
  remainingBlockersAfterDashboard: ["operator_values_missing", "credential_presence_unverified"],
  writeGateExecutableNow: false,
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(readonlyResult.status, "ok", "bounded readonly result status");
  expect(
    readonlyResult.guardedStatus,
    "phase_1_data_online_bounded_readonly_attempt_result_20260615_a_ready",
    "bounded readonly result guarded status"
  );
  expect(readonlyResult.remoteAttempted, true, "bounded readonly result remoteAttempted");
  expect(readonlyResult.rowCount, 1260, "bounded readonly result rowCount");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateEvidence() {
  expect(evidence.status, "dashboard_api_exposure_evidence_ready", "evidence status");
  expect(evidence.evidenceMode, "no_secret_dashboard_api_exposure_evidence", "evidence mode");
  expect(
    evidence.dashboardApiExposureStatus,
    "accepted_read_path_for_daily_prices",
    "dashboardApiExposureStatus"
  );
  expect(evidence.readonlyAttemptId, "phase1-data-online-readonly-20260615-a", "readonlyAttemptId");
  expect(evidence.targetTable, "daily_prices", "targetTable");
  expect(evidence.aggregateReadQueryStatus, "ok", "aggregateReadQueryStatus");
  expect(evidence.aggregateRowCount, 1260, "aggregateRowCount");
  expect(evidence.reducesBlocker, "dashboard_api_exposure_unverified", "reducesBlocker");
  expect(evidence.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(evidence.publicDataSource, "mock", "publicDataSource");
  expect(evidence.scoreSource, "mock", "scoreSource");
  for (const key of [
    "sqlExecuted",
    "supabaseWriteAttempted",
    "dailyPricesMutated",
    "marketDataFetched",
    "rawPayloadIncluded",
    "rowPayloadIncluded",
    "secretsIncluded",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (evidence.safety?.[key] !== false) problems.push(`evidence safety.${key} must be false`);
  }
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_dashboard_api_exposure_evidence_ready",
    "no_secret_dashboard_api_exposure_evidence",
    "accepted_read_path_for_daily_prices",
    "dashboard_api_exposure_unverified",
    "remainingBlockersAfterDashboard",
    "operator_values_missing",
    "credential_presence_unverified",
    "daily_prices",
    "rowCount=1260",
    "writeGateExecutableNow=false",
    "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No SQL",
    "No Supabase write",
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
    packageJson.scripts?.["check:phase-1-data-online-dashboard-api-exposure-evidence"] !==
    "node scripts/check-phase-1-data-online-dashboard-api-exposure-evidence.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-dashboard-api-exposure-evidence");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-dashboard-api-exposure-evidence.mjs")) {
    problems.push("review gate missing dashboard API exposure evidence checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-dashboard-api-exposure-evidence"')) {
    problems.push("focused review gate missing dashboard API exposure evidence checker");
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [docPath, doc],
    [evidencePath, JSON.stringify(evidence)]
  ]) {
    for (const token of [
      "sb_secret_",
      "SUPABASE_SERVICE_ROLE_KEY",
      "executeSwitchValue=",
      "confirmationPhraseValue=",
      "sqlExecuted=true",
      "supabaseWriteAttempted=true",
      "dailyPricesMutated=true",
      "marketDataFetched=true",
      "rawPayloadIncluded=true",
      "rowPayloadIncluded=true",
      "secretsIncluded=true",
      "publicDataSource=supabase",
      "scoreSource=real",
      "writeGateExecutableNow=true"
    ]) {
      if (text.includes(token)) problems.push(`${label} contains forbidden token ${token}`);
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
