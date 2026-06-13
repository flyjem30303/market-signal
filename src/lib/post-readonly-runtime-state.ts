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
    headline: "後端唯讀檢查已整理，公開頁仍維持示範資料",
    nextGate: "確認來源權利、覆蓋率、品質與公開升級條件",
    objectsReachable: evidence.objects.length,
    publicDataSource: "mock",
    rowCoverage: {
      coverageStatus: "blocked",
      expectedRows: 360,
      missingRows: 178,
      observedRows: 182,
      reason: "aggregate_count_incomplete",
      summary: "目前可檢查的覆蓋證據仍未達完整目標，TWII、ETF 與完整股票宇宙都不能宣稱正式覆蓋。"
    },
    scoreSource: "mock",
    state: "readonly_verified_mock_only",
    stopLine: "唯讀證據不能轉成資料寫入、正式資料來源、正式分數或投資建議。",
    userFacingSummary: "後端唯讀證據只代表準備度參考；公開頁仍使用示範資料，直到來源、覆蓋率、品質與公開升級檢查都通過。"
  };
}
