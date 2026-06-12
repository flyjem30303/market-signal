export type PublicBetaDecisionLoopContext = "home" | "briefing" | "stock";

type DecisionLoopStep = {
  body: string;
  label: string;
  title: string;
};

type DecisionLoopLink = {
  href: string;
  label: string;
  title: string;
};

export type PublicBetaDecisionLoopBridgeCopy = {
  boundary: string;
  contextLine: string;
  eyebrow: string;
  headline: string;
  link: DecisionLoopLink;
  steps: DecisionLoopStep[];
};

const steps: DecisionLoopStep[] = [
  {
    body: "用紅黃綠燈先判斷目前偏正向、觀察或防守，避免一開始就被單一數字帶走。",
    label: "Step 1",
    title: "先看市場氛圍"
  },
  {
    body: "確認警示成因、更新時間、影響級別與下一步觀察，把訊號放回時間脈絡。",
    label: "Step 2",
    title: "再看成因與時間"
  },
  {
    body: "publicDataSource=mock，scoreSource=mock；目前不是即時真實資料，不提供買賣建議。",
    label: "Step 3",
    title: "最後看資料邊界"
  }
];

export function getPublicBetaDecisionLoopBridge(
  context: PublicBetaDecisionLoopContext,
  stockSymbol = "TWII"
): PublicBetaDecisionLoopBridgeCopy {
  const normalizedSymbol = stockSymbol || "TWII";
  const contextMap: Record<PublicBetaDecisionLoopContext, Pick<PublicBetaDecisionLoopBridgeCopy, "contextLine" | "link">> = {
    briefing: {
      contextLine: "Briefing 把全市場總覽延伸成觀察清單，幫使用者在 3 分鐘內決定關注、加強觀察或降低風險。",
      link: {
        href: `/stocks/${normalizedSymbol}`,
        label: "查看市場錨點頁",
        title: `${normalizedSymbol} 標的頁`
      }
    },
    home: {
      contextLine: "首頁負責 30 秒建立市場氛圍，再把需要複核的訊號導向 briefing 或標的頁。",
      link: {
        href: "/briefing",
        label: "進入今日 briefing",
        title: "看完整觀察清單"
      }
    },
    stock: {
      contextLine: "標的頁把單一股票或指數放回市場、成因與資料邊界中判讀，避免把 mock 訊號當成交易指令。",
      link: {
        href: "/briefing",
        label: "回到市場 briefing",
        title: "複核全市場脈絡"
      }
    }
  };

  return {
    boundary: "公開 Beta 目前只做市場狀態閱讀與決策輔助，不宣稱即時真實資料，也不提供投資建議。",
    contextLine: contextMap[context].contextLine,
    eyebrow: "Public Beta Decision Loop",
    headline: "30 秒市場氛圍，3 分鐘行動判斷",
    link: contextMap[context].link,
    steps
  };
}
