import { buildRowCoverageContract } from "@/lib/row-coverage-contract";

export type RowCoverageReadonlyOutputField =
  | "calendarStatus"
  | "canAwardRowCoveragePoints"
  | "canSetScoreSourceReal"
  | "expectedTotalRows"
  | "missingRows"
  | "mode"
  | "observedTotalRows"
  | "problems"
  | "remoteConnection"
  | "status"
  | "symbolsChecked";

export type RowCoverageReadonlyValidationContract = {
  canAwardRowCoveragePoints: true;
  canClaimCoverage: false;
  canSetScoreSourceReal: false;
  expectedSymbolCount: 6;
  expectedTotalRows: 360;
  maxMissingRowsForCoverage: 0;
  mode: "row_coverage_readonly_validation_contract";
  outputShapeStatus: "defined_local_only";
  publicDataSource: "mock";
  remoteConnection: "not_run";
  requiredOutputFields: RowCoverageReadonlyOutputField[];
  requiredTradingSessions: 60;
  rowCoverageStatus: "complete";
  scoreSource: "mock";
  status: "complete";
  stopLine: string;
  targetRelation: "daily_prices";
  validationSource: "local_contract_only";
};

export function buildRowCoverageReadonlyValidationContract(): RowCoverageReadonlyValidationContract {
  const rowCoverage = buildRowCoverageContract();

  return {
    canAwardRowCoveragePoints: true,
    canClaimCoverage: false,
    canSetScoreSourceReal: false,
    expectedSymbolCount: rowCoverage.universePolicy.symbols.length as 6,
    expectedTotalRows: rowCoverage.expectedRowPolicy.expectedTotalRows,
    maxMissingRowsForCoverage: rowCoverage.missingRowTolerancePolicy.maxMissingRowsForCoverage,
    mode: "row_coverage_readonly_validation_contract",
    outputShapeStatus: "defined_local_only",
    publicDataSource: "mock",
    remoteConnection: "not_run",
    requiredOutputFields: [
      "status",
      "mode",
      "remoteConnection",
      "symbolsChecked",
      "expectedTotalRows",
      "observedTotalRows",
      "missingRows",
      "calendarStatus",
      "canAwardRowCoveragePoints",
      "canSetScoreSourceReal",
      "problems"
    ],
    requiredTradingSessions: rowCoverage.coverageWindowPolicy.requiredTradingSessions,
    rowCoverageStatus: rowCoverage.status,
    scoreSource: "mock",
    status: "complete",
    stopLine:
      "Row coverage read-only validation output contract is accepted for local Phase 1 scoring only; do not connect Supabase, run SQL, fetch market data, write daily_prices, claim public coverage, promote publicDataSource, or set scoreSource=real.",
    targetRelation: "daily_prices",
    validationSource: "local_contract_only"
  };
}
