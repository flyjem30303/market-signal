import { createClient } from "@supabase/supabase-js";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Create .env.local or set the variable before running raw market check.`);
  }
  return value;
}

function createServiceClient() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

async function getActiveMarkets(client) {
  const { data, error } = await client
    .from("market_exchanges")
    .select("country,currency,display_name,exchange,locale,name,timezone")
    .eq("is_active", true)
    .order("country", { ascending: true });

  if (error) throw new Error(`market_exchanges query failed: ${error.message}`);
  return data ?? [];
}

async function getStockBySymbol(client, { country, exchange, symbol }) {
  const { data, error } = await client
    .from("stocks")
    .select("asset_type,country,currency,exchange,id,industry,is_etf,listed_date,market,name,symbol,timezone")
    .eq("country", country)
    .eq("exchange", exchange)
    .eq("symbol", symbol)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(`stocks query failed: ${error.message}`);
  return data ?? null;
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

const target = {
  country: process.env.RAW_MARKET_COUNTRY ?? "TW",
  exchange: process.env.RAW_MARKET_EXCHANGE ?? "TWSE",
  symbol: process.env.RAW_MARKET_SYMBOL ?? "2330",
};

const client = createServiceClient();
const activeMarkets = await getActiveMarkets(client);
const stock = await getStockBySymbol(client, target);

if (!stock) {
  throw new Error(`Stock not found: ${target.country}/${target.exchange}/${target.symbol}`);
}

const [price, fundamentals] = await Promise.all([
  getLatestPrice(client, stock.id),
  getLatestFundamentals(client, stock.id),
]);

if (!price) throw new Error(`Latest daily price not found for ${target.symbol}`);
if (!fundamentals) throw new Error(`Latest daily fundamentals not found for ${target.symbol}`);

console.log(
  JSON.stringify(
    {
      active_markets: activeMarkets,
      snapshot: {
        fundamentals,
        price,
        stock,
      },
      status: "ok",
      target,
    },
    null,
    2,
  ),
);
