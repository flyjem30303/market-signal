import { mockMarketSignalRepository } from "./mock-market-signal-repository";
import type { MarketSignalRepository } from "./types";

export function getMarketSignalRepository(): MarketSignalRepository {
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

  if (dataSource !== "mock") {
    // Keep production-safe fallback until Supabase queries are implemented.
    return mockMarketSignalRepository;
  }

  return mockMarketSignalRepository;
}
