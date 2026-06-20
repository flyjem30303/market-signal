const MODEL_VERSION = "phase1-price-derived-v1";
const TWSE_STOCK_DAY_ALL_URL = "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL";
const LONG_ABSENT_TRADING_DAY_THRESHOLD = 10;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Create .env.local or set the variable before running metadata candidate check.`);
  return value;
}

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/+$/, "");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const activeListedEquities = await readAllActiveListedEquities();
const latestPriceDate = await latestDate("daily_prices");
const latestScoreDate = await latestDate("daily_scores", `model_version=eq.${MODEL_VERSION}`);
const latestPriceRows = latestPriceDate
  ? await readLatestRows("daily_prices", activeListedEquities.map((asset) => asset.id), latestPriceDate)
  : [];
const latestPriceStockIds = new Set(latestPriceRows.map((row) => row.stock_id));
const gapAssets = activeListedEquities.filter((asset) => !latestPriceStockIds.has(asset.id));
const twseRowsByCode = await fetchTwseLatestRowsByCode();

const candidates = await Promise.all(
  gapAssets.map(async (asset) => {
    const [lastPrice, lastScore] = await Promise.all([
      latestRowForAsset("daily_prices", asset.id),
      latestRowForAsset("daily_scores", asset.id, `model_version=eq.${MODEL_VERSION}`)
    ]);
    const twseRow = twseRowsByCode.get(asset.symbol) ?? null;
    const reason = classifyReason(twseRow);
    const tradingDayLag = tradingDayDistance(lastPrice?.trade_date, latestPriceDate);
    return {
      action: actionFor({ reason, tradingDayLag }),
      lastPriceDate: lastPrice?.trade_date ?? null,
      lastScoreDate: lastScore?.trade_date ?? null,
      name: asset.name,
      reason,
      stockId: asset.id,
      symbol: asset.symbol,
      tradingDayLag
    };
  })
);

const result = {
  latestPriceDate,
  latestScoreDate,
  longAbsentTradingDayThreshold: LONG_ABSENT_TRADING_DAY_THRESHOLD,
  modelVersion: MODEL_VERSION,
  source: "TWSE OpenAPI STOCK_DAY_ALL code-presence only",
  status: "review",
  summary: {
    activeListedEquityCount: activeListedEquities.length,
    candidateInactiveMetadataReviewCount: candidates.filter((row) => row.action === "candidate_inactive_metadata_review").length,
    gapCount: candidates.length,
    keepActiveNoCloseLatestPayloadCount: candidates.filter((row) => row.action === "keep_active_no_close_latest_payload").length
  },
  candidates
};

console.log(JSON.stringify(result, null, 2));

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

async function readAllActiveListedEquities() {
  const pageSize = 1000;
  const rows = [];
  for (let offset = 0; ; offset += pageSize) {
    const batch = await restGet(
      `stocks?select=id,symbol,name&country=eq.TW&exchange=eq.TWSE&asset_type=eq.stock&is_active=eq.true&order=symbol.asc&offset=${offset}&limit=${pageSize}`
    );
    rows.push(...batch.map((row) => ({ ...row, symbol: String(row.symbol).toUpperCase() })));
    if (batch.length < pageSize) return rows;
  }
}

async function latestDate(table, extraFilter = null) {
  const filter = extraFilter ? `&${extraFilter}` : "";
  const rows = await restGet(`${table}?select=trade_date${filter}&order=trade_date.desc&limit=1`);
  return rows?.[0]?.trade_date ?? null;
}

async function readLatestRows(table, stockIds, tradeDate) {
  const rows = [];
  for (let start = 0; start < stockIds.length; start += 100) {
    const ids = stockIds.slice(start, start + 100).join(",");
    rows.push(
      ...(await restGet(
        `${table}?select=stock_id&trade_date=eq.${encodeURIComponent(tradeDate)}&stock_id=in.(${ids})`
      ))
    );
  }
  return rows;
}

async function latestRowForAsset(table, stockId, extraFilter = null) {
  const filter = extraFilter ? `&${extraFilter}` : "";
  const rows = await restGet(
    `${table}?select=trade_date&stock_id=eq.${encodeURIComponent(stockId)}${filter}&order=trade_date.desc&limit=1`
  );
  return rows?.[0] ?? null;
}

async function fetchTwseLatestRowsByCode() {
  const response = await fetch(TWSE_STOCK_DAY_ALL_URL, {
    headers: {
      accept: "application/json, text/plain;q=0.9, */*;q=0.1",
      "cache-control": "no-cache",
      "user-agent": "market-signal-phase1.1-metadata-candidate-check/1.0 (+https://github.com/flyjem30303/market-signal)"
    }
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`TWSE code presence fetch failed: ${response.status} ${response.statusText}`);
  if (/^\s*</u.test(text)) throw new Error("TWSE code presence fetch returned an HTML payload.");
  const rows = JSON.parse(text);
  if (!Array.isArray(rows)) throw new Error("TWSE code presence fetch returned a non-array payload.");
  return new Map(
    rows
      .map((row) => [String(row.Code ?? "").trim().toUpperCase(), row])
      .filter(([code]) => Boolean(code))
  );
}

function classifyReason(twseRow) {
  if (!twseRow) return "not_present_in_latest_twse_payload";
  return numberValue(twseRow.ClosingPrice) == null
    ? "present_without_parseable_close"
    : "parser_or_mapping_gap_candidate";
}

function actionFor({ reason, tradingDayLag }) {
  if (reason === "present_without_parseable_close") return "keep_active_no_close_latest_payload";
  if (reason === "not_present_in_latest_twse_payload" && tradingDayLag > LONG_ABSENT_TRADING_DAY_THRESHOLD) {
    return "candidate_inactive_metadata_review";
  }
  return "keep_active_monitor";
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

function stringValue(value) {
  return value == null ? "" : String(value).trim();
}

function numberValue(value) {
  const raw = stringValue(value).replace(/,/g, "");
  if (!raw || raw === "--") return null;
  const number = Number(raw);
  return Number.isFinite(number) ? number : null;
}
