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
      "目前只整理 investor decision-support product 的 mock roadmap；不提供買賣建議，不宣稱真實市場資料，不啟用 scoreSource=real。"
  },
  families: [
    {
      currentUse: "用 mock 市場廣度、主要風險與狀態摘要協助使用者先理解市場溫度語言。",
      foundationNeeded: ["row coverage", "source depth", "market breadth data", "public claim gate"],
      id: "market-temperature",
      label: "Market temperature",
      productValue: "讓使用者先知道市場是偏順風、觀望，還是防守。",
      status: "mock-readable"
    },
    {
      currentUse: "用健康分數、風險分數與模組拆解展示閱讀框架，不升級成正式投資訊號。",
      foundationNeeded: ["real market data", "model credibility", "score source approval", "backtest evidence"],
      id: "stock-health",
      label: "Stock health",
      productValue: "讓使用者理解單一股票或 ETF 的趨勢、量能、波動與資料信心。",
      status: "mock-readable"
    },
    {
      currentUse: "用 mock riskScore 與最高風險模組提示先看哪個風險來源。",
      foundationNeeded: ["risk model acceptance", "source-specific validation", "stale data policy"],
      id: "risk-signal",
      label: "Risk signal",
      productValue: "把過熱、轉弱、資料缺口與波動放大變成可檢查的警示。",
      status: "mock-readable"
    },
    {
      currentUse: "目前只保留設計方向；尚未宣稱昨天、本週或審核窗變化。",
      foundationNeeded: ["historical rows", "accepted review window", "change calculation contract"],
      id: "change-detection",
      label: "Change detection",
      productValue: "讓使用者知道燈號為什麼改變，而不是只看到靜態分數。",
      status: "design-only"
    },
    {
      currentUse: "用 action summary 指向下一個應觀察的 tab 或頁面，不給交易指令。",
      foundationNeeded: ["public wording gate", "advisor review", "interaction tracking"],
      id: "watch-next-guidance",
      label: "Watch-next guidance",
      productValue: "把資訊轉成下一步觀察順序，降低使用者閱讀成本。",
      status: "mock-readable"
    },
    {
      currentUse: "目前只用 mock 邊界與資料旗標提醒可信度限制。",
      foundationNeeded: ["data quality evidence", "source depth evidence", "row coverage acceptance"],
      id: "confidence-level",
      label: "Confidence level",
      productValue: "讓使用者知道目前讀數可不可信，避免過度解讀漂亮分數。",
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
