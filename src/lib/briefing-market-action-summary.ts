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

const copy = {
  defensiveHeadline: "\u5e02\u5834\u98a8\u96aa\u6b63\u5728\u5347\u6eab\uff0c\u5148\u6536\u6582\u5230\u89c0\u5bdf\u8207\u964d\u98a8\u96aa\u5224\u65b7",
  healthyHeadline: "\u5e02\u5834\u6c23\u6c1b\u5c1a\u53ef\uff0c\u5148\u7528 briefing \u628a\u89c0\u5bdf\u9806\u5e8f\u6392\u597d",
  marketLabel: "\u5e02\u5834\u7e3d\u89bd",
  primaryRisk: "\u98a8\u96aa\u89c0\u5bdf",
  stableLabel: "\u5927\u76e4\u8108\u7d61",
  stopLine:
    "\u9019\u662f\u516c\u958b Beta \u8cc7\u8a0a\u5100\u8868\u677f\uff1a\u76ee\u524d\u4f7f\u7528\u793a\u7bc4\u8cc7\u6599\u8207\u793a\u7bc4\u5206\u6578\uff1b\u4e0d\u5ba3\u7a31\u5373\u6642\u771f\u5be6\u8cc7\u6599\uff0c\u4e0d\u63d0\u4f9b\u500b\u80a1\u8cb7\u8ce3\u5efa\u8b70\u3002"
};

export function buildBriefingMarketActionSummary(
  market: SignalSnapshot,
  topRisk: SignalSnapshot,
  breadth: { constructive: number; defensive: number; watch: number }
): BriefingMarketActionSummary {
  const marketNeedsCaution = market.riskScore >= 60 || breadth.defensive > breadth.constructive;
  const topRiskIsHot = topRisk.riskScore >= 70;
  const marketLine = `\u5e02\u5834\u5ee3\u5ea6\uff1a${breadth.constructive} \u500b\u504f\u5efa\u8a2d\u6027\u3001${breadth.watch} \u500b\u9700\u8981\u89c0\u5bdf\u3001${breadth.defensive} \u500b\u504f\u9632\u5b88\u3002\u9019\u662f\u516c\u958b Beta \u7684\u8cc7\u8a0a\u7d50\u69cb\u5316\u8b80\u53d6\u3002`;

  if (marketNeedsCaution || topRiskIsHot) {
    return {
      headline: copy.defensiveHeadline,
      marketLine: `${marketLine} \u76ee\u524d\u5efa\u8b70\u5148\u770b ${topRisk.asset.symbol} \u7684\u98a8\u96aa\u6210\u56e0\u3002`,
      primary: {
        body: `${market.asset.symbol} \u53ef\u4f5c\u70ba\u5168\u5e02\u5834\u80cc\u666f\uff1a\u5148\u5224\u65b7\u98a8\u96aa\u662f\u5ee3\u6cdb\u64f4\u6563\uff0c\u9084\u662f\u96c6\u4e2d\u5728\u5c11\u6578\u6a19\u7684\u3002`,
        href: `/stocks/${market.asset.symbol}`,
        label: copy.marketLabel,
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} ${copy.stableLabel}`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} \u98a8\u96aa\u5206\u6578 ${topRisk.riskScore}/100\uff0c\u8acb\u5148\u770b\u6210\u56e0\u3001\u66f4\u65b0\u6642\u9593\u8207\u5f71\u97ff\u7d1a\u5225\uff0c\u518d\u6c7a\u5b9a\u662f\u5426\u52a0\u5f37\u89c0\u5bdf\u6216\u964d\u4f4e\u98a8\u96aa\u66b4\u9732\u3002`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: copy.primaryRisk,
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} \u98a8\u96aa\u6210\u56e0`,
        tone: "blocked"
      },
      stopLine: copy.stopLine
    };
  }

  return {
    headline: copy.healthyHeadline,
    marketLine: `${marketLine} \u5efa\u8b70\u5148\u770b\u5927\u76e4\u72c0\u614b\uff0c\u518d\u6383\u63cf\u6700\u9700\u8981\u7559\u610f\u7684\u98a8\u96aa\u9ede\u3002`,
    primary: {
      body: `${market.asset.symbol} \u7d9c\u5408\u5206\u6578 ${market.compositeScore}/100\uff0c\u53ef\u4ee5\u7576\u4f5c\u4eca\u5929\u5e02\u5834\u6c23\u6c1b\u7684\u9996\u8981\u80cc\u666f\u3002`,
      href: `/stocks/${market.asset.symbol}`,
      label: copy.marketLabel,
      symbol: market.asset.symbol,
      title: `${market.asset.symbol} ${copy.stableLabel}`,
      tone: "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} \u98a8\u96aa\u5206\u6578 ${topRisk.riskScore}/100\uff0c\u5e02\u5834\u504f\u7a69\u6642\u4ecd\u61c9\u4fdd\u7559\u4e00\u500b\u98a8\u96aa\u89c0\u5bdf\u6e05\u55ae\u3002`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: copy.primaryRisk,
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} \u98a8\u96aa\u89c0\u5bdf`,
      tone: "hold"
    },
    stopLine: copy.stopLine
  };
}
