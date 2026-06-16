import { buildDataQualityEvidenceGate } from "@/lib/data-quality-evidence-gate";
import { getFreshnessReadonlyLatestEvidenceSummary } from "@/lib/freshness-readonly-latest-evidence";
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
  const items: PostReadonlyNextGateItem[] = [
    {
      acceptanceSignal: "Schema shape 已可支援 Phase 1 runtime 讀取，不需要在前台暴露 row payload、stock_id 或 secrets。",
      blockedPromotion: "仍需通過 promotion gate 才能讓公開 runtime 改讀 Supabase。",
      id: "schema_shape",
      nextAction: "保持既有資料形狀，進入 mock-to-real preflight，不新增資料模型抽象。",
      owner: "Engineering",
      priority: 1,
      status: "local_ready"
    },
    {
      acceptanceSignal: "Freshness evidence 已完成，前台可以顯示更新時間與延遲說明。",
      blockedPromotion: "仍需確認延遲顯示、資料異常與 fail-closed 文案。",
      id: "freshness",
      nextAction: "把更新時間與延遲狀態接入公開可讀文案，資料異常時必須清楚降級。",
      owner: "Data",
      priority: 2,
      status: "local_ready"
    },
    {
      acceptanceSignal: "Phase 1 目標範圍 360/360 rows 已完成 readback，missingRows=0。",
      blockedPromotion: "資料覆蓋已不再是 blocker；promotion 仍受品質、來源權利與回退機制限制。",
      id: "row_coverage",
      nextAction: "將 row coverage 視為 accepted，下一步只做 promotion preflight，不再重跑補齊流程。",
      owner: "Data",
      priority: 3,
      status: "local_ready"
    },
    {
      acceptanceSignal: "資料品質需要對空值、重複、日期連續性與燈號分數影響做最後 role review。",
      blockedPromotion: "品質未覆核前，不得把 mock score 換成 real score。",
      id: "data_quality",
      nextAction: "做最小品質檢查與風險備註，只驗證 Phase 1 上線所需欄位，不擴大到全市場 backfill。",
      owner: "Data",
      priority: 4,
      status: "needs_role_review"
    },
    {
      acceptanceSignal: "資料來源權利已轉向合法免費可自動化來源；公開頁仍需清楚揭露來源與延遲。",
      blockedPromotion: "來源揭露與使用條件未完成前，不宣稱完整正式資料服務。",
      id: "source_depth",
      nextAction: "補齊公開來源揭露文案與限制說明，避免誤導為即時交易資料。",
      owner: "Investment",
      priority: 5,
      status: "needs_role_review"
    }
  ];

  return {
    blockedActions: [
      "不執行 SQL",
      "不新增 Supabase 寫入",
      "不抓取、儲存或提交 raw market data",
      "不修改 daily_prices",
      "不切換 publicDataSource=supabase",
      "不設定 scoreSource=real"
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
        "資料覆蓋 blocker 已解除；現在主線改成公開 runtime promotion preflight，重點是品質、來源揭露、延遲與回退。",
      schemaAcceptedCount: schemaShape.acceptedCount,
      schemaObjectCount: schemaShape.objects.length
    },
    headline: "資料覆蓋完成，下一步是 mock-to-real promotion preflight",
    items,
    mode: "post_readonly_next_gate_queue",
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "coverage 完成不等於已上線真實資料；promotion gate 通過前，公開頁必須保持 mock 並清楚標示邊界。"
  };
}
