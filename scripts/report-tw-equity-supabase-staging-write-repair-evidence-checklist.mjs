const checklist = {
  status: "tw_equity_supabase_staging_write_repair_evidence_checklist_ready_no_remote_action",
  decision: "REPAIR_EVIDENCE_CHECKLIST_READY_BEFORE_ANY_REPAIR_OR_THIRD_ATTEMPT",
  acceptedEvidence: {
    firstAttemptPgrst205NoMutation: true,
    readOnlyCanonicalObjectsReachable: true,
    secondAttemptPgrst205NoMutation: true,
    candidateArtifactAccepted: true,
    candidateInputRunRows: 1,
    candidateInputPriceRows: 180,
    runtimePublicPosture: "mock_only"
  },
  checklistCategories: [
    "REST insert schema exposure",
    "PostgREST schema cache",
    "object and schema name match",
    "RLS and policy posture",
    "read-only versus insert path match",
    "insert payload and column contract"
  ],
  routeDecisionMatrix: {
    dashboardManualSchemaCacheRepair: "requires C1/C2 metadata exposure or cache mismatch evidence",
    sqlMigrationRepairPacket: "draft_or_review_only_until_separately_accepted",
    runnerTargetOrPayloadRepair: "local_code_work_only_after C3/C5/C6 mismatch evidence",
    boundedReadOnlyDiagnostic: "requires_separate_exact_non_mutating_decision_packet",
    thirdBoundedWriteAttempt: "blocked_until_checklist_evidence_and_separate_one_attempt_packet"
  },
  nextAction:
    "Create or fill a repair evidence collection record; do not perform repair, SQL, migration, read-only remote diagnostic, or third write attempt in the same slice.",
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

console.log(JSON.stringify(checklist, null, 2));
