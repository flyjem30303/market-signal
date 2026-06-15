export type RuntimeProductSummaryItem = {
  body: string;
  displayBody: string;
  displayLabel: string;
  displayTitle: string;
  label: "Use now" | "Not live yet" | "Next gate" | "Data check result";
  title: string;
};

export type RuntimeProductSummary = {
  nextGate: RuntimeProductSummaryItem;
  notLiveYet: RuntimeProductSummaryItem;
  readonlyDecision: RuntimeProductSummaryItem;
  useNow: RuntimeProductSummaryItem;
};

function item(input: Omit<RuntimeProductSummaryItem, "body" | "title"> & { displayBody: string; displayTitle: string }) {
  return {
    ...input,
    body: input.displayBody,
    title: input.displayTitle
  };
}

export function getRuntimeProductSummary(symbol: string): RuntimeProductSummary {
  return {
    nextGate: item({
      displayBody: "正式資料上線前，必須先補齊來源權利、資料覆蓋、品質驗證與回復方案。",
      displayLabel: "下一步",
      displayTitle: "等待正式資料切換檢查",
      label: "Next gate"
    }),
    notLiveYet: item({
      displayBody: "目前頁面仍使用示範資料，不代表即時真實行情，也不提供買賣建議。",
      displayLabel: "尚未啟用",
      displayTitle: "正式資料尚未啟用",
      label: "Not live yet"
    }),
    readonlyDecision: item({
      displayBody: "資料讀取與覆蓋率檢查仍在資料線處理；公開版先維持清楚的 mock/real 邊界。",
      displayLabel: "資料檢查",
      displayTitle: "資料邊界維持清楚標示",
      label: "Data check result"
    }),
    useNow: item({
      displayBody: `${symbol} 目前可用來快速閱讀燈號、分數與風險提示，再搭配市場簡報與週報複核。`,
      displayLabel: "現在可用",
      displayTitle: "用示範燈號建立觀察流程",
      label: "Use now"
    })
  };
}
