import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const replyRunnerPath = "scripts/run-phase-1-current-scope-sanitized-candidate-reply-intake-once.mjs";
const applyGatePath = "scripts/run-phase-1-current-scope-candidate-reply-apply-gate-once.mjs";
const fixturesPath = "data/evidence-intake/phase-1-current-scope-sanitized-candidate-reply-fixtures-no-row-payloads.json";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_CANDIDATE_REPLY_APPLY_GATE_NO_EXECUTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const fixtures = parseJson(read(fixturesPath), fixturesPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const applyGateSource = read(applyGatePath);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-apply-gate-"));
try {
  const acceptedReplyPath = path.join(tempDir, "accepted-reply.fixture.json");
  const acceptedRunnerPath = path.join(tempDir, "accepted-runner-result.fixture.json");
  const rejectedRunnerPath = path.join(tempDir, "rejected-runner-result.fixture.json");
  fs.writeFileSync(acceptedReplyPath, JSON.stringify(fixtures.acceptedFixture, null, 2), "utf8");

  const acceptedRunner = runNode(replyRunnerPath, ["--reply", acceptedReplyPath]);
  fs.writeFileSync(acceptedRunnerPath, JSON.stringify(acceptedRunner.output, null, 2), "utf8");
  fs.writeFileSync(rejectedRunnerPath, JSON.stringify(makeRejectedRunnerResult(acceptedRunner.output), null, 2), "utf8");

  const missingRun = runNode(applyGatePath, []);
  const acceptedApply = runNode(applyGatePath, ["--runner-result", acceptedRunnerPath]);
  const rejectedApply = runNode(applyGatePath, ["--runner-result", rejectedRunnerPath]);

  validateMissingRun(missingRun);
  validateAcceptedApply(acceptedApply);
  validateRejectedApply(rejectedApply);
  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(
    JSON.stringify(
      {
        status: ok ? "ok" : "blocked",
        guardedStatus: ok
          ? "phase_1_current_scope_candidate_reply_apply_gate_no_execution_ready"
          : "phase_1_current_scope_candidate_reply_apply_gate_no_execution_blocked",
        missingRunnerResultFailsClosed: missingRun.output.status === "blocked",
        acceptedRunnerResultApplied: acceptedApply.output.replyApplyAcceptedNow === true,
        rejectedRunnerResultRejected: rejectedApply.output.replyApplyAcceptedNow === false,
        candidateArtifactReadNow: false,
        candidateRowsAcceptedNow: false,
        writeGateOpenedNow: false,
        publicDataSource: "mock",
        scoreSource: "mock",
        nextRoute: ok ? "prepare_candidate_artifact_path_existence_and_shape_gate_no_row_payloads" : "keep_mock_and_repair_apply_gate",
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

function makeRejectedRunnerResult(result) {
  return {
    ...result,
    status: "blocked",
    guardedStatus: "phase_1_current_scope_sanitized_candidate_reply_intake_rejected_no_row_payloads",
    replyAcceptedNow: false,
    candidateArtifactPathAcceptedNow: false,
    candidateArtifactPath: null,
    nextRoute: "keep_mock_and_request_repair",
    problems: ["synthetic rejected runner result for apply-gate branch proof"]
  };
}

function validateMissingRun(run) {
  expect(run.exitCode, 1, "missing.exitCode");
  expect(run.output.status, "blocked", "missing.status");
  expect(run.output.replyApplyAcceptedNow, false, "missing.replyApplyAcceptedNow");
  expect(run.output.candidateArtifactReadNow, false, "missing.candidateArtifactReadNow");
  expect(run.output.writeGateOpenedNow, false, "missing.writeGateOpenedNow");
}

function validateAcceptedApply(run) {
  expect(run.exitCode, 0, "accepted.exitCode");
  expect(run.output.status, "ok", "accepted.status");
  expect(run.output.guardedStatus, "phase_1_current_scope_candidate_reply_apply_gate_accepted_no_execution", "accepted.guardedStatus");
  expect(run.output.replyApplyAcceptedNow, true, "accepted.replyApplyAcceptedNow");
  expect(run.output.candidateArtifactPathShapeAcceptedNow, true, "accepted.candidateArtifactPathShapeAcceptedNow");
  expect(run.output.candidateArtifactReadNow, false, "accepted.candidateArtifactReadNow");
  expect(run.output.candidateRowsAcceptedNow, false, "accepted.candidateRowsAcceptedNow");
  expect(run.output.writeGateOpenedNow, false, "accepted.writeGateOpenedNow");
  expect(run.output.publicDataSource, "mock", "accepted.publicDataSource");
  expect(run.output.scoreSource, "mock", "accepted.scoreSource");
  expect(
    run.output.nextRoute,
    "prepare_candidate_artifact_path_existence_and_shape_gate_no_row_payloads",
    "accepted.nextRoute"
  );
}

function validateRejectedApply(run) {
  expect(run.exitCode, 1, "rejected.exitCode");
  expect(run.output.status, "blocked", "rejected.status");
  expect(run.output.replyApplyAcceptedNow, false, "rejected.replyApplyAcceptedNow");
  expect(run.output.candidateArtifactReadNow, false, "rejected.candidateArtifactReadNow");
  expect(run.output.writeGateOpenedNow, false, "rejected.writeGateOpenedNow");
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [
      docPath,
      doc,
      [
        "phase_1_current_scope_candidate_reply_apply_gate_no_execution_ready",
        "run:phase-1-current-scope-candidate-reply-apply-gate-once",
        "check:phase-1-current-scope-candidate-reply-apply-gate-no-execution",
        "--runner-result",
        "Only the runner result JSON is read.",
        "The reply JSON is not re-read.",
        "The candidate artifact file is not opened.",
        "`publicDataSource=mock`",
        "`scoreSource=mock`",
        "prepare_candidate_artifact_path_existence_and_shape_gate_no_row_payloads"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Phase 1 Current-Scope Candidate Reply Apply Gate",
        "phase_1_current_scope_candidate_reply_apply_gate_no_execution_ready",
        "prepare_candidate_artifact_path_existence_and_shape_gate_no_row_payloads"
      ]
    ]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-candidate-reply-apply-gate-once"] !==
    "node scripts/run-phase-1-current-scope-candidate-reply-apply-gate-once.mjs"
  ) {
    problems.push(`${packagePath} missing run:phase-1-current-scope-candidate-reply-apply-gate-once`);
  }
  if (
    pkg.scripts?.["check:phase-1-current-scope-candidate-reply-apply-gate-no-execution"] !==
    "node scripts/check-phase-1-current-scope-candidate-reply-apply-gate-no-execution.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-current-scope-candidate-reply-apply-gate-no-execution`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-candidate-reply-apply-gate-no-execution.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope reply apply gate checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-candidate-reply-apply-gate-no-execution"')) {
    problems.push(`${reviewGatePath} missing current-scope reply apply gate focused name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [applyGatePath, applyGateSource],
    [docPath, doc]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
  if (applyGateSource.includes("replyPath") || applyGateSource.includes("candidateArtifactPath)")) {
    problems.push(`${applyGatePath} must not read reply JSON or candidate artifact content`);
  }
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
    /candidateArtifactReadNow"\s*:\s*true/u,
    /candidateRowsAcceptedNow"\s*:\s*true/u,
    /writeGateOpenedNow"\s*:\s*true/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
