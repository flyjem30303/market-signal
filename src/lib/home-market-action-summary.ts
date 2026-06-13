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

const t = {
  breadth: "\u5e02\u5834\u5ee3\u5ea6",
  checkData: "\u8cc7\u6599\u72c0\u614b\u9700\u8981\u5148\u78ba\u8a8d\uff0c\u5148\u628a\u793a\u7bc4\u8a0a\u865f\u7576\u89c0\u5bdf\u7dda\u7d22",
  dataBody: "\u9019\u500b\u6a19\u7684\u76ee\u524d\u6709\u8cc7\u6599\u7f3a\u53e3\u6216\u66f4\u65b0\u8b66\u793a\uff0c\u5148\u770b\u539f\u56e0\u8207\u5f71\u97ff\u7d1a\u5225\uff0c\u4e0d\u628a\u5206\u6578\u7576\u4f5c\u771f\u5be6\u4ea4\u6613\u7d50\u8ad6\u3002",
  dataLabel: "\u67e5\u770b\u8cc7\u6599\u72c0\u614b",
  dataTitle: "\u5148\u78ba\u8a8d\u8cc7\u6599\u4fe1\u4efb",
  defensiveHeadline: "\u5e02\u5834\u98a8\u96aa\u6b63\u5728\u5347\u6eab\uff0c\u5148\u52a0\u5f37\u89c0\u5bdf\u800c\u4e0d\u8ffd\u50f9",
  healthyHeadline: "\u5e02\u5834\u6c23\u6c1b\u504f\u7a69\uff0c\u4f46\u4ecd\u4ee5 mock \u8a0a\u865f\u7576\u89c0\u5bdf\u8d77\u9ede",
  marketReview: "\u5e02\u5834\u56de\u770b",
  primaryRisk: "\u98a8\u96aa\u89c0\u5bdf",
  riskBody: "\u98a8\u96aa\u5206\u6578\u504f\u9ad8\uff0c\u9069\u5408\u5148\u56de\u770b\u6210\u56e0\u3001\u66f4\u65b0\u6642\u9593\u8207\u4e3b\u8981\u5f71\u97ff\u7d1a\u5225\uff0c\u518d\u6c7a\u5b9a\u662f\u5426\u52a0\u5f37\u89c0\u5bdf\u3002",
  stableBody: "\u5206\u6578\u76ee\u524d\u504f\u5f37\uff0c\u53ef\u4ee5\u7528\u4f86\u627e\u89c0\u5bdf\u6e05\u55ae\uff0c\u4f46\u4ecd\u9700\u56de\u5230\u6210\u56e0\u8207\u8cc7\u6599\u4fe1\u4efb\u5c64\u505a\u4e8c\u6b21\u78ba\u8a8d\u3002",
  stableTitle: "\u512a\u5148\u89c0\u5bdf\u5f37\u52e2\u8b8a\u5316",
  stopLine:
    "\u516c\u958b Beta \u4ecd\u70ba\u95b1\u8b80\u8207\u89c0\u5bdf\u7528\u9014\uff1a\u76ee\u524d\u4f7f\u7528\u793a\u7bc4\u8cc7\u6599\u8207\u793a\u7bc4\u5206\u6578\uff0c\u4e0d\u63d0\u4f9b\u500b\u80a1\u8cb7\u8ce3\u5efa\u8b70\u6216\u5831\u916c\u627f\u8afe\u3002",
  watchMarket: "\u5148\u770b\u5927\u76e4\u8108\u7d61"
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
  const breadthLine = `${t.breadth}\uff1a${breadth.constructive} \u500b\u504f\u5efa\u8a2d\u6027\u3001${breadth.watch} \u500b\u9700\u8981\u89c0\u5bdf\u3001${breadth.defensive} \u500b\u504f\u9632\u5b88\u3002`;

  if (hasDataWarnings) {
    return {
      headline: t.checkData,
      marketBreadthLine: `${breadthLine} \u76ee\u524d\u9801\u9762\u4ecd\u4ee5\u793a\u7bc4\u8cc7\u6599\u5448\u73fe\u3002`,
      primaryAction: {
        body: `${selectedSnapshot.asset.symbol} ${t.dataBody}`,
        href: `/stocks/${selectedSnapshot.asset.symbol}`,
        label: `${selectedSnapshot.asset.symbol} ${t.dataLabel}`,
        title: t.dataTitle,
        tone: "blocked"
      },
      secondaryAction: {
        body: `${marketSnapshot.asset.symbol} \u53ef\u4f5c\u70ba\u5e02\u5834\u6c23\u6c1b\u53c3\u8003\uff0c\u5148\u770b\u5927\u76e4\u8108\u7d61\u518d\u56de\u5230\u500b\u5225\u6a19\u7684\u3002`,
        href: `/stocks/${marketSnapshot.asset.symbol}`,
        label: `${marketSnapshot.asset.symbol} ${t.marketReview}`,
        title: t.watchMarket,
        tone: "hold"
      },
      stopLine: t.stopLine
    };
  }

  if (selectedSnapshot.riskScore >= 60 || riskiest.riskScore >= 70) {
    return {
      headline: t.defensiveHeadline,
      marketBreadthLine: `${breadthLine} \u76ee\u524d\u6700\u9700\u8981\u6ce8\u610f\u7684\u98a8\u96aa\u6a19\u7684\u662f ${riskiest.asset.symbol}\u3002`,
      primaryAction: {
        body: `${riskiest.asset.symbol} \u98a8\u96aa\u5206\u6578 ${riskiest.riskScore}/100\uff0c${t.riskBody}`,
        href: `/stocks/${riskiest.asset.symbol}`,
        label: `${riskiest.asset.symbol} ${t.primaryRisk}`,
        title: "\u5148\u770b\u98a8\u96aa\u6210\u56e0",
        tone: "blocked"
      },
      secondaryAction: {
        body: `${marketSnapshot.asset.symbol} \u53ef\u5e6b\u52a9\u5224\u65b7\u98a8\u96aa\u662f\u5168\u5e02\u5834\u64f4\u6563\uff0c\u9084\u662f\u96c6\u4e2d\u5728\u5c11\u6578\u6a19\u7684\u3002`,
        href: `/stocks/${marketSnapshot.asset.symbol}`,
        label: `${marketSnapshot.asset.symbol} ${t.marketReview}`,
        title: "\u56de\u5230\u5927\u76e4\u8f2a\u5ed3",
        tone: "hold"
      },
      stopLine: t.stopLine
    };
  }

  return {
    headline: t.healthyHeadline,
    marketBreadthLine: `${breadthLine} \u5efa\u8b70\u5148\u770b\u5f37\u52e2\u8b8a\u5316\uff0c\u518d\u6aa2\u67e5\u4e3b\u8981\u98a8\u96aa\u3002`,
    primaryAction: {
      body: `${strongest.asset.symbol} \u7d9c\u5408\u5206\u6578 ${strongest.compositeScore}/100\uff0c${t.stableBody}`,
      href: `/stocks/${strongest.asset.symbol}`,
      label: `${strongest.asset.symbol} \u89c0\u5bdf\u5f37\u52e2`,
      title: t.stableTitle,
      tone: "active"
    },
    secondaryAction: {
      body: `${riskiest.asset.symbol} \u98a8\u96aa\u5206\u6578 ${riskiest.riskScore}/100\uff0c\u5373\u4f7f\u5e02\u5834\u504f\u7a69\uff0c\u4ecd\u8981\u7559\u610f\u98a8\u96aa\u9ede\u662f\u5426\u64f4\u5927\u3002`,
      href: `/stocks/${riskiest.asset.symbol}`,
      label: `${riskiest.asset.symbol} ${t.primaryRisk}`,
      title: "\u540c\u6b65\u6383\u63cf\u98a8\u96aa",
      tone: "hold"
    },
    stopLine: t.stopLine
  };
}
