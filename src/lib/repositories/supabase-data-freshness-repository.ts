import {
  buildSupabaseDataFreshnessSnapshot,
  type DataFreshnessSnapshot,
  type DataRunFreshnessRow,
  type MarketFreshnessMetadata
} from "@/lib/data-freshness";

type SupabaseQueryError = {
  message: string;
};

type SupabaseQueryResult<T> = {
  data: T | null;
  error: SupabaseQueryError | null;
};

type MarketFreshnessMetadataRow = {
  currency: string;
  exchange: string;
  timezone: string;
};

type MarketExchangeQuery = {
  select(columns: string): {
    eq(column: string, value: string): {
      eq(column: string, value: string): {
        maybeSingle(): Promise<SupabaseQueryResult<MarketFreshnessMetadataRow>>;
      };
    };
  };
};

type DataRunsQuery = {
  select(columns: string): {
    in(column: string, values: string[]): {
      order(column: string, options: { ascending: boolean }): Promise<SupabaseQueryResult<DataRunFreshnessRow[]>>;
    };
  };
};

export type SupabaseDataFreshnessClient = {
  from(table: "market_exchanges"): MarketExchangeQuery;
  from(table: "data_runs"): DataRunsQuery;
};

type MarketKey = {
  country: string;
  exchange: string;
};

const requiredFreshnessTables = ["daily_prices", "daily_fundamentals"];

export async function getSupabaseDataFreshnessSnapshot(
  client: SupabaseDataFreshnessClient,
  marketKey: MarketKey = { country: "TW", exchange: "TWSE" }
): Promise<DataFreshnessSnapshot> {
  const market = await getMarketMetadata(client, marketKey);
  const dataRuns = await getLatestDataRuns(client);

  return buildSupabaseDataFreshnessSnapshot({
    dataRuns,
    market
  });
}

async function getMarketMetadata(
  client: SupabaseDataFreshnessClient,
  marketKey: MarketKey
): Promise<MarketFreshnessMetadata> {
  const { data, error } = await client
    .from("market_exchanges")
    .select("currency, exchange, timezone")
    .eq("country", marketKey.country)
    .eq("exchange", marketKey.exchange)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load market freshness metadata: ${error.message}`);
  }

  return {
    currency: data?.currency ?? "-",
    exchange: data?.exchange ?? marketKey.exchange,
    timezone: data?.timezone ?? "-"
  };
}

async function getLatestDataRuns(client: SupabaseDataFreshnessClient): Promise<DataRunFreshnessRow[]> {
  const { data, error } = await client
    .from("data_runs")
    .select("data_end_date, row_count, source_name, status, target_table")
    .in("target_table", requiredFreshnessTables)
    .order("finished_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load data freshness runs: ${error.message}`);
  }

  const latestByTable = new Map<string, DataRunFreshnessRow>();

  for (const row of data ?? []) {
    if (!latestByTable.has(row.target_table)) {
      latestByTable.set(row.target_table, row);
    }
  }

  return [...latestByTable.values()];
}
