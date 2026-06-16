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
      acceptanceSignal: "Phase 1 runtime 所需 schema shape 已可本機使用，且未暴露 row payload、stock_id 或 secrets。",
      blockedPromotion: "schema shape 通過只代表資料形狀可用，尚不代表 runtime 可以讀 Supabase。",
      id: "schema_shape",
      nextAction: "保留為已完成基礎項，後續只在欄位契約變動時重驗。",
      owner: "Engineering",
      priority: 1,
      status: "local_ready"
    },
    {
      acceptanceSignal: "Freshness evidence 已具備可顯示的更新時間與延遲說明基礎。",
      blockedPromotion: "仍需確認前台 stale fallback 與延遲文案，避免使用者誤認為即時資料。",
      id: "freshness",
      nextAction: "確認公開頁顯示更新時間、延遲說明與資料未更新時的停用提示。",
      owner: "Data",
      priority: 2,
      status: "local_ready"
    },
    {
      acceptanceSignal: "Phase 1 目標範圍 360/360 rows 已補齊，missingRows=0。",
      blockedPromotion: "row coverage 已不再是 blocker；promotion 仍需資料品質、來源揭露、回退與文案覆核。",
      id: "row_coverage",
      nextAction: "將 row coverage 視為 accepted，不再重開補齊工作，除非新增資料範圍。",
      owner: "Data",
      priority: 3,
      status: "local_ready"
    },
    {
      acceptanceSignal: "資料品質需完成 Phase 1 欄位有效性、異常值與降級規則覆核。",
      blockedPromotion: "品質未覆核前，不可把 mock score 升級為 real score。",
      id: "data_quality",
      nextAction: "只覆核 Phase 1 必要欄位，不擴大到完整市場或長期 backfill。",
      owner: "Data",
      priority: 4,
      status: "needs_role_review"
    },
    {
      acceptanceSignal: "資料來源與公開揭露需能清楚說明來源、延遲、限制與非官方背書。",
      blockedPromotion: "來源文案未完成前，不可對外宣稱真實資料、即時資料或完整市場覆蓋。",
      id: "source_depth",
      nextAction: "收斂公開 attribution、資料延遲、免費來源限制與非投資建議聲明。",
      owner: "Investment",
      priority: 5,
      status: "needs_role_review"
    }
  ];

  return {
    blockedActions: [
      "不得執行 SQL",
      "不得寫入 Supabase",
      "不得抓取或提交 raw market data",
      "不得修改 daily_prices",
      "不得切換 publicDataSource=supabase",
      "不得切換 scoreSource=real"
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
        "資料覆蓋 blocker 已關閉；下一段只處理 real promotion 前必須讓使用者看得懂且不誤判的品質、更新時間、來源與文案邊界。",
      schemaAcceptedCount: schemaShape.acceptedCount,
      schemaObjectCount: schemaShape.objects.length
    },
    headline: "資料補齊完成，下一步進入 mock-to-real promotion preflight",
    items,
    mode: "post_readonly_next_gate_queue",
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "coverage 完成不是公開 real 的許可；promotion gate 通過前，公開 runtime 仍維持 mock。"
  };
}
