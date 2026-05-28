import { assets, findAssetBySymbol } from "@/lib/assets";
import {
  buildBacktestBuckets,
  buildSignalSeries,
  buildSignalSnapshot,
  findRelatedNews
} from "@/lib/signal-model";
import type { DateRange, MarketSignalRepository } from "./types";

const defaultStartDate = "2000-01-01";
const defaultEndDate = "2026-05-28";

export const mockMarketSignalRepository: MarketSignalRepository = {
  getAssets() {
    return assets;
  },

  getAssetBySymbol(symbol) {
    return findAssetBySymbol(symbol);
  },

  getSnapshot(symbol, date) {
    const asset = findAssetBySymbol(symbol);
    if (!asset) return undefined;
    return buildSignalSnapshot(asset, new Date(`${date}T00:00:00`));
  },

  getSeries(symbol, range) {
    const asset = findAssetBySymbol(symbol);
    if (!asset) return [];
    return buildSignalSeries(asset, range?.startDate ?? defaultStartDate, range?.endDate ?? defaultEndDate);
  },

  getRelatedNews(symbol, date) {
    const asset = findAssetBySymbol(symbol);
    if (!asset) return [];
    return findRelatedNews(asset, date);
  },

  getBacktestBuckets(symbol) {
    return buildBacktestBuckets(this.getSeries(symbol));
  }
};

