import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-bounded-write-pre-execution-review-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_BOUNDED_WRITE_PRE_EXECUTION_REVIEW_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-bounded-write-pre-execution-review-"));

try {
  const acceptedIntakePath = writeJson("accepted-authorization-response-intake.json", makeAcceptedAuthorizationResponseIntake());
  const blockedIntakePath = writeJson("blocked-authorization-response-intake.json", {
    ...makeAcceptedAuthorizationResponseIntake(),
    status: "blocked"
  });
  const missingFutureReviewPath = writeJson("missing-future-pre-execution-review.json", {
    ...makeAcceptedAuthorizationResponseIntake(),
    futurePreExecutionReview: null
  });
  const rowPayloadPath = writeJson("row-payload-intake.json", {
    ...makeAcceptedAuthorizationResponseIntake(),
    rowPayload: []
  });
  const secretPath = writeJson("secret-intake.json", {
    ...makeAcceptedAuthorizationResponseIntake(),
    secret: "DO_NOT_LOG"
  });
  const realPromotionPath = writeJson("real-promotion-intake.json", {
    ...makeAcceptedAuthorizationResponseIntake(),
    scoreSource: "real"
  });
  const etfPath = writeJson("deferred-etf-intake.json", {
    ...makeAcceptedAuthorizationResponseIntake(),
    note: "0050 remains deferred"
  });
  const executablePath = writeJson("executable-intake.json", {
    ...makeAcceptedAuthorizationResponseIntake(),
    boundedWriteExecutableNow: true
  });
  const executedPath = writeJson("executed-intake.json", {
    ...makeAcceptedAuthorizationResponseIntake(),
    sqlExecuted: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--authorization-response-intake", acceptedIntakePath]));
  validateRejectedRun("blocked intake", runNode(["--authorization-response-intake", blockedIntakePath]));
  validateRejectedRun("missing future review", runNode(["--authorization-response-intake", missingFutureReviewPath]));
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
      ? "phase_1_current_scope_bounded_write_pre_execution_review_no_execution_ready"
      : "phase_1_current_scope_bounded_write_pre_execution_review_no_execution_blocked",
    acceptedAuthorizationResponseIntakeReady: true,
    blockedIntakeRejected: true,
    missingFutureReviewRejected: true,
    rowPayloadRejected: true,
    secretIntakeRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableIntakeRejected: true,
    executedIntakeRejected: true,
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
      ? "prepare_current_scope_bounded_write_final_execution_packet_no_execution"
      : "keep_mock_and_repair_current_scope_bounded_write_pre_execution_review",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedAuthorizationResponseIntake() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_bounded_write_execution_authorization_response_intake_no_execution_ready",
    boundedWriteExecutionAuthorizationResponseAcceptedNow: true,
    futurePreExecutionReviewPreparedNow: true,
    futurePreExecutionReview: {
      reviewMode: "current_scope_bounded_write_pre_execution_review_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      acceptedAuthorizationResponsePresent: true,
      requiredNextPacket: "current_scope_bounded_write_pre_execution_review_no_execution",
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
    nextRoute: "prepare_current_scope_bounded_write_pre_execution_review_no_execution",
    problems: []
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_bounded_write_pre_execution_review_blocked_missing_inputs", "missingArgs.guardedStatus");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted pre-execution review should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_bounded_write_pre_execution_review_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.boundedWritePreExecutionReviewPreparedNow, true, "accepted.boundedWritePreExecutionReviewPreparedNow");
  expect(result.output.nextRoute, "prepare_current_scope_bounded_write_final_execution_packet_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const review = result.output.boundedWritePreExecutionReview;
  if (!review || typeof review !== "object") {
    problems.push("accepted.boundedWritePreExecutionReview must be an object");
    return;
  }
  expect(review.reviewMode, "current_scope_bounded_write_pre_execution_review_no_execution", "boundedWritePreExecutionReview.reviewMode");
  expect(review.attemptId, "phase-1-current-scope-attempt-example", "boundedWritePreExecutionReview.attemptId");
  expect(review.phase1Universe, "twii_plus_listed_stock_daily_close", "boundedWritePreExecutionReview.phase1Universe");
  expect(review.scope, "twii_plus_listed_stock_daily_close", "boundedWritePreExecutionReview.scope");
  expect(review.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "boundedWritePreExecutionReview.operationKind");
  expect(review.acceptedAuthorizationResponsePresent, true, "boundedWritePreExecutionReview.acceptedAuthorizationResponsePresent");
  expect(review.candidateArtifactPathReadinessRequired, true, "boundedWritePreExecutionReview.candidateArtifactPathReadinessRequired");
  expect(review.aggregateOnlyEvidenceRequired, true, "boundedWritePreExecutionReview.aggregateOnlyEvidenceRequired");
  expect(review.noPayloadBoundaryRequired, true, "boundedWritePreExecutionReview.noPayloadBoundaryRequired");
  expect(review.insertMissingOnlyContractRequired, true, "boundedWritePreExecutionReview.insertMissingOnlyContractRequired");
  expect(review.aggregateReadbackContractRequired, true, "boundedWritePreExecutionReview.aggregateReadbackContractRequired");
  expect(review.rollbackOrQuarantinePlanRequired, true, "boundedWritePreExecutionReview.rollbackOrQuarantinePlanRequired");
  expect(review.finalOperatorGoNoGoRequired, true, "boundedWritePreExecutionReview.finalOperatorGoNoGoRequired");
  expect(review.requiredNextPacket, "current_scope_bounded_write_final_execution_packet_no_execution", "boundedWritePreExecutionReview.requiredNextPacket");
  if (!Array.isArray(review.preExecutionStoplines) || review.preExecutionStoplines.length < 6) {
    problems.push("boundedWritePreExecutionReview.preExecutionStoplines must contain at least 6 items");
  }
  expectSafeFlags(review, "boundedWritePreExecutionReview");
}

function validateRejectedRun(label, result) {
  if (result.exitCode === 0) problems.push(`${label} should fail`);
  expect(result.output.status, "blocked", `${label}.status`);
  expectSafeFlags(result.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_bounded_write_pre_execution_review_no_execution_ready",
      "candidateArtifactPathReadinessRequired",
      "aggregateReadbackContractRequired",
      "rollbackOrQuarantinePlanRequired",
      "prepare_current_scope_bounded_write_final_execution_packet_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Bounded Write Pre-Execution Review",
      "phase_1_current_scope_bounded_write_pre_execution_review_no_execution_ready",
      "prepare_current_scope_bounded_write_final_execution_packet_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-bounded-write-pre-execution-review-once"] !==
    "node scripts/run-phase-1-current-scope-bounded-write-pre-execution-review-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-bounded-write-pre-execution-review-no-execution"] !==
    "node scripts/check-phase-1-current-scope-bounded-write-pre-execution-review-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-bounded-write-pre-execution-review-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing bounded write pre-execution review checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-bounded-write-pre-execution-review-no-execution"')) {
    problems.push(`${reviewGatePath} missing bounded write pre-execution review focused name`);
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
