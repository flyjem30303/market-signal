import { buildDataQualityScoreContract } from "@/lib/data-quality-score-contract";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";

export type Phase1PromotionReviewId = "data_quality" | "source_depth";

export type Phase1PromotionReviewOutcome = {
  acceptedEvidence: string[];
  id: Phase1PromotionReviewId;
  minFixes: string[];
  outcome: "rejected_for_promotion";
  reason: string;
};

export type Phase1PromotionReviewOutcomeSummary = {
  canPromotePublicDataSourceToSupabase: false;
  canSetScoreSourceReal: false;
  mode: "phase_1_promotion_review_outcome";
  outcomes: Phase1PromotionReviewOutcome[];
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "rejected";
};

export function getPhase1PromotionReviewOutcomeSummary(): Phase1PromotionReviewOutcomeSummary {
  const quality = buildDataQualityScoreContract();
  const runtime = getPostReadonlyRuntimeState();

  return {
    canPromotePublicDataSourceToSupabase: false,
    canSetScoreSourceReal: false,
    mode: "phase_1_promotion_review_outcome",
    outcomes: [
      {
        acceptedEvidence: [
          `${runtime.rowCoverage.observedRows}/${runtime.rowCoverage.expectedRows} Phase 1 rows read back`,
          "readonly market-signal adapter has local preload verification"
        ],
        id: "data_quality",
        minFixes: [
          `raise data-quality evidence from ${quality.score}/${quality.passThreshold} to at least ${quality.passThreshold}`,
          "accept downgrade rules and public disclosure wording",
          "keep scoreSource=mock until model and claim reviews pass"
        ],
        outcome: "rejected_for_promotion",
        reason:
          "Row coverage and adapter shape are ready, but data-quality evidence is still below the real-score threshold."
      },
      {
        acceptedEvidence: [
          "public copy already shows source, delay, mock boundary, and non-investment-advice disclaimers",
          "no raw market payload, stock id payload, or secret is exposed"
        ],
        id: "source_depth",
        minFixes: [
          "accept source attribution, cadence, delay, and non-endorsement wording for the promoted data family",
          "record source-rights outcome for public use of daily close and daily trading fields",
          "keep publicDataSource=mock until this source-depth packet is accepted"
        ],
        outcome: "rejected_for_promotion",
        reason:
          "Source disclosure is usable for mock/public reading, but not yet accepted as a real-data promotion packet."
      }
    ],
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "rejected"
  };
}
