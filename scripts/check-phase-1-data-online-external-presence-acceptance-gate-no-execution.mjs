import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_EXTERNAL_PRESENCE_ACCEPTANCE_GATE_NO_EXECUTION.md";
const packetPath = "data/evidence-intake/phase-1-external-presence-acceptance-gate.json";
const operatorOwnedDocPath = "docs/PHASE_1_DATA_ONLINE_OPERATOR_OWNED_PRESENCE_CONFIRMATION_PATH_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packet = parseJson(readText(packetPath), packetPath);
const operatorOwnedDoc = readText(operatorOwnedDocPath);
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
    ? "phase_1_data_online_external_presence_acceptance_gate_no_execution_ready"
    : "phase_1_data_online_external_presence_acceptance_gate_no_execution_blocked",
  packetMode: "external_presence_acceptance_gate_no_execution",
  externalPresenceAcceptanceStatus: packet.externalPresenceAcceptanceStatus ?? null,
  acceptedPresenceResultStatus: packet.acceptedPresenceResultStatus ?? null,
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
    "phase_1_data_online_operator_owned_presence_confirmation_path_no_execution_ready",
    "operator_owned_presence_confirmation_path_no_execution",
    "operatorOwnedPresenceConfirmationStatus=prepared_external_only",
    "presenceConfirmationMode=boolean_presence_only_external_operator_owned",
    "must_not_print_store_hash_compare_or_transform_values"
  ]) {
    if (!operatorOwnedDoc.includes(token)) problems.push(`operator-owned presence doc missing ${token}`);
  }
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validatePacket() {
  expect(packet.status, "external_presence_acceptance_gate_ready_no_execution", "packet status");
  expect(packet.packetMode, "external_presence_acceptance_gate_no_execution", "packet mode");
  expect(packet.externalPresenceAcceptanceStatus, "prepared_waiting_pm_review", "externalPresenceAcceptanceStatus");
  expect(packet.acceptedPresenceResultStatus, "not_accepted_no_boolean_result_stored", "acceptedPresenceResultStatus");
  expect(packet.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(packet.publicDataSource, "mock", "publicDataSource");
  expect(packet.scoreSource, "mock", "scoreSource");
  const acceptedFields = Array.isArray(packet.allowedBooleanFields) ? packet.allowedBooleanFields : [];
  for (const field of [
    "operatorDecisionPresent",
    "executeSwitchPresent",
    "confirmationPhrasePresent",
    "serverOnlyCredentialPresent",
    "rollbackReferencePresent",
    "postRunReviewReferencePresent"
  ]) {
    if (!acceptedFields.includes(field)) problems.push(`packet missing allowedBooleanField ${field}`);
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
    "phase_1_data_online_external_presence_acceptance_gate_no_execution_ready",
    "external_presence_acceptance_gate_no_execution",
    "externalPresenceAcceptanceStatus=prepared_waiting_pm_review",
    "acceptedPresenceResultStatus=not_accepted_no_boolean_result_stored",
    "operator_owned_presence_confirmation_path_required",
    "operatorDecisionPresent",
    "executeSwitchPresent",
    "confirmationPhrasePresent",
    "serverOnlyCredentialPresent",
    "rollbackReferencePresent",
    "postRunReviewReferencePresent",
    "boolean_result_only",
    "no_secret_value_fields",
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
    packageJson.scripts?.["check:phase-1-data-online-external-presence-acceptance-gate-no-execution"] !==
    "node scripts/check-phase-1-data-online-external-presence-acceptance-gate-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-external-presence-acceptance-gate-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-external-presence-acceptance-gate-no-execution.mjs")) {
    problems.push("review gate missing external presence acceptance gate checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-external-presence-acceptance-gate-no-execution"')) {
    problems.push("focused review gate missing external presence acceptance gate checker");
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
