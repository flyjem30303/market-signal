import { mockMarketSignalRepository } from "./mock-market-signal-repository";
import type { MarketSignalRepository } from "./types";

export type MarketSignalDataSource = "mock" | "supabase";
export type MarketSignalSupabaseReads = "disabled" | "enabled";

export type MarketSignalSourceStatus = {
  publicScoreSource: "mock";
  reason: string;
  requestedSource: MarketSignalDataSource;
  resolvedSource: "mock";
  supabaseRuntimeReads: MarketSignalSupabaseReads;
};

type MarketSignalEnvironment = {
  [key: string]: string | undefined;
  MARKET_SIGNAL_SUPABASE_READS?: string;
  NEXT_PUBLIC_DATA_SOURCE?: string;
};

export type MarketSignalRepositoryOptions = {
  env?: MarketSignalEnvironment;
};

function getDataSource(env: MarketSignalEnvironment): MarketSignalDataSource {
  const dataSource = env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

  if (dataSource === "mock" || dataSource === "supabase") {
    return dataSource;
  }

  throw new Error(`Unsupported NEXT_PUBLIC_DATA_SOURCE: ${dataSource}`);
}

function getSupabaseRuntimeReads(env: MarketSignalEnvironment): MarketSignalSupabaseReads {
  return env.MARKET_SIGNAL_SUPABASE_READS === "enabled" ? "enabled" : "disabled";
}

export function getMarketSignalSourceStatus({
  env = process.env
}: MarketSignalRepositoryOptions = {}): MarketSignalSourceStatus {
  const requestedSource = getDataSource(env);
  const supabaseRuntimeReads = getSupabaseRuntimeReads(env);

  if (requestedSource === "supabase" && supabaseRuntimeReads !== "enabled") {
    return {
      publicScoreSource: "mock",
      reason: "Supabase market-signal reads are not enabled, so the public repository remains on mock data.",
      requestedSource,
      resolvedSource: "mock",
      supabaseRuntimeReads
    };
  }

  if (requestedSource === "supabase") {
    return {
      publicScoreSource: "mock",
      reason:
        "Supabase market-signal reads are enabled, but the public score repository still resolves to mock until the production transition gate is approved.",
      requestedSource,
      resolvedSource: "mock",
      supabaseRuntimeReads
    };
  }

  return {
    publicScoreSource: "mock",
    reason: "Public market-signal repository is configured for mock data.",
    requestedSource,
    resolvedSource: "mock",
    supabaseRuntimeReads
  };
}

export function createMarketSignalRepository({
  env = process.env
}: MarketSignalRepositoryOptions = {}): MarketSignalRepository {
  getMarketSignalSourceStatus({ env });

  return mockMarketSignalRepository;
}

export function getMarketSignalRepository(): MarketSignalRepository {
  return createMarketSignalRepository();
}
