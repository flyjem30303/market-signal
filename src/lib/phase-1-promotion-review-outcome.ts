import { buildDataQualityScoreContract } from "@/lib/data-quality-score-contract";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getPhase1SourceDepthAcceptanceContract } from "@/lib/phase-1-source-depth-acceptance-contract";

export type Phase1PromotionReviewId = "data_quality" | "source_depth";

export type Phase1PromotionReviewOutcome = {
  acceptedEvidence: string[];
  id: Phase1PromotionReviewId;
  minFixes: string[];
  outcome: "accepted" | "rejected_for_promotion";
  reason: string;
};

export type Phase1PromotionReviewOutcomeSummary = {
  canPromotePublicDataSourceToSupabase: false;
  canSetScoreSourceReal: false;
  mode: "phase_1_promotion_review_outcome";
  outcomes: Phase1PromotionReviewOutcome[];
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "partially_accepted";
};

export function getPhase1PromotionReviewOutcomeSummary(): Phase1PromotionReviewOutcomeSummary {
  const quality = buildDataQualityScoreContract();
  const runtime = getPostReadonlyRuntimeState();
  const sourceDepth = getPhase1SourceDepthAcceptanceContract();

  const dataQualityAccepted = quality.score >= quality.passThreshold;

  return {
    canPromotePublicDataSourceToSupabase: false,
    canSetScoreSourceReal: false,
    mode: "phase_1_promotion_review_outcome",
    outcomes: [
      {
        acceptedEvidence: [
          `${runtime.rowCoverage.observedRows}/${runtime.rowCoverage.expectedRows} Phase 1 rows read back`,
          "readonly market-signal adapter has local preload verification",
          `${quality.score}/${quality.passThreshold} local data-quality threshold`
        ],
        id: "data_quality",
        minFixes: dataQualityAccepted
          ? ["keep scoreSource=mock until source-depth, source-rights, model, and claim reviews pass"]
          : [
              `raise data-quality evidence from ${quality.score}/${quality.passThreshold} to at least ${quality.passThreshold}`,
              "accept downgrade rules and public disclosure wording",
              "keep scoreSource=mock until model and claim reviews pass"
            ],
        outcome: dataQualityAccepted ? "accepted" : "rejected_for_promotion",
        reason: dataQualityAccepted
          ? "Row coverage, field validity, downgrade rules, and public disclosure now pass the local data-quality threshold."
          : "Row coverage and adapter shape are ready, but data-quality evidence is still below the real-score threshold."
      },
      {
        acceptedEvidence: [
          `${sourceDepth.acceptedRoutes.length} official open-data routes accepted locally for delayed public display and derived metrics`,
          "TWII and listed-stock open-data routes have source URL, OGL v1 license, free charge, daily cadence, attribution, and OpenAPI documentation recorded",
          "public copy already shows source, delay, mock boundary, and non-investment-advice disclaimers",
          "no raw market payload, stock id payload, or secret is exposed"
        ],
        id: "source_depth",
        minFixes: [
          sourceDepth.blockedScopes[0].nextAction,
          "keep redistribution, export, and API reuse blocked until a later source-rights packet accepts them",
          "keep publicDataSource=mock until this source-depth packet is accepted"
        ],
        outcome: "rejected_for_promotion",
        reason:
          "TWII and listed-stock open-data routes are locally source-depth acceptable, but ETF source-rights coverage for 0050/006208 remains unresolved."
      }
    ],
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "partially_accepted"
  };
}
