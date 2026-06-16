import { getPhase1PromotionReviewOutcomeSummary } from "@/lib/phase-1-promotion-review-outcome";
import { getPostReadonlyNextGateQueue } from "@/lib/post-readonly-next-gate-queue";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";

export type Phase1RuntimePromotionFinalBlockerId =
  | "bounded_execution_packet"
  | "aggregate_readback"
  | "rollback_or_quarantine"
  | "operator_decision"
  | "public_runtime_factory_switch";

export type Phase1RuntimePromotionFinalBlocker = {
  id: Phase1RuntimePromotionFinalBlockerId;
  reason: string;
  nextAction: string;
};

export type Phase1RuntimePromotionFinalBlockerContract = {
  acceptedLocalEvidence: string[];
  blockers: Phase1RuntimePromotionFinalBlocker[];
  canPromotePublicDataSourceToSupabase: false;
  canSetScoreSourceReal: false;
  mode: "phase_1_runtime_promotion_final_blocker_contract";
  phase1Universe: "twii_plus_listed_stock_daily_close";
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "ready_for_bounded_runtime_promotion_preflight_no_go";
  stopLine: string;
  summary: string;
};

export function getPhase1RuntimePromotionFinalBlockerContract(): Phase1RuntimePromotionFinalBlockerContract {
  const runtime = getPostReadonlyRuntimeState();
  const promotion = getPhase1PromotionReviewOutcomeSummary();
  const queue = getPostReadonlyNextGateQueue();
  const acceptedOutcomes = promotion.outcomes.filter((outcome) => outcome.outcome === "accepted");

  return {
    acceptedLocalEvidence: [
      `${runtime.rowCoverage.observedRows}/${runtime.rowCoverage.expectedRows} Phase 1 rows covered for the narrowed universe`,
      `${acceptedOutcomes.length}/${promotion.outcomes.length} promotion review outcomes accepted locally`,
      `${queue.gateSummary.localReadyCount}/${queue.items.length} next-gate items ready for local use`,
      "Phase 1 source depth accepted for TWII plus listed-stock daily close; ETF coverage is deferred to Phase 1.1"
    ],
    blockers: [
      {
        id: "bounded_execution_packet",
        nextAction: "Prepare the exact bounded execution packet, but do not execute it in this gate.",
        reason: "The public runtime cannot switch until the bounded attempt command, inputs, and stop-line are explicit."
      },
      {
        id: "aggregate_readback",
        nextAction: "Keep aggregate-only readback requirements attached to the bounded execution packet.",
        reason: "Runtime promotion needs post-attempt aggregate proof without exposing row payloads or stock-id payloads."
      },
      {
        id: "rollback_or_quarantine",
        nextAction: "Keep rollback or quarantine criteria explicit before any runtime switch.",
        reason: "A failed or partial attempt must have a known safe return path."
      },
      {
        id: "operator_decision",
        nextAction: "Record a separate GO/NO-GO decision before any write or public runtime switch.",
        reason: "This contract is readiness-only and does not authorize execution."
      },
      {
        id: "public_runtime_factory_switch",
        nextAction: "Switch the public runtime factory only after bounded execution, readback, rollback, and claim gates pass.",
        reason: "The app must keep mock public output until real-data evidence is deliberately promoted."
      }
    ],
    canPromotePublicDataSourceToSupabase: false,
    canSetScoreSourceReal: false,
    mode: "phase_1_runtime_promotion_final_blocker_contract",
    phase1Universe: "twii_plus_listed_stock_daily_close",
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "ready_for_bounded_runtime_promotion_preflight_no_go",
    stopLine:
      "Do not run SQL, write Supabase, mutate daily_prices, fetch raw market data, print secrets, set publicDataSource=supabase, or set scoreSource=real from this contract.",
    summary:
      "Phase 1 data/source scope is locally ready; the remaining work is bounded runtime promotion execution discipline, not ETF/source-depth repair."
  };
}
