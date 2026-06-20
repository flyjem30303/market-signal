const MODEL_VERSION = "phase1-price-derived-v1";
const SAMPLE_LIMIT = 12;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Create .env.local or set the variable before running listed-equity coverage rollup.`);
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

const activeListedEquities = await readAllActiveListedEquities();
const latestPriceDate = await latestDate("daily_prices");
const latestScoreDate = await latestDate("daily_scores", `model_version=eq.${MODEL_VERSION}`);

const [latestPriceRows, latestScoreRows] = await Promise.all([
  latestPriceDate
    ? readLatestRows("daily_prices", activeListedEquities.map((asset) => asset.id), latestPriceDate)
    : [],
  latestScoreDate
    ? readLatestRows("daily_scores", activeListedEquities.map((asset) => asset.id), latestScoreDate, `model_version=eq.${MODEL_VERSION}`)
    : []
]);

const latestPriceStockIds = new Set(latestPriceRows.map((row) => row.stock_id));
const latestScoreStockIds = new Set(latestScoreRows.map((row) => row.stock_id));
const missingLatestPrice = activeListedEquities.filter((asset) => !latestPriceStockIds.has(asset.id));
const missingLatestScore = activeListedEquities.filter((asset) => !latestScoreStockIds.has(asset.id));

const coverage = {
  activeListedEquityCount: activeListedEquities.length,
  latestPriceCoverageCount: latestPriceStockIds.size,
  latestPriceCoveragePct: pct(latestPriceStockIds.size, activeListedEquities.length),
  latestPriceDate,
  latestScoreCoverageCount: latestScoreStockIds.size,
  latestScoreCoveragePct: pct(latestScoreStockIds.size, activeListedEquities.length),
  latestScoreDate,
  missingLatestPriceCount: missingLatestPrice.length,
  missingLatestPriceSample: sampleSymbols(missingLatestPrice),
  missingLatestScoreCount: missingLatestScore.length,
  missingLatestScoreSample: sampleSymbols(missingLatestScore),
  modelVersion: MODEL_VERSION,
  status:
    latestPriceDate &&
    latestScoreDate &&
    latestPriceDate === latestScoreDate &&
    missingLatestPrice.length === 0 &&
    missingLatestScore.length === 0
      ? "ok"
      : "review"
};

console.log(JSON.stringify({ coverage }, null, 2));

if (coverage.status !== "ok") {
  process.exitCode = 1;
}

async function readAllActiveListedEquities() {
  const pageSize = 1000;
  const rows = [];
  for (let offset = 0; ; offset += pageSize) {
    const batch = await restGet(
      `stocks?select=id,symbol,name&country=eq.TW&exchange=eq.TWSE&asset_type=eq.stock&is_active=eq.true&order=symbol.asc&offset=${offset}&limit=${pageSize}`
    );
    rows.push(...batch);
    if (batch.length < pageSize) return rows;
  }
}

async function latestDate(table, extraFilter = null) {
  const filter = extraFilter ? `&${extraFilter}` : "";
  const rows = await restGet(`${table}?select=trade_date${filter}&order=trade_date.desc&limit=1`);
  return rows?.[0]?.trade_date ?? null;
}

async function readLatestRows(table, stockIds, tradeDate, extraFilter = null) {
  const rows = [];
  for (let start = 0; start < stockIds.length; start += 100) {
    const ids = stockIds.slice(start, start + 100).join(",");
    const filter = extraFilter ? `&${extraFilter}` : "";
    rows.push(
      ...(await restGet(
        `${table}?select=stock_id&trade_date=eq.${encodeURIComponent(tradeDate)}${filter}&stock_id=in.(${ids})`
      ))
    );
  }
  return rows;
}

function pct(value, total) {
  return total > 0 ? Math.round((value / total) * 10000) / 100 : 0;
}

function sampleSymbols(rows) {
  return rows.slice(0, SAMPLE_LIMIT).map((row) => row.symbol);
}
