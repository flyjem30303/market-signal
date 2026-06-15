const target = Object.freeze({
  targetTable: "daily_prices",
  targetScope: "twii_and_etf_phase_1_missing_row_closure_only",
  fullLevel1ExpectedRows: 360,
  fullLevel1ObservedRows: 182,
  fullLevel1MissingRows: 178,
  twiiMissingRows: 60,
  etfMissingRows: 118
});

const contractNames = Object.freeze([
  "server_only_module_boundary",
  "credential_presence_shape_only",
  "sanitized_candidate_artifact_path_shape",
  "bounded_insert_missing_only_contract",
  "aggregate_readback_contract",
  "rollback_or_quarantine_contract",
  "post_write_review_contract",
  "runtime_promotion_contract"
]);

const blockedActions = Object.freeze([
  "supabase_client_import",
  "credential_value_read",
  "supabase_connection_attempt",
  "sql_execution",
  "daily_prices_mutation",
  "staging_rows_creation",
  "candidate_row_acceptance",
  "raw_market_data_fetch",
  "raw_payload_output",
  "row_payload_output",
  "secret_output",
  "public_data_source_real_promotion",
  "score_source_real_promotion",
  "investment_advice_claim"
]);

export function describePhase1WriteRunnerServerOnlyScaffold() {
  return {
    status: "phase_1_write_runner_server_only_scaffold_no_execution_ready",
    outcome: "server_only_scaffold_ready_runtime_still_blocked",
    scaffoldMode: "phase_1_write_runner_server_only_scaffold_no_execution",
    owner: "CEO/PM",
    sourceScopePacketPath: "data/evidence-intake/phase-1-write-runner-implementation-scope-packet-no-execution.json",
    modulePath: "scripts/lib/phase-1-write-runner-server-only-scaffold.mjs",
    target,
    contracts: {
      serverOnlyModuleBoundaryPrepared: true,
      credentialPresenceShapePrepared: true,
      sanitizedCandidateArtifactPathShapePrepared: true,
      boundedInsertMissingOnlyContractPrepared: true,
      aggregateReadbackContractPrepared: true,
      rollbackOrQuarantineContractPrepared: true,
      postWriteReviewContractPrepared: true,
      runtimePromotionContractPrepared: true
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

export function prepareSanitizedCandidateArtifactPathShape() {
  return {
    contract: "sanitized_candidate_artifact_path_shape",
    prepared: true,
    rowPayloadAllowed: false,
    rawPayloadAllowed: false,
    expectedPathKeys: ["twiiCandidateArtifactPath", "etfCandidateArtifactPath"],
    outputMode: "path_presence_and_aggregate_counts_only"
  };
}

export function prepareBoundedInsertMissingOnlyContract() {
  return {
    contract: "bounded_insert_missing_only_contract",
    prepared: true,
    executableNow: false,
    target,
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

export function prepareRollbackOrQuarantineContract() {
  return {
    contract: "rollback_or_quarantine_contract",
    prepared: true,
    executableNow: false,
    rollbackRequiredBeforePromotion: true,
    quarantineAllowedBeforePromotion: true
  };
}

export function preparePostWriteReviewContract() {
  return {
    contract: "post_write_review_contract",
    prepared: true,
    executableNow: false,
    requiredOutcomeKeys: ["attemptId", "insertedCount", "duplicateCount", "rejectedCount", "readbackCount", "rollbackReady"]
  };
}

export function prepareRuntimePromotionContract() {
  return {
    contract: "runtime_promotion_contract",
    prepared: true,
    executableNow: false,
    requiredBeforePromotion: [
      "bounded_write_attempt_accepted",
      "aggregate_readback_accepted",
      "public_copy_real_source_ready",
      "runtime_fallback_ready"
    ]
  };
}

function noExecutionState() {
  return {
    executeRequested: false,
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    credentialValuesRead: false,
    marketDataFetched: false,
    marketDataIngested: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    candidateRowsAccepted: false,
    runnerExecutableNow: false,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false,
    promotionAllowed: false,
    scoreSourceRealAllowed: false
  };
}

function safety() {
  return {
    publicDataSource: "mock",
    scoreSource: "mock",
    valuesRead: false,
    valuesStored: false,
    valuesPrinted: false,
    credentialValueRead: false,
    credentialValuePrinted: false,
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false,
    investmentAdviceClaimAllowed: false
  };
}
