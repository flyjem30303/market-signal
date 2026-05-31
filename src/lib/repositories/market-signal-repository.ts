import { mockMarketSignalRepository } from "./mock-market-signal-repository";
import {
  getMarketSignalSourceStatus,
  type MarketSignalEnvironment,
  type MarketSignalSourceStatus
} from "./market-signal-source-status";
import type { MarketSignalRepository } from "./types";

export { getMarketSignalSourceStatus, type MarketSignalSourceStatus };

export type MarketSignalRepositoryOptions = {
  env?: MarketSignalEnvironment;
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
