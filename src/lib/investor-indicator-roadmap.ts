export type InvestorIndicatorFamilyId =
  | "market-temperature"
  | "stock-health"
  | "risk-signal"
  | "change-detection"
  | "watch-next-guidance"
  | "confidence-level";

export type InvestorIndicatorStatus = "mock-readable" | "design-only" | "blocked-until-real-data";

export type InvestorIndicatorFamily = {
  currentUse: string;
  foundationNeeded: string[];
  id: InvestorIndicatorFamilyId;
  label: string;
  productValue: string;
  status: InvestorIndicatorStatus;
};

export type InvestorIndicatorRoadmap = {
  boundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
    statement: string;
  };
  families: InvestorIndicatorFamily[];
  nextExecutionRatio: {
    futureIndicatorDesignNotes: 10;
    productReadabilityAndWording: 20;
    runtimeDataFoundation: 70;
  };
};

export const investorIndicatorRoadmap: InvestorIndicatorRoadmap = {
  boundary: {
    publicDataSource: "mock",
    scoreSource: "mock",
    statement:
      "Investor indicators are a mock roadmap only. They can explain product direction, but they cannot be treated as real market data, real scoring, advice, ranking, or performance evidence until later gates pass."
  },
  families: [
    {
      currentUse:
        "Readable mock market condition copy can help users understand the intended flow, but it does not represent live breadth or source-backed market state.",
      foundationNeeded: ["row coverage", "source depth", "market breadth data", "public claim gate"],
      id: "market-temperature",
      label: "Market temperature",
      productValue: "Shows whether the market backdrop feels constructive, cautious, or weak once real breadth evidence exists.",
      status: "mock-readable"
    },
    {
      currentUse:
        "Mock stock health is useful for reading layout and signal language only; it cannot support real stock comparison or ranking.",
      foundationNeeded: ["real market data", "model credibility", "score source approval", "backtest evidence"],
      id: "stock-health",
      label: "Stock health",
      productValue: "Summarizes trend, risk, data confidence, and interpretation limits for a single stock.",
      status: "mock-readable"
    },
    {
      currentUse:
        "Mock risk wording can show how warnings will be explained, but the risk model remains unapproved for real scoring.",
      foundationNeeded: ["risk model acceptance", "source-specific validation", "stale data policy"],
      id: "risk-signal",
      label: "Risk signal",
      productValue: "Highlights weakening trend, volatility expansion, stale data, or source-depth limits.",
      status: "mock-readable"
    },
    {
      currentUse:
        "Change detection is design-only until historical rows and accepted comparison windows are available.",
      foundationNeeded: ["historical rows", "accepted review window", "change calculation contract"],
      id: "change-detection",
      label: "Change detection",
      productValue: "Explains whether a reading improved, weakened, or stayed stable over an accepted window.",
      status: "design-only"
    },
    {
      currentUse:
        "Watch-next guidance can describe what to observe next, but must avoid buy, sell, hold, ranking, and suitability language.",
      foundationNeeded: ["public wording gate", "advisor review", "interaction tracking"],
      id: "watch-next-guidance",
      label: "Watch-next guidance",
      productValue: "Turns a signal into non-advisory observation prompts for the next review.",
      status: "mock-readable"
    },
    {
      currentUse:
        "Confidence level is design-only until data quality, source depth, and row coverage evidence are accepted.",
      foundationNeeded: ["data quality evidence", "source depth evidence", "row coverage acceptance"],
      id: "confidence-level",
      label: "Confidence level",
      productValue: "Shows whether the available evidence is strong enough to trust the displayed interpretation.",
      status: "design-only"
    }
  ],
  nextExecutionRatio: {
    futureIndicatorDesignNotes: 10,
    productReadabilityAndWording: 20,
    runtimeDataFoundation: 70
  }
};

export function getInvestorIndicatorRoadmap(): InvestorIndicatorRoadmap {
  return investorIndicatorRoadmap;
}
