import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-bounded-write-final-execution-packet-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_BOUNDED_WRITE_FINAL_EXECUTION_PACKET_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-bounded-write-final-packet-"));

try {
  const acceptedReviewPath = writeJson("accepted-pre-execution-review.json", makeAcceptedPreExecutionReview());
  const blockedReviewPath = writeJson("blocked-pre-execution-review.json", {
    ...makeAcceptedPreExecutionReview(),
    status: "blocked"
  });
  const missingReviewPath = writeJson("missing-review-object.json", {
    ...makeAcceptedPreExecutionReview(),
    boundedWritePreExecutionReview: null
  });
  const rowPayloadPath = writeJson("row-payload-review.json", {
    ...makeAcceptedPreExecutionReview(),
    rowPayload: []
  });
  const secretPath = writeJson("secret-review.json", {
    ...makeAcceptedPreExecutionReview(),
    secret: "DO_NOT_LOG"
  });
  const realPromotionPath = writeJson("real-promotion-review.json", {
    ...makeAcceptedPreExecutionReview(),
    scoreSource: "real"
  });
  const etfPath = writeJson("deferred-etf-review.json", {
    ...makeAcceptedPreExecutionReview(),
    note: "0050 remains deferred"
  });
  const executablePath = writeJson("executable-review.json", {
    ...makeAcceptedPreExecutionReview(),
    boundedWriteExecutableNow: true
  });
  const executedPath = writeJson("executed-review.json", {
    ...makeAcceptedPreExecutionReview(),
    sqlExecuted: true
  });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--pre-execution-review", acceptedReviewPath]));
  validateRejectedRun("blocked review", runNode(["--pre-execution-review", blockedReviewPath]));
  validateRejectedRun("missing review object", runNode(["--pre-execution-review", missingReviewPath]));
  validateRejectedRun("row payload review", runNode(["--pre-execution-review", rowPayloadPath]));
  validateRejectedRun("secret review", runNode(["--pre-execution-review", secretPath]));
  validateRejectedRun("real promotion review", runNode(["--pre-execution-review", realPromotionPath]));
  validateRejectedRun("deferred ETF review", runNode(["--pre-execution-review", etfPath]));
  validateRejectedRun("executable review", runNode(["--pre-execution-review", executablePath]));
  validateRejectedRun("executed review", runNode(["--pre-execution-review", executedPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_bounded_write_final_execution_packet_no_execution_ready"
      : "phase_1_current_scope_bounded_write_final_execution_packet_no_execution_blocked",
    acceptedPreExecutionReviewReady: true,
    blockedReviewRejected: true,
    missingReviewRejected: true,
    rowPayloadRejected: true,
    secretReviewRejected: true,
    realPromotionRejected: true,
    etfScopeRejected: true,
    executableReviewRejected: true,
    executedReviewRejected: true,
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
      ? "await_separate_current_scope_final_operator_go_no_go_no_execution"
      : "keep_mock_and_repair_current_scope_bounded_write_final_execution_packet",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedPreExecutionReview() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_bounded_write_pre_execution_review_no_execution_ready",
    boundedWritePreExecutionReviewPreparedNow: true,
    boundedWritePreExecutionReview: {
      reviewMode: "current_scope_bounded_write_pre_execution_review_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      acceptedAuthorizationResponsePresent: true,
      candidateArtifactPathReadinessRequired: true,
      aggregateOnlyEvidenceRequired: true,
      noPayloadBoundaryRequired: true,
      insertMissingOnlyContractRequired: true,
      aggregateReadbackContractRequired: true,
      rollbackOrQuarantinePlanRequired: true,
      finalOperatorGoNoGoRequired: true,
      preExecutionStoplines: [
        "missing_accepted_authorization_response",
        "candidate_artifact_path_not_ready",
        "row_raw_or_stock_id_payload_present",
        "secret_or_confirmation_value_present",
        "real_promotion_requested",
        "write_or_sql_already_attempted"
      ],
      requiredNextPacket: "current_scope_bounded_write_final_execution_packet_no_execution",
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
    nextRoute: "prepare_current_scope_bounded_write_final_execution_packet_no_execution",
    problems: []
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_bounded_write_final_execution_packet_blocked_missing_inputs", "missingArgs.guardedStatus");
  expect(result.output.finalExecutionAllowedNow, false, "missingArgs.finalExecutionAllowedNow");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted final execution packet should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_bounded_write_final_execution_packet_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.boundedWriteFinalExecutionPacketPreparedNow, true, "accepted.boundedWriteFinalExecutionPacketPreparedNow");
  expect(result.output.finalExecutionAllowedNow, false, "accepted.finalExecutionAllowedNow");
  expect(result.output.nextRoute, "await_separate_current_scope_final_operator_go_no_go_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const packet = result.output.boundedWriteFinalExecutionPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("accepted.boundedWriteFinalExecutionPacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_bounded_write_final_execution_packet_no_execution", "boundedWriteFinalExecutionPacket.packetMode");
  expect(packet.attemptId, "phase-1-current-scope-attempt-example", "boundedWriteFinalExecutionPacket.attemptId");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "boundedWriteFinalExecutionPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "boundedWriteFinalExecutionPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "boundedWriteFinalExecutionPacket.operationKind");
  expect(packet.requiredFinalDecision, "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT", "boundedWriteFinalExecutionPacket.requiredFinalDecision");
  expect(packet.finalGoNoGoAcceptedNow, false, "boundedWriteFinalExecutionPacket.finalGoNoGoAcceptedNow");
  expect(packet.candidateArtifactPathReadinessRequired, true, "boundedWriteFinalExecutionPacket.candidateArtifactPathReadinessRequired");
  expect(packet.aggregateOnlyEvidenceRequired, true, "boundedWriteFinalExecutionPacket.aggregateOnlyEvidenceRequired");
  expect(packet.noPayloadBoundaryRequired, true, "boundedWriteFinalExecutionPacket.noPayloadBoundaryRequired");
  expect(packet.insertMissingOnlyContractRequired, true, "boundedWriteFinalExecutionPacket.insertMissingOnlyContractRequired");
  expect(packet.aggregateReadbackContractRequired, true, "boundedWriteFinalExecutionPacket.aggregateReadbackContractRequired");
  expect(packet.rollbackOrQuarantinePlanRequired, true, "boundedWriteFinalExecutionPacket.rollbackOrQuarantinePlanRequired");
  expect(packet.postRunReviewRequired, true, "boundedWriteFinalExecutionPacket.postRunReviewRequired");
  expect(packet.publicRuntimeMustStayMock, true, "boundedWriteFinalExecutionPacket.publicRuntimeMustStayMock");
  expect(packet.scoreSourceMustStayMock, true, "boundedWriteFinalExecutionPacket.scoreSourceMustStayMock");
  expect(packet.requiredNextPacket, "current_scope_final_operator_go_no_go_no_execution", "boundedWriteFinalExecutionPacket.requiredNextPacket");
  if (!Array.isArray(packet.explicitExecutionStoplines) || packet.explicitExecutionStoplines.length < 6) {
    problems.push("boundedWriteFinalExecutionPacket.explicitExecutionStoplines must contain at least 6 items");
  }
  expectSafeFlags(packet, "boundedWriteFinalExecutionPacket");
}

function validateRejectedRun(label, result) {
  if (result.exitCode === 0) problems.push(`${label} should fail`);
  expect(result.output.status, "blocked", `${label}.status`);
  expectSafeFlags(result.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_bounded_write_final_execution_packet_no_execution_ready",
      "APPROVE_ONE_CURRENT_SCOPE_BOUNDED_WRITE_ATTEMPT",
      "await_separate_current_scope_final_operator_go_no_go_no_execution",
      "postRunReviewRequired",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Bounded Write Final Execution Packet",
      "phase_1_current_scope_bounded_write_final_execution_packet_no_execution_ready",
      "await_separate_current_scope_final_operator_go_no_go_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-bounded-write-final-execution-packet-once"] !==
    "node scripts/run-phase-1-current-scope-bounded-write-final-execution-packet-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-bounded-write-final-execution-packet-no-execution"] !==
    "node scripts/check-phase-1-current-scope-bounded-write-final-execution-packet-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-bounded-write-final-execution-packet-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing bounded write final execution packet checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-bounded-write-final-execution-packet-no-execution"')) {
    problems.push(`${reviewGatePath} missing bounded write final execution packet focused name`);
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
