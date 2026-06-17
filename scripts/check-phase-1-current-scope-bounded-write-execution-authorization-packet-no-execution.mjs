import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-bounded-write-execution-authorization-packet-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_AUTHORIZATION_PACKET_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const runnerSource = read(runnerPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-bounded-write-authorization-packet-"));

try {
  const acceptedPath = writeJson("accepted-readiness-review.json", makeAcceptedReadinessResult());
  const blockedPath = writeJson("blocked-readiness-review.json", { ...makeAcceptedReadinessResult(), status: "blocked" });
  const rowPayloadPath = writeJson("row-payload-readiness.json", { ...makeAcceptedReadinessResult(), rowPayload: [] });
  const secretPath = writeJson("secret-readiness.json", { ...makeAcceptedReadinessResult(), secret: "DO_NOT_LOG" });
  const realPromotionPath = writeJson("real-promotion-readiness.json", { ...makeAcceptedReadinessResult(), scoreSource: "real" });
  const etfPath = writeJson("etf-readiness.json", { ...makeAcceptedReadinessResult(), note: "0050 deferred scope" });
  const executablePath = writeJson("executable-readiness.json", { ...makeAcceptedReadinessResult(), boundedWriteExecutableNow: true });
  const executedPath = writeJson("executed-readiness.json", { ...makeAcceptedReadinessResult(), supabaseWriteAttempted: true });
  const missingReviewPath = writeJson("missing-review-readiness.json", { ...makeAcceptedReadinessResult(), boundedWriteExecutionReadinessReview: null });

  validateMissingRun(runNode([]));
  validateAcceptedRun(runNode(["--readiness-review", acceptedPath]));
  validateRejectedRun("blocked readiness", runNode(["--readiness-review", blockedPath]));
  validateRejectedRun("row payload readiness", runNode(["--readiness-review", rowPayloadPath]));
  validateRejectedRun("secret readiness", runNode(["--readiness-review", secretPath]));
  validateRejectedRun("real promotion readiness", runNode(["--readiness-review", realPromotionPath]));
  validateRejectedRun("etf readiness", runNode(["--readiness-review", etfPath]));
  validateRejectedRun("executable readiness", runNode(["--readiness-review", executablePath]));
  validateRejectedRun("executed readiness", runNode(["--readiness-review", executedPath]));
  validateRejectedRun("missing review readiness", runNode(["--readiness-review", missingReviewPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(JSON.stringify({
    status: ok ? "ok" : "blocked",
    guardedStatus: ok
      ? "phase_1_current_scope_bounded_write_execution_authorization_packet_no_execution_ready"
      : "phase_1_current_scope_bounded_write_execution_authorization_packet_no_execution_blocked",
    acceptedAuthorizationPacketReady: true,
    blockedReadinessRejected: true,
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
      ? "await_separate_current_scope_bounded_write_execution_authorization_response_no_execution"
      : "keep_mock_and_repair_bounded_write_execution_authorization_packet",
    problems
  }, null, 2));

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedReadinessResult() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_bounded_write_execution_readiness_review_no_execution_ready",
    boundedWriteExecutionReadinessReviewPreparedNow: true,
    boundedWriteExecutionReadinessReview: {
      reviewMode: "current_scope_bounded_write_execution_readiness_review_no_execution",
      attemptId: "phase-1-current-scope-attempt-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      operationKind: "insert_missing_daily_prices_from_sanitized_candidate_only",
      acceptedDryRunReviewRequired: true,
      aggregateOnlyEvidenceRequired: true,
      serverOnlyCredentialPresenceCheckRequired: true,
      sanitizedCandidateArtifactPathShapeCheckRequired: true,
      insertMissingOnlyContractRequired: true,
      aggregateReadbackContractRequired: true,
      rollbackOrQuarantinePlanRequired: true,
      separateOperatorAuthorizationRequired: true,
      readinessStoplines: [
        "missing_or_mismatched_attempt_id",
        "row_raw_or_stock_id_payload_present",
        "secret_or_confirmation_value_present",
        "etf_scope_present",
        "real_promotion_requested",
        "write_or_sql_already_attempted"
      ],
      requiredNextPacket: "current_scope_bounded_write_execution_authorization_packet_no_execution",
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
    nextRoute: "prepare_current_scope_bounded_write_execution_authorization_packet_no_execution",
    problems: []
  };
}

function validateMissingRun(result) {
  if (result.exitCode === 0) problems.push("missing args run should fail");
  expect(result.output.status, "blocked", "missingArgs.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_bounded_write_execution_authorization_packet_blocked_missing_inputs", "missingArgs.guardedStatus");
  expectSafeFlags(result.output, "missingArgs");
}

function validateAcceptedRun(result) {
  if (result.exitCode !== 0) problems.push("accepted bounded write authorization packet should pass");
  expect(result.output.status, "ok", "accepted.status");
  expect(result.output.guardedStatus, "phase_1_current_scope_bounded_write_execution_authorization_packet_no_execution_ready", "accepted.guardedStatus");
  expect(result.output.boundedWriteExecutionAuthorizationPacketPreparedNow, true, "accepted.boundedWriteExecutionAuthorizationPacketPreparedNow");
  expect(result.output.nextRoute, "await_separate_current_scope_bounded_write_execution_authorization_response_no_execution", "accepted.nextRoute");
  expectSafeFlags(result.output, "accepted");

  const packet = result.output.boundedWriteExecutionAuthorizationPacket;
  if (!packet || typeof packet !== "object") {
    problems.push("accepted.boundedWriteExecutionAuthorizationPacket must be an object");
    return;
  }
  expect(packet.packetMode, "current_scope_bounded_write_execution_authorization_packet_no_execution", "boundedWriteExecutionAuthorizationPacket.packetMode");
  expect(packet.attemptId, "phase-1-current-scope-attempt-example", "boundedWriteExecutionAuthorizationPacket.attemptId");
  expect(packet.phase1Universe, "twii_plus_listed_stock_daily_close", "boundedWriteExecutionAuthorizationPacket.phase1Universe");
  expect(packet.scope, "twii_plus_listed_stock_daily_close", "boundedWriteExecutionAuthorizationPacket.scope");
  expect(packet.operationKind, "insert_missing_daily_prices_from_sanitized_candidate_only", "boundedWriteExecutionAuthorizationPacket.operationKind");
  expect(packet.authorizationDecisionRequired, "APPROVE_PREPARE_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_RESPONSE", "boundedWriteExecutionAuthorizationPacket.authorizationDecisionRequired");
  expect(packet.requiredResponseMode, "current_scope_bounded_write_execution_authorization_response_no_execution", "boundedWriteExecutionAuthorizationPacket.requiredResponseMode");
  if (!Array.isArray(packet.operatorMustConfirm) || packet.operatorMustConfirm.length < 8) {
    problems.push("boundedWriteExecutionAuthorizationPacket.operatorMustConfirm must contain at least 8 items");
  }
  if (!Array.isArray(packet.explicitStoplines) || packet.explicitStoplines.length < 5) {
    problems.push("boundedWriteExecutionAuthorizationPacket.explicitStoplines must contain at least 5 items");
  }
  expectSafeFlags(packet, "boundedWriteExecutionAuthorizationPacket");
}

function validateRejectedRun(label, result) {
  if (result.exitCode === 0) problems.push(`${label} should fail`);
  expect(result.output.status, "blocked", `${label}.status`);
  expectSafeFlags(result.output, label);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [docPath, doc, [
      "phase_1_current_scope_bounded_write_execution_authorization_packet_no_execution_ready",
      "APPROVE_PREPARE_CURRENT_SCOPE_BOUNDED_WRITE_EXECUTION_RESPONSE",
      "await_separate_current_scope_bounded_write_execution_authorization_response_no_execution",
      "publicDataSource=mock",
      "scoreSource=mock"
    ]],
    [projectStatusPath, projectStatus, [
      "Latest Phase 1 Current-Scope Bounded Write Execution Authorization Packet",
      "phase_1_current_scope_bounded_write_execution_authorization_packet_no_execution_ready",
      "await_separate_current_scope_bounded_write_execution_authorization_response_no_execution"
    ]]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-bounded-write-execution-authorization-packet-once"] !==
    "node scripts/run-phase-1-current-scope-bounded-write-execution-authorization-packet-once.mjs"
  ) problems.push(`${packagePath} missing run script`);
  if (
    pkg.scripts?.["check:phase-1-current-scope-bounded-write-execution-authorization-packet-no-execution"] !==
    "node scripts/check-phase-1-current-scope-bounded-write-execution-authorization-packet-no-execution.mjs"
  ) problems.push(`${packagePath} missing check script`);
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-bounded-write-execution-authorization-packet-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing bounded write authorization packet checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-bounded-write-execution-authorization-packet-no-execution"')) {
    problems.push(`${reviewGatePath} missing bounded write authorization packet focused name`);
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
