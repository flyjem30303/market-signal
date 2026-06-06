const report = {
  authorizationCandidate: {
    authorizationId: "TW-EQUITY-DAILY-PRICES-PREFLIGHT-2026-06-07-AUTH-001",
    attemptLimit: 1,
    attemptType: "bounded_supabase_readonly_preflight",
    executionStatus: "not_executed",
    requiredCommandStatus: "implemented_fail_closed_not_executed",
    targetProductionRelation: "daily_prices",
    targetStagingScope: "AUTH-003"
  },
  futureCommandContract: {
    command:
      "node --env-file=.env.local scripts/run-tw-equity-staging-to-daily-prices-remote-preflight-once.mjs --authorization-id TW-EQUITY-DAILY-PRICES-PREFLIGHT-2026-06-07-AUTH-001 --staging-scope AUTH-003 --candidate-input data/candidates/tw-equity-staging-candidate.json --post-run-review docs/reviews/TW_EQUITY_STAGING_TO_DAILY_PRICES_REMOTE_PREFLIGHT_POST_RUN_REVIEW_2026-06-07.md --confirm-bounded-readonly-preflight --execute",
    runnerImplementedNow: true,
    separateRunnerImplementationGateRequired: false
  },
  mode: "tw_equity_staging_to_daily_prices_remote_preflight_authorization",
  prerequisites: {
    dryRunPreflight: "tw_equity_staging_to_daily_prices_dry_run_preflight_ready_no_remote_attempt",
    mergeDesignPacket: "tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed",
    postRunReviewTemplate: "tw_equity_staging_to_daily_prices_remote_preflight_post_run_review_template_ready_not_executed",
    stagingScope: "AUTH-003_only"
  },
  remoteReadScope: {
    allowedOutput: "sanitized_aggregate_counts_only",
    counts: [
      { expected: 1, name: "staging_run_count" },
      { expected: 180, name: "staging_price_count" },
      { expected: 3, name: "distinct_symbol_count" },
      { expected: 3, name: "stock_mapping_count" },
      { expected: 0, name: "unmapped_symbol_count" },
      { expected: 0, name: "duplicate_staging_key_count" },
      { expected: 0, name: "duplicate_production_key_count" },
      { expected: 0, name: "existing_daily_prices_target_count" }
    ]
  },
  safety: {
    connectionAttempted: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    publicDataSource: "mock",
    publicPromotionAllowed: false,
    rawPayloadsPrinted: false,
    rowCoveragePointsAwarded: false,
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealAllowed: false,
    secretsPrinted: false,
    sqlExecuted: false,
    stockIdsPrinted: false,
    supabaseWriteAttempted: false
  },
  status: "tw_equity_staging_to_daily_prices_remote_preflight_authorization_ready_not_executed"
};

console.log(JSON.stringify(report, null, 2));
