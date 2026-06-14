import type { SignalSnapshot } from "@/lib/signal-model";

export type WeeklyMarketActionTone = "active" | "hold" | "blocked";

export type WeeklyMarketActionItem = {
  body: string;
  href: string;
  label: string;
  symbol: string;
  title: string;
  tone: WeeklyMarketActionTone;
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
  const weeklyLine = `本週示範資料顯示，偏多 ${breadth.constructive} 項、觀望 ${breadth.watch} 項、警戒 ${breadth.defensive} 項。`;

  if (defensiveWeek) {
    return {
      headline: "市場狀態偏向保守，先複核風險再觀察方向",
      primary: {
        body: `${market.asset.symbol} 目前燈號為「${market.signal.title}」，建議先查看市場總覽、核心指標與資料更新時間。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "查看市場狀態",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場狀態`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100，適合優先檢查造成警戒的指標與觀察重點。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "查看風險觀察",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險觀察`,
        tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
      },
      stopLine: "本週週報使用示範資料與示範分數，只作為市場資訊整理與風險辨識，不是投資建議。",
      weeklyLine: `${weeklyLine} 警戒項目較需要優先複核；如果資料延遲或異常，應降低對單一燈號的依賴。`
    };
  }

  return {
    headline: "市場狀態仍可觀察，先看總覽再檢查 ETF 與高風險項目",
    primary: {
      body: `${topEtf.asset.symbol} 健康分數 ${topEtf.healthScore}/100，可用來觀察 ETF 是否同步支持目前市場氣氛。`,
      href: `/stocks/${topEtf.asset.symbol}`,
      label: "查看 ETF 觀察",
      symbol: topEtf.asset.symbol,
      title: etfNeedsCaution ? `${topEtf.asset.symbol} ETF 需留意風險` : `${topEtf.asset.symbol} ETF 觀察`,
      tone: etfNeedsCaution ? "hold" : "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100，建議搭配市場總覽確認風險是否集中在少數標的。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "查看風險觀察",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險觀察`,
      tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
    },
    stopLine: "本週週報使用示範資料與示範分數，只作為市場資訊整理與風險辨識，不是投資建議。",
    weeklyLine: `${weeklyLine} 目前可先維持觀察，但仍需回看資料更新時間與高風險項目。`
  };
}
