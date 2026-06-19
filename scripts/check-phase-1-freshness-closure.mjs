const TWSE_BASE_URL = "https://openapi.twse.com.tw/v1";
const TARGET_SYMBOLS = ["TWII", "0050", "006208", "2330"];
const MODEL_VERSION = "phase1-price-derived-v1";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}.`);
  return value;
}

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/+$/, "");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const result = {
  ok: false,
  mode: "phase_1_freshness_closure",
  modelVersion: MODEL_VERSION,
  source: "TWSE OpenAPI",
  targets: [],
  problems: []
};

const [sourceLatestBySymbol, assets] = await Promise.all([readSourceLatestBySymbol(), readAssets()]);
const assetsBySymbol = new Map(assets.map((asset) => [asset.symbol.toUpperCase(), asset]));

for (const symbol of TARGET_SYMBOLS) {
  const asset = assetsBySymbol.get(symbol);
  if (!asset) {
    result.problems.push(`${symbol}:missing_asset`);
    result.targets.push({ symbol, status: "missing_asset" });
    continue;
  }

  const [latestPrice, latestScore] = await Promise.all([readLatestPrice(asset.id), readLatestScore(asset.id)]);
  const sourceDate = sourceLatestBySymbol.get(symbol) ?? null;
  const priceDate = latestPrice?.trade_date ?? null;
  const scoreDate = latestScore?.trade_date ?? null;
  const expectedStaleFlags = buildStaleDataFlags(priceDate, sourceDate);
  const actualStaleFlags = latestScore?.stale_data_flags ?? [];
  const statusProblems = [];

  if (!sourceDate) statusProblems.push("missing_source_latest_date");
  if (!priceDate) statusProblems.push("missing_daily_prices");
  if (!scoreDate) statusProblems.push("missing_daily_scores");
  if (sourceDate && priceDate && priceDate < sourceDate) statusProblems.push("daily_prices_not_at_source_latest_date");
  if (priceDate && scoreDate && scoreDate > priceDate) statusProblems.push("score_date_after_price_date");
  if (priceDate && scoreDate && scoreDate < priceDate) statusProblems.push("daily_scores_not_at_price_latest_date");
  if (!latestScore?.model_version || latestScore.model_version !== MODEL_VERSION) statusProblems.push("unexpected_score_model");
  if (expectedStaleFlags.join("|") !== actualStaleFlags.join("|")) statusProblems.push("stale_flags_mismatch");

  if (statusProblems.length > 0) {
    result.problems.push(...statusProblems.map((problem) => `${symbol}:${problem}`));
  }

  result.targets.push({
    symbol,
    assetType: asset.asset_type,
    isEtf: asset.is_etf,
    sourceLatestDate: sourceDate,
    latestPriceDate: priceDate,
    latestScoreDate: scoreDate,
    expectedStaleFlags,
    actualStaleFlags,
    status: statusProblems.length === 0 ? "ok" : "review"
  });
}

result.ok = result.problems.length === 0;
console.log(JSON.stringify(result, null, 2));

if (!result.ok) process.exitCode = 1;

async function readSourceLatestBySymbol() {
  const [stockRows, twiiRows] = await Promise.all([
    fetchTwseJson("/exchangeReport/STOCK_DAY_ALL"),
    fetchTwseJson("/indicesReport/MI_5MINS_HIST")
  ]);
  const map = new Map();

  for (const rawRow of stockRows) {
    const symbol = stringValue(rawRow.Code).toUpperCase();
    if (!TARGET_SYMBOLS.includes(symbol)) continue;
    const date = normalizeDate(rawRow.Date);
    if (date) map.set(symbol, newestDate([map.get(symbol), date].filter(Boolean)));
  }

  const latestTwii = newestDate(twiiRows.map((row) => normalizeDate(row.Date)).filter(Boolean));
  if (latestTwii) map.set("TWII", latestTwii);
  return map;
}

async function readAssets() {
  return restGet(
    `stocks?select=id,symbol,name,asset_type,is_etf&symbol=in.(${TARGET_SYMBOLS.join(",")})&order=symbol.asc`
  );
}

async function readLatestPrice(stockId) {
  const rows = await restGet(
    `daily_prices?select=trade_date&stock_id=eq.${stockId}&order=trade_date.desc&limit=1`
  );
  return rows[0] ?? null;
}

async function readLatestScore(stockId) {
  const rows = await restGet(
    `daily_scores?select=trade_date,model_version,stale_data_flags&stock_id=eq.${stockId}&order=trade_date.desc&limit=1`
  );
  return rows[0] ?? null;
}

async function fetchTwseJson(path) {
  const response = await fetch(`${TWSE_BASE_URL}${path}`, {
    headers: {
      accept: "application/json, text/plain;q=0.9, */*;q=0.1",
      "cache-control": "no-cache",
      "user-agent": "market-signal-phase1-freshness-check/1.0 (+https://github.com/flyjem30303/market-signal)"
    }
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`TWSE OpenAPI fetch failed for ${path}: ${response.status} ${response.statusText}`);
  const json = JSON.parse(text);
  if (!Array.isArray(json)) throw new Error(`TWSE OpenAPI ${path} returned a non-array payload.`);
  return json;
}

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

function buildStaleDataFlags(tradeDate, expectedDataDate) {
  if (!tradeDate || !expectedDataDate) return ["freshness_expected_date_unavailable"];
  if (tradeDate >= expectedDataDate) return [];
  const age = tradingDayDistance(tradeDate, expectedDataDate);
  if (age > 5) return ["severe_stale_gt_5_trading_days"];
  if (age > 2) return ["stale_gt_2_trading_days"];
  return [];
}

function tradingDayDistance(fromDate, toDate) {
  const start = parseIsoDate(fromDate);
  const end = parseIsoDate(toDate);
  if (!start || !end || start >= end) return 0;
  let count = 0;
  const cursor = new Date(start);
  cursor.setUTCDate(cursor.getUTCDate() + 1);
  while (cursor <= end) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) count += 1;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return count;
}

function parseIsoDate(value) {
  const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

function normalizeDate(value) {
  const raw = stringValue(value);
  if (!raw) return null;
  const normalized = raw.replace(/\//g, "-");
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
  const compactRoc = normalized.match(/^(\d{3})(\d{2})(\d{2})$/);
  if (compactRoc) return `${Number(compactRoc[1]) + 1911}-${compactRoc[2]}-${compactRoc[3]}`;
  const compactIso = normalized.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactIso) return `${compactIso[1]}-${compactIso[2]}-${compactIso[3]}`;
  const match = normalized.match(/^(\d{3})-(\d{2})-(\d{2})$/);
  if (match) return `${Number(match[1]) + 1911}-${match[2]}-${match[3]}`;
  return null;
}

function newestDate(dates) {
  return dates.slice().sort().at(-1) ?? null;
}

function stringValue(value) {
  return value == null ? "" : String(value).trim();
}
