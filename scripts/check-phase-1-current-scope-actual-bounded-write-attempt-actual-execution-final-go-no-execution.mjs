import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-actual-bounded-write-attempt-actual-execution-final-go-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_ACTUAL_BOUNDED_WRITE_ATTEMPT_ACTUAL_EXECUTION_FINAL_GO_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = readIfExists(runnerPath);
const doc = readIfExists(docPath);
const pkg = parseJson(readIfExists(packagePath), packagePath);
const reviewGate = readIfExists(reviewGatePath);
const projectStatus = readIfExists(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-actual-execution-final-go-"));

try {
  const acceptedAcceptancePath = writeJson("accepted-final-operator-execution-acceptance.json", makeAcceptedFinalOperatorExecutionAcceptance());
  const blockedAcceptancePath = writeJson("blocked-final-operator-execution-acceptance.json", {
    ...makeAcceptedFinalOperatorExecutionAcceptance(),
    status: "blocked"
  });
  const missingPacketPath = writeJson("missing-final-operator-execution-acceptance.json", {
    ...makeAcceptedFinalOperatorExecutionAcceptance(),
    actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket: null
  });
  const rowPayloadPath = writeJson("row-payload-final-operator-execution-acceptance.json", {
    ...makeAcceptedFinalOperatorExecutionAcceptance(),
    rowPayload: []
  });
  const secretPath = writeJson("secret-final-operator-execution-acceptance.json", {
    ...makeAcceptedFinalOperatorExecutionAcceptance(),
    token: "DO_NOT_LOG"
  });
  const commandValuesPath = writeJson("command-values-final-operator-execution-acceptance.json", {
    ...makeAcceptedFinalOperatorExecutionAcceptance(),
    actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket: {
      ...makeAcceptedFinalOperatorExecutionAcceptance().actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket,
      commandValuesIncludedNow: true
    }
  });
  const alreadyAcceptedPath = writeJson("already-accepted-final-operator-execution-acceptance.json", {
    ...makeAcceptedFinalOperatorExecutionAcceptance(),
    actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket: {
      ...makeAcceptedFinalOperatorExecutionAcceptance().actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket,
      finalOperatorExecutionAcceptedNow: true
    }
  });
  const realPromotionPath = writeJson("real-promotion-final-operator-execution-acceptance.json", {
    ...makeAcceptedFinalOperatorExecutionAcceptance(),
    publicDataSource: "supabase"
  });
  const executablePath = writeJson("executable-final-operator-execution-acceptance.json", {
    ...makeAcceptedFinalOperatorExecutionAcceptance(),
    runnerExecutableNow: true
  });
  const executedPath = writeJson("executed-final-operator-execution-acceptance.json", {
    ...makeAcceptedFinalOperatorExecutionAcceptance(),
    supabaseWriteAttempted: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--final-operator-execution-acceptance", acceptedAcceptancePath]));
  validateRejectedRun("blocked final operator execution acceptance", runNode(["--final-operator-execution-acceptance", blockedAcceptancePath]));
  validateRejectedRun("missing final operator execution acceptance packet", runNode(["--final-operator-execution-acceptance", missingPacketPath]));
  validateRejectedRun("row payload final operator execution acceptance", runNode(["--final-operator-execution-acceptance", rowPayloadPath]));
  validateRejectedRun("secret final operator execution acceptance", runNode(["--final-operator-execution-acceptance", secretPath]));
  validateRejectedRun("command values final operator execution acceptance", runNode(["--final-operator-execution-acceptance", commandValuesPath]));
  validateRejectedRun("already accepted final operator execution acceptance", runNode(["--final-operator-execution-acceptance", alreadyAcceptedPath]));
  validateRejectedRun("real promotion final operator execution acceptance", runNode(["--final-operator-execution-acceptance", realPromotionPath]));
  validateRejectedRun("executable final operator execution acceptance", runNode(["--final-operator-execution-acceptance", executablePath]));
  validateRejectedRun("executed final operator execution acceptance", runNode(["--final-operator-execution-acceptance", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution_ready"
      : "phase_1_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution_blocked",
    acceptedFinalOperatorExecutionAcceptanceReady: true,
    blockedAcceptanceRejected: true,
    missingPacketRejected: true,
    rowPayloadRejected: true,
    secretAcceptanceRejected: true,
    commandValuesRejected: true,
    alreadyAcceptedRejected: true,
    realPromotionRejected: true,
    executableAcceptanceRejected: true,
    executedAcceptanceRejected: true,
    actualExecutionFinalGoPreparedNow: true,
    actualExecutionFinalGoAcceptedNow: false,
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
      ? "await_explicit_external_current_scope_actual_bounded_write_execution_outside_no_execution_gates"
      : "keep_mock_and_repair_current_scope_actual_bounded_write_attempt_actual_execution_final_go",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedFinalOperatorExecutionAcceptance() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution_ready",
    finalOperatorExecutionAcceptancePreparedNow: true,
    finalOperatorExecutionAcceptedNow: false,
    finalExecutionAllowedNow: false,
    actualWriteAttemptAllowedNow: false,
    actualBoundedWriteAttemptFinalOperatorExecutionAcceptancePacket: {
      packetMode: "current_scope_actual_bounded_write_attempt_final_operator_execution_acceptance_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      acceptancePreparedNow: true,
      finalOperatorExecutionAcceptedNow: false,
      runtimeExecutionAuthorizedNow: false,
      commandValuesIncludedNow: false,
      serverOnlyRuntimeInputsIncludedNow: false,
      candidateArtifactPathReferenceOnly: true,
      finalExecutionAllowedNow: false,
      actualWriteAttemptAllowedNow: false,
      requiredNextPacket: "current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution",
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
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_actual_execution_final_go_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "missingArgs.actualWriteAttemptAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted actual execution final go should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.actualExecutionFinalGoPreparedNow, true, "accepted.actualExecutionFinalGoPreparedNow");
  expect(result.output.actualExecutionFinalGoAcceptedNow, false, "accepted.actualExecutionFinalGoAcceptedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.actualWriteAttemptAllowedNow, false, "accepted.actualWriteAttemptAllowedNow");
  expect(result.output.nextRoute, "await_explicit_external_current_scope_actual_bounded_write_execution_outside_no_execution_gates", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const packet = result.output.actualBoundedWriteAttemptActualExecutionFinalGoPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("accepted.actualBoundedWriteAttemptActualExecutionFinalGoPacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution", "actualBoundedWriteAttemptActualExecutionFinalGoPacket.packetMode");
  expect(packet.attemptId, "phase-1-current-scope-attempt-example", "actualBoundedWriteAttemptActualExecutionFinalGoPacket.attemptId");
  expect(packet.actualExecutionFinalGoPreparedNow, true, "actualBoundedWriteAttemptActualExecutionFinalGoPacket.actualExecutionFinalGoPreparedNow");
  expect(packet.actualExecutionFinalGoAcceptedNow, false, "actualBoundedWriteAttemptActualExecutionFinalGoPacket.actualExecutionFinalGoAcceptedNow");
  expect(packet.finalOperatorExecutionAcceptancePresent, true, "actualBoundedWriteAttemptActualExecutionFinalGoPacket.finalOperatorExecutionAcceptancePresent");
  expect(packet.commandValuesIncludedNow, false, "actualBoundedWriteAttemptActualExecutionFinalGoPacket.commandValuesIncludedNow");
  expect(packet.serverOnlyRuntimeInputsIncludedNow, false, "actualBoundedWriteAttemptActualExecutionFinalGoPacket.serverOnlyRuntimeInputsIncludedNow");
  expect(packet.requiredNextRoute, "await_explicit_external_current_scope_actual_bounded_write_execution_outside_no_execution_gates", "actualBoundedWriteAttemptActualExecutionFinalGoPacket.requiredNextRoute");
  expect(packet.finalExecutionAllowedNow, false, "actualBoundedWriteAttemptActualExecutionFinalGoPacket.finalExecutionAllowedNow");
  expect(packet.actualWriteAttemptAllowedNow, false, "actualBoundedWriteAttemptActualExecutionFinalGoPacket.actualWriteAttemptAllowedNow");
  expectSafeFlags(packet, "actualBoundedWriteAttemptActualExecutionFinalGoPacket");
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
      "phase_1_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution_ready",
      "current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution",
      "await_explicit_external_current_scope_actual_bounded_write_execution_outside_no_execution_gates"
    ]],
    [docPath, doc, [
      "phase_1_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution_ready",
      "actualExecutionFinalGoPreparedNow=true",
      "actualExecutionFinalGoAcceptedNow=false",
      "finalExecutionAllowedNow=false",
      "actualWriteAttemptAllowedNow=false",
      "await_explicit_external_current_scope_actual_bounded_write_execution_outside_no_execution_gates",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Actual Bounded Write Attempt Actual Execution Final Go",
      "phase_1_current_scope_actual_bounded_write_attempt_actual_execution_final_go_no_execution_ready",
      "await_explicit_external_current_scope_actual_bounded_write_execution_outside_no_execution_gates"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-actual-bounded-write-attempt-actual-execution-final-go-once"] !==
    "node scripts/run-phase-1-current-scope-actual-bounded-write-attempt-actual-execution-final-go-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-actual-bounded-write-attempt-actual-execution-final-go-no-execution"] !==
    "node scripts/check-phase-1-current-scope-actual-bounded-write-attempt-actual-execution-final-go-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-actual-bounded-write-attempt-actual-execution-final-go-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing actual execution final go checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-actual-bounded-write-attempt-actual-execution-final-go-no-execution"')) {
    problems.push(`${reviewGatePath} missing actual execution final go focused name`);
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
