import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_OPERATOR_OWNED_PRESENCE_CONFIRMATION_PATH_NO_EXECUTION.md";
const packetPath = "data/evidence-intake/phase-1-operator-owned-presence-confirmation-path.json";
const serverOnlyDocPath = "docs/PHASE_1_DATA_ONLINE_SERVER_ONLY_PRESENCE_RECHECK_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packet = parseJson(readText(packetPath), packetPath);
const serverOnlyDoc = readText(serverOnlyDocPath);
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
    ? "phase_1_data_online_operator_owned_presence_confirmation_path_no_execution_ready"
    : "phase_1_data_online_operator_owned_presence_confirmation_path_no_execution_blocked",
  packetMode: "operator_owned_presence_confirmation_path_no_execution",
  operatorOwnedPresenceConfirmationStatus: packet.operatorOwnedPresenceConfirmationStatus ?? null,
  presenceConfirmationMode: packet.presenceConfirmationMode ?? null,
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
    "phase_1_data_online_server_only_presence_recheck_no_execution_ready",
    "server_only_presence_recheck_no_execution",
    "prepared_waiting_external_presence",
    "serverOnlyCredentialPresenceStatus=not_checked_value_hidden",
    "externalOperatorValuesPresenceStatus=not_checked_value_hidden",
    "must_not_print_store_hash_compare_or_transform_values"
  ]) {
    if (!serverOnlyDoc.includes(token)) problems.push(`server-only presence doc missing ${token}`);
  }
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validatePacket() {
  expect(packet.status, "operator_owned_presence_confirmation_path_ready_no_execution", "packet status");
  expect(packet.packetMode, "operator_owned_presence_confirmation_path_no_execution", "packet mode");
  expect(
    packet.operatorOwnedPresenceConfirmationStatus,
    "prepared_external_only",
    "operatorOwnedPresenceConfirmationStatus"
  );
  expect(
    packet.presenceConfirmationMode,
    "boolean_presence_only_external_operator_owned",
    "presenceConfirmationMode"
  );
  expect(packet.serverOnlyCredentialPresenceStatus, "not_checked_value_hidden", "serverOnlyCredentialPresenceStatus");
  expect(packet.externalOperatorValuesPresenceStatus, "not_checked_value_hidden", "externalOperatorValuesPresenceStatus");
  expect(packet.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(packet.publicDataSource, "mock", "publicDataSource");
  expect(packet.scoreSource, "mock", "scoreSource");
  const confirmationSlots = Array.isArray(packet.confirmationSlots) ? packet.confirmationSlots : [];
  for (const slot of [
    "operator_decision_presence_confirmation",
    "execute_switch_presence_confirmation",
    "confirmation_phrase_presence_confirmation",
    "server_only_credential_presence_confirmation",
    "rollback_reference_presence_confirmation",
    "post_run_review_reference_presence_confirmation"
  ]) {
    if (!confirmationSlots.includes(slot)) problems.push(`packet missing confirmationSlot ${slot}`);
  }
  for (const key of [
    "valuesRead",
    "valuesStored",
    "valuesPrinted",
    "valuesHashed",
    "valuesCompared",
    "valuesTransformed",
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
    "phase_1_data_online_operator_owned_presence_confirmation_path_no_execution_ready",
    "operator_owned_presence_confirmation_path_no_execution",
    "operatorOwnedPresenceConfirmationStatus=prepared_external_only",
    "presenceConfirmationMode=boolean_presence_only_external_operator_owned",
    "server_only_presence_recheck_required",
    "serverOnlyCredentialPresenceStatus=not_checked_value_hidden",
    "externalOperatorValuesPresenceStatus=not_checked_value_hidden",
    "operator_decision_presence_confirmation",
    "execute_switch_presence_confirmation",
    "confirmation_phrase_presence_confirmation",
    "server_only_credential_presence_confirmation",
    "rollback_reference_presence_confirmation",
    "post_run_review_reference_presence_confirmation",
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
    packageJson.scripts?.["check:phase-1-data-online-operator-owned-presence-confirmation-path-no-execution"] !==
    "node scripts/check-phase-1-data-online-operator-owned-presence-confirmation-path-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-operator-owned-presence-confirmation-path-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-operator-owned-presence-confirmation-path-no-execution.mjs")) {
    problems.push("review gate missing operator-owned presence confirmation path checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-operator-owned-presence-confirmation-path-no-execution"')) {
    problems.push("focused review gate missing operator-owned presence confirmation path checker");
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
      "valuesRead=true",
      "valuesStored=true",
      "valuesPrinted=true",
      "valuesHashed=true",
      "valuesCompared=true",
      "valuesTransformed=true",
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
