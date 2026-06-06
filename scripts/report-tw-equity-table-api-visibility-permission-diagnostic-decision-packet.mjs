const report = {
  status: "tw_equity_table_api_visibility_permission_diagnostic_decision_packet_ready_not_executed",
  mode: "tw_equity_table_api_visibility_permission_diagnostic_decision_packet",
  decision: "READY_FOR_SEPARATE_TABLE_LEVEL_DATA_API_VISIBILITY_PERMISSION_DIAGNOSTIC",
  acceptedEvidence: {
    repairOutcomeAccepted: true,
    repairOutcomeNoDataWrite: true,
    postRepairOpenApiProbeAttemptedOnce: true,
    openApiReachable: true,
    openApiParsed: true,
    runsTableStillMissingFromOpenApi: true,
    pricesTableStillMissingFromOpenApi: true,
    thirdBoundedStagingWriteBlocked: true
  },
  diagnosticQuestions: [
    "canonical_staging_tables_enabled_for_data_api_exposure",
    "table_level_permissions_grants_policy_or_api_visibility_hiding_metadata",
    "schema_exposure_confirmed_but_relation_level_visibility_disabled_or_unsupported",
    "openapi_metadata_mismatch_versus_direct_relation_endpoint_reachability",
    "repair_route_dashboard_visibility_sql_grant_migration_or_new_staging_route"
  ],
  futureDiagnosticScope: {
    executionAllowedByThisPacket: false,
    exactlyOneFutureDiagnosticIfAuthorized: true,
    dashboardInspectionAllowed: true,
    readOnlyTableLevelDiagnosticAllowedIfSeparatelyAuthorized: true,
    targets: ["staging_twse_stock_day_runs", "staging_twse_stock_day_prices"],
    sanitizedAggregateEvidenceOnly: true,
    postRunReviewRequired: true
  },
  expectedClassifications: [
    "table_api_visibility_not_exposed",
    "table_permission_or_policy_visibility_blocked",
    "openapi_metadata_lag_or_cache_incomplete",
    "table_object_missing_or_mismatched",
    "diagnostic_environment_blocked"
  ],
  nextAction:
    "Create a local-only command map and checker for one bounded table-level Data API visibility diagnostic, or record an operator-provided Dashboard table visibility outcome before any remote diagnostic or write decision.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    connectionAttempted: false,
    sqlExecuted: false,
    migrationExecuted: false,
    supabaseWriteAttempted: false,
    thirdBoundedStagingWriteAttemptAllowed: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    rawOpenApiPrinted: false,
    rawPayloadsPrinted: false,
    rowPayloadsPrinted: false,
    secretsPrinted: false,
    publicPromotionAllowed: false,
    rowCoveragePointsAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));
