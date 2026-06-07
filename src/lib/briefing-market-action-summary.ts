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
  const marketLine = `Market breadth: ${breadth.constructive} constructive, ${breadth.watch} watch, ${breadth.defensive} defensive.`;

  if (marketNeedsCaution || topRiskIsHot) {
    return {
      headline: "CEO Briefing: keep the market read defensive until risk cools",
      marketLine: `${marketLine} Risk is concentrated in ${topRisk.asset.symbol}, so the Beta read should emphasize caution and review discipline.`,
      primary: {
        body: `${market.asset.symbol} is the market anchor for this mock briefing. Read it first to understand breadth, data quality, and the current caution state before reviewing individual stocks or ETFs.`,
        href: `/stocks/${market.asset.symbol}`,
        label: "Read market anchor",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} Market boundary`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} has a mock pullback-risk score of ${topRisk.riskScore}/100. Treat it as a review queue item, not as trading advice or a live market warning.`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "Review highest risk",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} Risk review`,
        tone: "blocked"
      },
      stopLine:
        "Briefing stays in mock runtime: publicDataSource=mock; scoreSource=mock. This is decision-support context, not investment advice."
    };
  }

  return {
    headline: "CEO Briefing: constructive mock read, still wait for real-data gates",
    marketLine: `${marketLine} The current mock read is constructive, but public Beta must still show partial coverage and source-rights limits.`,
    primary: {
      body: `${market.asset.symbol} has a mock composite score of ${market.compositeScore}/100. Use it to orient the market read before drilling into sector or symbol pages.`,
      href: `/stocks/${market.asset.symbol}`,
      label: "Read market strength",
      symbol: market.asset.symbol,
      title: `${market.asset.symbol} Market read`,
      tone: "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} has a mock pullback-risk score of ${topRisk.riskScore}/100. Keep it on the watch list even when the broad read is constructive.`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "Watch risk queue",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} Risk watch`,
      tone: "hold"
    },
    stopLine:
      "This briefing is still mock runtime: publicDataSource=mock; scoreSource=mock. It does not provide buy, sell, hold, or personalized investment advice."
  };
}
