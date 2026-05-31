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
  canAwardRowCoveragePoints: false;
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
  rowCoverageStatus: "not_ready";
  scoreSource: "mock";
  status: "not_ready";
  stopLine: string;
  targetRelation: "daily_prices";
  validationSource: "local_contract_only";
};

export function buildRowCoverageReadonlyValidationContract(): RowCoverageReadonlyValidationContract {
  const rowCoverage = buildRowCoverageContract();

  return {
    canAwardRowCoveragePoints: false,
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
    status: "not_ready",
    stopLine:
      "Row coverage read-only validation output contract is local-only; do not connect Supabase, run SQL, fetch market data, write daily_prices, claim coverage, award points, or set scoreSource=real.",
    targetRelation: "daily_prices",
    validationSource: "local_contract_only"
  };
}
