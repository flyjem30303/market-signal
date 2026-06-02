import { getHomeRuntimeActionSummary } from "@/lib/home-runtime-action-summary";
import { getRuntimeGateDecisionBrief } from "@/lib/runtime-gate-decision-brief";
import { getRuntimeStateConsistencySummary } from "@/lib/runtime-state-consistency";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";

export type RuntimeFailClosedSummary = {
  allowedState: "mock_runtime_only";
  blockedActions: string[];
  failClosedState: "active";
  headline: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  statusLine: string;
  stopLine: string;
};

export function getRuntimeFailClosedSummary(): RuntimeFailClosedSummary {
  const actionSummary = getHomeRuntimeActionSummary();
  const gateBrief = getRuntimeGateDecisionBrief();
  const consistency = getRuntimeStateConsistencySummary();
  const sourceDepth = getSourceDepthBlockerSummary();

  return {
    allowedState: "mock_runtime_only",
    blockedActions: [
      "Supabase-backed public data",
      "SQL-backed scoring",
      "market-data ingestion",
      "publicDataSource=supabase",
      "scoreSource=real"
    ],
    failClosedState: "active",
    headline: "Fail-closed runtime guard is active",
    publicDataSource: "mock",
    scoreSource: "mock",
    statusLine: `${actionSummary.nextAction}; ${consistency.consistencyState}; source depth ${sourceDepth.sourceDepthState}; remote trigger ${gateBrief.separateRemoteTrigger}.`,
    stopLine:
      "Fail closed before Supabase reads, SQL, ingestion, public source promotion, or scoreSource=real unless a separate accepted gate explicitly authorizes that exact action."
  };
}
