import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  createFreshnessRepository,
  type FreshnessSource,
  type SupabaseRuntimeReads
} from "@/lib/repositories/freshness-repository";
import type { SupabaseDataFreshnessClient } from "@/lib/repositories/supabase-data-freshness-repository";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function getSupabaseRuntimeReads(): SupabaseRuntimeReads {
  return process.env.DATA_FRESHNESS_SUPABASE_READS === "enabled" ? "enabled" : "disabled";
}

function getFreshnessSource(): FreshnessSource {
  const source = process.env.DATA_FRESHNESS_SOURCE ?? "mock";

  if (source === "mock" || source === "supabase") {
    return source;
  }

  throw new Error(`Unsupported DATA_FRESHNESS_SOURCE: ${source}`);
}

export async function getDataFreshnessSnapshot(): Promise<DataFreshnessSnapshot> {
  const repository = createFreshnessRepository({
    createSupabaseClient: () => createServerSupabaseClient() as unknown as SupabaseDataFreshnessClient,
    source: getFreshnessSource(),
    supabaseRuntimeReads: getSupabaseRuntimeReads()
  });

  return repository.getSnapshot();
}
