import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-final-operator-boolean-reviewed-result.json";
const docPath = "docs/PHASE_1_FINAL_OPERATOR_BOOLEAN_REVIEWED_RESULT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const intake = runJson("scripts/check-phase-1-final-operator-boolean-reply-intake.mjs", "operator boolean reply intake");

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
        ? "phase_1_final_operator_boolean_reviewed_result_ready_no_values"
        : "phase_1_final_operator_boolean_reviewed_result_blocked",
      acceptedOperatorReplyStatus: artifact.acceptedOperatorReplyStatus ?? null,
      executeSwitchPresent: artifact.executeSwitchPresent ?? null,
      confirmationPhrasePresent: artifact.confirmationPhrasePresent ?? null,
      operatorValuesSatisfied: artifact.operatorValuesSatisfied ?? null,
      operatorOwnedPresenceConfirmationSatisfied: artifact.operatorOwnedPresenceConfirmationSatisfied ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
      nextRoute: artifact.nextRoute ?? null,
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
  expect(intake.status, "ok", "intake status");
  expect(intake.acceptedOperatorReplyNow, true, "intake acceptedOperatorReplyNow");
  expect(intake.acceptedOperatorReplyStatus, "operator_boolean_reply_ready_for_reviewed_result", "intake reply status");
  expect(intake.executeSwitchPresent, true, "intake executeSwitchPresent");
  expect(intake.confirmationPhrasePresent, true, "intake confirmationPhrasePresent");
  expect(intake.writeGateExecutableNow, false, "intake writeGateExecutableNow");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_final_operator_boolean_reviewed_result_ready_no_values", "artifact status");
  expect(artifact.packetMode, "final_operator_boolean_reviewed_result_no_execution", "packetMode");
  expect(artifact.inputIntakeStatus, "operator_boolean_reply_ready_for_reviewed_result", "inputIntakeStatus");
  expect(artifact.replyPath, "tmp/phase-1-final-operator-boolean-reply.json", "replyPath");
  expect(artifact.acceptedOperatorReplyNow, true, "acceptedOperatorReplyNow");
  expect(artifact.acceptedOperatorReplyStatus, "accepted_boolean_reply_no_values", "acceptedOperatorReplyStatus");
  expect(artifact.executeSwitchPresent, true, "executeSwitchPresent");
  expect(artifact.confirmationPhrasePresent, true, "confirmationPhrasePresent");
  expect(artifact.booleanResultOnly, true, "booleanResultOnly");
  expect(artifact.operatorValuesSatisfied, true, "operatorValuesSatisfied");
  expect(artifact.operatorOwnedPresenceConfirmationSatisfied, true, "operatorOwnedPresenceConfirmationSatisfied");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.nextRoute, "phase_1_data_online_write_gate_preflight_after_operator_booleans", "nextRoute");
  expectArray(artifact.remainingBlockersAfterThisResult, [], "remainingBlockersAfterThisResult");
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
    "phase_1_final_operator_boolean_reviewed_result_ready_no_values",
    "final_operator_boolean_reviewed_result_no_execution",
    "accepted_boolean_reply_no_values",
    "executeSwitchPresent=true",
    "confirmationPhrasePresent=true",
    "booleanResultOnly=true",
    "operatorValuesSatisfied=true",
    "operatorOwnedPresenceConfirmationSatisfied=true",
    "remainingBlockersAfterThisResult=[]",
    "writeGateExecutableNow=false",
    "nextRoute=phase_1_data_online_write_gate_preflight_after_operator_booleans",
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
    packageJson.scripts?.["check:phase-1-final-operator-boolean-reviewed-result"] !==
    "node scripts/check-phase-1-final-operator-boolean-reviewed-result.mjs"
  ) {
    problems.push("package.json missing check:phase-1-final-operator-boolean-reviewed-result");
  }
  if (!reviewGate.includes("scripts/check-phase-1-final-operator-boolean-reviewed-result.mjs")) {
    problems.push("review gate missing final operator boolean reviewed result checker");
  }
  if (!reviewGate.includes('"phase-1-final-operator-boolean-reviewed-result"')) {
    problems.push("focused review gate missing final operator boolean reviewed result checker");
  }
}

function validateBoundaries() {
  const forbiddenPatterns = [
    /sb_secret_/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
    /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
    /https:\/\/[a-z0-9.-]+supabase/iu,
    /"executeSwitchValue"\s*:/u,
    /"confirmationPhraseValue"\s*:/u,
    /"operatorDecisionValue"\s*:/u,
    /"credentialValue"\s*:/u,
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
