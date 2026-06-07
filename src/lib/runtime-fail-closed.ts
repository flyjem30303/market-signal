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
      "Supabase 支撐的公開資料",
      "SQL 支撐的分數",
      "市場資料匯入",
      "正式公開資料升級",
      "正式分數啟用"
    ],
    failClosedState: "active",
    headline: "Fail-closed runtime guard 已啟用",
    publicDataSource: "mock",
    scoreSource: "mock",
    statusLine: `${actionSummary.nextAction}；runtime 狀態一致；來源深度尚未就緒；遠端動作需另行 gate。`,
    stopLine:
      "除非有獨立且已接受的 gate 明確授權，否則在 Supabase 讀取、SQL、匯入、公開來源升級或正式分數前一律 fail closed。"
  };
}
