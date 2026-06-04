import type { SignalSnapshot } from "@/lib/signal-model";

export type HomeMarketActionCard = {
  body: string;
  href: string;
  label: string;
  title: string;
  tone: "active" | "hold" | "blocked";
};

export type HomeMarketActionSummary = {
  headline: string;
  marketBreadthLine: string;
  primaryAction: HomeMarketActionCard;
  secondaryAction: HomeMarketActionCard;
  stopLine: string;
};

export function buildHomeMarketActionSummary(
  selectedSnapshot: SignalSnapshot,
  snapshots: SignalSnapshot[]
): HomeMarketActionSummary {
  const marketSnapshot = snapshots.find((item) => item.asset.symbol === "TWII") ?? selectedSnapshot;
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore)[0] ?? selectedSnapshot;
  const riskiest = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore)[0] ?? selectedSnapshot;
  const breadth = snapshots.reduce(
    (summary, item) => {
      if (item.signal.key === "green" || item.signal.key === "yellow") summary.constructive += 1;
      else if (item.signal.key === "orange") summary.watch += 1;
      else summary.defensive += 1;

      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
  const hasDataWarnings =
    selectedSnapshot.missingModuleFlags.length > 0 || selectedSnapshot.staleDataFlags.length > 0;
  const breadthLine = `市場分布：${breadth.constructive} 個偏正向、${breadth.watch} 個觀察中、${breadth.defensive} 個偏防守。`;

  if (hasDataWarnings) {
    return {
      headline: "資料仍是 mock 狀態，先看風險邊界再看分數",
      marketBreadthLine: `${breadthLine} 目前公開 runtime 仍維持 mock-only。`,
      primaryAction: {
        body: `${selectedSnapshot.asset.symbol} 有資料缺口或 stale flags，先查看資料品質與 mock 邊界，再解讀任何分數。`,
        href: `/stocks/${selectedSnapshot.asset.symbol}`,
        label: `${selectedSnapshot.asset.symbol} 查看資料品質`,
        title: "資料品質優先",
        tone: "blocked"
      },
      secondaryAction: {
        body: `${marketSnapshot.asset.symbol} 可作為大盤狀態參考，但目前仍不能把 mock 分數視為正式市場訊號。`,
        href: `/stocks/${marketSnapshot.asset.symbol}`,
        label: `${marketSnapshot.asset.symbol} 查看大盤狀態`,
        title: "大盤背景",
        tone: "hold"
      },
      stopLine: "資料品質不足時只做觀察與產品驗證；publicDataSource=mock，scoreSource=mock，不提供買賣建議。"
    };
  }

  if (selectedSnapshot.riskScore >= 60 || riskiest.riskScore >= 70) {
    return {
      headline: "市場風險升溫，先控管回撤再找機會",
      marketBreadthLine: `${breadthLine} 目前最高風險標的是 ${riskiest.asset.symbol}。`,
      primaryAction: {
        body: `${riskiest.asset.symbol} 風險分數 ${riskiest.riskScore}/100，建議先查看風險來源與可能的回撤壓力。`,
        href: `/stocks/${riskiest.asset.symbol}`,
        label: `${riskiest.asset.symbol} 查看風險`,
        title: "優先檢查風險",
        tone: "blocked"
      },
      secondaryAction: {
        body: `${marketSnapshot.asset.symbol} 可用來判斷整體盤勢是否轉弱，ETF 與權值股仍需分開檢查。`,
        href: `/stocks/${marketSnapshot.asset.symbol}`,
        label: `${marketSnapshot.asset.symbol} 查看盤勢`,
        title: "市場背景",
        tone: "hold"
      },
      stopLine: "風險摘要仍是 mock runtime 輔助資訊；publicDataSource=mock，scoreSource=mock，不構成投資建議。"
    };
  }

  return {
    headline: "市場偏穩，但仍以 mock 分數做觀察",
    marketBreadthLine: `${breadthLine} 目前可以先看強勢標的與高風險標的的差距。`,
    primaryAction: {
      body: `${strongest.asset.symbol} 綜合分數 ${strongest.compositeScore}/100，可先查看趨勢、基本面與風險模組是否一致。`,
      href: `/stocks/${strongest.asset.symbol}`,
      label: `${strongest.asset.symbol} 查看強勢標的`,
      title: "相對強勢",
      tone: "active"
    },
    secondaryAction: {
      body: `${riskiest.asset.symbol} 風險分數 ${riskiest.riskScore}/100，仍需要追蹤是否出現風險升溫。`,
      href: `/stocks/${riskiest.asset.symbol}`,
      label: `${riskiest.asset.symbol} 查看風險`,
      title: "同步檢查風險",
      tone: "hold"
    },
    stopLine: "publicDataSource=mock，scoreSource=mock；目前只支援觀察與產品驗證，不提供正式資料或買賣建議。"
  };
}
