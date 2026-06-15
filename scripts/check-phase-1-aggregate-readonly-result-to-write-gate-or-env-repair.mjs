import fs from "node:fs";
import { spawnSync } from "node:child_process";

const artifactPath = "data/evidence-intake/phase-1-aggregate-readonly-result-to-write-gate-or-env-repair.json";
const inputResultPath = "data/evidence-intake/phase-1-bounded-readonly-attempt-result-20260615-a.json";
const docPath = "docs/PHASE_1_AGGREGATE_READONLY_RESULT_TO_WRITE_GATE_OR_ENV_REPAIR.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const inputRaw = readText(inputResultPath);
const input = parseJson(inputRaw, inputResultPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);

const readonlyResult = runJson(
  "scripts/check-phase-1-data-online-bounded-readonly-attempt-result-20260615-a.mjs",
  "bounded readonly attempt result"
);
const writeGate = runJson(
  "scripts/check-phase-1-data-online-write-gate-checklist-runner-no-execution.mjs",
  "write gate checklist runner"
);
const goNoGo = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs", "data online go no-go");

validateInputResult();
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
        ? "phase_1_aggregate_readonly_result_to_write_gate_or_env_repair_ready_no_execution"
        : "phase_1_aggregate_readonly_result_to_write_gate_or_env_repair_blocked",
      decision: artifact.decision ?? null,
      readonlyReachabilityProved: artifact.readonlyReachabilityProved ?? null,
      envRepairNeededNow: artifact.envRepairNeededNow ?? null,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
      nextRoute: artifact.nextRoute ?? null,
      dataOnlineDecision: goNoGo.decision ?? null,
      publicDataSource: goNoGo.publicDataSource ?? null,
      scoreSource: goNoGo.scoreSource ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateInputResult() {
  expect(readonlyResult.status, "ok", "bounded readonly checker status");
  expect(
    readonlyResult.guardedStatus,
    "phase_1_data_online_bounded_readonly_attempt_result_20260615_a_ready",
    "bounded readonly checker guarded status"
  );
  expect(readonlyResult.remoteAttempted, true, "bounded readonly checker remoteAttempted");
  if (typeof readonlyResult.rowCount !== "number" || readonlyResult.rowCount < 1) {
    problems.push("bounded readonly checker rowCount must be positive");
  }
  expect(input.status, "bounded_readonly_attempt_result_accepted_aggregate_only", "input status");
  expect(input.attemptId, "phase1-data-online-readonly-20260615-a", "input attemptId");
  expect(input.remoteAttempted, true, "input remoteAttempted");
  expect(input.aggregateProbe?.dailyPrices?.queryStatus, "ok", "input queryStatus");
  if (typeof input.aggregateProbe?.dailyPrices?.rowCount !== "number" || input.aggregateProbe.dailyPrices.rowCount < 1) {
    problems.push("input daily_prices rowCount must be positive aggregate number");
  }
}

function validateArtifact() {
  expect(
    artifact.status,
    "phase_1_aggregate_readonly_result_to_write_gate_or_env_repair_ready_no_execution",
    "artifact status"
  );
  expect(artifact.packetMode, "aggregate_readonly_result_to_write_gate_or_env_repair", "packetMode");
  expect(artifact.inputAttemptId, "phase1-data-online-readonly-20260615-a", "inputAttemptId");
  expect(artifact.inputResultPath, inputResultPath, "inputResultPath");
  expect(artifact.decision, "ROUTE_TO_EXTERNAL_OPERATOR_PRESENCE_RESULT_NOT_ENV_REPAIR", "decision");
  expect(artifact.readonlyReachabilityProved, true, "readonlyReachabilityProved");
  expect(artifact.envRepairNeededNow, false, "envRepairNeededNow");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.dataOnlineDecision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "artifact dataOnlineDecision");
  expect(artifact.nextRoute, "prepare_external_operator_boolean_presence_reviewed_result", "nextRoute");

  expect(writeGate.status, "ok", "write gate status");
  expect(writeGate.writeGateExecutableNow, false, "write gate executable");
  expect(goNoGo.status, "ok", "go/no-go status");
  expect(goNoGo.decision, "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO", "go/no-go decision");
  expect(goNoGo.publicDataSource, "mock", "publicDataSource");
  expect(goNoGo.scoreSource, "mock", "scoreSource");

  const expectedRemaining = [
    "operator_values_missing",
    "credential_presence_unverified",
    "operator_owned_presence_confirmation_unverified",
    "external_presence_acceptance_unverified",
    "external_presence_reviewed_result_missing"
  ];
  expectArray(artifact.currentRemainingBlockers, expectedRemaining, "artifact currentRemainingBlockers");
  expectArray(writeGate.remainingBlockers, expectedRemaining, "write gate remainingBlockers");

  const expectedReduced = [
    "schema_cache_exposure_unverified",
    "dashboard_api_exposure_unverified",
    "pgrst205_regression_unverified"
  ];
  for (const item of expectedReduced) {
    if (!artifact.reducedByAggregateReadonlyEvidence?.includes(item)) {
      problems.push(`artifact reducedByAggregateReadonlyEvidence missing ${item}`);
    }
  }

  for (const [key, expected] of Object.entries({
    aggregateOnly: true,
    booleanPresenceOnly: true,
    secretValueStored: false,
    credentialValueStored: false,
    operatorValueStored: false,
    rawPayloadStored: false,
    rowPayloadStored: false
  })) {
    expect(artifact.allowedNextArtifactShape?.[key], expected, `allowedNextArtifactShape.${key}`);
  }

  expect(artifact.safety?.publicDataSource, "mock", "safety publicDataSource");
  expect(artifact.safety?.scoreSource, "mock", "safety scoreSource");
  for (const key of [
    "sqlExecuted",
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
    "phase_1_aggregate_readonly_result_to_write_gate_or_env_repair_ready_no_execution",
    "ROUTE_TO_EXTERNAL_OPERATOR_PRESENCE_RESULT_NOT_ENV_REPAIR",
    "prepare_external_operator_boolean_presence_reviewed_result",
    "readonlyReachabilityProved=true",
    "envRepairNeededNow=false",
    "writeGateExecutableNow=false",
    "operator_values_missing",
    "credential_presence_unverified",
    "operator_owned_presence_confirmation_unverified",
    "external_presence_acceptance_unverified",
    "external_presence_reviewed_result_missing",
    "schema_cache_exposure_unverified",
    "dashboard_api_exposure_unverified",
    "pgrst205_regression_unverified",
    "aggregateOnly=true",
    "booleanPresenceOnly=true",
    "secretValueStored=false",
    "credentialValueStored=false",
    "operatorValueStored=false",
    "rawPayloadStored=false",
    "rowPayloadStored=false",
    "No SQL",
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
    "No investment advice",
    "publicDataSource=mock",
    "scoreSource=mock"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-aggregate-readonly-result-to-write-gate-or-env-repair"] !==
    "node scripts/check-phase-1-aggregate-readonly-result-to-write-gate-or-env-repair.mjs"
  ) {
    problems.push("package.json missing check:phase-1-aggregate-readonly-result-to-write-gate-or-env-repair");
  }
  if (!reviewGate.includes("scripts/check-phase-1-aggregate-readonly-result-to-write-gate-or-env-repair.mjs")) {
    problems.push("review gate missing aggregate readonly bridge checker command");
  }
  if (!reviewGate.includes('"phase-1-aggregate-readonly-result-to-write-gate-or-env-repair"')) {
    problems.push("focused review gate missing aggregate readonly bridge checker name");
  }
}

function validateBoundaries() {
  const forbiddenPatterns = [
    /sb_secret_/u,
    /service_role/iu,
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
    /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
    /https:\/\/[a-z0-9.-]+supabase/iu,
    /confirmationPresent/u,
    /requiredConfirmation/u,
    /CEO_APPROVED/u,
    /"rowBody"\s*:/u,
    /"rawPayload"\s*:/u,
    /"endpointResponseBody"\s*:/u,
    /"stockIdPayload"\s*:/u,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /writeGateExecutableNow"\s*:\s*true/u,
    /envRepairNeededNow"\s*:\s*true/u
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
