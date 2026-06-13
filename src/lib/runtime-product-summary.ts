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
      displayBody: "下一步補齊來源、欄位、覆蓋率與品質條件。",
      displayLabel: "下一步",
      displayTitle: "補齊資料升級條件",
      label: "Next gate"
    }),
    notLiveYet: item({
      displayBody: "目前不要把頁面分數當成即時行情或買賣依據。",
      displayLabel: "尚未上線",
      displayTitle: "正式資料仍在準備",
      label: "Not live yet"
    }),
    readonlyDecision: item({
      displayBody: "頁面會保留資料限制，避免把展示內容誤讀成正式市場證據。",
      displayLabel: "資料信任",
      displayTitle: "資料限制會清楚揭露",
      label: "Data check result"
    }),
    useNow: item({
      displayBody: `${symbol} 目前可用來體驗 30 秒市場氣氛與 3 分鐘行動判斷流程。`,
      displayLabel: "現在可用",
      displayTitle: "閱讀示範市場狀態",
      label: "Use now"
    })
  };
}
