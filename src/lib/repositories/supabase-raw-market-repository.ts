import type {
  MarketKey,
  RawDailyFundamentals,
  RawDailyPrice,
  RawMarket,
  RawMarketRepository,
  RawMarketSnapshot,
  RawStockIdentity
} from "./raw-market-types";

type SupabaseQueryError = {
  message: string;
};

type SupabaseQueryResult<T> = {
  data: T | null;
  error: SupabaseQueryError | null;
};

type MarketExchangeRow = {
  country: string;
  currency: string;
  display_name: string;
  exchange: string;
  locale: string;
  name: string;
  timezone: string;
};

type StockRow = {
  asset_type: string;
  country: string;
  currency: string;
  exchange: string;
  id: string;
  industry: string | null;
  is_etf: boolean;
  listed_date: string | null;
  market: string;
  name: string;
  symbol: string;
  timezone: string;
};

type DailyPriceRow = {
  close: number | null;
  high: number | null;
  low: number | null;
  open: number | null;
  trade_date: string;
  turnover: number | null;
  volume: number | null;
};

type DailyFundamentalsRow = {
  dividend_yield: number | null;
  eps_ttm: number | null;
  pb: number | null;
  pe: number | null;
  revenue_yoy: number | null;
  trade_date: string;
};

type ActiveMarketQuery = {
  select(columns: string): {
    eq(column: string, value: boolean): {
      order(column: string, options: { ascending: boolean }): Promise<SupabaseQueryResult<MarketExchangeRow[]>>;
    };
  };
};

type StockQuery = {
  select(columns: string): {
    eq(column: string, value: string | boolean): StockFilterQuery;
  };
};

type StockFilterQuery = {
  eq(column: string, value: string | boolean): StockFilterQuery;
  maybeSingle(): Promise<SupabaseQueryResult<StockRow>>;
};

type LatestPriceQuery = {
  select(columns: string): {
    eq(column: string, value: string): {
      order(column: string, options: { ascending: boolean }): {
        limit(count: number): {
          maybeSingle(): Promise<SupabaseQueryResult<DailyPriceRow>>;
        };
      };
    };
  };
};

type LatestFundamentalsQuery = {
  select(columns: string): {
    eq(column: string, value: string): {
      order(column: string, options: { ascending: boolean }): {
        limit(count: number): {
          maybeSingle(): Promise<SupabaseQueryResult<DailyFundamentalsRow>>;
        };
      };
    };
  };
};

export type SupabaseRawMarketClient = {
  from(table: "market_exchanges"): ActiveMarketQuery;
  from(table: "stocks"): StockQuery;
  from(table: "daily_prices"): LatestPriceQuery;
  from(table: "daily_fundamentals"): LatestFundamentalsQuery;
};

const defaultMarket: MarketKey = { country: "TW", exchange: "TWSE" };

export function createSupabaseRawMarketRepository(client: SupabaseRawMarketClient): RawMarketRepository {
  return {
    async getActiveMarkets() {
      const { data, error } = await client
        .from("market_exchanges")
        .select("country, currency, display_name, exchange, locale, name, timezone")
        .eq("is_active", true)
        .order("country", { ascending: true });

      if (error) throw new Error(`Failed to load active markets: ${error.message}`);
      return (data ?? []).map(toRawMarket);
    },

    async getStockBySymbol(symbol, market = defaultMarket) {
      const stock = await getStockBySymbol(client, symbol, market);
      return stock ? toRawStockIdentity(stock) : null;
    },

    async getLatestSnapshot(symbol, market = defaultMarket) {
      const stock = await getStockBySymbol(client, symbol, market);
      if (!stock) return null;

      const [price, fundamentals] = await Promise.all([
        getLatestPrice(client, stock.id),
        getLatestFundamentals(client, stock.id)
      ]);

      return {
        fundamentals: fundamentals ? toRawDailyFundamentals(fundamentals) : null,
        price: price ? toRawDailyPrice(price) : null,
        stock: toRawStockIdentity(stock)
      } satisfies RawMarketSnapshot;
    }
  };
}

async function getStockBySymbol(
  client: SupabaseRawMarketClient,
  symbol: string,
  market: MarketKey
): Promise<StockRow | null> {
  const { data, error } = await client
    .from("stocks")
    .select("asset_type, country, currency, exchange, id, industry, is_etf, listed_date, market, name, symbol, timezone")
    .eq("symbol", symbol)
    .eq("country", market.country)
    .eq("exchange", market.exchange)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(`Failed to load stock ${market.country}/${market.exchange}/${symbol}: ${error.message}`);
  return data;
}

async function getLatestPrice(client: SupabaseRawMarketClient, stockId: string): Promise<DailyPriceRow | null> {
  const { data, error } = await client
    .from("daily_prices")
    .select("close, high, low, open, trade_date, turnover, volume")
    .eq("stock_id", stockId)
    .order("trade_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Failed to load latest daily price for stock ${stockId}: ${error.message}`);
  return data;
}

async function getLatestFundamentals(
  client: SupabaseRawMarketClient,
  stockId: string
): Promise<DailyFundamentalsRow | null> {
  const { data, error } = await client
    .from("daily_fundamentals")
    .select("dividend_yield, eps_ttm, pb, pe, revenue_yoy, trade_date")
    .eq("stock_id", stockId)
    .order("trade_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Failed to load latest daily fundamentals for stock ${stockId}: ${error.message}`);
  return data;
}

function toRawMarket(row: MarketExchangeRow): RawMarket {
  return {
    country: row.country,
    currency: row.currency,
    displayName: row.display_name,
    exchange: row.exchange,
    locale: row.locale,
    name: row.name,
    timezone: row.timezone
  };
}

function toRawStockIdentity(row: StockRow): RawStockIdentity {
  return {
    assetType: row.asset_type,
    country: row.country,
    currency: row.currency,
    exchange: row.exchange,
    id: row.id,
    industry: row.industry,
    isEtf: row.is_etf,
    listedDate: row.listed_date,
    market: row.market,
    name: row.name,
    symbol: row.symbol,
    timezone: row.timezone
  };
}

function toRawDailyPrice(row: DailyPriceRow): RawDailyPrice {
  return {
    close: row.close,
    high: row.high,
    low: row.low,
    open: row.open,
    tradeDate: row.trade_date,
    turnover: row.turnover,
    volume: row.volume
  };
}

function toRawDailyFundamentals(row: DailyFundamentalsRow): RawDailyFundamentals {
  return {
    dividendYield: row.dividend_yield,
    epsTtm: row.eps_ttm,
    pb: row.pb,
    pe: row.pe,
    revenueYoy: row.revenue_yoy,
    tradeDate: row.trade_date
  };
}
