import { buildBacktestBuckets, type NewsEvent, type SignalSnapshot } from "@/lib/signal-model";
import type { MarketSignalRepository } from "./types";

export type MarketSignalRepositoryData = {
  assets: ReturnType<MarketSignalRepository["getAssets"]>;
  news: NewsEvent[];
  snapshotDate: string;
  snapshots: SignalSnapshot[];
};

export function toMarketSignalRepositoryData(
  repository: MarketSignalRepository,
  snapshotDate = "2026-05-28"
): MarketSignalRepositoryData {
  const assets = repository.getAssets();
  const snapshots = assets
    .map((asset) => repository.getSnapshot(asset.symbol, snapshotDate) ?? repository.getSeries(asset.symbol).at(-1))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));

  return {
    assets,
    news: assets.flatMap((asset) => repository.getRelatedNews(asset.symbol, snapshotDate)),
    snapshotDate: snapshots[0]?.date ?? snapshotDate,
    snapshots
  };
}

export function createStaticMarketSignalRepository(data: MarketSignalRepositoryData): MarketSignalRepository {
  const assetsBySymbol = new Map(data.assets.map((asset) => [asset.symbol.toLowerCase(), asset]));
  const snapshotsBySymbol = new Map<string, SignalSnapshot[]>();

  for (const snapshot of data.snapshots) {
    const key = snapshot.asset.symbol.toLowerCase();
    snapshotsBySymbol.set(key, [...(snapshotsBySymbol.get(key) ?? []), snapshot]);
  }

  return {
    getAssets() {
      return data.assets;
    },

    getAssetBySymbol(symbol) {
      return assetsBySymbol.get(symbol.toLowerCase());
    },

    getSnapshot(symbol, date) {
      const series = snapshotsBySymbol.get(symbol.toLowerCase()) ?? [];
      return series.find((snapshot) => snapshot.date === date) ?? series.at(-1);
    },

    getSeries(symbol, range) {
      const series = snapshotsBySymbol.get(symbol.toLowerCase()) ?? [];
      if (!range) return series;
      return series.filter((snapshot) => snapshot.date >= range.startDate && snapshot.date <= range.endDate);
    },

    getRelatedNews(symbol) {
      return data.news.filter((event) => event.assets.includes(symbol));
    },

    getBacktestBuckets(symbol) {
      return buildBacktestBuckets(this.getSeries(symbol));
    }
  };
}
