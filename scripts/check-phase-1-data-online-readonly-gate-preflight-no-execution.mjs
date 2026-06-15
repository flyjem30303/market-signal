import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_READONLY_GATE_PREFLIGHT_NO_EXECUTION.md";
const summaryPath = "data/evidence-intake/phase-1-readonly-gate-preflight-summary.json";
const ledgerPath = "data/evidence-intake/phase-1-external-platform-acceptance-ledger.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const summary = parseJson(readText(summaryPath), summaryPath);
const ledger = parseJson(readText(ledgerPath), ledgerPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const appendGate = runJson(
  "scripts/check-phase-1-data-online-external-platform-ledger-append-no-execution.mjs",
  "external-platform ledger append"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validateSummary();
validateDoc();
validateRegistration();
validateNoSecrets();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_readonly_gate_preflight_no_execution_ready"
    : "phase_1_data_online_readonly_gate_preflight_no_execution_blocked",
  packetMode: "readonly_gate_preflight_no_execution",
  readonlyGatePreflightReady: ok,
  operatorDecisionRequired: true,
  readonlyAttemptExecutableNow: false,
  writeGateExecutableNow: false,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  ledgerEntryCount: Array.isArray(ledger.entries) ? ledger.entries.length : null,
  acceptedEvidenceCount: Array.isArray(ledger.entries)
    ? ledger.entries.filter((entry) => entry.decision === "accepted").length
    : null,
  rejectedEvidenceCount: Array.isArray(ledger.entries)
    ? ledger.entries.filter((entry) => entry.decision === "rejected").length
    : null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(appendGate.status, "ok", "append gate status");
  expect(
    appendGate.guardedStatus,
    "phase_1_data_online_external_platform_ledger_append_no_execution_ready",
    "append gate guarded status"
  );
  expect(appendGate.ledgerAppendApplied, true, "append gate ledgerAppendApplied");
  expect(appendGate.ledgerEntryCount, 7, "append gate ledgerEntryCount");
  expect(appendGate.readyForReadonlyGate, false, "append gate readyForReadonlyGate");
  expect(appendGate.writeGateExecutableNow, false, "append gate writeGateExecutableNow");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateSummary() {
  expect(summary.status, "readonly_gate_preflight_ready_no_execution", "summary status");
  expect(summary.packetMode, "readonly_gate_preflight_no_execution", "summary packetMode");
  expect(summary.operatorDecisionRequired, true, "summary operatorDecisionRequired");
  expect(summary.readonlyAttemptExecutableNow, false, "summary readonlyAttemptExecutableNow");
  expect(summary.writeGateExecutableNow, false, "summary writeGateExecutableNow");
  expect(summary.publicDataSource, "mock", "summary publicDataSource");
  expect(summary.scoreSource, "mock", "summary scoreSource");
  expect(summary.ledgerEntryCount, 7, "summary ledgerEntryCount");
  expect(summary.acceptedEvidenceCount, 6, "summary acceptedEvidenceCount");
  expect(summary.rejectedEvidenceCount, 1, "summary rejectedEvidenceCount");
  expect(summary.nextRequiredHumanDecision, "name_bounded_supabase_readonly_attempt", "summary next decision");
  if (!Array.isArray(summary.allowedNextActions) || summary.allowedNextActions.length < 3) {
    problems.push("summary allowedNextActions must list at least 3 actions");
  }
  if (!Array.isArray(summary.forbiddenNextActions) || summary.forbiddenNextActions.length < 8) {
    problems.push("summary forbiddenNextActions must list at least 8 actions");
  }
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_readonly_gate_preflight_no_execution_ready",
    "readonly_gate_preflight_no_execution",
    "operatorDecisionRequired=true",
    "readonlyAttemptExecutableNow=false",
    "writeGateExecutableNow=false",
    "nextRequiredHumanDecision=name_bounded_supabase_readonly_attempt",
    "ledgerEntryCount=7",
    "acceptedEvidenceCount=6",
    "rejectedEvidenceCount=1",
    "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
    "publicDataSource=mock",
    "scoreSource=mock",
    "This preflight does not execute a Supabase request",
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
    packageJson.scripts?.["check:phase-1-data-online-readonly-gate-preflight-no-execution"] !==
    "node scripts/check-phase-1-data-online-readonly-gate-preflight-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-readonly-gate-preflight-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-readonly-gate-preflight-no-execution.mjs")) {
    problems.push("review gate missing readonly preflight checker command");
  }
  if (!reviewGate.includes('"phase-1-data-online-readonly-gate-preflight-no-execution"')) {
    problems.push("focused review gate missing readonly preflight checker name");
  }
}

function validateNoSecrets() {
  for (const [label, text] of [
    [docPath, doc],
    [summaryPath, JSON.stringify(summary)],
    [ledgerPath, JSON.stringify(ledger)]
  ]) {
    for (const token of [
      "sb_secret_",
      "SUPABASE_SERVICE_ROLE_KEY",
      "executeSwitchValue=",
      "confirmationPhraseValue=",
      "sqlExecuted=true",
      "supabaseReadAllowedNow=true",
      "supabaseWriteAllowedNow=true",
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
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) {
    problems.push(`${label} exited ${run.status}`);
    return {};
  }
  return parseJson(run.stdout, label);
}
