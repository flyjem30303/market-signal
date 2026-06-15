import fs from "node:fs";

const candidatePaths = {
  twii: "data/candidates/twii-sanitized-candidate.json",
  etf: "data/candidates/phase-1-etf-sanitized-candidate.json"
};

const expected = {
  fullLevel1MissingRows: 178,
  twiiMissingRows: 60,
  etfMissingRows: 118
};

const problems = [];
const candidates = {
  twii: readJson(candidatePaths.twii),
  etf: readJson(candidatePaths.etf)
};

const rowPayloadStatus = {
  twiiRowPayloadIncluded: candidates.twii.rowPayloadIncluded === true,
  etfRowPayloadIncluded: candidates.etf.rowPayloadIncluded === true,
  twiiRawPayloadIncluded: candidates.twii.rawPayloadIncluded === true,
  etfRawPayloadIncluded: candidates.etf.rawPayloadIncluded === true
};

validateAggregateShape();

const rowPayloadsReady = rowPayloadStatus.twiiRowPayloadIncluded && rowPayloadStatus.etfRowPayloadIncluded;
if (!rowPayloadsReady) problems.push("candidate_row_payloads_missing");

const output = {
  status: problems.length === 0 ? "ready_for_separate_write_execution_review" : "blocked",
  runnerStatus: problems.length === 0
    ? "phase_1_write_runner_implementation_candidate_ready_for_separate_review"
    : "phase_1_write_runner_implementation_candidate_blocked_no_execution",
  outcome: problems.length === 0
    ? "candidate_artifacts_include_required_rows_but_execution_still_separate"
    : "runner_candidate_fail_closed_before_row_payload_or_write",
  runnerMode: "implementation_candidate_fail_closed_no_execution",
  boundedAttemptScope: "twii_and_etf_phase_1_missing_row_closure_only",
  targetTable: "daily_prices",
  expected,
  candidatePaths,
  rowPayloadStatus,
  blockedReasons: problems,
  nextRoute: problems.includes("candidate_row_payloads_missing")
    ? "provide_sanitized_row_payload_candidate_artifacts_or_keep_data_online_no_go"
    : "separate_operator_write_execution_review_required",
  executionAllowedNow: false,
  writeGateExecutableNow: false,
  implementationAllowedNow: false,
  sqlExecuted: false,
  supabaseClientImported: false,
  supabaseConnectionAttempted: false,
  supabaseReadAttempted: false,
  supabaseWriteAttempted: false,
  credentialValueRead: false,
  marketDataFetched: false,
  marketDataIngested: false,
  candidateRowsAccepted: false,
  dailyPricesMutated: false,
  stagingRowsCreated: false,
  rawPayloadsPrinted: false,
  rowPayloadsPrinted: false,
  secretsPrinted: false,
  publicDataSource: "mock",
  scoreSource: "mock"
};

console.log(JSON.stringify(output, null, 2));
process.exitCode = 0;

function validateAggregateShape() {
  if (candidates.twii.candidateMissingRows !== expected.twiiMissingRows) problems.push("twii_missing_row_count_mismatch");
  if (candidates.etf.candidateMissingRows !== expected.etfMissingRows) problems.push("etf_missing_row_count_mismatch");
  if (candidates.twii.sanitizedAggregateOnly !== true) problems.push("twii_not_sanitized_aggregate_only");
  if (candidates.etf.sanitizedAggregateOnly !== true) problems.push("etf_not_sanitized_aggregate_only");
  if (rowPayloadStatus.twiiRawPayloadIncluded) problems.push("twii_raw_payload_present");
  if (rowPayloadStatus.etfRawPayloadIncluded) problems.push("etf_raw_payload_present");
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`candidate_artifact_unreadable:${filePath}`);
    return {};
  }
}
