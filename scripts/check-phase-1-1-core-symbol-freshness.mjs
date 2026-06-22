import fs from "node:fs";

const DEFAULT_SYMBOLS = ["TWII", "2330", "0050", "006208"];
const MODEL_VERSION = "phase1-price-derived-v1";

loadDotEnv([".env.local", ".env"]);

const args = process.argv.slice(2);
const symbolArg = args.find((arg) => arg.startsWith("--symbols="));
const requiredSymbols = (
  symbolArg ? symbolArg.slice("--symbols=".length).split(",") : process.env.PHASE11_CORE_SYMBOLS?.split(",") ?? DEFAULT_SYMBOLS
)
  .map((symbol) => symbol.trim().toUpperCase())
  .filter(Boolean);
const maxLagCalendarDays = Number(process.env.PHASE11_CORE_FRESHNESS_MAX_LAG_DAYS ?? "5");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Create .env.local or set the variable before running core-symbol freshness check.`);
  }
  return value;
}

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/+$/, "");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

async function restGet(path) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`
    }
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(`${path} query failed: ${json?.message ?? response.statusText}`);
  return json;
}

const assets = await restGet(
  `stocks?select=id,symbol,name,asset_type,is_etf,is_active&symbol=in.(${requiredSymbols.join(",")})&country=eq.TW&exchange=eq.TWSE`
);
const assetsBySymbol = new Map((assets ?? []).map((asset) => [String(asset.symbol).toUpperCase(), asset]));
const missingAssets = requiredSymbols.filter((symbol) => !assetsBySymbol.has(symbol));
const inactiveAssets = requiredSymbols.filter((symbol) => assetsBySymbol.has(symbol) && !assetsBySymbol.get(symbol).is_active);

const assetIds = requiredSymbols
  .map((symbol) => assetsBySymbol.get(symbol)?.id)
  .filter(Boolean);

const [latestPriceByStockId, latestScoreByStockId] = await Promise.all([
  latestDateMapByStockId("daily_prices", assetIds),
  latestDateMapByStockId("daily_scores", assetIds, `model_version=eq.${MODEL_VERSION}`)
]);
const core = requiredSymbols.map((symbol) => {
  const asset = assetsBySymbol.get(symbol);
  const stockId = asset?.id ?? null;
  const latestPriceDate = stockId ? latestPriceByStockId.get(stockId) ?? null : null;
  const latestScoreDate = stockId ? latestScoreByStockId.get(stockId) ?? null : null;
  const lagCalendarDays = latestPriceDate ? calendarDayDistance(latestPriceDate, taipeiTodayIsoDate()) : null;

  return {
    assetType: asset?.asset_type ?? null,
    isEtf: Boolean(asset?.is_etf),
    lagCalendarDays,
    latestPriceDate,
    latestScoreDate,
    name: asset?.name ?? null,
    stockId,
    symbol
  };
});

const priceDates = uniquePresent(core.map((row) => row.latestPriceDate));
const scoreDates = uniquePresent(core.map((row) => row.latestScoreDate));
const missingPriceSymbols = core.filter((row) => !row.latestPriceDate).map((row) => row.symbol);
const missingScoreSymbols = core.filter((row) => !row.latestScoreDate).map((row) => row.symbol);
const mismatchedScoreDateSymbols = core
  .filter((row) => row.latestPriceDate && row.latestScoreDate && row.latestScoreDate !== row.latestPriceDate)
  .map((row) => row.symbol);
const staleSymbols = core
  .filter((row) => row.lagCalendarDays != null && row.lagCalendarDays > maxLagCalendarDays)
  .map((row) => row.symbol);

const failures = [
  ...missingAssets.map((symbol) => `missing_asset:${symbol}`),
  ...inactiveAssets.map((symbol) => `inactive_asset:${symbol}`),
  ...missingPriceSymbols.map((symbol) => `missing_daily_prices:${symbol}`),
  ...missingScoreSymbols.map((symbol) => `missing_daily_scores:${symbol}`),
  ...mismatchedScoreDateSymbols.map((symbol) => `score_date_mismatch:${symbol}`),
  ...staleSymbols.map((symbol) => `stale_daily_prices:${symbol}`),
  ...(priceDates.length > 1 ? [`core_price_dates_not_aligned:${priceDates.join("|")}`] : []),
  ...(scoreDates.length > 1 ? [`core_score_dates_not_aligned:${scoreDates.join("|")}`] : [])
];

const result = {
  core,
  failures,
  maxLagCalendarDays,
  modelVersion: MODEL_VERSION,
  requiredSymbols,
  status: failures.length === 0 ? "ok" : "review",
  taipeiToday: taipeiTodayIsoDate()
};

console.log(JSON.stringify(result, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}

async function latestDateMapByStockId(table, stockIds, extraFilter = null) {
  const map = new Map();
  await Promise.all(
    stockIds.map(async (stockId) => {
      const filter = extraFilter ? `&${extraFilter}` : "";
      const rows = await restGet(
        `${table}?select=stock_id,trade_date&stock_id=eq.${encodeURIComponent(
          stockId
        )}${filter}&order=trade_date.desc&limit=1`
      );
      if (rows?.[0]?.trade_date) map.set(stockId, rows[0].trade_date);
    })
  );
  return map;
}

function loadDotEnv(files) {
  for (const file of files) {
    try {
      const text = fs.readFileSync(file, "utf8");
      for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const separator = trimmed.indexOf("=");
        if (separator < 0) continue;
        const key = trimmed.slice(0, separator).trim();
        const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
        if (key && process.env[key] == null) process.env[key] = value;
      }
    } catch {
      // Optional local env file.
    }
  }
}

function uniquePresent(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function taipeiTodayIsoDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Taipei",
    year: "numeric"
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function calendarDayDistance(fromDate, toDate) {
  const from = parseIsoDate(fromDate);
  const to = parseIsoDate(toDate);
  if (!from || !to || from >= to) return 0;
  return Math.floor((to.getTime() - from.getTime()) / 86_400_000);
}

function parseIsoDate(value) {
  const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}
