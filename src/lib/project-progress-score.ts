import { getDataCoverageRouteDecision, type DataCoverageRouteDecision } from "@/lib/data-coverage-route-decision";
import { buildDataQualityEvidenceGate, type DataQualityEvidenceGate } from "@/lib/data-quality-evidence-gate";
import { buildDataQualityScoreContract, type DataQualityScoreContract } from "@/lib/data-quality-score-contract";

export type ProjectProgressLane = {
  current: number;
  label: string;
  note: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "PM";
  weight: number;
};

export type ProjectProgressSummary = {
  adjustedScore: number;
  dataCoverageRouteDecision: DataCoverageRouteDecision;
  dataQualityEvidenceGate: DataQualityEvidenceGate;
  dataQualityScoreContract: DataQualityScoreContract;
  headline: string;
  lanes: ProjectProgressLane[];
  networkBlocker: {
    currentFinding: string;
    impact: string;
    nextAction: string;
    status: "blocked" | "object_reachability_ok";
  };
  nextLift: string;
  rawScore: number;
  stage: string;
};

export const projectProgressLanes: ProjectProgressLane[] = [
  {
    current: 74,
    label: "Mock MVP product surface",
    note:
      "Home, briefing, stock pages, runtime disclosures, and dev recovery are usable for mock-only product validation; they still need cleaner user-facing hierarchy before real-data work.",
    owner: "PM",
    weight: 15
  },
  {
    current: 78,
    label: "Mock signal reading flow",
    note:
      "Mock runtime signals, ETF/equity placeholders, and risk-reading flows are coherent enough for product testing, but remain explicitly non-advisory and non-real-data.",
    owner: "PM",
    weight: 15
  },
  {
    current: 86,
    label: "Runtime state guard",
    note:
      "mock-only, not_ready, blocked states, manual gates, review gates, and fail-closed behavior are in place; next work is consistency and readability.",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 90,
    label: "Supabase schema / repository readiness",
    note:
      "Schema, repository, validator, readonly preflight scaffolding, object reachability, and the daily_prices runtime shape baseline are accepted for local foundation use; promotion evidence still needs separate gates.",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 61,
    label: "Data freshness and quality evidence",
    note:
      "Object reachability, daily_prices schema shape, freshness interpretation, data_runs baseline, data_freshness candidate handling, freshness metadata, and Supabase readonly runtime activation are consolidated in the local data foundation gate. Row coverage, data quality threshold, source rights, and source-depth still block promotion; scoreSource stays mock.",
    owner: "Data",
    weight: 15
  },
  {
    current: 16,
    label: "Investment credibility evidence",
    note:
      "Professional indicator direction is defined at roadmap level only. Source rights, model credibility, data quality, and investment interpretation evidence still block any real-score claim.",
    owner: "Investment",
    weight: 10
  },
  {
    current: 75,
    label: "CEO execution focus",
    note:
      "CEO has shifted sequencing away from UI polish toward data/runtime foundation gates and the post-readonly evidence queue. Future remote attempts stay separately named and bounded.",
    owner: "CEO",
    weight: 10
  },
  {
    current: 80,
    label: "DevOps / health / recovery",
    note:
      "localhost health, build, review gates, and dev-server recovery tools are available. The remaining risk is keeping dev-server and .next recovery predictable during frequent slices.",
    owner: "Engineering",
    weight: 5
  }
];

export function getProjectProgressSummary(): ProjectProgressSummary {
  const dataQualityScoreContract = buildDataQualityScoreContract();
  const dataCoverageRouteDecision = getDataCoverageRouteDecision();
  const dataQualityEvidenceGate = buildDataQualityEvidenceGate({
    dataQualityScore: dataQualityScoreContract.score,
    freshnessState: "complete"
  });
  const rawScore = projectProgressLanes.reduce((sum, lane) => sum + (lane.current * lane.weight) / 100, 0);
  const adjustedScore = Math.floor(rawScore - 2);

  return {
    adjustedScore,
    dataCoverageRouteDecision,
    dataQualityEvidenceGate,
    dataQualityScoreContract,
    headline: `PM project progress: ${adjustedScore}%`,
    lanes: projectProgressLanes,
    networkBlocker: {
      currentFinding: "Supabase readonly validation: object reachability ok; promotion evidence still incomplete.",
      impact:
        "Object reachability is backend evidence only. publicDataSource and scoreSource must remain mock until schema, freshness, row coverage, data quality, and source-depth gates pass.",
      nextAction:
        "Prepare the post-readonly next gate queue and keep SQL, writes, ingestion, public source promotion, and scoreSource=real blocked.",
      status: "object_reachability_ok"
    },
    nextLift:
      "Use accepted object reachability to drive schema shape, freshness, row coverage, data quality, and source-depth preparation; do not promote public source or scoreSource=real.",
    rawScore: Number(rawScore.toFixed(2)),
    stage:
      "Mock MVP runtime guard is active. Supabase object reachability is accepted as backend evidence only; ingestion, SQL, publicDataSource=supabase, and scoreSource=real remain blocked."
  };
}
