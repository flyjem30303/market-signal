import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const pmReviewPath = "scripts/report-pm-tw-equity-candidate-intake-review.mjs";
const candidatePath = process.env.A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH ?? "data/candidates/tw-equity-staging-candidate.json";
const expected = {
  authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  confirmation: "CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE",
  lane: "tw-equity",
  maxRows: 180,
  postRunReview: "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md",
  sessions: 60,
  symbols: ["2330", "2382", "2308"],
  targetRelation: "staging_twse_stock_day_runs,staging_twse_stock_day_prices"
};

const dryRun = runRunner({ execute: false });
const missingCandidate = runRunner({ execute: true });
const candidatePreExecution = runRunner({ candidateInput: candidatePath, execute: false });
const pmReview = runReport(pmReviewPath);
const dryRunOutput = parseJson(dryRun.stdout);
const missingCandidateOutput = parseJson(missingCandidate.stdout);
const candidatePreExecutionOutput = parseJson(candidatePreExecution.stdout);
const pmReviewOutput = parseJson(pmReview.stdout);
const candidateArtifactReady =
  pmReview.status === 0 &&
  pmReviewOutput.readyForCeoBoundedWriteDecision === true &&
  candidatePreExecution.status === 0 &&
  candidatePreExecutionOutput.candidateInputAccepted === true &&
  candidatePreExecutionOutput.writePreExecutionSummaryReady === true;
const boundedExecutionReady =
  dryRun.status === 0 &&
  missingCandidate.status !== 0 &&
  candidatePreExecution.status === 0 &&
  dryRunOutput.writeImplementationReady === true &&
  missingCandidateOutput.problems?.includes("missing_candidate_input_artifact_contract") === true &&
  candidateArtifactReady;

const report = {
  status: boundedExecutionReady
    ? "tw_equity_staging_write_execution_ready_for_one_attempt"
    : "tw_equity_staging_write_execution_readiness_blocked_candidate_artifact_missing",
  lane: expected.lane,
  implementationReady: dryRunOutput.writeImplementationReady === true,
  actualBoundedWriteExecuted: false,
  candidateArtifactReady,
  currentBlocker: candidateArtifactReady ? null : "accepted_sanitized_candidate_input_artifact_missing",
  expectedRows: {
    laneExpectedRows: expected.maxRows,
    candidateRunRows: candidatePreExecutionOutput.candidateInputRunRows ?? 0,
    candidatePriceRows: candidatePreExecutionOutput.candidateInputPriceRows ?? 0,
    readonlyObservedRows: 3,
    readonlyMissingRows: 177
  },
  commandContract: {
    authorizationId: expected.authorizationId,
    confirmationEnv: "TW_EQUITY_STAGING_WRITE_CONFIRMATION",
    confirmationValue: expected.confirmation,
    lane: expected.lane,
    symbols: expected.symbols,
    sessions: expected.sessions,
    targetRelation: expected.targetRelation,
    maxRows: expected.maxRows,
    postRunReview: expected.postRunReview
  },
  dryRunProbe: {
    statusCode: dryRun.status,
    connectionAttempted: dryRunOutput.connectionAttempted,
    writeAttempted: dryRunOutput.writeAttempted,
    mutations: dryRunOutput.mutations,
    publicDataSource: dryRunOutput.publicDataSource,
    scoreSource: dryRunOutput.scoreSource
  },
  missingCandidateExecutionProbe: {
    statusCode: missingCandidate.status,
    connectionAttempted: missingCandidateOutput.connectionAttempted,
    writeAttempted: missingCandidateOutput.writeAttempted,
    mutations: missingCandidateOutput.mutations,
    problems: missingCandidateOutput.problems ?? []
  },
  candidatePreExecutionProbe: {
    statusCode: candidatePreExecution.status,
    candidateInputAccepted: candidatePreExecutionOutput.candidateInputAccepted === true,
    candidateInputRunRows: candidatePreExecutionOutput.candidateInputRunRows ?? 0,
    candidateInputPriceRows: candidatePreExecutionOutput.candidateInputPriceRows ?? 0,
    connectionAttempted: candidatePreExecutionOutput.connectionAttempted,
    writeAttempted: candidatePreExecutionOutput.writeAttempted,
    mutations: candidatePreExecutionOutput.mutations,
    writePreExecutionSummaryReady: candidatePreExecutionOutput.writePreExecutionSummaryReady === true,
    problems: candidatePreExecutionOutput.problems ?? []
  },
  pmCandidateIntakeReview: {
    statusCode: pmReview.status,
    status: pmReviewOutput.status ?? "blocked",
    readyForCeoBoundedWriteDecision: pmReviewOutput.readyForCeoBoundedWriteDecision === true,
    stagingWriteExecutionAllowed: pmReviewOutput.authorizationBoundary?.stagingWriteExecutionAllowed === true
  },
  nextAction: {
    owner: candidateArtifactReady ? "CEO / PM" : "A1 Data / Supabase / Market Evidence",
    action: candidateArtifactReady
      ? "name or reject exactly one bounded staging write attempt using the accepted sanitized candidate artifact; execution remains separate and requires the exact command gate"
      : "produce one accepted sanitized candidate input artifact for 2330, 2382, and 2308 without raw payloads, secrets, or public redistribution claims",
    pmIntegration:
      "PM intake review is accepted, candidate pre-execution validation is ready, and this report still does not execute the attempt"
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    realSupabaseConnectionAttempted: false,
    realSupabaseWrites: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    rawPayloadsPrinted: false,
    rowPayloadsPrinted: false,
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    publicPromotionAllowed: false,
    rowCoveragePointsAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));

function runRunner({ candidateInput, execute }) {
  const args = [
    runnerPath,
    "--authorization-id",
    expected.authorizationId,
    "--lane",
    expected.lane,
    "--symbols",
    expected.symbols.join(","),
    "--sessions",
    String(expected.sessions),
    "--target",
    expected.targetRelation,
    "--max-rows",
    String(expected.maxRows),
    "--post-run-review",
    expected.postRunReview,
    "--rollback-dry-run"
  ];
  if (candidateInput) args.push("--candidate-input", candidateInput);
  if (execute) args.push("--execute");

  return spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "mock-service-role-key",
      TW_EQUITY_STAGING_WRITE_CONFIRMATION: expected.confirmation,
      TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE: "disabled"
    },
    shell: false
  });
}

function runReport(reportPath) {
  return spawnSync(process.execPath, [reportPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH: candidatePath
    },
    shell: false
  });
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
