import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_EXTERNAL_PLATFORM_LEDGER_SYNC_CANDIDATE_NO_EXECUTION.md";
const candidatePath = "data/evidence-intake/phase-1-external-platform-ledger-sync-candidate.json";
const completedPacketPath = "data/evidence-intake/phase-1-external-platform-completed-evidence-example.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const candidate = parseJson(readText(candidatePath), candidatePath);
const completedPacket = parseJson(readText(completedPacketPath), completedPacketPath);
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);
const completedValidator = runJson(
  "scripts/check-phase-1-data-online-external-platform-completed-evidence-validator-no-execution.mjs",
  "external-platform completed evidence validator"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validateDoc();
validateCandidate();
validateRegistration();
validateBoundaries();

const entries = Array.isArray(candidate.entries) ? candidate.entries : [];
const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_external_platform_ledger_sync_candidate_no_execution_ready"
    : "phase_1_data_online_external_platform_ledger_sync_candidate_no_execution_blocked",
  packetMode: "external_platform_ledger_sync_candidate_no_execution",
  ledgerSyncCandidateReady: ok,
  candidateEntryCount: entries.length,
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
  expect(completedValidator.status, "ok", "completed validator status");
  expect(
    completedValidator.guardedStatus,
    "phase_1_data_online_external_platform_completed_evidence_validator_no_execution_ready",
    "completed validator guarded status"
  );
  expect(completedValidator.completedPacketValid, true, "completed validator completedPacketValid");
  expect(completedValidator.readyForLedgerReview, true, "completed validator readyForLedgerReview");
  expect(completedValidator.readyForReadonlyGate, false, "completed validator readyForReadonlyGate");
  expect(completedValidator.writeGateExecutableNow, false, "completed validator writeGateExecutableNow");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_external_platform_ledger_sync_candidate_no_execution_ready",
    "external_platform_ledger_sync_candidate_no_execution",
    "ledger_sync_candidate_ready",
    "candidate_entries_from_completed_evidence",
    "mutatesAcceptanceLedgerNow=false",
    "readyForReadonlyGate=false",
    "writeGateExecutableNow=false",
    "sync_candidate_does_not_authorize_execution",
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

function validateCandidate() {
  if (candidate.candidateStatus !== "ledger_sync_candidate_ready") problems.push("candidateStatus must be ledger_sync_candidate_ready");
  if (candidate.mutatesAcceptanceLedgerNow !== false) problems.push("mutatesAcceptanceLedgerNow must be false");
  if (candidate.readyForReadonlyGate !== false) problems.push("candidate readyForReadonlyGate must be false");
  if (candidate.writeGateExecutableNow !== false) problems.push("candidate writeGateExecutableNow must be false");
  if (candidate.publicDataSource !== "mock") problems.push("candidate publicDataSource must be mock");
  if (candidate.scoreSource !== "mock") problems.push("candidate scoreSource must be mock");
  const observations = Array.isArray(completedPacket.observations) ? completedPacket.observations : [];
  if (!Array.isArray(candidate.entries)) {
    problems.push("candidate entries must be an array");
    return;
  }
  if (candidate.entries.length !== observations.length) {
    problems.push(`candidate entry count must match observations ${observations.length}`);
  }
  for (const observation of observations) {
    const match = candidate.entries.find((entry) => entry.evidenceItem === observation.evidenceItem);
    if (!match) {
      problems.push(`candidate missing entry for ${observation.evidenceItem}`);
      continue;
    }
    if (match.decision !== "accepted") problems.push(`${match.evidenceItem} decision must be accepted`);
    if (match.validatorResult !== "passed") problems.push(`${match.evidenceItem} validatorResult must be passed`);
    if (match.nonSecretSummary !== observation.nonSecretSummary) {
      problems.push(`${match.evidenceItem} nonSecretSummary must match completed observation`);
    }
    if (Array.isArray(match.rejectReasons) && match.rejectReasons.length > 0) {
      problems.push(`${match.evidenceItem} must not include rejectReasons`);
    }
  }
  for (const entry of candidate.entries) {
    for (const key of ["id", "evidenceItem", "decision", "validatorResult", "nonSecretSummary", "recordedAtLocal"]) {
      if (!(key in entry)) problems.push(`candidate entry missing ${key}`);
    }
    for (const key of ["secretValue", "rawPayload", "rowPayload", "endpointResponseBody", "serviceRoleKey", "sqlStatement"]) {
      if (key in entry) problems.push(`candidate entry ${entry.id ?? "(unknown)"} contains forbidden field ${key}`);
    }
  }
  const serialized = JSON.stringify(candidate);
  for (const token of ["sb_secret_", "SUPABASE_SERVICE_ROLE_KEY", "service_role=", "rawPayloadStored=true"]) {
    if (serialized.includes(token)) problems.push(`candidate contains forbidden token ${token}`);
  }
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-data-online-external-platform-ledger-sync-candidate-no-execution"] !==
    "node scripts/check-phase-1-data-online-external-platform-ledger-sync-candidate-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-external-platform-ledger-sync-candidate-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-external-platform-ledger-sync-candidate-no-execution.mjs")) {
    problems.push("review gate missing external-platform ledger sync candidate checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-external-platform-ledger-sync-candidate-no-execution"')) {
    problems.push("focused review gate missing external-platform ledger sync candidate checker");
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
