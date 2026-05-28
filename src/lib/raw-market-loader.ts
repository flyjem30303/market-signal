import { unstable_noStore as noStore } from "next/cache";
import {
  createSupabaseRawMarketRepository,
  type SupabaseRawMarketClient
} from "@/lib/repositories/supabase-raw-market-repository";
import type { MarketKey, RawMarketRepository, RawMarketSnapshot } from "@/lib/repositories/raw-market-types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const defaultMarket: MarketKey = { country: "TW", exchange: "TWSE" };

export function createServerRawMarketRepository(): RawMarketRepository {
  const client = createServerSupabaseClient() as unknown as SupabaseRawMarketClient;
  return createSupabaseRawMarketRepository(client);
}

export async function getServerRawMarketSnapshot(
  symbol: string,
  market: MarketKey = defaultMarket
): Promise<RawMarketSnapshot | null> {
  noStore();
  return createServerRawMarketRepository().getLatestSnapshot(symbol, market);
}

export async function getServerRawMarketOverview(symbol = "2330", market: MarketKey = defaultMarket) {
  noStore();
  const repository = createServerRawMarketRepository();
  const [activeMarkets, snapshot] = await Promise.all([
    repository.getActiveMarkets(),
    repository.getLatestSnapshot(symbol, market)
  ]);

  return {
    activeMarkets,
    market,
    snapshot,
    symbol
  };
}
