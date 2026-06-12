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
  const marketMood = caution ? "偏保守觀察" : "偏穩定觀察";

  return {
    alert: {
      cause: caution
        ? `${topRisk.asset.symbol} 的風險分數較高，市場解讀先放慢，避免只看單一數字。`
        : `${market.asset.symbol} 的綜合狀態暫時偏穩，仍需搭配資料邊界與 mock 流程判讀。`,
      impactLevel: caution ? "中" : "低",
      nextStep: caution
        ? `先看 ${topRisk.asset.symbol} 的成因，再回到 TWII 與市場廣度交叉確認。`
        : `先看 ${market.asset.symbol} 的趨勢，再觀察 ETF 與產業族群是否同步。`,
      status: caution ? "需要加強觀察" : "可持續觀察",
      title: "主要市場警示",
      updatedAt: market.lastUpdatedAt.replace("T", " ").replace("+08:00", " 台北時間")
    },
    boundaryLine:
      "資料邊界：publicDataSource=mock，scoreSource=mock；目前不是即時真實資料，不提供買賣建議。",
    headline: "30 秒看懂今日市場氣氛",
    marketMood,
    nextObservation: "3 分鐘內請看：成因、更新時間、影響級別、下一步觀察。所有訊號都要搭配資料來源與時間脈絡。",
    quickRead: `市場廣度：${breadth.constructive} 個偏建設、${breadth.watch} 個觀察、${breadth.defensive} 個偏防守。`
  };
}
