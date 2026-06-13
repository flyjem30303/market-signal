export type PublicBetaDecisionJourneyContext = "home" | "briefing" | "stock";

export type PublicBetaDecisionJourneyStep = {
  href: string;
  label: string;
  purpose: string;
  title: string;
};

export type PublicBetaDecisionJourney = {
  boundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
    text: string;
  };
  headline: string;
  nextAction: string;
  steps: PublicBetaDecisionJourneyStep[];
  summary: string;
};

export function getPublicBetaDecisionJourney(
  context: PublicBetaDecisionJourneyContext,
  stockSymbol = "2330"
): PublicBetaDecisionJourney {
  const stockHref = `/stocks/${stockSymbol}`;
  const contextSummary = {
    home: "你現在在首頁：先用 30 秒看市場氛圍，再進入 briefing 找原因與行動判斷。",
    briefing: "你現在在 briefing：先把全市場原因收斂，再到標的頁確認成因與指標順序。",
    stock: "你現在在標的頁：先看成因、更新時間與影響級別，再用指標優先順序決定要不要加強觀察。"
  } satisfies Record<PublicBetaDecisionJourneyContext, string>;

  return {
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock",
      text: "這條路徑只是公開 Beta 閱讀閉環：使用示範資料與示範分數，不宣稱即時真實資料，不提供買賣建議，也不把示範分數當成投資結論。"
    },
    headline: "從 30 秒氛圍到 3 分鐘行動判斷",
    nextAction: "閱讀順序是固定的：首頁先看市場氣氛，briefing 看原因與清單，標的頁看成因與指標優先順序。",
    steps: [
      {
        href: "/",
        label: "1",
        purpose: "用紅黃綠狀態、核心指標與警示清單，先判斷今天是否需要多看市場。",
        title: "30 秒市場氛圍"
      },
      {
        href: "/briefing",
        label: "2",
        purpose: "把市場狀態轉成原因、觀察清單與下一步行動判斷。",
        title: "3 分鐘行動判斷"
      },
      {
        href: stockHref,
        label: "3",
        purpose: "回到單一標的，確認燈號成因、更新時間、影響級別與指標優先順序。",
        title: `${stockSymbol} 成因與指標優先順序`
      }
    ],
    summary: contextSummary[context]
  };
}
