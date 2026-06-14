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
  const weeklyLine = `本週示範資料顯示，偏多 ${breadth.constructive} 檔、觀望 ${breadth.watch} 檔、警戒 ${breadth.defensive} 檔。`;

  if (defensiveWeek) {
    return {
      headline: "本週優先降低誤判風險，先確認大盤與高風險標的",
      primary: {
        body: `${market.asset.symbol} 目前為「${market.signal.title}」，建議先確認市場總覽、資料更新時間與主要風險提示。`,
        href: `/stocks/${market.asset.symbol}`,
        label: "市場總覽",
        symbol: market.asset.symbol,
        title: `${market.asset.symbol} 市場狀態`,
        tone: "hold"
      },
      secondary: {
        body: `${topRisk.asset.symbol} 風險分數為 ${topRisk.riskScore}/100，是本週需要優先複核的示範標的。`,
        href: `/stocks/${topRisk.asset.symbol}`,
        label: "風險複核",
        symbol: topRisk.asset.symbol,
        title: `${topRisk.asset.symbol} 風險觀察`,
        tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
      },
      stopLine: "週報僅整理市場觀察順序，不構成投資建議；真實資料接入前仍以示範資料呈現。",
      weeklyLine: `${weeklyLine} 目前應以風險辨識與資料更新狀態為優先。`
    };
  }

  return {
    headline: "本週市場偏向可觀察狀態，但仍要同步看風險與資料時間",
    primary: {
      body: `${topEtf.asset.symbol} 健康分數為 ${topEtf.healthScore}/100，可作為 ETF 觀察代表，但仍需搭配大盤燈號與風險分數。`,
      href: `/stocks/${topEtf.asset.symbol}`,
      label: "ETF 觀察",
      symbol: topEtf.asset.symbol,
      title: etfNeedsCaution ? `${topEtf.asset.symbol} ETF 需保守觀察` : `${topEtf.asset.symbol} ETF 觀察重點`,
      tone: etfNeedsCaution ? "hold" : "active"
    },
    secondary: {
      body: `${topRisk.asset.symbol} 風險分數為 ${topRisk.riskScore}/100，適合放入本週複核清單。`,
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "風險清單",
      symbol: topRisk.asset.symbol,
      title: `${topRisk.asset.symbol} 風險觀察`,
      tone: topRisk.riskScore >= 70 ? "blocked" : "hold"
    },
    stopLine: "週報僅提供市場資訊整理與觀察輔助，不提供買賣建議或報酬承諾。",
    weeklyLine: `${weeklyLine} 建議從大盤燈號、ETF 代表標的與高風險清單三個方向閱讀。`
  };
}
