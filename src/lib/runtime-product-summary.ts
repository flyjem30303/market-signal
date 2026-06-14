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
      displayBody: "合法免費可自動化來源、覆蓋率與品質通過後，才會開啟前台正式資料切換。",
      displayLabel: "下一關",
      displayTitle: "等待資料 promotion gate",
      label: "Next gate"
    }),
    notLiveYet: item({
      displayBody: "目前仍以示範資料呈現閱讀流程，不能宣稱即時正式資料。",
      displayLabel: "尚未正式",
      displayTitle: "正式資料尚未啟用",
      label: "Not live yet"
    }),
    readonlyDecision: item({
      displayBody: "資料檢查需確認來源權利、欄位合約、覆蓋率、時間戳、缺漏與錯誤回退。",
      displayLabel: "資料檢查",
      displayTitle: "資料上線前的必要檢查",
      label: "Data check result"
    }),
    useNow: item({
      displayBody: `${symbol} 目前可用來示範 30 秒狀態與 3 分鐘觀察流程。`,
      displayLabel: "現在可用",
      displayTitle: "示範燈號可用來理解閱讀順序",
      label: "Use now"
    })
  };
}
