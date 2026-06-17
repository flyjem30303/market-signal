import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-bounded-write-execution-readiness-review-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_READINESS_REVIEW_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-bounded-write-readiness-review-"));

try {
  const acceptedPath = writeJson("accepted-dry-run-review-acceptance.json", makeAcceptedAcceptanceResult());
  const blockedPath = writeJson("blocked-dry-run-review-acceptance.json", { ...makeAcceptedAcceptanceResult(), status: "blocked" });
  const rowPayloadPath = writeJson("row-payload-acceptance.json", { ...makeAcceptedAcceptanceResult(), rows: [] });
  const secretPath = writeJson("secret-acceptance.json", { ...makeAcceptedAcceptanceResult(), token: "DO_NOT_LOG" });
  const realPromotionPath = writeJson("real-promotion-acceptance.json", { ...makeAcceptedAcceptanceResult(), publicDataSource: "supabase" });
  const etfPath = writeJson("etf-acceptance.json", { ...makeAcceptedAcceptanceResult(), note: "0050 deferred scope" });
  const executablePath = writeJson("executable-acceptance.json", { ...makeAcceptedAcceptanceResult(), boundedWriteExecutableNow: true });
  const executedPath = writeJson("executed-acceptance.json", { ...makeAcceptedAcceptanceResult(), dailyPricesMutated: true });
  const missingReviewPath = writeJson("missing-review-acceptance.json", { ...makeAcceptedAcceptanceResult(), futureBoundedWriteReadinessReview: null });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--dry-run-review-acceptance", acceptedPath]));
  validateRejectedRun("blocked acceptance", runNode(["--dry-run-review-acceptance", blockedPath]));
  validateRejectedRun("row payload acceptance", runNode(["--dry-run-review-acceptance", rowPayloadPath]));
  validateRejectedRun("secret acceptance", runNode(["--dry-run-review-acceptance", secretPath]));
  validateRejectedRun("real promotion acceptance", runNode(["--dry-run-review-acceptance", realPromotionPath]));
  validateRejectedRun("etf acceptance", runNode(["--dry-run-review-acceptance", etfPath]));
  validateRejectedRun("executable acceptance", runNode(["--dry-run-review-acceptance", executablePath]));
  validateRejectedRun("executed acceptance", runNode(["--dry-run-review-acceptance", executedPath]));
  validateRejectedRun("missing review acceptance", runNode(["--dry-run-review-acceptance", missingReviewPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_bounded_write_execution_readiness_review_no_execution_ready"
      : "phase_1_current_scope_bounded_write_execution_readiness_review_no_execution_blocked",
    acceptedReadinessReviewReady: true,
    blockedAcceptanceRejected: true,
    rowPayloadRejected: true,
    secretDecisionRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableDecisionRejected: true,
    executedDecisionRejected: true,
    missingReviewRejected: true,
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
      ? "prepare_current_scope_bounded_write_execution_authorization_packet_no_execution"
      : "keep_mock_and_repair_bounded_write_execution_readiness_review",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedAcceptanceResult() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_dry_run_review_acceptance_gate_ready_no_execution",
    dryRunReviewAcceptedNow: true,
    futureBoundedWriteReadinessReviewPreparedNow: true,
    futureBoundedWriteReadinessReview: {
      reviewMode: "current_scope_bounded_write_execution_readiness_review_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      dryRunReviewPacketAcceptedNow: true,
      requiredNextRoute: "prepare_current_scope_bounded_write_execution_readiness_review_no_execution",
      requiredReadinessSections: [
        "accepted_dry_run_review_packet_summary",
        "bounded_write_preconditions_summary",
        "no_payload_no_secret_boundary_summary",
        "separate_operator_authorization_stopline"
      ],
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
    scoreSource: "mock",
    nextRoute: "prepare_current_scope_bounded_write_execution_readiness_review_no_execution",
    problems: []
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_bounded_write_execution_readiness_review_blocked_missing_inputs", "missingArgs.guardedStatus");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted bounded write readiness review should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_bounded_write_execution_readiness_review_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.boundedWriteExecutionReadinessReviewPreparedNow, true, "accepted.boundedWriteExecutionReadinessReviewPreparedNow");
  expect(result.output.nextRoute, "prepare_current_scope_bounded_write_execution_authorization_packet_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const review = result.output.boundedWriteExecutionReadinessReview;
  if (!review || typeof review !== "object") {
    problems.push("accepted.boundedWriteExecutionReadinessReview must be an object");
    return;
  }
  expect(review.reviewMode, "current_scope_bounded_write_execution_readiness_review_no_execution", "boundedWriteExecutionReadinessReview.reviewMode");
  expect(review.attemptId, "phase-1-current-scope-attempt-example", "boundedWriteExecutionReadinessReview.attemptId");
  expect(review.phase1Universe, "twii_plus_listed_stock_daily_close", "boundedWriteExecutionReadinessReview.phase1Universe");
  expect(review.scope, "twii_plus_listed_stock_daily_close", "boundedWriteExecutionReadinessReview.scope");
  expect(review.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "boundedWriteExecutionReadinessReview.operationKind");
  for (const field of [
    "acceptedDryRunReviewRequired",
    "aggregateOnlyEvidenceRequired",
    "serverOnlyCredentialPresenceCheckRequired",
    "sanitizedCandidateArtifactPathShapeCheckRequired",
    "insertMissingOnlyContractRequired",
    "aggregateReadbackContractRequired",
    "rollbackOrQuarantinePlanRequired",
    "separateOperatorAuthorizationRequired"
  ]) {
    expect(review[field], true, `boundedWriteExecutionReadinessReview.${field}`);
  }
  if (!Array.isArray(review.readinessStoplines) || review.readinessStoplines.length < 5) {
    problems.push("boundedWriteExecutionReadinessReview.readinessStoplines must contain at least 5 items");
  }
  expect(review.requiredNextPacket, "current_scope_bounded_write_execution_authorization_packet_no_execution", "boundedWriteExecutionReadinessReview.requiredNextPacket");
  expectSafeFlags(review, "boundedWriteExecutionReadinessReview");
}

function validateRejectedRun(label, result) {
  if (result.exitCode === 0) problems.push(`${label} should fail`);
  expect(result.output.status, "blocked", `${label}.status`);
  expectSafeFlags(result.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_bounded_write_execution_readiness_review_no_execution_ready",
      "prepare_current_scope_bounded_write_execution_authorization_packet_no_execution",
      "current_scope_bounded_write_execution_authorization_packet_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Bounded Write Execution Readiness Review",
      "phase_1_current_scope_bounded_write_execution_readiness_review_no_execution_ready",
      "prepare_current_scope_bounded_write_execution_authorization_packet_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-bounded-write-execution-readiness-review-once"] !==
    "node scripts/run-phase-1-current-scope-bounded-write-execution-readiness-review-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-bounded-write-execution-readiness-review-no-execution"] !==
    "node scripts/check-phase-1-current-scope-bounded-write-execution-readiness-review-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-bounded-write-execution-readiness-review-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing bounded write readiness review checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-bounded-write-execution-readiness-review-no-execution"')) {
    problems.push(`${reviewGatePath} missing bounded write readiness review focused name`);
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
