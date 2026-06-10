const target = Object.freeze({
  targetTable: "daily_prices",
  targetLane: "TWII",
  targetScope: "twii_index_daily_prices_missing_rows",
  maxRows: 60
});

const contractNames = Object.freeze([
  "server_only_module_boundary",
  "credential_presence_shape_only",
  "bounded_insert_missing_only_contract",
  "aggregate_readback_contract",
  "post_write_review_contract"
]);

const blockedActions = Object.freeze([
  "supabase_client_import",
  "credential_value_read",
  "supabase_connection_attempt",
  "daily_prices_mutation",
  "raw_market_data_fetch",
  "row_payload_output",
  "stock_id_payload_output",
  "scoreSource_real_promotion"
]);

export function describeTwiiServerOnlyImplementationScaffold() {
  return {
    status: "twii_server_only_implementation_scaffold_ready_no_execution",
    outcome: "server_only_implementation_scaffold_ready_runtime_still_blocked",
    scaffoldMode: "server_only_implementation_scaffold_no_execution",
    owner: "CEO/PM",
    target,
    contracts: {
      serverOnlyModuleBoundaryPrepared: true,
      credentialPresenceShapePrepared: true,
      boundedInsertMissingOnlyContractPrepared: true,
      aggregateReadbackContractPrepared: true,
      postWriteReviewContractPrepared: true
    },
    contractNames,
    blockedActions,
    noExecutionState: noExecutionState(),
    safety: safety()
  };
}

export function prepareCredentialPresenceShape() {
  return {
    contract: "credential_presence_shape_only",
    prepared: true,
    valueReadAllowed: false,
    expectedResultKeys: ["hasUrlShape", "hasServiceCredentialShape", "missingNames", "unsafeProblemCount"],
    outputMode: "boolean_and_missing_name_only"
  };
}

export function prepareBoundedInsertMissingOnlyContract() {
  return {
    contract: "bounded_insert_missing_only_contract",
    prepared: true,
    executableNow: false,
    target,
    rowLimit: 60,
    mutationAllowedNow: false,
    duplicateHandling: "missing_only_contract_not_executed"
  };
}

export function prepareAggregateReadbackContract() {
  return {
    contract: "aggregate_readback_contract",
    prepared: true,
    executableNow: false,
    outputMode: "aggregate_counts_only",
    rowPayloadAllowed: false
  };
}

export function preparePostWriteReviewContract() {
  return {
    contract: "post_write_review_contract",
    prepared: true,
    executableNow: false,
    requiredOutcomeKeys: ["attemptId", "insertedCount", "duplicateCount", "rejectedCount", "rollbackReady"]
  };
}

function noExecutionState() {
  return {
    executeRequested: false,
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseWritesEnabled: false,
    credentialValuesRead: false,
    dailyPricesMutated: false,
    candidateRowsAccepted: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  };
}

function safety() {
  return {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    credentialValuesRead: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  };
}
