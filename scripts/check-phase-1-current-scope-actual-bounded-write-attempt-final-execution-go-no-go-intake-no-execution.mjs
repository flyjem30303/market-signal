import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-actual-bounded-write-attempt-final-execution-go-no-go-intake-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT_FINAL_EXECUTION_GO_NO_GO_INTAKE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = readIfExists(runnerPath);
const doc = readIfExists(docPath);
const pkg = parseJson(readIfExists(packagePath), packagePath);
const reviewGate = readIfExists(reviewGatePath);
const projectStatus = readIfExists(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-final-go-no-go-intake-"));

try {
  const acceptedPath = writeJson("accepted-final-execution-go-no-go-response.json", makeAcceptedResponse());
  const readinessPath = writeJson("final-execution-readiness-packet.json", makeFinalExecutionReadinessPacket());
  const blockedResponsePath = writeJson("blocked-final-execution-go-no-go-response.json", {
    ...makeAcceptedResponse(),
    decision: "WAIT"
  });
  const missingConfirmationsPath = writeJson("missing-confirmations-response.json", {
    ...makeAcceptedResponse(),
    confirmations: {
      ...makeAcceptedResponse().confirmations,
      postRunReviewRequired: false
    }
  });
  const mismatchedAttemptPath = writeJson("mismatched-attempt-response.json", {
    ...makeAcceptedResponse(),
    attemptId: "different-attempt"
  });
  const rowPayloadPath = writeJson("row-payload-response.json", {
    ...makeAcceptedResponse(),
    rowPayload: []
  });
  const secretPath = writeJson("secret-response.json", {
    ...makeAcceptedResponse(),
    token: "DO_NOT_LOG"
  });
  const realPromotionPath = writeJson("real-promotion-response.json", {
    ...makeAcceptedResponse(),
    publicDataSource: "supabase"
  });
  const executablePath = writeJson("executable-response.json", {
    ...makeAcceptedResponse(),
    actualWriteAttemptAllowedNow: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode([
    "--final-execution-readiness-packet",
    readinessPath,
    "--final-execution-go-no-go-response",
    acceptedPath
  ]));
  validateRejectedRun("blocked response", runNode([
    "--final-execution-readiness-packet",
    readinessPath,
    "--final-execution-go-no-go-response",
    blockedResponsePath
  ]));
  validateRejectedRun("missing confirmation", runNode([
    "--final-execution-readiness-packet",
    readinessPath,
    "--final-execution-go-no-go-response",
    missingConfirmationsPath
  ]));
  validateRejectedRun("mismatched attempt", runNode([
    "--final-execution-readiness-packet",
    readinessPath,
    "--final-execution-go-no-go-response",
    mismatchedAttemptPath
  ]));
  validateRejectedRun("row payload response", runNode([
    "--final-execution-readiness-packet",
    readinessPath,
    "--final-execution-go-no-go-response",
    rowPayloadPath
  ]));
  validateRejectedRun("secret response", runNode([
    "--final-execution-readiness-packet",
    readinessPath,
    "--final-execution-go-no-go-response",
    secretPath
  ]));
  validateRejectedRun("real promotion response", runNode([
    "--final-execution-readiness-packet",
    readinessPath,
    "--final-execution-go-no-go-response",
    realPromotionPath
  ]));
  validateRejectedRun("executable response", runNode([
    "--final-execution-readiness-packet",
    readinessPath,
    "--final-execution-go-no-go-response",
    executablePath
  ]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake_no_execution_ready"
      : "phase_1_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake_no_execution_blocked",
    acceptedFinalExecutionGoNoGoReady: true,
    blockedResponseRejected: true,
    missingConfirmationRejected: true,
    mismatchedAttemptRejected: true,
    rowPayloadRejected: true,
    secretResponseRejected: true,
    realPromotionRejected: true,
    executableResponseRejected: true,
    finalExecutionGoNoGoAcceptedNow: true,
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
      ? "prepare_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution"
      : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeFinalExecutionReadinessPacket() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution_ready",
    finalExecutionReadinessPacketPreparedNow: true,
    finalExecutionGoNoGoAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    actualBoundedWriteAttemptFinalExecutionReadinessPacket: {
      packetMode: "current_scope_actual_bounded_write_attempt_final_execution_readiness_packet_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      requiredFinalExecutionGoNoGoDecision: "FINAL_GO_EXECUTE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
      acceptedExecutionAuthorizationResponsePresent: true,
      actualExecutionAuthorizationAcceptedNow: true,
      finalExecutionGoNoGoAcceptedNow: false,
      finalExecutionAllowedNow: false,
      actualWriteAttemptAllowedNow: false,
      runnerMustRemainFailClosed: true,
      requiredNextPacket: "current_scope_actual_bounded_write_attempt_final_execution_go_no_go_no_execution",
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
    scoreSource: "mock"
  };
}

function makeAcceptedResponse() {
  return {
    responseMode: "current_scope_actual_bounded_write_attempt_final_execution_go_no_go_response_no_execution",
    decision: "FINAL_GO_EXECUTE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
    attemptId: "phase-1-current-scope-attempt-example",
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    confirmations: {
      finalExecutionReadinessPacketReviewed: true,
      candidateArtifactPathReady: true,
      serverOnlyRuntimeInputsReviewed: true,
      insertMissingOnlyContractReviewed: true,
      aggregateReadbackRequired: true,
      rollbackOrQuarantineReviewed: true,
      postRunReviewRequired: true,
      publicDataSourceRemainsMock: true,
      scoreSourceRemainsMock: true,
      runnerRemainsFailClosedUntilSeparateExecutionPacket: true
    },
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
    scoreSource: "mock"
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "missingArgs.actualWriteAttemptAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted final execution go/no-go intake should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.finalExecutionGoNoGoAcceptedNow, true, "accepted.finalExecutionGoNoGoAcceptedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "accepted.actualWriteAttemptAllowedNow");
  expect(result.output.nextRoute, "prepare_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const packet = result.output.actualBoundedWriteAttemptExecutionHandoffPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("accepted.actualBoundedWriteAttemptExecutionHandoffPacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution", "actualBoundedWriteAttemptExecutionHandoffPacket.packetMode");
  expect(packet.attemptId, "phase-1-current-scope-attempt-example", "actualBoundedWriteAttemptExecutionHandoffPacket.attemptId");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptExecutionHandoffPacket.phase1Universe");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptExecutionHandoffPacket.operationKind");
  expect(packet.acceptedFinalExecutionGoNoGoPresent, true, "actualBoundedWriteAttemptExecutionHandoffPacket.acceptedFinalExecutionGoNoGoPresent");
  expect(packet.finalExecutionGoNoGoAcceptedNow, true, "actualBoundedWriteAttemptExecutionHandoffPacket.finalExecutionGoNoGoAcceptedNow");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptExecutionHandoffPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptExecutionHandoffPacket.actualWriteAttemptAllowedNow");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution", "actualBoundedWriteAttemptExecutionHandoffPacket.requiredNextPacket");
  expectSafeFlags(packet, "actualBoundedWriteAttemptExecutionHandoffPacket");
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
    [runnerPath, runnerSource, [
      "phase_1_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake_no_execution_ready",
      "current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution",
      "FINAL_GO_EXECUTE_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
      "prepare_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution"
    ]],
    [docPath, doc, [
      "phase_1_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake_no_execution_ready",
      "finalExecutionGoNoGoAcceptedNow=true",
      "finalExecutionAllowedNow=false",
      "actualWriteAttemptAllowedNow=false",
      "prepare_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Actual Bounded Write Attempt Final Execution Go/No-Go Intake",
      "phase_1_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake_no_execution_ready",
      "prepare_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-actual-bounded-write-attempt-final-execution-go-no-go-intake-once"] !==
    "node scripts/run-phase-1-current-scope-actual-bounded-write-attempt-final-execution-go-no-go-intake-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-attempt-final-execution-go-no-go-intake-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-attempt-final-execution-go-no-go-intake-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-attempt-final-execution-go-no-go-intake-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing final execution go/no-go intake checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-attempt-final-execution-go-no-go-intake-no-execution"')) {
    problems.push(`${reviewGatePath} missing final execution go/no-go intake focused name`);
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
  if (!fs.existsSync(runnerPath)) return { exitCode: 1, output: {} };
  const run = spawnSync(process.execPath, [runnerPath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  return {
    exitCode: run.status ?? 1,
    output: parseJson(run.stdout || "{}", `${runnerPath} stdout`),
    stderr: run.stderr
  };
}

function writeJson(fileName, value) {
  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
  return filePath;
}

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`${filePath} is missing`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
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

function expectSafeFlags(value, label) {
  if (!value || typeof value !== "object") return;
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
    if (value[field] !== undefined) expect(value[field], expected, `${label}.${field}`);
  }
}

function forbiddenPatterns() {
  return [
    /from\s+["']@supabase\/supabase-js["']/iu,
    /createClient\s*\(/iu,
    /process\.env/iu,
    /insert\s*\(/iu,
    /upsert\s*\(/iu,
    /update\s*\(/iu,
    /delete\s*\(/iu,
    /daily_prices\s+write/iu,
    /scoreSource\s*=\s*real/iu,
    /publicDataSource\s*=\s*supabase/iu,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu
  ];
}
