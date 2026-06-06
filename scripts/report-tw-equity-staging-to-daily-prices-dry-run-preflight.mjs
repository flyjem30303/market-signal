const report = {
  acceptedInput: {
    mergeDesignPacket: "tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed",
    postWritePromotionReadinessGate: "tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked",
    postWriteVerification: "tw_equity_post_write_staging_verification_counts_match_no_public_promotion",
    stagingScope: "AUTH-003_only",
    stagingWrite: "tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion"
  },
  boundedRemotePreflightPlan: {
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
    ],
    exactLaterAuthorizationRequired: true,
    remoteAttemptedNow: false
  },
  coverageUniverse: {
    denominatorForThisPacket: 180,
    expectedProductionRowsAfterFutureMerge: 180,
    sessionPolicy: "60_trading_sessions_per_symbol_from_accepted_AUTH_003_staging_artifact",
    symbols: ["2330", "2382", "2308"],
    symbolCount: 3
  },
  failClosedDecision: {
    ifAnyCountMissing: "blocked",
    ifAnyCountUnexpected: "blocked",
    ifExistingDailyPricesTargetCountGreaterThanZero: "blocked",
    ifRemotePreflightNotSeparatelyAuthorized: "blocked",
    mergeStatusAfterThisRun: "blocked_not_executed"
  },
  mode: "tw_equity_staging_to_daily_prices_dry_run_preflight",
  readbackDesignDependency: {
    productionReadbackExecutedNow: false,
    requiredAfterFutureMerge: true,
    requiredReadbackExpectedRows: 180,
    requiredReadbackOutput: "sanitized_aggregate_counts_only"
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
    supabaseClientCreated: false,
    supabaseWriteAttempted: false
  },
  status: "tw_equity_staging_to_daily_prices_dry_run_preflight_ready_no_remote_attempt"
};

console.log(JSON.stringify(report, null, 2));
