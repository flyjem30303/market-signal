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
  const marketLine = `市場寬度：${breadth.constructive} 個偏建設、${breadth.watch} 個觀察、${breadth.defensive} 個偏防守。公開資料與分數仍維持示範模式。`;

  if (marketNeedsCaution || topRiskIsHot) {
    return {
      headline: "市場風險升溫，先看風險來源再看機會",
      marketLine: `${marketLine} 目前最高風險焦點是 ${topRisk.asset.symbol}；這份晨報只能作為公開 Beta 閱讀輔助，不是交易訊號。`,
      primary: {
        body: `${market.asset.symbol} 是這份晨報的市場錨點。先看大盤脈絡，再比較 ETF 或個股卡片。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "市場錨點",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場脈絡`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 目前示範風險分數最高，為 ${topRisk.riskScore}/100。正式資料升級前，只能當作風險觀察範例。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "風險觀察",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險焦點`,
        tone: "blocked"
      },
      stopLine: "不提供買賣建議；目前為 mock-only 公開 Beta，正式資料、分數與投資決策用途都尚未啟用。"
    };
  }

  return {
    headline: "市場暫時偏穩，但仍以 mock-only 閱讀為準",
    marketLine: `${marketLine} 目前示範寬度沒有顯示全面防守，但覆蓋率與來源權利缺口仍會限制解讀。`,
    primary: {
      body: `${market.asset.symbol} 示範綜合分數為 ${market.compositeScore}/100。它可用來閱讀市場結構，不是買賣訊號。`,
      href: `/stocks/${market.asset.symbol}`,
      label: "市場脈絡",
      symbol: market.asset.symbol,
      title: `${market.asset.symbol} 晨報路徑`,
      tone: "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 示範風險分數為 ${topRisk.riskScore}/100。來源權利與覆蓋率未完成前，只適合列入觀察。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "風險觀察",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險觀察`,
      tone: "hold"
    },
    stopLine: "不提供買賣建議；目前仍是示範資料與示範分數，正式資料與真實分數仍需通過 promotion gate。"
  };
}
