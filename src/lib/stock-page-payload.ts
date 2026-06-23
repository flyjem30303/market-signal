import { unstable_cache } from "next/cache";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import type { MarketWatchlistItem } from "@/lib/market-watchlist-search";
import { getMarketSignalRuntime, type MarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";
import type { MarketSignalRepositoryData } from "@/lib/repositories/static-market-signal-repository";
import { toMarketSignalRepositoryData } from "@/lib/repositories/static-market-signal-repository";
import type { MarketSignalRepository } from "@/lib/repositories/types";
import type { Asset } from "@/lib/assets";
import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import type { SignalSnapshot } from "@/lib/signal-model";

const fallbackSnapshotDate = "2026-05-28";

export type StockPagePayload = {
  asset: Asset | null;
  freshnessSnapshot: DataFreshnessSnapshot;
  marketSignalSourceStatus: MarketSignalSourceStatus;
  repositoryData: MarketSignalRepositoryData;
  snapshot: SignalSnapshot | null;
  snapshotDate: string;
  stockPageSymbols: string[];
  watchlistItems: MarketWatchlistItem[];
};

export async function buildStockPagePayload(symbol: string, historyDays: number): Promise<StockPagePayload> {
  return getCachedStockPagePayload(symbol.toUpperCase(), historyDays);
}

const getCachedStockPagePayload = unstable_cache(
  async (symbol: string, historyDays: number): Promise<StockPagePayload> => {
    const stockPageSymbols = buildStockPageSymbols(symbol);
    const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime({
      historyDays,
      symbols: stockPageSymbols
    });
    const asset = repository.getAssetBySymbol(symbol);
    const freshnessSnapshot = await getDataFreshnessSnapshot();
    const snapshotDate = asset ? getLatestSnapshotDate(repository, asset.symbol) : fallbackSnapshotDate;
    const snapshot = asset ? repository.getSnapshot(asset.symbol, snapshotDate) ?? null : null;
    const repositoryData = toMarketSignalRepositoryData(repository, snapshotDate, stockPageSymbols, {
      includeSeriesDays: historyDays
    });

    return {
      asset: asset ?? null,
      freshnessSnapshot,
      marketSignalSourceStatus,
      repositoryData,
      snapshot,
      snapshotDate,
      stockPageSymbols,
      watchlistItems: []
    };
  },
  ["stock-page-payload"],
  { revalidate: 900 }
);

function getLatestSnapshotDate(repository: MarketSignalRepository, symbol: string) {
  return repository.getSeries(symbol).at(-1)?.date ?? fallbackSnapshotDate;
}

function buildStockPageSymbols(symbol: string) {
  return [symbol];
}
