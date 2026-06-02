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
      headline: "今天先判斷市場風險，再決定是否看個股",
      marketLine: `強勢 ${breadth.constructive}、觀察 ${breadth.watch}、防守 ${breadth.defensive}；風險最高為 ${topRisk.asset.symbol}。`,
      primary: {
        body: `${market.asset.symbol} 先作為市場溫度計，確認風險是全市場還是單一族群。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "先看市場",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 大盤基準`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 風險 ${topRisk.riskScore}/100，先拆波動與技術風險來源。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "再拆風險",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險升溫`,
        tone: "blocked"
      },
      stopLine: "晨報仍是 mock runtime 閱讀路線；publicDataSource=mock、scoreSource=mock，不提供買賣建議。"
    };
  }

  return {
    headline: "今天可先看市場延續，再檢查風險清單",
    marketLine: `強勢 ${breadth.constructive}、觀察 ${breadth.watch}、防守 ${breadth.defensive}；mock 廣度目前偏向可閱讀。`,
    primary: {
      body: `${market.asset.symbol} 綜合 ${market.compositeScore}/100，先確認市場結構是否延續。`,
      href: `/stocks/${market.asset.symbol}`,
      label: "先看市場",
      symbol: market.asset.symbol,
      title: `${market.asset.symbol} 市場延續`,
      tone: "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 風險 ${topRisk.riskScore}/100，作為追價前的反向檢查。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "再看風險",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險對照`,
      tone: "hold"
    },
    stopLine: "晨報只協助排序閱讀順序，不把 mock 分數升級為交易結論。"
  };
}
