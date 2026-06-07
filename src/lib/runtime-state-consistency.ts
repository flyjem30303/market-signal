import { getFreshnessReadonlyLatestEvidenceSummary } from "@/lib/freshness-readonly-latest-evidence";
import { getHomeRuntimeActionSummary } from "@/lib/home-runtime-action-summary";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";
import { getRuntimeReadinessSummary, type RuntimeReadinessSummary } from "@/lib/runtime-readiness-score";
import { getSourceDepthBlockerSummary } from "@/lib/source-depth-blockers";

export type RuntimeStateConsistencySummary = {
  consistencyState: "mock_consistent";
  headline: string;
  publicDataSource: "mock";
  readinessState: RuntimeReadinessSummary["status"];
  rowCoverageState: "local_ready_remote_paused";
  scoreSource: "mock";
  sourceDepthState: "not_ready";
  statusLine: string;
  stopLine: string;
};

export function getRuntimeStateConsistencySummary(): RuntimeStateConsistencySummary {
  const actionSummary = getHomeRuntimeActionSummary();
  const readiness = getRuntimeReadinessSummary();
  const rowCoverage = getRowCoverageSecondAttemptReadiness();
  const sourceDepth = getSourceDepthBlockerSummary();
  const freshnessEvidence = getFreshnessReadonlyLatestEvidenceSummary();

  return {
    consistencyState: "mock_consistent",
    headline: "Runtime 狀態一致：公開資料為示範，準備度持續推進，來源深度尚未就緒",
    publicDataSource: "mock",
    readinessState: readiness.status,
    rowCoverageState: rowCoverage.readiness,
    scoreSource: "mock",
    sourceDepthState: sourceDepth.sourceDepthState,
    statusLine: `${actionSummary.nextAction}：新鮮度證據已整理，覆蓋率仍待補齊，來源深度尚未就緒。`,
    stopLine:
      "在覆蓋率、來源權利、來源深度、模型可信度與執行後覆核通過前，所有公開頁都必須維持示範資料與示範分數。"
  };
}
