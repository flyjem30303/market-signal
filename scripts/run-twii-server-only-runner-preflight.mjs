import fs from "node:fs";

const preflightPath = "data/source-gates/twii-server-only-runner-preflight.json";
const problems = [];
const preflight = readJson(preflightPath);

validatePreflight();

const ok = problems.length === 0;
const summary = {
  status: ok ? "ok" : "blocked",
  preflightStatus: ok
    ? "twii_server_only_runner_preflight_blocked_no_execution"
    : "twii_server_only_runner_preflight_invalid_gate",
  attemptId: preflight.attemptId ?? null,
  runnerMode: "server_only_preflight_fail_closed_no_execution",
  blockedReason: ok
    ? "server_only_runner_preflight_is_fail_closed_and_does_not_execute"
    : "server_only_runner_preflight_contract_invalid",
  targetTable: preflight.targetTable ?? null,
  targetLane: preflight.targetLane ?? null,
  targetScope: preflight.targetScope ?? null,
  maxRows: preflight.maxRows ?? null,
  executeSwitchProvided: false,
  confirmationPhraseProvided: false,
  serverOnlyCredentialCheckPassed: false,
  credentialValuesRead: false,
  rollbackDryRunPassed: false,
  aggregateReadbackPassed: false,
  postWriteReviewPassed: false,
  candidateDuplicateRejectionProofPassed: false,
  executeRequested: false,
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

function validatePreflight() {
  if (preflight.preflightKind !== "twii_server_only_runner_preflight_no_execution") {
    problems.push("preflightKind must be twii_server_only_runner_preflight_no_execution");
  }
  if (preflight.runnerMode !== "server_only_preflight_fail_closed_no_execution") {
    problems.push("runnerMode must be server_only_preflight_fail_closed_no_execution");
  }
  if (preflight.preflightReadyForPmReview !== true) problems.push("preflightReadyForPmReview must be true");
  for (const key of [
    "executeSwitchProvided",
    "confirmationPhraseProvided",
    "serverOnlyCredentialCheckPassed",
    "credentialValuesRead",
    "rollbackDryRunPassed",
    "aggregateReadbackPassed",
    "postWriteReviewPassed",
    "candidateDuplicateRejectionProofPassed",
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
    if (preflight[key] !== false) problems.push(`preflight.${key} must be false`);
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
