import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-actual-bounded-write-attempt-execution-packet-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT_EXECUTION_PACKET_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-actual-execution-packet-"));

try {
  const acceptedIntakePath = writeJson("accepted-final-go-response-intake.json", makeAcceptedFinalGoResponseIntake());
  const blockedIntakePath = writeJson("blocked-final-go-response-intake.json", {
    ...makeAcceptedFinalGoResponseIntake(),
    status: "blocked"
  });
  const missingIntakePath = writeJson("missing-intake-object.json", {
    ...makeAcceptedFinalGoResponseIntake(),
    actualBoundedWriteAttemptFinalGoResponseIntake: null
  });
  const rowPayloadPath = writeJson("row-payload-intake.json", {
    ...makeAcceptedFinalGoResponseIntake(),
    rowPayload: []
  });
  const secretPath = writeJson("secret-intake.json", {
    ...makeAcceptedFinalGoResponseIntake(),
    secret: "DO_NOT_LOG"
  });
  const realPromotionPath = writeJson("real-promotion-intake.json", {
    ...makeAcceptedFinalGoResponseIntake(),
    scoreSource: "real"
  });
  const etfPath = writeJson("deferred-etf-intake.json", {
    ...makeAcceptedFinalGoResponseIntake(),
    note: "0050 remains deferred"
  });
  const executablePath = writeJson("executable-intake.json", {
    ...makeAcceptedFinalGoResponseIntake(),
    runnerExecutableNow: true
  });
  const executedPath = writeJson("executed-intake.json", {
    ...makeAcceptedFinalGoResponseIntake(),
    sqlExecuted: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--final-go-response-intake", acceptedIntakePath]));
  validateRejectedRun("blocked intake", runNode(["--final-go-response-intake", blockedIntakePath]));
  validateRejectedRun("missing intake object", runNode(["--final-go-response-intake", missingIntakePath]));
  validateRejectedRun("row payload intake", runNode(["--final-go-response-intake", rowPayloadPath]));
  validateRejectedRun("secret intake", runNode(["--final-go-response-intake", secretPath]));
  validateRejectedRun("real promotion intake", runNode(["--final-go-response-intake", realPromotionPath]));
  validateRejectedRun("deferred ETF intake", runNode(["--final-go-response-intake", etfPath]));
  validateRejectedRun("executable intake", runNode(["--final-go-response-intake", executablePath]));
  validateRejectedRun("executed intake", runNode(["--final-go-response-intake", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_actual_bounded_write_attempt_execution_packet_no_execution_ready"
      : "phase_1_current_scope_actual_bounded_write_attempt_execution_packet_no_execution_blocked",
    acceptedFinalGoResponseIntakeReady: true,
    blockedIntakeRejected: true,
    missingIntakeRejected: true,
    rowPayloadRejected: true,
    secretIntakeRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableIntakeRejected: true,
    executedIntakeRejected: true,
    actualExecutionPacketPreparedNow: true,
    finalGoResponseAcceptedNow: true,
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
      ? "await_separate_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution"
      : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_execution_packet",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedFinalGoResponseIntake() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_final_go_response_intake_no_execution_ready",
    finalGoResponseAcceptedNow: true,
    finalOperatorGoNoGoAcceptedNow: true,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    actualBoundedWriteAttemptFinalGoResponseIntake: {
      responseMode: "current_scope_actual_bounded_write_attempt_final_go_response_no_execution",
      acceptedFinalGoDecision: "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      finalGoResponseAcceptedNow: true,
      finalOperatorGoNoGoAcceptedNow: true,
      finalExecutionAllowedNow: false,
      actualWriteAttemptAllowedNow: false,
      actualWriteAttemptStillRequiresSeparateExecutionPacket: true,
      requiredNextPacket: "current_scope_actual_bounded_write_attempt_execution_packet_no_execution",
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
    nextRoute: "prepare_current_scope_actual_bounded_write_attempt_execution_packet_no_execution",
    problems: []
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_execution_packet_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.actualExecutionPacketPreparedNow, false, "missingArgs.actualExecutionPacketPreparedNow");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "missingArgs.actualWriteAttemptAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted actual execution packet should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_execution_packet_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.actualExecutionPacketPreparedNow, true, "accepted.actualExecutionPacketPreparedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "accepted.actualWriteAttemptAllowedNow");
  expect(result.output.nextRoute, "await_separate_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const packet = result.output.actualBoundedWriteAttemptExecutionPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("accepted.actualBoundedWriteAttemptExecutionPacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_execution_packet_no_execution", "actualBoundedWriteAttemptExecutionPacket.packetMode");
  expect(packet.attemptId, "phase-1-current-scope-attempt-example", "actualBoundedWriteAttemptExecutionPacket.attemptId");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptExecutionPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptExecutionPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptExecutionPacket.operationKind");
  expect(packet.acceptedFinalGoDecision, "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT", "actualBoundedWriteAttemptExecutionPacket.acceptedFinalGoDecision");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptExecutionPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptExecutionPacket.actualWriteAttemptAllowedNow");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_execution_authorization_no_execution", "actualBoundedWriteAttemptExecutionPacket.requiredNextPacket");
  if (!Array.isArray(packet.requiredStopConditions) || packet.requiredStopConditions.length < 6) {
    problems.push("actualBoundedWriteAttemptExecutionPacket.requiredStopConditions must contain at least 6 items");
  }
  expectSafeFlags(packet, "actualBoundedWriteAttemptExecutionPacket");
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
      "phase_1_current_scope_actual_bounded_write_attempt_execution_packet_no_execution_ready",
      "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
      "actualExecutionPacketPreparedNow=true",
      "finalExecutionAllowedNow=false",
      "actualWriteAttemptAllowedNow=false",
      "await_separate_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Actual Bounded Write Attempt Execution Packet",
      "phase_1_current_scope_actual_bounded_write_attempt_execution_packet_no_execution_ready",
      "await_separate_current_scope_actual_bounded_write_attempt_execution_authorization_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-actual-bounded-write-attempt-execution-packet-once"] !==
    "node scripts/run-phase-1-current-scope-actual-bounded-write-attempt-execution-packet-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-attempt-execution-packet-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-attempt-execution-packet-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-attempt-execution-packet-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing actual bounded write attempt execution packet checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-attempt-execution-packet-no-execution"')) {
    problems.push(`${reviewGatePath} missing actual bounded write attempt execution packet focused name`);
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
