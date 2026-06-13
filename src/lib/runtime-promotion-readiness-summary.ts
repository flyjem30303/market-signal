import { getPostReadonlyNextGateQueue, type PostReadonlyNextGateItem } from "@/lib/post-readonly-next-gate-queue";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";

export type RuntimePromotionReadinessStep = {
  blockedPromotion: string;
  id: PostReadonlyNextGateItem["id"];
  label: string;
  nextAction: string;
  owner: PostReadonlyNextGateItem["owner"];
  priority: PostReadonlyNextGateItem["priority"];
  status: "ready_for_local_use" | "blocked_by_evidence" | "needs_review";
};

export type RuntimePromotionReadinessSummary = {
  blockedReason: "aggregate_count_incomplete";
  currentRoute: "keep_mock_runtime_and_prepare_coverage_route";
  headline: string;
  mockBoundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
  };
  mode: "runtime_promotion_readiness_summary";
  nextCeoDecision: string;
  noGoActions: string[];
  overallStatus: "not_ready_for_real_data_promotion";
  readinessCounts: {
    blocked: number;
    needsReview: number;
    ready: number;
    total: number;
  };
  rowCoverage: {
    expectedRows: 360;
    missingRows: 178;
    observedRows: 182;
  };
  steps: RuntimePromotionReadinessStep[];
  stopLine: string;
};

const labels: Record<PostReadonlyNextGateItem["id"], string> = {
  data_quality: "資料品質",
  freshness: "資料新鮮度",
  row_coverage: "資料覆蓋率",
  schema_shape: "欄位結構",
  source_depth: "來源深度"
};

export function getRuntimePromotionReadinessSummary(): RuntimePromotionReadinessSummary {
  const runtime = getPostReadonlyRuntimeState();
  const nextGateQueue = getPostReadonlyNextGateQueue();
  const steps = nextGateQueue.items.map((item): RuntimePromotionReadinessStep => {
    const status =
      item.status === "local_ready"
        ? "ready_for_local_use"
        : item.status === "blocked_waiting_evidence"
          ? "blocked_by_evidence"
          : "needs_review";

    return {
      blockedPromotion: "不能因此宣稱正式資料、正式分數、完整覆蓋或投資建議。",
      id: item.id,
      label: labels[item.id],
      nextAction:
        item.id === "row_coverage"
          ? "補齊覆蓋證據與缺口說明，並保持不寫入、不升級狀態。"
          : "整理可驗證證據，讓 PM 判斷是否能進入下一段公開升級檢查。",
      owner: item.owner,
      priority: item.priority,
      status
    };
  });

  return {
    blockedReason: "aggregate_count_incomplete",
    currentRoute: "keep_mock_runtime_and_prepare_coverage_route",
    headline: "正式資料升級尚未就緒",
    mockBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    mode: "runtime_promotion_readiness_summary",
    nextCeoDecision: "CEO/PM 先補來源、覆蓋率、品質與回退證據，再決定是否進入下一段資料升級檢查。",
    noGoActions: [
      "不執行資料庫寫入",
      "不匯入市場資料",
      "不修改正式價格表",
      "不切換正式公開資料來源",
      "不啟用正式分數",
      "不提供投資建議"
    ],
    overallStatus: "not_ready_for_real_data_promotion",
    readinessCounts: {
      blocked: steps.filter((step) => step.status === "blocked_by_evidence").length,
      needsReview: steps.filter((step) => step.status === "needs_review").length,
      ready: steps.filter((step) => step.status === "ready_for_local_use").length,
      total: steps.length
    },
    rowCoverage: {
      expectedRows: runtime.rowCoverage.expectedRows,
      missingRows: runtime.rowCoverage.missingRows,
      observedRows: runtime.rowCoverage.observedRows
    },
    steps,
    stopLine: "正式資料、正式分數、完整覆蓋與投資建議都仍未啟用；公開頁只能以示範資料呈現。"
  };
}
