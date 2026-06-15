import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/PHASE_1_DATA_ONLINE_EXTERNAL_PRESENCE_REVIEWED_RESULT_SHAPE_NO_EXECUTION.md";
const packetPath = "data/evidence-intake/phase-1-external-presence-reviewed-result-shape.json";
const acceptanceDocPath = "docs/PHASE_1_DATA_ONLINE_EXTERNAL_PRESENCE_ACCEPTANCE_GATE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packet = parseJson(readText(packetPath), packetPath);
const acceptanceDoc = readText(acceptanceDocPath);
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
    ? "phase_1_data_online_external_presence_reviewed_result_shape_no_execution_ready"
    : "phase_1_data_online_external_presence_reviewed_result_shape_no_execution_blocked",
  packetMode: "external_presence_reviewed_result_shape_no_execution",
  reviewedResultShapeStatus: packet.reviewedResultShapeStatus ?? null,
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
    "phase_1_data_online_external_presence_acceptance_gate_no_execution_ready",
    "external_presence_acceptance_gate_no_execution",
    "externalPresenceAcceptanceStatus=prepared_waiting_pm_review",
    "acceptedPresenceResultStatus=not_accepted_no_boolean_result_stored",
    "boolean_result_only",
    "no_secret_value_fields"
  ]) {
    if (!acceptanceDoc.includes(token)) problems.push(`external presence acceptance doc missing ${token}`);
  }
  expect(dataOnline.status, "ok", "dataOnline status");
  expect(dataOnline.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnline decision");
  expect(dataOnline.publicDataSource, "mock", "dataOnline publicDataSource");
  expect(dataOnline.scoreSource, "mock", "dataOnline scoreSource");
}

function validatePacket() {
  expect(packet.status, "external_presence_reviewed_result_shape_ready_no_execution", "packet status");
  expect(packet.packetMode, "external_presence_reviewed_result_shape_no_execution", "packet mode");
  expect(packet.reviewedResultShapeStatus, "shape_ready_waiting_external_boolean_result", "reviewedResultShapeStatus");
  expect(packet.acceptedPresenceResultStatus, "not_accepted_no_boolean_result_stored", "acceptedPresenceResultStatus");
  expect(packet.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(packet.publicDataSource, "mock", "publicDataSource");
  expect(packet.scoreSource, "mock", "scoreSource");
  const requiredBooleans = packet.requiredBooleanFields ?? {};
  for (const field of [
    "operatorDecisionPresent",
    "executeSwitchPresent",
    "confirmationPhrasePresent",
    "serverOnlyCredentialPresent",
    "rollbackReferencePresent",
    "postRunReviewReferencePresent"
  ]) {
    if (requiredBooleans[field] !== "boolean_required_when_external_result_exists") {
      problems.push(`packet requiredBooleanFields.${field} must require boolean`);
    }
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
    "phase_1_data_online_external_presence_reviewed_result_shape_no_execution_ready",
    "external_presence_reviewed_result_shape_no_execution",
    "reviewedResultShapeStatus=shape_ready_waiting_external_boolean_result",
    "acceptedPresenceResultStatus=not_accepted_no_boolean_result_stored",
    "external_presence_acceptance_gate_required",
    "operatorDecisionPresent:boolean",
    "executeSwitchPresent:boolean",
    "confirmationPhrasePresent:boolean",
    "serverOnlyCredentialPresent:boolean",
    "rollbackReferencePresent:boolean",
    "postRunReviewReferencePresent:boolean",
    "boolean_required_when_external_result_exists",
    "no_values_no_hashes_no_comparisons",
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
    packageJson.scripts?.["check:phase-1-data-online-external-presence-reviewed-result-shape-no-execution"] !==
    "node scripts/check-phase-1-data-online-external-presence-reviewed-result-shape-no-execution.mjs"
  ) {
    problems.push("package.json missing check:phase-1-data-online-external-presence-reviewed-result-shape-no-execution");
  }
  if (!reviewGate.includes("scripts/check-phase-1-data-online-external-presence-reviewed-result-shape-no-execution.mjs")) {
    problems.push("review gate missing external presence reviewed result shape checker");
  }
  if (!reviewGate.includes('"phase-1-data-online-external-presence-reviewed-result-shape-no-execution"')) {
    problems.push("focused review gate missing external presence reviewed result shape checker");
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
