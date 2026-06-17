import fs from "node:fs";
import path from "node:path";

const applyResultPath = getArg("--apply-result");
const problems = [];

if (!applyResultPath) {
  emit({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_candidate_artifact_path_shape_gate_blocked_missing_apply_result",
    candidateArtifactPathShapeReadyNow: false,
    candidateArtifactReadNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "provide_current_scope_reply_apply_gate_result_json",
    problems: ["--apply-result is required"]
  });
  process.exit(1);
}

const applyResult = parseJson(readApplyResult(applyResultPath), applyResultPath);
const accepted = validateApplyResult(applyResult) && validatePathShape(applyResult.candidateArtifactPath);

emit({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_candidate_artifact_path_shape_gate_ready_no_row_payloads"
    : "phase_1_current_scope_candidate_artifact_path_shape_gate_blocked_no_row_payloads",
  applyResultPath,
  candidateArtifactPathShapeReadyNow: accepted,
  candidateArtifactPath: accepted ? applyResult.candidateArtifactPath : null,
  candidateArtifactExistsNow: accepted,
  candidateArtifactReadNow: false,
  candidateRowsAcceptedNow: false,
  writeGateOpenedNow: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  nextRoute: accepted
    ? "prepare_candidate_artifact_header_contract_no_row_payloads"
    : "keep_mock_and_request_repair",
  problems
});

if (!accepted) process.exit(1);

function validateApplyResult(result) {
  expect(result.status, "ok", "applyResult.status");
  expect(result.guardedStatus, "phase_1_current_scope_candidate_reply_apply_gate_accepted_no_execution", "applyResult.guardedStatus");
  expect(result.replyApplyAcceptedNow, true, "applyResult.replyApplyAcceptedNow");
  expect(result.candidateArtifactPathShapeAcceptedNow, true, "applyResult.candidateArtifactPathShapeAcceptedNow");
  expect(result.candidateArtifactReadNow, false, "applyResult.candidateArtifactReadNow");
  expect(result.candidateRowsAcceptedNow, false, "applyResult.candidateRowsAcceptedNow");
  expect(result.writeGateOpenedNow, false, "applyResult.writeGateOpenedNow");
  expect(result.publicDataSource, "mock", "applyResult.publicDataSource");
  expect(result.scoreSource, "mock", "applyResult.scoreSource");
  if (typeof result.candidateArtifactPath !== "string" || result.candidateArtifactPath.trim() === "") {
    problems.push("applyResult.candidateArtifactPath must be a non-empty string");
  }
  return problems.length === 0;
}

function validatePathShape(candidateArtifactPath) {
  const normalizedPath = String(candidateArtifactPath ?? "").trim();
  if (!normalizedPath.toLowerCase().endsWith(".json")) {
    problems.push("candidateArtifactPath must end with .json");
    return false;
  }
  if (containsDeferredSymbols(normalizedPath)) {
    problems.push("candidateArtifactPath must not reference deferred ETF symbols");
    return false;
  }
  try {
    const stat = fs.statSync(normalizedPath);
    if (!stat.isFile()) problems.push("candidateArtifactPath must point to a file");
  } catch (error) {
    problems.push(`candidateArtifactPath must exist: ${error.message}`);
  }
  return problems.length === 0;
}

function containsDeferredSymbols(value) {
  return /\b(0050|006208)\b/u.test(value);
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function readApplyResult(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read apply result JSON: ${error.message}`);
    return "{}";
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

function emit(payload) {
  console.log(JSON.stringify(payload, null, 2));
}
