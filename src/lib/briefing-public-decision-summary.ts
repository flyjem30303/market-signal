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
  const marketMood = caution ? "偏防守，先放慢判讀速度" : "偏穩定，先建立觀察順序";

  return {
    alert: {
      cause: caution
        ? `${topRisk.asset.symbol} 的風險分數較高，代表目前最需要先理解風險來源與影響範圍。`
        : `${market.asset.symbol} 可作為市場氣氛入口；目前仍要搭配 ETF 與高風險樣本複核。`,
      impactLevel: caution ? "中" : "低",
      nextStep: caution
        ? `先打開 ${topRisk.asset.symbol}，看風險成因、更新時間與資料邊界，再回到 TWII 判斷是否是全市場擴散。`
        : `先看 ${market.asset.symbol} 的市場輪廓，再掃描 ETF 與風險清單，形成今天的觀察順序。`,
      status: caution ? "需要加強觀察" : "可維持觀察",
      title: "今日市場警示",
      updatedAt: market.lastUpdatedAt.replace("T", " ").replace("+08:00", " 台北時間")
    },
    boundaryLine:
      "資料邊界：publicDataSource=mock；scoreSource=mock。正式資料尚未上線，本頁不提供買賣建議。",
    headline: "30 秒看懂市場氣氛",
    marketMood,
    nextObservation:
      "3 分鐘內先看市場氣氛、風險來源、更新時間與資料邊界；若訊號互相矛盾，就先等待，不把單一分數當成交易結論。",
    quickRead: `市場廣度：${breadth.constructive} 個偏建設性、${breadth.watch} 個需要觀察、${breadth.defensive} 個偏防守。`
  };
}
