import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-actual-bounded-write-attempt-authorization-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT_AUTHORIZATION_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-actual-write-authorization-"));

try {
  const acceptedGatePath = writeJson("accepted-execution-gate.json", makeAcceptedExecutionGate());
  const blockedGatePath = writeJson("blocked-execution-gate.json", {
    ...makeAcceptedExecutionGate(),
    status: "blocked"
  });
  const missingGatePath = writeJson("missing-execution-gate-object.json", {
    ...makeAcceptedExecutionGate(),
    singleBoundedWriteAttemptExecutionGate: null
  });
  const rowPayloadPath = writeJson("row-payload-execution-gate.json", {
    ...makeAcceptedExecutionGate(),
    rowPayload: []
  });
  const secretPath = writeJson("secret-execution-gate.json", {
    ...makeAcceptedExecutionGate(),
    secret: "DO_NOT_LOG"
  });
  const realPromotionPath = writeJson("real-promotion-execution-gate.json", {
    ...makeAcceptedExecutionGate(),
    scoreSource: "real"
  });
  const etfPath = writeJson("deferred-etf-execution-gate.json", {
    ...makeAcceptedExecutionGate(),
    note: "0050 remains deferred"
  });
  const executablePath = writeJson("executable-execution-gate.json", {
    ...makeAcceptedExecutionGate(),
    boundedWriteExecutableNow: true
  });
  const executedPath = writeJson("executed-execution-gate.json", {
    ...makeAcceptedExecutionGate(),
    sqlExecuted: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--execution-gate", acceptedGatePath]));
  validateRejectedRun("blocked execution gate", runNode(["--execution-gate", blockedGatePath]));
  validateRejectedRun("missing execution gate object", runNode(["--execution-gate", missingGatePath]));
  validateRejectedRun("row payload execution gate", runNode(["--execution-gate", rowPayloadPath]));
  validateRejectedRun("secret execution gate", runNode(["--execution-gate", secretPath]));
  validateRejectedRun("real promotion execution gate", runNode(["--execution-gate", realPromotionPath]));
  validateRejectedRun("deferred ETF execution gate", runNode(["--execution-gate", etfPath]));
  validateRejectedRun("executable execution gate", runNode(["--execution-gate", executablePath]));
  validateRejectedRun("executed execution gate", runNode(["--execution-gate", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_actual_bounded_write_attempt_authorization_no_execution_ready"
      : "phase_1_current_scope_actual_bounded_write_attempt_authorization_no_execution_blocked",
    acceptedExecutionGateReady: true,
    blockedExecutionGateRejected: true,
    missingExecutionGateRejected: true,
    rowPayloadRejected: true,
    secretExecutionGateRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableExecutionGateRejected: true,
    executedExecutionGateRejected: true,
    actualWriteAttemptAuthorizationAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    dryRunExecutableNow: false,
    dryRunExecutedNow: false,
    runnerExecutableNow: false,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: ok
      ? "await_separate_current_scope_actual_bounded_write_attempt_authorization_response_no_execution"
      : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_authorization",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedExecutionGate() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_single_bounded_write_attempt_execution_gate_no_execution_ready",
    singleBoundedWriteAttemptExecutionGatePreparedNow: true,
    finalExecutionAllowedNow: false,
    singleBoundedWriteAttemptExecutionGate: {
      gateMode: "current_scope_single_bounded_write_attempt_execution_gate_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      acceptedFinalDecision: "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT",
      finalGoNoGoAcceptedNow: true,
      finalExecutionAllowedNow: false,
      actualWriteAttemptAllowedNow: false,
      runnerMustRemainFailClosed: true,
      candidateArtifactPathReadinessRequired: true,
      insertMissingOnlyContractRequired: true,
      aggregateReadbackContractRequired: true,
      rollbackOrQuarantinePlanRequired: true,
      postRunReviewRequired: true,
      publicRuntimeMustStayMock: true,
      scoreSourceMustStayMock: true,
      requiredNextPacket: "current_scope_actual_bounded_write_attempt_authorization",
      dryRunExecutableNow: false,
      dryRunExecutedNow: false,
      envValuesReadNow: false,
      secretValuesOutputNow: false,
      confirmationPhraseValueOutputNow: false,
      runnerExecutableNow: false,
      boundedWriteExecutableNow: false,
      candidateRowsAcceptedNow: false,
      writeGateOpenedNow: false,
      sqlExecuted: false,
      supabaseWriteAttempted: false,
      dailyPricesMutated: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    dryRunExecutableNow: false,
    dryRunExecutedNow: false,
    envValuesReadNow: false,
    secretValuesOutputNow: false,
    confirmationPhraseValueOutputNow: false,
    runnerExecutableNow: false,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "await_separate_current_scope_actual_bounded_write_attempt_authorization",
    problems: []
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_authorization_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "missingArgs.actualWriteAttemptAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted actual authorization gate should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_authorization_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.actualBoundedWriteAttemptAuthorizationPreparedNow, true, "accepted.actualBoundedWriteAttemptAuthorizationPreparedNow");
  expect(result.output.actualWriteAttemptAuthorizationAcceptedNow, false, "accepted.actualWriteAttemptAuthorizationAcceptedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "accepted.actualWriteAttemptAllowedNow");
  expect(result.output.nextRoute, "await_separate_current_scope_actual_bounded_write_attempt_authorization_response_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const authorization = result.output.actualBoundedWriteAttemptAuthorization;
  if (!authorization || typeof authorization !== "object") {
    problems.push("accepted.actualBoundedWriteAttemptAuthorization must be an object");
    return;
  }
  expect(authorization.authorizationMode, "current_scope_actual_bounded_write_attempt_authorization_no_execution", "actualBoundedWriteAttemptAuthorization.authorizationMode");
  expect(authorization.attemptId, "phase-1-current-scope-attempt-example", "actualBoundedWriteAttemptAuthorization.attemptId");
  expect(authorization.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptAuthorization.phase1Universe");
  expect(authorization.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptAuthorization.scope");
  expect(authorization.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptAuthorization.operationKind");
  expect(authorization.requiredAuthorizationDecision, "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT", "actualBoundedWriteAttemptAuthorization.requiredAuthorizationDecision");
  expect(authorization.acceptedFinalDecisionPresent, true, "actualBoundedWriteAttemptAuthorization.acceptedFinalDecisionPresent");
  expect(authorization.singleExecutionGateReady, true, "actualBoundedWriteAttemptAuthorization.singleExecutionGateReady");
  expect(authorization.actualWriteAttemptAuthorizationAcceptedNow, false, "actualBoundedWriteAttemptAuthorization.actualWriteAttemptAuthorizationAcceptedNow");
  expect(authorization.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptAuthorization.actualWriteAttemptAllowedNow");
  expect(authorization.runnerMustRemainFailClosed, true, "actualBoundedWriteAttemptAuthorization.runnerMustRemainFailClosed");
  expect(authorization.candidateArtifactPathReadinessRequired, true, "actualBoundedWriteAttemptAuthorization.candidateArtifactPathReadinessRequired");
  expect(authorization.insertMissingOnlyContractRequired, true, "actualBoundedWriteAttemptAuthorization.insertMissingOnlyContractRequired");
  expect(authorization.aggregateReadbackContractRequired, true, "actualBoundedWriteAttemptAuthorization.aggregateReadbackContractRequired");
  expect(authorization.rollbackOrQuarantinePlanRequired, true, "actualBoundedWriteAttemptAuthorization.rollbackOrQuarantinePlanRequired");
  expect(authorization.postRunReviewRequired, true, "actualBoundedWriteAttemptAuthorization.postRunReviewRequired");
  expect(authorization.publicRuntimeMustStayMock, true, "actualBoundedWriteAttemptAuthorization.publicRuntimeMustStayMock");
  expect(authorization.scoreSourceMustStayMock, true, "actualBoundedWriteAttemptAuthorization.scoreSourceMustStayMock");
  if (!Array.isArray(authorization.actualAuthorizationStoplines) || authorization.actualAuthorizationStoplines.length < 6) {
    problems.push("actualBoundedWriteAttemptAuthorization.actualAuthorizationStoplines must contain at least 6 items");
  }
  expectSafeFlags(authorization, "actualBoundedWriteAttemptAuthorization");
}

function validateRejectedRun(label, result) {
  if (result.exitCode === 0) problems.push(`${label} should fail`);
  expect(result.output.status, "blocked", `${label}.status`);
  expect(result.output.finalExecutionAllowedNow, false, `${label}.finalExecutionAllowedNow`);
  expect(result.output.actualWriteAttemptAllowedNow, false, `${label}.actualWriteAttemptAllowedNow`);
  expectSafeFlags(result.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_actual_bounded_write_attempt_authorization_no_execution_ready",
      "actualWriteAttemptAuthorizationAcceptedNow=false",
      "actualWriteAttemptAllowedNow=false",
      "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
      "await_separate_current_scope_actual_bounded_write_attempt_authorization_response_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Actual Bounded Write Attempt Authorization",
      "phase_1_current_scope_actual_bounded_write_attempt_authorization_no_execution_ready",
      "await_separate_current_scope_actual_bounded_write_attempt_authorization_response_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-actual-bounded-write-attempt-authorization-once"] !==
    "node scripts/run-phase-1-current-scope-actual-bounded-write-attempt-authorization-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-attempt-authorization-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-attempt-authorization-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-attempt-authorization-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing actual bounded write attempt authorization checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-attempt-authorization-no-execution"')) {
    problems.push(`${reviewGatePath} missing actual bounded write attempt authorization focused name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [[runnerPath, runnerSource], [docPath, doc]]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
  if (/process\.env/u.test(runnerSource)) problems.push(`${runnerPath} must not read process.env`);
}

function runNode(args) {
  const run = spawnSync(process.execPath, [runnerPath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  let output = {};
  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${runnerPath} ${args.join(" ")} did not emit JSON: ${error.message}`);
  }
  return { exitCode: run.status, output };
}

function expectSafeFlags(output, label) {
  for (const [field, expected] of [
    ["dryRunExecutableNow", false],
    ["dryRunExecutedNow", false],
    ["runnerExecutableNow", false],
    ["boundedWriteExecutableNow", false],
    ["candidateRowsAcceptedNow", false],
    ["writeGateOpenedNow", false],
    ["sqlExecuted", false],
    ["supabaseWriteAttempted", false],
    ["dailyPricesMutated", false],
    ["publicDataSource", "mock"],
    ["scoreSource", "mock"]
  ]) {
    expect(output[field], expected, `${label}.${field}`);
  }
}

function writeJson(fileName, value) {
  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
  return filePath;
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return filePath.endsWith(".json") ? "{}" : "";
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

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\.rpc\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /dryRunExecutableNow"\s*:\s*true/u,
    /dryRunExecutedNow"\s*:\s*true/u,
    /runnerExecutableNow"\s*:\s*true/u,
    /boundedWriteExecutableNow"\s*:\s*true/u,
    /candidateRowsAcceptedNow"\s*:\s*true/u,
    /writeGateOpenedNow"\s*:\s*true/u,
    /sqlExecuted"\s*:\s*true/u,
    /supabaseWriteAttempted"\s*:\s*true/u,
    /dailyPricesMutated"\s*:\s*true/u,
    /envValuesReadNow"\s*:\s*true/u,
    /secretValuesOutputNow"\s*:\s*true/u,
    /confirmationPhraseValueOutputNow"\s*:\s*true/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
