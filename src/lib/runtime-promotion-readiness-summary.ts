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
  data_quality: "資料品質審核",
  freshness: "更新時間與延遲揭露",
  row_coverage: "資料覆蓋率確認",
  schema_shape: "資料欄位結構確認",
  source_depth: "資料來源與使用條件確認"
};

const publicBlockedText: Record<PostReadonlyNextGateItem["id"], string> = {
  data_quality: "正式資料品質尚未完成公開檢查。",
  freshness: "更新頻率、延遲說明與異常回復尚未完成公開檢查。",
  row_coverage: "資料覆蓋已完成，但仍需與公開文案和回復流程一起審核。",
  schema_shape: "資料欄位已可讀，但仍需確認公開頁使用方式。",
  source_depth: "資料來源與可公開使用條件仍需保留證據。"
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
      blockedPromotion: publicBlockedText[item.id],
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
    headline: "資料覆蓋完成，正式資料升級仍需最後審核",
    mockBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    mode: "runtime_promotion_readiness_summary",
    nextCeoDecision:
      "CEO/PM 可進入正式資料升級評估，但必須先確認資料品質、來源揭露、更新時間、公開文案、回復流程與營運監控。",
    noGoActions: [
      "不得執行資料庫結構或內容變更",
      "不得寫入正式資料庫",
      "不得匯入未審核的市場原始資料",
      "不得讓公開頁宣稱已使用正式行情",
      "不得把示範分數宣稱為正式投資模型",
      "不得提供個股買賣建議或保證式結論"
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
      "資料覆蓋已完成，但沒有完成正式資料升級審核、回讀確認、異常回復與公開文案檢查前，不可宣稱公開頁已使用正式資料。"
  };
}
