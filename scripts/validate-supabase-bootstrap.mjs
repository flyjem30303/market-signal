import { createClient } from "@supabase/supabase-js";

const expectedMinimums = {
  data_runs: 4,
  daily_fundamentals: 1000,
  daily_prices: 1000,
  market_exchanges: 4,
  stocks: 1000,
};

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Create .env.local or set the variable before running validation.`);
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

async function countRows(client, table) {
  const { count, error } = await client.from(table).select("*", {
    count: "exact",
    head: true,
  });

  if (error) throw new Error(`${table} count failed: ${error.message}`);
  return count ?? 0;
}

async function latestDate(client, table) {
  const { data, error } = await client
    .from(table)
    .select("trade_date")
    .order("trade_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`${table} latest date failed: ${error.message}`);
  return data?.trade_date ?? null;
}

async function getDataRuns(client) {
  const { data, error } = await client
    .from("data_runs")
    .select("target_table,status,row_count,data_end_date,source_name")
    .order("target_table", { ascending: true });

  if (error) throw new Error(`data_runs query failed: ${error.message}`);
  return data ?? [];
}

function assertMinimum(table, count) {
  const minimum = expectedMinimums[table];
  if (count < minimum) {
    throw new Error(`${table} count ${count} is below expected minimum ${minimum}`);
  }
}

const client = createServiceClient();

const counts = {};
for (const table of Object.keys(expectedMinimums)) {
  counts[table] = await countRows(client, table);
  assertMinimum(table, counts[table]);
}

const latestPriceDate = await latestDate(client, "daily_prices");
const latestFundamentalDate = await latestDate(client, "daily_fundamentals");
const dataRuns = await getDataRuns(client);
const failedRuns = dataRuns.filter((run) => run.status !== "success");

if (!latestPriceDate) throw new Error("daily_prices has no latest trade date");
if (!latestFundamentalDate) throw new Error("daily_fundamentals has no latest trade date");
if (failedRuns.length > 0) {
  throw new Error(`data_runs contains non-success runs: ${JSON.stringify(failedRuns)}`);
}

console.log(
  JSON.stringify(
    {
      counts,
      data_runs: dataRuns,
      latest_fundamental_date: latestFundamentalDate,
      latest_price_date: latestPriceDate,
      status: "ok",
    },
    null,
    2,
  ),
);
