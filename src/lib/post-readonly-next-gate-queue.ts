import { buildDataQualityEvidenceGate } from "@/lib/data-quality-evidence-gate";
import { getFreshnessReadonlyLatestEvidenceSummary } from "@/lib/freshness-readonly-latest-evidence";
import { getPhase1PromotionReviewOutcomeSummary } from "@/lib/phase-1-promotion-review-outcome";
import { getSchemaShapeAcceptanceContract } from "@/lib/schema-shape-acceptance-contract";

export type PostReadonlyNextGateItem = {
  acceptanceSignal: string;
  blockedPromotion: string;
  id: "schema_shape" | "freshness" | "row_coverage" | "data_quality" | "source_depth";
  nextAction: string;
  owner: "Data" | "Engineering" | "Investment";
  priority: 1 | 2 | 3 | 4 | 5;
  status: "local_ready" | "blocked_waiting_evidence" | "needs_role_review";
};

export type PostReadonlyNextGateQueue = {
  blockedActions: string[];
  currentDefaultRoute: "runtime_promotion_preflight_preparation";
  gateSummary: {
    blockedWaitingEvidenceCount: number;
    dataQualityProgressPercent: number;
    dataQualityStatus: "blocked" | "candidate";
    freshnessEvidenceState: "complete";
    localReadyCount: number;
    needsRoleReviewCount: number;
    readableSummary: string;
    schemaAcceptedCount: number;
    schemaObjectCount: number;
  };
  headline: string;
  items: PostReadonlyNextGateItem[];
  mode: "post_readonly_next_gate_queue";
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function getPostReadonlyNextGateQueue(): PostReadonlyNextGateQueue {
  const schemaShape = getSchemaShapeAcceptanceContract();
  const freshnessEvidence = getFreshnessReadonlyLatestEvidenceSummary();
  const dataQualityGate = buildDataQualityEvidenceGate({ freshnessState: freshnessEvidence.state });
  const promotionReview = getPhase1PromotionReviewOutcomeSummary();
  const dataQualityOutcome = promotionReview.outcomes.find((outcome) => outcome.id === "data_quality");
  const sourceDepthOutcome = promotionReview.outcomes.find((outcome) => outcome.id === "source_depth");
  const items: PostReadonlyNextGateItem[] = [
    {
      acceptanceSignal: "Phase 1 runtime schema shape is locally accepted and does not expose row payloads, stock ids, or secrets.",
      blockedPromotion: "欄位結構已不再是主要阻塞，但欄位可讀不代表可直接公開正式資料。",
      id: "schema_shape",
      nextAction: "把欄位結構作為正式資料升級包的佐證；公開頁先維持示範資料。",
      owner: "Engineering",
      priority: 1,
      status: "local_ready"
    },
    {
      acceptanceSignal: "Freshness evidence is complete and public UI has delay/stale fallback wording.",
      blockedPromotion: "更新時間可讀，但仍需與資料來源、回復流程與公開文案一起審核。",
      id: "freshness",
      nextAction: "維持更新時間與延遲說明，並納入正式資料升級審核。",
      owner: "Data",
      priority: 2,
      status: "local_ready"
    },
    {
      acceptanceSignal:
        "Phase 1 current-scope bounded write shard-001 has 500/500 rows for TWII plus listed-stock daily close, missingRows=0; insertedRows=437 and skippedExistingRows=63.",
      blockedPromotion: "資料覆蓋率已完成，但仍需品質、揭露、回復流程與公開文案審核。",
      id: "row_coverage",
      nextAction: "把資料覆蓋率列為已接受證據；除非發現缺漏，不再重跑寫入。",
      owner: "Data",
      priority: 3,
      status: "local_ready"
    },
    {
      acceptanceSignal: dataQualityOutcome?.acceptedEvidence.join("; ") ?? "資料品質證據尚未完成；維持示範分數。",
      blockedPromotion: dataQualityOutcome?.reason ?? "資料品質尚未證明可公開正式分數。",
      id: "data_quality",
      nextAction:
        dataQualityOutcome?.outcome === "accepted"
          ? "資料品質證據已可作為本地審核依據；正式分數仍需模型與公開宣稱檢查。"
          : `補齊資料品質證據：${dataQualityOutcome?.minFixes.join("; ") ?? "補上缺少的證據。"}`,
      owner: "Data",
      priority: 4,
      status: dataQualityOutcome?.outcome === "accepted" ? "local_ready" : "blocked_waiting_evidence"
    },
    {
      acceptanceSignal: sourceDepthOutcome?.acceptedEvidence.join("; ") ?? "資料來源深度證據尚未完成；維持示範資料。",
      blockedPromotion: sourceDepthOutcome?.reason ?? "資料來源深度尚未證明可公開正式資料。",
      id: "source_depth",
      nextAction:
        sourceDepthOutcome?.outcome === "accepted"
          ? "資料來源深度已接受於 TWII 與上市股票日收盤價範圍；ETF 全量延後到 Phase 1.1。"
          : `補齊資料來源證據：${sourceDepthOutcome?.minFixes.join("; ") ?? "補上來源證據。"}`,
      owner: "Investment",
      priority: 5,
      status: sourceDepthOutcome?.outcome === "accepted" ? "local_ready" : "blocked_waiting_evidence"
    }
  ];

  return {
    blockedActions: [
      "不得執行 SQL",
      "不得寫入 Supabase",
      "不得抓取或提交 raw market data",
      "不得直接修改 daily_prices",
      "不得把公開頁切換成正式資料來源",
      "不得把示範分數宣稱為正式模型"
    ],
    currentDefaultRoute: "runtime_promotion_preflight_preparation",
    gateSummary: {
      blockedWaitingEvidenceCount: items.filter((item) => item.status === "blocked_waiting_evidence").length,
      dataQualityProgressPercent: dataQualityGate.evidenceProgressPercent,
      dataQualityStatus: dataQualityGate.status,
      freshnessEvidenceState: freshnessEvidence.state,
      localReadyCount: items.filter((item) => item.status === "local_ready").length,
      needsRoleReviewCount: items.filter((item) => item.status === "needs_role_review").length,
      readableSummary:
        "資料覆蓋率 shard-001 已完成；正式資料升級審核改看資料品質、來源揭露、更新時間、回復流程與公開文案，而不是再重跑同一個 row coverage。",
      schemaAcceptedCount: schemaShape.acceptedCount,
      schemaObjectCount: schemaShape.objects.length
    },
    headline: "資料覆蓋完成，進入正式資料升級前檢查",
    items,
    mode: "post_readonly_next_gate_queue",
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine: "資料覆蓋完成仍不等於正式資料上線；公開頁維持示範資料直到升級審核通過。"
  };
}
