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
    status: "blocked";
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
    current: 88,
    label: "Supabase schema / repository readiness",
    note:
      "Schema, repository, validator, and readonly preflight scaffolding are prepared. Supabase network diagnostic shows DNS ok but TCP 443 blocked before TLS and REST.",
    owner: "Engineering",
    weight: 15
  },
  {
    current: 55,
    label: "Data freshness and quality evidence",
    note:
      "freshness interpretation, data_runs baseline, and data_freshness candidate handling are partially prepared. Supabase readonly runtime activation remains blocked by TCP 443; scoreSource stays mock and ingestion remains off.",
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
    current: 73,
    label: "CEO execution focus",
    note:
      "CEO has narrowed the work toward runtime product slices and root-cause blockers. Generic readonly attempts stay paused until TCP 443, firewall, proxy, or endpoint-security issues are resolved.",
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
      currentFinding: "Supabase network diagnostic: DNS ok, TCP 443 blocked before TLS and REST.",
      impact:
        "Remote readonly attempts can remain misleading while outbound HTTPS is blocked. publicDataSource and scoreSource must remain mock.",
      nextAction:
        "Resolve firewall, proxy, VPN, or endpoint-security blocking for TCP 443 before running another bounded readonly gate.",
      status: "blocked"
    },
    nextLift:
      "Keep runtime mock hardening and source-state wording moving while the network blocker is isolated; do not promote public source or scoreSource=real.",
    rawScore: Number(rawScore.toFixed(2)),
    stage:
      "Mock MVP runtime guard is active. Supabase object reachability evidence exists, but the current network layer still blocks TCP 443; ingestion, SQL, publicDataSource=supabase, and scoreSource=real remain blocked."
  };
}
