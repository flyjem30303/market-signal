import { buildMockDataFreshnessSnapshot, type DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  getSupabaseDataFreshnessSnapshot,
  type SupabaseDataFreshnessClient
} from "@/lib/repositories/supabase-data-freshness-repository";

export type FreshnessSource = "mock" | "supabase";

export type SupabaseRuntimeReads = "disabled" | "enabled";

export type FreshnessRepository = {
  getSnapshot(): Promise<DataFreshnessSnapshot>;
  source: "mock" | "data_runs";
};

export type FreshnessRepositoryFactoryOptions = {
  createSupabaseClient: () => SupabaseDataFreshnessClient;
  source: FreshnessSource;
  supabaseRuntimeReads: SupabaseRuntimeReads;
};

export function createMockFreshnessRepository(): FreshnessRepository {
  return {
    async getSnapshot() {
      return buildMockDataFreshnessSnapshot();
    },
    source: "mock"
  };
}

export function createDataRunsFreshnessRepository(client: SupabaseDataFreshnessClient): FreshnessRepository {
  return {
    async getSnapshot() {
      try {
        return await getSupabaseDataFreshnessSnapshot(client);
      } catch {
        return buildMockDataFreshnessSnapshot();
      }
    },
    source: "data_runs"
  };
}

export function createFreshnessRepository({
  createSupabaseClient,
  source,
  supabaseRuntimeReads
}: FreshnessRepositoryFactoryOptions): FreshnessRepository {
  if (source !== "supabase" || supabaseRuntimeReads !== "enabled") {
    return createMockFreshnessRepository();
  }

  return createDataRunsFreshnessRepository(createSupabaseClient());
}
