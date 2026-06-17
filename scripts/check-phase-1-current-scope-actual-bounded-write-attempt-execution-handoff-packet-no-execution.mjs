import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-actual-bounded-write-attempt-execution-handoff-packet-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT_EXECUTION_HANDOFF_PACKET_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = readIfExists(runnerPath);
const doc = readIfExists(docPath);
const pkg = parseJson(readIfExists(packagePath), packagePath);
const reviewGate = readIfExists(reviewGatePath);
const projectStatus = readIfExists(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-execution-handoff-packet-"));

try {
  const acceptedIntakePath = writeJson("accepted-final-execution-go-no-go-intake.json", makeAcceptedFinalExecutionGoNoGoIntake());
  const blockedIntakePath = writeJson("blocked-final-execution-go-no-go-intake.json", {
    ...makeAcceptedFinalExecutionGoNoGoIntake(),
    status: "blocked"
  });
  const missingPacketPath = writeJson("missing-execution-handoff-packet.json", {
    ...makeAcceptedFinalExecutionGoNoGoIntake(),
    actualBoundedWriteAttemptExecutionHandoffPacket: null
  });
  const rowPayloadPath = writeJson("row-payload-intake.json", {
    ...makeAcceptedFinalExecutionGoNoGoIntake(),
    rows: []
  });
  const secretPath = writeJson("secret-intake.json", {
    ...makeAcceptedFinalExecutionGoNoGoIntake(),
    serviceRoleKey: "DO_NOT_LOG"
  });
  const realPromotionPath = writeJson("real-promotion-intake.json", {
    ...makeAcceptedFinalExecutionGoNoGoIntake(),
    scoreSource: "real"
  });
  const executablePath = writeJson("executable-intake.json", {
    ...makeAcceptedFinalExecutionGoNoGoIntake(),
    runnerExecutableNow: true
  });
  const executedPath = writeJson("executed-intake.json", {
    ...makeAcceptedFinalExecutionGoNoGoIntake(),
    supabaseWriteAttempted: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--final-execution-go-no-go-intake", acceptedIntakePath]));
  validateRejectedRun("blocked intake", runNode(["--final-execution-go-no-go-intake", blockedIntakePath]));
  validateRejectedRun("missing packet", runNode(["--final-execution-go-no-go-intake", missingPacketPath]));
  validateRejectedRun("row payload intake", runNode(["--final-execution-go-no-go-intake", rowPayloadPath]));
  validateRejectedRun("secret intake", runNode(["--final-execution-go-no-go-intake", secretPath]));
  validateRejectedRun("real promotion intake", runNode(["--final-execution-go-no-go-intake", realPromotionPath]));
  validateRejectedRun("executable intake", runNode(["--final-execution-go-no-go-intake", executablePath]));
  validateRejectedRun("executed intake", runNode(["--final-execution-go-no-go-intake", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution_ready"
      : "phase_1_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution_blocked",
    acceptedFinalExecutionGoNoGoIntakeReady: true,
    blockedIntakeRejected: true,
    missingPacketRejected: true,
    rowPayloadRejected: true,
    secretIntakeRejected: true,
    realPromotionRejected: true,
    executableIntakeRejected: true,
    executedIntakeRejected: true,
    executionHandoffPacketPreparedNow: true,
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
      ? "await_separate_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution"
      : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_execution_handoff_packet",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedFinalExecutionGoNoGoIntake() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_final_execution_go_no_go_intake_no_execution_ready",
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
      requiredNextPacket: "current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution",
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
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_execution_handoff_packet_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "missingArgs.actualWriteAttemptAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted execution handoff packet should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.executionHandoffPacketPreparedNow, true, "accepted.executionHandoffPacketPreparedNow");
  expect(result.output.finalExecutionGoNoGoAcceptedNow, true, "accepted.finalExecutionGoNoGoAcceptedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "accepted.actualWriteAttemptAllowedNow");
  expect(result.output.nextRoute, "await_separate_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const packet = result.output.actualBoundedWriteAttemptExecutionHandoffPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("accepted.actualBoundedWriteAttemptExecutionHandoffPacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution", "actualBoundedWriteAttemptExecutionHandoffPacket.packetMode");
  expect(packet.attemptId, "phase-1-current-scope-attempt-example", "actualBoundedWriteAttemptExecutionHandoffPacket.attemptId");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution", "actualBoundedWriteAttemptExecutionHandoffPacket.requiredNextPacket");
  expect(packet.requiredOperatorRuntimeValuesStillExternal, true, "actualBoundedWriteAttemptExecutionHandoffPacket.requiredOperatorRuntimeValuesStillExternal");
  expect(packet.serverOnlyRuntimeInputsMustNotBeLogged, true, "actualBoundedWriteAttemptExecutionHandoffPacket.serverOnlyRuntimeInputsMustNotBeLogged");
  expect(packet.candidateArtifactPathReferenceOnly, true, "actualBoundedWriteAttemptExecutionHandoffPacket.candidateArtifactPathReferenceOnly");
  expect(packet.postRunReviewRequired, true, "actualBoundedWriteAttemptExecutionHandoffPacket.postRunReviewRequired");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptExecutionHandoffPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptExecutionHandoffPacket.actualWriteAttemptAllowedNow");
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
      "phase_1_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution_ready",
      "current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution",
      "await_separate_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution"
    ]],
    [docPath, doc, [
      "phase_1_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution_ready",
      "executionHandoffPacketPreparedNow=true",
      "finalExecutionAllowedNow=false",
      "actualWriteAttemptAllowedNow=false",
      "await_separate_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Actual Bounded Write Attempt Execution Handoff Packet",
      "phase_1_current_scope_actual_bounded_write_attempt_execution_handoff_packet_no_execution_ready",
      "await_separate_current_scope_actual_bounded_write_attempt_runtime_execution_command_packet_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-actual-bounded-write-attempt-execution-handoff-packet-once"] !==
    "node scripts/run-phase-1-current-scope-actual-bounded-write-attempt-execution-handoff-packet-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-attempt-execution-handoff-packet-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-attempt-execution-handoff-packet-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-attempt-execution-handoff-packet-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing execution handoff packet checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-attempt-execution-handoff-packet-no-execution"')) {
    problems.push(`${reviewGatePath} missing execution handoff packet focused name`);
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
