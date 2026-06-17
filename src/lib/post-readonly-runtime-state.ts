import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";

export type PostReadonlyRuntimeState = {
  acceptedEvidence: string;
  coverageStatus: "complete";
  currentRoute: "runtime_promotion_preflight";
  headline: string;
  mode: "coverage_complete_mock_only";
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
    acceptedEvidence: "目前範圍寫入閉環已完成：TWII 與上市股票日收盤價覆蓋率已由 aggregate evidence 確認。",
    coverageStatus: "complete",
    currentRoute: "runtime_promotion_preflight",
    headline: "資料覆蓋已完成，公開 runtime 仍維持示範資料",
    mode: "coverage_complete_mock_only",
    nextGate: "正式資料升級審核：確認資料品質、更新時間揭露、資料來源揭露、回讀與回復流程，以及公開文案邊界。",
    objectsReachable: evidence.objects.length,
    publicDataSource: "mock",
    rowCoverage: {
      coverageStatus: "complete",
      expectedRows: 360,
      missingRows: 0,
      observedRows: 360,
      reason: "aggregate_count_complete",
      summary: "TWII 加上市股票日收盤價目前範圍共有 360 筆預期列、360 筆觀察列，missingRows=0。"
    },
    scoreSource: "mock",
    state: "coverage_complete_mock_only",
    stopLine: "資料覆蓋完成不等於可以公開正式燈號；完成正式資料升級審核前，公開頁仍維持示範資料與示範分數。",
    userFacingSummary: "資料覆蓋率已完成，下一步是把正式資料切換前的品質、來源、更新時間與風險揭露檢查補齊。"
  };
}
