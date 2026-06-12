export type PublicBetaSourceCoverageContext = "home" | "briefing" | "stock";

export type PublicBetaSourceCoverageLayer = {
  detail: string;
  id: string;
  label: string;
  next: string;
  state: "usable_demo" | "checking" | "blocked";
};

export type PublicBetaSourceCoverageAction = {
  body: string;
  id: string;
  label: string;
  title: string;
};

export type PublicBetaSourceCoverageRuntimeLabels = {
  boundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
    stopLine: string;
  };
  headline: string;
  layers: PublicBetaSourceCoverageLayer[];
  readingActions: PublicBetaSourceCoverageAction[];
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
    headline: "資料來源與覆蓋狀態",
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
        label: "上市個股批次",
        next: "建立批次規則，再逐步擴大上市股票 universe。",
        state: "usable_demo"
      }
    ],
    readingActions: [
      {
        body: "先確認這個頁面目前只是示範資料，避免把燈號誤解成正式行情。",
        id: "check-boundary",
        label: "1",
        title: "先看資料狀態"
      },
      {
        body: "再看大盤、ETF、上市個股哪一層仍在檢查或暫停公開。",
        id: "check-coverage",
        label: "2",
        title: "再看覆蓋缺口"
      },
      {
        body: "最後回到晨報或標的頁，只把它當成下一步觀察線索，不當成交易指令。",
        id: "choose-next-observation",
        label: "3",
        title: "最後決定觀察方向"
      }
    ],
    summary:
      "公開 Beta 目前使用模擬資料，讓使用者先理解指數狀態儀表站的閱讀方式；正式市場資料、來源權利、覆蓋品質與更新節奏仍在檢查。",
    userMeaning: `${contextLine} 一般投資者可以把這一區當成資料可信度標籤：哪些只是展示可用、哪些還在檢查、哪些暫時不能當作完整市場覆蓋。`
  };
}
