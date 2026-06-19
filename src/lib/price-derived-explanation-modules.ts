import type { ModuleScore } from "./signal-model";

type PriceLike = {
  close: number | null;
  high: number | null;
  low: number | null;
  open: number | null;
};

type BuildPriceDerivedModulesInput = {
  compositeScore: number;
  healthScore: number;
  lastUpdatedAt: string;
  missingModuleFlags: string[];
  price?: PriceLike;
  riskScore: number;
  source: string;
  staleDataFlags: string[];
  tradeDate: string;
};

type BuildPriceDerivedModulesResult = {
  missingModuleFlags: string[];
  modules: ModuleScore[];
};

export function buildPriceDerivedExplanationModules(
  input: BuildPriceDerivedModulesInput
): BuildPriceDerivedModulesResult {
  const modules: ModuleScore[] = [buildTrendModule(input), buildDataFreshnessModule(input)];
  const missingFlags = new Set(input.missingModuleFlags);

  const momentum = buildMomentumModule(input);
  if (momentum) {
    modules.push(momentum);
  } else {
    missingFlags.add("momentum_price_fields_missing_phase_1");
  }

  const volatility = buildVolatilityModule(input);
  if (volatility) {
    modules.push(volatility);
  } else {
    missingFlags.add("volatility_price_fields_missing_phase_1");
  }

  missingFlags.add("valuation_source_missing_phase_1");
  missingFlags.add("fund_flow_baseline_missing_phase_1");

  return {
    missingModuleFlags: [...missingFlags],
    modules
  };
}

function buildTrendModule(input: BuildPriceDerivedModulesInput): ModuleScore {
  const health = clampScore(Math.round(input.compositeScore * 0.7 + input.healthScore * 0.3));
  const risk = clampScore(Math.round(input.riskScore * 0.65 + (100 - health) * 0.35));

  return {
    evidence: [
      evidence("module-trend-from-composite-score", "daily_scores.composite_score", input.compositeScore),
      evidence("module-trend-from-health-score", "daily_scores.health_score", input.healthScore),
      evidence("module-trend-from-risk-score", "daily_scores.risk_score", input.riskScore)
    ],
    health,
    id: "trend",
    label: "趨勢",
    name: "趨勢",
    note: "由綜合分數、健康分數與風險分數推估趨勢延續力。",
    risk,
    source: input.source,
    updatedAt: input.lastUpdatedAt,
    weight: 28
  };
}

function buildMomentumModule(input: BuildPriceDerivedModulesInput): ModuleScore | null {
  const open = input.price?.open;
  const close = input.price?.close;
  if (!isFiniteNumber(open) || !isFiniteNumber(close) || open <= 0) return null;

  const dailyReturnPct = ((close - open) / open) * 100;
  const health = clampScore(Math.round(50 + dailyReturnPct * 8));
  const risk = clampScore(Math.round(50 - dailyReturnPct * 6));

  return {
    evidence: [
      evidence("module-momentum-from-open", "daily_prices.open", open),
      evidence("module-momentum-from-close", "daily_prices.close", close),
      evidence("module-momentum-from-open-close-return", "computed.open_close_return_pct", round(dailyReturnPct))
    ],
    health,
    id: "momentum",
    label: "動能",
    name: "動能",
    note: "由開盤到收盤的價格變化推估短線動能。",
    risk,
    source: input.source,
    updatedAt: input.lastUpdatedAt,
    weight: 24
  };
}

function buildVolatilityModule(input: BuildPriceDerivedModulesInput): ModuleScore | null {
  const high = input.price?.high;
  const low = input.price?.low;
  const close = input.price?.close;
  if (!isFiniteNumber(high) || !isFiniteNumber(low) || !isFiniteNumber(close) || close <= 0) return null;

  const intradayRangePct = ((high - low) / close) * 100;
  const risk = clampScore(Math.round(intradayRangePct * 12));
  const health = clampScore(100 - risk);

  return {
    evidence: [
      evidence("module-volatility-from-high", "daily_prices.high", high),
      evidence("module-volatility-from-low", "daily_prices.low", low),
      evidence("module-volatility-from-close", "daily_prices.close", close),
      evidence("module-volatility-from-range", "computed.intraday_range_pct", round(intradayRangePct))
    ],
    health,
    id: "volatility",
    label: "波動",
    name: "波動",
    note: "由當日高低區間推估短線波動風險。",
    risk,
    source: input.source,
    updatedAt: input.lastUpdatedAt,
    weight: 22
  };
}

function buildDataFreshnessModule(input: BuildPriceDerivedModulesInput): ModuleScore {
  const hasStaleFlag = input.staleDataFlags.length > 0;
  const health = hasStaleFlag ? 55 : 90;

  return {
    evidence: [
      evidence("module-data-freshness-from-trade-date", "daily_scores.trade_date", input.tradeDate),
      evidence("module-data-freshness-from-stale-flags", "daily_scores.stale_data_flags.length", input.staleDataFlags.length)
    ],
    health,
    id: "dataFreshness",
    label: "資料新鮮度",
    name: "資料新鮮度",
    note: "只影響判讀信心，不列入市場正負因素。",
    risk: 100 - health,
    source: input.source,
    updatedAt: input.lastUpdatedAt,
    weight: 0
  };
}

function evidence(ruleId: string, source: string, value: number | string | boolean) {
  return { ruleId, source, value };
}

function isFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
