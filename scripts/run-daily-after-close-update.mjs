const MODEL_VERSION = "phase1-price-derived-v1";
const PAGE_SIZE = 1000;
const TWSE_BASE_URL = "https://openapi.twse.com.tw/v1";
const TWSE_MI_INDEX_URL = "https://www.twse.com.tw/exchangeReport/MI_INDEX";

const args = new Set(process.argv.slice(2));
const writeEnabled = args.has("--write") || process.env.DAILY_AFTER_CLOSE_WRITE === "enabled";
const fallbackDateArg = process.argv.find((arg) => arg.startsWith("--fallback-date="));
const requestedFallbackDate = fallbackDateArg ? fallbackDateArg.slice("--fallback-date=".length).trim() : null;
const fallbackSearchStartDate = requestedFallbackDate || taipeiToday();
const symbolArg = process.argv.find((arg) => arg.startsWith("--symbols="));
const requestedSymbols = symbolArg
  ? new Set(
      symbolArg
        .slice("--symbols=".length)
        .split(",")
        .map((symbol) => symbol.trim().toUpperCase())
        .filter(Boolean)
    )
  : null;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}.`);
  return value;
}

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/+$/, "");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const result = {
  dryRun: !writeEnabled,
  modelVersion: MODEL_VERSION,
  scope: requestedSymbols ? "requested_symbols" : "phase1_twii_listed_equity_and_etf_daily_update",
  source: "TWSE OpenAPI",
  status: "blocked",
  twseRowsRead: 0,
  activeAssetsRead: 0,
  priceRowsPrepared: 0,
  priceRowsWritten: 0,
  scoreRowsPrepared: 0,
  scoreRowsWritten: 0,
  skippedRows: 0,
  miIndexFallbackUsed: false,
  miIndexFallbackDate: null,
  miIndexRowsRead: 0,
  warnings: []
};

const [assets, twseStockRows, twiiResult] = await Promise.all([
  readActiveAssets(),
  fetchTwseJson("/exchangeReport/STOCK_DAY_ALL"),
  fetchOptionalTwseJson("/indicesReport/MI_5MINS_HIST", "twii_index_source_unavailable")
]);
const twiiRows = twiiResult.rows;
if (twiiResult.warning) result.warnings.push(twiiResult.warning);

result.activeAssetsRead = assets.length;
result.twseRowsRead = twseStockRows.length + twiiRows.length;

let priceRows = buildPriceRows({ assets, twiiRows, twseStockRows });
const openApiDataDate = newestDate(priceRows.map((row) => row.trade_date));
result.openApiDataDate = openApiDataDate;

if (
  fallbackSearchStartDate &&
  isIsoDate(fallbackSearchStartDate) &&
  (!openApiDataDate || openApiDataDate < fallbackSearchStartDate)
) {
  const fallback = await fetchLatestMiIndexDate({
    openApiDataDate,
    searchStartDate: fallbackSearchStartDate,
    strictDate: requestedFallbackDate
  });
  result.miIndexFallbackDate = fallback.tradeDate;
  result.miIndexRowsRead = fallback.sourceRowsRead;
  if (fallback.status === "ok") {
    const fallbackRows = buildMiIndexPriceRows({ assets, miIndexRows: fallback.rows, tradeDate: fallback.tradeDate });
    if (fallbackRows.length > 0) {
      priceRows = mergeSameDayRows(priceRows, fallbackRows);
      result.source = "TWSE MI_INDEX fallback";
      result.miIndexFallbackUsed = true;
    } else {
      result.warnings.push("mi_index_fallback_no_matching_assets");
    }
  } else {
    result.warnings.push(`mi_index_fallback_${fallback.status}`);
  }
}

result.dataDate = newestDate(priceRows.map((row) => row.trade_date));
priceRows = priceRows.filter((row) => row.trade_date === result.dataDate);
result.priceRowsPrepared = priceRows.length;
result.skippedRows = result.twseRowsRead + result.miIndexRowsRead - priceRows.length;

if (priceRows.length === 0) {
  result.status = "blocked_no_matching_price_rows";
  console.log(JSON.stringify(result, null, 2));
  process.exit(1);
}

const existingPrices = await readExistingPrices(priceRows.map((row) => row.stock_id));
const mergedPrices = mergePrices(existingPrices, priceRows);

if (writeEnabled && requestedFallbackDate && isIsoDate(requestedFallbackDate) && result.dataDate < requestedFallbackDate) {
  result.status = "blocked_stale_source_no_fresh_fallback";
  console.log(JSON.stringify(result, null, 2));
  process.exit(1);
}

const scoreRows = buildScoreRows(mergedPrices, new Set(priceRows.map((row) => `${row.stock_id}:${row.trade_date}`)), {
  assetsById: new Map(assets.map((asset) => [asset.id, asset])),
  expectedDataDate: result.dataDate
});
result.scoreRowsPrepared = scoreRows.length;

if (!writeEnabled) {
  result.status = "dry_run_ok";
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

await upsertRows("daily_prices", priceRows, "stock_id,trade_date");
result.priceRowsWritten = priceRows.length;

await upsertRows("daily_scores", scoreRows, "stock_id,trade_date,model_version");
result.scoreRowsWritten = scoreRows.length;

await insertDataRun("daily_prices", priceRows.length, result.dataDate);
await insertDataRun("daily_scores", scoreRows.length, result.dataDate);

result.status = "ok";
console.log(JSON.stringify(result, null, 2));

async function fetchTwseJson(path) {
  const response = await fetchWithRetry(`${TWSE_BASE_URL}${path}`, {
    headers: {
      accept: "application/json, text/plain;q=0.9, */*;q=0.1",
      "cache-control": "no-cache",
      "user-agent": "market-signal-phase1-daily-update/1.0 (+https://github.com/flyjem30303/market-signal)"
    }
  });

  const contentType = response.headers.get("content-type") ?? "unknown";
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`TWSE OpenAPI fetch failed for ${path}: ${response.status} ${response.statusText}`);
  }

  if (/^\s*</u.test(text) || !/json|javascript|text\/plain/i.test(contentType)) {
    throw new Error(
      `TWSE OpenAPI ${path} returned a non-JSON response: status=${response.status}, contentType=${contentType}, bodyLength=${text.length}`
    );
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch (error) {
    throw new Error(
      `TWSE OpenAPI ${path} JSON parse failed: status=${response.status}, contentType=${contentType}, bodyLength=${text.length}`
    );
  }

  if (!Array.isArray(json)) throw new Error(`TWSE OpenAPI ${path} returned a non-array payload.`);
  return json;
}

async function fetchOptionalTwseJson(path, warning) {
  try {
    return { rows: await fetchTwseJson(path), warning: null };
  } catch {
    return { rows: [], warning };
  }
}

async function fetchMiIndexDate(tradeDate) {
  const url = `${TWSE_MI_INDEX_URL}?${new URLSearchParams({
    response: "json",
    date: tradeDate.replaceAll("-", ""),
    type: "ALLBUT0999"
  }).toString()}`;

  let response;
  try {
    response = await fetchWithRetry(url, {
      headers: {
        accept: "application/json, text/plain;q=0.9, */*;q=0.1",
        "cache-control": "no-cache",
        "user-agent": "market-signal-phase1-daily-update-mi-index-fallback/1.0"
      }
    });
  } catch {
    return { status: "network_error", rows: [], sourceRowsRead: 0 };
  }

  if (!response.ok) return { status: "http_error", rows: [], sourceRowsRead: 0 };

  let payload;
  try {
    payload = await response.json();
  } catch {
    return { status: "json_parse_error", rows: [], sourceRowsRead: 0 };
  }

  if (payload?.stat !== "OK" || !Array.isArray(payload?.tables)) {
    return { status: "source_not_ok", rows: [], sourceRowsRead: 0 };
  }

  const stockTable = payload.tables.find(
    (table) => typeof table?.title === "string" && table.title.includes("每日收盤行情") && Array.isArray(table?.data)
  );
  const twiiTable = payload.tables.find(
    (table) => typeof table?.title === "string" && table.title.includes("價格指數(臺灣證券交易所)") && Array.isArray(table?.data)
  );

  if (!stockTable && !twiiTable) return { status: "table_not_found", rows: [], sourceRowsRead: 0 };

  const rows = [
    ...(stockTable?.data ?? []).map(parseMiIndexStockRow).filter(Boolean),
    ...(twiiTable?.data ?? []).map(parseMiIndexTwiiRow).filter(Boolean)
  ];
  return {
    status: rows.length > 0 ? "ok" : "no_parseable_rows",
    rows,
    sourceRowsRead: (stockTable?.data?.length ?? 0) + (twiiTable?.data?.length ?? 0)
  };
}

async function fetchLatestMiIndexDate({ openApiDataDate, searchStartDate, strictDate }) {
  const candidateDates = strictDate ? [strictDate] : recentIsoDates(searchStartDate, 7);
  let fallback = { status: "not_checked", rows: [], sourceRowsRead: 0, tradeDate: searchStartDate };

  for (const tradeDate of candidateDates) {
    if (openApiDataDate && tradeDate <= openApiDataDate) break;
    fallback = { ...(await fetchMiIndexDate(tradeDate)), tradeDate };
    if (fallback.status === "ok") return fallback;
  }

  return fallback;
}

async function fetchWithRetry(url, options) {
  const delays = [750, 2000, 5000];
  let lastError = null;

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.ok || attempt >= delays.length) return response;
      lastError = new Error(`fetch_non_ok_${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt >= delays.length) break;
    }

    await sleep(delays[attempt]);
  }

  throw lastError ?? new Error("fetch_failed");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function restWrite(path, rows, onConflict) {
  if (rows.length === 0) return;
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}?on_conflict=${encodeURIComponent(onConflict)}`, {
    body: JSON.stringify(rows),
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      "content-type": "application/json",
      prefer: "resolution=merge-duplicates,return=minimal"
    },
    method: "POST"
  });

  if (!response.ok) {
    const text = await response.text();
    const json = text ? JSON.parse(text) : null;
    throw new Error(`${path} upsert failed: ${json?.message ?? response.statusText}`);
  }
}

async function readActiveAssets() {
  const rows = [];

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const batch = await restGet(
      `stocks?select=id,symbol,name,asset_type,is_etf&country=eq.TW&exchange=eq.TWSE&is_active=eq.true&order=symbol.asc&offset=${offset}&limit=${PAGE_SIZE}`
    );
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return rows;
  }
}

async function readExistingPrices(stockIds) {
  const uniqueIds = [...new Set(stockIds)];
  const rows = [];

  for (let start = 0; start < uniqueIds.length; start += 100) {
    const ids = uniqueIds.slice(start, start + 100).join(",");
    rows.push(
      ...(await restGet(
        `daily_prices?select=stock_id,trade_date,open,high,low,close,volume,turnover&stock_id=in.(${ids})&order=stock_id.asc&order=trade_date.asc`
      ))
    );
  }

  return rows;
}

async function upsertRows(table, rows, onConflict) {
  for (let start = 0; start < rows.length; start += PAGE_SIZE) {
    await restWrite(table, rows.slice(start, start + PAGE_SIZE), onConflict);
  }
}

async function insertDataRun(targetTable, rowCount, dataDate) {
  const now = new Date().toISOString();
  const run = {
    data_end_date: dataDate,
    data_start_date: dataDate,
    error_message: null,
    finished_at: now,
    notes:
      "Daily after-close update from TWSE OpenAPI. Phase 1.1 scope: TWII + active TWSE listed stocks + active TWSE listed ETFs.",
    row_count: rowCount,
    run_key: `daily-after-close-${targetTable}-${dataDate}-${now}`,
    source_name: "TWSE OpenAPI",
    source_url: TWSE_BASE_URL,
    started_at: now,
    status: "success",
    target_table: targetTable
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/data_runs`, {
    body: JSON.stringify(run),
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      "content-type": "application/json",
      prefer: "return=minimal"
    },
    method: "POST"
  });

  if (!response.ok) {
    const text = await response.text();
    const json = text ? JSON.parse(text) : null;
    throw new Error(`data_runs insert failed for ${targetTable}: ${json?.message ?? response.statusText}`);
  }
}

function buildPriceRows({ assets, twiiRows, twseStockRows }) {
  const assetsBySymbol = new Map(assets.map((asset) => [asset.symbol.toUpperCase(), asset]));
  const rows = [];

  const latestTwii = twiiRows
    .map(toTwiiPriceCandidate)
    .filter(Boolean)
    .sort((left, right) => left.trade_date.localeCompare(right.trade_date))
    .at(-1);
  const twiiAsset = assetsBySymbol.get("TWII");
  if (twiiAsset && latestTwii && acceptsSymbol("TWII")) {
    rows.push({ ...latestTwii, stock_id: twiiAsset.id });
  }

  for (const rawRow of twseStockRows) {
    const symbol = stringValue(rawRow.Code).toUpperCase();
    if (!symbol || !acceptsSymbol(symbol)) continue;
    const asset = assetsBySymbol.get(symbol);
    if (!asset) continue;
    if (asset.asset_type !== "stock" && asset.asset_type !== "etf" && !asset.is_etf) continue;
    const row = toStockPriceCandidate(rawRow, asset.id);
    if (row) rows.push(row);
  }

  return rows;
}

function buildMiIndexPriceRows({ assets, miIndexRows, tradeDate }) {
  const assetsBySymbol = new Map(assets.map((asset) => [asset.symbol.toUpperCase(), asset]));
  const rows = [];
  for (const sourceRow of miIndexRows) {
    if (!acceptsSymbol(sourceRow.symbol)) continue;
    const asset = assetsBySymbol.get(sourceRow.symbol);
    if (!asset) continue;
    if (sourceRow.symbol !== "TWII") {
      if (asset.asset_type !== "stock" && asset.asset_type !== "etf" && !asset.is_etf) continue;
    }
    rows.push({
      close: sourceRow.close,
      high: sourceRow.high,
      low: sourceRow.low,
      open: sourceRow.open,
      stock_id: asset.id,
      trade_date: tradeDate,
      turnover: sourceRow.turnover,
      volume: sourceRow.volume
    });
  }
  return rows;
}

function mergeSameDayRows(baseRows, fallbackRows) {
  const map = new Map();
  for (const row of baseRows) map.set(`${row.stock_id}:${row.trade_date}`, row);
  for (const row of fallbackRows) map.set(`${row.stock_id}:${row.trade_date}`, row);
  return [...map.values()];
}

function acceptsSymbol(symbol) {
  return !requestedSymbols || requestedSymbols.has(symbol);
}

function toStockPriceCandidate(rawRow, stockId) {
  const tradeDate = normalizeDate(rawRow.Date);
  const close = numberValue(rawRow.ClosingPrice);
  if (!tradeDate || close == null) return null;

  return {
    close,
    high: numberValue(rawRow.HighestPrice),
    low: numberValue(rawRow.LowestPrice),
    open: numberValue(rawRow.OpeningPrice),
    stock_id: stockId,
    trade_date: tradeDate,
    turnover: integerValue(rawRow.TradeValue),
    volume: integerValue(rawRow.TradeVolume)
  };
}

function toTwiiPriceCandidate(rawRow) {
  const tradeDate = normalizeDate(rawRow.Date);
  const close = numberValue(rawRow.ClosingIndex);
  if (!tradeDate || close == null) return null;

  return {
    close,
    high: numberValue(rawRow.HighestIndex),
    low: numberValue(rawRow.LowestIndex),
    open: numberValue(rawRow.OpeningIndex),
    trade_date: tradeDate,
    turnover: null,
    volume: null
  };
}

function parseMiIndexStockRow(row) {
  if (!Array.isArray(row) || row.length < 9) return null;
  const symbol = stringValue(row[0]).toUpperCase();
  const close = numberValue(row[8]);
  if (!symbol || close == null) return null;
  return {
    symbol,
    close,
    high: numberValue(row[6]),
    low: numberValue(row[7]),
    open: numberValue(row[5]),
    turnover: integerValue(row[4]),
    volume: integerValue(row[2])
  };
}

function parseMiIndexTwiiRow(row) {
  if (!Array.isArray(row) || row.length < 2) return null;
  const label = stringValue(row[0]);
  if (label !== "發行量加權股價指數") return null;
  const close = numberValue(row[1]);
  if (close == null) return null;
  return {
    symbol: "TWII",
    close,
    high: null,
    low: null,
    open: null,
    turnover: null,
    volume: null
  };
}

function mergePrices(existingRows, newRows) {
  const map = new Map();
  for (const row of existingRows) map.set(`${row.stock_id}:${row.trade_date}`, row);
  for (const row of newRows) map.set(`${row.stock_id}:${row.trade_date}`, row);
  return [...map.values()].sort((left, right) =>
    left.stock_id === right.stock_id
      ? left.trade_date.localeCompare(right.trade_date)
      : left.stock_id.localeCompare(right.stock_id)
  );
}

function buildScoreRows(prices, targetKeys, { assetsById, expectedDataDate }) {
  const byStock = groupBy(prices, (row) => row.stock_id);
  const rows = [];
  const lastUpdatedAt = new Date().toISOString();

  for (const series of byStock.values()) {
    const ordered = series
      .filter((row) => row.close != null)
      .sort((left, right) => left.trade_date.localeCompare(right.trade_date));

    for (let index = 0; index < ordered.length; index += 1) {
      const price = ordered[index];
      if (!targetKeys.has(`${price.stock_id}:${price.trade_date}`)) continue;
      const score = buildScore(ordered.slice(0, index + 1));
      const asset = assetsById.get(price.stock_id);
      rows.push({
        composite_score: score.compositeScore,
        data_quality_grade: score.dataQualityGrade,
        data_quality_score: score.dataQualityScore,
        health_score: score.healthScore,
        last_updated_at: lastUpdatedAt,
        missing_module_flags: buildMissingModuleFlags(asset),
        model_version: MODEL_VERSION,
        risk_score: score.riskScore,
        signal: score.signal,
        stale_data_flags: buildStaleDataFlags(price.trade_date, expectedDataDate),
        stock_id: price.stock_id,
        trade_date: price.trade_date
      });
    }
  }

  return rows;
}

function buildMissingModuleFlags(asset) {
  const flags = ["news_score_not_included_phase_1"];
  if (asset?.is_etf || asset?.asset_type === "etf") {
    flags.push("etf_full_universe_and_deep_etf_modules_phase_1_1");
  }
  return flags;
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

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ""));
}

function taipeiToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function recentIsoDates(startDate, days) {
  const start = parseIsoDate(startDate);
  if (!start) return [];
  const dates = [];
  const cursor = new Date(start);
  for (let index = 0; index < days; index += 1) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return dates;
}

function buildScore(series) {
  const latest = series.at(-1);
  const previous = series.at(-2) ?? latest;
  const closes = series.map((point) => point.close).filter((value) => value != null);
  const volumes = series.map((point) => point.volume ?? 0);
  const returns = series.slice(1).map((point, index) => pctChange(point.close, series[index].close));
  const movingAverage = average(closes.slice(-Math.min(20, closes.length)));
  const averageClose = average(closes);
  const previousAverageVolume = average(volumes.slice(0, -1).slice(-Math.min(20, Math.max(1, volumes.length - 1))));
  const dailyChangePct = pctChange(latest.close, previous.close);

  const components = {
    dailyChangeScore: clampScore(50 + dailyChangePct * 8),
    dispersionScore: clampScore(100 - Math.abs((latest.close - averageClose) / averageClose) * 220),
    movingAveragePostureScore: clampScore(50 + ((latest.close - movingAverage) / movingAverage) * 180),
    volatilityScore: clampScore(100 - standardDeviation(returns) * 18),
    volumeChangeScore: clampScore(50 + pctChange(latest.volume ?? 0, previousAverageVolume) * 2)
  };

  const compositeScore = clampScore(
    components.dailyChangeScore * 0.24 +
      components.movingAveragePostureScore * 0.24 +
      components.volumeChangeScore * 0.16 +
      components.volatilityScore * 0.2 +
      components.dispersionScore * 0.16
  );
  const riskScore = clampScore(
    100 -
      (components.volatilityScore * 0.42 +
        components.movingAveragePostureScore * 0.24 +
        components.dailyChangeScore * 0.2 +
        components.dispersionScore * 0.14)
  );
  const healthScore = clampScore(compositeScore * 0.72 + components.volatilityScore * 0.16 + components.volumeChangeScore * 0.12);
  const dataQualityScore = latest.open != null && latest.high != null && latest.low != null && latest.volume != null ? 82 : 70;

  return {
    compositeScore,
    dataQualityGrade: dataQualityScore >= 80 ? "B" : "C",
    dataQualityScore,
    healthScore,
    riskScore,
    signal: signalFor(compositeScore)
  };
}

function signalFor(score) {
  if (score >= 75) return "green";
  if (score >= 62) return "yellow";
  if (score >= 48) return "orange";
  if (score >= 34) return "red";
  return "deep-red";
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

function stringValue(value) {
  return value == null ? "" : String(value).trim();
}

function numberValue(value) {
  const raw = stringValue(value).replace(/,/g, "");
  if (!raw || raw === "--") return null;
  const number = Number(raw);
  return Number.isFinite(number) ? number : null;
}

function integerValue(value) {
  const number = numberValue(value);
  return number == null ? null : Math.round(number);
}

function pctChange(value, base) {
  return base > 0 ? ((value - base) / base) * 100 : 0;
}

function average(values) {
  return values.length === 0 ? 0 : values.reduce((total, value) => total + value, 0) / values.length;
}

function standardDeviation(values) {
  if (values.length === 0) return 0;
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance);
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number.isFinite(value) ? value : 50)));
}

function newestDate(dates) {
  return dates.slice().sort().at(-1) ?? null;
}

function groupBy(items, getKey) {
  const map = new Map();
  for (const item of items) {
    const key = getKey(item);
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return map;
}
