import type { SignalSnapshot } from "@/lib/signal-model";

export type MarketWatchlistItem = {
  asset: {
    id: string;
    name: string;
    symbol: string;
  };
  compositeScore: number;
  riskScore: number;
  signal: {
    title: string;
  };
};

export function toMarketWatchlistItem(snapshot: SignalSnapshot): MarketWatchlistItem {
  return {
    asset: {
      id: snapshot.asset.id,
      name: snapshot.asset.name,
      symbol: snapshot.asset.symbol
    },
    compositeScore: snapshot.compositeScore,
    riskScore: snapshot.riskScore,
    signal: {
      title: snapshot.signal.title
    }
  };
}
