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
  const weeklyLine = `本週樣本中，偏多觀察 ${breadth.constructive} 檔，觀望 ${breadth.watch} 檔，防守或高風險 ${breadth.defensive} 檔。`;

  if (defensiveWeek) {
    return {
      headline: "本週先降低風險假設，回看市場主燈號與最高風險標的",
      primary: {
        body: `${market.asset.symbol} 目前主燈號為「${market.signal.title}」。先確認市場整體是否仍需要防守，再看個別標的。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "先看市場",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場總覽`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100。若週報顯示風險偏高，隔週應先複核資料更新與成因。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "複核風險",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險觀察`,
        tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
      },
      stopLine: "週報是回看與觀察工具，不是買賣指令；若資料尚未正式啟用，請以示範資料流程閱讀。",
      weeklyLine: `${weeklyLine} 防守比重偏高時，先找出造成警戒的指標，再決定是否需要加強觀察。`
    };
  }

  return {
    headline: "本週市場仍可觀察，但需要確認 ETF 與高風險標的是否分歧",
    primary: {
      body: `${topEtf.asset.symbol} 健康分數 ${topEtf.healthScore}/100。可作為本週 ETF 觀察入口，但仍需搭配風險分數。`,
      href: `/stocks/${topEtf.asset.symbol}`,
      label: "看 ETF",
      symbol: topEtf.asset.symbol,
      title: etfNeedsCaution ? `${topEtf.asset.symbol} ETF 仍需留意風險` : `${topEtf.asset.symbol} ETF 觀察`,
      tone: etfNeedsCaution ? "hold" : "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 風險分數 ${topRisk.riskScore}/100。即使市場偏多，也要確認是否有單一標的或族群拖累。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "看風險",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險觀察`,
      tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
    },
    stopLine: "週報是回看與觀察工具，不是買賣指令；若資料尚未正式啟用，請以示範資料流程閱讀。",
    weeklyLine: `${weeklyLine} 若偏多數量增加，仍要回看資料更新時間與風險最高標的。`
  };
}
