import fs from "node:fs";

const pmRecordPath = getArg("--pm-record");
const problems = [];

if (!pmRecordPath) {
  emit({
    status: "blocked",
    guardedStatus: "phase_1_current_scope_candidate_artifact_bounded_write_authorization_preflight_blocked_missing_pm_record",
    operatorAuthorizationRequired: true,
    boundedWriteExecutableNow: false,
    candidateRowsAcceptedNow: false,
    writeGateOpenedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "provide_aggregate_pm_acceptance_record",
    problems: ["--pm-record is required"]
  });
  process.exit(1);
}

const pmRecord = parseJson(readFile(pmRecordPath, "PM acceptance record JSON"), pmRecordPath);
const accepted = problems.length === 0 && validatePmRecord(pmRecord);

emit({
  status: accepted ? "ok" : "blocked",
  guardedStatus: accepted
    ? "phase_1_current_scope_candidate_artifact_bounded_write_authorization_preflight_ready_no_execution"
    : "phase_1_current_scope_candidate_artifact_bounded_write_authorization_preflight_blocked_no_execution",
  pmRecordPath,
  preflightPreparedNow: accepted,
  artifactId: accepted ? pmRecord.artifactId : null,
  phase1Universe: accepted ? pmRecord.phase1Universe : null,
  scope: accepted ? pmRecord.scope : null,
  operatorAuthorizationRequired: true,
  boundedWriteExecutableNow: false,
  candidateRowsAcceptedNow: false,
  writeGateOpenedNow: false,
  sqlExecuted: false,
  supabaseWriteAttempted: false,
  dailyPricesMutated: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  preflightPacket: accepted ? makePreflightPacket(pmRecord) : null,
  nextRoute: accepted
    ? "prepare_explicit_operator_bounded_write_authorization_packet_no_execution"
    : "keep_mock_and_request_pm_acceptance_record_repair",
  problems
});

if (!accepted) process.exit(1);

function validatePmRecord(record) {
  expect(record.status, "ok", "pmRecord.status");
  expect(
    record.guardedStatus,
    "phase_1_current_scope_candidate_artifact_aggregate_pm_acceptance_record_accepted_no_rows",
    "pmRecord.guardedStatus"
  );
  expect(record.pmDecision, "accepted", "pmRecord.pmDecision");
  expect(record.pmAcceptanceRecordedNow, true, "pmRecord.pmAcceptanceRecordedNow");
  expect(record.phase1Universe, "twii_plus_listed_stock_daily_close", "pmRecord.phase1Universe");
  expect(record.scope, "twii_plus_listed_stock_daily_close", "pmRecord.scope");
  expect(record.candidateArtifactContentOutputNow, false, "pmRecord.candidateArtifactContentOutputNow");
  expect(record.candidateRowsAcceptedNow, false, "pmRecord.candidateRowsAcceptedNow");
  expect(record.writeGateOpenedNow, false, "pmRecord.writeGateOpenedNow");
  expect(record.publicDataSource, "mock", "pmRecord.publicDataSource");
  expect(record.scoreSource, "mock", "pmRecord.scoreSource");

  for (const [field, value] of [
    ["coverageWindowSessions", record.coverageWindowSessions],
    ["aggregateRowCount", record.aggregateRowCount],
    ["symbolsCoveredCount", record.symbolsCoveredCount]
  ]) {
    if (!Number.isFinite(value) || value <= 0) problems.push(`pmRecord.${field} must be a positive number`);
  }
  if (Number.isFinite(record.aggregateRowCount) && Number.isFinite(record.symbolsCoveredCount)) {
    if (record.aggregateRowCount < record.symbolsCoveredCount) {
      problems.push("pmRecord.aggregateRowCount must be greater than or equal to pmRecord.symbolsCoveredCount");
    }
  }

  if (!record.dateBounds || typeof record.dateBounds !== "object") {
    problems.push("pmRecord.dateBounds must be an object");
  } else {
    for (const field of ["start", "end"]) {
      const value = record.dateBounds[field];
      if (typeof value !== "string" || value.trim() === "" || value === "EXAMPLE_ONLY") {
        problems.push(`pmRecord.dateBounds.${field} must be present and not EXAMPLE_ONLY`);
      }
    }
  }

  if (containsForbiddenPayloadKeys(record)) problems.push("PM record must not include row/raw/stock-id payload fields");
  if (containsDeferredSymbols(record)) problems.push("deferred ETF symbols must not be part of current-scope PM record");
  return problems.length === 0;
}

function makePreflightPacket(record) {
  return {
    packetMode: "bounded_write_authorization_preflight_shape_no_execution",
    artifactId: record.artifactId,
    phase1Universe: record.phase1Universe,
    scope: record.scope,
    aggregateSummary: {
      coverageWindowSessions: record.coverageWindowSessions,
      aggregateRowCount: record.aggregateRowCount,
      symbolsCoveredCount: record.symbolsCoveredCount,
      dateBounds: record.dateBounds
    },
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
  };
}

function containsDeferredSymbols(value) {
  if (typeof value === "string") return /\b(0050|006208)\b/u.test(value);
  if (Array.isArray(value)) return value.some(containsDeferredSymbols);
  if (value && typeof value === "object") return Object.values(value).some(containsDeferredSymbols);
  return false;
}

function containsForbiddenPayloadKeys(value) {
  if (!value || typeof value !== "object") return false;
  for (const key of Object.keys(value)) {
    if (/^(rows|raw|payload|rawPayload|rowPayload|stockIds|stockIdPayload|secrets|secret)$/iu.test(key)) return true;
  }
  return Object.values(value).some(containsForbiddenPayloadKeys);
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

function readFile(filePath, label) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${label}: ${error.message}`);
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
