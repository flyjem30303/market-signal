import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-authorization-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT_RUNTIME_EXECUTION_AUTHORIZATION_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = readIfExists(runnerPath);
const doc = readIfExists(docPath);
const pkg = parseJson(readIfExists(packagePath), packagePath);
const reviewGate = readIfExists(reviewGatePath);
const projectStatus = readIfExists(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-runtime-execution-auth-"));

try {
  const acceptedPacketPath = writeJson("accepted-runtime-command-packet.json", makeAcceptedRuntimeCommandPacket());
  const blockedPacketPath = writeJson("blocked-runtime-command-packet.json", {
    ...makeAcceptedRuntimeCommandPacket(),
    status: "blocked"
  });
  const missingPacketPath = writeJson("missing-runtime-command-packet.json", {
    ...makeAcceptedRuntimeCommandPacket(),
    actualBoundedWriteAttemptRuntimeExecutionCommandPacket: null
  });
  const rowPayloadPath = writeJson("row-payload-runtime-command-packet.json", {
    ...makeAcceptedRuntimeCommandPacket(),
    rows: []
  });
  const secretPath = writeJson("secret-runtime-command-packet.json", {
    ...makeAcceptedRuntimeCommandPacket(),
    serviceRoleKey: "DO_NOT_LOG"
  });
  const commandValuesPath = writeJson("command-values-runtime-command-packet.json", {
    ...makeAcceptedRuntimeCommandPacket(),
    actualBoundedWriteAttemptRuntimeExecutionCommandPacket: {
      ...makeAcceptedRuntimeCommandPacket().actualBoundedWriteAttemptRuntimeExecutionCommandPacket,
      commandValuesIncludedNow: true
    }
  });
  const realPromotionPath = writeJson("real-promotion-runtime-command-packet.json", {
    ...makeAcceptedRuntimeCommandPacket(),
    scoreSource: "real"
  });
  const executablePath = writeJson("executable-runtime-command-packet.json", {
    ...makeAcceptedRuntimeCommandPacket(),
    boundedWriteExecutableNow: true
  });
  const executedPath = writeJson("executed-runtime-command-packet.json", {
    ...makeAcceptedRuntimeCommandPacket(),
    dailyPricesMutated: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--runtime-execution-command-packet", acceptedPacketPath]));
  validateRejectedRun("blocked runtime command packet", runNode(["--runtime-execution-command-packet", blockedPacketPath]));
  validateRejectedRun("missing runtime command packet", runNode(["--runtime-execution-command-packet", missingPacketPath]));
  validateRejectedRun("row payload runtime command packet", runNode(["--runtime-execution-command-packet", rowPayloadPath]));
  validateRejectedRun("secret runtime command packet", runNode(["--runtime-execution-command-packet", secretPath]));
  validateRejectedRun("command values runtime command packet", runNode(["--runtime-execution-command-packet", commandValuesPath]));
  validateRejectedRun("real promotion runtime command packet", runNode(["--runtime-execution-command-packet", realPromotionPath]));
  validateRejectedRun("executable runtime command packet", runNode(["--runtime-execution-command-packet", executablePath]));
  validateRejectedRun("executed runtime command packet", runNode(["--runtime-execution-command-packet", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution_ready"
      : "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution_blocked",
    acceptedRuntimeCommandPacketReady: true,
    blockedPacketRejected: true,
    missingPacketRejected: true,
    rowPayloadRejected: true,
    secretPacketRejected: true,
    commandValuesRejected: true,
    realPromotionRejected: true,
    executablePacketRejected: true,
    executedPacketRejected: true,
    runtimeExecutionAuthorizationPreparedNow: true,
    runtimeExecutionAuthorizedNow: false,
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
      ? "await_separate_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution"
      : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_runtime_execution_authorization",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedRuntimeCommandPacket() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution_ready",
    runtimeExecutionCommandPacketPreparedNow: true,
    runtimeExecutionCommandPreparedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    actualBoundedWriteAttemptRuntimeExecutionCommandPacket: {
      packetMode: "current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      commandValuesIncludedNow: false,
      serverOnlyRuntimeInputsIncludedNow: false,
      candidateArtifactPathReferenceOnly: true,
      requiredRuntimeCommandStillExternal: true,
      requiredNextPacket: "current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution",
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
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "missingArgs.actualWriteAttemptAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted runtime execution authorization should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.runtimeExecutionAuthorizationPreparedNow, true, "accepted.runtimeExecutionAuthorizationPreparedNow");
  expect(result.output.runtimeExecutionAuthorizedNow, false, "accepted.runtimeExecutionAuthorizedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "accepted.actualWriteAttemptAllowedNow");
  expect(result.output.nextRoute, "await_separate_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const packet = result.output.actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("accepted.actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution", "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.packetMode");
  expect(packet.attemptId, "phase-1-current-scope-attempt-example", "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.attemptId");
  expect(packet.authorizationPreparedNow, true, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.authorizationPreparedNow");
  expect(packet.runtimeExecutionAuthorizedNow, false, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.runtimeExecutionAuthorizedNow");
  expect(packet.commandValuesIncludedNow, false, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.commandValuesIncludedNow");
  expect(packet.serverOnlyRuntimeInputsIncludedNow, false, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.serverOnlyRuntimeInputsIncludedNow");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution", "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.requiredNextPacket");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket.actualWriteAttemptAllowedNow");
  expectSafeFlags(packet, "actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket");
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
      "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution_ready",
      "current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution",
      "await_separate_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution"
    ]],
    [docPath, doc, [
      "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution_ready",
      "runtimeExecutionAuthorizationPreparedNow=true",
      "runtimeExecutionAuthorizedNow=false",
      "finalExecutionAllowedNow=false",
      "actualWriteAttemptAllowedNow=false",
      "await_separate_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Actual Bounded Write Attempt Runtime Execution Authorization",
      "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution_ready",
      "await_separate_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-authorization-once"] !==
    "node scripts/run-phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-authorization-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-authorization-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-authorization-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-authorization-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing runtime execution authorization checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-attempt-runtime-execution-authorization-no-execution"')) {
    problems.push(`${reviewGatePath} missing runtime execution authorization focused name`);
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
