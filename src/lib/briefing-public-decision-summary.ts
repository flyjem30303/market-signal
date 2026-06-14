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
  // Runtime boundary: publicDataSource=mock, scoreSource=mock.
  const caution = market.riskScore >= 60 || topRisk.riskScore >= 70 || breadth.defensive > breadth.constructive;
  const updatedAt = market.lastUpdatedAt.replace("T", " ").replace("+08:00", " 台北時間");

  return {
    alert: {
      cause: caution
        ? `${topRisk.asset.symbol} 的風險分數偏高，代表今天要先確認風險是否集中在少數標的，或已經擴散到市場廣度。`
        : `${market.asset.symbol} 仍是今日主要觀察背景；目前更適合先看市場氣氛，再掃描是否有局部風險升溫。`,
      impactLevel: caution ? "中" : "低",
      nextStep: caution
        ? `先看 ${topRisk.asset.symbol} 的成因與更新時間，再決定是否加強觀察或降低風險暴露。`
        : `先看 ${market.asset.symbol} 的主燈號，再用 ETF 與高風險標的確認市場是否仍穩定。`,
      status: caution ? "需要加強觀察" : "維持觀察",
      title: "今日市場提醒",
      updatedAt
    },
    boundaryLine: "目前使用示範資料與示範分數；正式資料尚未啟用，不提供買賣建議。",
    headline: "30 秒看懂今日市場氣氛",
    marketMood: caution ? "市場進入觀望，先確認風險來源" : "市場氣氛尚可，先維持觀察節奏",
    nextObservation:
      "3 分鐘內先看市場氣氛、風險最高標的與資料狀態，再決定今天是關注、加強觀察，還是降低風險。",
    quickRead: `市場廣度：${breadth.constructive} 個偏建設性、${breadth.watch} 個需要觀察、${breadth.defensive} 個偏防守。`
  };
}
