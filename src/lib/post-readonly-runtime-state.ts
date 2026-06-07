import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";

export type PostReadonlyRuntimeState = {
  acceptedEvidence: string;
  headline: string;
  nextGate: string;
  objectsReachable: number;
  publicDataSource: "mock";
  rowCoverage: {
    coverageStatus: "blocked";
    expectedRows: 360;
    missingRows: 178;
    observedRows: 182;
    reason: "aggregate_count_incomplete";
    summary: string;
  };
  scoreSource: "mock";
  state: "readonly_verified_mock_only";
  stopLine: string;
  userFacingSummary: string;
};

export function getPostReadonlyRuntimeState(): PostReadonlyRuntimeState {
  const evidence = getSupabaseReadonlyEvidenceSummary();

  return {
    acceptedEvidence: evidence.acceptedScope,
    headline: "第一個閉環證據已接受；runtime 仍維持示範狀態",
    nextGate: evidence.nextRuntimeGate,
    objectsReachable: evidence.objects.length,
    publicDataSource: "mock",
    rowCoverage: {
      coverageStatus: "blocked",
      expectedRows: 360,
      missingRows: 178,
      observedRows: 182,
      reason: "aggregate_count_incomplete",
      summary:
        "已接受的第一個閉環證據目前涵蓋 360 筆 Level 1 預期資料中的 182 筆。TWII 與 ETF 覆蓋率仍未補齊，因此正式資料升級維持阻擋。"
    },
    scoreSource: "mock",
    state: "readonly_verified_mock_only",
    stopLine:
      "唯讀可達性不能轉成寫入、匯入、正式公開資料或正式分數。",
    userFacingSummary:
      "第一個台股閉環已作為後端證據接受。公開產品仍顯示示範分數，直到覆蓋率、資料品質、新鮮度、來源深度與升級檢查點分別通過。"
  };
}
