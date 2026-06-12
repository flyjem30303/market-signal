export type PublicBetaSourceCoverageContext = "home" | "briefing" | "stock";

export type PublicBetaSourceCoverageLayer = {
  detail: string;
  id: string;
  label: string;
  next: string;
  state: "usable_demo" | "checking" | "blocked";
};

export type PublicBetaSourceCoverageRuntimeLabels = {
  boundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
    stopLine: string;
  };
  headline: string;
  layers: PublicBetaSourceCoverageLayer[];
  summary: string;
  userMeaning: string;
};

export function getPublicBetaSourceCoverageRuntimeLabels(
  context: PublicBetaSourceCoverageContext,
  stockSymbol = "2330"
): PublicBetaSourceCoverageRuntimeLabels {
  const contextLine =
    context === "stock"
      ? `${stockSymbol} 仍以示範資料說明標的狀態，來源與覆蓋率升級前不能視為正式行情。`
      : "目前公開 Beta 先讓使用者看懂市場狀態；資料來源與覆蓋率仍以候選路線呈現。";

  return {
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock",
      stopLine: "正式資料上線前，不宣稱即時真實資料、不宣稱完整覆蓋，也不提供買賣建議。"
    },
    headline: "來源與覆蓋狀態：先可讀，再升級",
    layers: [
      {
        detail: "支援 30 秒市場氛圍與晨報入口，但目前仍是示範訊號。",
        id: "index-baseline",
        label: "大盤基準",
        next: "確認官方候選來源條款、日期欄位、收盤值欄位與缺漏交易日規則。",
        state: "checking"
      },
      {
        detail: "支援 0050、006208 等核心 ETF 的產品閱讀路徑，尚未完成正式覆蓋。",
        id: "core-etf",
        label: "核心 ETF",
        next: "補 ETF 專屬來源、欄位對照、延遲揭露與公開展示條件。",
        state: "blocked"
      },
      {
        detail: "2330、2382、2308 可支援示範閱讀流程，但不是全市場覆蓋。",
        id: "listed-equity-batch1",
        label: "個股示範組",
        next: "建立批次規則，再逐步擴大上市股票 universe。",
        state: "usable_demo"
      }
    ],
    summary:
      "這個區塊把 A1 的來源與覆蓋矩陣先翻成 runtime 可讀標籤：哪些只是示範可讀、哪些正在確認、哪些仍被阻擋。",
    userMeaning: contextLine
  };
}
