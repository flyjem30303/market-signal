import { mockMarketSignalRepository } from "./mock-market-signal-repository";
import {
  getMarketSignalSourceStatus,
  type MarketSignalEnvironment,
  type MarketSignalSourceStatus
} from "./market-signal-source-status";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createLoadedSupabaseMarketSignalRepository } from "./supabase-market-signal-repository";
import type { MarketSignalRepository } from "./types";

export { getMarketSignalSourceStatus, type MarketSignalSourceStatus };

export type MarketSignalRepositoryOptions = {
  env?: MarketSignalEnvironment;
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
      { symbols }
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
