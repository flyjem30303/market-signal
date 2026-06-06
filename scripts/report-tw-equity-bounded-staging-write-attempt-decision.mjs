import { spawnSync } from "node:child_process";

const decision = {
  authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  candidateArtifact: "data/candidates/tw-equity-staging-candidate.json",
  confirmationValue: "CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE",
  decisionId: "TW-EQUITY-STAGING-WRITE-ATTEMPT-DECISION-2026-06-06-001",
  lane: "tw-equity",
  maxRows: 180,
  postRunReview: "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md",
  sessions: 60,
  symbols: ["2330", "2382", "2308"],
  targetRelation: "staging_twse_stock_day_runs,staging_twse_stock_day_prices"
};

const readiness = runJson("scripts/report-tw-equity-staging-write-execution-readiness.mjs");
const readinessAccepted =
  readiness.statusCode === 0 &&
  readiness.output?.status === "tw_equity_staging_write_execution_ready_for_one_attempt" &&
  readiness.output?.implementationReady === true &&
  readiness.output?.candidateArtifactReady === true &&
  readiness.output?.actualBoundedWriteExecuted === false &&
  readiness.output?.candidatePreExecutionProbe?.candidateInputAccepted === true &&
  readiness.output?.candidatePreExecutionProbe?.candidateInputPriceRows === decision.maxRows &&
  readiness.output?.candidatePreExecutionProbe?.connectionAttempted === false &&
  readiness.output?.candidatePreExecutionProbe?.mutations === false &&
  readiness.output?.pmCandidateIntakeReview?.readyForCeoBoundedWriteDecision === true &&
  readiness.output?.pmCandidateIntakeReview?.stagingWriteExecutionAllowed === false;

const exactFutureExecutionCommand = [
  "node",
  "scripts/run-tw-equity-staging-write-once.mjs",
  "--authorization-id",
  decision.authorizationId,
  "--lane",
  decision.lane,
  "--symbols",
  decision.symbols.join(","),
  "--sessions",
  String(decision.sessions),
  "--target",
  decision.targetRelation,
  "--max-rows",
  String(decision.maxRows),
  "--post-run-review",
  decision.postRunReview,
  "--candidate-input",
  decision.candidateArtifact,
  "--rollback-dry-run",
  "--execute"
];

const report = {
  status: readinessAccepted
    ? "tw_equity_bounded_staging_write_attempt_named_not_executed"
    : "tw_equity_bounded_staging_write_attempt_decision_blocked_readiness_not_accepted",
  decision,
  exactFutureExecutionCommand,
  readiness: {
    statusCode: readiness.statusCode,
    status: readiness.output?.status ?? "blocked",
    implementationReady: readiness.output?.implementationReady === true,
    candidateArtifactReady: readiness.output?.candidateArtifactReady === true,
    actualBoundedWriteExecuted: readiness.output?.actualBoundedWriteExecuted === true,
    candidateInputRunRows: readiness.output?.candidatePreExecutionProbe?.candidateInputRunRows ?? 0,
    candidateInputPriceRows: readiness.output?.candidatePreExecutionProbe?.candidateInputPriceRows ?? 0,
    pmReadyForCeoDecision: readiness.output?.pmCandidateIntakeReview?.readyForCeoBoundedWriteDecision === true
  },
  decisionBoundary: {
    ceoNamedExactlyOneAttempt: readinessAccepted,
    executionAllowedByThisSlice: false,
    executionRequiresNextSlice: true,
    noRetryWithoutSeparateDecision: true,
    sameSlicePostRunReviewRequired: true
  },
  nextAction: readinessAccepted
    ? "PM may open the execution slice and run exactly one bounded staging write attempt only after immediate prechecks pass."
    : "PM must keep the attempt unnamed until readiness returns tw_equity_staging_write_execution_ready_for_one_attempt.",
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

function runJson(filePath) {
  const result = spawnSync(process.execPath, [filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  return {
    statusCode: result.status,
    output: parseJson(result.stdout)
  };
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
