import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_EXTERNAL_PLATFORM_EVIDENCE_COLLECTION_PACKET_NO_EXECUTION.md";
const packetPath = "data/evidence-intake/phase-1-external-platform-collection-packet.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packet = parseJson(readText(packetPath), packetPath);
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);
const ledger = runJson(
  "scripts/check-phase-1-data-online-external-platform-evidence-acceptance-ledger-no-execution.mjs",
  "external-platform evidence acceptance ledger"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validateDoc();
validatePacket();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
const items = Array.isArray(packet.collectionItems) ? packet.collectionItems : [];
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_external_platform_evidence_collection_packet_no_execution_ready"
    : "phase_1_data_online_external_platform_evidence_collection_packet_no_execution_blocked",
  packetMode: "external_platform_evidence_collection_packet_no_execution",
  collectionPacketReady: ok,
  collectionItemCount: items.length,
  writeGateExecutableNow: false,
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(ledger.status, "ok", "acceptance ledger status");
  expect(
    ledger.guardedStatus,
    "phase_1_data_online_external_platform_evidence_acceptance_ledger_no_execution_ready",
    "acceptance ledger guarded status"
  );
  expect(ledger.ledgerReady, true, "acceptance ledger ready");
  expect(ledger.writeGateExecutableNow, false, "acceptance ledger writeGateExecutableNow");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_external_platform_evidence_collection_packet_no_execution_ready",
    "external_platform_evidence_collection_packet_no_execution",
    "collection_packet_ready",
    "operator_fill_non_secret_only",
    "schema_cache_evidence_required",
    "dashboard_api_exposure_evidence_required",
    "pgrst205_regression_evidence_required",
    "metadata_readiness_evidence_required",
    "write_path_exposure_evidence_required",
    "validator_then_ledger_required",
    "collection_packet_does_not_authorize_execution",
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

function validatePacket() {
  if (packet.packetStatus !== "collection_packet_ready") problems.push("packetStatus must be collection_packet_ready");
  if (packet.writeGateExecutableNow !== false) problems.push("packet writeGateExecutableNow must be false");
  if (packet.publicDataSource !== "mock") problems.push("packet publicDataSource must be mock");
  if (packet.scoreSource !== "mock") problems.push("packet scoreSource must be mock");
  if (packet.operatorFillMode !== "non_secret_summary_only") problems.push("operatorFillMode must be non_secret_summary_only");
  const requiredItems = [
    "schema_cache_evidence_required",
    "dashboard_api_exposure_evidence_required",
    "pgrst205_regression_evidence_required",
    "metadata_readiness_evidence_required",
    "write_path_exposure_evidence_required"
  ];
  if (!Array.isArray(packet.collectionItems)) {
    problems.push("collectionItems must be an array");
    return;
  }
  for (const item of requiredItems) {
    if (!packet.collectionItems.some((entry) => entry.evidenceItem === item)) {
      problems.push(`collectionItems missing ${item}`);
    }
  }
  for (const entry of packet.collectionItems) {
    for (const key of ["evidenceItem", "prompt", "allowedResponseShape", "forbiddenValues"]) {
      if (!(key in entry)) problems.push(`collection item missing ${key}`);
    }
    if (entry.allowedResponseShape !== "non_secret_summary") {
      problems.push(`${entry.evidenceItem ?? "(unknown)"} allowedResponseShape must be non_secret_summary`);
    }
    for (const forbidden of ["secretValue", "rawPayload", "endpointResponseBody", "serviceRoleKey", "sqlStatement"]) {
      if (!entry.forbiddenValues?.includes(forbidden)) {
        problems.push(`${entry.evidenceItem ?? "(unknown)"} forbiddenValues missing ${forbidden}`);
      }
    }
  }
  const serialized = JSON.stringify(packet);
  for (const token of ["sb_secret_", "SUPABASE_SERVICE_ROLE_KEY", "service_role=", "rawPayloadStored=true"]) {
    if (serialized.includes(token)) problems.push(`packet contains forbidden token ${token}`);
  }
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-data-online-external-platform-evidence-collection-packet-no-execution"] !==
    "node scripts/check-phase-1-data-online-external-platform-evidence-collection-packet-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-external-platform-evidence-collection-packet-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-external-platform-evidence-collection-packet-no-execution.mjs")) {
    problems.push("review gate missing external-platform evidence collection packet checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-external-platform-evidence-collection-packet-no-execution"')) {
    problems.push("focused review gate missing external-platform evidence collection packet checker");
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
