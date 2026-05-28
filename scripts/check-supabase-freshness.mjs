import { createClient } from "@supabase/supabase-js";

const requiredTables = ["daily_prices", "daily_fundamentals"];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Create .env.local or set the variable before running freshness check.`);
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

async function getMarketMetadata(client) {
  const { data, error } = await client
    .from("market_exchanges")
    .select("currency,exchange,timezone")
    .eq("country", "TW")
    .eq("exchange", "TWSE")
    .maybeSingle();

  if (error) throw new Error(`market_exchanges query failed: ${error.message}`);

  return {
    currency: data?.currency ?? "-",
    exchange: data?.exchange ?? "TWSE",
    timezone: data?.timezone ?? "-",
  };
}

async function getLatestDataRuns(client) {
  const { data, error } = await client
    .from("data_runs")
    .select("data_end_date,row_count,source_name,status,target_table")
    .in("target_table", requiredTables)
    .order("finished_at", { ascending: false });

  if (error) throw new Error(`data_runs query failed: ${error.message}`);

  const latestByTable = new Map();
  for (const row of data ?? []) {
    if (!latestByTable.has(row.target_table)) latestByTable.set(row.target_table, row);
  }

  return [...latestByTable.values()];
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
    source_name: sourceNames || "Supabase",
    state,
    timezone: market.timezone,
  };
}

const client = createServiceClient();
const market = await getMarketMetadata(client);
const dataRuns = await getLatestDataRuns(client);
const freshness = buildFreshnessSnapshot({ dataRuns, market });

console.log(JSON.stringify({ freshness, status: freshness.state === "complete" ? "ok" : "review" }, null, 2));

if (freshness.state !== "complete") {
  process.exitCode = 1;
}
