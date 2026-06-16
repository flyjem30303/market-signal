import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";

export type PostReadonlyRuntimeState = {
  acceptedEvidence: string;
  headline: string;
  nextGate: string;
  objectsReachable: number;
  publicDataSource: "mock";
  rowCoverage: {
    coverageStatus: "complete";
    expectedRows: 360;
    missingRows: 0;
    observedRows: 360;
    reason: "aggregate_count_complete";
    summary: string;
  };
  scoreSource: "mock";
  state: "coverage_complete_mock_only";
  stopLine: string;
  userFacingSummary: string;
};

export function getPostReadonlyRuntimeState(): PostReadonlyRuntimeState {
  const evidence = getSupabaseReadonlyEvidenceSummary();

  return {
    acceptedEvidence: evidence.acceptedScope,
    headline: "資料覆蓋已補齊，但公開網站仍維持 mock 安全模式",
    nextGate: "進入真實資料上線前檢查：先完成品質、更新時間、來源揭露、回退與公開文案覆核，才可討論 real promotion。",
    objectsReachable: evidence.objects.length,
    publicDataSource: "mock",
    rowCoverage: {
      coverageStatus: "complete",
      expectedRows: 360,
      missingRows: 0,
      observedRows: 360,
      reason: "aggregate_count_complete",
      summary:
        "Phase 1 目標範圍已完成 360/360 筆覆蓋與 readback；這代表資料缺口已關閉，但尚不代表公開 runtime 可以切到真實資料。"
    },
    scoreSource: "mock",
    state: "coverage_complete_mock_only",
    stopLine:
      "在上線檢查通過前，不切換 publicDataSource=supabase、不切換 scoreSource=real，也不宣稱即時、完整市場覆蓋或投資建議。",
    userFacingSummary:
      "目前可用於產品展示與本機驗證；公開頁面仍以 mock 燈號呈現，避免使用者把尚未完成 promotion 的資料誤認為正式投資訊號。"
  };
}
