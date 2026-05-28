import { mockMarketSignalRepository } from "./mock-market-signal-repository";
import type { MarketSignalRepository } from "./types";

type DataSource = "mock" | "supabase";

function getDataSource(): DataSource {
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

  if (dataSource === "mock" || dataSource === "supabase") {
    return dataSource;
  }

  throw new Error(`Unsupported NEXT_PUBLIC_DATA_SOURCE: ${dataSource}`);
}

export function getMarketSignalRepository(): MarketSignalRepository {
  const dataSource = getDataSource();

  if (dataSource === "supabase") {
    throw new Error("NEXT_PUBLIC_DATA_SOURCE=supabase is configured, but Supabase repository queries are not implemented yet.");
  }

  return mockMarketSignalRepository;
}
