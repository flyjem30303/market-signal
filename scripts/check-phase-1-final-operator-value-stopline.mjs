import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-final-operator-value-stopline.json";
const docPath = "docs/PHASE_1_FINAL_OPERATOR_VALUE_STOPLINE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const externalOperatorResult = runJson(
  "scripts/check-phase-1-external-operator-presence-reviewed-result.mjs",
  "external operator presence reviewed result"
);
const finalOperatorResult = runJson(
  "scripts/check-phase-1-final-operator-boolean-reviewed-result.mjs",
  "final operator boolean reviewed result"
);
const writeGate = runJson(
  "scripts/check-phase-1-data-online-write-gate-checklist-runner-no-execution.mjs",
  "write gate checklist runner"
);
const goNoGo = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data online go no-go");

validatePrerequisites();
validateArtifact();
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_final_operator_value_stopline_ready_no_execution"
        : "phase_1_final_operator_value_stopline_blocked",
      stoplineStatus: artifact.stoplineStatus ?? null,
      resolutionStatus: artifact.resolutionStatus ?? null,
      requiredMissingBooleanFields: artifact.requiredMissingBooleanFields ?? [],
      remainingBlockersAfterResolution: artifact.remainingBlockersAfterResolution ?? null,
      nextRouteAfterResolution: artifact.nextRouteAfterResolution ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
      dataOnlineDecision: artifact.dataOnlineDecision ?? null,
      publicDataSource: artifact.safety?.publicDataSource ?? null,
      scoreSource: artifact.safety?.scoreSource ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(externalOperatorResult.status, "ok", "external operator result status");
  expect(
    externalOperatorResult.guardedStatus,
    "phase_1_external_operator_presence_reviewed_result_ready_partial_boolean_only",
    "external operator result guarded status"
  );
  expect(externalOperatorResult.executeSwitchPresent, false, "execute switch should still be missing");
  expect(externalOperatorResult.confirmationPhrasePresent, false, "confirmation phrase should still be missing");
  expect(finalOperatorResult.status, "ok", "final operator result status");
  expect(
    finalOperatorResult.guardedStatus,
    "phase_1_final_operator_boolean_reviewed_result_ready_no_values",
    "final operator result guarded status"
  );
  expect(finalOperatorResult.executeSwitchPresent, true, "final execute switch presence");
  expect(finalOperatorResult.confirmationPhrasePresent, true, "final confirmation phrase presence");
  expect(finalOperatorResult.operatorValuesSatisfied, true, "operator values satisfied");
  expect(
    finalOperatorResult.operatorOwnedPresenceConfirmationSatisfied,
    true,
    "operator-owned presence confirmation satisfied"
  );
  expectArray(finalOperatorResult.remainingBlockersAfterThisResult, [], "final operator remainingBlockersAfterThisResult");
  expect(writeGate.status, "ok", "write gate status");
  expectArray(writeGate.remainingBlockers, [], "write gate remainingBlockers after final boolean result");
  expect(goNoGo.status, "ok", "go/no-go status");
  expect(goNoGo.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "go/no-go decision");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_final_operator_value_stopline_ready_no_execution", "artifact status");
  expect(artifact.packetMode, "final_operator_value_stopline_no_execution", "packetMode");
  expect(artifact.inputReviewedResult, "phase_1_external_operator_presence_reviewed_result_ready_partial_boolean_only", "inputReviewedResult");
  expect(artifact.stoplineStatus, "waiting_two_boolean_presence_fields", "stoplineStatus");
  expect(
    artifact.resolutionStatus,
    "resolved_by_final_operator_boolean_reviewed_result_no_execution",
    "resolutionStatus"
  );
  expect(
    artifact.resolvedByReviewedResult,
    "phase_1_final_operator_boolean_reviewed_result_ready_no_values",
    "resolvedByReviewedResult"
  );
  expectArray(artifact.requiredMissingBooleanFields, [
    "executeSwitchPresent",
    "confirmationPhrasePresent"
  ], "requiredMissingBooleanFields");
  expectArray(artifact.alreadyAcceptedBooleanFields, [
    "operatorDecisionPresent",
    "serverOnlyCredentialPresent",
    "rollbackReferencePresent",
    "postRunReviewReferencePresent"
  ], "alreadyAcceptedBooleanFields");
  expect(artifact.operatorReplyAllowedShape?.executeSwitchPresent, "boolean_only_no_value", "allowed executeSwitchPresent");
  expect(artifact.operatorReplyAllowedShape?.confirmationPhrasePresent, "boolean_only_no_value", "allowed confirmationPhrasePresent");
  for (const field of [
    "executeSwitchValue",
    "confirmationPhraseValue",
    "operatorDecisionValue",
    "credentialValue",
    "rawPayload",
    "rowPayload"
  ]) {
    if (!artifact.operatorReplyForbiddenFields?.includes(field)) problems.push(`operatorReplyForbiddenFields missing ${field}`);
  }
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.dataOnlineDecision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnlineDecision");
  expectArray(artifact.remainingBlockers, [
    "operator_values_missing",
    "operator_owned_presence_confirmation_unverified"
  ], "remainingBlockers");
  expectArray(artifact.resolvedBooleanFields, [
    "executeSwitchPresent",
    "confirmationPhrasePresent"
  ], "resolvedBooleanFields");
  expectArray(artifact.remainingBlockersAfterResolution, [], "remainingBlockersAfterResolution");
  expect(artifact.nextRouteAfterResolution, "phase_1_write_gate_preflight_after_operator_booleans", "nextRouteAfterResolution");
  expect(artifact.safety?.publicDataSource, "mock", "publicDataSource");
  expect(artifact.safety?.scoreSource, "mock", "scoreSource");
  for (const key of [
    "valuesRead",
    "valuesStored",
    "valuesPrinted",
    "valuesHashed",
    "valuesCompared",
    "valuesTransformed",
    "credentialValueRead",
    "credentialValueStored",
    "credentialValuePrinted",
    "sqlExecuted",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed",
    "investmentAdviceClaimAllowed"
  ]) {
    expect(artifact.safety?.[key], false, `safety.${key}`);
  }
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_final_operator_value_stopline_ready_no_execution",
    "final_operator_value_stopline_no_execution",
    "waiting_two_boolean_presence_fields",
    "resolved_by_final_operator_boolean_reviewed_result_no_execution",
    "phase_1_final_operator_boolean_reviewed_result_ready_no_values",
    "executeSwitchPresent",
    "confirmationPhrasePresent",
    "boolean_only_no_value",
    "operatorDecisionPresent",
    "serverOnlyCredentialPresent",
    "rollbackReferencePresent",
    "postRunReviewReferencePresent",
    "executeSwitchValue",
    "confirmationPhraseValue",
    "operatorDecisionValue",
    "credentialValue",
    "rawPayload",
    "rowPayload",
    "writeGateExecutableNow=false",
    "dataOnlineDecision=PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
    "publicDataSource=mock",
    "scoreSource=mock",
    "operator_values_missing",
    "operator_owned_presence_confirmation_unverified",
    "remainingBlockersAfterResolution=[]",
    "nextRouteAfterResolution=phase_1_write_gate_preflight_after_operator_booleans",
    "No value read",
    "No value storage",
    "No value printing",
    "No value hashing",
    "No value comparison",
    "No value transformation",
    "No credential value read",
    "No credential value storage",
    "No credential value output",
    "No SQL",
    "No Supabase read",
    "No Supabase write",
    "No staging rows",
    "No `daily_prices` mutation",
    "No market-data fetch",
    "No market-data ingestion",
    "No raw payload output",
    "No row payload output",
    "No secret output",
    "No source promotion",
    "No score promotion",
    "No public real-data claim",
    "No investment advice"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-final-operator-value-stopline"] !==
    "node scripts/check-phase-1-final-operator-value-stopline.mjs"
  ) {
    problems.push("package.json missing check:phase-1-final-operator-value-stopline");
  }
  if (!reviewGate.includes("scripts/check-phase-1-final-operator-value-stopline.mjs")) {
    problems.push("review gate missing final operator value stopline checker");
  }
  if (!reviewGate.includes('"phase-1-final-operator-value-stopline"')) {
    problems.push("focused review gate missing final operator value stopline checker");
  }
}

function validateBoundaries() {
  const forbiddenPatterns = [
    /sb_secret_/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
    /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
    /https:\/\/[a-z0-9.-]+supabase/iu,
    /"executeSwitchValue"\s*:\s*"(?!")/u,
    /"confirmationPhraseValue"\s*:\s*"(?!")/u,
    /"operatorDecisionValue"\s*:\s*"(?!")/u,
    /"credentialValue"\s*:\s*"(?!")/u,
    /valuesRead"\s*:\s*true/u,
    /valuesStored"\s*:\s*true/u,
    /valuesPrinted"\s*:\s*true/u,
    /valuesHashed"\s*:\s*true/u,
    /valuesCompared"\s*:\s*true/u,
    /valuesTransformed"\s*:\s*true/u,
    /supabaseReadAttempted"\s*:\s*true/u,
    /supabaseWriteAttempted"\s*:\s*true/u,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /writeGateExecutableNow"\s*:\s*true/u
  ];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(artifactRaw)) problems.push(`${artifactPath} contains forbidden pattern ${pattern}`);
    if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${pattern}`);
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function expectArray(actual, expected, label) {
  if (!Array.isArray(actual)) {
    problems.push(`${label} must be an array`);
    return;
  }
  const missing = expected.filter((item) => !actual.includes(item));
  const extra = actual.filter((item) => !expected.includes(item));
  if (missing.length > 0 || extra.length > 0) {
    problems.push(`${label} mismatch missing=${JSON.stringify(missing)} extra=${JSON.stringify(extra)}`);
  }
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
