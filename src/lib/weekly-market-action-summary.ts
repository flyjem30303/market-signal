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
  const weeklyLine = `本週示範資料顯示：${breadth.constructive} 個偏強、${breadth.watch} 個觀察、${breadth.defensive} 個偏防守。`;

  if (defensiveWeek) {
    return {
      headline: "本週偏防守，先確認風險是否擴散",
      primary: {
        body: `${market.asset.symbol} 風險或市場廣度需要加強觀察。先看大盤，再看 ETF 與主要風險標的是否同步轉弱。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "先看市場",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場狀態`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100。請檢查成因，避免只用單一分數判斷。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "再看風險",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險觀察`,
        tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
      },
      stopLine: "本週週報使用示範資料與示範分數；正式市場資料尚未啟用，內容不是投資建議。",
      weeklyLine: `${weeklyLine} 市場偏防守時，適合先降低判讀信心並等待更多資料確認。`
    };
  }

  return {
    headline: "本週可持續觀察市場延續性",
    primary: {
      body: `${topEtf.asset.symbol} 健康分數 ${topEtf.healthScore}/100。可用來觀察 ETF 是否支持同一個市場方向。`,
      href: `/stocks/${topEtf.asset.symbol}`,
      label: "ETF 觀察",
      symbol: topEtf.asset.symbol,
      title: etfNeedsCaution ? `${topEtf.asset.symbol} ETF 仍需留意風險` : `${topEtf.asset.symbol} ETF 觀察`,
      tone: etfNeedsCaution ? "hold" : "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100。即使市場偏穩，也要確認風險是否集中。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "風險複核",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險觀察`,
      tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
    },
    stopLine: "本週週報使用示範資料與示範分數；正式市場資料尚未啟用，內容不是投資建議。",
    weeklyLine: `${weeklyLine} 市場暫時偏穩，但仍需搭配資料狀態與風險標的確認。`
  };
}
