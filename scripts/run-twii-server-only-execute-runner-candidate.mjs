import fs from "node:fs";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const candidatePath = "data/source-gates/twii-server-only-execute-runner-candidate.json";
const rowPayloadCandidatePath =
  args.candidateArtifact ??
  process.env.PHASE_1_TWII_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH ??
  null;
const rowPayloadValidatorPath =
  "scripts/validate-phase-1-twii-sanitized-row-payload-candidate-artifact.mjs";
const problems = [];
const candidate = readJson(candidatePath);
const rowPayloadCandidateValidation = rowPayloadCandidatePath
  ? validateRowPayloadCandidate(rowPayloadCandidatePath)
  : null;

validateCandidate();
validateOptionalRowPayloadCandidate();

const ok = problems.length === 0;
const summary = {
  status: ok ? "ok" : "blocked",
  runnerCandidateStatus: ok
    ? "twii_server_only_execute_runner_candidate_blocked_no_execution"
    : "twii_server_only_execute_runner_candidate_invalid_gate",
  attemptId: candidate.attemptId ?? null,
  runnerMode: "server_only_candidate_fail_closed_no_execution",
  blockedReason: ok
    ? "server_only_execute_runner_candidate_is_fail_closed_and_does_not_execute"
    : "server_only_execute_runner_candidate_contract_invalid",
  targetTable: candidate.targetTable ?? null,
  targetLane: candidate.targetLane ?? null,
  targetScope: candidate.targetScope ?? null,
  maxRows: candidate.maxRows ?? null,
  rowPayloadCandidate: {
    pathProvided: Boolean(rowPayloadCandidatePath),
    accepted: rowPayloadCandidateValidation?.accepted === true,
    status: rowPayloadCandidateValidation?.status ?? null,
    rowCount: rowPayloadCandidateValidation?.rowCount ?? null,
    expectedRows: rowPayloadCandidateValidation?.expectedRows ?? null,
    symbolsCovered: rowPayloadCandidateValidation?.symbolsCovered ?? [],
    dateBounds: rowPayloadCandidateValidation?.dateBounds ?? null,
    duplicateCount: rowPayloadCandidateValidation?.duplicateCount ?? null,
    missingRequiredFieldCount: rowPayloadCandidateValidation?.missingRequiredFieldCount ?? null,
    forbiddenFieldCount: rowPayloadCandidateValidation?.forbiddenFieldCount ?? null,
    invalidTradeDateCount: rowPayloadCandidateValidation?.invalidTradeDateCount ?? null,
    problems: rowPayloadCandidateValidation?.problems ?? []
  },
  executeRequested: false,
  executeSwitchProvided: false,
  confirmationPhraseProvided: false,
  credentialValuesRead: false,
  sqlExecuted: false,
  supabaseConnectionAttempted: false,
  supabaseWritesEnabled: false,
  marketDataFetched: false,
  marketDataIngested: false,
  dailyPricesMutated: false,
  stagingRowsCreated: false,
  candidateRowsAccepted: false,
  rowCoverageScoringAllowed: false,
  rawPayloadOutput: false,
  rowPayloadOutput: false,
  stockIdPayloadOutput: false,
  secretsOutput: false,
  runnerExecutableNow: false,
  executionAllowedNow: false,
  writeGateExecutableNow: false,
  implementationAllowedNow: false,
  publicPromotionAllowed: false,
  scoreSourceRealAllowed: false,
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  problems
};

console.log(JSON.stringify(summary, null, 2));
if (!ok) process.exit(1);

function validateCandidate() {
  if (candidate.candidateKind !== "twii_server_only_execute_runner_candidate_no_execution") {
    problems.push("candidateKind must be twii_server_only_execute_runner_candidate_no_execution");
  }
  if (candidate.runnerMode !== "server_only_candidate_fail_closed_no_execution") {
    problems.push("runnerMode must be server_only_candidate_fail_closed_no_execution");
  }
  if (candidate.candidateReadyForPmReview !== true) problems.push("candidateReadyForPmReview must be true");
  for (const key of [
    "executeSwitchProvided",
    "confirmationPhraseProvided",
    "serverOnlyCredentialCheckPassed",
    "credentialValuesRead",
    "rollbackDryRunPassed",
    "aggregateReadbackPassed",
    "postWriteReviewPassed",
    "executeRequested",
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseWritesEnabled",
    "dailyPricesMutated",
    "candidateRowsAccepted",
    "runnerExecutableNow",
    "executionAllowedNow",
    "writeGateExecutableNow",
    "implementationAllowedNow",
    "promotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (candidate[key] !== false) problems.push(`candidate.${key} must be false`);
  }
}

function validateOptionalRowPayloadCandidate() {
  if (!rowPayloadCandidatePath) return;
  if (rowPayloadCandidateValidation?.accepted !== true) {
    problems.push("row_payload_candidate_invalid");
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    problems.push(`cannot read JSON: ${filePath}`);
    return {};
  }
}

function validateRowPayloadCandidate(filePath) {
  const run = spawnSync(process.execPath, [rowPayloadValidatorPath, "--candidate-artifact", filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  try {
    const parsed = JSON.parse(run.stdout ?? "{}");
    if (run.status !== 0) {
      return {
        ...parsed,
        accepted: false,
        problems: [...(parsed.problems ?? []), "row_payload_validator_exit_nonzero"]
      };
    }
    return parsed;
  } catch (error) {
    return {
      status: "phase_1_twii_sanitized_row_payload_candidate_artifact_blocked",
      accepted: false,
      rowCount: null,
      expectedRows: null,
      symbolsCovered: [],
      dateBounds: null,
      duplicateCount: null,
      missingRequiredFieldCount: null,
      forbiddenFieldCount: null,
      invalidTradeDateCount: null,
      problems: [`row_payload_validator_unreadable:${error.message}`]
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
