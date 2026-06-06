const report = {
  status: "tw_equity_supabase_metadata_diagnostic_decision_packet_ready_not_executed",
  decision: "READY_FOR_SEPARATE_BOUNDED_METADATA_DIAGNOSTIC_AUTHORIZATION",
  acceptedPreconditions: {
    twoWriteAttemptsFailedClosedWithPgrst205: true,
    canonicalObjectsPreviouslyReadable: true,
    localTargetRelationNamingMatches: true,
    localRunIdUuidContractRepaired: true,
    candidateArtifactSanitized: true,
    candidateInputRunRows: 1,
    candidateInputPriceRows: 180
  },
  futureDiagnosticScope: {
    exactlyOneRun: true,
    targets: ["staging_twse_stock_day_runs", "staging_twse_stock_day_prices"],
    readOnlyMetadataSafeOperationsOnly: true,
    sanitizedAggregateEvidenceOnly: true,
    postRunReviewRequired: true,
    executionAllowedByThisPacket: false
  },
  expectedClassifications: [
    "metadata_reachable_insert_blocker_unresolved",
    "metadata_schema_cache_or_object_not_available",
    "metadata_access_or_policy_blocked",
    "metadata_column_contract_or_cache_blocked",
    "metadata_project_or_network_blocked"
  ],
  nextAction:
    "If dashboard metadata evidence is not immediately available, create a separate bounded metadata diagnostic runner and post-run review template; do not run it from this packet.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    migrationExecuted: false,
    remoteSupabaseConnectionAttempted: false,
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
