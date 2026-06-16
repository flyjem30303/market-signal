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
      acceptanceSignal: "Phase 1 runtime schema shape 已可供本地使用，沒有 row payload、stock id 或 secret 暴露。",
      blockedPromotion: "schema shape 已不是 blocker；仍不可因此連 Supabase 或切換 public data source。",
      id: "schema_shape",
      nextAction: "維持目前 schema contract，僅在 promotion packet 明確要求時再調整欄位。",
      owner: "Engineering",
      priority: 1,
      status: "local_ready"
    },
    {
      acceptanceSignal: "Freshness evidence 已完成，可顯示資料更新時間、延遲與 stale fallback。",
      blockedPromotion: "尚未通過公開 promotion 前，不可宣稱即時資料或完整市場覆蓋。",
      id: "freshness",
      nextAction: "保持更新時間、延遲說明與 stale fallback 可見。",
      owner: "Data",
      priority: 2,
      status: "local_ready"
    },
    {
      acceptanceSignal: "Phase 1 範圍 360/360 rows 已完成，missingRows=0。",
      blockedPromotion: "row coverage 已不是 blocker；promotion 仍需品質、來源、rollback/readback 與文案 gate。",
      id: "row_coverage",
      nextAction: "把 row coverage 視為 accepted，不重跑寫入或補資料，除非資料範圍被明確擴大。",
      owner: "Data",
      priority: 3,
      status: "local_ready"
    },
    {
      acceptanceSignal:
        dataQualityOutcome?.acceptedEvidence.join("；") ??
        "資料品質候選已涵蓋 Phase 1 必要欄位，但尚未等同 real score 可用。",
      blockedPromotion:
        dataQualityOutcome?.reason ?? "品質 review 未完成前，只能保留 mock score，不能設定 scoreSource=real。",
      id: "data_quality",
      nextAction:
        dataQualityOutcome?.outcome === "accepted"
          ? "field validity promotion accepted for local Phase 1 quality scoring；仍不可切 scoreSource=real"
          : `field validity promotion rejected；${dataQualityOutcome?.minFixes.join("；") ?? "補齊最小品質證據"}`,
      owner: "Data",
      priority: 4,
      status: dataQualityOutcome?.outcome === "accepted" ? "local_ready" : "blocked_waiting_evidence"
    },
    {
      acceptanceSignal:
        sourceDepthOutcome?.acceptedEvidence.join("；") ??
        "來源揭露與公開使用條件已有候選路徑，但仍需維持延遲、來源與非背書說明。",
      blockedPromotion:
        sourceDepthOutcome?.reason ?? "來源條件未被 promotion packet 接受前，不可宣稱官方背書或完整市場資料。",
      id: "source_depth",
      nextAction:
        sourceDepthOutcome?.outcome === "accepted"
          ? "source-depth accepted for Phase 1 TWII plus listed-stock daily close；ETF coverage deferred to Phase 1.1"
          : `source-depth artifact promotion rejected；${sourceDepthOutcome?.minFixes.join("；") ?? "補齊來源深度證據"}`,
      owner: "Investment",
      priority: 5,
      status: sourceDepthOutcome?.outcome === "accepted" ? "local_ready" : "blocked_waiting_evidence"
    }
  ];

  return {
    blockedActions: [
      "不要執行 SQL",
      "不要寫入 Supabase",
      "不要抓取或提交 raw market data",
      "不要改寫 daily_prices",
      "不要切換 publicDataSource=supabase",
      "不要切換 scoreSource=real"
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
        "資料覆蓋與資料品質已可作為本地 Phase 1 promotion evidence；來源深度仍 rejected for promotion，下一步只補來源權利與公開使用證據。",
      schemaAcceptedCount: schemaShape.acceptedCount,
      schemaObjectCount: schemaShape.objects.length
    },
    headline: "資料覆蓋已完成，進入 mock-to-real promotion preflight",
    items,
    mode: "post_readonly_next_gate_queue",
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine: "coverage 完成不等於 real 上線；runtime 必須維持 mock，直到獨立 promotion gate 通過。"
  };
}
