import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-external-operator-presence-reviewed-result.json";
const docPath = "docs/PHASE_1_EXTERNAL_OPERATOR_PRESENCE_REVIEWED_RESULT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const acceptanceGate = runJson(
  "scripts/check-phase-1-data-online-external-presence-acceptance-gate-no-execution.mjs",
  "external presence acceptance gate"
);
const reviewedShape = runJson(
  "scripts/check-phase-1-data-online-external-presence-reviewed-result-shape-no-execution.mjs",
  "external presence reviewed result shape"
);
const credentialPresence = runJson(
  "scripts/check-phase-1-server-only-credential-presence-reviewed-result.mjs",
  "server-only credential presence reviewed result"
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
        ? "phase_1_external_operator_presence_reviewed_result_ready_partial_boolean_only"
        : "phase_1_external_operator_presence_reviewed_result_blocked",
      reviewedResultStatus: artifact.reviewedResultStatus ?? null,
      acceptedPresenceResultStatus: artifact.acceptedPresenceResultStatus ?? null,
      operatorDecisionPresent: artifact.operatorDecisionPresent ?? null,
      executeSwitchPresent: artifact.executeSwitchPresent ?? null,
      confirmationPhrasePresent: artifact.confirmationPhrasePresent ?? null,
      serverOnlyCredentialPresent: artifact.serverOnlyCredentialPresent ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
      remainingBlockersAfterThisResult: artifact.remainingBlockersAfterThisResult ?? [],
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
  expect(acceptanceGate.status, "ok", "external presence acceptance gate status");
  expect(
    acceptanceGate.guardedStatus,
    "phase_1_data_online_external_presence_acceptance_gate_no_execution_ready",
    "external presence acceptance gate guarded status"
  );
  expect(reviewedShape.status, "ok", "external presence reviewed result shape status");
  expect(
    reviewedShape.guardedStatus,
    "phase_1_data_online_external_presence_reviewed_result_shape_no_execution_ready",
    "external presence reviewed result shape guarded status"
  );
  expect(credentialPresence.status, "ok", "credential presence status");
  expect(credentialPresence.serverOnlyCredentialPresent, true, "credential presence boolean");
  expect(goNoGo.status, "ok", "go/no-go status");
  expect(goNoGo.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "go/no-go decision");
}

function validateArtifact() {
  expect(
    artifact.status,
    "phase_1_external_operator_presence_reviewed_result_ready_partial_boolean_only",
    "artifact status"
  );
  expect(artifact.packetMode, "external_operator_presence_reviewed_result", "packetMode");
  expect(artifact.reviewedResultStatus, "accepted_partial_boolean_presence_result_no_values", "reviewedResultStatus");
  expect(artifact.acceptedPresenceResultStatus, "accepted_partial_boolean_result_no_values", "acceptedPresenceResultStatus");
  expect(artifact.operatorDecisionPresent, true, "operatorDecisionPresent");
  expect(artifact.executeSwitchPresent, false, "executeSwitchPresent");
  expect(artifact.confirmationPhrasePresent, false, "confirmationPhrasePresent");
  expect(artifact.serverOnlyCredentialPresent, true, "serverOnlyCredentialPresent");
  expect(artifact.rollbackReferencePresent, true, "rollbackReferencePresent");
  expect(artifact.postRunReviewReferencePresent, true, "postRunReviewReferencePresent");
  expect(artifact.booleanResultOnly, true, "booleanResultOnly");
  expect(artifact.partialResultReason, "execute_switch_and_confirmation_phrase_not_present", "partialResultReason");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expectArray(artifact.reducesBlockers, [
    "external_presence_acceptance_unverified",
    "external_presence_reviewed_result_missing"
  ], "reducesBlockers");
  expectArray(artifact.remainingBlockersAfterThisResult, [
    "operator_values_missing",
    "operator_owned_presence_confirmation_unverified"
  ], "remainingBlockersAfterThisResult");
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
    "phase_1_external_operator_presence_reviewed_result_ready_partial_boolean_only",
    "external_operator_presence_reviewed_result",
    "accepted_partial_boolean_presence_result_no_values",
    "acceptedPresenceResultStatus=accepted_partial_boolean_result_no_values",
    "external_presence_acceptance_unverified",
    "external_presence_reviewed_result_missing",
    "operator_values_missing",
    "operator_owned_presence_confirmation_unverified",
    "operatorDecisionPresent=true",
    "executeSwitchPresent=false",
    "confirmationPhrasePresent=false",
    "serverOnlyCredentialPresent=true",
    "rollbackReferencePresent=true",
    "postRunReviewReferencePresent=true",
    "booleanResultOnly=true",
    "execute_switch_and_confirmation_phrase_not_present",
    "writeGateExecutableNow=false",
    "publicDataSource=mock",
    "scoreSource=mock",
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
    packageJson.scripts?.["check:phase-1-external-operator-presence-reviewed-result"] !==
    "node scripts/check-phase-1-external-operator-presence-reviewed-result.mjs"
  ) {
    problems.push("package.json missing check:phase-1-external-operator-presence-reviewed-result");
  }
  if (!reviewGate.includes("scripts/check-phase-1-external-operator-presence-reviewed-result.mjs")) {
    problems.push("review gate missing external operator presence reviewed result checker");
  }
  if (!reviewGate.includes('"phase-1-external-operator-presence-reviewed-result"')) {
    problems.push("focused review gate missing external operator presence reviewed result checker");
  }
}

function validateBoundaries() {
  const forbiddenPatterns = [
    /sb_secret_/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
    /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
    /https:\/\/[a-z0-9.-]+supabase/iu,
    /"operatorDecisionValue"\s*:/u,
    /"executeSwitchValue"\s*:/u,
    /"confirmationPhraseValue"\s*:/u,
    /"credentialValue"\s*:/u,
    /valuesRead"\s*:\s*true/u,
    /valuesStored"\s*:\s*true/u,
    /valuesPrinted"\s*:\s*true/u,
    /valuesHashed"\s*:\s*true/u,
    /valuesCompared"\s*:\s*true/u,
    /valuesTransformed"\s*:\s*true/u,
    /credentialValueRead"\s*:\s*true/u,
    /credentialValueStored"\s*:\s*true/u,
    /credentialValuePrinted"\s*:\s*true/u,
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
