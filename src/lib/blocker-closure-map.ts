import { getDataEvidenceLadderSummary } from "@/lib/data-evidence-ladder";
import {
  getBlockerReviewDecisionOutcomeLedger,
  type BlockerReviewDecisionOutcomeLedger
} from "@/lib/blocker-review-decision-outcome-ledger";

export type BlockerClosureId = "source-rights-and-disclosure" | "model-credibility" | "data-quality-evidence";

export type BlockerClosureItem = {
  acceptedLocalEvidence: string;
  blockerId: BlockerClosureId;
  blockedPromotion: string;
  lane: "first" | "parallel" | "held";
  nextCommand: string;
  nextDecision: string;
  owner: "Data" | "Investment" | "Legal";
  status: "local_review_ready_external_approval_pending" | "qa_reviewed_no_points_awarded";
};

export type BlockerClosureMap = {
  blockerReviewDecisionOutcomeLedger: BlockerReviewDecisionOutcomeLedger;
  headline: string;
  mode: "blocker_closure_map";
  nextCeoMove: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  sequence: BlockerClosureItem[];
  stopLine: string;
};

export function getBlockerClosureMap(): BlockerClosureMap {
  const evidenceLadder = getDataEvidenceLadderSummary();
  const sourceDepth = evidenceLadder.stages.find((stage) => stage.id === "source-depth");
  const dataQuality = evidenceLadder.stages.find((stage) => stage.id === "data-quality");

  return {
    blockerReviewDecisionOutcomeLedger: getBlockerReviewDecisionOutcomeLedger(),
    headline: "Blocker closure is now sequenced across Legal, Investment, and Data.",
    mode: "blocker_closure_map",
    nextCeoMove:
      "Close Legal source-rights locally first, review Investment credibility in parallel, and hold Data score lift until row coverage and rights evidence are accepted.",
    publicDataSource: "mock",
    scoreSource: "mock",
    sequence: [
      {
        acceptedLocalEvidence:
          "Source-rights disclosure checklist and local review are available, but external source rights remain unverified.",
        blockerId: "source-rights-and-disclosure",
        blockedPromotion: "source-rights approval, redistribution approval, publicDataSource=supabase",
        lane: "first",
        nextCommand: "npm run report:source-rights-disclosure-local-review",
        nextDecision: "Legal records whether attribution, redistribution, delay wording, and public-claim boundaries are acceptable for a future source-specific packet.",
        owner: "Legal",
        status: "local_review_ready_external_approval_pending"
      },
      {
        acceptedLocalEvidence:
          sourceDepth?.acceptedEvidence ?? "Model credibility checklist and local review are available for Investment.",
        blockerId: "model-credibility",
        blockedPromotion: "scoreSource=real, investment-grade interpretation, buy/sell/suitability claims",
        lane: "parallel",
        nextCommand: "npm run report:model-credibility-local-review",
        nextDecision: "Investment reviews score purpose, formula documentation, backtest limits, and downgrade policy without approving real scoring.",
        owner: "Investment",
        status: "local_review_ready_external_approval_pending"
      },
      {
        acceptedLocalEvidence:
          dataQuality?.acceptedEvidence ?? "Field validity QA review is recorded, but no data-quality points are awarded.",
        blockerId: "data-quality-evidence",
        blockedPromotion: "data quality score lift, row coverage points, real-score evidence threshold",
        lane: "held",
        nextCommand: "npm run report:data-quality-field-validity-qa-review",
        nextDecision: "Data keeps field validity review warm while row coverage, source rights, model credibility, and release gates remain blocked.",
        owner: "Data",
        status: "qa_reviewed_no_points_awarded"
      }
    ],
    stopLine:
      "Blocker closure map does not run SQL, write Supabase, fetch or ingest market data, print secrets, approve source rights, promote publicDataSource=supabase, award row coverage points, raise data-quality score, or set scoreSource=real."
  };
}
