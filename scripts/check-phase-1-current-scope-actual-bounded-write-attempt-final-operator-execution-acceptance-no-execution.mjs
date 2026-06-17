import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-actual-bounded-write-attempt-final-operator-execution-acceptance-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT_FINAL_OPERATOR_EXECUTION_ACCEPTANCE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = readIfExists(runnerPath);
const doc = readIfExists(docPath);
const pkg = parseJson(readIfExists(packagePath), packagePath);
const reviewGate = readIfExists(reviewGatePath);
const projectStatus = readIfExists(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-final-operator-acceptance-"));

try {
  const acceptedAuthPath = writeJson("accepted-runtime-execution-authorization.json", makeAcceptedRuntimeAuthorization());
  const blockedAuthPath = writeJson("blocked-runtime-execution-authorization.json", {
    ...makeAcceptedRuntimeAuthorization(),
    status: "blocked"
  });
  const missingPacketPath = writeJson("missing-runtime-execution-authorization.json", {
    ...makeAcceptedRuntimeAuthorization(),
    actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket: null
  });
  const rowPayloadPath = writeJson("row-payload-runtime-execution-authorization.json", {
    ...makeAcceptedRuntimeAuthorization(),
    rowPayload: []
  });
  const secretPath = writeJson("secret-runtime-execution-authorization.json", {
    ...makeAcceptedRuntimeAuthorization(),
    token: "DO_NOT_LOG"
  });
  const commandValuesPath = writeJson("command-values-runtime-execution-authorization.json", {
    ...makeAcceptedRuntimeAuthorization(),
    actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket: {
      ...makeAcceptedRuntimeAuthorization().actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket,
      commandValuesIncludedNow: true
    }
  });
  const authorizedPath = writeJson("authorized-runtime-execution-authorization.json", {
    ...makeAcceptedRuntimeAuthorization(),
    actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket: {
      ...makeAcceptedRuntimeAuthorization().actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket,
      runtimeExecutionAuthorizedNow: true
    }
  });
  const realPromotionPath = writeJson("real-promotion-runtime-execution-authorization.json", {
    ...makeAcceptedRuntimeAuthorization(),
    publicDataSource: "supabase"
  });
  const executablePath = writeJson("executable-runtime-execution-authorization.json", {
    ...makeAcceptedRuntimeAuthorization(),
    runnerExecutableNow: true
  });
  const executedPath = writeJson("executed-runtime-execution-authorization.json", {
    ...makeAcceptedRuntimeAuthorization(),
    supabaseWriteAttempted: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--runtime-execution-authorization", acceptedAuthPath]));
  validateRejectedRun("blocked runtime execution authorization", runNode(["--runtime-execution-authorization", blockedAuthPath]));
  validateRejectedRun("missing runtime execution authorization packet", runNode(["--runtime-execution-authorization", missingPacketPath]));
  validateRejectedRun("row payload runtime execution authorization", runNode(["--runtime-execution-authorization", rowPayloadPath]));
  validateRejectedRun("secret runtime execution authorization", runNode(["--runtime-execution-authorization", secretPath]));
  validateRejectedRun("command values runtime execution authorization", runNode(["--runtime-execution-authorization", commandValuesPath]));
  validateRejectedRun("already authorized runtime execution authorization", runNode(["--runtime-execution-authorization", authorizedPath]));
  validateRejectedRun("real promotion runtime execution authorization", runNode(["--runtime-execution-authorization", realPromotionPath]));
  validateRejectedRun("executable runtime execution authorization", runNode(["--runtime-execution-authorization", executablePath]));
  validateRejectedRun("executed runtime execution authorization", runNode(["--runtime-execution-authorization", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution_ready"
      : "phase_1_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution_blocked",
    acceptedRuntimeExecutionAuthorizationReady: true,
    blockedAuthorizationRejected: true,
    missingPacketRejected: true,
    rowPayloadRejected: true,
    secretAuthorizationRejected: true,
    commandValuesRejected: true,
    alreadyAuthorizedRejected: true,
    realPromotionRejected: true,
    executableAuthorizationRejected: true,
    executedAuthorizationRejected: true,
    finalOperatorExecutionAcceptancePreparedNow: true,
    finalOperatorExecutionAcceptedNow: false,
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
      ? "await_separate_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution"
      : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedRuntimeAuthorization() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution_ready",
    runtimeExecutionAuthorizationPreparedNow: true,
    runtimeExecutionAuthorizedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    actualBoundedWriteAttemptRuntimeExecutionAuthorizationPacket: {
      packetMode: "current_scope_actual_bounded_write_attempt_runtime_execution_authorization_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      authorizationPreparedNow: true,
      runtimeExecutionAuthorizedNow: false,
      commandValuesIncludedNow: false,
      serverOnlyRuntimeInputsIncludedNow: false,
      candidateArtifactPathReferenceOnly: true,
      finalExecutionAllowedNow: false,
      actualWriteAttemptAllowedNow: false,
      requiredNextPacket: "current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution",
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
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "missingArgs.actualWriteAttemptAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted final operator execution acceptance should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.finalOperatorExecutionAcceptancePreparedNow, true, "accepted.finalOperatorExecutionAcceptancePreparedNow");
  expect(result.output.finalOperatorExecutionAcceptedNow, false, "accepted.finalOperatorExecutionAcceptedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "accepted.actualWriteAttemptAllowedNow");
  expect(result.output.nextRoute, "await_separate_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const packet = result.output.actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket;
  if (!packet || typeof packet !== "object") {
    problems.push("accepted.actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution", "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.packetMode");
  expect(packet.attemptId, "phase-1-current-scope-attempt-example", "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.attemptId");
  expect(packet.acceptancePreparedNow, true, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.acceptancePreparedNow");
  expect(packet.finalOperatorExecutionAcceptedNow, false, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.finalOperatorExecutionAcceptedNow");
  expect(packet.runtimeExecutionAuthorizedNow, false, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.runtimeExecutionAuthorizedNow");
  expect(packet.commandValuesIncludedNow, false, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.commandValuesIncludedNow");
  expect(packet.serverOnlyRuntimeInputsIncludedNow, false, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.serverOnlyRuntimeInputsIncludedNow");
  expect(packet.requiredNextPacket, "current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution", "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.requiredNextPacket");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket.actualWriteAttemptAllowedNow");
  expectSafeFlags(packet, "actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket");
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
      "phase_1_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution_ready",
      "current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution",
      "await_separate_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution"
    ]],
    [docPath, doc, [
      "phase_1_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution_ready",
      "finalOperatorExecutionAcceptancePreparedNow=true",
      "finalOperatorExecutionAcceptedNow=false",
      "finalExecutionAllowedNow=false",
      "actualWriteAttemptAllowedNow=false",
      "await_separate_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Actual Bounded Write Attempt Final Operator Execution Acceptance",
      "phase_1_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution_ready",
      "await_separate_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-actual-bounded-write-attempt-final-operator-execution-acceptance-once"] !==
    "node scripts/run-phase-1-current-scope-actual-bounded-write-attempt-final-operator-execution-acceptance-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-attempt-final-operator-execution-acceptance-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-attempt-final-operator-execution-acceptance-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-attempt-final-operator-execution-acceptance-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing final operator execution acceptance checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-attempt-final-operator-execution-acceptance-no-execution"')) {
    problems.push(`${reviewGatePath} missing final operator execution acceptance focused name`);
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
