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
    claimLimit: "此狀態不能作為投資建議、官方資料品質聲明或真實分數宣稱。",
    disclosure: "目前分數來源是 mock，僅用於本地 runtime 介面驗證；真實資料、來源深度與公開宣稱仍未開放。",
    label: "模擬資料燈號",
    shortDescription: "這個區塊只顯示本地 mock runtime 狀態，用來確認頁面如何揭露資料限制。"
  },
  partial: {
    claimLimit: "部分資料仍未達公開使用條件，不能宣稱完整、即時或可用於正式決策。",
    disclosure: "目前只允許呈現局部 mock 狀態；來源深度、來源權利與公開宣稱都維持 not_ready。",
    label: "局部資料燈號",
    shortDescription: "資料品質顯示為 partial，代表介面可展示限制，但不能升級為真實分數。"
  },
  stale: {
    claimLimit: "資料時效不足，不能宣稱最新、即時、可交易或具備正式可信度。",
    disclosure: "目前資料被標示為 stale；頁面必須保留 mock-only 與 not_ready 邊界。",
    label: "資料過期燈號",
    shortDescription: "資料 freshness 顯示過期，因此 runtime 只能呈現警示與限制。"
  },
  unavailable: {
    claimLimit: "資料不可用時，頁面只能呈現限制說明，不能輸出實質市場判斷。",
    disclosure: "目前資料狀態不可用；所有真實資料、來源權利與公開宣稱 gate 都維持未開放。",
    label: "資料不可用",
    shortDescription: "runtime 狀態缺少可展示的資料品質，只能保留 mock-only disclosure。"
  }
};

export function getMockOnlyPublicDisplayState(state: Cp3MockOnlyRuntimeState): Cp3MockOnlyDisplayState {
  if (state.dataQualityState === "unavailable") return "unavailable";
  if (state.dataQualityState === "stale") return "stale";
  if (state.dataQualityState === "partial" && state.freshnessState === "unknown") return "partial";

  return "mock";
}
