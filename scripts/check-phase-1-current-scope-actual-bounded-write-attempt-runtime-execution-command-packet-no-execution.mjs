import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-command-packet-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT_RUNTIME_EXECUTION_COMMAND_PACKET_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = readIfExists(runnerPath);
const doc = readIfExists(docPath);
const pkg = parseJson(readIfExists(packagePath), packagePath);
const reviewGate = readIfExists(reviewGatePath);
const projectStatus = readIfExists(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-runtime-command-packet-"));

try {
  const acceptedHandoffPath = writeJson("accepted-execution-handoff-packet.json", makeAcceptedExecutionHandoffPacket());
  const blockedHandoffPath = writeJson("blocked-execution-handoff-packet.json", {
    ...makeAcceptedExecutionHandoffPacket(),
    status: "blocked"
  });
  const missingPacketPath = writeJson("missing-execution-handoff-packet.json", {
    ...makeAcceptedExecutionHandoffPacket(),
    actualBoundedWriteAttemptExecutionHandoffPacket: null
  });
  const rowPayloadPath = writeJson("row-payload-handoff.json", {
    ...makeAcceptedExecutionHandoffPacket(),
    rowPayload: []
  });
  const secretPath = writeJson("secret-handoff.json", {
    ...makeAcceptedExecutionHandoffPacket(),
    supabaseKey: "DO_NOT_LOG"
  });
  const realPromotionPath = writeJson("real-promotion-handoff.json", {
    ...makeAcceptedExecutionHandoffPacket(),
    publicDataSource: "supabase"
  });
  const executablePath = writeJson("executable-handoff.json", {
    ...makeAcceptedExecutionHandoffPacket(),
    runnerExecutableNow: true
  });
  const executedPath = writeJson("executed-handoff.json", {
    ...makeAcceptedExecutionHandoffPacket(),
    sqlExecuted: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--execution-handoff-packet", acceptedHandoffPath]));
  validateRejectedRun("blocked handoff", runNode(["--execution-handoff-packet", blockedHandoffPath]));
  validateRejectedRun("missing packet", runNode(["--execution-handoff-packet", missingPacketPath]));
  validateRejectedRun("row payload handoff", runNode(["--execution-handoff-packet", rowPayloadPath]));
  validateRejectedRun("secret handoff", runNode(["--execution-handoff-packet", secretPath]));
  validateRejectedRun("real promotion handoff", runNode(["--execution-handoff-packet", realPromotionPath]));
  validateRejectedRun("executable handoff", runNode(["--execution-handoff-packet", executablePath]));
  validateRejectedRun("executed handoff", runNode(["--execution-handoff-packet", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution_ready"
      : "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution_blocked",
    acceptedExecutionHandoffPacketReady: true,
    blockedHandoffRejected: true,
    missingPacketRejected: true,
    rowPayloadRejected: true,
    secretHandoffRejected: true,
    realPromotionRejected: true,
    executableHandoffRejected: true,
    executedHandoffRejected: true,
    runtimeExecutionCommandPacketPreparedNow: true,
    runtimeExecutionCommandPreparedNow: false,
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
      ? "await_separate_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution"
      : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedExecutionHandoffPacket() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution_ready",
    executionHandoffPacketPreparedNow: true,
    finalExecutionGoNoGoAcceptedNow: true,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    actualBoundedWriteAttemptExecutionHandoffPacket: {
      packetMode: "current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      acceptedFinalExecutionGoNoGoPresent: true,
      finalExecutionGoNoGoAcceptedNow: true,
      finalExecutionAllowedNow: false,
      actualWriteAttemptAllowedNow: false,
      runnerMustRemainFailClosed: true,
      requiredOperatorRuntimeValuesStillExternal: true,
      serverOnlyRuntimeInputsMustNotBeLogged: true,
      candidateArtifactPathReferenceOnly: true,
      postRunReviewRequired: true,
      requiredNextPacket: "current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution",
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

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "missingArgs.actualWriteAttemptAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted runtime execution command packet should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.runtimeExecutionCommandPacketPreparedNow, true, "accepted.runtimeExecutionCommandPacketPreparedNow");
  expect(result.output.runtimeExecutionCommandPreparedNow, false, "accepted.runtimeExecutionCommandPreparedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "accepted.actualWriteAttemptAllowedNow");
  expect(result.output.nextRoute, "await_separate_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const packet = result.output.actualBoundedWriteAttemptRuntimeExecutionCommandPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("accepted.actualBoundedWriteAttemptRuntimeExecutionCommandPacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution", "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.packetMode");
  expect(packet.attemptId, "phase-1-current-scope-attempt-example", "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.attemptId");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.phase1Universe");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.operationKind");
  expect(packet.commandValuesIncludedNow, false, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.commandValuesIncludedNow");
  expect(packet.serverOnlyRuntimeInputsIncludedNow, false, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.serverOnlyRuntimeInputsIncludedNow");
  expect(packet.candidateArtifactPathReferenceOnly, true, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.candidateArtifactPathReferenceOnly");
  expect(packet.requiredRuntimeCommandStillExternal, true, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.requiredRuntimeCommandStillExternal");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution", "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.requiredNextPacket");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket.actualWriteAttemptAllowedNow");
  expectSafeFlags(packet, "actualBoundedWriteAttemptRuntimeExecutionCommandPacket");
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
      "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution_ready",
      "current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution",
      "await_separate_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution"
    ]],
    [docPath, doc, [
      "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution_ready",
      "runtimeExecutionCommandPacketPreparedNow=true",
      "runtimeExecutionCommandPreparedNow=false",
      "finalExecutionAllowedNow=false",
      "actualWriteAttemptAllowedNow=false",
      "await_separate_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Actual Bounded Write Attempt Runtime Execution Command Packet",
      "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution_ready",
      "await_separate_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-command-packet-once"] !==
    "node scripts/run-phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-command-packet-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-command-packet-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-command-packet-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-command-packet-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing runtime execution command packet checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-command-packet-no-execution"')) {
    problems.push(`${reviewGatePath} missing runtime execution command packet focused name`);
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
