import { createClient } from "@supabase/supabase-js";

const etfTables = ["etf_profiles", "etf_daily_metrics", "etf_holdings"];
const expectedEtfSymbols = ["0050", "006208"];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Create .env.local or set the variable before running ETF schema check.`);
  }
  return value;
}

function createServiceClient() {
  return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      persistSession: false
    }
  });
}

async function countRows(client, table) {
  const { count, error } = await client.from(table).select("*", {
    count: "exact",
    head: true
  });

  if (error) {
    return {
      error: error.message,
      exists: false,
      table
    };
  }

  return {
    count: count ?? 0,
    exists: true,
    table
  };
}

async function getExpectedEtfs(client) {
  const { data, error } = await client
    .from("stocks")
    .select("asset_type,is_etf,name,symbol")
    .eq("country", "TW")
    .eq("exchange", "TWSE")
    .in("symbol", expectedEtfSymbols)
    .order("symbol", { ascending: true });

  if (error) throw new Error(`ETF stock identity query failed: ${error.message}`);
  return data ?? [];
}

const client = createServiceClient();
const tableStatus = await Promise.all(etfTables.map((table) => countRows(client, table)));
const expectedEtfs = await getExpectedEtfs(client);
const missingTables = tableStatus.filter((table) => !table.exists).map((table) => table.table);
const missingEtfSymbols = expectedEtfSymbols.filter((symbol) => !expectedEtfs.some((stock) => stock.symbol === symbol));
const misclassifiedEtfs = expectedEtfs.filter((stock) => stock.asset_type !== "etf" || !stock.is_etf);

const status =
  missingTables.length === 0 && missingEtfSymbols.length === 0 && misclassifiedEtfs.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      expected_etfs: expectedEtfs,
      missing_etf_symbols: missingEtfSymbols,
      missing_tables: missingTables,
      misclassified_etfs: misclassifiedEtfs,
      status,
      tables: tableStatus
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exitCode = 1;
}
