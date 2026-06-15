import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const candidateArtifactPath =
  args.candidateArtifact ?? process.env.PHASE_1_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH ?? null;

const commands = [
  {
    args: ["scripts/validate-phase-1-sanitized-row-payload-candidate-artifact.mjs", "--candidate-artifact", candidateArtifactPath],
    id: "validate_candidate_artifact",
    required: true
  },
  {
    args: ["scripts/check-phase-1-data-online-go-no-go-status.mjs", "--candidate-artifact", candidateArtifactPath],
    id: "check_data_online_go_no_go",
    required: true
  },
  {
    args: ["scripts/run-phase-1-write-runner-implementation-candidate.mjs", "--candidate-artifact", candidateArtifactPath],
    id: "run_write_runner_implementation_candidate",
    required: true
  }
];

const problems = [];
const commandResults = [];

if (!candidateArtifactPath) {
  problems.push("candidate_artifact_path_missing");
}

if (candidateArtifactPath) {
  for (const command of commands) {
    const result = runJson(command.args);
    commandResults.push({
      id: command.id,
      status: result.status ?? null,
      accepted: result.accepted ?? result.rowPayloadCandidate?.accepted ?? result.rowPayloadStatus?.rowPayloadCandidateAccepted ?? null,
      decision: result.decision ?? null,
      runnerStatus: result.runnerStatus ?? null,
      blockedReasons: result.blockedReasons ?? result.rowPayloadCandidate?.blockedReasons ?? [],
      problems: result.problems ?? result.rowPayloadCandidateValidationProblems ?? [],
      rowCount: result.rowCount ?? result.rowPayloadCandidate?.rowCount ?? result.rowPayloadStatus?.rowPayloadCandidateRowCount ?? null,
      symbolsCovered:
        result.symbolsCovered ??
        result.rowPayloadCandidate?.symbolsCovered ??
        result.rowPayloadStatus?.rowPayloadCandidateSymbolsCovered ??
        [],
      symbolCounts:
        result.symbolCounts ??
        result.rowPayloadCandidate?.symbolCounts ??
        result.rowPayloadStatus?.rowPayloadCandidateSymbolCounts ??
        null,
      dateBounds:
        result.dateBounds ??
        result.rowPayloadCandidate?.dateBounds ??
        result.rowPayloadStatus?.rowPayloadCandidateDateBounds ??
        null
    });
  }
}

const validator = commandResults.find((result) => result.id === "validate_candidate_artifact");
const dataOnline = commandResults.find((result) => result.id === "check_data_online_go_no_go");
const runner = commandResults.find((result) => result.id === "run_write_runner_implementation_candidate");

if (validator && validator.accepted !== true) problems.push("candidate_artifact_validator_not_accepted");
if (dataOnline && dataOnline.accepted !== true) problems.push("data_online_go_no_go_did_not_accept_candidate");
if (runner && runner.runnerStatus !== "phase_1_write_runner_implementation_candidate_ready_for_separate_review") {
  problems.push("write_runner_candidate_not_ready_for_separate_review");
}

const readyForSeparateWriteReview = problems.length === 0 && Boolean(candidateArtifactPath);

console.log(
  JSON.stringify(
    {
      status: readyForSeparateWriteReview
        ? "phase_1_row_payload_candidate_pm_review_ready_for_separate_write_review"
        : "phase_1_row_payload_candidate_pm_review_blocked",
      mode: "aggregate_only_no_row_output",
      candidateArtifactPathProvided: Boolean(candidateArtifactPath),
      commandResults,
      decision: readyForSeparateWriteReview
        ? "candidate_validated_keep_execution_separate"
        : "keep_data_online_no_go_until_valid_candidate_path",
      nextRoute: readyForSeparateWriteReview
        ? "separate_operator_write_execution_review_required"
        : "provide_valid_non_committed_sanitized_row_payload_candidate_path",
      problems,
      safety: {
        sqlExecuted: false,
        supabaseConnected: false,
        supabaseWriteAttempted: false,
        stagingRowsCreated: false,
        dailyPricesMutated: false,
        marketDataFetched: false,
        rawPayloadOutput: false,
        rowPayloadOutput: false,
        stockIdPayloadOutput: false,
        secretsOutput: false,
        publicDataSource: "mock",
        scoreSource: "mock"
      }
    },
    null,
    2
  )
);

process.exitCode = 0;

function runJson(commandArgs) {
  const run = spawnSync(process.execPath, commandArgs, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });

  if (run.error) {
    return {
      status: "command_error",
      accepted: false,
      problems: [`${commandArgs[0]}:${run.error.message}`]
    };
  }

  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    return {
      status: "command_output_unreadable",
      accepted: false,
      problems: [`${commandArgs[0]}:${error.message}`]
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
