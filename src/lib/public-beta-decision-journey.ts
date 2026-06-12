export type PublicBetaDecisionJourneyContext = "home" | "briefing" | "stock";

export type PublicBetaDecisionJourneyStep = {
  href: string;
  label: string;
  purpose: string;
  title: string;
};

export type PublicBetaDecisionJourney = {
  boundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
    text: string;
  };
  headline: string;
  nextAction: string;
  steps: PublicBetaDecisionJourneyStep[];
  summary: string;
};

export function getPublicBetaDecisionJourney(
  context: PublicBetaDecisionJourneyContext,
  stockSymbol = "2330"
): PublicBetaDecisionJourney {
  const stockHref = `/stocks/${stockSymbol}`;
  const contextSummary = {
    home: "\u4f60\u73fe\u5728\u5728\u9996\u9801\uff1a\u5148\u7528 30 \u79d2\u770b\u5e02\u5834\u6c1b\u570d\uff0c\u518d\u9032\u5165 briefing \u627e\u539f\u56e0\u8207\u884c\u52d5\u5224\u65b7\u3002",
    briefing: "\u4f60\u73fe\u5728\u5728 briefing\uff1a\u5148\u628a\u5168\u5e02\u5834\u539f\u56e0\u6536\u6582\uff0c\u518d\u5230\u6a19\u7684\u9801\u78ba\u8a8d\u6210\u56e0\u8207\u6307\u6a19\u9806\u5e8f\u3002",
    stock: "\u4f60\u73fe\u5728\u5728\u6a19\u7684\u9801\uff1a\u5148\u770b\u6210\u56e0\u3001\u66f4\u65b0\u6642\u9593\u8207\u5f71\u97ff\u7d1a\u5225\uff0c\u518d\u7528\u6307\u6a19\u512a\u5148\u9806\u5e8f\u6c7a\u5b9a\u8981\u4e0d\u8981\u52a0\u5f37\u89c0\u5bdf\u3002"
  } satisfies Record<PublicBetaDecisionJourneyContext, string>;

  return {
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock",
      text: "\u9019\u689d\u8def\u5f91\u53ea\u662f\u516c\u958b Beta \u95b1\u8b80\u9589\u74b0\uff1a\u4e0d\u5ba3\u7a31\u5373\u6642\u771f\u5be6\u8cc7\u6599\uff0c\u4e0d\u63d0\u4f9b\u8cb7\u8ce3\u5efa\u8b70\uff0c\u4e0d\u628a mock \u5206\u6578\u7576\u6210\u6295\u8cc7\u7d50\u8ad6\u3002"
    },
    headline: "\u5f9e 30 \u79d2\u6c1b\u570d\u5230 3 \u5206\u9418\u884c\u52d5\u5224\u65b7",
    nextAction:
      "\u95b1\u8b80\u9806\u5e8f\u662f\u56fa\u5b9a\u7684\uff1a\u9996\u9801\u5148\u770b\u5e02\u5834\u6c23\u6c1b\uff0cbriefing \u770b\u539f\u56e0\u8207\u6e05\u55ae\uff0c\u6a19\u7684\u9801\u770b\u6210\u56e0\u8207\u6307\u6a19\u512a\u5148\u9806\u5e8f\u3002",
    steps: [
      {
        href: "/",
        label: "1",
        purpose: "\u7528\u7d05\u9ec3\u7da0\u72c0\u614b\u3001\u6838\u5fc3\u6307\u6a19\u8207\u8b66\u793a\u6e05\u55ae\uff0c\u5148\u5224\u65b7\u4eca\u5929\u662f\u5426\u9700\u8981\u591a\u770b\u5e02\u5834\u3002",
        title: "30 \u79d2\u5e02\u5834\u6c1b\u570d"
      },
      {
        href: "/briefing",
        label: "2",
        purpose: "\u628a\u5e02\u5834\u72c0\u614b\u8f49\u6210\u539f\u56e0\u3001\u89c0\u5bdf\u6e05\u55ae\u8207\u4e0b\u4e00\u6b65\u884c\u52d5\u5224\u65b7\u3002",
        title: "3 \u5206\u9418\u884c\u52d5\u5224\u65b7"
      },
      {
        href: stockHref,
        label: "3",
        purpose: "\u56de\u5230\u55ae\u4e00\u6a19\u7684\uff0c\u78ba\u8a8d\u71c8\u865f\u6210\u56e0\u3001\u66f4\u65b0\u6642\u9593\u3001\u5f71\u97ff\u7d1a\u5225\u8207\u6307\u6a19\u512a\u5148\u9806\u5e8f\u3002",
        title: `${stockSymbol} \u6210\u56e0\u8207\u6307\u6a19\u512a\u5148\u9806\u5e8f`
      }
    ],
    summary: contextSummary[context]
  };
}
