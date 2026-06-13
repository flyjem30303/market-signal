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
    body: "先用紅黃綠狀態與核心指標判斷今天的市場氛圍，避免一開始就陷入單一數字。",
    label: "Step 1",
    title: "30 秒看市場氛圍"
  },
  {
    body: "再看成因、更新時間、影響級別與警示清單，把市場狀態轉成觀察行動。",
    label: "Step 2",
    title: "3 分鐘做行動判斷"
  },
  {
    body: "最後確認資料來源與覆蓋率：目前仍是示範資料與示範分數，屬於非投資建議，不提供買賣建議。",
    label: "Step 3",
    title: "確認資料邊界"
  }
];

export function getPublicBetaDecisionLoopBridge(
  context: PublicBetaDecisionLoopContext,
  stockSymbol = "TWII"
): PublicBetaDecisionLoopBridgeCopy {
  const normalizedSymbol = stockSymbol || "TWII";
  const contextMap: Record<PublicBetaDecisionLoopContext, Pick<PublicBetaDecisionLoopBridgeCopy, "contextLine" | "link">> = {
    briefing: {
      contextLine: "Briefing 把首頁的市場氣氛拆成原因、警示與下一步，讓使用者能在 3 分鐘內決定是否加強觀察。",
      link: {
        href: `/stocks/${normalizedSymbol}`,
        label: "回到標的頁複核",
        title: `${normalizedSymbol} 成因與指標`
      }
    },
    home: {
      contextLine: "首頁負責 30 秒判斷市場氛圍，再把需要複核的問題帶到 briefing。",
      link: {
        href: "/briefing",
        label: "查看完整 briefing",
        title: "查看市場成因與警示"
      }
    },
    stock: {
      contextLine: "標的頁負責確認個別標的是否跟著市場走，或需要用資料邊界降級解讀。",
      link: {
        href: "/briefing",
        label: "回市場 briefing",
        title: "回到全市場脈絡"
      }
    }
  };

  return {
    boundary: "公開 Beta 目前使用示範資料與示範分數；屬於非投資建議，不宣稱即時真實資料，不提供買賣建議，也不保證報酬。",
    contextLine: contextMap[context].contextLine,
    eyebrow: "Public Beta Decision Loop",
    headline: "30 秒市場氛圍到 3 分鐘行動判斷",
    link: contextMap[context].link,
    steps
  };
}
