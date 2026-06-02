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

  if (hasDataWarnings) {
    return {
      headline: "今天先確認資料旗標，再進入個股判讀",
      marketBreadthLine: `強勢 ${breadth.constructive}、觀察 ${breadth.watch}、防守 ${breadth.defensive}，目前仍是 mock runtime。`,
      primaryAction: {
        body: `${selectedSnapshot.asset.symbol} 還有資料缺口，先看今日摘要與 mock 邊界。`,
        href: `/stocks/${selectedSnapshot.asset.symbol}`,
        label: `${selectedSnapshot.asset.symbol} 今日摘要`,
        title: "先補閱讀前提",
        tone: "blocked"
      },
      secondaryAction: {
        body: `${marketSnapshot.asset.symbol} 可作為市場基準，確認大盤風險是否同步升溫。`,
        href: `/stocks/${marketSnapshot.asset.symbol}`,
        label: `${marketSnapshot.asset.symbol} 市場基準`,
        title: "再看市場脈絡",
        tone: "hold"
      },
      stopLine: "資料旗標未清前，不把 mock 分數升級為買賣建議。"
    };
  }

  if (selectedSnapshot.riskScore >= 60 || riskiest.riskScore >= 70) {
    return {
      headline: "今天先拆風險來源，再看強勢延伸",
      marketBreadthLine: `強勢 ${breadth.constructive}、觀察 ${breadth.watch}、防守 ${breadth.defensive}；風險最高為 ${riskiest.asset.symbol}。`,
      primaryAction: {
        body: `${riskiest.asset.symbol} 風險 ${riskiest.riskScore}/100，先看技術與波動是否連續升溫。`,
        href: `/stocks/${riskiest.asset.symbol}`,
        label: `${riskiest.asset.symbol} 風險拆解`,
        title: "先看風險",
        tone: "blocked"
      },
      secondaryAction: {
        body: `${marketSnapshot.asset.symbol} 是今天的市場溫度計，協助確認風險是單檔還是全市場。`,
        href: `/stocks/${marketSnapshot.asset.symbol}`,
        label: `${marketSnapshot.asset.symbol} 大盤溫度`,
        title: "對照大盤",
        tone: "hold"
      },
      stopLine: "風險拆解完成前，只做觀察排序，不產生交易結論。"
    };
  }

  return {
    headline: "今天先看強勢延伸，再回頭確認風險",
    marketBreadthLine: `強勢 ${breadth.constructive}、觀察 ${breadth.watch}、防守 ${breadth.defensive}；mock 廣度目前可支援閱讀排序。`,
    primaryAction: {
      body: `${strongest.asset.symbol} 綜合 ${strongest.compositeScore}/100，先看趨勢是否連續。`,
      href: `/stocks/${strongest.asset.symbol}`,
      label: `${strongest.asset.symbol} 強勢觀察`,
      title: "先看強勢",
      tone: "active"
    },
    secondaryAction: {
      body: `${riskiest.asset.symbol} 風險 ${riskiest.riskScore}/100，作為追價前的反向檢查。`,
      href: `/stocks/${riskiest.asset.symbol}`,
      label: `${riskiest.asset.symbol} 風險對照`,
      title: "再看風險",
      tone: "hold"
    },
    stopLine: "publicDataSource=mock、scoreSource=mock；首頁只協助閱讀排序，不提供買賣建議。"
  };
}
