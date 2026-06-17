export type TwseOpenApiStage7PricePoint = {
  close: number;
  high: number;
  low: number;
  open: number;
  tradeDate: string;
  volume: number;
};

export type TwseOpenApiStage7RealScoreComponents = {
  dailyChangeScore: number;
  dispersionScore: number;
  movingAveragePostureScore: number;
  volatilityScore: number;
  volumeChangeScore: number;
};

export type TwseOpenApiStage7RealScore = {
  components: TwseOpenApiStage7RealScoreComponents;
  compositeScore: number;
  healthScore: number;
  nextRoute: "scoreSource_real_promotion_gate";
  noBuySellAdvice: true;
  readableReasons: string[];
  riskScore: number;
  scoreSource: "mock";
  signal: "green" | "yellow" | "orange" | "red" | "deep-red";
};

export const TWSE_OPENAPI_STAGE7_REAL_SCORE_FORMULA_BOUNDARY = {
  nextRoute: "scoreSource_real_promotion_gate",
  noBuySellAdvice: true,
  publicDataSource: "supabase",
  scoreSource: "mock"
} as const;

export function buildTwseOpenApiStage7RealScore(series: TwseOpenApiStage7PricePoint[]): TwseOpenApiStage7RealScore {
  const ordered = series.slice().sort((left, right) => left.tradeDate.localeCompare(right.tradeDate));
  if (ordered.length < 2) {
    throw new Error("Stage 7 real score formula requires at least two price points.");
  }

  const latest = ordered.at(-1)!;
  const previous = ordered.at(-2)!;
  const closes = ordered.map((point) => point.close);
  const volumes = ordered.map((point) => point.volume);
  const dailyChangePct = pctChange(latest.close, previous.close);
  const movingAverage = average(closes.slice(-Math.min(20, closes.length)));
  const previousAverageVolume = average(volumes.slice(0, -1).slice(-Math.min(20, Math.max(1, volumes.length - 1))));
  const returns = ordered.slice(1).map((point, index) => pctChange(point.close, ordered[index].close));
  const averageClose = average(closes);

  const components = {
    dailyChangeScore: clampScore(50 + dailyChangePct * 8),
    dispersionScore: clampScore(100 - Math.abs((latest.close - averageClose) / averageClose) * 220),
    movingAveragePostureScore: clampScore(50 + ((latest.close - movingAverage) / movingAverage) * 180),
    volatilityScore: clampScore(100 - standardDeviation(returns) * 18),
    volumeChangeScore: clampScore(50 + pctChange(latest.volume, previousAverageVolume) * 2)
  };
  const compositeScore = clampScore(
    components.dailyChangeScore * 0.24 +
      components.movingAveragePostureScore * 0.24 +
      components.volumeChangeScore * 0.16 +
      components.volatilityScore * 0.2 +
      components.dispersionScore * 0.16
  );
  const riskScore = clampScore(
    100 -
      (components.volatilityScore * 0.42 +
        components.movingAveragePostureScore * 0.24 +
        components.dailyChangeScore * 0.2 +
        components.dispersionScore * 0.14)
  );
  const healthScore = clampScore(compositeScore * 0.72 + components.volatilityScore * 0.16 + components.volumeChangeScore * 0.12);

  return {
    components,
    compositeScore,
    healthScore,
    nextRoute: "scoreSource_real_promotion_gate",
    noBuySellAdvice: true,
    readableReasons: [
      `當日漲跌轉換為 dailyChangeScore=${components.dailyChangeScore}。`,
      `收盤價相對均線轉換為 movingAveragePostureScore=${components.movingAveragePostureScore}。`,
      `成交量相對近期均量轉換為 volumeChangeScore=${components.volumeChangeScore}。`,
      `近端波動轉換為 volatilityScore=${components.volatilityScore}。`,
      `價格偏離近期均值轉換為 dispersionScore=${components.dispersionScore}。`
    ],
    riskScore,
    scoreSource: "mock",
    signal: signalFor(compositeScore)
  };
}

function signalFor(score: number): TwseOpenApiStage7RealScore["signal"] {
  if (score >= 75) return "green";
  if (score >= 62) return "yellow";
  if (score >= 48) return "orange";
  if (score >= 34) return "red";
  return "deep-red";
}

function pctChange(value: number, base: number) {
  return base > 0 ? ((value - base) / base) * 100 : 0;
}

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / Math.max(1, values.length);
}

function standardDeviation(values: number[]) {
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
