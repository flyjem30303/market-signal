import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-final-operator-boolean-reply-intake.json";
const docPath = "docs/PHASE_1_FINAL_OPERATOR_BOOLEAN_REPLY_INTAKE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const replyPath = "tmp/phase-1-final-operator-boolean-reply.json";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const stopline = runJson("scripts/check-phase-1-final-operator-value-stopline.mjs", "final operator value stopline");
const reply = readOptionalReply(replyPath);

validatePrerequisites();
validateArtifact();
validateReplyIfPresent();
validateDoc();
validateRegistration();
validateBoundaries();

const replyExists = reply.exists === true;
const bothTrue =
  replyExists &&
  reply.data?.executeSwitchPresent === true &&
  reply.data?.confirmationPhrasePresent === true &&
  problems.length === 0;
const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_final_operator_boolean_reply_intake_ready"
        : "phase_1_final_operator_boolean_reply_intake_blocked",
      replyPath,
      replyExists,
      acceptedOperatorReplyNow: bothTrue,
      acceptedOperatorReplyStatus: !replyExists
        ? "waiting_operator_boolean_reply"
        : bothTrue
          ? "operator_boolean_reply_ready_for_reviewed_result"
          : "operator_boolean_reply_safe_but_not_complete",
      executeSwitchPresent: replyExists ? reply.data?.executeSwitchPresent ?? null : null,
      confirmationPhrasePresent: replyExists ? reply.data?.confirmationPhrasePresent ?? null : null,
      writeGateExecutableNow: false,
      dataOnlineDecision: "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
      publicDataSource: "mock",
      scoreSource: "mock",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validatePrerequisites() {
  expect(stopline.status, "ok", "stopline status");
  expect(stopline.guardedStatus, "phase_1_final_operator_value_stopline_ready_no_execution", "stopline guarded status");
  expect(stopline.stoplineStatus, "waiting_two_boolean_presence_fields", "stopline status detail");
}

function validateArtifact() {
  expect(artifact.status, "phase_1_final_operator_boolean_reply_intake_ready_waiting_reply", "artifact status");
  expect(artifact.packetMode, "final_operator_boolean_reply_intake_no_execution", "packetMode");
  expect(artifact.inputStopline, "phase_1_final_operator_value_stopline_ready_no_execution", "inputStopline");
  expect(artifact.replyPath, replyPath, "replyPath");
  expect(artifact.acceptedOperatorReplyNow, false, "acceptedOperatorReplyNow");
  expect(artifact.acceptedOperatorReplyStatus, "waiting_operator_boolean_reply", "acceptedOperatorReplyStatus");
  expectArray(artifact.allowedReplyFields, ["executeSwitchPresent", "confirmationPhrasePresent"], "allowedReplyFields");
  for (const field of [
    "executeSwitchValue",
    "confirmationPhraseValue",
    "operatorDecisionValue",
    "credentialValue",
    "rawPayload",
    "rowPayload",
    "secret",
    "sql"
  ]) {
    if (!artifact.forbiddenReplyFields?.includes(field)) problems.push(`forbiddenReplyFields missing ${field}`);
  }
  expect(artifact.replyAcceptanceRules?.executeSwitchPresent, "boolean_required", "executeSwitchPresent rule");
  expect(artifact.replyAcceptanceRules?.confirmationPhrasePresent, "boolean_required", "confirmationPhrasePresent rule");
  expect(artifact.replyAcceptanceRules?.bothTrueRequiredForNextReviewedResult, true, "both true rule");
  expect(artifact.replyAcceptanceRules?.falseAllowedButKeepsNoGo, true, "false allowed rule");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.dataOnlineDecision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "dataOnlineDecision");
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

function validateReplyIfPresent() {
  if (!reply.exists) return;
  if (!reply.ok) {
    problems.push(reply.error);
    return;
  }
  const keys = Object.keys(reply.data);
  const allowed = new Set(["executeSwitchPresent", "confirmationPhrasePresent"]);
  for (const key of keys) {
    if (!allowed.has(key)) problems.push(`${replyPath} contains forbidden field ${key}`);
  }
  for (const key of allowed) {
    if (typeof reply.data[key] !== "boolean") problems.push(`${replyPath}.${key} must be boolean`);
  }
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_final_operator_boolean_reply_intake_ready_waiting_reply",
    "final_operator_boolean_reply_intake_no_execution",
    "waiting_operator_boolean_reply",
    "tmp/phase-1-final-operator-boolean-reply.json",
    "executeSwitchPresent",
    "confirmationPhrasePresent",
    "executeSwitchValue",
    "confirmationPhraseValue",
    "operatorDecisionValue",
    "credentialValue",
    "rawPayload",
    "rowPayload",
    "acceptedOperatorReplyNow=false",
    "writeGateExecutableNow=false",
    "dataOnlineDecision=PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
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
    packageJson.scripts?.["check:phase-1-final-operator-boolean-reply-intake"] !==
    "node scripts/check-phase-1-final-operator-boolean-reply-intake.mjs"
  ) {
    problems.push("package.json missing check:phase-1-final-operator-boolean-reply-intake");
  }
  if (!reviewGate.includes("scripts/check-phase-1-final-operator-boolean-reply-intake.mjs")) {
    problems.push("review gate missing final operator boolean reply intake checker");
  }
  if (!reviewGate.includes('"phase-1-final-operator-boolean-reply-intake"')) {
    problems.push("focused review gate missing final operator boolean reply intake checker");
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
    if (reply.exists && pattern.test(reply.raw ?? "")) problems.push(`${replyPath} contains forbidden pattern ${pattern}`);
  }
}

function readOptionalReply(filePath) {
  if (!fs.existsSync(filePath)) return { exists: false };
  const raw = fs.readFileSync(filePath, "utf8");
  try {
    return { exists: true, ok: true, raw, data: JSON.parse(raw) };
  } catch (error) {
    return { exists: true, ok: false, raw, error: `${filePath} JSON parse failed: ${error.message}` };
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
