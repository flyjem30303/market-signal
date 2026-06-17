import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-response-intake-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT_EXECUTION_AUTHORIZATION_RESPONSE_INTAKE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-execution-auth-response-"));

try {
  const authorizationPath = writeJson("accepted-execution-authorization.json", makeAcceptedExecutionAuthorization());
  const blockedAuthorizationPath = writeJson("blocked-execution-authorization.json", {
    ...makeAcceptedExecutionAuthorization(),
    status: "blocked"
  });
  const acceptedResponsePath = writeJson("accepted-execution-authorization-response.json", makeAcceptedResponse());
  const wrongDecisionPath = writeJson("wrong-decision-response.json", {
    ...makeAcceptedResponse(),
    authorizationDecision: "REJECT_KEEP_MOCK"
  });
  const mismatchPath = writeJson("mismatched-attempt-response.json", {
    ...makeAcceptedResponse(),
    attemptId: "other-attempt"
  });
  const missingConfirmPath = writeJson("missing-confirmation-response.json", {
    ...makeAcceptedResponse(),
    candidateArtifactPathReadyConfirmed: false
  });
  const rowPayloadPath = writeJson("row-payload-response.json", {
    ...makeAcceptedResponse(),
    rowPayload: []
  });
  const secretPath = writeJson("secret-response.json", {
    ...makeAcceptedResponse(),
    secret: "DO_NOT_LOG"
  });
  const realPromotionPath = writeJson("real-promotion-response.json", {
    ...makeAcceptedResponse(),
    scoreSource: "real"
  });
  const etfPath = writeJson("deferred-etf-response.json", {
    ...makeAcceptedResponse(),
    note: "0050 remains deferred"
  });
  const executablePath = writeJson("executable-response.json", {
    ...makeAcceptedResponse(),
    boundedWriteExecutableNow: true
  });
  const executedPath = writeJson("executed-response.json", {
    ...makeAcceptedResponse(),
    sqlExecuted: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--execution-authorization", authorizationPath, "--execution-authorization-response", acceptedResponsePath]));
  validateRejectedRun("blocked execution authorization", runNode(["--execution-authorization", blockedAuthorizationPath, "--execution-authorization-response", acceptedResponsePath]));
  validateRejectedRun("wrong decision", runNode(["--execution-authorization", authorizationPath, "--execution-authorization-response", wrongDecisionPath]));
  validateRejectedRun("mismatched attempt", runNode(["--execution-authorization", authorizationPath, "--execution-authorization-response", mismatchPath]));
  validateRejectedRun("missing confirmation", runNode(["--execution-authorization", authorizationPath, "--execution-authorization-response", missingConfirmPath]));
  validateRejectedRun("row payload response", runNode(["--execution-authorization", authorizationPath, "--execution-authorization-response", rowPayloadPath]));
  validateRejectedRun("secret response", runNode(["--execution-authorization", authorizationPath, "--execution-authorization-response", secretPath]));
  validateRejectedRun("real promotion response", runNode(["--execution-authorization", authorizationPath, "--execution-authorization-response", realPromotionPath]));
  validateRejectedRun("deferred ETF response", runNode(["--execution-authorization", authorizationPath, "--execution-authorization-response", etfPath]));
  validateRejectedRun("executable response", runNode(["--execution-authorization", authorizationPath, "--execution-authorization-response", executablePath]));
  validateRejectedRun("executed response", runNode(["--execution-authorization", authorizationPath, "--execution-authorization-response", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_response_intake_no_execution_ready"
      : "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_response_intake_no_execution_blocked",
    acceptedExecutionAuthorizationResponseReady: true,
    blockedAuthorizationRejected: true,
    wrongDecisionRejected: true,
    mismatchedAttemptRejected: true,
    missingConfirmationRejected: true,
    rowPayloadRejected: true,
    secretResponseRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableResponseRejected: true,
    executedResponseRejected: true,
    actualExecutionAuthorizationAcceptedNow: true,
    finalExecutionReadinessPreparedNow: true,
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
      ? "prepare_current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution"
      : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_execution_authorization_response_intake",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedExecutionAuthorization() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution_ready",
    actualExecutionAuthorizationPreparedNow: true,
    actualExecutionAuthorizationAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    actualBoundedWriteAttemptExecutionAuthorization: {
      authorizationMode: "current_scope_actual_bounded_write_attempt_execution_authorization_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      requiredAuthorizationDecision: "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_EXECUTION",
      acceptedExecutionPacketPresent: true,
      finalGoResponseAcceptedNow: true,
      actualExecutionAuthorizationAcceptedNow: false,
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
      requiredNextPacket: "current_scope_actual_bounded_write_attempt_execution_authorization_response_no_execution",
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
      scoreSource: "mock"
    },
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
    nextRoute: "await_separate_current_scope_actual_bounded_write_attempt_execution_authorization_response_no_execution",
    problems: []
  };
}

function makeAcceptedResponse() {
  return {
    responseMode: "current_scope_actual_bounded_write_attempt_execution_authorization_response_no_execution",
    authorizationDecision: "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_EXECUTION",
    attemptId: "phase-1-current-scope-attempt-example",
    acceptedExecutionPacketReviewedConfirmed: true,
    finalGoResponseReviewedConfirmed: true,
    candidateArtifactPathReadyConfirmed: true,
    serverOnlyRuntimeInputsReviewedConfirmed: true,
    insertMissingOnlyContractReviewedConfirmed: true,
    aggregateReadbackContractReviewedConfirmed: true,
    rollbackOrQuarantinePlanReviewedConfirmed: true,
    postRunReviewReviewedConfirmed: true,
    publicRuntimeStaysMockConfirmed: true,
    scoreSourceStaysMockConfirmed: true,
    runnerMustRemainFailClosedConfirmed: true,
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
    scoreSource: "mock"
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_response_intake_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.actualExecutionAuthorizationAcceptedNow, false, "missingArgs.actualExecutionAuthorizationAcceptedNow");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "missingArgs.actualWriteAttemptAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted execution authorization response intake should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_response_intake_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.actualExecutionAuthorizationAcceptedNow, true, "accepted.actualExecutionAuthorizationAcceptedNow");
  expect(result.output.finalExecutionReadinessPreparedNow, true, "accepted.finalExecutionReadinessPreparedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "accepted.actualWriteAttemptAllowedNow");
  expect(result.output.nextRoute, "prepare_current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const packet = result.output.actualBoundedWriteAttemptFinalExecutionReadinessPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("accepted.actualBoundedWriteAttemptFinalExecutionReadinessPacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.packetMode");
  expect(packet.attemptId, "phase-1-current-scope-attempt-example", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.attemptId");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.operationKind");
  expect(packet.acceptedExecutionAuthorizationResponsePresent, true, "actualBoundedWriteAttemptFinalExecutionReadinessPacket.acceptedExecutionAuthorizationResponsePresent");
  expect(packet.actualExecutionAuthorizationAcceptedNow, true, "actualBoundedWriteAttemptFinalExecutionReadinessPacket.actualExecutionAuthorizationAcceptedNow");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptFinalExecutionReadinessPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptFinalExecutionReadinessPacket.actualWriteAttemptAllowedNow");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution", "actualBoundedWriteAttemptFinalExecutionReadinessPacket.requiredNextPacket");
  expectSafeFlags(packet, "actualBoundedWriteAttemptFinalExecutionReadinessPacket");
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
      "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_response_intake_no_execution_ready",
      "AUTHORIZE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_EXECUTION",
      "actualExecutionAuthorizationAcceptedNow=true",
      "finalExecutionReadinessPreparedNow=true",
      "finalExecutionAllowedNow=false",
      "actualWriteAttemptAllowedNow=false",
      "prepare_current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Actual Bounded Write Attempt Execution Authorization Response Intake",
      "phase_1_current_scope_actual_bounded_write_attempt_execution_authorization_response_intake_no_execution_ready",
      "prepare_current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-response-intake-once"] !==
    "node scripts/run-phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-response-intake-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-response-intake-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-response-intake-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-response-intake-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing execution authorization response intake checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-attempt-execution-authorization-response-intake-no-execution"')) {
    problems.push(`${reviewGatePath} missing execution authorization response intake focused name`);
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
