const report = {
  authorizationId: "TW-EQUITY-STAGING-WRITE-2026-06-07-AUTH-003",
  candidateInput: "data/candidates/tw-equity-staging-candidate.json",
  decisionId: "THIRD_WRITE_DECISION_AUTH_003_READY",
  exactCommand: [
    "node",
    "scripts/run-tw-equity-staging-write-once.mjs",
    "--authorization-id",
    "TW-EQUITY-STAGING-WRITE-2026-06-07-AUTH-003",
    "--lane",
    "tw-equity",
    "--symbols",
    "2330,2382,2308",
    "--sessions",
    "60",
    "--target",
    "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
    "--max-rows",
    "180",
    "--post-run-review",
    "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md",
    "--candidate-input",
    "data/candidates/tw-equity-staging-candidate.json",
    "--rollback-dry-run",
    "--execute"
  ].join(" "),
  postRunReview: "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md",
  prerequisites: {
    openApiExposure:
      "tw_equity_post_migration_openapi_exposure_confirmation_schema_exposure_complete_write_path_ready_for_decision",
    readonlyVerification: "tw_equity_post_migration_readonly_verification_tables_reachable_no_write",
    runnerContract: "AUTH-003 local mock alignment required before real execution"
  },
  safety: {
    dailyPricesMutated: false,
    marketDataFetched: false,
    publicDataSource: "mock",
    publicPromotionAllowed: false,
    rawPayloadsPrinted: false,
    retryAllowedInSameSlice: false,
    rowCoveragePointsAllowed: false,
    scoreSource: "mock",
    scoreSourceRealAllowed: false,
    secretsPrinted: false,
    sqlAuthorized: false
  },
  status: "tw_equity_third_bounded_staging_write_decision_ready_not_executed"
};

console.log(JSON.stringify(report, null, 2));
