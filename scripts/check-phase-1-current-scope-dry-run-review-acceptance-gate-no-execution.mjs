import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-dry-run-review-acceptance-gate-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_DRY_RUN_REVIEW_ACCEPTANCE_GATE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-dry-run-review-acceptance-"));

try {
  const packetPath = writeJson("accepted-dry-run-review-packet.json", makeAcceptedPacketResult());
  const blockedPacketPath = writeJson("blocked-dry-run-review-packet.json", { ...makeAcceptedPacketResult(), status: "blocked" });
  const acceptedDecisionPath = writeJson("accepted-dry-run-review-acceptance.json", makeAcceptedDecision());
  const wrongDecisionPath = writeJson("wrong-dry-run-review-acceptance.json", {
    ...makeAcceptedDecision(),
    dryRunReviewAcceptanceDecision: "REJECT_OR_REPAIR_CURRENT_SCOPE_DRY_RUN_REVIEW_PACKET"
  });
  const mismatchedAttemptPath = writeJson("mismatched-attempt-acceptance.json", { ...makeAcceptedDecision(), attemptId: "other-attempt" });
  const rowPayloadDecisionPath = writeJson("row-payload-acceptance.json", { ...makeAcceptedDecision(), rows: [] });
  const secretDecisionPath = writeJson("secret-acceptance.json", { ...makeAcceptedDecision(), token: "DO_NOT_LOG" });
  const realPromotionDecisionPath = writeJson("real-promotion-acceptance.json", { ...makeAcceptedDecision(), scoreSource: "real" });
  const etfDecisionPath = writeJson("etf-acceptance.json", { ...makeAcceptedDecision(), note: "006208 deferred scope" });
  const executableDecisionPath = writeJson("executable-acceptance.json", { ...makeAcceptedDecision(), boundedWriteExecutableNow: true });
  const executedDecisionPath = writeJson("executed-acceptance.json", { ...makeAcceptedDecision(), sqlExecuted: true });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--dry-run-review-packet", packetPath, "--dry-run-review-acceptance", acceptedDecisionPath]));
  validateRejectedRun("blocked packet", runNode(["--dry-run-review-packet", blockedPacketPath, "--dry-run-review-acceptance", acceptedDecisionPath]));
  validateRejectedRun("wrong decision", runNode(["--dry-run-review-packet", packetPath, "--dry-run-review-acceptance", wrongDecisionPath]));
  validateRejectedRun("mismatched attempt", runNode(["--dry-run-review-packet", packetPath, "--dry-run-review-acceptance", mismatchedAttemptPath]));
  validateRejectedRun("row payload decision", runNode(["--dry-run-review-packet", packetPath, "--dry-run-review-acceptance", rowPayloadDecisionPath]));
  validateRejectedRun("secret decision", runNode(["--dry-run-review-packet", packetPath, "--dry-run-review-acceptance", secretDecisionPath]));
  validateRejectedRun("real promotion decision", runNode(["--dry-run-review-packet", packetPath, "--dry-run-review-acceptance", realPromotionDecisionPath]));
  validateRejectedRun("etf decision", runNode(["--dry-run-review-packet", packetPath, "--dry-run-review-acceptance", etfDecisionPath]));
  validateRejectedRun("executable decision", runNode(["--dry-run-review-packet", packetPath, "--dry-run-review-acceptance", executableDecisionPath]));
  validateRejectedRun("executed decision", runNode(["--dry-run-review-packet", packetPath, "--dry-run-review-acceptance", executedDecisionPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_dry_run_review_acceptance_gate_no_execution_ready"
      : "phase_1_current_scope_dry_run_review_acceptance_gate_no_execution_blocked",
    acceptedDryRunReviewAcceptanceReady: true,
    blockedPacketRejected: true,
    wrongDecisionRejected: true,
    mismatchedAttemptRejected: true,
    rowPayloadRejected: true,
    secretDecisionRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableDecisionRejected: true,
    executedDecisionRejected: true,
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
      ? "prepare_current_scope_bounded_write_execution_readiness_review_no_execution"
      : "keep_mock_and_repair_dry_run_review_acceptance_gate",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedPacketResult() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_dry_run_review_packet_ready_no_execution",
    dryRunReviewPacketPreparedNow: true,
    dryRunReviewPacket: {
      packetMode: "current_scope_dry_run_review_packet_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      requiredReviewSections: [
        "scope_and_attempt_summary",
        "aggregate_evidence_summary",
        "failure_or_abort_summary",
        "no_payload_no_write_boundary_summary",
        "pm_decision_options"
      ],
      requiredAggregateEvidence: [
        "candidate_row_count_summary_only",
        "duplicate_row_count_summary_only",
        "rejected_row_count_summary_only",
        "affected_date_range_summary_only"
      ],
      requiredFailureEvidence: [
        "missing_required_input_summary",
        "scope_mismatch_summary",
        "abort_condition_summary"
      ],
      requiredNoPayloadEvidence: [
        "raw_payload_absent",
        "row_payload_absent",
        "stock_id_payload_absent",
        "secret_and_confirmation_values_absent"
      ],
      requiredDecisionOptions: [
        "accept_dry_run_review_and_prepare_bounded_write_execution_review",
        "reject_and_repair_dry_run_inputs",
        "hold_mock_and_request_pm_review"
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
    nextRoute: "await_separate_current_scope_dry_run_review_acceptance_no_execution",
    problems: []
  };
}

function makeAcceptedDecision() {
  return {
    dryRunReviewAcceptanceDecision: "ACCEPT_CURRENT_SCOPE_DRY_RUN_REVIEW_PACKET",
    attemptId: "phase-1-current-scope-attempt-example",
    dryRunReviewPacketPreparedNow: true,
    requiredReviewSectionsConfirmed: true,
    aggregateEvidenceConfirmed: true,
    failureEvidenceConfirmed: true,
    noPayloadEvidenceConfirmed: true,
    decisionOptionsConfirmed: true,
    publicRuntimeStaysMockConfirmed: true,
    scoreSourceStaysMockConfirmed: true,
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
  expect(result.output.guardedStatus, "phase_1_current_scope_dry_run_review_acceptance_gate_blocked_missing_inputs", "missingArgs.guardedStatus");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted dry-run review acceptance should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_dry_run_review_acceptance_gate_ready_no_execution", "accepted.guardedStatus");
  expect(result.output.dryRunReviewAcceptedNow, true, "accepted.dryRunReviewAcceptedNow");
  expect(result.output.futureBoundedWriteReadinessReviewPreparedNow, true, "accepted.futureBoundedWriteReadinessReviewPreparedNow");
  expect(result.output.nextRoute, "prepare_current_scope_bounded_write_execution_readiness_review_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const review = result.output.futureBoundedWriteReadinessReview;
  if (!review || typeof review !== "object") {
    problems.push("accepted.futureBoundedWriteReadinessReview must be an object");
    return;
  }
  expect(review.reviewMode, "current_scope_bounded_write_execution_readiness_review_no_execution", "futureBoundedWriteReadinessReview.reviewMode");
  expect(review.attemptId, "phase-1-current-scope-attempt-example", "futureBoundedWriteReadinessReview.attemptId");
  expect(review.phase1Universe, "twii_plus_listed_stock_daily_close", "futureBoundedWriteReadinessReview.phase1Universe");
  expect(review.scope, "twii_plus_listed_stock_daily_close", "futureBoundedWriteReadinessReview.scope");
  expect(review.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "futureBoundedWriteReadinessReview.operationKind");
  expect(review.dryRunReviewPacketAcceptedNow, true, "futureBoundedWriteReadinessReview.dryRunReviewPacketAcceptedNow");
  expect(review.requiredNextRoute, "prepare_current_scope_bounded_write_execution_readiness_review_no_execution", "futureBoundedWriteReadinessReview.requiredNextRoute");
  if (!Array.isArray(review.requiredReadinessSections) || review.requiredReadinessSections.length < 3) {
    problems.push("futureBoundedWriteReadinessReview.requiredReadinessSections must contain at least 3 items");
  }
  expectSafeFlags(review, "futureBoundedWriteReadinessReview");
}

function validateRejectedRun(label, result) {
  if (result.exitCode === 0) problems.push(`${label} should fail`);
  expect(result.output.status, "blocked", `${label}.status`);
  expectSafeFlags(result.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_dry_run_review_acceptance_gate_no_execution_ready",
      "ACCEPT_CURRENT_SCOPE_DRY_RUN_REVIEW_PACKET",
      "prepare_current_scope_bounded_write_execution_readiness_review_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Dry-Run Review Acceptance Gate",
      "phase_1_current_scope_dry_run_review_acceptance_gate_no_execution_ready",
      "prepare_current_scope_bounded_write_execution_readiness_review_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-dry-run-review-acceptance-gate-once"] !==
    "node scripts/run-phase-1-current-scope-dry-run-review-acceptance-gate-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-dry-run-review-acceptance-gate-no-execution"] !==
    "node scripts/check-phase-1-current-scope-dry-run-review-acceptance-gate-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-dry-run-review-acceptance-gate-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing dry-run review acceptance gate checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-dry-run-review-acceptance-gate-no-execution"')) {
    problems.push(`${reviewGatePath} missing dry-run review acceptance gate focused name`);
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
