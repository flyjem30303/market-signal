import type { GlobalIndexSeriesPoint, GlobalIndexSnapshot, GlobalMarketCode } from "./global-index-provider";

export type FmpIndexListItem = {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
};

export type FmpQuoteShortItem = {
  symbol: string;
  price: number;
  change: number;
  volume: number;
};

export type FmpHistoricalLightItem = {
  symbol: string;
  date: string;
  price: number;
  volume: number;
};

export type FmpMappingStatus = "accepted" | "access_limited" | "unsupported";

export type FmpIndexIdentityMapping = {
  symbol: string;
  displayName: string;
  market: GlobalMarketCode | null;
  currency: string;
  exchange: string;
  status: FmpMappingStatus;
  ruleId: string;
};

export type FmpSnapshotFieldMapping = Pick<GlobalIndexSnapshot, "symbol" | "close" | "change"> & {
  status: FmpMappingStatus;
  ruleId: string;
};

export type FmpSeriesMappingResult = Pick<GlobalIndexSeriesPoint, "symbol" | "tradeDate" | "close"> & {
  status: FmpMappingStatus;
  ruleId: string;
};

const acceptedSymbolMarkets = {
  "^GSPC": "US",
  "^HSI": "HK"
} as const satisfies Record<string, GlobalMarketCode>;

const accessLimitedSymbols = new Set(["^N300"]);

export function mapFmpIndexIdentityToGlobalIndex(item: FmpIndexListItem): FmpIndexIdentityMapping {
  const symbolStatus = classifyFmpSymbol(item.symbol);

  return {
    symbol: item.symbol,
    displayName: item.name,
    market: symbolStatus.market,
    currency: item.currency,
    exchange: item.exchange,
    status: symbolStatus.status,
    ruleId: symbolStatus.ruleId
  };
}

export function mapFmpQuoteToGlobalIndexSnapshotFields(item: FmpQuoteShortItem): FmpSnapshotFieldMapping {
  const symbolStatus = classifyFmpSymbol(item.symbol);

  return {
    symbol: item.symbol,
    close: item.price,
    change: item.change,
    status: symbolStatus.status,
    ruleId: `${symbolStatus.ruleId}:quote-short.price-change`
  };
}

export function mapFmpHistoricalLightToGlobalSeries(item: FmpHistoricalLightItem): FmpSeriesMappingResult {
  const symbolStatus = classifyFmpSymbol(item.symbol);

  return {
    symbol: item.symbol,
    tradeDate: item.date,
    close: item.price,
    status: symbolStatus.status,
    ruleId: `${symbolStatus.ruleId}:historical-light.date-price`
  };
}

function classifyFmpSymbol(symbol: string): { market: GlobalMarketCode | null; status: FmpMappingStatus; ruleId: string } {
  const acceptedMarket = acceptedSymbolMarkets[symbol as keyof typeof acceptedSymbolMarkets];
  if (acceptedMarket) {
    return {
      market: acceptedMarket,
      status: "accepted",
      ruleId: `phase-2a-15:fmp:${symbol}:accepted`
    };
  }

  if (accessLimitedSymbols.has(symbol)) {
    return {
      market: "JP",
      status: "access_limited",
      ruleId: `phase-2a-15:fmp:${symbol}:access-limited`
    };
  }

  return {
    market: null,
    status: "unsupported",
    ruleId: "phase-2a-15:fmp:unknown-symbol:unsupported"
  };
}
