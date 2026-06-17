import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-write-capable-runner-scaffold-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_WRITE_CAPABLE_RUNNER_SCAFFOLD_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-runner-scaffold-"));

try {
  const acceptedAuthorizationPath = writeJson("accepted-runner-authorization.json", makeAcceptedRunnerAuthorization());
  const blockedAuthorizationPath = writeJson("blocked-runner-authorization.json", { ...makeAcceptedRunnerAuthorization(), status: "blocked" });
  const rowPayloadAuthorizationPath = writeJson("row-payload-runner-authorization.json", { ...makeAcceptedRunnerAuthorization(), rows: [] });
  const secretAuthorizationPath = writeJson("secret-runner-authorization.json", { ...makeAcceptedRunnerAuthorization(), token: "DO_NOT_LOG" });
  const realPromotionAuthorizationPath = writeJson("real-promotion-runner-authorization.json", { ...makeAcceptedRunnerAuthorization(), scoreSource: "real" });
  const etfAuthorizationPath = writeJson("etf-runner-authorization.json", { ...makeAcceptedRunnerAuthorization(), note: "0050 deferred scope" });
  const executableAuthorizationPath = writeJson("executable-runner-authorization.json", { ...makeAcceptedRunnerAuthorization(), runnerExecutableNow: true });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--runner-authorization", acceptedAuthorizationPath]));
  validateRejectedRun("blocked authorization", runNode(["--runner-authorization", blockedAuthorizationPath]));
  validateRejectedRun("row payload authorization", runNode(["--runner-authorization", rowPayloadAuthorizationPath]));
  validateRejectedRun("secret authorization", runNode(["--runner-authorization", secretAuthorizationPath]));
  validateRejectedRun("real promotion authorization", runNode(["--runner-authorization", realPromotionAuthorizationPath]));
  validateRejectedRun("etf authorization", runNode(["--runner-authorization", etfAuthorizationPath]));
  validateRejectedRun("executable authorization", runNode(["--runner-authorization", executableAuthorizationPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_write_capable_runner_scaffold_no_execution_ready"
      : "phase_1_current_scope_write_capable_runner_scaffold_no_execution_blocked",
    acceptedRunnerScaffoldReady: true,
    blockedAuthorizationRejected: true,
    rowPayloadRejected: true,
    secretAuthorizationRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableAuthorizationRejected: true,
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
      ? "await_separate_current_scope_write_runner_execution_authorization_no_execution"
      : "keep_mock_and_repair_runner_scaffold",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedRunnerAuthorization() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_bounded_write_runner_authorization_gate_ready_no_execution",
    runnerAuthorizationAcceptedNow: true,
    runnerAuthorizationRecordedNow: true,
    runnerScaffoldPreparationAllowedNow: true,
    runnerExecutableNow: false,
    attemptId: "phase-1-current-scope-attempt-example",
    executionPacketPreparedNow: true,
    operationKindConfirmed: true,
    runtimeInputsPlanConfirmed: true,
    stopConditionsConfirmed: true,
    readbackPlanConfirmed: true,
    rollbackPlanConfirmed: true,
    postRunReviewConfirmed: true,
    abortSwitchPresent: true,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "prepare_current_scope_write_capable_runner_scaffold_no_execution",
    problems: []
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_write_capable_runner_scaffold_blocked_missing_inputs", "missingArgs.guardedStatus");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted runner scaffold run should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_write_capable_runner_scaffold_ready_no_execution", "accepted.guardedStatus");
  expect(result.output.runnerScaffoldPreparedNow, true, "accepted.runnerScaffoldPreparedNow");
  expect(result.output.nextRoute, "await_separate_current_scope_write_runner_execution_authorization_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const scaffold = result.output.runnerScaffold;
  if (!scaffold || typeof scaffold !== "object") {
    problems.push("accepted.runnerScaffold must be an object");
    return;
  }
  expect(scaffold.scaffoldMode, "write_capable_scaffold_no_execution", "runnerScaffold.scaffoldMode");
  expect(scaffold.runnerMode, "write_capable_scaffold_no_execution", "runnerScaffold.runnerMode");
  expect(scaffold.attemptId, "phase-1-current-scope-attempt-example", "runnerScaffold.attemptId");
  expect(scaffold.phase1Universe, "twii_plus_listed_stock_daily_close", "runnerScaffold.phase1Universe");
  expect(scaffold.scope, "twii_plus_listed_stock_daily_close", "runnerScaffold.scope");
  expect(scaffold.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "runnerScaffold.operationKind");
  for (const field of [
    "requiredServerInputs",
    "requiredRuntimeGuards",
    "requiredDryRunGuards",
    "requiredAbortConditions",
    "requiredReadbackReview",
    "requiredRollbackReview"
  ]) {
    if (!Array.isArray(scaffold[field]) || scaffold[field].length < 3) problems.push(`runnerScaffold.${field} must contain at least 3 items`);
  }
  expectSafeFlags(scaffold, "runnerScaffold");
}

function validateRejectedRun(label, result) {
  if (result.exitCode === 0) problems.push(`${label} should fail`);
  expect(result.output.status, "blocked", `${label}.status`);
  expectSafeFlags(result.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_write_capable_runner_scaffold_no_execution_ready",
      "write_capable_scaffold_no_execution",
      "await_separate_current_scope_write_runner_execution_authorization_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Write-Capable Runner Scaffold",
      "phase_1_current_scope_write_capable_runner_scaffold_no_execution_ready",
      "await_separate_current_scope_write_runner_execution_authorization_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-write-capable-runner-scaffold-once"] !==
    "node scripts/run-phase-1-current-scope-write-capable-runner-scaffold-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-write-capable-runner-scaffold-no-execution"] !==
    "node scripts/check-phase-1-current-scope-write-capable-runner-scaffold-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-write-capable-runner-scaffold-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing runner scaffold checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-write-capable-runner-scaffold-no-execution"')) {
    problems.push(`${reviewGatePath} missing runner scaffold focused name`);
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
