const decision = {
  authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-002",
  candidateArtifact: "data/candidates/tw-equity-staging-candidate.json",
  confirmationValue: "CEO_APPROVED_TW_EQUITY_SECOND_BOUNDED_STAGING_WRITE_RETRY_ONCE",
  decisionId: "TW-EQUITY-STAGING-WRITE-RETRY-DECISION-2026-06-06-001",
  lane: "tw-equity",
  maxRows: 180,
  postRunReview: "docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md",
  sessions: 60,
  symbols: ["2330", "2382", "2308"],
  targetRelation: "staging_twse_stock_day_runs,staging_twse_stock_day_prices"
};

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
  status: "tw_equity_second_bounded_staging_write_retry_named_not_executed",
  decision,
  exactFutureExecutionCommand,
  prerequisites: {
    rootCauseGate: "tw_equity_pgrst205_root_cause_gate_canonical_objects_readable_no_write_retry",
    firstAttemptConsumed: true,
    candidateArtifactAccepted: true,
    candidateInputRunRows: 1,
    candidateInputPriceRows: 180,
    canonicalObjectsReadable: true,
    runnerContractAlignmentRequiredBeforeExecution: true
  },
  decisionBoundary: {
    ceoNamedExactlyOneSecondAttempt: true,
    executionAllowedByThisSlice: false,
    executionRequiresNextSlice: true,
    freshPostRunReviewRequired: true,
    noAdditionalRetryWithoutSeparateDecision: true,
    runnerAlignmentRequiredBeforeExecution: true
  },
  nextAction:
    "PM should align the guarded write runner contract for authorization AUTH-002 and the fresh post-run review path, without executing the write.",
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
