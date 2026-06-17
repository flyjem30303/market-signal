import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-final-operator-go-no-go-intake-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_FINAL_OPERATOR_GO_NO_GO_INTAKE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-final-go-no-go-intake-"));

try {
  const finalPacketPath = writeJson("accepted-final-execution-packet.json", makeAcceptedFinalExecutionPacket());
  const blockedPacketPath = writeJson("blocked-final-execution-packet.json", { ...makeAcceptedFinalExecutionPacket(), status: "blocked" });
  const acceptedDecisionPath = writeJson("accepted-operator-decision.json", makeAcceptedOperatorDecision());
  const noGoPath = writeJson("no-go-operator-decision.json", { ...makeAcceptedOperatorDecision(), finalDecision: "NO_GO_REPAIR_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT" });
  const mismatchPath = writeJson("mismatched-attempt-decision.json", { ...makeAcceptedOperatorDecision(), attemptId: "other-attempt" });
  const missingConfirmationPath = writeJson("missing-confirmation-decision.json", { ...makeAcceptedOperatorDecision(), postRunReviewConfirmed: false });
  const rowPayloadPath = writeJson("row-payload-decision.json", { ...makeAcceptedOperatorDecision(), rowPayload: [] });
  const secretPath = writeJson("secret-decision.json", { ...makeAcceptedOperatorDecision(), secret: "DO_NOT_LOG" });
  const realPromotionPath = writeJson("real-promotion-decision.json", { ...makeAcceptedOperatorDecision(), scoreSource: "real" });
  const etfPath = writeJson("deferred-etf-decision.json", { ...makeAcceptedOperatorDecision(), note: "0050 remains deferred" });
  const executablePath = writeJson("executable-decision.json", { ...makeAcceptedOperatorDecision(), boundedWriteExecutableNow: true });
  const executedPath = writeJson("executed-decision.json", { ...makeAcceptedOperatorDecision(), sqlExecuted: true });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--final-execution-packet", finalPacketPath, "--operator-decision", acceptedDecisionPath]));
  validateRejectedRun("blocked packet", runNode(["--final-execution-packet", blockedPacketPath, "--operator-decision", acceptedDecisionPath]));
  validateRejectedRun("no-go decision", runNode(["--final-execution-packet", finalPacketPath, "--operator-decision", noGoPath]));
  validateRejectedRun("mismatched attempt", runNode(["--final-execution-packet", finalPacketPath, "--operator-decision", mismatchPath]));
  validateRejectedRun("missing confirmation", runNode(["--final-execution-packet", finalPacketPath, "--operator-decision", missingConfirmationPath]));
  validateRejectedRun("row payload decision", runNode(["--final-execution-packet", finalPacketPath, "--operator-decision", rowPayloadPath]));
  validateRejectedRun("secret decision", runNode(["--final-execution-packet", finalPacketPath, "--operator-decision", secretPath]));
  validateRejectedRun("real promotion decision", runNode(["--final-execution-packet", finalPacketPath, "--operator-decision", realPromotionPath]));
  validateRejectedRun("deferred ETF decision", runNode(["--final-execution-packet", finalPacketPath, "--operator-decision", etfPath]));
  validateRejectedRun("executable decision", runNode(["--final-execution-packet", finalPacketPath, "--operator-decision", executablePath]));
  validateRejectedRun("executed decision", runNode(["--final-execution-packet", finalPacketPath, "--operator-decision", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_final_operator_go_no_go_intake_no_execution_ready"
      : "phase_1_current_scope_final_operator_go_no_go_intake_no_execution_blocked",
    acceptedFinalPacketReady: true,
    acceptedOperatorDecisionReady: true,
    noGoRejected: true,
    mismatchedAttemptRejected: true,
    missingConfirmationRejected: true,
    rowPayloadRejected: true,
    secretDecisionRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableDecisionRejected: true,
    executedDecisionRejected: true,
    finalOperatorGoNoGoAcceptedNow: true,
    finalExecutionAllowedNow: false,
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
      ? "prepare_current_scope_single_bounded_write_attempt_execution_gate_no_execution"
      : "keep_mock_and_repair_current_scope_final_operator_go_no_go_intake",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedFinalExecutionPacket() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_bounded_write_final_execution_packet_no_execution_ready",
    boundedWriteFinalExecutionPacketPreparedNow: true,
    finalExecutionAllowedNow: false,
    boundedWriteFinalExecutionPacket: {
      packetMode: "current_scope_bounded_write_final_execution_packet_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      requiredFinalDecision: "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT",
      finalGoNoGoAcceptedNow: false,
      candidateArtifactPathReadinessRequired: true,
      aggregateOnlyEvidenceRequired: true,
      noPayloadBoundaryRequired: true,
      insertMissingOnlyContractRequired: true,
      aggregateReadbackContractRequired: true,
      rollbackOrQuarantinePlanRequired: true,
      postRunReviewRequired: true,
      publicRuntimeMustStayMock: true,
      scoreSourceMustStayMock: true,
      explicitExecutionStoplines: [
        "missing_final_operator_go_no_go",
        "candidate_artifact_path_not_ready",
        "row_raw_or_stock_id_payload_present",
        "secret_or_confirmation_value_present",
        "real_promotion_requested",
        "sql_or_write_already_attempted"
      ],
      requiredNextPacket: "current_scope_final_operator_go_no_go_no_execution",
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
    nextRoute: "await_separate_current_scope_final_operator_go_no_go_no_execution",
    problems: []
  };
}

function makeAcceptedOperatorDecision() {
  return {
    decisionMode: "current_scope_final_operator_go_no_go_no_execution",
    finalDecision: "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT",
    attemptId: "phase-1-current-scope-attempt-example",
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
    finalPacketReviewedConfirmed: true,
    candidateArtifactPathReadinessConfirmed: true,
    aggregateOnlyEvidenceConfirmed: true,
    noPayloadBoundaryConfirmed: true,
    insertMissingOnlyContractConfirmed: true,
    aggregateReadbackContractConfirmed: true,
    rollbackOrQuarantinePlanConfirmed: true,
    postRunReviewConfirmed: true,
    publicRuntimeStaysMockConfirmed: true,
    scoreSourceStaysMockConfirmed: true,
    understandsThisDoesNotExecuteNow: true,
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
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_final_operator_go_no_go_intake_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.finalOperatorGoNoGoAcceptedNow, false, "missingArgs.finalOperatorGoNoGoAcceptedNow");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted final operator go/no-go intake should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_final_operator_go_no_go_intake_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.finalOperatorGoNoGoAcceptedNow, true, "accepted.finalOperatorGoNoGoAcceptedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.nextRoute, "prepare_current_scope_single_bounded_write_attempt_execution_gate_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const intake = result.output.finalOperatorGoNoGoIntake;
  if (!intake || typeof intake !== "object") {
    problems.push("accepted.finalOperatorGoNoGoIntake must be an object");
    return;
  }
  expect(intake.decisionMode, "current_scope_final_operator_go_no_go_no_execution", "finalOperatorGoNoGoIntake.decisionMode");
  expect(intake.attemptId, "phase-1-current-scope-attempt-example", "finalOperatorGoNoGoIntake.attemptId");
  expect(intake.phase1Universe, "twii_plus_listed_stock_daily_close", "finalOperatorGoNoGoIntake.phase1Universe");
  expect(intake.scope, "twii_plus_listed_stock_daily_close", "finalOperatorGoNoGoIntake.scope");
  expect(intake.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "finalOperatorGoNoGoIntake.operationKind");
  expect(intake.acceptedFinalDecision, "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT", "finalOperatorGoNoGoIntake.acceptedFinalDecision");
  expect(intake.finalExecutionAllowedNow, false, "finalOperatorGoNoGoIntake.finalExecutionAllowedNow");
  expect(intake.finalExecutionStillRequiresSeparateGate, true, "finalOperatorGoNoGoIntake.finalExecutionStillRequiresSeparateGate");
  expect(intake.requiredNextPacket, "current_scope_single_bounded_write_attempt_execution_gate_no_execution", "finalOperatorGoNoGoIntake.requiredNextPacket");
  expectSafeFlags(intake, "finalOperatorGoNoGoIntake");
}

function validateRejectedRun(label, result) {
  if (result.exitCode === 0) problems.push(`${label} should fail`);
  expect(result.output.status, "blocked", `${label}.status`);
  expect(result.output.finalExecutionAllowedNow, false, `${label}.finalExecutionAllowedNow`);
  expectSafeFlags(result.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_final_operator_go_no_go_intake_no_execution_ready",
      "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT",
      "prepare_current_scope_single_bounded_write_attempt_execution_gate_no_execution",
      "finalExecutionAllowedNow=false",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Final Operator Go/No-Go Intake",
      "phase_1_current_scope_final_operator_go_no_go_intake_no_execution_ready",
      "prepare_current_scope_single_bounded_write_attempt_execution_gate_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-final-operator-go-no-go-intake-once"] !==
    "node scripts/run-phase-1-current-scope-final-operator-go-no-go-intake-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-final-operator-go-no-go-intake-no-execution"] !==
    "node scripts/check-phase-1-current-scope-final-operator-go-no-go-intake-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-final-operator-go-no-go-intake-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing final operator go/no-go intake checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-final-operator-go-no-go-intake-no-execution"')) {
    problems.push(`${reviewGatePath} missing final operator go/no-go intake focused name`);
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
