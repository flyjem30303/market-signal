const MODEL_VERSION = "phase1-price-derived-v1";
const TWSE_STOCK_DAY_ALL_URL = "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Create .env.local or set the variable before running gap classification.`);
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
const latestPriceRows = latestPriceDate
  ? await readLatestRows("daily_prices", activeListedEquities.map((asset) => asset.id), latestPriceDate)
  : [];
const latestPriceStockIds = new Set(latestPriceRows.map((row) => row.stock_id));
const gapAssets = activeListedEquities.filter((asset) => !latestPriceStockIds.has(asset.id));
const twseRowsByCode = await fetchTwseLatestRowsByCode();

const classifications = await Promise.all(
  gapAssets.map(async (asset) => {
    const [lastPrice, lastScore] = await Promise.all([
      latestRowForAsset("daily_prices", asset.id),
      latestRowForAsset("daily_scores", asset.id, `model_version=eq.${MODEL_VERSION}`)
    ]);
    const twseRow = twseRowsByCode.get(asset.symbol) ?? null;
    const presentInLatestTwsePayload = Boolean(twseRow);
    const hasParseableTradeDate = Boolean(normalizeDate(twseRow?.Date));
    const hasParseableClose = numberValue(twseRow?.ClosingPrice) != null;
    return {
      classification: classifyGap({
        hasParseableClose,
        hasParseableTradeDate,
        presentInLatestTwsePayload
      }),
      hasParseableClose,
      hasParseableTradeDate,
      lastPriceDate: lastPrice?.trade_date ?? null,
      lastScoreDate: lastScore?.trade_date ?? null,
      name: asset.name,
      presentInLatestTwsePayload,
      stockId: asset.id,
      symbol: asset.symbol
    };
  })
);

const result = {
  latestPriceDate,
  latestScoreDate,
  modelVersion: MODEL_VERSION,
  source: "TWSE OpenAPI STOCK_DAY_ALL code-presence only",
  status: classifications.length === 0 ? "ok" : "review",
  summary: {
    activeListedEquityCount: activeListedEquities.length,
    gapCount: classifications.length,
    notPresentInLatestTwsePayload: classifications.filter((row) => !row.presentInLatestTwsePayload).length,
    parserOrMappingGapCandidates: classifications.filter((row) => row.classification === "parser_or_mapping_gap_candidate").length,
    presentButNoParseableClose: classifications.filter((row) => row.classification === "present_without_parseable_close").length,
    presentButNoParseableTradeDate: classifications.filter((row) => row.classification === "present_without_parseable_trade_date").length
  },
  classifications
};

console.log(JSON.stringify(result, null, 2));

if (classifications.some((row) => row.classification === "parser_or_mapping_gap_candidate")) {
  process.exitCode = 1;
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
      "user-agent": "market-signal-phase1.1-gap-classifier/1.0 (+https://github.com/flyjem30303/market-signal)"
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

function classifyGap({ hasParseableClose, hasParseableTradeDate, presentInLatestTwsePayload }) {
  if (!presentInLatestTwsePayload) return "not_present_in_latest_twse_payload";
  if (!hasParseableTradeDate) return "present_without_parseable_trade_date";
  if (!hasParseableClose) return "present_without_parseable_close";
  return "parser_or_mapping_gap_candidate";
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
