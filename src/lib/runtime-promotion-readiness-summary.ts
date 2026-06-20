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
  blockedReason: "promotion_gate_complete";
  currentRoute: "monitor_real_runtime_freshness";
  headline: string;
  runtimeBoundary: {
    publicDataSource: "supabase";
    scoreSource: "real";
  };
  mode: "runtime_promotion_readiness_summary";
  nextCeoDecision: string;
  noGoActions: string[];
  overallStatus: "coverage_complete_runtime_promoted";
  readinessCounts: {
    blocked: number;
    needsReview: number;
    ready: number;
    total: number;
  };
  rowCoverage: {
    expectedRows: number;
    missingRows: 0;
    observedRows: number;
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
    blockedReason: "promotion_gate_complete",
    currentRoute: "monitor_real_runtime_freshness",
    headline: "正式資料 runtime 已啟用，接下來監控每日更新與解釋品質",
    runtimeBoundary: {
      publicDataSource: "supabase",
      scoreSource: "real"
    },
    mode: "runtime_promotion_readiness_summary",
    nextCeoDecision:
      "CEO/PM 應維持正式資料 runtime 監控，優先看 daily_prices / daily_scores freshness、資料延遲揭露、解釋區可追溯來源與回復流程。",
    noGoActions: [
      "不得執行資料庫結構或內容變更",
      "不得重跑未授權資料寫入",
      "不得匯入未審核的市場原始資料",
      "不得宣稱即時行情或投資建議",
      "不得宣稱完整市場覆蓋",
      "不得提供個股買賣建議或保證式結論"
    ],
    overallStatus: "coverage_complete_runtime_promoted",
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
      "正式資料已啟用，但每日更新、資料延遲、fail-safe 與解釋來源仍需持續監控；若 freshness 失敗，前台必須降級揭露。"
  };
}
