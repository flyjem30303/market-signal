import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-bounded-write-execution-authorization-response-intake-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_AUTHORIZATION_RESPONSE_INTAKE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-bounded-write-authorization-response-"));

try {
  const packetPath = writeJson("accepted-authorization-packet.json", makeAcceptedPacketResult());
  const blockedPacketPath = writeJson("blocked-authorization-packet.json", { ...makeAcceptedPacketResult(), status: "blocked" });
  const acceptedResponsePath = writeJson("accepted-authorization-response.json", makeAcceptedResponse());
  const wrongDecisionPath = writeJson("wrong-decision-response.json", { ...makeAcceptedResponse(), authorizationDecision: "REJECT_KEEP_MOCK" });
  const mismatchPath = writeJson("mismatched-attempt-response.json", { ...makeAcceptedResponse(), attemptId: "other-attempt" });
  const rowPayloadPath = writeJson("row-payload-response.json", { ...makeAcceptedResponse(), rowPayload: [] });
  const secretPath = writeJson("secret-response.json", { ...makeAcceptedResponse(), secret: "DO_NOT_LOG" });
  const realPromotionPath = writeJson("real-promotion-response.json", { ...makeAcceptedResponse(), scoreSource: "real" });
  const etfPath = writeJson("etf-response.json", { ...makeAcceptedResponse(), note: "0050 deferred scope" });
  const executablePath = writeJson("executable-response.json", { ...makeAcceptedResponse(), boundedWriteExecutableNow: true });
  const executedPath = writeJson("executed-response.json", { ...makeAcceptedResponse(), sqlExecuted: true });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--authorization-packet", packetPath, "--authorization-response", acceptedResponsePath]));
  validateRejectedRun("blocked packet", runNode(["--authorization-packet", blockedPacketPath, "--authorization-response", acceptedResponsePath]));
  validateRejectedRun("wrong decision", runNode(["--authorization-packet", packetPath, "--authorization-response", wrongDecisionPath]));
  validateRejectedRun("mismatched attempt", runNode(["--authorization-packet", packetPath, "--authorization-response", mismatchPath]));
  validateRejectedRun("row payload response", runNode(["--authorization-packet", packetPath, "--authorization-response", rowPayloadPath]));
  validateRejectedRun("secret response", runNode(["--authorization-packet", packetPath, "--authorization-response", secretPath]));
  validateRejectedRun("real promotion response", runNode(["--authorization-packet", packetPath, "--authorization-response", realPromotionPath]));
  validateRejectedRun("etf response", runNode(["--authorization-packet", packetPath, "--authorization-response", etfPath]));
  validateRejectedRun("executable response", runNode(["--authorization-packet", packetPath, "--authorization-response", executablePath]));
  validateRejectedRun("executed response", runNode(["--authorization-packet", packetPath, "--authorization-response", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_bounded_write_execution_authorization_response_intake_no_execution_ready"
      : "phase_1_current_scope_bounded_write_execution_authorization_response_intake_no_execution_blocked",
    acceptedAuthorizationResponseReady: true,
    blockedPacketRejected: true,
    wrongDecisionRejected: true,
    mismatchedAttemptRejected: true,
    rowPayloadRejected: true,
    secretResponseRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableResponseRejected: true,
    executedResponseRejected: true,
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
      ? "prepare_current_scope_bounded_write_pre_execution_review_no_execution"
      : "keep_mock_and_repair_bounded_write_execution_authorization_response_intake",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedPacketResult() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_bounded_write_execution_authorization_packet_no_execution_ready",
    boundedWriteExecutionAuthorizationPacketPreparedNow: true,
    boundedWriteExecutionAuthorizationPacket: {
      packetMode: "current_scope_bounded_write_execution_authorization_packet_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      authorizationDecisionRequired: "APPROVE_PREPARE_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_RESPONSE",
      operatorMustConfirm: [
        "accepted_dry_run_review_exists",
        "readiness_review_exists",
        "aggregate_only_evidence_reviewed",
        "server_only_credential_presence_checked",
        "sanitized_candidate_artifact_path_shape_checked",
        "insert_missing_only_contract_reviewed",
        "aggregate_readback_contract_reviewed",
        "rollback_or_quarantine_plan_reviewed",
        "public_runtime_stays_mock",
        "score_source_stays_mock"
      ],
      explicitStoplines: [
        "do_not_execute_sql_from_this_packet",
        "do_not_write_supabase_from_this_packet",
        "do_not_mutate_daily_prices_from_this_packet",
        "do_not_output_secret_or_confirmation_values",
        "do_not_promote_public_runtime_to_real"
      ],
      requiredResponseMode: "current_scope_bounded_write_execution_authorization_response_no_execution",
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
    nextRoute: "await_separate_current_scope_bounded_write_execution_authorization_response_no_execution",
    problems: []
  };
}

function makeAcceptedResponse() {
  return {
    responseMode: "current_scope_bounded_write_execution_authorization_response_no_execution",
    authorizationDecision: "APPROVE_PREPARE_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_RESPONSE",
    attemptId: "phase-1-current-scope-attempt-example",
    acceptedDryRunReviewExistsConfirmed: true,
    readinessReviewExistsConfirmed: true,
    aggregateOnlyEvidenceReviewedConfirmed: true,
    serverOnlyCredentialPresenceCheckedConfirmed: true,
    sanitizedCandidateArtifactPathShapeCheckedConfirmed: true,
    insertMissingOnlyContractReviewedConfirmed: true,
    aggregateReadbackContractReviewedConfirmed: true,
    rollbackOrQuarantinePlanReviewedConfirmed: true,
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
  expect(result.output.guardedStatus, "phase_1_current_scope_bounded_write_execution_authorization_response_intake_blocked_missing_inputs", "missingArgs.guardedStatus");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted authorization response intake should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_bounded_write_execution_authorization_response_intake_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.boundedWriteExecutionAuthorizationResponseAcceptedNow, true, "accepted.boundedWriteExecutionAuthorizationResponseAcceptedNow");
  expect(result.output.futurePreExecutionReviewPreparedNow, true, "accepted.futurePreExecutionReviewPreparedNow");
  expect(result.output.nextRoute, "prepare_current_scope_bounded_write_pre_execution_review_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const review = result.output.futurePreExecutionReview;
  if (!review || typeof review !== "object") {
    problems.push("accepted.futurePreExecutionReview must be an object");
    return;
  }
  expect(review.reviewMode, "current_scope_bounded_write_pre_execution_review_no_execution", "futurePreExecutionReview.reviewMode");
  expect(review.attemptId, "phase-1-current-scope-attempt-example", "futurePreExecutionReview.attemptId");
  expect(review.phase1Universe, "twii_plus_listed_stock_daily_close", "futurePreExecutionReview.phase1Universe");
  expect(review.scope, "twii_plus_listed_stock_daily_close", "futurePreExecutionReview.scope");
  expect(review.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "futurePreExecutionReview.operationKind");
  expect(review.acceptedAuthorizationResponsePresent, true, "futurePreExecutionReview.acceptedAuthorizationResponsePresent");
  expect(review.requiredNextPacket, "current_scope_bounded_write_pre_execution_review_no_execution", "futurePreExecutionReview.requiredNextPacket");
  expectSafeFlags(review, "futurePreExecutionReview");
}

function validateRejectedRun(label, result) {
  if (result.exitCode === 0) problems.push(`${label} should fail`);
  expect(result.output.status, "blocked", `${label}.status`);
  expectSafeFlags(result.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_bounded_write_execution_authorization_response_intake_no_execution_ready",
      "APPROVE_PREPARE_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_RESPONSE",
      "prepare_current_scope_bounded_write_pre_execution_review_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Bounded Write Execution Authorization Response Intake",
      "phase_1_current_scope_bounded_write_execution_authorization_response_intake_no_execution_ready",
      "prepare_current_scope_bounded_write_pre_execution_review_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-bounded-write-execution-authorization-response-intake-once"] !==
    "node scripts/run-phase-1-current-scope-bounded-write-execution-authorization-response-intake-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-bounded-write-execution-authorization-response-intake-no-execution"] !==
    "node scripts/check-phase-1-current-scope-bounded-write-execution-authorization-response-intake-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-bounded-write-execution-authorization-response-intake-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing bounded write authorization response intake checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-bounded-write-execution-authorization-response-intake-no-execution"')) {
    problems.push(`${reviewGatePath} missing bounded write authorization response intake focused name`);
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
