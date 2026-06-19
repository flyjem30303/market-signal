const requiredTables = ["daily_prices", "daily_scores"];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Create .env.local or set the variable before running freshness check.`);
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

  if (!response.ok) {
    const message = json?.message ?? response.statusText;
    throw new Error(`${path} query failed: ${message}`);
  }

  return json;
}

async function restCount(path) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      prefer: "count=exact"
    },
    method: "HEAD"
  });

  if (!response.ok) {
    throw new Error(`${path} count failed: ${response.statusText}`);
  }

  const contentRange = response.headers.get("content-range");
  const total = contentRange?.split("/").at(-1);
  return total && total !== "*" ? Number(total) : 0;
}

async function getMarketMetadata() {
  const rows = await restGet("market_exchanges?select=currency,exchange,timezone&country=eq.TW&exchange=eq.TWSE&limit=1");
  const row = rows?.[0];

  return {
    currency: row?.currency ?? "TWD",
    exchange: row?.exchange ?? "TWSE",
    timezone: row?.timezone ?? "Asia/Taipei"
  };
}

async function getLatestTableSnapshot(table) {
  const latestRows = await restGet(`${table}?select=trade_date&order=trade_date.desc&limit=1`);
  const latestDate = latestRows?.[0]?.trade_date ?? null;

  if (!latestDate) {
    return {
      data_end_date: null,
      row_count: 0,
      source_name: "TWSE OpenAPI",
      status: "partial",
      target_table: table
    };
  }

  const count = await restCount(`${table}?select=trade_date&trade_date=eq.${encodeURIComponent(latestDate)}`);

  return {
    data_end_date: latestDate,
    row_count: count,
    source_name: "TWSE OpenAPI",
    status: count > 0 ? "success" : "partial",
    target_table: table
  };
}

function newestDate(dates) {
  if (dates.length === 0) return null;
  return dates.slice().sort().at(-1) ?? null;
}

function buildFreshnessSnapshot({ dataRuns, market }) {
  const missingTables = requiredTables.filter((table) => !dataRuns.some((run) => run.target_table === table));
  const hasFailed = dataRuns.some((row) => row.status === "failed");
  const hasPartial =
    missingTables.length > 0 || dataRuns.some((row) => row.status === "partial" || Number(row.row_count) <= 0);
  const state = hasFailed ? "unavailable" : hasPartial ? "partial" : "complete";
  const latestDate = newestDate(dataRuns.map((row) => row.data_end_date).filter(Boolean));
  const sourceNames = [...new Set(dataRuns.map((row) => row.source_name))].join(" / ");

  return {
    as_of_date: latestDate ?? "-",
    currency: market.currency,
    data_runs: dataRuns,
    is_mock: false,
    market: market.exchange,
    missing_tables: missingTables,
    score_source: "real",
    source_name: sourceNames || "TWSE OpenAPI",
    state,
    timezone: market.timezone
  };
}

const market = await getMarketMetadata();
const dataRuns = await Promise.all(requiredTables.map((table) => getLatestTableSnapshot(table)));
const freshness = buildFreshnessSnapshot({ dataRuns, market });

console.log(JSON.stringify({ freshness, status: freshness.state === "complete" ? "ok" : "review" }, null, 2));

if (freshness.state !== "complete") {
  process.exitCode = 1;
}
