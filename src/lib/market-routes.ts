import type { MarketId } from "./market-registry";
import { getMarketById, productionCurrentMarketId } from "./market-registry";

export type MarketRouteKind = "market" | "briefing" | "weekly" | "stock";

export function getMarketRoute(marketId: MarketId): string {
  return getMarketById(marketId).canonicalMarketRoute;
}

export function getMarketBriefingRoute(marketId: MarketId): string {
  return `${getMarketRoute(marketId)}/briefing`;
}

export function getMarketWeeklyRoute(marketId: MarketId): string {
  return `${getMarketRoute(marketId)}/weekly`;
}

export function getMarketStockRoute(marketId: MarketId, symbol: string): string {
  return `${getMarketRoute(marketId)}/stocks/${encodeURIComponent(symbol)}`;
}

export function getTaiwanStockShortcut(symbol: string): string {
  return `/stocks/${encodeURIComponent(symbol)}`;
}

export function getEnglishMarketRoute(marketId: MarketId): string {
  return `/en${getMarketRoute(marketId)}`;
}

export function getCurrentProductionMarketRoute(): string {
  return getMarketRoute(productionCurrentMarketId);
}
