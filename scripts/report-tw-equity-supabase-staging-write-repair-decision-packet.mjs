const report = {
  status: "tw_equity_supabase_staging_write_repair_decision_packet_ready_no_repair_executed",
  decision: "REPAIR_PACKET_READY_STOP_RETRY_UNTIL_CAUSE_ISOLATED",
  evidence: {
    firstAttempt: "tw_equity_staging_first_write_attempt_blocked_pgrst205_no_mutation",
    rootCauseGate: "tw_equity_pgrst205_root_cause_gate_canonical_objects_readable_no_write_retry",
    runnerContractAlignment: "tw_equity_second_write_runner_contract_aligned_not_executed",
    secondAttempt: "tw_equity_staging_second_write_retry_blocked_pgrst205_no_mutation",
    sanitizedProblemCode: "run_insert_failed_PGRST205",
    mutations: false,
    writtenRunRows: 0,
    writtenPriceRows: 0
  },
  repairQuestions: [
    "REST insert schema exposure",
    "PostgREST schema cache",
    "table object existence in exposed schema",
    "RLS and policy posture",
    "hidden target mismatch between read-only and insert paths",
    "insert payload and column contract"
  ],
  allowedNextWork: {
    localSchemaAndRunnerAudit: true,
    repairEvidenceChecklist: true,
    dashboardOperatorChecklist: true,
    readonlyDiagnosticDesignOnly: true,
    readonlyDiagnosticExecutionRequiresSeparateDecision: true,
    repairSqlOrMigrationPacketDraftOnly: true,
    thirdAttemptReadinessPacketOnlyAfterRepairEvidence: true
  },
  forbiddenWork: {
    thirdWriteRetry: true,
    sqlExecution: true,
    migrationExecution: true,
    insertUpdateUpsertDeleteOperation: true,
    stagingRowsCreated: true,
    dailyPricesMutation: true,
    marketDataFetchOrIngestion: true,
    rawPayloadOrSecretOutput: true,
    publicDataSourcePromotion: true,
    rowCoveragePoints: true,
    scoreSourceReal: true
  },
  nextAction:
    "Create a repair evidence collection checklist before any dashboard repair, SQL/migration repair packet, read-only diagnostic, or third write attempt.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    migrationExecuted: false,
    realSupabaseConnectionAttempted: false,
    realSupabaseWrites: false,
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
