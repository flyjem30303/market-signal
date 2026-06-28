export type PublicBetaRouteConsistencyContext = "home" | "briefing" | "stock";

export type PublicBetaRouteStep = {
  href: string;
  label: string;
  purpose: string;
  title: string;
};

export type PublicBetaRouteConsistency = {
  boundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
    stopLine: string;
  };
  headline: string;
  nextDataGate: string;
  primaryMessage: string;
  routeSteps: PublicBetaRouteStep[];
  sourceCoverageState: string;
  subhead: string;
};

export function getPublicBetaRouteConsistency(
  context: PublicBetaRouteConsistencyContext,
  stockSymbol = "2330"
): PublicBetaRouteConsistency {
  const stockHref = `/stocks/${stockSymbol}`;
  const headline =
    context === "stock"
      ? "把標的訊號放回市場脈絡中判讀"
      : "從首頁總覽到 briefing，再到標的頁";

  return {
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock",
      stopLine: "目前仍是公開 Beta 示範資料，不是即時正式資料，不提供買賣建議。"
    },
    headline,
    nextDataGate:
      "下一個資料 gate 是確認合法免費可自動化來源、欄位契約、覆蓋範圍與升級條件；未通過前不切換真實資料來源。",
    primaryMessage:
      "公開頁應該像產品導覽，而不是內部執行紀錄。使用者先看市場氛圍，再看 briefing 的原因與影響，最後到標的頁確認細節。",
    routeSteps: [
      {
        href: "/",
        label: "1",
        purpose: "30 秒內建立市場氛圍，快速知道目前偏正向、觀察或防守。",
        title: "首頁：看市場溫度"
      },
      {
        href: "/markets/tw",
        label: "2",
        purpose: "3 分鐘內確認警示成因、更新時間、影響級別與下一步觀察。",
        title: "Briefing：看原因與行動"
      },
      {
        href: stockHref,
        label: "3",
        purpose: "把單一標的放回市場、資料邊界與 mock 訊號脈絡中判讀。",
        title: `${stockSymbol}：看標的細節`
      }
    ],
    sourceCoverageState:
      "資料來源與覆蓋率仍在準備中；目前頁面只把候選來源、覆蓋缺口與 mock 邊界轉成使用者可讀狀態。",
    subhead: "這條閱讀路徑讓使用者知道每一頁該回答什麼問題，也避免把 mock 分數誤認為交易指令。"
  };
}
