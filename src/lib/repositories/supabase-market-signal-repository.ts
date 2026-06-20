import type { Asset, AssetType } from "@/lib/assets";
import type { MarketWatchlistItem } from "@/lib/market-watchlist-search";
import { buildPriceDerivedExplanationModules } from "@/lib/price-derived-explanation-modules";
import { buildBacktestBuckets, type SignalKey, type SignalRule, type SignalSnapshot } from "@/lib/signal-model";
import type { MarketSignalRepository } from "./types";

type SupabaseQueryError = {
  message: string;
};

type SupabaseQueryResult<T> = {
  data: T | null;
  error: SupabaseQueryError | null;
};

type StockRow = {
  asset_type: string;
  country: string;
  exchange: string;
  id: string;
  industry: string | null;
  is_etf: boolean;
  name: string;
  symbol: string;
};

type DailyPriceRow = {
  close: number | null;
  high: number | null;
  low: number | null;
  open: number | null;
  stock_id: string;
  trade_date: string;
  turnover: number | null;
  volume: number | null;
};

type DailyScoreRow = {
  composite_score: number;
  data_quality_grade: "A" | "B" | "C" | "D";
  data_quality_score: number;
  health_score: number;
  last_updated_at: string;
  missing_module_flags: string[];
  model_version: string;
  risk_score: number;
  signal: SignalKey;
  stale_data_flags: string[];
  stock_id: string;
  trade_date: string;
};

type StockQuery = {
  select(columns: string): {
    eq(column: string, value: string | boolean): StockFilterQuery;
  };
};

type StockFilterQuery = {
  eq(column: string, value: string | boolean): StockFilterQuery;
  order(column: string, options: { ascending: boolean }): StockOrderedQuery;
};

type StockOrderedQuery = {
  range(from: number, to: number): Promise<SupabaseQueryResult<StockRow[]>>;
};

type DailyPriceQuery = {
  select(columns: string): DailyPriceSelectQuery;
};

type DailyPriceSelectQuery = {
    in(column: string, values: string[]): {
      order(column: string, options: { ascending: boolean }): DailyPriceOrderedQuery;
    };
};

type DailyPriceOrderedQuery = Promise<SupabaseQueryResult<DailyPriceRow[]>> & {
  range(from: number, to: number): Promise<SupabaseQueryResult<DailyPriceRow[]>>;
};

type DailyScoreQuery = {
  select(columns: string): DailyScoreSelectQuery;
};

type DailyScoreSelectQuery = {
    in(column: string, values: string[]): {
      order(column: string, options: { ascending: boolean }): DailyScoreOrderedQuery;
    };
  };

type DailyScoreOrderedQuery = Promise<SupabaseQueryResult<DailyScoreRow[]>> & {
  range(from: number, to: number): Promise<SupabaseQueryResult<DailyScoreRow[]>>;
};

export type SupabaseMarketSignalClient = {
  from(table: "stocks"): StockQuery;
  from(table: "daily_prices"): DailyPriceQuery;
  from(table: "daily_scores"): DailyScoreQuery;
};

type SupabaseMarketSignalRepositoryOptions = {
  historyDays?: number;
  symbols?: string[];
};

type MarketKey = {
  country: string;
  exchange: string;
};

const defaultMarket: MarketKey = { country: "TW", exchange: "TWSE" };
const supabaseInFilterBatchSize = 100;
const supabasePageSize = 1000;

const signalRules: Record<SignalKey, SignalRule> = {
  "deep-red": {
    key: "deep-red",
    min: 0,
    text: "市場訊號明顯偏弱，應優先控管風險，等待資料與趨勢重新改善。本訊號不是賣出指令。",
    title: "高風險"
  },
  green: {
    key: "green",
    min: 75,
    text: "市場訊號偏強，趨勢與風險狀態相對健康，適合持續追蹤強勢變化。",
    title: "偏多"
  },
  orange: {
    key: "orange",
    min: 48,
    text: "市場訊號開始轉弱，部分指標分歧，適合降低追高並加強風險觀察。",
    title: "轉弱"
  },
  red: {
    key: "red",
    min: 34,
    text: "市場風險升高，價格與波動訊號偏不利，應優先確認資料品質與風險承受度。",
    title: "警戒"
  },
  yellow: {
    key: "yellow",
    min: 62,
    text: "市場訊號中性偏多，但仍有分歧，適合觀望並確認關鍵指標是否延續。",
    title: "觀望"
  }
};

export function createSupabaseMarketSignalRepository(_client: SupabaseMarketSignalClient): MarketSignalRepository {
  throw new Error("Use createLoadedSupabaseMarketSignalRepository() to preload readonly Supabase rows before use.");
}

export async function createLoadedSupabaseMarketSignalRepository(
  client: SupabaseMarketSignalClient,
  market: MarketKey = defaultMarket,
  options: SupabaseMarketSignalRepositoryOptions = {}
): Promise<MarketSignalRepository> {
  const stocks = filterStocksBySymbols(await getActiveStocks(client, market), options.symbols);
  const stockIds = stocks.map((stock) => stock.id);
  const historyRows = options.historyDays && options.historyDays > 0 ? stockIds.length * options.historyDays : undefined;
  const [prices, scores] =
    stockIds.length > 0
      ? await Promise.all([getPrices(client, stockIds, historyRows), getScores(client, stockIds, historyRows)])
      : [[], []];

  return createRepositoryFromRows(stocks, prices, scores);
}

export async function createLoadedSupabaseMarketSignalSearchItems(
  client: SupabaseMarketSignalClient,
  market: MarketKey = defaultMarket
): Promise<MarketWatchlistItem[]> {
  const stocks = await getActiveStocks(client, market);
  const stockIds = stocks.map((stock) => stock.id);
  const [latestScores, latestQuotes] = await Promise.all([getLatestScores(client, stockIds), getLatestQuotes(client, stockIds)]);
  const stocksById = new Map(stocks.map((stock) => [stock.id, stock]));

  return latestScores
    .map((score) => {
      const stock = stocksById.get(score.stock_id);
      if (!stock) return null;
      const asset = toAsset(stock);
      return {
        asset: {
          id: asset.id,
          name: asset.name,
          symbol: asset.symbol
        },
        compositeScore: score.composite_score,
        ...(latestQuotes.has(score.stock_id) ? { quote: latestQuotes.get(score.stock_id) } : {}),
        riskScore: score.risk_score,
        signal: {
          title: (signalRules[score.signal] ?? signalRules.orange).title
        }
      };
    })
    .filter((item): item is MarketWatchlistItem => Boolean(item));
}

function filterStocksBySymbols(stocks: StockRow[], symbols: string[] | undefined) {
  if (!symbols?.length) return stocks;
  const symbolSet = new Set(symbols.map((symbol) => symbol.toLowerCase()));
  return stocks.filter((stock) => symbolSet.has(stock.symbol.toLowerCase()));
}

function createRepositoryFromRows(
  stocks: StockRow[],
  prices: DailyPriceRow[],
  scores: DailyScoreRow[]
): MarketSignalRepository {
  const assets = stocks.map(toAsset);
  const assetsBySymbol = new Map(assets.map((asset) => [asset.symbol.toLowerCase(), asset]));
  const pricesByStockDate = new Map(prices.map((price) => [`${price.stock_id}:${price.trade_date}`, price]));
  const stocksById = new Map(stocks.map((stock) => [stock.id, stock]));
  const snapshots = scores
    .map((score) => {
      const stock = stocksById.get(score.stock_id);
      if (!stock) return null;
      const asset = assetsBySymbol.get(stock.symbol.toLowerCase());
      if (!asset) return null;
      return toSnapshot(asset, score, pricesByStockDate.get(`${score.stock_id}:${score.trade_date}`));
    })
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));
  const snapshotsBySymbol = groupBy(snapshots, (snapshot) => snapshot.asset.symbol.toLowerCase());

  return {
    getAssets() {
      return assets;
    },

    getAssetBySymbol(symbol) {
      return assetsBySymbol.get(symbol.toLowerCase());
    },

    getSnapshot(symbol, date) {
      return snapshotsBySymbol.get(symbol.toLowerCase())?.find((snapshot) => snapshot.date === date);
    },

    getSeries(symbol, range) {
      const series = snapshotsBySymbol.get(symbol.toLowerCase()) ?? [];
      if (!range) return series;
      return series.filter((snapshot) => snapshot.date >= range.startDate && snapshot.date <= range.endDate);
    },

    getRelatedNews() {
      return [];
    },

    getBacktestBuckets(symbol) {
      return buildBacktestBuckets(this.getSeries(symbol));
    }
  };
}

async function getActiveStocks(client: SupabaseMarketSignalClient, market: MarketKey): Promise<StockRow[]> {
  return readPages(async (from, to) => {
    const { data, error } = await client
      .from("stocks")
      .select("asset_type, country, exchange, id, industry, is_etf, name, symbol")
      .eq("country", market.country)
      .eq("exchange", market.exchange)
      .eq("is_active", true)
      .order("symbol", { ascending: true })
      .range(from, to);

    if (error) throw new Error(`Failed to load market-signal stocks: ${error.message}`);
    return data ?? [];
  });
}

async function getPrices(
  client: SupabaseMarketSignalClient,
  stockIds: string[],
  historyRows?: number
): Promise<DailyPriceRow[]> {
  return readInBatches(stockIds, async (batch) => {
    const query = client
      .from("daily_prices")
      .select("close, high, low, open, stock_id, trade_date, turnover, volume")
      .in("stock_id", batch)
      .order("trade_date", { ascending: historyRows == null });
    const { data, error } =
      historyRows == null ? await query : await query.range(0, Math.max(historyRows - 1, batch.length - 1));

    if (error) throw new Error(`Failed to load market-signal daily prices: ${error.message}`);
    return (data ?? []).slice().sort(compareRowsByStockDate);
  });
}

async function getScores(
  client: SupabaseMarketSignalClient,
  stockIds: string[],
  historyRows?: number
): Promise<DailyScoreRow[]> {
  return readInBatches(stockIds, async (batch) => {
    const query = client
      .from("daily_scores")
      .select(
        "composite_score, data_quality_grade, data_quality_score, health_score, last_updated_at, missing_module_flags, model_version, risk_score, signal, stale_data_flags, stock_id, trade_date"
      )
      .in("stock_id", batch)
      .order("trade_date", { ascending: historyRows == null });
    const { data, error } =
      historyRows == null ? await query : await query.range(0, Math.max(historyRows - 1, batch.length - 1));

    if (error) throw new Error(`Failed to load market-signal daily scores: ${error.message}`);
    return (data ?? []).slice().sort(compareRowsByStockDate);
  });
}

async function getLatestScores(client: SupabaseMarketSignalClient, stockIds: string[]): Promise<DailyScoreRow[]> {
  if (!stockIds.length) return [];

  const latestByStock = new Map<string, DailyScoreRow>();

  await readInBatches(stockIds, async (batch) => {
    const { data, error } = await client
      .from("daily_scores")
      .select(
        "composite_score, data_quality_grade, data_quality_score, health_score, last_updated_at, missing_module_flags, model_version, risk_score, signal, stale_data_flags, stock_id, trade_date"
      )
      .in("stock_id", batch)
      .order("trade_date", { ascending: false });

    if (error) throw new Error(`Failed to load market-signal latest daily scores: ${error.message}`);

    for (const row of data ?? []) {
      if (!latestByStock.has(row.stock_id)) {
        latestByStock.set(row.stock_id, row);
      }
    }

    return [];
  });

  return [...latestByStock.values()];
}

async function getLatestQuotes(client: SupabaseMarketSignalClient, stockIds: string[]) {
  const quotes = new Map<string, MarketWatchlistItem["quote"]>();
  if (!stockIds.length) return quotes;

  await readInBatches(stockIds, async (batch) => {
    const { data, error } = await client
      .from("daily_prices")
      .select("close, high, low, open, stock_id, trade_date, turnover, volume")
      .in("stock_id", batch)
      .order("trade_date", { ascending: false })
      .range(0, batch.length * 3 - 1);

    if (error) throw new Error(`Failed to load market-signal latest daily price quotes: ${error.message}`);

    const pricesByStock = groupBy(data ?? [], (price) => price.stock_id);
    for (const [stockId, prices] of pricesByStock) {
      const latest = prices.find((price) => price.close != null);
      const previous = prices.find((price) => price.trade_date !== latest?.trade_date && price.close != null);
      if (!latest?.close) continue;

      const previousClose = previous?.close ?? latest.close;
      quotes.set(stockId, {
        changePercent: previousClose === 0 ? 0 : ((latest.close - previousClose) / previousClose) * 100,
        close: latest.close,
        tradeDate: latest.trade_date
      });
    }

    return [];
  });

  return quotes;
}

async function readInBatches<T>(ids: string[], readBatch: (batch: string[]) => Promise<T[]>): Promise<T[]> {
  const rows: T[] = [];

  for (let index = 0; index < ids.length; index += supabaseInFilterBatchSize) {
    rows.push(...(await readBatch(ids.slice(index, index + supabaseInFilterBatchSize))));
  }

  return rows;
}

async function readPages<T>(readPage: (from: number, to: number) => Promise<T[]>): Promise<T[]> {
  const rows: T[] = [];

  for (let from = 0; ; from += supabasePageSize) {
    const page = await readPage(from, from + supabasePageSize - 1);
    rows.push(...page);
    if (page.length < supabasePageSize) break;
  }

  return rows;
}

function compareRowsByStockDate<T extends { stock_id: string; trade_date: string }>(left: T, right: T) {
  return left.stock_id.localeCompare(right.stock_id) || left.trade_date.localeCompare(right.trade_date);
}

function toAsset(row: StockRow): Asset {
  const type = toAssetType(row);

  return {
    ai: 0.5,
    beta: type === "index" ? 1 : type === "etf" ? 0.9 : 1.05,
    flow: 0.5,
    group: type === "index" ? "指數" : type === "etf" ? "ETF" : (row.industry ?? "上市股票"),
    id: row.symbol,
    name: row.name,
    quality: 0.5,
    symbol: row.symbol,
    type,
    valuation: 0.5
  };
}

function toAssetType(row: StockRow): AssetType {
  if (row.asset_type === "index") return "index";
  if (row.is_etf || row.asset_type === "etf") return "etf";
  return "stock";
}

function toSnapshot(asset: Asset, score: DailyScoreRow, price?: DailyPriceRow): SignalSnapshot {
  const explanationModules = buildPriceDerivedExplanationModules({
    compositeScore: score.composite_score,
    healthScore: score.health_score,
    lastUpdatedAt: score.last_updated_at,
    missingModuleFlags: score.missing_module_flags,
    price,
    riskScore: score.risk_score,
    source: "TWSE OpenAPI + daily_scores",
    staleDataFlags: score.stale_data_flags,
    tradeDate: score.trade_date
  });

  return {
    asset,
    compositeScore: score.composite_score,
    dataQualityGrade: score.data_quality_grade,
    dataQualityScore: score.data_quality_score,
    date: score.trade_date,
    healthScore: score.health_score,
    lastUpdatedAt: score.last_updated_at,
    marketFacts: buildQuoteMarketFacts(asset, score.trade_date, price),
    missingModuleFlags: explanationModules.missingModuleFlags,
    modelVersion: score.model_version,
    modules: explanationModules.modules,
    riskScore: score.risk_score,
    signal: signalRules[score.signal] ?? signalRules.orange,
    staleDataFlags: score.stale_data_flags,
    syntheticReturn: 0
  };
}

function buildQuoteMarketFacts(asset: Asset, date: string, price?: DailyPriceRow) {
  const unit = asset.type === "index" ? "點" : "元";
  const open = price?.open == null ? "尚無開盤資料" : `${formatNumber(price.open)} ${unit}`;
  const high = price?.high == null ? "尚無最高資料" : `${formatNumber(price.high)} ${unit}`;
  const low = price?.low == null ? "尚無最低資料" : `${formatNumber(price.low)} ${unit}`;
  const close = price?.close == null ? "尚無收盤資料" : `${formatNumber(price.close)} ${unit}`;
  const volume = price?.volume == null ? "尚無成交量資料" : formatNumber(price.volume);
  const turnover = price?.turnover == null ? "尚無成交金額資料" : formatNumber(price.turnover);

  return [
    { label: asset.type === "index" ? "指數開盤" : "開盤價", note: "TWSE OpenAPI 日收盤資料", value: open },
    { label: asset.type === "index" ? "指數最高" : "最高價", note: "TWSE OpenAPI 日收盤資料", value: high },
    { label: asset.type === "index" ? "指數最低" : "最低價", note: "TWSE OpenAPI 日收盤資料", value: low },
    { label: asset.type === "index" ? "指數收盤" : "收盤價", note: "TWSE OpenAPI 日收盤資料", value: close },
    { label: "成交量", note: "TWSE OpenAPI 日收盤資料", value: volume },
    { label: "成交金額", note: "TWSE OpenAPI 日收盤資料", value: turnover },
    { label: "資料日期", note: "TWSE OpenAPI 日收盤資料", value: date }
  ];
}

function formatNumber(value: number) {
  return value.toLocaleString("zh-TW", { maximumFractionDigits: 2 });
}

function groupBy<T>(items: T[], getKey: (item: T) => string) {
  const map = new Map<string, T[]>();

  for (const item of items) {
    const key = getKey(item);
    map.set(key, [...(map.get(key) ?? []), item]);
  }

  return map;
}
