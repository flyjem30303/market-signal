import type { SignalSnapshot } from "@/lib/signal-model";

export type BriefingPublicDecisionSummary = {
  alert: {
    cause: string;
    impactLevel: "低" | "中" | "高";
    nextStep: string;
    status: string;
    title: string;
    updatedAt: string;
  };
  boundaryLine: string;
  headline: string;
  marketMood: string;
  nextObservation: string;
  quickRead: string;
};

export function buildBriefingPublicDecisionSummary(
  market: SignalSnapshot,
  topRisk: SignalSnapshot,
  breadth: { constructive: number; defensive: number; watch: number }
): BriefingPublicDecisionSummary {
  const caution = market.riskScore >= 60 || topRisk.riskScore >= 70 || breadth.defensive > breadth.constructive;

  return {
    alert: {
      cause: caution
        ? `${topRisk.asset.symbol} 風險分數較高，且偏防守標的需要優先觀察。`
        : `${market.asset.symbol} 市場狀態偏穩，仍需搭配 ETF 與風險標的交叉確認。`,
      impactLevel: caution ? "中" : "低",
      nextStep: caution
        ? `先複核 ${topRisk.asset.symbol} 的風險成因，再回看大盤與 ETF 是否同步轉弱。`
        : `先觀察 ${market.asset.symbol} 的延續性，再確認 ETF 與主要標的是否同步改善。`,
      status: caution ? "加強觀察" : "持續觀察",
      title: "今日市場提醒",
      updatedAt: market.lastUpdatedAt.replace("T", " ").replace("+08:00", " 台北時間")
    },
    boundaryLine: "目前使用示範資料與示範分數；正式資料尚未啟用，本頁不提供買賣建議。",
    headline: "30 秒看懂今日市場氣氛",
    marketMood: caution ? "偏防守，先放慢判讀速度" : "偏穩定，先觀察延續性",
    nextObservation:
      "3 分鐘行動判斷：先看市場氣氛，再看主要風險，最後確認資料狀態；若訊號互相矛盾，先等待更多資料。",
    quickRead: `市場廣度：${breadth.constructive} 個偏強、${breadth.watch} 個觀察、${breadth.defensive} 個偏防守。`
  };
}
