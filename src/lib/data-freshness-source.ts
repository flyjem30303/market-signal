import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  getSupabaseDataFreshnessSnapshot,
  type SupabaseDataFreshnessClient
} from "@/lib/repositories/supabase-data-freshness-repository";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type FreshnessSource = "mock" | "supabase";

function getFreshnessSource(): FreshnessSource {
  const source = process.env.DATA_FRESHNESS_SOURCE ?? "mock";

  if (source === "mock" || source === "supabase") {
    return source;
  }

  throw new Error(`Unsupported DATA_FRESHNESS_SOURCE: ${source}`);
}

export async function getDataFreshnessSnapshot(): Promise<DataFreshnessSnapshot> {
  const source = getFreshnessSource();

  if (source === "supabase") {
    const client = createServerSupabaseClient() as unknown as SupabaseDataFreshnessClient;
    return getSupabaseDataFreshnessSnapshot(client);
  }

  return buildMockDataFreshnessSnapshot();
}
