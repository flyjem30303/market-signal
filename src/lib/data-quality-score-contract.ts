import { buildRowCoverageContract, type RowCoverageContract } from "@/lib/row-coverage-contract";

export type DataQualityScoreFactor = {
  code: string;
  label: string;
  maxPoints: number;
  owner: "Data" | "Engineering" | "Investment" | "Legal" | "PM";
  points: number;
  state: "complete" | "missing";
};

export type DataQualityScoreContract = {
  canCountAsRealScoreEvidence: false;
  factors: DataQualityScoreFactor[];
  nextLift: string;
  passThreshold: 80;
  publicDataSource: "mock";
  rowCoverage: RowCoverageContract;
  score: number;
  scoreSource: "mock";
  stopLine: string;
};

export function buildDataQualityScoreContract(): DataQualityScoreContract {
  const rowCoverage = buildRowCoverageContract();
  const factors: DataQualityScoreFactor[] = [
    {
      code: "freshness-metadata",
      label: "Freshness metadata complete",
      maxPoints: 25,
      owner: "Engineering",
      points: 25,
      state: "complete"
    },
    {
      code: "row-coverage",
      label: "Row coverage proven",
      maxPoints: 20,
      owner: "Data",
      points: rowCoverage.awardedPoints,
      state: rowCoverage.status === "not_ready" ? "missing" : "missing"
    },
    {
      code: "field-validity",
      label: "Field validity proven",
      maxPoints: 15,
      owner: "Data",
      points: 0,
      state: "missing"
    },
    {
      code: "downgrade-rules",
      label: "Downgrade rules role-reviewed",
      maxPoints: 15,
      owner: "Investment",
      points: 0,
      state: "missing"
    },
    {
      code: "source-rights",
      label: "Source rights approved",
      maxPoints: 15,
      owner: "Legal",
      points: 0,
      state: "missing"
    },
    {
      code: "public-disclosure",
      label: "Public disclosure approved",
      maxPoints: 10,
      owner: "PM",
      points: 0,
      state: "missing"
    }
  ];
  const score = factors.reduce((sum, factor) => sum + factor.points, 0);

  return {
    canCountAsRealScoreEvidence: false,
    factors,
    nextLift:
      rowCoverage.universePolicy.policyStatus === "defined_local_only" &&
      rowCoverage.coverageWindowPolicy.policyStatus === "defined_local_only" &&
      rowCoverage.expectedRowPolicy.policyStatus === "defined_local_only"
        ? "Define missing-row tolerance, market-calendar treatment, and field validity before any score can approach the 80-point real-score evidence threshold."
        : "Define row coverage universe policy before any score can approach the 80-point real-score evidence threshold.",
    passThreshold: 80,
    publicDataSource: "mock",
    rowCoverage,
    score,
    scoreSource: "mock",
    stopLine:
      "Data quality score contract is local-only; do not run SQL, write Supabase, ingest market data, change public source, or set scoreSource=real."
  };
}
