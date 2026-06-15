import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_EXTERNAL_PLATFORM_LEDGER_APPEND_NO_EXECUTION.md";
const ledgerPath = "data/evidence-intake/phase-1-external-platform-acceptance-ledger.json";
const candidatePath = "data/evidence-intake/phase-1-external-platform-ledger-sync-candidate.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const ledger = parseJson(readText(ledgerPath), ledgerPath);
const candidate = parseJson(readText(candidatePath), candidatePath);
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);
const applyGate = runJson(
  "scripts/check-phase-1-data-online-external-platform-ledger-sync-apply-gate-no-execution.mjs",
  "external-platform ledger sync apply gate"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validateDoc();
validateLedgerAppend();
validateRegistration();
validateBoundaries();

const ledgerEntries = Array.isArray(ledger.entries) ? ledger.entries : [];
const candidateEntries = Array.isArray(candidate.entries) ? candidate.entries : [];
const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_external_platform_ledger_append_no_execution_ready"
    : "phase_1_data_online_external_platform_ledger_append_no_execution_blocked",
  packetMode: "external_platform_ledger_append_no_execution",
  ledgerAppendApplied: ok,
  appendedCandidateCount: candidateEntries.length,
  ledgerEntryCount: ledgerEntries.length,
  readyForReadonlyGate: false,
  writeGateExecutableNow: false,
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(applyGate.status, "ok", "apply gate status");
  expect(
    applyGate.guardedStatus,
    "phase_1_data_online_external_platform_ledger_sync_apply_gate_no_execution_ready",
    "apply gate guarded status"
  );
  expect(applyGate.applyGateReady, true, "apply gate ready");
  expect(applyGate.candidateAppendApprovedForFutureSlice, true, "apply gate candidate append approval");
  expect(applyGate.mutatesAcceptanceLedgerNow, false, "apply gate mutatesAcceptanceLedgerNow");
  expect(applyGate.readyForReadonlyGate, false, "apply gate readyForReadonlyGate");
  expect(applyGate.writeGateExecutableNow, false, "apply gate writeGateExecutableNow");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_external_platform_ledger_append_no_execution_ready",
    "external_platform_ledger_append_no_execution",
    "ledger_append_applied",
    "appended_candidate_count=5",
    "ledger_entry_count=7",
    "readyForReadonlyGate=false",
    "writeGateExecutableNow=false",
    "ledger_append_does_not_authorize_readonly",
    "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
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

function validateLedgerAppend() {
  if (ledger.ledgerStatus !== "ledger_ready") problems.push("ledgerStatus must be ledger_ready");
  if (ledger.writeGateExecutableNow !== false) problems.push("ledger writeGateExecutableNow must be false");
  if (ledger.publicDataSource !== "mock") problems.push("ledger publicDataSource must be mock");
  if (ledger.scoreSource !== "mock") problems.push("ledger scoreSource must be mock");
  if (!Array.isArray(ledger.entries)) {
    problems.push("ledger entries must be an array");
    return;
  }
  if (!Array.isArray(candidate.entries)) {
    problems.push("candidate entries must be an array");
    return;
  }
  const expectedCount = 2 + candidate.entries.length;
  if (ledger.entries.length !== expectedCount) {
    problems.push(`ledger entries must be ${expectedCount}`);
  }
  const ids = new Set();
  for (const entry of ledger.entries) {
    if (ids.has(entry.id)) problems.push(`duplicate ledger id ${entry.id}`);
    ids.add(entry.id);
  }
  for (const candidateEntry of candidate.entries) {
    const ledgerEntry = ledger.entries.find((entry) => entry.id === candidateEntry.id);
    if (!ledgerEntry) {
      problems.push(`ledger missing appended candidate ${candidateEntry.id}`);
      continue;
    }
    for (const key of ["evidenceItem", "decision", "validatorResult", "nonSecretSummary", "recordedAtLocal"]) {
      if (ledgerEntry[key] !== candidateEntry[key]) {
        problems.push(`ledger ${candidateEntry.id} ${key} must match candidate`);
      }
    }
    if (Array.isArray(ledgerEntry.rejectReasons) && ledgerEntry.rejectReasons.length > 0) {
      problems.push(`appended ledger entry ${candidateEntry.id} must not include reject reasons`);
    }
  }
  const serialized = JSON.stringify(ledger);
  for (const token of ["sb_secret_", "SUPABASE_SERVICE_ROLE_KEY", "service_role=", "rawPayloadStored=true"]) {
    if (serialized.includes(token)) problems.push(`ledger contains forbidden token ${token}`);
  }
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-data-online-external-platform-ledger-append-no-execution"] !==
    "node scripts/check-phase-1-data-online-external-platform-ledger-append-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-external-platform-ledger-append-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-external-platform-ledger-append-no-execution.mjs")) {
    problems.push("review gate missing external-platform ledger append checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-external-platform-ledger-append-no-execution"')) {
    problems.push("focused review gate missing external-platform ledger append checker");
  }
}

function validateBoundaries() {
  const forbiddenDocTokens = [
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
    "readyForReadonlyGate=true",
    "publicDataSource=supabase",
    "scoreSource=real",
    "executionAllowedNow=true"
  ];
  for (const token of forbiddenDocTokens) if (doc.includes(token)) problems.push(`doc contains unsafe token ${token}`);
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
