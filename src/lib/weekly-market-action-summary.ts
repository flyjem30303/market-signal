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
  const weeklyLine = `本週示範資料中，建設性 ${breadth.constructive} 檔、觀察 ${breadth.watch} 檔、防守 ${breadth.defensive} 檔。`;

  if (defensiveWeek) {
    return {
      headline: "本週先確認市場風險，再挑選觀察清單",
      primary: {
        body: `${market.asset.symbol} 是目前市場總覽入口。先確認指數狀態、風險分數與更新時間，再決定是否深入個股或 ETF。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "先看市場",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場狀態`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 目前風險分數 ${topRisk.riskScore}/100，適合作為本週優先複核的風險樣本。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "複核風險",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險觀察`,
        tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
      },
      stopLine:
        "本週週報仍是 mock runtime：publicDataSource=mock、scoreSource=mock。正式市場資料尚未啟用，內容為非投資建議。",
      weeklyLine: `${weeklyLine} 市場偏防守時，先減少誤讀，再做下一步觀察。`
    };
  }

  return {
    headline: "本週可先讀市場氛圍，再追蹤 ETF 與高風險項",
    primary: {
      body: `${topEtf.asset.symbol} 健康分數 ${topEtf.healthScore}/100，可作為 ETF 觀察入口。請同時看風險、成因與更新時間。`,
      href: `/stocks/${topEtf.asset.symbol}`,
      label: "ETF 入口",
      symbol: topEtf.asset.symbol,
      title: etfNeedsCaution ? `${topEtf.asset.symbol} ETF 需複核風險` : `${topEtf.asset.symbol} ETF 觀察`,
      tone: etfNeedsCaution ? "hold" : "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100，適合用來確認市場是否只有少數標的轉弱。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "風險樣本",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險觀察`,
      tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
    },
    stopLine:
      "本週週報仍是 mock runtime：publicDataSource=mock、scoreSource=mock。正式市場資料尚未啟用，內容為非投資建議。",
    weeklyLine: `${weeklyLine} 若市場偏穩，仍需用個別頁面確認訊號成因。`
  };
}
