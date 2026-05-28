import type { Asset } from "@/lib/assets";
import type { BacktestBucket, NewsEvent, SignalSnapshot } from "@/lib/signal-model";
import type { DateRange, MarketSignalRepository } from "./types";

export type SupabaseClientLike = {
  from(table: string): unknown;
};

export function createSupabaseMarketSignalRepository(_client: SupabaseClientLike): MarketSignalRepository {
  return {
    getAssets(): Asset[] {
      throw new Error("Supabase repository is not implemented yet.");
    },

    getAssetBySymbol(_symbol: string): Asset | undefined {
      throw new Error("Supabase repository is not implemented yet.");
    },

    getSnapshot(_symbol: string, _date: string): SignalSnapshot | undefined {
      throw new Error("Supabase repository is not implemented yet.");
    },

    getSeries(_symbol: string, _range?: DateRange): SignalSnapshot[] {
      throw new Error("Supabase repository is not implemented yet.");
    },

    getRelatedNews(_symbol: string, _date: string): NewsEvent[] {
      throw new Error("Supabase repository is not implemented yet.");
    },

    getBacktestBuckets(_symbol: string): BacktestBucket[] {
      throw new Error("Supabase repository is not implemented yet.");
    }
  };
}

