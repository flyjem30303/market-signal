import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_READONLY_OPERATOR_DECISION_RECORD_NO_EXECUTION.md";
const recordPath = "data/evidence-intake/phase-1-readonly-operator-decision-record.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const record = parseJson(readText(recordPath), recordPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const runnerStub = runJson(
  "scripts/check-phase-1-data-online-bounded-readonly-runner-stub-no-execution.mjs",
  "bounded readonly runner stub"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validateRecord();
validateDoc();
validateRegistration();
validateNoUnsafeTokens();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_readonly_operator_decision_record_no_execution_ready"
    : "phase_1_data_online_readonly_operator_decision_record_no_execution_blocked",
  packetMode: "readonly_operator_decision_record_no_execution",
  operatorDecisionAccepted: record.operatorDecision === "accepted_for_exactly_one_bounded_readonly_attempt_implementation",
  remoteAttempted: false,
  executionOccurred: false,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(runnerStub.status, "ok", "runner stub status");
  expect(
    runnerStub.guardedStatus,
    "phase_1_data_online_bounded_readonly_runner_stub_no_execution_ready",
    "runner stub guarded status"
  );
  expect(runnerStub.remoteAttempted, false, "runner stub remoteAttempted");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateRecord() {
  expect(record.status, "readonly_operator_decision_record_ready_no_execution", "record status");
  expect(record.packetMode, "readonly_operator_decision_record_no_execution", "record mode");
  expect(record.attemptId, "phase1-data-online-readonly-20260615-a", "record attemptId");
  expect(
    record.operatorDecision,
    "accepted_for_exactly_one_bounded_readonly_attempt_implementation",
    "record operatorDecision"
  );
  expect(record.maxAttemptCount, 1, "record maxAttemptCount");
  expect(record.remoteAttemptedNow, false, "record remoteAttemptedNow");
  expect(record.executionOccurredNow, false, "record executionOccurredNow");
  expect(record.writeGateExecutableNow, false, "record writeGateExecutableNow");
  expect(record.publicDataSource, "mock", "record publicDataSource");
  expect(record.scoreSource, "mock", "record scoreSource");
  if (!Array.isArray(record.authorizedNextSliceOnly) || record.authorizedNextSliceOnly.length < 3) {
    problems.push("record authorizedNextSliceOnly must list next-slice constraints");
  }
  if (!Array.isArray(record.notAuthorized) || record.notAuthorized.length < 8) {
    problems.push("record notAuthorized must list forbidden actions");
  }
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_readonly_operator_decision_record_no_execution_ready",
    "readonly_operator_decision_record_no_execution",
    "attemptId=phase1-data-online-readonly-20260615-a",
    "operatorDecision=accepted_for_exactly_one_bounded_readonly_attempt_implementation",
    "maxAttemptCount=1",
    "remoteAttemptedNow=false",
    "executionOccurredNow=false",
    "writeGateExecutableNow=false",
    "publicDataSource=mock",
    "scoreSource=mock",
    "This record does not execute the readonly attempt",
    "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
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
    packageJson.scripts?.["check:phase-1-data-online-readonly-operator-decision-record-no-execution"] !==
    "node scripts/check-phase-1-data-online-readonly-operator-decision-record-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-readonly-operator-decision-record-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-readonly-operator-decision-record-no-execution.mjs")) {
    problems.push("review gate missing readonly operator decision checker command");
  }
  if (!reviewGate.includes('"phase-1-data-online-readonly-operator-decision-record-no-execution"')) {
    problems.push("focused review gate missing readonly operator decision checker name");
  }
}

function validateNoUnsafeTokens() {
  for (const [label, text] of [
    [docPath, doc],
    [recordPath, JSON.stringify(record)]
  ]) {
    for (const token of [
      "sb_secret_",
      "SUPABASE_SERVICE_ROLE_KEY",
      "service_role",
      "executeSwitchValue=",
      "confirmationPhraseValue=",
      "sqlExecuted=true",
      "supabaseReadAllowedNow=true",
      "supabaseWriteAllowedNow=true",
      "remoteAttemptedNow=true",
      "executionOccurredNow=true",
      "writeGateExecutableNow=true",
      "dailyPricesMutated=true",
      "marketRowsFetched=true",
      "rawPayloadStored=true",
      "publicDataSource=supabase",
      "scoreSource=real"
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
    timeout: 180000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${label} exited ${run.status}`);
  return parseJson(run.stdout, label);
}
