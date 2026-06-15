import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_WRITE_GATE_READINESS_ESCALATION_MAP_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);
const checklist = runJson(
  "scripts/check-phase-1-data-online-write-gate-checklist-runner-no-execution.mjs",
  "write-gate checklist runner"
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
    ? "phase_1_data_online_write_gate_readiness_escalation_map_no_execution_ready"
    : "phase_1_data_online_write_gate_readiness_escalation_map_no_execution_blocked",
  packetMode: "write_gate_readiness_escalation_map_no_execution",
  writeGateExecutableNow: false,
  reducedByEvidenceBlockers: checklist.reducedBlockers ?? [],
  operatorAuthorizedBlockers: checklist.remainingBlockers ?? [],
  externalPlatformBlockers: [],
  dashboardApiExposureStatus: checklist.dashboardApiExposureStatus ?? null,
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(checklist.status, "ok", "write-gate checklist runner status");
  expect(
    checklist.guardedStatus,
    "phase_1_data_online_write_gate_checklist_runner_no_execution_ready",
    "write-gate checklist runner guarded status"
  );
  expect(checklist.writeGateExecutableNow, false, "checklist writeGateExecutableNow");
  expect(
    checklist.dashboardApiExposureStatus,
    "accepted_read_path_for_daily_prices",
    "checklist dashboardApiExposureStatus"
  );
  const expectedRemainingBlockers = [
    "operator_values_missing",
    "credential_presence_unverified",
    "operator_owned_presence_confirmation_unverified",
    "external_presence_acceptance_unverified",
    "external_presence_reviewed_result_missing"
  ];
  const remaining = Array.isArray(checklist.remainingBlockers) ? checklist.remainingBlockers : [];
  if (remaining.join(",") !== expectedRemainingBlockers.join(",")) {
    problems.push(
      `checklist remainingBlockers expected external/operator presence chain but got ${remaining.join(",")}`
    );
  }
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_write_gate_readiness_escalation_map_no_execution_ready",
    "write_gate_readiness_escalation_map_no_execution",
    "reduced_by_evidence_blockers",
    "operator_authorized_blockers",
    "external_platform_blockers",
    "rollback_plan_unverified",
    "aggregate_readback_plan_unverified",
    "post_run_review_unverified",
    "duplicate_rejection_unverified",
    "operator_values_missing",
    "credential_presence_unverified",
    "operator_owned_presence_confirmation_unverified",
    "external_presence_acceptance_unverified",
    "external_presence_reviewed_result_missing",
    "schema_cache_exposure_unverified",
    "dashboard_api_exposure_unverified",
    "accepted_read_path_for_daily_prices",
    "pgrst205_regression_unverified",
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
    packageJson.scripts?.["check:phase-1-data-online-write-gate-readiness-escalation-map-no-execution"] !==
    "node scripts/check-phase-1-data-online-write-gate-readiness-escalation-map-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-write-gate-readiness-escalation-map-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-write-gate-readiness-escalation-map-no-execution.mjs")) {
    problems.push("review gate missing write-gate readiness escalation map checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-write-gate-readiness-escalation-map-no-execution"')) {
    problems.push("focused review gate missing write-gate readiness escalation map checker");
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
