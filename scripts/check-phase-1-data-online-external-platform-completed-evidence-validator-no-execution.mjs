import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_EXTERNAL_PLATFORM_COMPLETED_EVIDENCE_VALIDATOR_NO_EXECUTION.md";
const completedPacketPath = "data/evidence-intake/phase-1-external-platform-completed-evidence-example.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const completedPacket = parseJson(readText(completedPacketPath), completedPacketPath);
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);
const collectionPacket = runJson(
  "scripts/check-phase-1-data-online-external-platform-evidence-collection-packet-no-execution.mjs",
  "external-platform evidence collection packet"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validateDoc();
validateCompletedPacket();
validateRegistration();
validateBoundaries();

const observations = Array.isArray(completedPacket.observations) ? completedPacket.observations : [];
const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_external_platform_completed_evidence_validator_no_execution_ready"
    : "phase_1_data_online_external_platform_completed_evidence_validator_no_execution_blocked",
  packetMode: "external_platform_completed_evidence_validator_no_execution",
  completedPacketValid: ok,
  observationCount: observations.length,
  readyForLedgerReview: ok,
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
  expect(collectionPacket.status, "ok", "collection packet status");
  expect(
    collectionPacket.guardedStatus,
    "phase_1_data_online_external_platform_evidence_collection_packet_no_execution_ready",
    "collection packet guarded status"
  );
  expect(collectionPacket.collectionPacketReady, true, "collection packet ready");
  expect(collectionPacket.collectionItemCount, 5, "collection packet item count");
  expect(collectionPacket.writeGateExecutableNow, false, "collection packet writeGateExecutableNow");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_external_platform_completed_evidence_validator_no_execution_ready",
    "external_platform_completed_evidence_validator_no_execution",
    "completed_packet_valid",
    "ready_for_ledger_review",
    "readyForReadonlyGate=false",
    "schema_cache_evidence_required",
    "dashboard_api_exposure_evidence_required",
    "pgrst205_regression_evidence_required",
    "metadata_readiness_evidence_required",
    "write_path_exposure_evidence_required",
    "non_secret_observations_only",
    "completed_packet_does_not_authorize_execution",
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

function validateCompletedPacket() {
  if (completedPacket.packetStatus !== "completed_packet_ready_for_validation") {
    problems.push("packetStatus must be completed_packet_ready_for_validation");
  }
  if (completedPacket.writeGateExecutableNow !== false) problems.push("completed packet writeGateExecutableNow must be false");
  if (completedPacket.readyForReadonlyGate !== false) problems.push("completed packet readyForReadonlyGate must be false");
  if (completedPacket.publicDataSource !== "mock") problems.push("completed packet publicDataSource must be mock");
  if (completedPacket.scoreSource !== "mock") problems.push("completed packet scoreSource must be mock");
  const requiredItems = [
    "schema_cache_evidence_required",
    "dashboard_api_exposure_evidence_required",
    "pgrst205_regression_evidence_required",
    "metadata_readiness_evidence_required",
    "write_path_exposure_evidence_required"
  ];
  if (!Array.isArray(completedPacket.observations)) {
    problems.push("observations must be an array");
    return;
  }
  for (const item of requiredItems) {
    if (!completedPacket.observations.some((entry) => entry.evidenceItem === item)) {
      problems.push(`observations missing ${item}`);
    }
  }
  for (const entry of completedPacket.observations) {
    for (const key of ["evidenceItem", "observedState", "observedAtLocal", "operatorInitials", "nonSecretSummary", "riskDisposition", "followUpRequired"]) {
      if (!(key in entry)) problems.push(`observation missing ${key}`);
    }
    for (const key of ["secretValue", "rawPayload", "rowPayload", "endpointResponseBody", "serviceRoleKey", "sqlStatement"]) {
      if (key in entry) problems.push(`observation ${entry.evidenceItem ?? "(unknown)"} contains forbidden field ${key}`);
    }
    if (typeof entry.nonSecretSummary !== "string" || entry.nonSecretSummary.length < 12) {
      problems.push(`observation ${entry.evidenceItem ?? "(unknown)"} nonSecretSummary is too short`);
    }
  }
  const serialized = JSON.stringify(completedPacket);
  for (const token of ["sb_secret_", "SUPABASE_SERVICE_ROLE_KEY", "service_role=", "rawPayloadStored=true"]) {
    if (serialized.includes(token)) problems.push(`completed packet contains forbidden token ${token}`);
  }
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-data-online-external-platform-completed-evidence-validator-no-execution"] !==
    "node scripts/check-phase-1-data-online-external-platform-completed-evidence-validator-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-external-platform-completed-evidence-validator-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-external-platform-completed-evidence-validator-no-execution.mjs")) {
    problems.push("review gate missing external-platform completed evidence validator checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-external-platform-completed-evidence-validator-no-execution"')) {
    problems.push("focused review gate missing external-platform completed evidence validator checker");
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
