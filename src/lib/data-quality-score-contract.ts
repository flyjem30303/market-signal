import { buildRowCoverageContract, type RowCoverageContract } from "@/lib/row-coverage-contract";
import {
  buildDataQualityFieldValidityContract,
  type DataQualityFieldValidityContract
} from "@/lib/data-quality-field-validity";

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
  fieldValidity: DataQualityFieldValidityContract;
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
  const fieldValidity = buildDataQualityFieldValidityContract();
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
      state: rowCoverage.status === "complete" ? "complete" : "missing"
    },
    {
      code: "field-validity",
      label: "Field validity proven",
      maxPoints: 15,
      owner: "Data",
      points: fieldValidity.canAwardDataQualityPoints ? 15 : 0,
      state:
        fieldValidity.approvalState === "local_qa_reviewed" && fieldValidity.canAwardDataQualityPoints
          ? "complete"
          : "missing"
    },
    {
      code: "downgrade-rules",
      label: "Downgrade rules role-reviewed",
      maxPoints: 15,
      owner: "Investment",
      points: fieldValidity.downgradeRules.length >= 4 ? 15 : 0,
      state: fieldValidity.downgradeRules.length >= 4 ? "complete" : "missing"
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
      points: 10,
      state: "complete"
    }
  ];
  const score = factors.reduce((sum, factor) => sum + factor.points, 0);

  return {
    canCountAsRealScoreEvidence: false,
    factors,
    fieldValidity,
    nextLift:
      score >= 80
        ? "Data-quality threshold is locally accepted for Phase 1; next lift is source-rights/source-depth acceptance before any public real-data promotion."
        : "Close row coverage, field validity, downgrade, and disclosure evidence before data-quality can pass the 80-point threshold.",
    passThreshold: 80,
    publicDataSource: "mock",
    rowCoverage,
    score,
    scoreSource: "mock",
    stopLine:
      "Data quality score contract is local-only; do not run SQL, write Supabase, ingest market data, change public source, or set scoreSource=real. Source rights remain a separate promotion blocker."
  };
}
