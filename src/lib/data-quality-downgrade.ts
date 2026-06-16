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
    displayLabel: "Metadata 完整，分數仍為示範",
    downgradeState: "metadata_complete_unapproved",
    reason: "Freshness metadata is reachable, but source rights, field coverage, data quality, model evidence, and release approval remain separate gates.",
    stopLine: "Do not use complete freshness metadata as public score approval. 不得把完整的新鮮度 metadata 視為公開分數核准。"
  },
  mock: {
    canUseForPublicScore: false,
    displayLabel: "示範資料狀態",
    downgradeState: "mock_only",
    reason: "公開狀態刻意使用示範資料；正式市場資料與正式分數仍被阻擋。",
    stopLine: "不得從示範資料狀態推論正式市場資料已就緒。"
  },
  partial: {
    canUseForPublicScore: false,
    displayLabel: "Metadata 不完整，公開分數受阻",
    downgradeState: "metadata_partial_blocked",
    reason: "新鮮度 metadata 不完整，代表必要表格、資料列或執行狀態不足以支撐公開評分。",
    stopLine: "不得把不完整 metadata 升級為正式分數輸入。"
  },
  stale: {
    canUseForPublicScore: false,
    displayLabel: "Metadata 過期，公開分數受阻",
    downgradeState: "metadata_stale_blocked",
    reason: "過期的新鮮度 metadata 必須經資料負責人審查後，才可支撐任何公開狀態宣稱。",
    stopLine: "不得把過期 metadata 升級為正式分數輸入。"
  },
  unavailable: {
    canUseForPublicScore: false,
    displayLabel: "Metadata 不可用，公開分數受阻",
    downgradeState: "metadata_unavailable_blocked",
    reason: "不可用的新鮮度 metadata 會阻擋公開評分，畫面應降級為示範或不可用狀態。",
    stopLine: "不得把不可用 metadata 升級為正式分數輸入。"
  }
};

export function getDataQualityDowngradeSummary(freshness: DataFreshnessSnapshot): DataQualityDowngradeSummary {
  const summary = downgradeByFreshnessState[freshness.state] ?? downgradeByFreshnessState.unavailable;

  return {
    ...summary,
    scoreSource: "mock"
  };
}
