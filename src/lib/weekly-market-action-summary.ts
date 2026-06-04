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
  const weeklyLine = `本週市場分布：${breadth.constructive} 個偏正向、${breadth.watch} 個觀察中、${breadth.defensive} 個偏防守。`;

  if (defensiveWeek) {
    return {
      headline: "本週先採防守觀察，確認風險是否擴散",
      primary: {
        body: `${market.asset.symbol} 顯示市場風險偏高，先看大盤、ETF 與高風險標的是否同步轉弱。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "查看大盤週狀態",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場風險`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100，本週應列為主要風險觀察對象。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "查看最高風險",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險追蹤`,
        tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
      },
      stopLine:
        "週報仍是 mock runtime 摘要；資料來源維持 publicDataSource=mock，分數來源維持 scoreSource=mock，不提供買賣建議，也不可作為投資建議。",
      weeklyLine: `${weeklyLine} 本週先確認防守壓力是否延續。`
    };
  }

  return {
    headline: "本週市場暫時偏穩，ETF 與高風險標的同步觀察",
    primary: {
      body: `${topEtf.asset.symbol} 健康度 ${topEtf.healthScore}/100，可先看 ETF 是否維持相對穩定。`,
      href: `/stocks/${topEtf.asset.symbol}`,
      label: "查看 ETF 狀態",
      symbol: topEtf.asset.symbol,
      title: etfNeedsCaution ? `${topEtf.asset.symbol} ETF 仍需留意風險` : `${topEtf.asset.symbol} ETF 相對穩定`,
      tone: etfNeedsCaution ? "hold" : "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100，仍要列入本週風險追蹤。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "同步查看風險",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險追蹤`,
      tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
    },
    stopLine: "週報目前仍使用 mock runtime；資料來源維持 publicDataSource=mock，分數來源維持 scoreSource=mock，不能推論正式市場訊號。",
    weeklyLine: `${weeklyLine} 目前可先比較 ETF 穩定度與高風險標的。`
  };
}
