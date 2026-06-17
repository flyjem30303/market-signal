import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-bounded-write-execution-packet-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_PACKET_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-execution-packet-"));

try {
  const acceptedDecisionPath = writeJson("accepted-decision.json", makeAcceptedDecisionGate());
  const blockedDecisionPath = writeJson("blocked-decision.json", { ...makeAcceptedDecisionGate(), status: "blocked" });
  const rowPayloadDecisionPath = writeJson("row-payload-decision.json", { ...makeAcceptedDecisionGate(), rows: [] });
  const secretDecisionPath = writeJson("secret-decision.json", { ...makeAcceptedDecisionGate(), token: "DO_NOT_LOG" });
  const realPromotionDecisionPath = writeJson("real-promotion-decision.json", { ...makeAcceptedDecisionGate(), scoreSource: "real" });
  const etfDecisionPath = writeJson("etf-decision.json", { ...makeAcceptedDecisionGate(), note: "006208 deferred scope" });
  const executableDecisionPath = writeJson("executable-decision.json", { ...makeAcceptedDecisionGate(), writeGateOpenedNow: true });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--decision-gate", acceptedDecisionPath]));
  validateRejectedRun("blocked decision", runNode(["--decision-gate", blockedDecisionPath]));
  validateRejectedRun("row payload decision", runNode(["--decision-gate", rowPayloadDecisionPath]));
  validateRejectedRun("secret decision", runNode(["--decision-gate", secretDecisionPath]));
  validateRejectedRun("real promotion decision", runNode(["--decision-gate", realPromotionDecisionPath]));
  validateRejectedRun("etf decision", runNode(["--decision-gate", etfDecisionPath]));
  validateRejectedRun("executable decision", runNode(["--decision-gate", executableDecisionPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_bounded_write_execution_packet_no_execution_ready"
      : "phase_1_current_scope_bounded_write_execution_packet_no_execution_blocked",
    acceptedExecutionPacketReady: true,
    blockedDecisionRejected: true,
    rowPayloadRejected: true,
    secretDecisionRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableDecisionRejected: true,
    executionPacketPreparedNow: true,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: ok ? "await_separate_current_scope_bounded_write_runner_authorization_no_execution" : "keep_mock_and_repair_current_scope_bounded_write_execution_packet",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedDecisionGate() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_bounded_write_execution_decision_gate_ready_no_execution",
    executionDecisionAcceptedNow: true,
    executionDecisionRecordedNow: true,
    executionPacketPreparationAllowedNow: true,
    attemptId: "phase-1-current-scope-attempt-example",
    operatorAuthorizationResponseAcceptedNow: true,
    candidateArtifactPathReferencePresent: true,
    rollbackScopeConfirmed: true,
    postRunReviewOwnerConfirmed: true,
    readbackPlanConfirmed: true,
    abortSwitchPresent: true,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "prepare_current_scope_bounded_write_execution_packet_no_execution",
    problems: []
  };
}

function validateMissingRun(run) {
  expect(run.exitCode, 1, "missing.exitCode");
  expect(run.output.status, "blocked", "missing.status");
  expect(run.output.executionPacketPreparedNow, false, "missing.executionPacketPreparedNow");
  expectSafeFlags(run.output, "missing");
}

function validateAcceptedRun(run) {
  expect(run.exitCode, 0, "accepted.exitCode");
  expect(run.output.status, "ok", "accepted.status");
  expect(run.output.guardedStatus, "phase_1_current_scope_bounded_write_execution_packet_ready_no_execution", "accepted.guardedStatus");
  expect(run.output.executionPacketPreparedNow, true, "accepted.executionPacketPreparedNow");
  expectSafeFlags(run.output, "accepted");
  const packet = run.output.executionPacket;
  expect(packet?.packetMode, "current_scope_bounded_write_execution_packet_no_execution", "packet.packetMode");
  expect(packet?.attemptId, "phase-1-current-scope-attempt-example", "packet.attemptId");
  expect(packet?.phase1Universe, "twii_plus_listed_stock_daily_close", "packet.phase1Universe");
  expect(packet?.scope, "twii_plus_listed_stock_daily_close", "packet.scope");
  expect(packet?.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "packet.operationKind");
  expect(packet?.candidateArtifactPathReferencePresent, true, "packet.candidateArtifactPathReferencePresent");
  for (const field of ["requiredRuntimeInputs", "requiredStopConditions", "requiredReadbackPlan", "requiredRollbackPlan", "requiredPostRunReview"]) {
    if (!Array.isArray(packet?.[field]) || packet[field].length < 3) problems.push(`packet.${field} must contain at least 3 items`);
  }
  expect(packet?.envValuesReadNow, false, "packet.envValuesReadNow");
  expect(packet?.secretValuesOutputNow, false, "packet.secretValuesOutputNow");
  expect(packet?.confirmationPhraseValueOutputNow, false, "packet.confirmationPhraseValueOutputNow");
  expect(packet?.boundedWriteExecutableNow, false, "packet.boundedWriteExecutableNow");
  expect(packet?.candidateRowsAcceptedNow, false, "packet.candidateRowsAcceptedNow");
  expect(packet?.writeGateOpenedNow, false, "packet.writeGateOpenedNow");
  expect(packet?.sqlExecuted, false, "packet.sqlExecuted");
  expect(packet?.supabaseWriteAttempted, false, "packet.supabaseWriteAttempted");
  expect(packet?.dailyPricesMutated, false, "packet.dailyPricesMutated");
  expect(packet?.publicDataSource, "mock", "packet.publicDataSource");
  expect(packet?.scoreSource, "mock", "packet.scoreSource");
  expect(run.output.nextRoute, "await_separate_current_scope_bounded_write_runner_authorization_no_execution", "accepted.nextRoute");
}

function validateRejectedRun(label, run) {
  expect(run.exitCode, 1, `${label}.exitCode`);
  expect(run.output.status, "blocked", `${label}.status`);
  expectSafeFlags(run.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_bounded_write_execution_packet_no_execution_ready",
      "run:phase-1-current-scope-bounded-write-execution-packet-once",
      "check:phase-1-current-scope-bounded-write-execution-packet-no-execution",
      "--decision-gate",
      "`attemptId`",
      "`phase1Universe=twii_plus_listed_stock_daily_close`",
      "`scope=twii_plus_listed_stock_daily_close`",
      "`operationKind=insert_missing_daily_prices_from_sanitized_candidate_only`",
      "`candidateArtifactPathReferencePresent=true`",
      "`requiredRuntimeInputs`",
      "`requiredStopConditions`",
      "`requiredReadbackPlan`",
      "`requiredRollbackPlan`",
      "`requiredPostRunReview`",
      "`boundedWriteExecutableNow=false`",
      "`candidateRowsAcceptedNow=false`",
      "`writeGateOpenedNow=false`",
      "`sqlExecuted=false`",
      "`supabaseWriteAttempted=false`",
      "`dailyPricesMutated=false`",
      "`publicDataSource=mock`",
      "`scoreSource=mock`",
      "await_separate_current_scope_bounded_write_runner_authorization_no_execution"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Bounded Write Execution Packet",
      "phase_1_current_scope_bounded_write_execution_packet_no_execution_ready",
      "await_separate_current_scope_bounded_write_runner_authorization_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-bounded-write-execution-packet-once"] !==
    "node scripts/run-phase-1-current-scope-bounded-write-execution-packet-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-bounded-write-execution-packet-no-execution"] !==
    "node scripts/check-phase-1-current-scope-bounded-write-execution-packet-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-bounded-write-execution-packet-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing execution packet checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-bounded-write-execution-packet-no-execution"')) {
    problems.push(`${reviewGatePath} missing execution packet focused name`);
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
