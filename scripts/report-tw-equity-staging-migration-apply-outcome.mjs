import fs from "node:fs";

const ledgerPath = "data/source-gates/tw-equity-staging-migration-apply-outcomes.json";
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
const latest = ledger.outcomes.at(-1);

const report = {
  status:
    latest?.outcome === "accepted"
      ? "tw_equity_staging_migration_apply_outcome_accepted_tables_visible"
      : "tw_equity_staging_migration_apply_outcome_blocked",
  mode: "tw_equity_staging_migration_apply_outcome",
  ledgerPath,
  latestOutcome: {
    id: latest?.id,
    outcome: latest?.outcome,
    recordedBy: latest?.recordedBy,
    decisionNote: latest?.decisionNote,
    allowedNextStepWhenAccepted: latest?.allowedNextStepWhenAccepted
  },
  acceptedEvidence: {
    manualMigration0003ExecutedByChairmanOrOperator: latest?.outcome === "accepted",
    postgrestSchemaReloadExecutedByChairmanOrOperator: latest?.outcome === "accepted",
    publicStagingRunsTableVisibleByOperatorConfirmation: latest?.outcome === "accepted",
    publicStagingPricesTableVisibleByOperatorConfirmation: latest?.outcome === "accepted",
    pmExecutedSqlInThisSlice: false
  },
  nextRoute:
    latest?.outcome === "accepted"
      ? "bounded_post_migration_readonly_verification_only"
      : "create_migration_repair_packet_before_any_verification_or_write",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecutedByPmInThisSlice: false,
    migrationExecutedByPmInThisSlice: false,
    supabaseWriteAuthorized: false,
    supabaseWriteAttemptedByPm: false,
    stagingRowsAuthorized: false,
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
