import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_OPERATOR_CREDENTIAL_PRESENCE_PACKET_NO_EXECUTION.md";
const packetPath = "data/evidence-intake/phase-1-operator-credential-presence-packet.json";
const writeGateChecklistDocPath = "docs/PHASE_1_DATA_ONLINE_WRITE_GATE_CHECKLIST_RUNNER_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packet = parseJson(readText(packetPath), packetPath);
const writeGateChecklistDoc = readText(writeGateChecklistDocPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data-online go/no-go");

validatePrerequisites();
validatePacket();
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
const report = {
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_data_online_operator_credential_presence_packet_no_execution_ready"
    : "phase_1_data_online_operator_credential_presence_packet_no_execution_blocked",
  packetMode: "operator_credential_presence_packet_no_execution",
  operatorCredentialPacketStatus: packet.operatorCredentialPacketStatus ?? null,
  remainingBeforePacket: ["operator_values_missing", "credential_presence_unverified"],
  nextExecutableState: "still_blocked_until_external_values_and_server_presence_pass",
  writeGateExecutableNow: false,
  dataOnlineDecision: dataOnline.decision ?? null,
  publicDataSource: dataOnline.publicDataSource ?? null,
  scoreSource: dataOnline.scoreSource ?? null,
  problems
};

console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function validatePrerequisites() {
  for (const token of [
    "phase_1_data_online_write_gate_checklist_runner_no_execution_ready",
    "dashboardApiExposureStatus=accepted_read_path_for_daily_prices",
    "Current remaining blockers:",
    "`operator_values_missing`",
    "`credential_presence_unverified`",
    "writeGateExecutableNow=false"
  ]) {
    if (!writeGateChecklistDoc.includes(token)) problems.push(`write-gate checklist doc missing ${token}`);
  }
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validatePacket() {
  expect(packet.status, "operator_credential_presence_packet_ready_no_execution", "packet status");
  expect(packet.packetMode, "operator_credential_presence_packet_no_execution", "packet mode");
  expect(
    packet.operatorCredentialPacketStatus,
    "ready_for_external_operator_values_and_server_presence_check",
    "operatorCredentialPacketStatus"
  );
  expect(packet.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(packet.publicDataSource, "mock", "publicDataSource");
  expect(packet.scoreSource, "mock", "scoreSource");
  const requiredSlots = Array.isArray(packet.requiredPresenceSlots) ? packet.requiredPresenceSlots : [];
  for (const slot of [
    "operator_decision_presence",
    "execute_switch_presence",
    "confirmation_phrase_presence",
    "server_only_credential_presence",
    "rollback_reference_presence",
    "post_run_review_reference_presence"
  ]) {
    if (!requiredSlots.includes(slot)) problems.push(`packet missing requiredPresenceSlot ${slot}`);
  }
  for (const key of [
    "valuesStored",
    "credentialValueStored",
    "credentialValuePrinted",
    "sqlExecuted",
    "supabaseWriteAttempted",
    "dailyPricesMutated",
    "marketDataFetched",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (packet.safety?.[key] !== false) problems.push(`packet safety.${key} must be false`);
  }
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_operator_credential_presence_packet_no_execution_ready",
    "operator_credential_presence_packet_no_execution",
    "ready_for_external_operator_values_and_server_presence_check",
    "operator_values_missing",
    "credential_presence_unverified",
    "operator_decision_presence",
    "execute_switch_presence",
    "confirmation_phrase_presence",
    "server_only_credential_presence",
    "rollback_reference_presence",
    "post_run_review_reference_presence",
    "value_presence_only_no_values",
    "credential_value_must_not_be_printed",
    "writeGateExecutableNow=false",
    "publicDataSource=mock",
    "scoreSource=mock",
    "No SQL",
    "No Supabase write",
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
    packageJson.scripts?.["check:phase-1-data-online-operator-credential-presence-packet-no-execution"] !==
    "node scripts/check-phase-1-data-online-operator-credential-presence-packet-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-operator-credential-presence-packet-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-operator-credential-presence-packet-no-execution.mjs")) {
    problems.push("review gate missing operator credential presence packet checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-operator-credential-presence-packet-no-execution"')) {
    problems.push("focused review gate missing operator credential presence packet checker");
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [docPath, doc],
    [packetPath, JSON.stringify(packet)]
  ]) {
    for (const token of [
      "sb_secret_",
      "SUPABASE_SERVICE_ROLE_KEY=",
      "executeSwitchValue=",
      "confirmationPhraseValue=",
      "operatorDecisionValue=",
      "sqlExecuted=true",
      "supabaseWriteAttempted=true",
      "dailyPricesMutated=true",
      "marketDataFetched=true",
      "credentialValueStored=true",
      "credentialValuePrinted=true",
      "publicDataSource=supabase",
      "scoreSource=real",
      "writeGateExecutableNow=true"
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
