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
  const marketLine = `市場分布：${breadth.constructive} 個偏正向、${breadth.watch} 個觀察中、${breadth.defensive} 個偏防守。`;

  if (marketNeedsCaution || topRiskIsHot) {
    return {
      headline: "CEO Briefing：市場風險升溫，先守住 mock 邊界",
      marketLine: `${marketLine} 目前最需要追蹤的風險標的是 ${topRisk.asset.symbol}。`,
      primary: {
        body: `${market.asset.symbol} 顯示大盤風險需要留意，先看市場廣度與風險分布，再決定是否進一步檢查 ETF 或權值股。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "查看大盤狀態",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場背景`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100，建議先看風險來源與資料品質，不要直接推論正式訊號。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "查看最高風險",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險檢查`,
        tone: "blocked"
      },
      stopLine:
        "Briefing 仍是 mock runtime 摘要；publicDataSource=mock，scoreSource=mock，不提供買賣建議，也不可作為投資建議。"
    };
  }

  return {
    headline: "CEO Briefing：市場暫時偏穩，繼續用 mock 摘要觀察",
    marketLine: `${marketLine} 目前可以先追蹤大盤與最高風險標的的差距。`,
    primary: {
      body: `${market.asset.symbol} 綜合分數 ${market.compositeScore}/100，可先看趨勢、廣度與資料品質是否一致。`,
      href: `/stocks/${market.asset.symbol}`,
      label: "查看大盤趨勢",
      symbol: market.asset.symbol,
      title: `${market.asset.symbol} 市場狀態`,
      tone: "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100，仍需要保留風險觀察，不宜只看強勢分數。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "同步查看風險",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險追蹤`,
      tone: "hold"
    },
    stopLine: "目前只能使用 mock runtime 解讀；publicDataSource=mock，scoreSource=mock，不能推論正式市場訊號。"
  };
}
