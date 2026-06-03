import { getDataReadinessDecisionSummary } from "@/lib/data-readiness-decision-summary";
import { buildDataQualityScoreContract } from "@/lib/data-quality-score-contract";

export type DataEvidenceLadderStageId =
  | "schema-shape"
  | "freshness-metadata"
  | "row-coverage"
  | "data-quality"
  | "source-depth"
  | "real-score-candidacy";

export type DataEvidenceLadderStage = {
  acceptedEvidence: string;
  blockedPromotion: string;
  exitCriteria: string;
  id: DataEvidenceLadderStageId;
  label: string;
  nextAction: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "Legal" | "PM" | "QA";
  state: "accepted" | "blocked" | "readying";
};

export type DataEvidenceLadderSummary = {
  activeStage: DataEvidenceLadderStageId;
  headline: string;
  mode: "data_evidence_ladder";
  nextDecision: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  stages: DataEvidenceLadderStage[];
  stopLine: string;
};

export function getDataEvidenceLadderSummary(): DataEvidenceLadderSummary {
  const readiness = getDataReadinessDecisionSummary();
  const quality = buildDataQualityScoreContract();
  const byId = new Map(readiness.lanes.map((lane) => [lane.id, lane]));
  const schema = byId.get("schema-shape");
  const freshness = byId.get("freshness-metadata");
  const rowCoverage = byId.get("row-coverage");
  const qualitySourceDepth = byId.get("quality-source-depth");

  return {
    activeStage: "schema-shape",
    headline: "Data evidence ladder keeps the next promotion path explicit.",
    mode: "data_evidence_ladder",
    nextDecision:
      "Finish schema-shape and freshness interpretation before discussing row coverage credit, quality promotion, or real-score candidacy.",
    publicDataSource: readiness.safety.publicDataSource,
    scoreSource: readiness.safety.scoreSource,
    stages: [
      {
        acceptedEvidence: schema?.evidence ?? "Schema evidence not loaded.",
        blockedPromotion: "row completeness, freshness, source rights, public source promotion",
        exitCriteria: "All runtime object shapes have accepted local contracts or explicit remote-only blockers.",
        id: "schema-shape",
        label: "Schema shape interpretation",
        nextAction: schema?.nextAction ?? "Reconcile runtime schema shape before any downstream promotion.",
        owner: "Engineering",
        state: schema?.state ?? "readying"
      },
      {
        acceptedEvidence: freshness?.evidence ?? "Freshness evidence not loaded.",
        blockedPromotion: "market-data quality, real score, investment-grade freshness claim",
        exitCriteria: "Freshness metadata remains mapped to the active repository boundary without public-source promotion.",
        id: "freshness-metadata",
        label: "Freshness metadata interpretation",
        nextAction: freshness?.nextAction ?? "Keep freshness metadata as review evidence only.",
        owner: "QA",
        state: freshness?.state ?? "readying"
      },
      {
        acceptedEvidence: rowCoverage?.evidence ?? "Row coverage evidence not loaded.",
        blockedPromotion: "row coverage points, publicDataSource=supabase, scoreSource=real",
        exitCriteria: "A CEO-named bounded readonly attempt is reviewed and accepted without row payloads or promotion jumps.",
        id: "row-coverage",
        label: "Row coverage evidence",
        nextAction: rowCoverage?.nextAction ?? "Keep row coverage remote-paused until separately named.",
        owner: "Data",
        state: rowCoverage?.state ?? "blocked"
      },
      {
        acceptedEvidence: `${quality.score}/${quality.passThreshold} local quality score; real-score evidence remains false.`,
        blockedPromotion: "data quality pass, model score use, scoreSource=real",
        exitCriteria: "Row coverage, field validity, downgrade rules, source rights, and disclosure pass the quality threshold.",
        id: "data-quality",
        label: "Data quality score threshold",
        nextAction: quality.nextLift,
        owner: "Data",
        state: "blocked"
      },
      {
        acceptedEvidence: qualitySourceDepth?.evidence ?? "Source-depth evidence remains blocked.",
        blockedPromotion: "professional investment claim, source-depth readiness, public credibility claim",
        exitCriteria: "Investment, Legal, QA, and PM accept source rights, model limits, and public claim language.",
        id: "source-depth",
        label: "Source depth and credibility",
        nextAction:
          qualitySourceDepth?.nextAction ??
          "Keep source-depth evidence blocked until role-reviewed credibility evidence is accepted.",
        owner: "Investment",
        state: qualitySourceDepth?.state ?? "blocked"
      },
      {
        acceptedEvidence: "No real-score evidence is accepted yet.",
        blockedPromotion: "real runtime, production score, investment-grade decision support",
        exitCriteria: "All earlier evidence stages pass, public claim wording is approved, and release gate accepts the source.",
        id: "real-score-candidacy",
        label: "Real-score candidacy",
        nextAction: "Do not open real-score candidacy until the evidence ladder reaches accepted quality and source-depth gates.",
        owner: "CEO",
        state: "blocked"
      }
    ],
    stopLine:
      "Data evidence ladder does not run SQL, write Supabase, fetch or ingest market data, print secrets, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
  };
}
