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
    headline: "資料覆蓋已補齊，公開網站仍維持 mock 安全模式",
    nextGate: "進入 runtime promotion preflight：確認品質、延遲、回退與揭露後才可切換 real",
    objectsReachable: evidence.objects.length,
    publicDataSource: "mock",
    rowCoverage: {
      coverageStatus: "complete",
      expectedRows: 360,
      missingRows: 0,
      observedRows: 360,
      reason: "aggregate_count_complete",
      summary:
        "Phase 1 目標範圍的 TWII、0050、006208 日資料覆蓋已完成 readback；這只代表資料面可進入 promotion review，不代表前台已切真實資料。"
    },
    scoreSource: "mock",
    state: "coverage_complete_mock_only",
    stopLine:
      "在 promotion gate 通過前，不切換 publicDataSource=supabase、不設定 scoreSource=real，也不宣稱即時真實資料或投資建議。",
    userFacingSummary:
      "資料覆蓋已完成後台驗證；目前公開頁仍使用 mock 燈號，下一步是做真實資料切換前的品質、延遲、回退與風險揭露檢查。"
  };
}
