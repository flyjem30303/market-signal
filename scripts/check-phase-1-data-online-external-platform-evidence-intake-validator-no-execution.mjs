import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_EXTERNAL_PLATFORM_EVIDENCE_INTAKE_VALIDATOR_NO_EXECUTION.md";
const safePacketPath = "data/evidence-intake/phase-1-external-platform-safe-example.json";
const rejectPacketPath = "data/evidence-intake/phase-1-external-platform-reject-example.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), "package.json");
const reviewGate = readText(reviewGatePath);
const safePacket = parseJson(readText(safePacketPath), safePacketPath);
const rejectPacket = parseJson(readText(rejectPacketPath), rejectPacketPath);
const intakeFormat = runJson(
  "scripts/check-phase-1-data-online-external-platform-evidence-intake-format-no-execution.mjs",
  "external-platform evidence intake format"
);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

const safeValidation = validateEvidencePacket(safePacket);
const rejectValidation = validateEvidencePacket(rejectPacket);

validatePrerequisites();
validateDoc();
validatePackets();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_external_platform_evidence_intake_validator_no_execution_ready"
    : "phase_1_data_online_external_platform_evidence_intake_validator_no_execution_blocked",
  packetMode: "external_platform_evidence_intake_validator_no_execution",
  safePacketAccepted: safeValidation.accepted,
  rejectPacketRejected: !rejectValidation.accepted,
  rejectReasons: rejectValidation.reasons,
  writeGateExecutableNow: false,
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(intakeFormat.status, "ok", "intake format status");
  expect(
    intakeFormat.guardedStatus,
    "phase_1_data_online_external_platform_evidence_intake_format_no_execution_ready",
    "intake format guarded status"
  );
  expect(intakeFormat.intakeFormatReady, true, "intake format ready");
  expect(intakeFormat.writeGateExecutableNow, false, "intake format writeGateExecutableNow");
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_external_platform_evidence_intake_validator_no_execution_ready",
    "external_platform_evidence_intake_validator_no_execution",
    "safe_packet_accepted",
    "unsafe_packet_rejected",
    "reject_secret_value",
    "reject_raw_payload",
    "reject_endpoint_response_body",
    "reject_service_role_key",
    "reject_sql_statement",
    "allowed_evidence_fields_only",
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

function validatePackets() {
  if (!safeValidation.accepted) problems.push(`safe packet rejected: ${safeValidation.reasons.join(", ")}`);
  if (rejectValidation.accepted) problems.push("reject packet was accepted");
  for (const reason of ["secretValue", "rawPayload", "endpointResponseBody", "serviceRoleKey", "sqlStatement"]) {
    if (!rejectValidation.reasons.includes(reason)) problems.push(`reject packet missing reason ${reason}`);
  }
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-data-online-external-platform-evidence-intake-validator-no-execution"] !==
    "node scripts/check-phase-1-data-online-external-platform-evidence-intake-validator-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-external-platform-evidence-intake-validator-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-external-platform-evidence-intake-validator-no-execution.mjs")) {
    problems.push("review gate missing external-platform evidence intake validator checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-external-platform-evidence-intake-validator-no-execution"')) {
    problems.push("focused review gate missing external-platform evidence intake validator checker");
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

function validateEvidencePacket(packet) {
  const allowed = new Set([
    "evidenceItem",
    "observedState",
    "observedAtLocal",
    "operatorInitials",
    "nonSecretSummary",
    "riskDisposition",
    "followUpRequired"
  ]);
  const forbidden = new Set([
    "secretValue",
    "rawPayload",
    "rowPayload",
    "endpointResponseBody",
    "serviceRoleKey",
    "sqlStatement"
  ]);
  const reasons = [];
  for (const key of Object.keys(packet ?? {})) {
    if (forbidden.has(key)) reasons.push(key);
    if (!allowed.has(key) && !forbidden.has(key)) reasons.push(`unknown:${key}`);
  }
  for (const key of allowed) {
    if (!(key in (packet ?? {}))) reasons.push(`missing:${key}`);
  }
  return {
    accepted: reasons.length === 0,
    reasons
  };
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
