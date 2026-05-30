export type Cp3MockOnlyApprovalState = "not_ready";

export type Cp3MockOnlyDataQualityState = "partial" | "stale" | "unavailable";

export type Cp3MockOnlyFreshnessState = "stale" | "unknown";

export type Cp3MockOnlyRuntimeState = {
  assetType: "stock" | "etf" | "index";
  backtestApprovalState: Cp3MockOnlyApprovalState;
  claimApprovalState: Cp3MockOnlyApprovalState;
  dataQualityScore: number;
  dataQualityState: Cp3MockOnlyDataQualityState;
  disclosureApprovalState: Cp3MockOnlyApprovalState;
  freshnessState: Cp3MockOnlyFreshnessState;
  locale: "zh-TW";
  market: "tw";
  modelApprovalState: "candidate";
  modelVersion: string;
  scoreSource: "mock";
  sourceDepthState: Cp3MockOnlyApprovalState;
  sourceRightsState: Cp3MockOnlyApprovalState;
};

export type Cp3MockOnlyDisplayState = "mock" | "partial" | "stale" | "unavailable";

export type Cp3MockOnlyUiCopyToken = {
  claimLimit: string;
  disclosure: string;
  label: string;
  shortDescription: string;
};

export const cp3MockOnlyUiCopyTokens: Record<Cp3MockOnlyDisplayState, Cp3MockOnlyUiCopyToken> = {
  mock: {
    claimLimit: "不得描述為真實、已驗證、可交易或可作為投資建議。",
    disclosure: "分數來源仍是 mock，尚未通過來源深度、法遵與公開宣稱審核。",
    label: "目前仍是模擬分數",
    shortDescription: "這個狀態只用來確認產品流程，不能視為真實模型或投資訊號。"
  },
  partial: {
    claimLimit: "不得描述為完整、已驗證或可交易。",
    disclosure: "部分資料仍缺漏，分數脈絡可能改變，不能作為投資建議。",
    label: "資料仍不完整",
    shortDescription: "必要資料尚未齊備，僅能用於內部產品檢視。"
  },
  stale: {
    claimLimit: "不得宣稱為每日更新的真實模型輸出。",
    disclosure: "資料新鮮度尚未確認，只能作為背景脈絡，不能作為投資建議。",
    label: "資料可能過期",
    shortDescription: "部分市場資料可能不是最新狀態。"
  },
  unavailable: {
    claimLimit: "不得宣稱分數、驗證結果或覆蓋範圍。",
    disclosure: "必要資料或審核尚未齊備，因此不能顯示可公開使用的分數。",
    label: "分數尚不可用",
    shortDescription: "目前狀態不足以顯示可公開使用的分數。"
  }
};

export function getMockOnlyPublicDisplayState(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyDisplayState {
  if (state.scoreSource === "mock") return "mock";
  if (state.dataQualityState === "stale") return "stale";
  if (state.dataQualityState === "partial") return "partial";

  return "unavailable";
}
