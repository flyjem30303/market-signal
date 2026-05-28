import { createClient } from "@supabase/supabase-js";

const publicPreviewSymbols = ["0050", "006208", "2330", "2454", "2317", "2308", "2382"];
const staleCalendarDays = 7;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Create .env.local or set the variable before running trust review.`);
  }
  return value;
}

function createServiceClient() {
  return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      persistSession: false
    }
  });
}

async function getLatestDataRun(client) {
  const { data, error } = await client
    .from("data_runs")
    .select("data_end_date,finished_at,row_count,source_name,status,target_table")
    .in("target_table", ["daily_prices", "daily_fundamentals"])
    .order("finished_at", { ascending: false });

  if (error) throw new Error(`data_runs query failed: ${error.message}`);

  const latestByTable = new Map();
  for (const row of data ?? []) {
    if (!latestByTable.has(row.target_table)) latestByTable.set(row.target_table, row);
  }

  const rows = [...latestByTable.values()];
  const dataEndDates = rows.map((row) => row.data_end_date).filter(Boolean).sort();

  return {
    as_of_date: dataEndDates.at(-1) ?? null,
    rows,
    source_name: [...new Set(rows.map((row) => row.source_name).filter(Boolean))].join(" / "),
    status: rows.length === 2 && rows.every((row) => row.status === "success" && Number(row.row_count) > 0) ? "complete" : "review"
  };
}

async function getStocks(client) {
  const { data, error } = await client
    .from("stocks")
    .select("asset_type,country,currency,exchange,id,is_active,is_etf,market,name,symbol,timezone")
    .eq("country", "TW")
    .eq("exchange", "TWSE")
    .in("symbol", publicPreviewSymbols)
    .eq("is_active", true);

  if (error) throw new Error(`stocks query failed: ${error.message}`);
  return data ?? [];
}

async function getLatestPrice(client, stockId) {
  const { data, error } = await client
    .from("daily_prices")
    .select("close,high,low,open,trade_date,turnover,volume")
    .eq("stock_id", stockId)
    .order("trade_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`daily_prices query failed: ${error.message}`);
  return data ?? null;
}

async function getLatestFundamentals(client, stockId) {
  const { data, error } = await client
    .from("daily_fundamentals")
    .select("dividend_yield,eps_ttm,pb,pe,revenue_yoy,trade_date")
    .eq("stock_id", stockId)
    .order("trade_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`daily_fundamentals query failed: ${error.message}`);
  return data ?? null;
}

function daysBetween(dateA, dateB) {
  const a = Date.parse(`${dateA}T00:00:00Z`);
  const b = Date.parse(`${dateB}T00:00:00Z`);
  return Math.round((a - b) / 86400000);
}

function buildSymbolReview({ fundamentals, latestRun, price, stock, symbol, today }) {
  const blockers = [];
  const warnings = ["score-is-mock"];

  if (!stock) blockers.push("stock-not-found");
  if (!price) blockers.push("latest-price-missing");
  if (!fundamentals && stock?.is_etf) warnings.push("fundamentals-not-applicable-for-etf");
  if (!fundamentals && !stock?.is_etf) blockers.push("latest-fundamentals-missing");

  if (price && fundamentals && price.trade_date !== fundamentals.trade_date) {
    warnings.push("price-fundamentals-date-mismatch");
  }

  if (latestRun?.as_of_date && price?.trade_date && latestRun.as_of_date !== price.trade_date) {
    warnings.push("data-run-price-date-mismatch");
  }

  if (price?.trade_date && daysBetween(today, price.trade_date) > staleCalendarDays) {
    blockers.push("latest-price-stale");
  }

  const rawReadyForInternalPreview = blockers.length === 0;

  return {
    blockers,
    fundamentals: fundamentals
      ? {
          dividend_yield: fundamentals.dividend_yield,
          pb: fundamentals.pb,
          pe: fundamentals.pe,
          trade_date: fundamentals.trade_date
        }
      : null,
    price: price
      ? {
          close: price.close,
          trade_date: price.trade_date,
          turnover: price.turnover,
          volume: price.volume
        }
      : null,
    raw_ready_for_internal_preview: rawReadyForInternalPreview,
    score_ready_for_public_use: false,
    stock: stock
      ? {
          country: stock.country,
          exchange: stock.exchange,
          is_etf: stock.is_etf,
          name: stock.name,
          symbol: stock.symbol
        }
      : { symbol },
    warnings
  };
}

const client = createServiceClient();
const today = new Date().toISOString().slice(0, 10);
const latestRun = await getLatestDataRun(client);
const stocks = await getStocks(client);
const stocksBySymbol = new Map(stocks.map((stock) => [stock.symbol, stock]));

const reviews = await Promise.all(
  publicPreviewSymbols.map(async (symbol) => {
    const stock = stocksBySymbol.get(symbol) ?? null;
    const [price, fundamentals] = stock
      ? await Promise.all([getLatestPrice(client, stock.id), getLatestFundamentals(client, stock.id)])
      : [null, null];

    return buildSymbolReview({ fundamentals, latestRun, price, stock, symbol, today });
  })
);

const missingSymbols = reviews.filter((review) => review.blockers.includes("stock-not-found")).map((review) => review.stock.symbol);
const blockedSymbols = reviews.filter((review) => review.blockers.length > 0).map((review) => review.stock.symbol);
const rawReadyCount = reviews.filter((review) => review.raw_ready_for_internal_preview).length;

const decision =
  blockedSymbols.length === 0 && latestRun?.status === "complete"
    ? "PROCEED_INTERNAL_ONLY"
    : "REVISE_BEFORE_INTERNAL_PREVIEW";

console.log(
  JSON.stringify(
    {
      coverage: {
        blocked_symbols: blockedSymbols,
        missing_symbols: missingSymbols,
        public_preview_symbols: publicPreviewSymbols.length,
        raw_ready_symbols: rawReadyCount
      },
      decision,
      latest_data_run: latestRun,
      public_release_gate: {
        approved: false,
        reason: "Scores remain mock and have not passed model, disclosure, and legal review."
      },
      reviewed_at: new Date().toISOString(),
      reviews,
      status: "ok"
    },
    null,
    2
  )
);
