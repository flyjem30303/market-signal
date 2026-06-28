import type { GlobalIndexSeriesPoint, GlobalIndexSnapshot } from "./global-index-provider";

const mockBoundary =
  "Mock-only global product preview. Values are synthetic and not live, official, vendor-backed, or investment-grade market data.";

const mockSource = {
  source: "Mock global provider",
  sourceUrl: "/methodology",
  attribution: "Synthetic mock data for Phase 2A product development.",
  isMock: true,
  globalActiveProvider: "mock",
  globalPublicDataSource: "mock",
  mockBoundary
} as const;

export const mockGlobalIndexSnapshots = [
  {
    symbol: "SP500",
    displayName: "S&P 500",
    market: "US",
    country: "US",
    regionLabel: "S&P 500",
    tradeDate: "2026-06-19",
    close: 5000,
    change: 10,
    changePercent: 0.2,
    signalState: "偏強",
    compositeScore: 68,
    riskScore: 32,
    scoreSource: "Synthetic close/change series and mock regional risk profile.",
    riskExplanation: "風險分數偏低，代表此 mock 情境下波動尚未擴散，仍需觀察動能是否延續。",
    scoreDrivers: ["收盤維持在短線區間高位", "三日序列呈現溫和墊高", "風險分數未同步升高"],
    riskDrivers: ["漲幅不大，仍可能只是區間整理", "目前只有 mock 序列，缺少正式成交量與廣度資料"],
    ...mockSource
  },
  {
    symbol: "NIKKEI225",
    displayName: "Nikkei 225",
    market: "JP",
    country: "JP",
    regionLabel: "日經平均指數",
    tradeDate: "2026-06-19",
    close: 39000,
    change: -120,
    changePercent: -0.31,
    signalState: "觀望",
    compositeScore: 56,
    riskScore: 43,
    scoreSource: "Synthetic close/change series and mock regional risk profile.",
    riskExplanation: "風險分數位於中段，代表此 mock 情境下市場尚未失控，但短線推升力轉弱。",
    scoreDrivers: ["前兩日仍守在相近區間", "跌幅未放大成高風險狀態"],
    riskDrivers: ["最新收盤回落", "三日序列未形成清楚上行動能"],
    ...mockSource
  },
  {
    symbol: "KOSPI",
    displayName: "KOSPI",
    market: "KR",
    country: "KR",
    regionLabel: "KOSPI 綜合指數",
    tradeDate: "2026-06-19",
    close: 2800,
    change: 8,
    changePercent: 0.29,
    signalState: "中性偏多",
    compositeScore: 61,
    riskScore: 38,
    scoreSource: "Synthetic close/change series and mock regional risk profile.",
    riskExplanation: "風險分數偏低至中段，代表此 mock 情境下波動可控，但訊號仍需要更多正式資料驗證。",
    scoreDrivers: ["連續兩日收高", "短線跌後回穩", "風險分數低於 40"],
    riskDrivers: ["回升幅度仍小", "缺少正式市場廣度與資金資料"],
    ...mockSource
  },
  {
    symbol: "HSI",
    displayName: "Hang Seng Index",
    market: "HK",
    country: "HK",
    regionLabel: "恒生指數",
    tradeDate: "2026-06-19",
    close: 18250,
    change: -210,
    changePercent: -1.14,
    signalState: "警戒",
    compositeScore: 44,
    riskScore: 61,
    scoreSource: "Synthetic close/change series and mock regional risk profile.",
    riskExplanation: "風險分數偏高，代表此 mock 情境下回落速度較快，適合先放在風險觀察清單。",
    scoreDrivers: ["前一日仍有短線反彈", "尚未跌破 mock 區間低點"],
    riskDrivers: ["最新收盤明顯回落", "三日序列轉弱", "風險分數高於 60"],
    ...mockSource
  },
  {
    symbol: "STOXX50E",
    displayName: "Euro Stoxx 50",
    market: "EU",
    country: "EU",
    regionLabel: "Euro Stoxx 50",
    tradeDate: "2026-06-19",
    close: 4950,
    change: 18,
    changePercent: 0.36,
    signalState: "中性",
    compositeScore: 58,
    riskScore: 41,
    scoreSource: "Synthetic close/change series and mock regional risk profile.",
    riskExplanation: "風險分數位於中段偏低，代表此 mock 情境下市場穩定但尚未出現強勢突破。",
    scoreDrivers: ["最新收盤小幅走高", "風險分數低於 45"],
    riskDrivers: ["三日變化幅度有限", "缺少正式成分股廣度資料"],
    ...mockSource
  },
  {
    symbol: "CSI300",
    displayName: "CSI 300",
    market: "CN",
    country: "CN",
    regionLabel: "CSI 300",
    tradeDate: "2026-06-19",
    close: 3620,
    change: -32,
    changePercent: -0.88,
    signalState: "轉弱",
    compositeScore: 42,
    riskScore: 63,
    scoreSource: "Synthetic close/change series and mock regional risk profile.",
    riskExplanation: "風險分數偏高，代表此 mock 情境下價格回落與風險同步升溫。",
    scoreDrivers: ["前兩日仍維持在相近區間", "尚未形成連續急跌"],
    riskDrivers: ["最新收盤下滑", "風險分數高於 60", "三日序列缺少反彈確認"],
    ...mockSource
  }
] satisfies readonly GlobalIndexSnapshot[];

export const mockGlobalIndexSeries = {
  SP500: [
    { symbol: "SP500", tradeDate: "2026-06-17", close: 4975, change: 15, changePercent: 0.3, isMock: true },
    { symbol: "SP500", tradeDate: "2026-06-18", close: 4990, change: 15, changePercent: 0.3, isMock: true },
    { symbol: "SP500", tradeDate: "2026-06-19", close: 5000, change: 10, changePercent: 0.2, isMock: true }
  ],
  NIKKEI225: [
    { symbol: "NIKKEI225", tradeDate: "2026-06-17", close: 39150, change: 80, changePercent: 0.2, isMock: true },
    { symbol: "NIKKEI225", tradeDate: "2026-06-18", close: 39120, change: -30, changePercent: -0.08, isMock: true },
    { symbol: "NIKKEI225", tradeDate: "2026-06-19", close: 39000, change: -120, changePercent: -0.31, isMock: true }
  ],
  KOSPI: [
    { symbol: "KOSPI", tradeDate: "2026-06-17", close: 2785, change: -5, changePercent: -0.18, isMock: true },
    { symbol: "KOSPI", tradeDate: "2026-06-18", close: 2792, change: 7, changePercent: 0.25, isMock: true },
    { symbol: "KOSPI", tradeDate: "2026-06-19", close: 2800, change: 8, changePercent: 0.29, isMock: true }
  ],
  HSI: [
    { symbol: "HSI", tradeDate: "2026-06-17", close: 18420, change: -60, changePercent: -0.32, isMock: true },
    { symbol: "HSI", tradeDate: "2026-06-18", close: 18460, change: 40, changePercent: 0.22, isMock: true },
    { symbol: "HSI", tradeDate: "2026-06-19", close: 18250, change: -210, changePercent: -1.14, isMock: true }
  ],
  STOXX50E: [
    { symbol: "STOXX50E", tradeDate: "2026-06-17", close: 4925, change: -10, changePercent: -0.2, isMock: true },
    { symbol: "STOXX50E", tradeDate: "2026-06-18", close: 4932, change: 7, changePercent: 0.14, isMock: true },
    { symbol: "STOXX50E", tradeDate: "2026-06-19", close: 4950, change: 18, changePercent: 0.36, isMock: true }
  ],
  CSI300: [
    { symbol: "CSI300", tradeDate: "2026-06-17", close: 3665, change: 8, changePercent: 0.22, isMock: true },
    { symbol: "CSI300", tradeDate: "2026-06-18", close: 3652, change: -13, changePercent: -0.35, isMock: true },
    { symbol: "CSI300", tradeDate: "2026-06-19", close: 3620, change: -32, changePercent: -0.88, isMock: true }
  ]
} satisfies Readonly<Record<string, readonly GlobalIndexSeriesPoint[]>>;
