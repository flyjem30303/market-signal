import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-actual-bounded-write-attempt-final-go-packet-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT_FINAL_GO_PACKET_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-actual-final-go-packet-"));

try {
  const acceptedIntakePath = writeJson("accepted-actual-authorization-response-intake.json", makeAcceptedIntake());
  const blockedIntakePath = writeJson("blocked-actual-authorization-response-intake.json", {
    ...makeAcceptedIntake(),
    status: "blocked"
  });
  const missingPacketPath = writeJson("missing-final-go-packet.json", {
    ...makeAcceptedIntake(),
    actualBoundedWriteAttemptFinalGoPacket: null
  });
  const rowPayloadPath = writeJson("row-payload-intake.json", {
    ...makeAcceptedIntake(),
    rowPayload: []
  });
  const secretPath = writeJson("secret-intake.json", {
    ...makeAcceptedIntake(),
    secret: "DO_NOT_LOG"
  });
  const realPromotionPath = writeJson("real-promotion-intake.json", {
    ...makeAcceptedIntake(),
    scoreSource: "real"
  });
  const etfPath = writeJson("deferred-etf-intake.json", {
    ...makeAcceptedIntake(),
    note: "0050 remains deferred"
  });
  const executablePath = writeJson("executable-intake.json", {
    ...makeAcceptedIntake(),
    boundedWriteExecutableNow: true
  });
  const executedPath = writeJson("executed-intake.json", {
    ...makeAcceptedIntake(),
    sqlExecuted: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--authorization-response-intake", acceptedIntakePath]));
  validateRejectedRun("blocked intake", runNode(["--authorization-response-intake", blockedIntakePath]));
  validateRejectedRun("missing final go packet", runNode(["--authorization-response-intake", missingPacketPath]));
  validateRejectedRun("row payload intake", runNode(["--authorization-response-intake", rowPayloadPath]));
  validateRejectedRun("secret intake", runNode(["--authorization-response-intake", secretPath]));
  validateRejectedRun("real promotion intake", runNode(["--authorization-response-intake", realPromotionPath]));
  validateRejectedRun("deferred ETF intake", runNode(["--authorization-response-intake", etfPath]));
  validateRejectedRun("executable intake", runNode(["--authorization-response-intake", executablePath]));
  validateRejectedRun("executed intake", runNode(["--authorization-response-intake", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_actual_bounded_write_attempt_final_go_packet_no_execution_ready"
      : "phase_1_current_scope_actual_bounded_write_attempt_final_go_packet_no_execution_blocked",
    acceptedActualAuthorizationResponseIntakeReady: true,
    blockedIntakeRejected: true,
    missingPacketRejected: true,
    rowPayloadRejected: true,
    secretIntakeRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableIntakeRejected: true,
    executedIntakeRejected: true,
    finalGoPacketPreparedNow: true,
    finalOperatorGoNoGoAcceptedNow: false,
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
      ? "await_separate_current_scope_actual_bounded_write_attempt_final_go_response_no_execution"
      : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_final_go_packet",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedIntake() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_authorization_response_intake_no_execution_ready",
    actualWriteAttemptAuthorizationAcceptedNow: true,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    actualBoundedWriteAttemptFinalGoPacket: {
      packetMode: "current_scope_actual_bounded_write_attempt_final_go_packet_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      acceptedActualAuthorizationResponsePresent: true,
      actualWriteAttemptAuthorizationAcceptedNow: true,
      actualWriteAttemptAllowedNow: false,
      finalExecutionAllowedNow: false,
      runnerMustRemainFailClosed: true,
      requiredNextPacket: "current_scope_actual_bounded_write_attempt_final_go_packet_no_execution",
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
    nextRoute: "prepare_current_scope_actual_bounded_write_attempt_final_go_packet_no_execution",
    problems: []
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_final_go_packet_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "missingArgs.actualWriteAttemptAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted final go packet should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_final_go_packet_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.finalGoPacketPreparedNow, true, "accepted.finalGoPacketPreparedNow");
  expect(result.output.finalOperatorGoNoGoAcceptedNow, false, "accepted.finalOperatorGoNoGoAcceptedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "accepted.actualWriteAttemptAllowedNow");
  expect(result.output.nextRoute, "await_separate_current_scope_actual_bounded_write_attempt_final_go_response_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const packet = result.output.actualBoundedWriteAttemptFinalGoPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("accepted.actualBoundedWriteAttemptFinalGoPacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_final_go_packet_no_execution", "actualBoundedWriteAttemptFinalGoPacket.packetMode");
  expect(packet.attemptId, "phase-1-current-scope-attempt-example", "actualBoundedWriteAttemptFinalGoPacket.attemptId");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalGoPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptFinalGoPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptFinalGoPacket.operationKind");
  expect(packet.requiredFinalGoDecision, "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT", "actualBoundedWriteAttemptFinalGoPacket.requiredFinalGoDecision");
  expect(packet.finalOperatorGoNoGoAcceptedNow, false, "actualBoundedWriteAttemptFinalGoPacket.finalOperatorGoNoGoAcceptedNow");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptFinalGoPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptFinalGoPacket.actualWriteAttemptAllowedNow");
  expect(packet.runnerMustRemainFailClosed, true, "actualBoundedWriteAttemptFinalGoPacket.runnerMustRemainFailClosed");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_final_go_response_no_execution", "actualBoundedWriteAttemptFinalGoPacket.requiredNextPacket");
  if (!Array.isArray(packet.finalGoStoplines) || packet.finalGoStoplines.length < 6) {
    problems.push("actualBoundedWriteAttemptFinalGoPacket.finalGoStoplines must contain at least 6 items");
  }
  expectSafeFlags(packet, "actualBoundedWriteAttemptFinalGoPacket");
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
      "phase_1_current_scope_actual_bounded_write_attempt_final_go_packet_no_execution_ready",
      "FINAL_GO_ONE_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT",
      "finalOperatorGoNoGoAcceptedNow=false",
      "finalExecutionAllowedNow=false",
      "actualWriteAttemptAllowedNow=false",
      "await_separate_current_scope_actual_bounded_write_attempt_final_go_response_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Actual Bounded Write Attempt Final Go Packet",
      "phase_1_current_scope_actual_bounded_write_attempt_final_go_packet_no_execution_ready",
      "await_separate_current_scope_actual_bounded_write_attempt_final_go_response_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-actual-bounded-write-attempt-final-go-packet-once"] !==
    "node scripts/run-phase-1-current-scope-actual-bounded-write-attempt-final-go-packet-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-attempt-final-go-packet-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-attempt-final-go-packet-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-attempt-final-go-packet-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing actual bounded write attempt final go packet checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-attempt-final-go-packet-no-execution"')) {
    problems.push(`${reviewGatePath} missing actual bounded write attempt final go packet focused name`);
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
