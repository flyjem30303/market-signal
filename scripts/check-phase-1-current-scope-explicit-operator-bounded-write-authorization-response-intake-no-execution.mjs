import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const intakePath = "scripts/run-phase-1-current-scope-explicit-operator-bounded-write-authorization-response-intake-once.mjs";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_EXPLICIT_OPERATOR_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_INTAKE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const intakeSource = read(intakePath);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-operator-response-intake-"));
try {
  const acceptedPacketPath = writeJson("accepted-packet.json", makeAcceptedPacketResult());
  const blockedPacketPath = writeJson("blocked-packet.json", makeBlockedPacketResult());
  const acceptedResponsePath = writeJson("accepted-response.json", makeAcceptedResponse());
  const rejectedResponsePath = writeJson("rejected-response.json", { operatorDecision: "REJECT_OR_REPAIR" });
  const missingConfirmationResponsePath = writeJson("missing-confirmation-response.json", {
    ...makeAcceptedResponse(),
    confirmationPhrasePresent: false
  });
  const secretResponsePath = writeJson("secret-response.json", {
    ...makeAcceptedResponse(),
    confirmationPhraseValue: "DO_NOT_LOG"
  });
  const rowPayloadResponsePath = writeJson("row-payload-response.json", { ...makeAcceptedResponse(), rows: [] });
  const realPromotionResponsePath = writeJson("real-promotion-response.json", { ...makeAcceptedResponse(), scoreSource: "real" });
  const etfScopeResponsePath = writeJson("etf-scope-response.json", {
    ...makeAcceptedResponse(),
    candidateArtifactPathReference: "data/candidates/0050-sanitized-candidate.json"
  });

  validateMissingRun(runNode(intakePath, []));
  validateAcceptedRun(runNode(intakePath, ["--authorization-packet", acceptedPacketPath, "--operator-response", acceptedResponsePath]));
  validateRejectedRun(
    "rejected response",
    runNode(intakePath, ["--authorization-packet", acceptedPacketPath, "--operator-response", rejectedResponsePath]),
    "phase_1_current_scope_explicit_operator_bounded_write_authorization_response_intake_rejected_or_repair_no_execution"
  );
  validateRejectedRun(
    "blocked packet",
    runNode(intakePath, ["--authorization-packet", blockedPacketPath, "--operator-response", acceptedResponsePath])
  );
  validateRejectedRun(
    "missing confirmation response",
    runNode(intakePath, ["--authorization-packet", acceptedPacketPath, "--operator-response", missingConfirmationResponsePath])
  );
  validateRejectedRun(
    "secret response",
    runNode(intakePath, ["--authorization-packet", acceptedPacketPath, "--operator-response", secretResponsePath])
  );
  validateRejectedRun(
    "row payload response",
    runNode(intakePath, ["--authorization-packet", acceptedPacketPath, "--operator-response", rowPayloadResponsePath])
  );
  validateRejectedRun(
    "real promotion response",
    runNode(intakePath, ["--authorization-packet", acceptedPacketPath, "--operator-response", realPromotionResponsePath])
  );
  validateRejectedRun(
    "etf scope response",
    runNode(intakePath, ["--authorization-packet", acceptedPacketPath, "--operator-response", etfScopeResponsePath])
  );

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(
    JSON.stringify(
      {
        status: ok ? "ok" : "blocked",
        guardedStatus: ok
          ? "phase_1_current_scope_explicit_operator_bounded_write_authorization_response_intake_no_execution_ready"
          : "phase_1_current_scope_explicit_operator_bounded_write_authorization_response_intake_no_execution_blocked",
        acceptedResponseRecorded: true,
        rejectedOrRepairResponseRecorded: true,
        blockedPacketRejected: true,
        secretResponseRejected: true,
        rowPayloadRejected: true,
        realPromotionRejected: true,
        etfScopeRejected: true,
        operatorAuthorizationAcceptedNow: true,
        boundedWriteExecutableNow: false,
        candidateRowsAcceptedNow: false,
        writeGateOpenedNow: false,
        sqlExecuted: false,
        supabaseWriteAttempted: false,
        dailyPricesMutated: false,
        publicDataSource: "mock",
        scoreSource: "mock",
        nextRoute: ok ? "prepare_current_scope_bounded_write_execution_decision_gate_no_execution" : "keep_mock_and_repair_operator_response_intake",
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

function makeAcceptedPacketResult() {
  return {
    status: "ok",
    guardedStatus: "phase_1_current_scope_explicit_operator_bounded_write_authorization_packet_ready_no_execution",
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
    authorizationPacket: {
      packetMode: "explicit_operator_bounded_write_authorization_packet_no_execution",
      sourcePreflightStatus: "phase_1_current_scope_candidate_artifact_bounded_write_authorization_preflight_ready_no_execution",
      artifactId: "phase-1-current-scope-sanitized-candidate-example",
      phase1Universe: "twii_plus_listed_stock_daily_close",
      scope: "twii_plus_listed_stock_daily_close",
      requiredFutureAuthorizationFields: [
        "operatorDecision",
        "attemptId",
        "candidateArtifactPathReference",
        "executeSwitch",
        "confirmationPhrase",
        "rollbackScope",
        "postRunReviewOwner"
      ],
      acceptedFutureDecisionValue: "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT",
      rejectedFutureDecisionValue: "REJECT_OR_REPAIR",
      envValuesReadNow: false,
      secretValuesOutputNow: false,
      confirmationPhraseValueOutputNow: false,
      operatorAuthorizationAcceptedNow: false,
      boundedWriteExecutableNow: false,
      candidateRowsAcceptedNow: false,
      writeGateOpenedNow: false,
      sqlExecuted: false,
      supabaseWriteAttempted: false,
      dailyPricesMutated: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    nextRoute: "await_explicit_operator_bounded_write_authorization_response_no_execution",
    problems: []
  };
}

function makeBlockedPacketResult() {
  return {
    ...makeAcceptedPacketResult(),
    status: "blocked",
    guardedStatus: "phase_1_current_scope_explicit_operator_bounded_write_authorization_packet_blocked_no_execution",
    operatorAuthorizationPacketPreparedNow: false,
    nextRoute: "keep_mock_and_request_bounded_write_preflight_repair",
    problems: ["synthetic blocked packet for response intake branch proof"]
  };
}

function makeAcceptedResponse() {
  return {
    operatorDecision: "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT",
    attemptId: "phase-1-current-scope-operator-response-example",
    candidateArtifactPathReference: "data/candidates/phase-1-current-scope-sanitized-candidate.json",
    executeSwitchPresent: true,
    confirmationPhrasePresent: true,
    rollbackScope: "current_scope_candidate_artifact_only",
    postRunReviewOwner: "PM"
  };
}

function validateMissingRun(run) {
  expect(run.exitCode, 1, "missing.exitCode");
  expect(run.output.status, "blocked", "missing.status");
  expect(run.output.operatorAuthorizationAcceptedNow, false, "missing.operatorAuthorizationAcceptedNow");
  expect(run.output.boundedWriteExecutableNow, false, "missing.boundedWriteExecutableNow");
}

function validateAcceptedRun(run) {
  expect(run.exitCode, 0, "accepted.exitCode");
  expect(run.output.status, "ok", "accepted.status");
  expect(
    run.output.guardedStatus,
    "phase_1_current_scope_explicit_operator_bounded_write_authorization_response_intake_accepted_no_execution",
    "accepted.guardedStatus"
  );
  expect(run.output.operatorAuthorizationResponseAcceptedNow, true, "accepted.operatorAuthorizationResponseAcceptedNow");
  expect(run.output.operatorAuthorizationAcceptedNow, true, "accepted.operatorAuthorizationAcceptedNow");
  expect(run.output.acceptedDecisionRecordedNow, true, "accepted.acceptedDecisionRecordedNow");
  expect(run.output.rejectedOrRepairDecisionRecordedNow, false, "accepted.rejectedOrRepairDecisionRecordedNow");
  expect(run.output.candidateArtifactPathReferencePresent, true, "accepted.candidateArtifactPathReferencePresent");
  expect(run.output.executeSwitchPresent, true, "accepted.executeSwitchPresent");
  expect(run.output.confirmationPhrasePresent, true, "accepted.confirmationPhrasePresent");
  expect(run.output.rollbackScopePresent, true, "accepted.rollbackScopePresent");
  expect(run.output.envValuesReadNow, false, "accepted.envValuesReadNow");
  expect(run.output.secretValuesOutputNow, false, "accepted.secretValuesOutputNow");
  expect(run.output.confirmationPhraseValueOutputNow, false, "accepted.confirmationPhraseValueOutputNow");
  expect(run.output.boundedWriteExecutableNow, false, "accepted.boundedWriteExecutableNow");
  expect(run.output.candidateRowsAcceptedNow, false, "accepted.candidateRowsAcceptedNow");
  expect(run.output.writeGateOpenedNow, false, "accepted.writeGateOpenedNow");
  expect(run.output.sqlExecuted, false, "accepted.sqlExecuted");
  expect(run.output.supabaseWriteAttempted, false, "accepted.supabaseWriteAttempted");
  expect(run.output.dailyPricesMutated, false, "accepted.dailyPricesMutated");
  expect(run.output.publicDataSource, "mock", "accepted.publicDataSource");
  expect(run.output.scoreSource, "mock", "accepted.scoreSource");
  expect(run.output.nextRoute, "prepare_current_scope_bounded_write_execution_decision_gate_no_execution", "accepted.nextRoute");
  if (JSON.stringify(run.output).includes("phase-1-current-scope-sanitized-candidate.json")) {
    problems.push("accepted output must not echo candidateArtifactPathReference value");
  }
}

function validateRejectedRun(label, run, expectedGuardedStatus = null) {
  expect(run.exitCode, 1, `${label}.exitCode`);
  expect(run.output.status, "blocked", `${label}.status`);
  if (expectedGuardedStatus) expect(run.output.guardedStatus, expectedGuardedStatus, `${label}.guardedStatus`);
  expect(run.output.boundedWriteExecutableNow, false, `${label}.boundedWriteExecutableNow`);
  expect(run.output.candidateRowsAcceptedNow, false, `${label}.candidateRowsAcceptedNow`);
  expect(run.output.writeGateOpenedNow, false, `${label}.writeGateOpenedNow`);
  expect(run.output.sqlExecuted, false, `${label}.sqlExecuted`);
  expect(run.output.supabaseWriteAttempted, false, `${label}.supabaseWriteAttempted`);
  expect(run.output.dailyPricesMutated, false, `${label}.dailyPricesMutated`);
  expect(run.output.publicDataSource, "mock", `${label}.publicDataSource`);
  expect(run.output.scoreSource, "mock", `${label}.scoreSource`);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [
      docPath,
      doc,
      [
        "phase_1_current_scope_explicit_operator_bounded_write_authorization_response_intake_no_execution_ready",
        "run:phase-1-current-scope-explicit-operator-bounded-write-authorization-response-intake-once",
        "check:phase-1-current-scope-explicit-operator-bounded-write-authorization-response-intake-no-execution",
        "--authorization-packet",
        "--operator-response",
        "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT",
        "REJECT_OR_REPAIR",
        "`operatorDecision`",
        "`attemptId`",
        "`candidateArtifactPathReference`",
        "`executeSwitchPresent`",
        "`confirmationPhrasePresent`",
        "`rollbackScope`",
        "`postRunReviewOwner`",
        "`operatorAuthorizationAcceptedNow=true`",
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
        "prepare_current_scope_bounded_write_execution_decision_gate_no_execution"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Phase 1 Current-Scope Explicit Operator Bounded Write Authorization Response Intake",
        "phase_1_current_scope_explicit_operator_bounded_write_authorization_response_intake_no_execution_ready",
        "prepare_current_scope_bounded_write_execution_decision_gate_no_execution"
      ]
    ]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-explicit-operator-bounded-write-authorization-response-intake-once"] !==
    "node scripts/run-phase-1-current-scope-explicit-operator-bounded-write-authorization-response-intake-once.mjs"
  ) {
    problems.push(`${packagePath} missing run:phase-1-current-scope-explicit-operator-bounded-write-authorization-response-intake-once`);
  }
  if (
    pkg.scripts?.["check:phase-1-current-scope-explicit-operator-bounded-write-authorization-response-intake-no-execution"] !==
    "node scripts/check-phase-1-current-scope-explicit-operator-bounded-write-authorization-response-intake-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-current-scope-explicit-operator-bounded-write-authorization-response-intake-no-execution`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-explicit-operator-bounded-write-authorization-response-intake-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope explicit operator response intake checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-explicit-operator-bounded-write-authorization-response-intake-no-execution"')) {
    problems.push(`${reviewGatePath} missing current-scope explicit operator response intake focused name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [intakePath, intakeSource],
    [docPath, doc]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
  if (/process\.env/u.test(intakeSource)) problems.push(`${intakePath} must not read process.env`);
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
