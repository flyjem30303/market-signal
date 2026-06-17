const LIVE_AUTHORIZATION_ID = "CEO_STAGE_3_TWSE_OPENAPI_LIVE_FETCH_DRY_RUN_ONLY";
const allowLiveEnv = "TWSE_OPENAPI_ALLOW_LIVE_FETCH";

const args = new Set(process.argv.slice(2));
const fetchLive = args.has("--fetch-live");
const authorizationId = readArgValue("--authorization-id");

const boundary = {
  executionAuthority: "explicit_live_fetch_authorization_required",
  mode: "dry_run_only",
  publicDataSource: "mock",
  rawPayloadEcho: false,
  scoreSource: "mock",
  sqlExecution: false,
  supabaseWrite: false,
  rowPayloadEcho: false
};

if (fetchLive && (authorizationId !== LIVE_AUTHORIZATION_ID || process.env[allowLiveEnv] !== "true")) {
  console.log(
    JSON.stringify(
      {
        boundary,
        reason: "live_fetch_blocked_without_exact_authorization",
        status: "blocked"
      },
      null,
      2
    )
  );
  process.exit(1);
}

const sourceTimestamp = new Date().toISOString();
const routeRows = fetchLive ? await fetchLiveRows() : syntheticRowsByRoute();
const routeSummaries = Object.entries(routeRows).map(([routeId, rows]) => summarizeRoute(routeId, rows, sourceTimestamp));
const dryRun = {
  candidateRowCount: sum(routeSummaries, "candidateRowCount"),
  duplicateCount: sum(routeSummaries, "duplicateCount"),
  missingSessionCount: sum(routeSummaries, "missingSessionCount"),
  rawPayloadEcho: false,
  rejectedCount: sum(routeSummaries, "rejectedCount"),
  routeSummaries,
  rowPayloadEcho: false,
  sourceTimestamp
};

console.log(
  JSON.stringify(
    {
      boundary,
      dryRun,
      nextRoute: "twse_openapi_supabase_bounded_write_and_post_run_review",
      status: "ok"
    },
    null,
    2
  )
);

function syntheticRowsByRoute() {
  return {
    listedStockDailyClose: [
      { "日期": "2026-06-10", "股票代號": "2330", "股票名稱": "台積電", "收盤價": "980.00", "月平均價": "965.00" },
      { "日期": "2026-06-10", "股票代號": "2308", "股票名稱": "台達電", "收盤價": "355.50", "月平均價": "350.10" }
    ],
    listedStockDailyTradingInfo: [
      {
        "日期": "2026-06-10",
        "成交筆數": "52,300",
        "成交股數": "28,000,000",
        "成交金額": "27,440,000,000",
        "收盤價": "980.00",
        "最低價": "970.00",
        "最高價": "988.00",
        "漲跌價差": "5.00",
        "證券代號": "2330",
        "證券名稱": "台積電",
        "開盤價": "975.00"
      }
    ],
    twiiIndexHistory: [
      { "日期": "2026-06-10", "收盤指數": "23190.10", "最低指數": "23120.20", "最高指數": "23310.00", "開盤指數": "23255.50" },
      { "日期": "2026-06-11", "收盤指數": "23220.10", "最低指數": "23150.20", "最高指數": "23330.00", "開盤指數": "23200.50" }
    ]
  };
}

async function fetchLiveRows() {
  const routes = {
    listedStockDailyClose: "/exchangeReport/STOCK_DAY_AVG_ALL",
    listedStockDailyTradingInfo: "/exchangeReport/STOCK_DAY_ALL",
    twiiIndexHistory: "/indicesReport/MI_5MINS_HIST"
  };
  const rowsByRoute = {};
  for (const [routeId, path] of Object.entries(routes)) {
    const response = await fetch(`https://openapi.twse.com.tw/v1${path}`, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      rowsByRoute[routeId] = [];
      continue;
    }
    const json = await response.json();
    rowsByRoute[routeId] = Array.isArray(json) ? json : [];
  }
  return rowsByRoute;
}

function summarizeRoute(routeId, rows, sourceTimestamp) {
  const parsedRows = [];
  let rejectedCount = 0;
  const keyCounts = new Map();

  for (const row of rows) {
    const normalized = normalizeRow(routeId, row);
    if (!normalized) {
      rejectedCount += 1;
      continue;
    }
    const key = normalized.symbol ? `${normalized.tradeDate}:${normalized.symbol}` : normalized.tradeDate;
    keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
    parsedRows.push(normalized);
  }

  return {
    candidateRowCount: parsedRows.length,
    duplicateCount: [...keyCounts.values()].filter((count) => count > 1).length,
    missingSessionCount: countMissingSessions(parsedRows.map((row) => row.tradeDate)),
    rejectedCount,
    routeId,
    sourceTimestamp
  };
}

function normalizeRow(routeId, row) {
  const tradeDate = normalizeDate(pick(row, ["日期", "Date"]));
  const close = numberCell(pick(row, ["收盤指數", "收盤價", "ClosingIndex", "ClosingPrice"]));
  if (!tradeDate || close === null) return null;

  if (routeId === "twiiIndexHistory") {
    const open = numberCell(pick(row, ["開盤指數", "OpeningIndex"]));
    const high = numberCell(pick(row, ["最高指數", "HighestIndex"]));
    const low = numberCell(pick(row, ["最低指數", "LowestIndex"]));
    if (open === null || high === null || low === null) return null;
  }

  if (routeId === "listedStockDailyTradingInfo") {
    for (const aliases of [
      ["證券代號", "Code", "Symbol"],
      ["證券名稱", "Name"],
      ["開盤價", "OpeningPrice"],
      ["最高價", "HighestPrice"],
      ["最低價", "LowestPrice"],
      ["成交股數", "TradeVolume"],
      ["成交金額", "TradeValue"],
      ["成交筆數", "Transaction"]
    ]) {
      if (pick(row, aliases) === null) return null;
    }
  }

  if (routeId === "listedStockDailyClose") {
    for (const aliases of [
      ["股票代號", "Code", "Symbol"],
      ["股票名稱", "Name"]
    ]) {
      if (pick(row, aliases) === null) return null;
    }
  }

  return {
    close,
    symbol: pick(row, ["股票代號", "證券代號", "Code", "Symbol"]),
    tradeDate
  };
}

function normalizeDate(value) {
  if (value === null) return "";
  const text = String(value).trim();
  const roc = text.match(/^(\d{2,3})\/(\d{2})\/(\d{2})$/);
  if (roc) return formatDate(Number(roc[1]) + 1911, Number(roc[2]), Number(roc[3]));
  const ymd = text.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (ymd) return formatDate(Number(ymd[1]), Number(ymd[2]), Number(ymd[3]));
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return formatDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));
  return "";
}

function formatDate(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return "";
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function numberCell(value) {
  if (value === null) return null;
  const normalized = String(value).trim().replaceAll(",", "");
  if (normalized === "" || /^-+$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function pick(row, keys) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return null;
}

function countMissingSessions(tradeDates) {
  const ordered = [...new Set(tradeDates)].sort();
  let missing = 0;
  for (let index = 1; index < ordered.length; index += 1) {
    const previous = Date.parse(`${ordered[index - 1]}T00:00:00.000Z`);
    const current = Date.parse(`${ordered[index]}T00:00:00.000Z`);
    if (Number.isFinite(previous) && Number.isFinite(current)) {
      const gapDays = Math.round((current - previous) / (24 * 60 * 60 * 1000)) - 1;
      if (gapDays > 0) missing += gapDays;
    }
  }
  return missing;
}

function sum(rows, field) {
  return rows.reduce((total, row) => total + row[field], 0);
}

function readArgValue(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? (process.argv[index + 1] ?? "") : "";
}
