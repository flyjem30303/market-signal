import { getBlockerClosureMap, type BlockerClosureId } from "@/lib/blocker-closure-map";
import { getBlockerReadinessSummary } from "@/lib/blocker-readiness";
import { buildDataQualityScoreContract } from "@/lib/data-quality-score-contract";

export type BlockerClosureReadinessItem = {
  blockerId: BlockerClosureId;
  closureState: "local_ready_external_pending" | "held_until_remote_evidence";
  evidence: string;
  nextAction: string;
  owner: "Data" | "Investment" | "Legal";
  promotionBlocked: string;
  readinessPoints: number;
};

export type BlockerClosureReadinessGate = {
  canPromotePublicDataSource: false;
  canRaiseDataQualityScore: false;
  canSetScoreSourceReal: false;
  closurePercent: number;
  headline: string;
  items: BlockerClosureReadinessItem[];
  mode: "blocker_closure_readiness_gate";
  nextCeoMove: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "local_closure_ready_remote_paused";
  stopLine: string;
};

const requiredBlockerClosureIds: BlockerClosureId[] = [
  "source-rights-and-disclosure",
  "model-credibility",
  "data-quality-evidence"
];

export function getBlockerClosureReadinessGate(): BlockerClosureReadinessGate {
  const closureMap = getBlockerClosureMap();
  const blockerReadiness = getBlockerReadinessSummary();
  const dataQualityScore = buildDataQualityScoreContract();
  const items: BlockerClosureReadinessItem[] = requiredBlockerClosureIds.map((blockerId) => {
    const item = closureMap.sequence.find((entry) => entry.blockerId === blockerId) ?? closureMap.sequence[0];
    const readinessLane = blockerReadiness.lanes.find((lane) => lane.blockerId === item.blockerId);
    const heldForRemote =
      item.blockerId === "data-quality-evidence" &&
      dataQualityScore.rowCoverage.status === "not_ready";

    return {
      blockerId: item.blockerId,
      closureState: heldForRemote ? "held_until_remote_evidence" : "local_ready_external_pending",
      evidence: readinessLane?.approvedScope ?? item.acceptedLocalEvidence,
      nextAction: readinessLane?.nextAction ?? item.nextDecision,
      owner: item.owner,
      promotionBlocked: item.blockedPromotion,
      readinessPoints: heldForRemote ? 10 : 20
    };
  });
  const closurePercent = items.reduce((sum, item) => sum + item.readinessPoints, 0);

  return {
    canPromotePublicDataSource: false,
    canRaiseDataQualityScore: false,
    canSetScoreSourceReal: false,
    closurePercent,
    headline: "Blocker closure is consolidated enough for the next bounded decision, but not for promotion.",
    items,
    mode: "blocker_closure_readiness_gate",
    nextCeoMove:
      "Use one combined closure review to keep Legal, Investment, and Data aligned before any separately named row-coverage readonly attempt.",
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "local_closure_ready_remote_paused",
    stopLine:
      "Blocker closure readiness does not run SQL, write Supabase, fetch or ingest market data, approve source rights, raise data-quality score, promote publicDataSource=supabase, or set scoreSource=real."
  };
}
