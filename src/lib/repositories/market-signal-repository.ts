import { unstable_cache } from "next/cache";
import { mockMarketSignalRepository } from "./mock-market-signal-repository";
import {
  getMarketSignalSourceStatus,
  type MarketSignalEnvironment,
  type MarketSignalSourceStatus
} from "./market-signal-source-status";
import { toMarketWatchlistItem, type MarketWatchlistItem } from "@/lib/market-watchlist-search";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createLoadedSupabaseMarketSignalRepository,
  createLoadedSupabaseMarketSignalSearchItems
} from "./supabase-market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";
import type { MarketSignalRepository } from "./types";

export { getMarketSignalSourceStatus, type MarketSignalSourceStatus };

export type MarketSignalRepositoryOptions = {
  env?: MarketSignalEnvironment;
  historyDays?: number;
  symbols?: string[];
};

export type MarketSignalRuntime = {
  marketSignalSourceStatus: MarketSignalSourceStatus;
  repository: MarketSignalRepository;
};

export function createMarketSignalRepository({
  env = process.env
}: MarketSignalRepositoryOptions = {}): MarketSignalRepository {
  getMarketSignalSourceStatus({ env });

  return mockMarketSignalRepository;
}

export function getMarketSignalRepository(): MarketSignalRepository {
  return createMarketSignalRepository();
}

export async function getMarketSignalRuntime({
  env = process.env,
  historyDays,
  symbols
}: MarketSignalRepositoryOptions = {}): Promise<MarketSignalRuntime> {
  const marketSignalSourceStatus = getMarketSignalSourceStatus({ env });

  if (marketSignalSourceStatus.resolvedSource !== "supabase") {
    return {
      marketSignalSourceStatus,
      repository: mockMarketSignalRepository
    };
  }

  try {
    const repository = await createLoadedSupabaseMarketSignalRepository(
      createServerSupabaseClient() as unknown as Parameters<typeof createLoadedSupabaseMarketSignalRepository>[0],
      undefined,
      { historyDays, symbols }
    );

    if (repository.getAssets().length === 0) {
      return {
        marketSignalSourceStatus: {
          ...marketSignalSourceStatus,
          failClosedReason: "supabase_read_failed",
          publicScoreSource: "mock",
          reason: "Supabase readonly data returned no active assets, so the public runtime failed closed to mock data.",
          resolvedScoreSource: "mock",
          resolvedSource: "mock"
        },
        repository: mockMarketSignalRepository
      };
    }

    return {
      marketSignalSourceStatus,
      repository
    };
  } catch {
    return {
      marketSignalSourceStatus: {
        ...marketSignalSourceStatus,
        failClosedReason: "supabase_read_failed",
        publicScoreSource: "mock",
        reason: "Supabase readonly data could not be loaded, so the public runtime failed closed to mock data.",
        resolvedScoreSource: "mock",
        resolvedSource: "mock"
      },
      repository: mockMarketSignalRepository
    };
  }
}

export async function getMarketSignalSearchItems({
  env = process.env
}: MarketSignalRepositoryOptions = {}): Promise<MarketWatchlistItem[]> {
  const marketSignalSourceStatus = getMarketSignalSourceStatus({ env });

  if (marketSignalSourceStatus.resolvedSource !== "supabase") {
    return buildSearchItemsFromRepository(mockMarketSignalRepository);
  }

  try {
    const items = await getCachedSupabaseMarketSignalSearchItems();
    return items.length ? items : buildSearchItemsFromRepository(mockMarketSignalRepository);
  } catch {
    return buildSearchItemsFromRepository(mockMarketSignalRepository);
  }
}

const getCachedSupabaseMarketSignalSearchItems = unstable_cache(
  async () =>
    createLoadedSupabaseMarketSignalSearchItems(
      createServerSupabaseClient() as unknown as Parameters<typeof createLoadedSupabaseMarketSignalSearchItems>[0]
    ),
  ["market-signal-search-items"],
  { revalidate: 900 }
);

function buildSearchItemsFromRepository(repository: MarketSignalRepository): MarketWatchlistItem[] {
  return repository
    .getAssets()
    .map((asset) => repository.getSeries(asset.symbol).at(-1))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot))
    .map(toMarketWatchlistItem);
}
