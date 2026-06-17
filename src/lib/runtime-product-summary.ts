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
      displayBody: "下一步是完成資料品質、來源揭露、更新時間與錯誤回復檢查，再決定是否開放正式資料模式。",
      displayLabel: "下一步",
      displayTitle: "正式資料升級前檢查",
      label: "Next gate"
    }),
    notLiveYet: item({
      displayBody: "目前公開頁仍使用示範資料與示範分數，避免使用者誤以為燈號已連接正式行情。",
      displayLabel: "尚未開放",
      displayTitle: "正式資料尚未切換",
      label: "Not live yet"
    }),
    readonlyDecision: item({
      displayBody: "資料覆蓋與來源審核已可作為內部證據，但公開頁仍維持示範資料，直到升級檢查完成。",
      displayLabel: "資料檢查",
      displayTitle: "資料覆蓋完成，等待正式升級審核",
      label: "Data check result"
    }),
    useNow: item({
      displayBody: `${symbol} 目前可用來閱讀示範燈號、風險提示、資料更新時間與下一步觀察重點。`,
      displayLabel: "現在可用",
      displayTitle: "可先用來理解市場狀態",
      label: "Use now"
    })
  };
}
