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
      headline: "先確認資料完整性，再閱讀燈號方向",
      marketBreadthLine: `市場分布：${breadth.constructive} 個偏正向、${breadth.watch} 個觀察中、${breadth.defensive} 個偏防守；目前仍是 mock runtime。`,
      primaryAction: {
        body: `${selectedSnapshot.asset.symbol} 有資料缺口或過期模組，先看股票頁的資料缺口與停用條件。`,
        href: `/stocks/${selectedSnapshot.asset.symbol}`,
        label: `${selectedSnapshot.asset.symbol} 檢查資料缺口`,
        title: "資料品質優先",
        tone: "blocked"
      },
      secondaryAction: {
        body: `${marketSnapshot.asset.symbol} 可作為大盤閱讀入口，確認市場風險是否放大個股判讀誤差。`,
        href: `/stocks/${marketSnapshot.asset.symbol}`,
        label: `${marketSnapshot.asset.symbol} 看大盤脈絡`,
        title: "回到市場基準",
        tone: "hold"
      },
      stopLine: "資料缺口未消除前，不可把 mock 分數解讀為真實投資建議；publicDataSource=mock，scoreSource=mock。"
    };
  }

  if (selectedSnapshot.riskScore >= 60 || riskiest.riskScore >= 70) {
    return {
      headline: "市場仍可閱讀，但風險模組要先看",
      marketBreadthLine: `市場分布：${breadth.constructive} 個偏正向、${breadth.watch} 個觀察中、${breadth.defensive} 個偏防守；最高風險是 ${riskiest.asset.symbol}。`,
      primaryAction: {
        body: `${riskiest.asset.symbol} 風險 ${riskiest.riskScore}/100，先進股票頁看風險來源與停止閱讀條件。`,
        href: `/stocks/${riskiest.asset.symbol}`,
        label: `${riskiest.asset.symbol} 檢查風險`,
        title: "優先處理風險",
        tone: "blocked"
      },
      secondaryAction: {
        body: `${marketSnapshot.asset.symbol} 可協助判斷大盤壓力是否正在影響個股與 ETF 訊號。`,
        href: `/stocks/${marketSnapshot.asset.symbol}`,
        label: `${marketSnapshot.asset.symbol} 看市場基準`,
        title: "確認大盤脈絡",
        tone: "hold"
      },
      stopLine: "風險卡只提供 mock-only 決策輔助，不代表買賣建議或真實風控結論。"
    };
  }

  return {
    headline: "市場偏可閱讀，先看強勢標的再回看風險",
    marketBreadthLine: `市場分布：${breadth.constructive} 個偏正向、${breadth.watch} 個觀察中、${breadth.defensive} 個偏防守；mock 訊號可用於產品流程驗證。`,
    primaryAction: {
      body: `${strongest.asset.symbol} 綜合分數 ${strongest.compositeScore}/100，適合先看趨勢、模組健康與資料邊界。`,
      href: `/stocks/${strongest.asset.symbol}`,
      label: `${strongest.asset.symbol} 看強勢標的`,
      title: "先讀市場亮點",
      tone: "active"
    },
    secondaryAction: {
      body: `${riskiest.asset.symbol} 風險 ${riskiest.riskScore}/100，作為第二步檢查，避免只看分數忽略風險。`,
      href: `/stocks/${riskiest.asset.symbol}`,
      label: `${riskiest.asset.symbol} 檢查風險`,
      title: "補看風險",
      tone: "hold"
    },
    stopLine: "publicDataSource=mock；scoreSource=mock；目前只能輔助閱讀流程，不能作為真實投資決策。"
  };
}
