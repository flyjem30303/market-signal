import fs from "node:fs";

const candidatePath = "data/source-gates/twii-server-only-execute-runner-candidate.json";
const problems = [];
const candidate = readJson(candidatePath);

validateCandidate();

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

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    problems.push(`cannot read JSON: ${filePath}`);
    return {};
  }
}
