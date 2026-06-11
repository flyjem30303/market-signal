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
  const marketLine = `Market breadth: ${breadth.constructive} constructive, ${breadth.watch} watch, ${breadth.defensive} defensive. Public data and scoring remain in demo mode.`;

  if (marketNeedsCaution || topRiskIsHot) {
    return {
      headline: "市場風險升溫，先看風險來源再看機會",
      marketLine: `${marketLine} The hottest risk signal is ${topRisk.asset.symbol}; treat the briefing as a public Beta reading aid, not an execution signal.`,
      primary: {
        body: `${market.asset.symbol} is the market anchor for this briefing. Use it to understand the mock market context before comparing ETF or stock cards.`,
        href: `/stocks/${market.asset.symbol}`,
        label: "Market anchor",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} market context`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} has the highest current mock risk score at ${topRisk.riskScore}/100. Review it as a risk-watch example while real-data promotion remains closed.`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "Risk watch",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} risk focus`,
        tone: "blocked"
      },
      stopLine: "不提供買賣建議；目前為 mock-only 公開 Beta，正式資料、分數與投資決策用途都尚未啟用。"
    };
  }

  return {
    headline: "市場暫時偏穩，但仍以 mock-only 閱讀為準",
    marketLine: `${marketLine} The current mock breadth is not showing a broad defensive tilt, but coverage and source-rights gaps still limit interpretation.`,
    primary: {
      body: `${market.asset.symbol} composite score is ${market.compositeScore}/100. Use it as a mock reading path for market structure, not as a buy or sell signal.`,
      href: `/stocks/${market.asset.symbol}`,
      label: "Market context",
      symbol: market.asset.symbol,
      title: `${market.asset.symbol} briefing path`,
      tone: "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} risk score is ${topRisk.riskScore}/100. Keep it on the watch list while source-rights and coverage gates remain incomplete.`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "Risk watch",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} risk watch`,
      tone: "hold"
    },
    stopLine: "不提供買賣建議；目前仍是示範資料與示範分數，正式資料與真實分數仍需通過 promotion gate。"
  };
}
