const report = {
  status: "tw_equity_staging_migration_apply_decision_packet_ready_for_chairman_or_ceo_execution_approval",
  mode: "tw_equity_staging_migration_apply_decision_packet",
  decision: "READY_TO_AUTHORIZE_MANUAL_SUPABASE_SQL_EDITOR_EXECUTION_OF_0003_STAGING_MIGRATION",
  acceptedEvidence: {
    dashboardPublicSearchStagingTwseZeroTables: true,
    remoteStagingTablesMissingOrNotApplied: true,
    localMigrationDeclaresRunsTable: true,
    localMigrationDeclaresPricesTable: true,
    writeRunnerTargetsRunsTable: true,
    writeRunnerTargetsPricesTable: true,
    localTargetNamingMismatch: false
  },
  migrationScope: {
    file: "supabase/migrations/0003_twse_stock_day_staging.sql",
    createRunsTableIfMissing: true,
    createPricesTableIfMissing: true,
    enableRlsOnStagingTables: true,
    createDeclaredIndexesOnly: true,
    seedRowsIncluded: false,
    productionMutationIncluded: false,
    idempotentCreateStatementsExpected: true
  },
  manualExecutionSteps: [
    "Open Supabase Dashboard SQL Editor for the current project.",
    "Paste only the full contents of supabase/migrations/0003_twse_stock_day_staging.sql.",
    "Run the SQL once.",
    "Run NOTIFY pgrst, 'reload schema'; once after the migration succeeds.",
    "Return to Database > Tables, schema public, and search staging_twse.",
    "Confirm both staging tables appear.",
    "Report accepted/rejected outcome back to PM."
  ],
  blockedAfterExecutionUntilSeparateVerification: {
    stagingWriteAttemptAuthorized: false,
    dailyPricesMutationAuthorized: false,
    publicRuntimePromotionAuthorized: false,
    rowCoveragePointsAwarded: false,
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  nextRouteAfterAcceptedExecution:
    "Create and run a bounded post-migration read-only verification packet and post-run review before any staging write decision.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecutedByPmInThisPacket: false,
    migrationExecutedByPmInThisPacket: false,
    supabaseWriteAttemptedByPm: false,
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
