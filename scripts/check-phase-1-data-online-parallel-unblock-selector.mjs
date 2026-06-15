import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_PARALLEL_UNBLOCK_SELECTOR.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJsonText = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data online go/no-go");
const executionSelector = runJson("scripts/check-phase-1-data-online-execution-selector.mjs", "data online execution selector");
const twiiIntake = runJson("scripts/check-phase-1-twii-operator-decision-intake-readiness.mjs", "TWII operator intake readiness");
const twiiPacket = runJson("scripts/check-phase-1-twii-operator-decision-packet-request.mjs", "TWII operator packet request");
const etfSelector = runJson("scripts/check-phase-1-etf-parallel-coverage-repair-selector.mjs", "ETF parallel selector");
const a2Copy = runJson("scripts/check-a2-twii-operator-decision-public-copy-guard.mjs", "A2 TWII public copy guard");
const briefAlignment = runJson("scripts/check-public-beta-production-brief-alignment.mjs", "public brief alignment");
const finalReadiness = runJson("scripts/check-phase-1-public-beta-final-readiness-rollup.mjs", "final public readiness");

validateDoc();
validateRegistration();
validateReports();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_parallel_unblock_selector_ready_no_execution"
    : "phase_1_data_online_parallel_unblock_selector_blocked",
  decision: "KEEP_PARALLEL_UNBLOCK_ACTIVE_DATA_ONLINE_NO_GO",
  coverage: dataOnline.coverage ?? null,
  routes: {
    pm: "keep_parallel_unblock_selector_current_until_one_lane_becomes_executable",
    a1Twii: "prepare_twii_operator_values_shape_review_without_value_storage_or_execution",
    a1Etf: "prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch",
    a2: "review_twii_etf_public_copy_against_non_advice_and_source_boundary"
  },
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  twiiExecutionAllowedNow: dataOnline.twiiExecutionAllowedNow ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_parallel_unblock_selector_ready_no_execution",
    "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
    "Level 1 expected rows: `360`",
    "Level 1 observed rows: `182`",
    "Level 1 missing rows: `178`",
    "TW equity rows: `180/180`",
    "TWII missing rows: `60`",
    "ETF missing rows: `118`",
    "public data source: `mock`",
    "score source: `mock`",
    "TWII execution allowed now: `false`",
    "`check:phase-1-data-online-go-no-go-status`",
    "`check:phase-1-data-online-execution-selector`",
    "`check:phase-1-twii-operator-decision-intake-readiness`",
    "`check:phase-1-twii-operator-decision-packet-request`",
    "`check:phase-1-etf-parallel-coverage-repair-selector`",
    "`check:a2-twii-operator-decision-public-copy-guard`",
    "`check:public-beta-production-brief-alignment`",
    "`check:phase-1-public-beta-final-readiness-rollup`",
    "`keep_parallel_unblock_selector_current_until_one_lane_becomes_executable`",
    "`prepare_twii_operator_values_shape_review_without_value_storage_or_execution`",
    "`prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch`",
    "`review_twii_etf_public_copy_against_non_advice_and_source_boundary`",
    "`twii_final_authorization_stopline_and_server_only_pre_execution_review`",
    "`etf_sanitized_candidate_artifact_gate_for_118_missing_rows`"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`doc missing ${token}`);

  const boundaryTokens = [
    "SQL execution",
    "Supabase connection, read, or write",
    "staging-row creation",
    "`daily_prices` mutation",
    "TWII or ETF market-row fetch, ingestion, storage, output, or commit",
    "operator value storage",
    "candidate row acceptance",
    "row coverage points",
    "`publicDataSource=supabase`",
    "`scoreSource=real`",
    "investment advice"
  ];
  for (const token of boundaryTokens) if (!doc.includes(token)) problems.push(`doc missing boundary ${token}`);

  const forbiddenTokens = [
    "source rights are accepted now",
    "operator values are accepted now",
    "write Supabase now",
    "mutate `daily_prices` now",
    "fetch market rows now",
    "publicDataSource=supabase is approved",
    "scoreSource=real is approved",
    "sb_secret_",
    "SUPABASE_SERVICE_ROLE_KEY="
  ];
  for (const token of forbiddenTokens) if (doc.includes(token)) problems.push(`doc contains forbidden token ${token}`);
}

function validateRegistration() {
  const scriptName = "check:phase-1-data-online-parallel-unblock-selector";
  const scriptCommand = "node scripts/check-phase-1-data-online-parallel-unblock-selector.mjs";
  let packageJson = {};
  try {
    packageJson = JSON.parse(packageJsonText);
  } catch (error) {
    problems.push(`package.json parse failed: ${error.message}`);
  }
  if (packageJson.scripts?.[scriptName] !== scriptCommand) problems.push(`${scriptName} not registered in package.json`);
  if (!reviewGate.includes("scripts/check-phase-1-data-online-parallel-unblock-selector.mjs")) {
    problems.push("review gate does not execute data-online parallel unblock selector");
  }
  if (!reviewGate.includes('"phase-1-data-online-parallel-unblock-selector"')) {
    problems.push("review gate focused set missing data-online parallel unblock selector");
  }
}

function validateReports() {
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.coverage?.fullLevel1ExpectedRows, 360, "fullLevel1ExpectedRows");
  expect(dataOnline.coverage?.fullLevel1ObservedRows, 182, "fullLevel1ObservedRows");
  expect(dataOnline.coverage?.fullLevel1MissingRows, 178, "fullLevel1MissingRows");
  expect(dataOnline.coverage?.twEquityObservedRows, 180, "twEquityObservedRows");
  expect(dataOnline.coverage?.twEquityExpectedRows, 180, "twEquityExpectedRows");
  expect(dataOnline.coverage?.twiiMissingRows, 60, "twiiMissingRows");
  expect(dataOnline.coverage?.etfMissingRows, 118, "etfMissingRows");
  expect(dataOnline.publicDataSource, "mock", "publicDataSource");
  expect(dataOnline.scoreSource, "mock", "scoreSource");
  expect(dataOnline.twiiExecutionAllowedNow, false, "twiiExecutionAllowedNow");

  expect(executionSelector.status, "ok", "executionSelector status");
  expect(twiiIntake.status, "ok", "twiiIntake status");
  expect(twiiPacket.status, "ok", "twiiPacket status");
  expect(etfSelector.status, "ok", "etfSelector status");
  expect(a2Copy.status, "ok", "a2Copy status");
  expect(briefAlignment.status, "ok", "briefAlignment status");
  expect(finalReadiness.status, "ok", "finalReadiness status");
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
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${label} did not emit JSON: ${error.message}`);
    return {};
  }
}
