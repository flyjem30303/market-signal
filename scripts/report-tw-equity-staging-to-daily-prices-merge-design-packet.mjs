const report = {
  acceptedInput: {
    postWritePromotionReadinessGate: "tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked",
    postWriteVerification: "tw_equity_post_write_staging_verification_counts_match_no_public_promotion",
    stagingPriceRows: 180,
    stagingRunRows: 1,
    stagingWrite: "tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion"
  },
  conflictPolicy: {
    defaultPolicy: "insert_only_no_overwrite",
    existingTargetRowsGreaterThanZero: "block_first_merge_runner",
    overwriteRequiresSeparateDecision: true
  },
  coverageUniverse: {
    broaderMvpDenominatorChanged: false,
    expectedProductionRowsFromThisRun: 180,
    sessionPolicy: "60_trading_sessions_per_symbol_from_accepted_staging_artifact",
    symbols: ["2330", "2382", "2308"],
    symbolCount: 3
  },
  failClosedRunnerContract: {
    duplicateProductionKeyCountMustEqual: 0,
    existingDailyPricesRowsMustBeCountedBeforeMutation: true,
    exactAuthorizationRequiredLater: true,
    readbackPostRunReviewRequired: true,
    stagingPriceCountMustEqual: 180,
    stagingRunCountMustEqual: 1,
    stockMappingCountMustEqual: 3,
    unmappedSymbolCountMustEqual: 0
  },
  mode: "tw_equity_staging_to_daily_prices_merge_design_packet",
  readbackVerification: {
    expectedRows: 180,
    output: "sanitized_aggregate_counts_only",
    rowPayloadsPrinted: false,
    stockIdsPrinted: false
  },
  safety: {
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
    supabaseWriteAttempted: false
  },
  schemaMapping: {
    close_price: "daily_prices.close",
    high_price: "daily_prices.high",
    low_price: "daily_prices.low",
    open_price: "daily_prices.open",
    stock_id: "resolved_from_stocks_id_not_printed",
    trade_date: "daily_prices.trade_date",
    trade_value: "daily_prices.turnover",
    volume: "daily_prices.volume"
  },
  status: "tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed"
};

console.log(JSON.stringify(report, null, 2));
