import type { Asset } from "@/lib/assets";
import type { BacktestBucket, NewsEvent, SignalSnapshot } from "@/lib/signal-model";

export type DateRange = {
  endDate: string;
  startDate: string;
};

export type MarketSignalRepository = {
  getAssets(): Asset[];
  getAssetBySymbol(symbol: string): Asset | undefined;
  getSnapshot(symbol: string, date: string): SignalSnapshot | undefined;
  getSeries(symbol: string, range?: DateRange): SignalSnapshot[];
  getRelatedNews(symbol: string, date: string): NewsEvent[];
  getBacktestBuckets(symbol: string): BacktestBucket[];
};

