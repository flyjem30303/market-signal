export type RowCoverageRequirement = {
  code: string;
  label: string;
  owner: "Data" | "Engineering";
  state: "missing";
};

export type RowCoverageContract = {
  awardedPoints: 0;
  maxPoints: 20;
  nextAction: string;
  publicDataSource: "mock";
  requirements: RowCoverageRequirement[];
  scoreSource: "mock";
  status: "not_ready";
  stopLine: string;
};

export function buildRowCoverageContract(): RowCoverageContract {
  return {
    awardedPoints: 0,
    maxPoints: 20,
    nextAction:
      "Define symbol universe, required trading-date window, expected row count policy, missing-row tolerance, and market-calendar treatment before awarding row coverage points.",
    publicDataSource: "mock",
    requirements: [
      {
        code: "symbol-universe-defined",
        label: "Symbol universe is defined",
        owner: "Data",
        state: "missing"
      },
      {
        code: "coverage-window-defined",
        label: "Coverage date window is defined",
        owner: "Data",
        state: "missing"
      },
      {
        code: "expected-row-policy-defined",
        label: "Expected row count policy is defined",
        owner: "Data",
        state: "missing"
      },
      {
        code: "missing-row-tolerance-defined",
        label: "Missing-row tolerance is defined",
        owner: "Engineering",
        state: "missing"
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
      "Row coverage contract is local-only; do not fetch market data, run SQL, write Supabase, claim coverage, or set scoreSource=real."
  };
}
