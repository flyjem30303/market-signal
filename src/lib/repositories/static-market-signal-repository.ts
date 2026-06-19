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
  snapshotDate = "2026-05-28",
  symbols?: string[],
  options: { includeSeriesDays?: number } = {}
): MarketSignalRepositoryData {
  const symbolSet = symbols ? new Set(symbols.map((symbol) => symbol.toLowerCase())) : null;
  const assets = repository.getAssets().filter((asset) => !symbolSet || symbolSet.has(asset.symbol.toLowerCase()));
  const snapshots = assets.flatMap((asset) => {
    if (options.includeSeriesDays && options.includeSeriesDays > 1) {
      const startDate = shiftDate(snapshotDate, -(options.includeSeriesDays - 1));
      const series = repository.getSeries(asset.symbol, { endDate: snapshotDate, startDate });
      if (series.length) return series;
    }

    const snapshot = repository.getSnapshot(asset.symbol, snapshotDate) ?? repository.getSeries(asset.symbol).at(-1);
    return snapshot ? [snapshot] : [];
  });

  return {
    assets,
    news: assets.flatMap((asset) => repository.getRelatedNews(asset.symbol, snapshotDate)),
    snapshotDate,
    snapshots
  };
}

function shiftDate(dateString: string, days: number) {
  const date = new Date(`${dateString}T00:00:00+08:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
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
