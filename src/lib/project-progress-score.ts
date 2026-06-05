import { getDataCoverageRouteDecision, type DataCoverageRouteDecision } from "@/lib/data-coverage-route-decision";
import { buildDataQualityEvidenceGate, type DataQualityEvidenceGate } from "@/lib/data-quality-evidence-gate";
import { buildDataQualityScoreContract, type DataQualityScoreContract } from "@/lib/data-quality-score-contract";
import {
  getBlockerClosureReadinessGate,
  type BlockerClosureReadinessGate
} from "@/lib/blocker-closure-readiness-gate";

export type ProjectProgressLane = {
  current: number;
  label: string;
  note: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "PM";
  weight: number;
};

export type ProjectProgressSummary = {
  adjustedScore: number;
  blockerClosureReadinessGate: BlockerClosureReadinessGate;
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
    current: 88,
    label: "Mock MVP product surface",
    note:
      "Home, briefing, stock pages, legal pages, runtime disclosures, runtime next-step links, freshness strips, and dev recovery are usable for mock-only product validation; public runtime surfaces and health contracts no longer depend on mojibake copy.",
    owner: "PM",
    weight: 15
  },
  {
    current: 86,
    label: "Mock signal reading flow",
    note:
      "Mock runtime signals, ETF/equity placeholders, product summary cards, risk-reading flows, and legal/weekly/briefing boundaries are coherent enough for product testing, with action summaries and next-step links kept readable, non-advisory, and non-real-data.",
    owner: "PM",
    weight: 15
  },
  {
    current: 90,
    label: "Runtime state guard",
    note:
      "mock-only, not_ready, blocked states, manual gates, review gates, fail-closed behavior, readable runtime/progress display fields, shared public boundary helpers, and A2 first-screen internal-token regression blocking are in place.",
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
    current: 95,
    label: "Data freshness and quality evidence",
    note:
      "Object reachability, daily_prices schema shape, freshness interpretation, data_runs baseline, data_freshness candidate handling, freshness metadata, Supabase readonly runtime activation, local data foundation gate, blocker closure readiness, row coverage acceptance, report-only backfill planning, field validity QA review, data quality score contract, source-rights placement, promotion prerequisites gate, no-write coverage quality route, source-specific acceptance packets, mock MVP data coverage deferral decision, and post-MVP promotion execution readiness are consolidated locally. Row coverage completion, data quality threshold, source rights, and source-depth still block promotion; scoreSource stays mock.",
    owner: "Data",
    weight: 15
  },
  {
    current: 80,
    label: "Investment credibility evidence",
    note:
      "Model credibility checklist, local Investment review, acceptance gate, readable investor indicator roadmap, non-advisory outcome, backtest method limits, stock/briefing action copy, source-rights linkage, data-readiness linkage, formula version posture, fail-closed downgrade policy, public claim checklist, runtime-state mapping, and source-rights placement are now local MVP review evidence. Real scoring, ranking, advice, model confidence, and performance claims remain blocked.",
    owner: "Investment",
    weight: 10
  },
  {
    current: 83,
    label: "CEO execution focus",
    note:
      "CEO has shifted sequencing toward larger runtime product slices, public trust readability, A2 scanner hardening, data/runtime foundation gates, closure readiness, stale-checker cleanup, and the post-readonly evidence queue. Future remote attempts stay separately named and bounded.",
    owner: "CEO",
    weight: 10
  },
  {
    current: 88,
    label: "DevOps / health / recovery",
    note:
      "localhost health, TypeScript, review gates, language-quality gates, and dev-server recovery tools are available. Health config, full localhost health, and recovery checkers now use stable readable tokens instead of corrupted copy.",
    owner: "Engineering",
    weight: 5
  }
];

export function getProjectProgressSummary(): ProjectProgressSummary {
  const dataQualityScoreContract = buildDataQualityScoreContract();
  const dataCoverageRouteDecision = getDataCoverageRouteDecision();
  const blockerClosureReadinessGate = getBlockerClosureReadinessGate();
  const dataQualityEvidenceGate = buildDataQualityEvidenceGate({
    dataQualityScore: dataQualityScoreContract.score,
    freshnessState: "complete"
  });
  const rawScore = projectProgressLanes.reduce((sum, lane) => sum + (lane.current * lane.weight) / 100, 0);
  const adjustedScore = Math.floor(rawScore - 2);

  return {
    adjustedScore,
    blockerClosureReadinessGate,
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
