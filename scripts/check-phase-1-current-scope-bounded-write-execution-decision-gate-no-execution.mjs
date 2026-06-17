import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-bounded-write-execution-decision-gate-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_DECISION_GATE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-execution-decision-"));

try {
  const acceptedIntakePath = writeJson("accepted-intake.json", makeAcceptedIntake());
  const blockedIntakePath = writeJson("blocked-intake.json", { ...makeAcceptedIntake(), status: "blocked" });
  const acceptedDecisionPath = writeJson("accepted-decision.json", makeAcceptedDecision());
  const rejectedDecisionPath = writeJson("rejected-decision.json", { executionDecision: "REJECT_OR_REPAIR" });
  const rowPayloadDecisionPath = writeJson("row-payload-decision.json", { ...makeAcceptedDecision(), rows: [] });
  const secretDecisionPath = writeJson("secret-decision.json", { ...makeAcceptedDecision(), confirmationPhraseValue: "DO_NOT_LOG" });
  const realPromotionDecisionPath = writeJson("real-promotion-decision.json", { ...makeAcceptedDecision(), publicDataSource: "supabase" });
  const etfDecisionPath = writeJson("etf-decision.json", { ...makeAcceptedDecision(), note: "0050 deferred scope" });
  const executableDecisionPath = writeJson("executable-decision.json", { ...makeAcceptedDecision(), boundedWriteExecutableNow: true });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--response-intake", acceptedIntakePath, "--execution-decision", acceptedDecisionPath]));
  validateRejectedRun(
    "rejected decision",
    runNode(["--response-intake", acceptedIntakePath, "--execution-decision", rejectedDecisionPath]),
    "phase_1_current_scope_bounded_write_execution_decision_gate_rejected_or_repair_no_execution"
  );
  validateRejectedRun("blocked intake", runNode(["--response-intake", blockedIntakePath, "--execution-decision", acceptedDecisionPath]));
  validateRejectedRun("row payload decision", runNode(["--response-intake", acceptedIntakePath, "--execution-decision", rowPayloadDecisionPath]));
  validateRejectedRun("secret decision", runNode(["--response-intake", acceptedIntakePath, "--execution-decision", secretDecisionPath]));
  validateRejectedRun("real promotion decision", runNode(["--response-intake", acceptedIntakePath, "--execution-decision", realPromotionDecisionPath]));
  validateRejectedRun("etf decision", runNode(["--response-intake", acceptedIntakePath, "--execution-decision", etfDecisionPath]));
  validateRejectedRun("executable decision", runNode(["--response-intake", acceptedIntakePath, "--execution-decision", executableDecisionPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_bounded_write_execution_decision_gate_no_execution_ready"
      : "phase_1_current_scope_bounded_write_execution_decision_gate_no_execution_blocked",
    acceptedDecisionGateReady: true,
    rejectedOrRepairDecisionRecorded: true,
    blockedIntakeRejected: true,
    rowPayloadRejected: true,
    secretDecisionRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableDecisionRejected: true,
    executionPacketPreparationAllowedNow: true,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: ok ? "prepare_current_scope_bounded_write_execution_packet_no_execution" : "keep_mock_and_repair_execution_decision_gate",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedIntake() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_explicit_operator_bounded_write_authorization_response_intake_accepted_no_execution",
    operatorAuthorizationResponseAcceptedNow: true,
    operatorAuthorizationAcceptedNow: true,
    attemptId: "phase-1-current-scope-attempt-example",
    candidateArtifactPathReferencePresent: true,
    rollbackScopePresent: true,
    postRunReviewOwner: "PM",
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "prepare_current_scope_bounded_write_execution_decision_gate_no_execution",
    problems: []
  };
}

function makeAcceptedDecision() {
  return {
    executionDecision: "APPROVE_PREPARE_ONE_BOUNDED_WRITE_EXECUTION_PACKET",
    attemptId: "phase-1-current-scope-attempt-example",
    operatorAuthorizationResponseAcceptedNow: true,
    candidateArtifactPathReferencePresent: true,
    rollbackScopeConfirmed: true,
    postRunReviewOwnerConfirmed: true,
    readbackPlanConfirmed: true,
    abortSwitchPresent: true
  };
}

function validateMissingRun(run) {
  expect(run.exitCode, 1, "missing.exitCode");
  expect(run.output.status, "blocked", "missing.status");
  expect(run.output.executionDecisionAcceptedNow, false, "missing.executionDecisionAcceptedNow");
  expect(run.output.executionPacketPreparationAllowedNow, false, "missing.executionPacketPreparationAllowedNow");
  expectSafeFlags(run.output, "missing");
}

function validateAcceptedRun(run) {
  expect(run.exitCode, 0, "accepted.exitCode");
  expect(run.output.status, "ok", "accepted.status");
  expect(run.output.guardedStatus, "phase_1_current_scope_bounded_write_execution_decision_gate_ready_no_execution", "accepted.guardedStatus");
  expect(run.output.executionDecisionAcceptedNow, true, "accepted.executionDecisionAcceptedNow");
  expect(run.output.executionPacketPreparationAllowedNow, true, "accepted.executionPacketPreparationAllowedNow");
  expect(run.output.operatorAuthorizationResponseAcceptedNow, true, "accepted.operatorAuthorizationResponseAcceptedNow");
  expect(run.output.candidateArtifactPathReferencePresent, true, "accepted.candidateArtifactPathReferencePresent");
  expect(run.output.rollbackScopeConfirmed, true, "accepted.rollbackScopeConfirmed");
  expect(run.output.postRunReviewOwnerConfirmed, true, "accepted.postRunReviewOwnerConfirmed");
  expect(run.output.readbackPlanConfirmed, true, "accepted.readbackPlanConfirmed");
  expect(run.output.abortSwitchPresent, true, "accepted.abortSwitchPresent");
  expect(run.output.nextRoute, "prepare_current_scope_bounded_write_execution_packet_no_execution", "accepted.nextRoute");
  expectSafeFlags(run.output, "accepted");
}

function validateRejectedRun(label, run, expectedGuardedStatus = null) {
  expect(run.exitCode, 1, `${label}.exitCode`);
  expect(run.output.status, "blocked", `${label}.status`);
  if (expectedGuardedStatus) expect(run.output.guardedStatus, expectedGuardedStatus, `${label}.guardedStatus`);
  expectSafeFlags(run.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_bounded_write_execution_decision_gate_no_execution_ready",
      "run:phase-1-current-scope-bounded-write-execution-decision-gate-once",
      "check:phase-1-current-scope-bounded-write-execution-decision-gate-no-execution",
      "--response-intake",
      "--execution-decision",
      "APPROVE_PREPARE_ONE_BOUNDED_WRITE_EXECUTION_PACKET",
      "REJECT_OR_REPAIR",
      "`operatorAuthorizationResponseAcceptedNow=true`",
      "`candidateArtifactPathReferencePresent=true`",
      "`rollbackScopeConfirmed=true`",
      "`postRunReviewOwnerConfirmed=true`",
      "`readbackPlanConfirmed=true`",
      "`abortSwitchPresent=true`",
      "`boundedWriteExecutableNow=false`",
      "`candidateRowsAcceptedNow=false`",
      "`writeGateOpenedNow=false`",
      "`sqlExecuted=false`",
      "`supabaseWriteAttempted=false`",
      "`dailyPricesMutated=false`",
      "`publicDataSource=mock`",
      "`scoreSource=mock`",
      "prepare_current_scope_bounded_write_execution_packet_no_execution"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Bounded Write Execution Decision Gate",
      "phase_1_current_scope_bounded_write_execution_decision_gate_no_execution_ready",
      "prepare_current_scope_bounded_write_execution_packet_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-bounded-write-execution-decision-gate-once"] !==
    "node scripts/run-phase-1-current-scope-bounded-write-execution-decision-gate-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-bounded-write-execution-decision-gate-no-execution"] !==
    "node scripts/check-phase-1-current-scope-bounded-write-execution-decision-gate-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-bounded-write-execution-decision-gate-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing execution decision checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-bounded-write-execution-decision-gate-no-execution"')) {
    problems.push(`${reviewGatePath} missing execution decision focused name`);
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
