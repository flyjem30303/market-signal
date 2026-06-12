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
  const marketLine = `市場廣度：${breadth.constructive} 個偏建設、${breadth.watch} 個觀察、${breadth.defensive} 個偏防守。這是 mock-only Beta 練習訊號。`;

  if (marketNeedsCaution || topRiskIsHot) {
    return {
      headline: "市場風險升溫，先降低解讀速度",
      marketLine: `${marketLine} 目前優先複核 ${topRisk.asset.symbol} 的風險來源。`,
      primary: {
        body: `${market.asset.symbol} 是目前市場氣氛入口，請先看成因、更新時間與影響級別，再決定是否需要加強觀察 ETF 或產業族群。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "市場總覽",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場狀態`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 風險分數為 ${topRisk.riskScore}/100，請把它當成提醒來源，不要把單一分數視為買賣訊號。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "風險來源",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險提示`,
        tone: "blocked"
      },
      stopLine:
        "資料邊界：publicDataSource=mock，scoreSource=mock。目前不是即時真實資料，不提供買賣建議，也不應作為交易依據。"
    };
  }

  return {
    headline: "市場氣氛偏穩，仍先用 mock 流程練習判讀",
    marketLine: `${marketLine} 目前畫面用來確認資訊階層與閱讀順序，尚未開放真實資料 promotion gate。`,
    primary: {
      body: `${market.asset.symbol} 綜合分數為 ${market.compositeScore}/100，可先用它理解市場氣氛，再往下查看成因與歷史脈絡。`,
      href: `/stocks/${market.asset.symbol}`,
      label: "市場入口",
      symbol: market.asset.symbol,
      title: `${market.asset.symbol} 今日解讀`,
      tone: "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 風險分數為 ${topRisk.riskScore}/100，即使市場偏穩，也要保留風險提示與資料邊界。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "風險觀察",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險觀察`,
      tone: "hold"
    },
    stopLine:
      "資料邊界：publicDataSource=mock，scoreSource=mock。現在呈現的是產品閱讀流程，不是正式市場資料或投資建議。"
  };
}
