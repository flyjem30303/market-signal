const status = "tw_equity_schema_exposure_repair_decision_packet_ready_no_repair_executed";

const report = {
  status,
  mode: "tw_equity_schema_exposure_repair_decision_packet",
  acceptedEvidence: {
    boundedWriteAttemptsFailedClosedWithPgrst205: true,
    localInsertContractClean: true,
    openApiReachableAndParsed: true,
    stagingTablesMissingFromOpenApiSchema: true
  },
  ceoDecision: {
    rootCauseCandidate: "postgrest_schema_exposure_or_schema_cache_mismatch",
    rejectedCurrentCauses: [
      "candidate_generation",
      "runner_target_naming",
      "local_insert_column_shape"
    ],
    nextRepairRoute: [
      "inspect_supabase_dashboard_api_schema_exposure_for_public_schema",
      "confirm_canonical_staging_tables_in_rest_openapi_schema",
      "perform_non_data_changing_dashboard_schema_cache_or_exposure_refresh_if_available",
      "rerun_exactly_one_bounded_postgrest_schema_exposure_probe",
      "prepare_separate_third_bounded_staging_write_decision_only_after_complete_openapi_exposure"
    ]
  },
  futureAllowedActions: {
    dashboardInspectionInstructions: true,
    localCheckers: true,
    nonDataChangingSchemaCacheRefreshDecision: true,
    rerunBoundedReadonlySchemaExposureProbeAfterRepair: true,
    thirdWriteAttemptAllowedByThisPacket: false
  },
  safety: {
    connectionAttempted: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    migrationExecuted: false,
    publicDataSource: "mock",
    publicPromotionAllowed: false,
    rawOpenApiPrinted: false,
    rawPayloadsPrinted: false,
    rowCoveragePointsAllowed: false,
    rowPayloadsPrinted: false,
    scoreSource: "mock",
    scoreSourceRealAllowed: false,
    secretsPrinted: false,
    sqlExecuted: false,
    stagingRowsCreated: false,
    supabaseWriteAttempted: false
  },
  nextPmAction:
    "Create a schema exposure repair runbook and accepted/rejected outcome record before any new remote write decision."
};

console.log(JSON.stringify(report, null, 2));
