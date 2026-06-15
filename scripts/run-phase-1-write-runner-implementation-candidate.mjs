import fs from "node:fs";
import { spawnSync } from "node:child_process";

const candidatePaths = {
  twii: "data/candidates/twii-sanitized-candidate.json",
  etf: "data/candidates/phase-1-etf-sanitized-candidate.json",
  rowPayloadCandidate:
    parseArgs(process.argv.slice(2)).candidateArtifact ??
    process.env.PHASE_1_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH ??
    null
};
const validatorPath = "scripts/validate-phase-1-sanitized-row-payload-candidate-artifact.mjs";

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
const rowPayloadCandidateValidation = candidatePaths.rowPayloadCandidate
  ? validateRowPayloadCandidate(candidatePaths.rowPayloadCandidate)
  : null;

const rowPayloadStatus = {
  twiiRowPayloadIncluded: candidates.twii.rowPayloadIncluded === true,
  etfRowPayloadIncluded: candidates.etf.rowPayloadIncluded === true,
  twiiRawPayloadIncluded: candidates.twii.rawPayloadIncluded === true,
  etfRawPayloadIncluded: candidates.etf.rawPayloadIncluded === true,
  rowPayloadCandidatePathProvided: Boolean(candidatePaths.rowPayloadCandidate),
  rowPayloadCandidateAccepted: rowPayloadCandidateValidation?.accepted === true,
  rowPayloadCandidateRowCount: rowPayloadCandidateValidation?.rowCount ?? null,
  rowPayloadCandidateSymbolsCovered: rowPayloadCandidateValidation?.symbolsCovered ?? [],
  rowPayloadCandidateSymbolCounts: rowPayloadCandidateValidation?.symbolCounts ?? null,
  rowPayloadCandidateDateBounds: rowPayloadCandidateValidation?.dateBounds ?? null,
  rowPayloadCandidateDuplicateCount: rowPayloadCandidateValidation?.duplicateCount ?? null,
  rowPayloadCandidateMissingRequiredFieldCount: rowPayloadCandidateValidation?.missingRequiredFieldCount ?? null,
  rowPayloadCandidateForbiddenFieldCount: rowPayloadCandidateValidation?.forbiddenFieldCount ?? null,
  rowPayloadCandidateInvalidTradeDateCount: rowPayloadCandidateValidation?.invalidTradeDateCount ?? null,
  rowPayloadCandidateInvalidSourceMetadataCount:
    rowPayloadCandidateValidation?.invalidSourceMetadataCount ?? null,
  rowPayloadCandidateInvalidOptionalNumberCount:
    rowPayloadCandidateValidation?.invalidOptionalNumberCount ?? null
};

validateAggregateShape();

const rowPayloadsReady =
  rowPayloadStatus.rowPayloadCandidateAccepted ||
  (rowPayloadStatus.twiiRowPayloadIncluded && rowPayloadStatus.etfRowPayloadIncluded);
if (!rowPayloadsReady) {
  problems.push(
    candidatePaths.rowPayloadCandidate
      ? "candidate_row_payload_artifact_invalid"
      : "candidate_row_payloads_missing"
  );
}

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
  rowPayloadCandidateValidationStatus: rowPayloadCandidateValidation?.status ?? null,
  rowPayloadCandidateValidationProblems: rowPayloadCandidateValidation?.problems ?? [],
  blockedReasons: problems,
  nextRoute: problems.includes("candidate_row_payloads_missing")
    ? "provide_sanitized_row_payload_candidate_artifacts_or_keep_data_online_no_go"
    : problems.includes("candidate_row_payload_artifact_invalid")
      ? "provide_valid_sanitized_row_payload_candidate_artifact_or_keep_data_online_no_go"
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

function validateRowPayloadCandidate(filePath) {
  const run = spawnSync(process.execPath, [validatorPath, "--candidate-artifact", filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    return {
      status: "phase_1_sanitized_row_payload_candidate_artifact_blocked",
      accepted: false,
      rowCount: null,
      symbolsCovered: [],
      dateBounds: null,
      duplicateCount: null,
      missingRequiredFieldCount: null,
      forbiddenFieldCount: null,
      invalidTradeDateCount: null,
      invalidSourceMetadataCount: null,
      invalidOptionalNumberCount: null,
      problems: [`candidate_artifact_validator_unreadable:${error.message}`]
    };
  }
}

function parseArgs(tokens) {
  const parsed = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const next = tokens[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }
    parsed[key] = next;
    index += 1;
  }
  return parsed;
}
