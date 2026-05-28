function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const { getAssetTypePolicy } = await import("../src/lib/asset-type-policy.ts");
const { buildMixedDataQualitySummary } = await import("../src/lib/mixed-data-quality.ts");

const mockScore = {
  asset: {
    ai: 0.7,
    beta: 0.9,
    flow: 0.6,
    group: "ETF",
    id: "0050",
    name: "ETF Test",
    quality: 0.7,
    symbol: "0050",
    valuation: 0.6
  },
  compositeScore: 60,
  dataQualityGrade: "C",
  dataQualityScore: 72,
  date: "2026-05-27",
  healthScore: 70,
  lastUpdatedAt: "2026-05-27T20:00:00+08:00",
  missingModuleFlags: ["mock-model"],
  modelVersion: "mock-test",
  modules: [],
  riskScore: 40,
  signal: {
    key: "yellow",
    min: 62,
    text: "mock",
    title: "mock"
  },
  staleDataFlags: ["mock-model"],
  syntheticReturn: 0
};

const etfPolicy = getAssetTypePolicy({ assetType: "etf", isEtf: true });
assert(etfPolicy.requiresStockFundamentals === false, "ETF should not require stock fundamentals.");
assert(
  etfPolicy.missingFundamentalsCode === "fundamentals-not-applicable-for-etf",
  "ETF missing fundamentals should use ETF-specific caveat."
);

const mixedEtf = {
  quote: {
    close: 100,
    currency: "TWD",
    dividendYield: null,
    epsTtm: null,
    high: 101,
    low: 99,
    marketLabel: "TWSE",
    open: 100,
    pb: null,
    pe: null,
    tradeDate: "2026-05-27",
    turnover: 1000000,
    volume: 10000
  },
  rawDataSource: "real",
  score: mockScore,
  scoreSource: "mock",
  stock: {
    country: "TW",
    exchange: "TWSE",
    id: "0050",
    industry: null,
    isEtf: true,
    name: "ETF Test",
    symbol: "0050",
    timezone: "Asia/Taipei"
  },
  warnings: ["score-is-mock", "fundamentals-not-applicable-for-etf"]
};
const etfQuality = buildMixedDataQualitySummary(mixedEtf);

assert(
  mixedEtf.warnings.includes("fundamentals-not-applicable-for-etf"),
  "ETF snapshot should include ETF-specific fundamentals caveat."
);
assert(!mixedEtf.warnings.includes("latest-fundamentals-unavailable"), "ETF should not use stock fundamentals warning.");
assert(etfQuality.qualityScore === 55, `Expected ETF quality score 55, got ${etfQuality.qualityScore}.`);

console.log(
  JSON.stringify(
    {
      etfPolicy,
      qualityScore: etfQuality.qualityScore,
      status: "ok",
      warnings: mixedEtf.warnings
    },
    null,
    2
  )
);
