import type { SignalSnapshot } from "@/lib/signal-model";

export type WeeklyMarketActionItem = {
  body: string;
  href: string;
  label: string;
  symbol: string;
  title: string;
  tone: "active" | "hold" | "blocked";
};

export type WeeklyMarketActionSummary = {
  headline: string;
  primary: WeeklyMarketActionItem;
  secondary: WeeklyMarketActionItem;
  stopLine: string;
  weeklyLine: string;
};

export function buildWeeklyMarketActionSummary(
  market: SignalSnapshot,
  topRisk: SignalSnapshot,
  topEtf: SignalSnapshot,
  breadth: { constructive: number; defensive: number; watch: number }
): WeeklyMarketActionSummary {
  const defensiveWeek = breadth.defensive > breadth.constructive || market.riskScore >= 60;
  const etfNeedsCaution = topEtf.riskScore >= 60;

  if (defensiveWeek) {
    return {
      headline: "本週先降速看市場，再拆高風險標的",
      primary: {
        body: `${market.asset.symbol} 先作為週期基準，確認大盤風險是否擴散到多數標的。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "主入口",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場基準`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 風險 ${topRisk.riskScore}/100，週末前先確認風險是否降溫。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "對照入口",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險檢查`,
        tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
      },
      stopLine: "週報只做 mock runtime 閱讀排序；publicDataSource=mock、scoreSource=mock，不提供買賣建議。",
      weeklyLine: `強勢 ${breadth.constructive}、觀察 ${breadth.watch}、防守 ${breadth.defensive}；本週先保守確認。`
    };
  }

  return {
    headline: "本週先看 ETF 節奏，再回頭檢查風險",
    primary: {
      body: `${topEtf.asset.symbol} 健康 ${topEtf.healthScore}/100，先看核心 ETF 是否支撐分批節奏。`,
      href: `/stocks/${topEtf.asset.symbol}`,
      label: "主入口",
      symbol: topEtf.asset.symbol,
      title: etfNeedsCaution ? `${topEtf.asset.symbol} ETF 保守觀察` : `${topEtf.asset.symbol} ETF 節奏`,
      tone: etfNeedsCaution ? "hold" : "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 風險 ${topRisk.riskScore}/100，作為追強前的週期風險對照。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "對照入口",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險對照`,
      tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
    },
    stopLine: "週報不是正式行情週報；mock 分數不能升級成交易結論。",
    weeklyLine: `強勢 ${breadth.constructive}、觀察 ${breadth.watch}、防守 ${breadth.defensive}；本週可先用 ETF 與風險清單校準。`
  };
}
