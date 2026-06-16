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
  freshness: "更新時間與延遲揭露",
  row_coverage: "資料覆蓋",
  schema_shape: "Runtime schema shape",
  source_depth: "來源揭露與權利邊界"
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
    headline: "資料覆蓋完成，等待 runtime promotion gate",
    mockBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    mode: "runtime_promotion_readiness_summary",
    nextCeoDecision:
      "CEO/PM 下一步應執行 mock-to-real promotion preflight：品質、延遲、來源揭露、回退與公開風險文案一次收斂。",
    noGoActions: [
      "不執行 SQL",
      "不新增 Supabase 寫入",
      "不抓取或提交 raw market data",
      "不把 publicDataSource 改為 supabase",
      "不把 scoreSource 改為 real",
      "不宣稱即時真實資料或投資建議"
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
      "row coverage 已完成，但公開 runtime 仍停在 mock；只有 promotion gate 全部通過後，才可以另行決定切 real。"
  };
}
