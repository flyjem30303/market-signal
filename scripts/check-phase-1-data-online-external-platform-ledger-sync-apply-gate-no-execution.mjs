import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_EXTERNAL_PLATFORM_LEDGER_SYNC_APPLY_GATE_NO_EXECUTION.md";
const gatePath = "data/evidence-intake/phase-1-external-platform-ledger-sync-apply-gate.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const gate = parseJson(readText(gatePath), gatePath);
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);
const candidate = runJson(
  "scripts/check-phase-1-data-online-external-platform-ledger-sync-candidate-no-execution.mjs",
  "external-platform ledger sync candidate"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validateDoc();
validateGate();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_external_platform_ledger_sync_apply_gate_no_execution_ready"
    : "phase_1_data_online_external_platform_ledger_sync_apply_gate_no_execution_blocked",
  packetMode: "external_platform_ledger_sync_apply_gate_no_execution",
  applyGateReady: ok,
  candidateAppendApprovedForFutureSlice: gate.candidateAppendApprovedForFutureSlice ?? null,
  mutatesAcceptanceLedgerNow: false,
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
  expect(candidate.status, "ok", "ledger sync candidate status");
  expect(
    candidate.guardedStatus,
    "phase_1_data_online_external_platform_ledger_sync_candidate_no_execution_ready",
    "ledger sync candidate guarded status"
  );
  expect(candidate.ledgerSyncCandidateReady, true, "ledger sync candidate ready");
  expect(candidate.candidateEntryCount, 5, "ledger sync candidate entry count");
  expect(candidate.mutatesAcceptanceLedgerNow, false, "ledger sync candidate mutatesAcceptanceLedgerNow");
  expect(candidate.readyForReadonlyGate, false, "ledger sync candidate readyForReadonlyGate");
  expect(candidate.writeGateExecutableNow, false, "ledger sync candidate writeGateExecutableNow");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_external_platform_ledger_sync_apply_gate_no_execution_ready",
    "external_platform_ledger_sync_apply_gate_no_execution",
    "apply_gate_ready",
    "candidate_append_approved_for_future_slice",
    "mutatesAcceptanceLedgerNow=false",
    "readyForReadonlyGate=false",
    "writeGateExecutableNow=false",
    "apply_gate_does_not_mutate_ledger",
    "apply_gate_does_not_authorize_readonly",
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

function validateGate() {
  if (gate.gateStatus !== "apply_gate_ready") problems.push("gateStatus must be apply_gate_ready");
  if (gate.candidateAppendApprovedForFutureSlice !== true) {
    problems.push("candidateAppendApprovedForFutureSlice must be true");
  }
  if (gate.mutatesAcceptanceLedgerNow !== false) problems.push("mutatesAcceptanceLedgerNow must be false");
  if (gate.readyForReadonlyGate !== false) problems.push("readyForReadonlyGate must be false");
  if (gate.writeGateExecutableNow !== false) problems.push("writeGateExecutableNow must be false");
  if (gate.publicDataSource !== "mock") problems.push("gate publicDataSource must be mock");
  if (gate.scoreSource !== "mock") problems.push("gate scoreSource must be mock");
  if (gate.requiredCandidateEntryCount !== 5) problems.push("requiredCandidateEntryCount must be 5");
  if (gate.reviewDecision !== "approved_for_future_ledger_append_only") {
    problems.push("reviewDecision must be approved_for_future_ledger_append_only");
  }
  const serialized = JSON.stringify(gate);
  for (const token of ["sb_secret_", "SUPABASE_SERVICE_ROLE_KEY", "service_role=", "rawPayloadStored=true"]) {
    if (serialized.includes(token)) problems.push(`gate contains forbidden token ${token}`);
  }
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-data-online-external-platform-ledger-sync-apply-gate-no-execution"] !==
    "node scripts/check-phase-1-data-online-external-platform-ledger-sync-apply-gate-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-external-platform-ledger-sync-apply-gate-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-external-platform-ledger-sync-apply-gate-no-execution.mjs")) {
    problems.push("review gate missing external-platform ledger sync apply gate checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-external-platform-ledger-sync-apply-gate-no-execution"')) {
    problems.push("focused review gate missing external-platform ledger sync apply gate checker");
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
    "mutatesAcceptanceLedgerNow=true",
    "readyForReadonlyGate=true",
    "externalPlatformEvidenceReadyForWriteGate=true",
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
