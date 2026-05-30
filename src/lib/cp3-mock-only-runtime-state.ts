export type Cp3MockOnlyApprovalState = "not_ready";

export type Cp3MockOnlyDataQualityState = "partial" | "stale" | "unavailable";

export type Cp3MockOnlyFreshnessState = "stale" | "unknown";

export type Cp3MockOnlyRuntimeState = {
  assetType: "stock" | "etf" | "index";
  backtestApprovalState: Cp3MockOnlyApprovalState;
  claimApprovalState: Cp3MockOnlyApprovalState;
  contractState: "local_contract_only";
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

export type Cp3MockOnlyUpgradeRequirement = {
  id: string;
  label: string;
  owner: "CEO" | "Data" | "Engineering" | "Investment" | "Legal";
  state: Cp3MockOnlyApprovalState | "mock";
};

export type Cp3MockOnlyUpgradeVerdict = {
  label: string;
  reason: string;
  state: "blocked";
};

export const cp3MockOnlyUiCopyTokens: Record<Cp3MockOnlyDisplayState, Cp3MockOnlyUiCopyToken> = {
  mock: {
    claimLimit: "目前只可作為產品體驗與閱讀流程示範，不能作為投資判斷、建議或績效保證。",
    disclosure: "分數來源仍是 mock；runtime 只使用本地雙層契約概念，不連外部資料庫、不讀取真實市場資料，也不表示來源深度已完成。",
    label: "Mock runtime",
    shortDescription: "這是 mock-only runtime 狀態，協助使用者理解畫面與資料邊界，尚未進入正式資料或公開宣稱階段。"
  },
  partial: {
    claimLimit: "部分資料條件尚未完整，所有解讀都必須保留折扣，不能升級為正式模型結論。",
    disclosure: "目前仍是 mock-only 狀態；資料品質為 partial，來源深度、權利與公開宣稱仍維持 not_ready。",
    label: "資料部分就緒",
    shortDescription: "部分欄位或驗證條件仍未齊備，畫面可用來檢查流程，但不能把分數視為可信訊號。"
  },
  stale: {
    claimLimit: "新鮮度未滿足前，不可把畫面解讀成即時、正式或可交易的資訊。",
    disclosure: "目前資料新鮮度為 stale；即使畫面可瀏覽，仍維持 mock-only 與 not_ready 邊界。",
    label: "資料新鮮度不足",
    shortDescription: "資料時間狀態需要更新或重新驗證，runtime 只能呈現保守提醒。"
  },
  unavailable: {
    claimLimit: "必要資料狀態不可用時，頁面不得暗示模型可信、資料完整或已完成審核。",
    disclosure: "目前缺少必要 runtime 狀態來源；畫面必須維持 mock-only disclosure，並等待後續 gate 補齊。",
    label: "資料狀態不可用",
    shortDescription: "runtime 缺少足夠資訊可安全分類，因此只能顯示不可用與待審核狀態。"
  }
};

export function getMockOnlyPublicDisplayState(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyDisplayState {
  if (state.dataQualityState === "unavailable") return "unavailable";
  if (state.dataQualityState === "stale") return "stale";
  if (state.dataQualityState === "partial" && state.freshnessState === "unknown") return "partial";

  return "mock";
}

export function getMockOnlyRuntimeUpgradeRequirements(
  state: Cp3MockOnlyRuntimeState
): Cp3MockOnlyUpgradeRequirement[] {
  return [
    {
      id: "score-source",
      label: "正式分數來源",
      owner: "Investment",
      state: state.scoreSource
    },
    {
      id: "source-depth",
      label: "來源深度",
      owner: "Data",
      state: state.sourceDepthState
    },
    {
      id: "source-rights",
      label: "來源權利",
      owner: "Legal",
      state: state.sourceRightsState
    },
    {
      id: "backtest",
      label: "回測審核",
      owner: "Engineering",
      state: state.backtestApprovalState
    },
    {
      id: "public-claim",
      label: "公開宣稱",
      owner: "CEO",
      state: state.claimApprovalState
    }
  ];
}

export function getMockOnlyRuntimeUpgradeVerdict(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyUpgradeVerdict {
  const requirements = getMockOnlyRuntimeUpgradeRequirements(state);
  const unexpectedRequirementCount = requirements.filter(
    (requirement) => requirement.state !== "mock" && requirement.state !== "not_ready"
  ).length;

  if (unexpectedRequirementCount > 0) {
    return {
      label: "禁止自動升級",
      reason: "仍存在非正式 runtime 狀態，必須回到 CEO/PM gate 重新檢查。",
      state: "blocked"
    };
  }

  return {
    label: "禁止自動升級",
    reason: "所有升級前置條件仍是 mock 或 not_ready；CP3 必須維持 mock-only。",
    state: "blocked"
  };
}
