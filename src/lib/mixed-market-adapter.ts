import { getAssetTypePolicy } from "@/lib/asset-type-policy";
import type { RawMarketSnapshot } from "@/lib/repositories/raw-market-types";
import type { SignalSnapshot } from "@/lib/signal-model";

export type MixedMarketDataSource = "real" | "mock" | "unavailable";

export type MixedMarketQuote = {
  close: number | null;
  currency: string;
  dividendYield: number | null;
  epsTtm: number | null;
  high: number | null;
  low: number | null;
  marketLabel: string;
  open: number | null;
  pb: number | null;
  pe: number | null;
  tradeDate: string | null;
  turnover: number | null;
  volume: number | null;
};

export type MixedMarketSnapshot = {
  quote: MixedMarketQuote;
  rawDataSource: MixedMarketDataSource;
  score: SignalSnapshot;
  scoreSource: MixedMarketDataSource;
  stock: {
    country: string;
    exchange: string;
    id: string;
    industry: string | null;
    isEtf: boolean;
    name: string;
    symbol: string;
    timezone: string;
  };
  warnings: string[];
};

export function buildMixedMarketSnapshot({
  raw,
  score
}: {
  raw: RawMarketSnapshot | null;
  score: SignalSnapshot;
}): MixedMarketSnapshot {
  const stock = raw?.stock;
  const price = raw?.price;
  const fundamentals = raw?.fundamentals;
  const assetTypePolicy = getAssetTypePolicy({ assetType: stock?.assetType, isEtf: stock?.isEtf });
  const warnings = [
    "score-is-mock",
    ...(raw ? [] : ["raw-market-data-unavailable"]),
    ...(price ? [] : ["latest-price-unavailable"]),
    ...(fundamentals ? [] : [assetTypePolicy.missingFundamentalsCode])
  ];

  return {
    quote: {
      close: price?.close ?? null,
      currency: stock?.currency ?? "TWD",
      dividendYield: fundamentals?.dividendYield ?? null,
      epsTtm: fundamentals?.epsTtm ?? null,
      high: price?.high ?? null,
      low: price?.low ?? null,
      marketLabel: stock?.market ?? score.asset.group,
      open: price?.open ?? null,
      pb: fundamentals?.pb ?? null,
      pe: fundamentals?.pe ?? null,
      tradeDate: price?.tradeDate ?? fundamentals?.tradeDate ?? null,
      turnover: price?.turnover ?? null,
      volume: price?.volume ?? null
    },
    rawDataSource: raw ? "real" : "unavailable",
    score,
    scoreSource: "mock",
    stock: {
      country: stock?.country ?? "TW",
      exchange: stock?.exchange ?? "TWSE",
      id: stock?.id ?? score.asset.id,
      industry: stock?.industry ?? null,
      isEtf: stock?.isEtf ?? score.asset.group === "ETF",
      name: stock?.name ?? score.asset.name,
      symbol: stock?.symbol ?? score.asset.symbol,
      timezone: stock?.timezone ?? "Asia/Taipei"
    },
    warnings
  };
}
