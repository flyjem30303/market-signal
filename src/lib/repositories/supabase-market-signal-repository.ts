import type { Asset, AssetType } from "@/lib/assets";
import {
  buildBacktestBuckets,
  type SignalKey,
  type SignalRule,
  type SignalSnapshot
} from "@/lib/signal-model";
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
  select(columns: string): {
    in(column: string, values: string[]): {
      order(column: string, options: { ascending: boolean }): Promise<SupabaseQueryResult<DailyPriceRow[]>>;
    };
  };
};

type DailyScoreQuery = {
  select(columns: string): {
    in(column: string, values: string[]): {
      order(column: string, options: { ascending: boolean }): Promise<SupabaseQueryResult<DailyScoreRow[]>>;
    };
  };
};

export type SupabaseMarketSignalClient = {
  from(table: "stocks"): StockQuery;
  from(table: "daily_prices"): DailyPriceQuery;
  from(table: "daily_scores"): DailyScoreQuery;
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
    text: "風險分數明顯偏高，市場狀態需要嚴格控管部位與追蹤更新時間。",
    title: "高風險"
  },
  green: {
    key: "green",
    min: 75,
    text: "市場狀態偏強，但仍應確認資料更新時間與風險提示。適合維持觀察，不代表保證上漲。",
    title: "偏多"
  },
  orange: {
    key: "orange",
    min: 48,
    text: "市場訊號分歧，適合先觀察成交量、趨勢延續與風險變化。",
    title: "觀望"
  },
  red: {
    key: "red",
    min: 34,
    text: "風險訊號升高，應提高警覺並檢查是否有資料延遲或市場異常。",
    title: "警戒"
  },
  yellow: {
    key: "yellow",
    min: 62,
    text: "市場仍有支撐，但部分指標開始分歧。適合加強觀察資金、廣度與波動變化。",
    title: "中性偏多"
  }
};

export function createSupabaseMarketSignalRepository(_client: SupabaseMarketSignalClient): MarketSignalRepository {
  throw new Error("Use createLoadedSupabaseMarketSignalRepository() to preload readonly Supabase rows before use.");
}

export async function createLoadedSupabaseMarketSignalRepository(
  client: SupabaseMarketSignalClient,
  market: MarketKey = defaultMarket
): Promise<MarketSignalRepository> {
  const stocks = await getActiveStocks(client, market);
  const stockIds = stocks.map((stock) => stock.id);
  const [prices, scores] =
    stockIds.length > 0 ? await Promise.all([getPrices(client, stockIds), getScores(client, stockIds)]) : [[], []];

  return createRepositoryFromRows(stocks, prices, scores);
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

async function getPrices(client: SupabaseMarketSignalClient, stockIds: string[]): Promise<DailyPriceRow[]> {
  const rows = await readInBatches(stockIds, async (batch) => {
    const { data, error } = await client
      .from("daily_prices")
      .select("close, high, low, open, stock_id, trade_date, turnover, volume")
      .in("stock_id", batch)
      .order("trade_date", { ascending: true });

    if (error) throw new Error(`Failed to load market-signal daily prices: ${error.message}`);
    return data ?? [];
  });

  return rows;
}

async function getScores(client: SupabaseMarketSignalClient, stockIds: string[]): Promise<DailyScoreRow[]> {
  const rows = await readInBatches(stockIds, async (batch) => {
    const { data, error } = await client
      .from("daily_scores")
      .select(
        "composite_score, data_quality_grade, data_quality_score, health_score, last_updated_at, missing_module_flags, model_version, risk_score, signal, stale_data_flags, stock_id, trade_date"
      )
      .in("stock_id", batch)
      .order("trade_date", { ascending: true });

    if (error) throw new Error(`Failed to load market-signal daily scores: ${error.message}`);
    return data ?? [];
  });

  return rows;
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
  return {
    asset,
    compositeScore: score.composite_score,
    dataQualityGrade: score.data_quality_grade,
    dataQualityScore: score.data_quality_score,
    date: score.trade_date,
    healthScore: score.health_score,
    lastUpdatedAt: score.last_updated_at,
    marketFacts: buildMarketFacts(asset, score.trade_date, price),
    missingModuleFlags: score.missing_module_flags,
    modelVersion: score.model_version,
    modules: [],
    riskScore: score.risk_score,
    signal: signalRules[score.signal],
    staleDataFlags: score.stale_data_flags,
    syntheticReturn: 0
  };
}

function buildMarketFacts(asset: Asset, date: string, price?: DailyPriceRow) {
  const unit = asset.type === "index" ? "點" : "元";
  const close = price?.close == null ? "尚無收盤價資料" : `${formatNumber(price.close)} ${unit}`;
  const volume = price?.volume == null ? "尚無成交量資料" : `${formatNumber(price.volume)} 股`;

  return [
    { label: asset.type === "index" ? "指數收盤" : "收盤價", note: "Supabase readonly daily_prices", value: close },
    { label: "成交量", note: "Supabase readonly daily_prices", value: volume },
    { label: "資料日期", note: "Supabase readonly daily_scores", value: date }
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
