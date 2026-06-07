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
  schema_shape: "資料結構",
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
      blockedPromotion: item.blockedPromotion,
      id: item.id,
      label: labels[item.id],
      nextAction:
        item.id === "row_coverage"
          ? "匯入前先定義來源權利、目標表、dry-run 輸出、回復方式、保留政策與 no-write preflight。"
          : item.nextAction,
      owner: item.owner,
      priority: item.priority,
      status
    };
  });

  return {
    blockedReason: "aggregate_count_incomplete",
    currentRoute: "keep_mock_runtime_and_prepare_coverage_route",
    headline: "升級準備度已可檢視，但正式資料升級仍被阻擋",
    mockBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    mode: "runtime_promotion_readiness_summary",
    nextCeoDecision:
      "公開 runtime 維持示範狀態；A1/Data 準備覆蓋率路線，PM 維持 runtime 揭露一致。",
    noGoActions: [
      "執行 SQL",
      "寫入 Supabase",
      "匯入市場資料",
      "修改 daily_prices",
      "切換正式公開資料",
      "啟用正式分數"
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
    stopLine:
      "此摘要不執行 SQL、不連線或寫入 Supabase、不抓取市場資料、不給予覆蓋率分數，也不升級公開資料或正式分數。"
  };
}
