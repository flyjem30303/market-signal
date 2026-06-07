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
  const marketLine = `市場廣度：${breadth.constructive} 個偏正向、${breadth.watch} 個觀察、${breadth.defensive} 個偏防守。`;

  if (marketNeedsCaution || topRiskIsHot) {
    return {
      headline: "市場晨報：風險降溫前先維持防守閱讀",
      marketLine: `${marketLine} 風險集中在 ${topRisk.asset.symbol}，Beta 閱讀應強調謹慎與覆核紀律。`,
      primary: {
        body: `${market.asset.symbol} 是本次示範晨報的市場錨點。先閱讀市場廣度、資料品質與目前警示狀態，再檢視個股或 ETF。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "閱讀市場錨點",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場邊界`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 的示範回檔風險分數為 ${topRisk.riskScore}/100。請把它視為覆核清單項目，不是交易建議或即時市場警報。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "覆核最高風險",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險覆核`,
        tone: "blocked"
      },
      stopLine:
        "晨報仍使用示範資料與示範分數；這是決策輔助脈絡，不構成投資建議。"
    };
  }

  return {
    headline: "市場晨報：示範訊號偏正向，但仍等待正式資料檢查點",
    marketLine: `${marketLine} 目前示範閱讀偏正向，但公開 Beta 仍必須揭露覆蓋率不足與來源權利限制。`,
    primary: {
      body: `${market.asset.symbol} 的示範綜合分數為 ${market.compositeScore}/100。可先用它理解市場方向，再進一步閱讀族群或標的頁。`,
      href: `/stocks/${market.asset.symbol}`,
      label: "閱讀市場強度",
      symbol: market.asset.symbol,
      title: `${market.asset.symbol} 市場閱讀`,
      tone: "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 的示範回檔風險分數為 ${topRisk.riskScore}/100。即使大盤閱讀偏正向，仍應保留在觀察清單。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "觀察風險清單",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險觀察`,
      tone: "hold"
    },
    stopLine:
      "本晨報仍使用示範資料與示範分數，不提供買進、賣出、持有或個人化投資建議。"
  };
}
