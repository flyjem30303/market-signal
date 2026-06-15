import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_EXTERNAL_PLATFORM_EVIDENCE_ACCEPTANCE_LEDGER_NO_EXECUTION.md";
const ledgerPath = "data/evidence-intake/phase-1-external-platform-acceptance-ledger.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const ledger = parseJson(readText(ledgerPath), ledgerPath);
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);
const validator = runJson(
  "scripts/check-phase-1-data-online-external-platform-evidence-intake-validator-no-execution.mjs",
  "external-platform evidence intake validator"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validateDoc();
validateLedger();
validateRegistration();
validateBoundaries();

const acceptedEntries = Array.isArray(ledger.entries)
  ? ledger.entries.filter((entry) => entry.decision === "accepted")
  : [];
const rejectedEntries = Array.isArray(ledger.entries)
  ? ledger.entries.filter((entry) => entry.decision === "rejected")
  : [];
const ok = problems.length === 0;

const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_external_platform_evidence_acceptance_ledger_no_execution_ready"
    : "phase_1_data_online_external_platform_evidence_acceptance_ledger_no_execution_blocked",
  packetMode: "external_platform_evidence_acceptance_ledger_no_execution",
  ledgerReady: ok,
  acceptedCount: acceptedEntries.length,
  rejectedCount: rejectedEntries.length,
  writeGateExecutableNow: false,
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(validator.status, "ok", "validator status");
  expect(
    validator.guardedStatus,
    "phase_1_data_online_external_platform_evidence_intake_validator_no_execution_ready",
    "validator guarded status"
  );
  expect(validator.safePacketAccepted, true, "validator safePacketAccepted");
  expect(validator.rejectPacketRejected, true, "validator rejectPacketRejected");
  expect(validator.writeGateExecutableNow, false, "validator writeGateExecutableNow");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_external_platform_evidence_acceptance_ledger_no_execution_ready",
    "external_platform_evidence_acceptance_ledger_no_execution",
    "ledger_ready",
    "accepted_non_secret_summary_recorded",
    "rejected_unsafe_packet_recorded",
    "validator_passing_required",
    "ledger_does_not_authorize_execution",
    "writeGateExecutableNow=false",
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

function validateLedger() {
  if (ledger.ledgerStatus !== "ledger_ready") problems.push("ledgerStatus must be ledger_ready");
  if (ledger.writeGateExecutableNow !== false) problems.push("ledger writeGateExecutableNow must be false");
  if (ledger.publicDataSource !== "mock") problems.push("ledger publicDataSource must be mock");
  if (ledger.scoreSource !== "mock") problems.push("ledger scoreSource must be mock");
  if (!Array.isArray(ledger.entries)) {
    problems.push("ledger entries must be an array");
    return;
  }
  const accepted = ledger.entries.filter((entry) => entry.decision === "accepted");
  const rejected = ledger.entries.filter((entry) => entry.decision === "rejected");
  if (accepted.length < 1) problems.push("ledger needs at least one accepted entry");
  if (rejected.length < 1) problems.push("ledger needs at least one rejected entry");
  for (const entry of accepted) {
    validateEntryBase(entry);
    if (entry.validatorResult !== "passed") problems.push(`accepted ${entry.id} validatorResult must be passed`);
    if (Array.isArray(entry.rejectReasons) && entry.rejectReasons.length > 0) {
      problems.push(`accepted ${entry.id} must not include reject reasons`);
    }
  }
  for (const entry of rejected) {
    validateEntryBase(entry);
    if (entry.validatorResult !== "failed") problems.push(`rejected ${entry.id} validatorResult must be failed`);
    for (const reason of ["secretValue", "rawPayload", "endpointResponseBody", "serviceRoleKey", "sqlStatement"]) {
      if (!entry.rejectReasons?.includes(reason)) problems.push(`rejected ${entry.id} missing reason ${reason}`);
    }
  }
  const serialized = JSON.stringify(ledger);
  for (const token of ["sb_secret_", "SUPABASE_SERVICE_ROLE_KEY", "service_role=", "rawPayloadStored=true"]) {
    if (serialized.includes(token)) problems.push(`ledger contains forbidden token ${token}`);
  }
}

function validateEntryBase(entry) {
  for (const key of ["id", "evidenceItem", "decision", "validatorResult", "nonSecretSummary", "recordedAtLocal"]) {
    if (!(key in entry)) problems.push(`ledger entry missing ${key}`);
  }
  for (const key of ["secretValue", "rawPayload", "rowPayload", "endpointResponseBody", "serviceRoleKey", "sqlStatement"]) {
    if (key in entry) problems.push(`ledger entry ${entry.id ?? "(unknown)"} contains forbidden field ${key}`);
  }
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-data-online-external-platform-evidence-acceptance-ledger-no-execution"] !==
    "node scripts/check-phase-1-data-online-external-platform-evidence-acceptance-ledger-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-external-platform-evidence-acceptance-ledger-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-external-platform-evidence-acceptance-ledger-no-execution.mjs")) {
    problems.push("review gate missing external-platform evidence acceptance ledger checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-external-platform-evidence-acceptance-ledger-no-execution"')) {
    problems.push("focused review gate missing external-platform evidence acceptance ledger checker");
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
