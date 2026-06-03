import type { SignalSnapshot } from "@/lib/signal-model";

export type BriefingMarketActionItem = {
  body: string;
  href: string;
  label: string;
  symbol: string;
  title: string;
  tone: "active" | "hold" | "blocked";
};

export type BriefingMarketActionSummary = {
  headline: string;
  marketLine: string;
  primary: BriefingMarketActionItem;
  secondary: BriefingMarketActionItem;
  stopLine: string;
};

export function buildBriefingMarketActionSummary(
  market: SignalSnapshot,
  topRisk: SignalSnapshot,
  breadth: { constructive: number; defensive: number; watch: number }
): BriefingMarketActionSummary {
  const marketNeedsCaution = market.riskScore >= 60 || breadth.defensive > breadth.constructive;
  const topRiskIsHot = topRisk.riskScore >= 70;

  if (marketNeedsCaution || topRiskIsHot) {
    return {
      headline: "CEO Briefing：先收斂市場風險，再看個股機會",
      marketLine: `市場分布：${breadth.constructive} 個偏正向、${breadth.watch} 個觀察中、${breadth.defensive} 個偏防守；最高風險是 ${topRisk.asset.symbol}。`,
      primary: {
        body: `${market.asset.symbol} 是大盤基準，先確認市場壓力是否會放大個股與 ETF 的誤讀風險。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "看大盤基準",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場脈絡`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 風險 ${topRisk.riskScore}/100，需要先看風險模組與停止閱讀條件。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "檢查最高風險",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險偏高`,
        tone: "blocked"
      },
      stopLine:
        "Briefing 仍是 mock runtime 摘要；publicDataSource=mock，scoreSource=mock，不提供買賣建議，也不可升級為投資建議。"
    };
  }

  return {
    headline: "CEO Briefing：市場可閱讀，但仍需保留 mock 邊界",
    marketLine: `市場分布：${breadth.constructive} 個偏正向、${breadth.watch} 個觀察中、${breadth.defensive} 個偏防守；可用於產品流程驗證。`,
    primary: {
      body: `${market.asset.symbol} 綜合分數 ${market.compositeScore}/100，適合先看市場方向與資料揭露。`,
      href: `/stocks/${market.asset.symbol}`,
      label: "看市場方向",
      symbol: market.asset.symbol,
      title: `${market.asset.symbol} 市場基準`,
      tone: "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 風險 ${topRisk.riskScore}/100，作為第二步風險檢查。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "補看風險",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險觀察`,
      tone: "hold"
    },
    stopLine: "目前只可作為 mock 決策輔助與產品驗證，不可視為真實市場結論。"
  };
}
