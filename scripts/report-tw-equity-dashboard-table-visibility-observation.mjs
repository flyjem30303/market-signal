const report = {
  status: "tw_equity_dashboard_table_visibility_observation_staging_tables_not_found_in_public_table_list",
  mode: "tw_equity_dashboard_table_visibility_observation",
  dashboardObservation: {
    surface: "Supabase Dashboard Database Tables",
    schema: "public",
    searchQuery: "staging_twse",
    searchResult: "No results found",
    observedSearchResultTableCount: 0,
    runsTableVisibleInPublicTableList: false,
    pricesTableVisibleInPublicTableList: false
  },
  localContractComparison: {
    migrationDeclaresRunsTable: true,
    migrationDeclaresPricesTable: true,
    writeRunnerTargetsRunsTable: true,
    writeRunnerTargetsPricesTable: true,
    localTargetNamingMismatch: false,
    migrationMarkedDraftUntilCeoApproval: true
  },
  ceoClassification: "remote_staging_tables_missing_or_not_applied",
  nextRoute:
    "Prepare a migration-apply decision packet for supabase/migrations/0003_twse_stock_day_staging.sql before any post-migration read-only verification or staging write decision.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecutedByPm: false,
    migrationExecutedByPm: false,
    supabaseWriteAttempted: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    rawPayloadsPrinted: false,
    rowPayloadsPrinted: false,
    secretsPrinted: false,
    publicPromotionAllowed: false,
    rowCoveragePointsAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));
