import type { DataFreshnessSnapshot, DataFreshnessState } from "@/lib/data-freshness";

export type DataQualityDowngradeState =
  | "metadata_complete_unapproved"
  | "metadata_partial_blocked"
  | "metadata_stale_blocked"
  | "metadata_unavailable_blocked"
  | "mock_only";

export type DataQualityDowngradeSummary = {
  canUseForPublicScore: false;
  displayLabel: string;
  downgradeState: DataQualityDowngradeState;
  reason: string;
  scoreSource: "mock";
  stopLine: string;
};

const downgradeByFreshnessState: Record<DataFreshnessState, Omit<DataQualityDowngradeSummary, "scoreSource">> = {
  complete: {
    canUseForPublicScore: false,
    displayLabel: "正式資料狀態完整",
    downgradeState: "metadata_complete_unapproved",
    reason: "資料更新狀態已完整，但公開分數仍需依 runtime promotion gate 判定。",
    stopLine: "不要只因資料更新狀態完整，就宣稱模型或投資結論已被保證。"
  },
  mock: {
    canUseForPublicScore: false,
    displayLabel: "示範資料狀態",
    downgradeState: "mock_only",
    reason: "目前資料狀態仍為示範資料，不能宣稱正式市場資料已就緒。",
    stopLine: "不得從示範資料狀態推論正式市場資料已就緒。"
  },
  partial: {
    canUseForPublicScore: false,
    displayLabel: "正式資料部分更新",
    downgradeState: "metadata_partial_blocked",
    reason: "部分資料更新完成，但仍有缺口，前台需清楚揭露。",
    stopLine: "不要把部分更新狀態包裝成完整正式行情。"
  },
  stale: {
    canUseForPublicScore: false,
    displayLabel: "正式資料可能過期",
    downgradeState: "metadata_stale_blocked",
    reason: "資料更新時間落後，前台需提醒使用者不要只看單一燈號。",
    stopLine: "不要用過期 metadata 推論即時市場狀態。"
  },
  unavailable: {
    canUseForPublicScore: false,
    displayLabel: "正式資料暫不可用",
    downgradeState: "metadata_unavailable_blocked",
    reason: "目前無法取得資料更新狀態，前台應保守揭露。",
    stopLine: "資料狀態不可用時不得宣稱正式資料完整。"
  }
};

export function getDataQualityDowngradeSummary(freshness: DataFreshnessSnapshot): DataQualityDowngradeSummary {
  const summary = downgradeByFreshnessState[freshness.state] ?? downgradeByFreshnessState.unavailable;

  return {
    ...summary,
    scoreSource: "mock"
  };
}
