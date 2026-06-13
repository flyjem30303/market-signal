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
      "投資指標目前只是 mock 路線圖，只能說明產品方向；在合法免費可自動化資料源、覆蓋率、回測與公開宣稱 gate 通過前，不能當成真實市場資料、真實分數、投資建議、排行或績效證據。"
  },
  families: [
    {
      currentUse:
        "mock 市場狀態文案可幫助使用者理解未來流程，但不代表即時廣度或已由來源支持的市場狀態。",
      foundationNeeded: ["row coverage", "source depth", "market breadth data", "public claim gate"],
      id: "market-temperature",
      label: "市場溫度",
      productValue: "未來在真實廣度證據成立後，用來判斷市場背景偏多、觀望、警戒或高風險。",
      status: "mock-readable"
    },
    {
      currentUse:
        "mock 個股健康度只用於閱讀版面與燈號語氣，不能支撐真實個股比較或排行。",
      foundationNeeded: ["real market data", "model credibility", "score source approval", "backtest evidence"],
      id: "stock-health",
      label: "標的健康度",
      productValue: "用來摘要單一標的的趨勢、風險、資料信心與解讀限制。",
      status: "mock-readable"
    },
    {
      currentUse:
        "mock 風險文案可示範警示如何解釋，但風險模型尚未核准用於真實評分。",
      foundationNeeded: ["risk model acceptance", "source-specific validation", "stale data policy"],
      id: "risk-signal",
      label: "風險訊號",
      productValue: "提示趨勢轉弱、波動擴大、資料過舊或來源深度不足等限制。",
      status: "mock-readable"
    },
    {
      currentUse:
        "變化偵測在歷史資料列與比較視窗被接受前，只能保留為設計方向。",
      foundationNeeded: ["historical rows", "accepted review window", "change calculation contract"],
      id: "change-detection",
      label: "變化偵測",
      productValue: "未來用來解釋讀數在接受的時間窗內是改善、轉弱或維持穩定。",
      status: "design-only"
    },
    {
      currentUse:
        "下一步觀察可以描述接下來該看什麼，但必須避開買進、賣出、持有、排行與適合度語氣。",
      foundationNeeded: ["public wording gate", "advisor review", "interaction tracking"],
      id: "watch-next-guidance",
      label: "下一步觀察",
      productValue: "把燈號轉成關注、加強觀察、降低風險或先複核資料的下一步順序。",
      status: "mock-readable"
    },
    {
      currentUse:
        "信心層級在資料品質、來源深度與資料列覆蓋證據被接受前，只能保留為設計方向。",
      foundationNeeded: ["data quality evidence", "source depth evidence", "row coverage acceptance"],
      id: "confidence-level",
      label: "信心層級",
      productValue: "用來說明目前證據是否足以支撐畫面上的解讀。",
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
