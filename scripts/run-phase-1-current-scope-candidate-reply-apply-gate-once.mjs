import fs from "node:fs";

const runnerResultPath = getArg("--runner-result");
const problems = [];

if (!runnerResultPath) {
  emit({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_candidate_reply_apply_gate_blocked_missing_runner_result",
    replyApplyAcceptedNow: false,
    candidateArtifactPathShapeAcceptedNow: false,
    candidateArtifactReadNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "provide_current_scope_reply_intake_runner_result_json",
    problems: ["--runner-result is required"]
  });
  process.exit(1);
}

const runnerResult = parseJson(read(runnerResultPath), runnerResultPath);
const accepted = validateRunnerResult(runnerResult);

emit({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_candidate_reply_apply_gate_accepted_no_execution"
    : "phase_1_current_scope_candidate_reply_apply_gate_rejected_no_execution",
  runnerResultPath,
  replyApplyAcceptedNow: accepted,
  candidateArtifactPathShapeAcceptedNow: accepted,
  candidateArtifactPath: accepted ? runnerResult.candidateArtifactPath : null,
  candidateArtifactReadNow: false,
  candidateRowsAcceptedNow: false,
  writeGateOpenedNow: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  decisionRecord: accepted
    ? "Reply shape accepted only. Candidate artifact path is not read and no row/write gate is opened."
    : "Reply shape rejected or not accepted by runner. Keep mock and request repair.",
  nextRoute: accepted
    ? "prepare_candidate_artifact_path_existence_and_shape_gate_no_row_payloads"
    : "keep_mock_and_request_repair",
  problems
});

if (!accepted) process.exit(1);

function validateRunnerResult(result) {
  expect(result.status, "ok", "runnerResult.status");
  expect(
    result.guardedStatus,
    "phase_1_current_scope_sanitized_candidate_reply_intake_accepted_no_row_payloads",
    "runnerResult.guardedStatus"
  );
  expect(result.replyAcceptedNow, true, "runnerResult.replyAcceptedNow");
  expect(result.candidateArtifactPathAcceptedNow, true, "runnerResult.candidateArtifactPathAcceptedNow");
  expect(result.candidateArtifactReadNow, false, "runnerResult.candidateArtifactReadNow");
  expect(result.candidateRowsAcceptedNow, false, "runnerResult.candidateRowsAcceptedNow");
  expect(result.publicDataSource, "mock", "runnerResult.publicDataSource");
  expect(result.scoreSource, "mock", "runnerResult.scoreSource");
  expect(
    result.nextRoute,
    "current_scope_sanitized_candidate_artifact_path_shape_ready_no_row_payloads",
    "runnerResult.nextRoute"
  );
  if (typeof result.candidateArtifactPath !== "string" || result.candidateArtifactPath.trim() === "") {
    problems.push("runnerResult.candidateArtifactPath must be a non-empty string");
  }
  if (containsDeferredSymbols(result)) problems.push("deferred ETF symbols must not be part of current-scope runner result");
  return problems.length === 0;
}

function containsDeferredSymbols(value) {
  if (typeof value === "string") return /\b(0050|006208)\b/u.test(value);
  if (Array.isArray(value)) return value.some(containsDeferredSymbols);
  if (value && typeof value === "object") return Object.values(value).some(containsDeferredSymbols);
  return false;
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read runner result JSON: ${error.message}`);
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
