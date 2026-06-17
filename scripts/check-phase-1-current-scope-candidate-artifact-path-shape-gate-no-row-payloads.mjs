import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const replyRunnerPath = "scripts/run-phase-1-current-scope-sanitized-candidate-reply-intake-once.mjs";
const applyGatePath = "scripts/run-phase-1-current-scope-candidate-reply-apply-gate-once.mjs";
const pathGatePath = "scripts/run-phase-1-current-scope-candidate-artifact-path-shape-gate-once.mjs";
const fixturesPath = "data/evidence-intake/phase-1-current-scope-sanitized-candidate-reply-fixtures-no-row-payloads.json";
const docPath = "docs/PHASE_1_CURRENT_SCOPE_CANDIDATE_ARTIFACT_PATH_SHAPE_GATE_NO_ROW_PAYLOADS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const fixtures = parseJson(read(fixturesPath), fixturesPath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const pathGateSource = read(pathGatePath);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-path-gate-"));
try {
  const candidatePath = path.join(tempDir, "phase-1-current-scope-candidate.fixture.json");
  const nonJsonPath = path.join(tempDir, "phase-1-current-scope-candidate.fixture.txt");
  const acceptedReplyPath = path.join(tempDir, "accepted-reply.fixture.json");
  const acceptedRunnerPath = path.join(tempDir, "accepted-runner-result.fixture.json");
  const acceptedApplyPath = path.join(tempDir, "accepted-apply-result.fixture.json");
  const rejectedApplyPath = path.join(tempDir, "rejected-apply-result.fixture.json");
  const missingCandidateApplyPath = path.join(tempDir, "missing-candidate-apply-result.fixture.json");
  const nonJsonApplyPath = path.join(tempDir, "non-json-apply-result.fixture.json");

  fs.writeFileSync(candidatePath, "", "utf8");
  fs.writeFileSync(nonJsonPath, "", "utf8");
  fs.writeFileSync(acceptedReplyPath, JSON.stringify({ ...fixtures.acceptedFixture, candidateArtifactPath: candidatePath }, null, 2), "utf8");

  const acceptedRunner = runNode(replyRunnerPath, ["--reply", acceptedReplyPath]);
  fs.writeFileSync(acceptedRunnerPath, JSON.stringify(acceptedRunner.output, null, 2), "utf8");

  const acceptedApply = runNode(applyGatePath, ["--runner-result", acceptedRunnerPath]);
  fs.writeFileSync(acceptedApplyPath, JSON.stringify(acceptedApply.output, null, 2), "utf8");
  fs.writeFileSync(rejectedApplyPath, JSON.stringify(makeRejectedApplyResult(acceptedApply.output), null, 2), "utf8");
  fs.writeFileSync(
    missingCandidateApplyPath,
    JSON.stringify({ ...acceptedApply.output, candidateArtifactPath: path.join(tempDir, "missing-candidate.json") }, null, 2),
    "utf8"
  );
  fs.writeFileSync(
    nonJsonApplyPath,
    JSON.stringify({ ...acceptedApply.output, candidateArtifactPath: nonJsonPath }, null, 2),
    "utf8"
  );

  validateMissingRun(runNode(pathGatePath, []));
  validateAcceptedRun(runNode(pathGatePath, ["--apply-result", acceptedApplyPath]));
  validateRejectedRun("rejected apply result", runNode(pathGatePath, ["--apply-result", rejectedApplyPath]));
  validateRejectedRun("missing candidate artifact", runNode(pathGatePath, ["--apply-result", missingCandidateApplyPath]));
  validateRejectedRun("non-json candidate artifact", runNode(pathGatePath, ["--apply-result", nonJsonApplyPath]));
  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(
    JSON.stringify(
      {
        status: ok ? "ok" : "blocked",
        guardedStatus: ok
          ? "phase_1_current_scope_candidate_artifact_path_shape_gate_no_row_payloads_ready"
          : "phase_1_current_scope_candidate_artifact_path_shape_gate_no_row_payloads_blocked",
        acceptedPathReady: true,
        missingPathRejected: true,
        nonJsonPathRejected: true,
        candidateArtifactReadNow: false,
        candidateRowsAcceptedNow: false,
        writeGateOpenedNow: false,
        publicDataSource: "mock",
        scoreSource: "mock",
        nextRoute: ok ? "prepare_candidate_artifact_header_contract_no_row_payloads" : "keep_mock_and_repair_path_gate",
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

function makeRejectedApplyResult(result) {
  return {
    ...result,
    status: "blocked",
    guardedStatus: "phase_1_current_scope_candidate_reply_apply_gate_rejected_no_execution",
    replyApplyAcceptedNow: false,
    candidateArtifactPathShapeAcceptedNow: false,
    candidateArtifactPath: null,
    nextRoute: "keep_mock_and_request_repair",
    problems: ["synthetic rejected apply result for path-gate branch proof"]
  };
}

function validateMissingRun(run) {
  expect(run.exitCode, 1, "missing.exitCode");
  expect(run.output.status, "blocked", "missing.status");
  expect(run.output.candidateArtifactPathShapeReadyNow, false, "missing.candidateArtifactPathShapeReadyNow");
  expect(run.output.candidateArtifactReadNow, false, "missing.candidateArtifactReadNow");
  expect(run.output.writeGateOpenedNow, false, "missing.writeGateOpenedNow");
}

function validateAcceptedRun(run) {
  expect(run.exitCode, 0, "accepted.exitCode");
  expect(run.output.status, "ok", "accepted.status");
  expect(run.output.guardedStatus, "phase_1_current_scope_candidate_artifact_path_shape_gate_ready_no_row_payloads", "accepted.guardedStatus");
  expect(run.output.candidateArtifactPathShapeReadyNow, true, "accepted.candidateArtifactPathShapeReadyNow");
  expect(run.output.candidateArtifactExistsNow, true, "accepted.candidateArtifactExistsNow");
  expect(run.output.candidateArtifactReadNow, false, "accepted.candidateArtifactReadNow");
  expect(run.output.candidateRowsAcceptedNow, false, "accepted.candidateRowsAcceptedNow");
  expect(run.output.writeGateOpenedNow, false, "accepted.writeGateOpenedNow");
  expect(run.output.publicDataSource, "mock", "accepted.publicDataSource");
  expect(run.output.scoreSource, "mock", "accepted.scoreSource");
  expect(run.output.nextRoute, "prepare_candidate_artifact_header_contract_no_row_payloads", "accepted.nextRoute");
}

function validateRejectedRun(label, run) {
  expect(run.exitCode, 1, `${label}.exitCode`);
  expect(run.output.status, "blocked", `${label}.status`);
  expect(run.output.candidateArtifactReadNow, false, `${label}.candidateArtifactReadNow`);
  expect(run.output.candidateRowsAcceptedNow, false, `${label}.candidateRowsAcceptedNow`);
  expect(run.output.writeGateOpenedNow, false, `${label}.writeGateOpenedNow`);
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [
      docPath,
      doc,
      [
        "phase_1_current_scope_candidate_artifact_path_shape_gate_no_row_payloads_ready",
        "run:phase-1-current-scope-candidate-artifact-path-shape-gate-once",
        "check:phase-1-current-scope-candidate-artifact-path-shape-gate-no-row-payloads",
        "--apply-result",
        "Only the apply result JSON is read.",
        "The candidate artifact file is checked with metadata only.",
        "The candidate artifact file is not read.",
        "`candidateArtifactReadNow=false`",
        "`candidateRowsAcceptedNow=false`",
        "`writeGateOpenedNow=false`",
        "`publicDataSource=mock`",
        "`scoreSource=mock`",
        "prepare_candidate_artifact_header_contract_no_row_payloads"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Phase 1 Current-Scope Candidate Artifact Path Shape Gate",
        "phase_1_current_scope_candidate_artifact_path_shape_gate_no_row_payloads_ready",
        "prepare_candidate_artifact_header_contract_no_row_payloads"
      ]
    ]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-candidate-artifact-path-shape-gate-once"] !==
    "node scripts/run-phase-1-current-scope-candidate-artifact-path-shape-gate-once.mjs"
  ) {
    problems.push(`${packagePath} missing run:phase-1-current-scope-candidate-artifact-path-shape-gate-once`);
  }
  if (
    pkg.scripts?.["check:phase-1-current-scope-candidate-artifact-path-shape-gate-no-row-payloads"] !==
    "node scripts/check-phase-1-current-scope-candidate-artifact-path-shape-gate-no-row-payloads.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-current-scope-candidate-artifact-path-shape-gate-no-row-payloads`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-candidate-artifact-path-shape-gate-no-row-payloads.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope candidate artifact path shape checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-candidate-artifact-path-shape-gate-no-row-payloads"')) {
    problems.push(`${reviewGatePath} missing current-scope candidate artifact path shape focused name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [pathGatePath, pathGateSource],
    [docPath, doc]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
  if (!pathGateSource.includes("fs.statSync")) problems.push(`${pathGatePath} should use fs.statSync for metadata-only path check`);
  if (/readFileSync\((?!filePath)/u.test(pathGateSource)) {
    problems.push(`${pathGatePath} must not read candidate artifact content`);
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
