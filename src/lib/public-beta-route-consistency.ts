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

  return {
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock",
      stopLine: "目前所有公開路徑仍是 mock-only 公開 Beta；不是即時真實資料，不提供買賣建議。"
    },
    headline: context === "stock" ? "從標的回到市場，再確認資料邊界" : "同一條閱讀路徑：首頁、晨報、標的頁",
    nextDataGate:
      "下一步只會先補官方候選來源的條款位置、欄位對照與覆蓋範圍；正式資料上線仍需另外通過來源、品質、回讀與揭露 gate。",
    primaryMessage:
      "使用者先在首頁看市場氛圍，再進晨報拆成因與警示，最後到標的頁確認單一標的狀態、資料品質與下一步觀察。",
    routeSteps: [
      {
        href: "/",
        label: "1",
        purpose: "30 秒看懂市場氛圍、核心指標與警示清單。",
        title: "首頁：市場總覽"
      },
      {
        href: "/briefing",
        label: "2",
        purpose: "3 分鐘拆成因、更新時間、影響級別與下一步。",
        title: "晨報：行動判斷"
      },
      {
        href: stockHref,
        label: "3",
        purpose: "確認標的氛圍、資料缺口、風險來源與 mock 邊界。",
        title: `${stockSymbol}：標的細節`
      }
    ],
    sourceCoverageState:
      "資料來源與覆蓋率仍在確認中：可以公開說明候選來源與覆蓋路線，但不能宣稱正式匯入、完整覆蓋或 real score。",
    subhead: "這個區塊用同一套語言把產品路徑、資料邊界與下一個資料關卡串起來。"
  };
}
