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
  blockedReason: "promotion_gate_pending";
  currentRoute: "prepare_runtime_promotion_gate_preflight";
  headline: string;
  mockBoundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
  };
  mode: "runtime_promotion_readiness_summary";
  nextCeoDecision: string;
  noGoActions: string[];
  overallStatus: "coverage_complete_promotion_pending";
  readinessCounts: {
    blocked: number;
    needsReview: number;
    ready: number;
    total: number;
  };
  rowCoverage: {
    expectedRows: 360;
    missingRows: 0;
    observedRows: 360;
  };
  steps: RuntimePromotionReadinessStep[];
  stopLine: string;
};

const labels: Record<PostReadonlyNextGateItem["id"], string> = {
  data_quality: "資料品質覆核",
  freshness: "更新時間與延遲顯示",
  row_coverage: "資料覆蓋率",
  schema_shape: "Runtime schema shape",
  source_depth: "來源揭露與公開限制"
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
      blockedPromotion: item.blockedPromotion,
      id: item.id,
      label: labels[item.id],
      nextAction: item.nextAction,
      owner: item.owner,
      priority: item.priority,
      status
    };
  });

  return {
    blockedReason: "promotion_gate_pending",
    currentRoute: "prepare_runtime_promotion_gate_preflight",
    headline: "資料覆蓋已完成，正在準備 runtime promotion gate",
    mockBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    mode: "runtime_promotion_readiness_summary",
    nextCeoDecision:
      "CEO/PM 下一步只收斂 Phase 1 real promotion 必要條件：資料品質、更新時間、來源揭露、fail-closed 與公開文案。",
    noGoActions: [
      "不得執行 SQL",
      "不得寫入 Supabase",
      "不得抓取或提交 raw market data",
      "不得把 publicDataSource 切到 supabase",
      "不得把 scoreSource 切到 real",
      "不得宣稱即時、完整市場覆蓋或投資建議"
    ],
    overallStatus: "coverage_complete_promotion_pending",
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
    stopLine:
      "row coverage 已完成，但 runtime 仍維持 mock；promotion gate 未通過前不可把公開網站切成 real。"
  };
}
