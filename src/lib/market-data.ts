import type { Asset } from "@/lib/assets";
import type { SignalSnapshot } from "@/lib/signal-model";

export type QuoteSnapshot = {
  change: number;
  changePercent: number;
  close: number;
  currency: "TWD";
  dividendYield: number | null;
  epsTtm: number | null;
  high: number;
  low: number;
  marketLabel: string;
  open: number;
  pe: number | null;
  pb: number | null;
  rankLabel: string;
  updatedAt: string;
  volume: number;
};

const basePrices: Record<string, number> = {
  TWII: 21980,
  "0050": 186.4,
  "006208": 108.2,
  "2330": 930,
  "2454": 1185,
  "2317": 174.5,
  "2308": 385,
  "2382": 274
};

export function buildQuoteSnapshot(asset: Asset, snapshot: SignalSnapshot): QuoteSnapshot {
  const base = basePrices[asset.symbol] ?? 100;
  const momentum = (snapshot.healthScore - snapshot.riskScore) / 100;
  const changePercent = roundTo((momentum + asset.flow * 0.18 - 0.05) / 10, 4);
  const close = roundPrice(base * (1 + changePercent));
  const change = roundPrice(close - base);
  const intradayRange = Math.max(0.006, asset.beta * 0.012);
  const open = roundPrice(base * (1 + changePercent * 0.35));
  const high = roundPrice(Math.max(open, close) * (1 + intradayRange / 2));
  const low = roundPrice(Math.min(open, close) * (1 - intradayRange / 2));
  const isIndex = asset.group === "指數";
  const isEtf = asset.group === "ETF";

  return {
    change,
    changePercent,
    close,
    currency: "TWD",
    dividendYield: isIndex ? null : roundTo(0.018 + (1 - asset.valuation) * 0.035 + (isEtf ? 0.01 : 0), 4),
    epsTtm: isIndex || isEtf ? null : roundTo(close / (14 + asset.valuation * 18), 2),
    high,
    low,
    marketLabel: isIndex ? "指數" : isEtf ? "ETF" : "股票",
    open,
    pb: isIndex ? null : roundTo(1.2 + asset.quality * 3.6 + asset.valuation * 1.4, 2),
    pe: isIndex || isEtf ? null : roundTo(14 + asset.valuation * 18, 2),
    rankLabel: isIndex ? "市場基準" : isEtf ? "ETF 觀察" : `觀察清單第 ${Math.max(1, Math.round(8 - asset.quality * 5))} 名`,
    updatedAt: `${snapshot.date} 14:30`,
    volume: Math.round((base * 950 + asset.flow * 180000 + asset.beta * 60000) / (isIndex ? 8 : 1))
  };
}

function roundPrice(value: number) {
  if (value >= 1000) return Math.round(value);
  if (value >= 100) return roundTo(value, 1);
  return roundTo(value, 2);
}

function roundTo(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
