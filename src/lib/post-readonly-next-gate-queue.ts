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
  currentDefaultRoute: "post_readonly_next_gate_preparation";
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
      acceptanceSignal:
        "唯讀資料結構摘要列出必要物件與欄位，且不含 row payload 或 secrets",
      blockedPromotion: "Supabase 支撐的公開 runtime",
      id: "schema_shape",
      nextAction:
        "比對去識別化物件可讀性與 runtime 欄位契約，並在本地記錄缺口",
      owner: "Engineering",
      priority: 1,
      status: "local_ready"
    },
    {
      acceptanceSignal:
        "新鮮度解讀把最新去識別化證據映射為過期、目前可用或未知，且不核准公開資料來源",
      blockedPromotion: "以新鮮度為基礎的公開宣稱",
      id: "freshness",
      nextAction:
        "對齊 data_freshness 證據、runtime 文案，以及過期或缺日期時的 fail-closed 標籤",
      owner: "Data",
      priority: 2,
      status: "local_ready"
    },
    {
      acceptanceSignal:
        "覆蓋率說明已觀察與預期筆數，以及缺資料的影響",
      blockedPromotion: "覆蓋率加分",
      id: "row_coverage",
      nextAction:
        "保留不完整 aggregate 結果的可見性，並決定下一個有範圍的唯讀證據問題",
      owner: "Data",
      priority: 3,
      status: "blocked_waiting_evidence"
    },
    {
      acceptanceSignal:
        "資料品質檢查點定義最低欄位有效性、降級行為與公開宣稱限制",
      blockedPromotion: "資料品質分數升級",
      id: "data_quality",
      nextAction:
        "把欄位有效性 QA、降級矩陣與 release blocker 文案串成同一條接受路徑",
      owner: "Data",
      priority: 4,
      status: "needs_role_review"
    },
    {
      acceptanceSignal:
        "來源深度 artifact 證明歷史深度、來源權利邊界與缺日期政策",
      blockedPromotion: "正式分數",
      id: "source_depth",
      nextAction:
        "等資料結構、新鮮度、覆蓋率與品質缺口明確後，再準備來源深度證據請求",
      owner: "Investment",
      priority: 5,
      status: "needs_role_review"
    }
  ];

  return {
    blockedActions: [
      "執行 SQL",
      "寫入 Supabase",
      "抓取或匯入市場原始資料",
      "修改 daily_prices",
      "切換正式公開資料",
      "啟用正式分數"
    ],
    currentDefaultRoute: "post_readonly_next_gate_preparation",
    gateSummary: {
      blockedWaitingEvidenceCount: items.filter((item) => item.status === "blocked_waiting_evidence").length,
      dataQualityProgressPercent: dataQualityGate.evidenceProgressPercent,
      dataQualityStatus: dataQualityGate.status,
      freshnessEvidenceState: freshnessEvidence.state,
      localReadyCount: items.filter((item) => item.status === "local_ready").length,
      needsRoleReviewCount: items.filter((item) => item.status === "needs_role_review").length,
      readableSummary:
        "資料結構與新鮮度已有本地證據可支援 runtime 揭露；覆蓋率、資料品質與來源深度仍阻擋升級。",
      schemaAcceptedCount: schemaShape.acceptedCount,
      schemaObjectCount: schemaShape.objects.length
    },
    headline:
      "後端物件可讀性已接受；下一步是證據品質，不是正式資料升級。",
    items,
    mode: "post_readonly_next_gate_queue",
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "此佇列不執行 SQL、不寫入 Supabase、不抓取市場資料、不修改 daily_prices，也不啟用正式分數。"
  };
}
