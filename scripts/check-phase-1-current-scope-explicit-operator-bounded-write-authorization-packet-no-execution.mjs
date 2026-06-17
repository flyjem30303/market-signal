import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const packetPath = "scripts/run-phase-1-current-scope-explicit-operator-bounded-write-authorization-packet-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_EXPLICIT_OPERATOR_BOUNDED_WRITE_AUTHORIZATION_PACKET_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const packetSource = read(packetPath);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-operator-packet-"));
try {
  const acceptedPreflightPath = path.join(tempDir, "accepted-preflight.json");
  const blockedPreflightPath = path.join(tempDir, "blocked-preflight.json");
  const rowPayloadPreflightPath = path.join(tempDir, "row-payload-preflight.json");
  const realPromotionPreflightPath = path.join(tempDir, "real-promotion-preflight.json");
  const etfScopePreflightPath = path.join(tempDir, "etf-scope-preflight.json");

  fs.writeFileSync(acceptedPreflightPath, JSON.stringify(makeAcceptedPreflight(), null, 2), "utf8");
  fs.writeFileSync(blockedPreflightPath, JSON.stringify(makeBlockedPreflight(), null, 2), "utf8");
  fs.writeFileSync(rowPayloadPreflightPath, JSON.stringify({ ...makeAcceptedPreflight(), rows: [] }, null, 2), "utf8");
  fs.writeFileSync(realPromotionPreflightPath, JSON.stringify({ ...makeAcceptedPreflight(), publicDataSource: "NOT_MOCK" }, null, 2), "utf8");
  fs.writeFileSync(etfScopePreflightPath, JSON.stringify({ ...makeAcceptedPreflight(), scope: "twii_plus_0050_006208_daily_close" }, null, 2), "utf8");

  validateMissingRun(runNode(packetPath, []));
  validateAcceptedRun(runNode(packetPath, ["--preflight-result", acceptedPreflightPath]));
  validateRejectedRun("blocked preflight", runNode(packetPath, ["--preflight-result", blockedPreflightPath]));
  validateRejectedRun("row payload preflight", runNode(packetPath, ["--preflight-result", rowPayloadPreflightPath]));
  validateRejectedRun("real promotion preflight", runNode(packetPath, ["--preflight-result", realPromotionPreflightPath]));
  validateRejectedRun("etf scope preflight", runNode(packetPath, ["--preflight-result", etfScopePreflightPath]));

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(
    JSON.stringify(
      {
        status: ok ? "ok" : "blocked",
        guardedStatus: ok
          ? "phase_1_current_scope_explicit_operator_bounded_write_authorization_packet_no_execution_ready"
          : "phase_1_current_scope_explicit_operator_bounded_write_authorization_packet_no_execution_blocked",
        acceptedPacketReady: true,
        blockedPreflightRejected: true,
        rowPayloadRejected: true,
        realPromotionRejected: true,
        etfScopeRejected: true,
        operatorAuthorizationPacketPreparedNow: true,
        operatorAuthorizationAcceptedNow: false,
        boundedWriteExecutableNow: false,
        candidateRowsAcceptedNow: false,
        writeGateOpenedNow: false,
        sqlExecuted: false,
        supabaseWriteAttempted: false,
        dailyPricesMutated: false,
        publicDataSource: "mock",
        scoreSource: "mock",
        nextRoute: ok ? "await_explicit_operator_bounded_write_authorization_response_no_execution" : "keep_mock_and_repair_operator_packet",
        problems
      },
      null,
      2
    )
  );

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeAcceptedPreflight() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_candidate_artifact_bounded_write_authorization_preflight_ready_no_execution",
    preflightPreparedNow: true,
    artifactId: "phase-1-current-scope-sanitized-candidate-example",
    phase1Universe: "twii_plus_listed_stock_daily_close",
    scope: "twii_plus_listed_stock_daily_close",
    operatorAuthorizationRequired: true,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    preflightPacket: {
      packetMode: "bounded_write_authorization_preflight_shape_no_execution",
      artifactId: "phase-1-current-scope-sanitized-candidate-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      requiredFutureInputs: [
        "explicit_operator_authorization_decision",
        "bounded_write_attempt_id",
        "candidate_artifact_path_reference",
        "no_secret_runtime_environment_presence",
        "rollback_scope_confirmation",
        "post_run_review_owner"
      ],
      stopConditions: [
        "missing_explicit_operator_authorization",
        "candidate_artifact_contains_row_or_raw_payload",
        "candidate_artifact_scope_mismatch",
        "duplicate_or_rejected_or_missing_required_field_count_above_zero",
        "readback_or_rollback_requirement_missing",
        "public_runtime_promotion_requested_in_same_step"
      ],
      rollbackReadbackRequirements: [
        "aggregate_readback_required_after_any_future_attempt",
        "rollback_or_quarantine_decision_required_after_any_future_attempt",
        "daily_prices_mutation_summary_required_after_any_future_attempt"
      ],
      postRunReviewRequirements: [
        "attempt_summary_no_secret",
        "aggregate_counts_only",
        "public_runtime_source_stays_mock_until_separate_promotion_gate",
        "score_source_stays_mock_until_separate_promotion_gate"
      ],
      operatorAuthorizationRequired: true,
      boundedWriteExecutableNow: false,
      candidateRowsAcceptedNow: false,
      writeGateOpenedNow: false,
      sqlExecuted: false,
      supabaseWriteAttempted: false,
      dailyPricesMutated: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    nextRoute: "prepare_explicit_operator_bounded_write_authorization_packet_no_execution",
    problems: []
  };
}

function makeBlockedPreflight() {
  return {
    ...makeAcceptedPreflight(),
    status: "blocked",
    guardedStatus: "phase_1_current_scope_candidate_artifact_bounded_write_authorization_preflight_blocked_no_execution",
    preflightPreparedNow: false,
    nextRoute: "keep_mock_and_request_pm_acceptance_record_repair",
    problems: ["synthetic blocked preflight for operator packet branch proof"]
  };
}

function validateMissingRun(run) {
  expect(run.exitCode, 1, "missing.exitCode");
  expect(run.output.status, "blocked", "missing.status");
  expect(run.output.operatorAuthorizationPacketPreparedNow, false, "missing.operatorAuthorizationPacketPreparedNow");
  expect(run.output.operatorAuthorizationAcceptedNow, false, "missing.operatorAuthorizationAcceptedNow");
  expect(run.output.boundedWriteExecutableNow, false, "missing.boundedWriteExecutableNow");
}

function validateAcceptedRun(run) {
  expect(run.exitCode, 0, "accepted.exitCode");
  expect(run.output.status, "ok", "accepted.status");
  expect(
    run.output.guardedStatus,
    "phase_1_current_scope_explicit_operator_bounded_write_authorization_packet_ready_no_execution",
    "accepted.guardedStatus"
  );
  expect(run.output.operatorAuthorizationPacketPreparedNow, true, "accepted.operatorAuthorizationPacketPreparedNow");
  expect(run.output.operatorAuthorizationAcceptedNow, false, "accepted.operatorAuthorizationAcceptedNow");
  expect(run.output.boundedWriteExecutableNow, false, "accepted.boundedWriteExecutableNow");
  expect(run.output.candidateRowsAcceptedNow, false, "accepted.candidateRowsAcceptedNow");
  expect(run.output.writeGateOpenedNow, false, "accepted.writeGateOpenedNow");
  expect(run.output.sqlExecuted, false, "accepted.sqlExecuted");
  expect(run.output.supabaseWriteAttempted, false, "accepted.supabaseWriteAttempted");
  expect(run.output.dailyPricesMutated, false, "accepted.dailyPricesMutated");
  expect(run.output.publicDataSource, "mock", "accepted.publicDataSource");
  expect(run.output.scoreSource, "mock", "accepted.scoreSource");
  const packet = run.output.authorizationPacket;
  expect(packet?.envValuesReadNow, false, "accepted.authorizationPacket.envValuesReadNow");
  expect(packet?.secretValuesOutputNow, false, "accepted.authorizationPacket.secretValuesOutputNow");
  expect(packet?.confirmationPhraseValueOutputNow, false, "accepted.authorizationPacket.confirmationPhraseValueOutputNow");
  expect(packet?.operatorAuthorizationAcceptedNow, false, "accepted.authorizationPacket.operatorAuthorizationAcceptedNow");
  if (!Array.isArray(packet?.requiredFutureAuthorizationFields) || packet.requiredFutureAuthorizationFields.length < 7) {
    problems.push("accepted authorization packet must list requiredFutureAuthorizationFields");
  }
  for (const token of ["operatorDecision", "attemptId", "candidateArtifactPathReference", "executeSwitch", "confirmationPhrase", "rollbackScope", "postRunReviewOwner"]) {
    if (!packet?.requiredFutureAuthorizationFields?.includes(token)) problems.push(`accepted authorization packet missing ${token}`);
  }
  expect(run.output.nextRoute, "await_explicit_operator_bounded_write_authorization_response_no_execution", "accepted.nextRoute");
}

function validateRejectedRun(label, run) {
  expect(run.exitCode, 1, `${label}.exitCode`);
  expect(run.output.status, "blocked", `${label}.status`);
  expect(run.output.operatorAuthorizationAcceptedNow, false, `${label}.operatorAuthorizationAcceptedNow`);
  expect(run.output.boundedWriteExecutableNow, false, `${label}.boundedWriteExecutableNow`);
  expect(run.output.candidateRowsAcceptedNow, false, `${label}.candidateRowsAcceptedNow`);
  expect(run.output.writeGateOpenedNow, false, `${label}.writeGateOpenedNow`);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [
      docPath,
      doc,
      [
        "phase_1_current_scope_explicit_operator_bounded_write_authorization_packet_no_execution_ready",
        "run:phase-1-current-scope-explicit-operator-bounded-write-authorization-packet-once",
        "check:phase-1-current-scope-explicit-operator-bounded-write-authorization-packet-no-execution",
        "--preflight-result",
        "`operatorAuthorizationPacketPreparedNow=true`",
        "`operatorAuthorizationAcceptedNow=false`",
        "`boundedWriteExecutableNow=false`",
        "`candidateRowsAcceptedNow=false`",
        "`writeGateOpenedNow=false`",
        "`sqlExecuted=false`",
        "`supabaseWriteAttempted=false`",
        "`dailyPricesMutated=false`",
        "`envValuesReadNow=false`",
        "`secretValuesOutputNow=false`",
        "`confirmationPhraseValueOutputNow=false`",
        "`publicDataSource=mock`",
        "`scoreSource=mock`",
        "await_explicit_operator_bounded_write_authorization_response_no_execution"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Phase 1 Current-Scope Explicit Operator Bounded Write Authorization Packet",
        "phase_1_current_scope_explicit_operator_bounded_write_authorization_packet_no_execution_ready",
        "await_explicit_operator_bounded_write_authorization_response_no_execution"
      ]
    ]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-explicit-operator-bounded-write-authorization-packet-once"] !==
    "node scripts/run-phase-1-current-scope-explicit-operator-bounded-write-authorization-packet-once.mjs"
  ) {
    problems.push(`${packagePath} missing run:phase-1-current-scope-explicit-operator-bounded-write-authorization-packet-once`);
  }
  if (
    pkg.scripts?.["check:phase-1-current-scope-explicit-operator-bounded-write-authorization-packet-no-execution"] !==
    "node scripts/check-phase-1-current-scope-explicit-operator-bounded-write-authorization-packet-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-current-scope-explicit-operator-bounded-write-authorization-packet-no-execution`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-explicit-operator-bounded-write-authorization-packet-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope explicit operator packet checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-explicit-operator-bounded-write-authorization-packet-no-execution"')) {
    problems.push(`${reviewGatePath} missing current-scope explicit operator packet focused name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [packetPath, packetSource],
    [docPath, doc]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
  if (/process\.env/u.test(packetSource)) problems.push(`${packetPath} must not read process.env`);
}

function runNode(scriptPath, args) {
  const run = spawnSync(process.execPath, [scriptPath, ...args], {
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
    problems.push(`${scriptPath} ${args.join(" ")} did not emit JSON: ${error.message}`);
  }
  return { exitCode: run.status, output };
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
    /operatorAuthorizationAcceptedNow"\s*:\s*true/u,
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
