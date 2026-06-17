const TWSE_OPENAPI_STAGE7_REAL_SCORE_FORMULA_BOUNDARY = {
  nextRoute: "scoreSource_real_promotion_gate",
  noBuySellAdvice: true,
  publicDataSource: "supabase",
  rawPayloadEcho: false,
  rowPayloadEcho: false,
  scoreSource: "mock",
  secretsPrinted: false
};

const score = buildStage7Score(buildSyntheticSeries());

console.log(
  JSON.stringify(
    {
      boundary: TWSE_OPENAPI_STAGE7_REAL_SCORE_FORMULA_BOUNDARY,
      guardedStatus: "stage_7_real_score_formula_complete",
      nextRoute: "scoreSource_real_promotion_gate",
      score,
      status: "ok"
    },
    null,
    2
  )
);

function buildSyntheticSeries() {
  return [
    { close: 22100, high: 22180, low: 21960, open: 22010, tradeDate: "2026-06-10", volume: 6200 },
    { close: 22240, high: 22310, low: 22080, open: 22120, tradeDate: "2026-06-11", volume: 6500 },
    { close: 22180, high: 22350, low: 22110, open: 22260, tradeDate: "2026-06-12", volume: 6300 },
    { close: 22420, high: 22480, low: 22200, open: 22240, tradeDate: "2026-06-15", volume: 7100 },
    { close: 22560, high: 22640, low: 22390, open: 22450, tradeDate: "2026-06-16", volume: 7600 },
    { close: 22620, high: 22720, low: 22510, open: 22580, tradeDate: "2026-06-17", volume: 7800 }
  ];
}

function buildStage7Score(series) {
  const ordered = series.slice().sort((left, right) => left.tradeDate.localeCompare(right.tradeDate));
  const latest = ordered.at(-1);
  const previous = ordered.at(-2);
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
      `Daily change component: dailyChangeScore=${components.dailyChangeScore}.`,
      `Moving-average posture component: movingAveragePostureScore=${components.movingAveragePostureScore}.`,
      `Volume change component: volumeChangeScore=${components.volumeChangeScore}.`,
      `Volatility component: volatilityScore=${components.volatilityScore}.`,
      `Dispersion component: dispersionScore=${components.dispersionScore}.`
    ],
    riskScore,
    scoreSource: "mock",
    signal: signalFor(compositeScore)
  };
}

function signalFor(score) {
  if (score >= 75) return "green";
  if (score >= 62) return "yellow";
  if (score >= 48) return "orange";
  if (score >= 34) return "red";
  return "deep-red";
}

function pctChange(value, base) {
  return base > 0 ? ((value - base) / base) * 100 : 0;
}

function average(values) {
  return values.reduce((total, value) => total + value, 0) / Math.max(1, values.length);
}

function standardDeviation(values) {
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
