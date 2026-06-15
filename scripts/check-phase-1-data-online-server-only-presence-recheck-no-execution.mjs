import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_SERVER_ONLY_PRESENCE_RECHECK_NO_EXECUTION.md";
const packetPath = "data/evidence-intake/phase-1-server-only-presence-recheck.json";
const operatorCredentialDocPath = "docs/PHASE_1_DATA_ONLINE_OPERATOR_CREDENTIAL_PRESENCE_PACKET_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packet = parseJson(readText(packetPath), packetPath);
const operatorCredentialDoc = readText(operatorCredentialDocPath);
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
    ? "phase_1_data_online_server_only_presence_recheck_no_execution_ready"
    : "phase_1_data_online_server_only_presence_recheck_no_execution_blocked",
  packetMode: "server_only_presence_recheck_no_execution",
  presenceRecheckStatus: packet.presenceRecheckStatus ?? null,
  serverOnlyCredentialPresenceStatus: packet.serverOnlyCredentialPresenceStatus ?? null,
  externalOperatorValuesPresenceStatus: packet.externalOperatorValuesPresenceStatus ?? null,
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
    "phase_1_data_online_operator_credential_presence_packet_no_execution_ready",
    "ready_for_external_operator_values_and_server_presence_check",
    "value_presence_only_no_values",
    "credential_value_must_not_be_printed"
  ]) {
    if (!operatorCredentialDoc.includes(token)) problems.push(`operator credential doc missing ${token}`);
  }
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validatePacket() {
  expect(packet.status, "server_only_presence_recheck_ready_no_execution", "packet status");
  expect(packet.packetMode, "server_only_presence_recheck_no_execution", "packet mode");
  expect(packet.presenceRecheckStatus, "prepared_waiting_external_presence", "presenceRecheckStatus");
  expect(packet.serverOnlyCredentialPresenceStatus, "not_checked_value_hidden", "serverOnlyCredentialPresenceStatus");
  expect(packet.externalOperatorValuesPresenceStatus, "not_checked_value_hidden", "externalOperatorValuesPresenceStatus");
  expect(packet.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(packet.publicDataSource, "mock", "publicDataSource");
  expect(packet.scoreSource, "mock", "scoreSource");
  const recheckSlots = Array.isArray(packet.recheckSlots) ? packet.recheckSlots : [];
  for (const slot of [
    "operator_decision_presence_recheck",
    "execute_switch_presence_recheck",
    "confirmation_phrase_presence_recheck",
    "server_only_credential_presence_recheck",
    "rollback_reference_presence_recheck",
    "post_run_review_reference_presence_recheck"
  ]) {
    if (!recheckSlots.includes(slot)) problems.push(`packet missing recheckSlot ${slot}`);
  }
  for (const key of [
    "valuesRead",
    "valuesStored",
    "valuesHashed",
    "valuesCompared",
    "credentialValueRead",
    "credentialValuePrinted",
    "sqlExecuted",
    "supabaseWriteAttempted",
    "dailyPricesMutated",
    "marketDataFetched",
    "writeGateExecutableNow",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (packet.safety?.[key] !== false) problems.push(`packet safety.${key} must be false`);
  }
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_data_online_server_only_presence_recheck_no_execution_ready",
    "server_only_presence_recheck_no_execution",
    "prepared_waiting_external_presence",
    "not_checked_value_hidden",
    "operator_decision_presence_recheck",
    "execute_switch_presence_recheck",
    "confirmation_phrase_presence_recheck",
    "server_only_credential_presence_recheck",
    "rollback_reference_presence_recheck",
    "post_run_review_reference_presence_recheck",
    "boolean_presence_only",
    "value_presence_only_no_values",
    "credential_value_must_not_be_printed",
    "must_not_print_store_hash_compare_or_transform_values",
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
    packageJson.scripts?.["check:phase-1-data-online-server-only-presence-recheck-no-execution"] !==
    "node scripts/check-phase-1-data-online-server-only-presence-recheck-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-server-only-presence-recheck-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-server-only-presence-recheck-no-execution.mjs")) {
    problems.push("review gate missing server-only presence recheck checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-server-only-presence-recheck-no-execution"')) {
    problems.push("focused review gate missing server-only presence recheck checker");
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
      "credentialValueRead=true",
      "credentialValuePrinted=true",
      "valuesStored=true",
      "valuesHashed=true",
      "valuesCompared=true",
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
