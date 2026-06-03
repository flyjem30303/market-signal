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
      headline: "本週先看大盤壓力，再確認最高風險標的",
      primary: {
        body: `${market.asset.symbol} 是本週市場基準，先判斷防守訊號是否擴散到個股與 ETF。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "進入大盤頁",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場壓力`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 風險 ${topRisk.riskScore}/100，本週需要優先確認風險來源與資料狀態。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "檢查高風險",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險檢查`,
        tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
      },
      stopLine:
        "週報仍是 mock runtime 摘要；publicDataSource=mock，scoreSource=mock，不提供買賣建議，也不可作為投資建議。",
      weeklyLine: `市場分布：${breadth.constructive} 個偏正向、${breadth.watch} 個觀察中、${breadth.defensive} 個偏防守；本週先控風險。`
    };
  }

  return {
    headline: "本週可先看 ETF 與市場亮點，再補看風險",
    primary: {
      body: `${topEtf.asset.symbol} 健康度 ${topEtf.healthScore}/100，適合先看趨勢與模組一致性。`,
      href: `/stocks/${topEtf.asset.symbol}`,
      label: "進入 ETF 頁",
      symbol: topEtf.asset.symbol,
      title: etfNeedsCaution ? `${topEtf.asset.symbol} ETF 需留意風險` : `${topEtf.asset.symbol} ETF 亮點`,
      tone: etfNeedsCaution ? "hold" : "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 風險 ${topRisk.riskScore}/100，作為本週第二步檢查。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "補看風險",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險觀察`,
      tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
    },
    stopLine: "週報目前只支援 mock 決策輔助與產品驗證，不可視為真實市場結論。",
    weeklyLine: `市場分布：${breadth.constructive} 個偏正向、${breadth.watch} 個觀察中、${breadth.defensive} 個偏防守；可用 ETF 入口檢查流程。`
  };
}
