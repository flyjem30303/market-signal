export type MarketKey = {
  country: string;
  exchange: string;
};

export type RawMarket = MarketKey & {
  currency: string;
  displayName: string;
  locale: string;
  name: string;
  timezone: string;
};

export type RawStockIdentity = MarketKey & {
  assetType: string;
  currency: string;
  id: string;
  industry: string | null;
  isEtf: boolean;
  listedDate: string | null;
  market: string;
  name: string;
  symbol: string;
  timezone: string;
};

export type RawDailyPrice = {
  close: number | null;
  high: number | null;
  low: number | null;
  open: number | null;
  tradeDate: string;
  turnover: number | null;
  volume: number | null;
};

export type RawDailyFundamentals = {
  dividendYield: number | null;
  epsTtm: number | null;
  pb: number | null;
  pe: number | null;
  revenueYoy: number | null;
  tradeDate: string;
};

export type RawMarketSnapshot = {
  fundamentals: RawDailyFundamentals | null;
  price: RawDailyPrice | null;
  stock: RawStockIdentity;
};

export type RawMarketRepository = {
  getActiveMarkets(): Promise<RawMarket[]>;
  getStockBySymbol(symbol: string, market?: MarketKey): Promise<RawStockIdentity | null>;
  getLatestSnapshot(symbol: string, market?: MarketKey): Promise<RawMarketSnapshot | null>;
};
