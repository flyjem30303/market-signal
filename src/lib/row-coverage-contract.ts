export type RowCoverageRequirement = {
  code: string;
  label: string;
  owner: "Data" | "Engineering";
  state: "complete" | "missing";
};

export type RowCoverageUniversePolicy = {
  assetTypes: Array<"index" | "etf" | "stock">;
  market: "TW";
  policyStatus: "defined_local_only";
  symbols: string[];
  universeLabel: string;
};

export type RowCoverageWindowPolicy = {
  anchor: "latest approved freshness metadata date";
  doesNotValidateRowCount: true;
  excludesNonTradingDays: true;
  policyStatus: "defined_local_only";
  requiredTradingSessions: 60;
  timezone: "Asia/Taipei";
  windowLabel: "MVP rolling 60 trading sessions";
};

export type RowCoverageExpectedRowPolicy = {
  expectedRowsPerSymbol: 60;
  expectedTotalRows: 360;
  formula: "symbol count x required trading sessions";
  policyStatus: "defined_local_only";
  provesCoverage: false;
  rowGranularity: "one row per symbol per trading session";
};

export type RowCoverageMissingRowTolerancePolicy = {
  actionWhenMissingRowsDetected: "block real-score evidence";
  maxMissingRowsForCoverage: 0;
  maxMissingRowsForScoreSourceReal: 0;
  policyStatus: "defined_local_only";
  requiresOwnerReviewWhenMissingRowsDetected: true;
  toleranceLabel: "zero missing rows before real-score evidence";
};

export type RowCoverageContract = {
  awardedPoints: 0;
  coverageWindowPolicy: RowCoverageWindowPolicy;
  expectedRowPolicy: RowCoverageExpectedRowPolicy;
  maxPoints: 20;
  missingRowTolerancePolicy: RowCoverageMissingRowTolerancePolicy;
  nextAction: string;
  publicDataSource: "mock";
  requirements: RowCoverageRequirement[];
  scoreSource: "mock";
  status: "not_ready";
  stopLine: string;
  universePolicy: RowCoverageUniversePolicy;
};

export function buildRowCoverageContract(): RowCoverageContract {
  const universePolicy: RowCoverageUniversePolicy = {
    assetTypes: ["index", "etf", "stock"],
    market: "TW",
    policyStatus: "defined_local_only",
    symbols: ["TWII", "0050", "006208", "2330", "2382", "2308"],
    universeLabel: "Taiwan MVP watchlist universe"
  };
  const coverageWindowPolicy: RowCoverageWindowPolicy = {
    anchor: "latest approved freshness metadata date",
    doesNotValidateRowCount: true,
    excludesNonTradingDays: true,
    policyStatus: "defined_local_only",
    requiredTradingSessions: 60,
    timezone: "Asia/Taipei",
    windowLabel: "MVP rolling 60 trading sessions"
  };
  const expectedRowPolicy: RowCoverageExpectedRowPolicy = {
    expectedRowsPerSymbol: 60,
    expectedTotalRows: 360,
    formula: "symbol count x required trading sessions",
    policyStatus: "defined_local_only",
    provesCoverage: false,
    rowGranularity: "one row per symbol per trading session"
  };
  const missingRowTolerancePolicy: RowCoverageMissingRowTolerancePolicy = {
    actionWhenMissingRowsDetected: "block real-score evidence",
    maxMissingRowsForCoverage: 0,
    maxMissingRowsForScoreSourceReal: 0,
    policyStatus: "defined_local_only",
    requiresOwnerReviewWhenMissingRowsDetected: true,
    toleranceLabel: "zero missing rows before real-score evidence"
  };

  return {
    awardedPoints: 0,
    coverageWindowPolicy,
    expectedRowPolicy,
    maxPoints: 20,
    missingRowTolerancePolicy,
    nextAction:
      "Define market-calendar treatment before awarding row coverage points.",
    publicDataSource: "mock",
    requirements: [
      {
        code: "symbol-universe-defined",
        label: "Symbol universe is defined",
        owner: "Data",
        state: "complete"
      },
      {
        code: "coverage-window-defined",
        label: "Coverage date window is defined",
        owner: "Data",
        state: "complete"
      },
      {
        code: "expected-row-policy-defined",
        label: "Expected row count policy is defined",
        owner: "Data",
        state: "complete"
      },
      {
        code: "missing-row-tolerance-defined",
        label: "Missing-row tolerance is defined",
        owner: "Engineering",
        state: "complete"
      },
      {
        code: "market-calendar-treatment-defined",
        label: "Market-calendar treatment is defined",
        owner: "Data",
        state: "missing"
      }
    ],
    scoreSource: "mock",
    status: "not_ready",
    stopLine:
      "Row coverage universe, window, expected-row, and missing-row tolerance policies are local-only; do not fetch market data, run SQL, write Supabase, claim coverage, or set scoreSource=real.",
    universePolicy
  };
}
