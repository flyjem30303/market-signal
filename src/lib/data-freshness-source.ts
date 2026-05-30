import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  createFreshnessRepository,
  type FreshnessSource,
  type SupabaseRuntimeReads
} from "@/lib/repositories/freshness-repository";
import type { SupabaseDataFreshnessClient } from "@/lib/repositories/supabase-data-freshness-repository";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type FreshnessEnvironment = {
  [key: string]: string | undefined;
  DATA_FRESHNESS_SOURCE?: string;
  DATA_FRESHNESS_SUPABASE_READS?: string;
};

export type DataFreshnessSnapshotGetterOptions = {
  createSupabaseClient?: () => SupabaseDataFreshnessClient;
  env?: FreshnessEnvironment;
};

function getSupabaseRuntimeReads(env: FreshnessEnvironment): SupabaseRuntimeReads {
  return env.DATA_FRESHNESS_SUPABASE_READS === "enabled" ? "enabled" : "disabled";
}

function getFreshnessSource(env: FreshnessEnvironment): FreshnessSource {
  const source = env.DATA_FRESHNESS_SOURCE ?? "mock";

  if (source === "mock" || source === "supabase") {
    return source;
  }

  throw new Error(`Unsupported DATA_FRESHNESS_SOURCE: ${source}`);
}

export function createDataFreshnessSnapshotGetter({
  createSupabaseClient = () => createServerSupabaseClient() as unknown as SupabaseDataFreshnessClient,
  env = process.env
}: DataFreshnessSnapshotGetterOptions = {}) {
  return async function getDataFreshnessSnapshotFromSource(): Promise<DataFreshnessSnapshot> {
    const repository = createFreshnessRepository({
      createSupabaseClient,
      source: getFreshnessSource(env),
      supabaseRuntimeReads: getSupabaseRuntimeReads(env)
    });

    return repository.getSnapshot();
  };
}

export const getDataFreshnessSnapshot = createDataFreshnessSnapshotGetter();
