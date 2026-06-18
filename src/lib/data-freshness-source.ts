import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import {
  createFreshnessRepository,
  type FreshnessSource,
  type SupabaseRuntimeReads
} from "@/lib/repositories/freshness-repository";
import {
  MARKET_SIGNAL_STAGE_6_PROMOTION_APPROVAL,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-source-status";
import type { SupabaseDataFreshnessClient } from "@/lib/repositories/supabase-data-freshness-repository";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type FreshnessEnvironment = {
  [key: string]: string | undefined;
  DATA_FRESHNESS_SOURCE?: string;
  DATA_FRESHNESS_SUPABASE_READS?: string;
  MARKET_SIGNAL_SCORE_SOURCE_GATE?: string;
  MARKET_SIGNAL_SUPABASE_PROMOTION_GATE?: string;
  MARKET_SIGNAL_SUPABASE_READS?: string;
  NEXT_PUBLIC_DATA_SOURCE?: string;
  NEXT_PUBLIC_SCORE_SOURCE?: string;
};

export type DataFreshnessSnapshotGetterOptions = {
  createSupabaseClient?: () => SupabaseDataFreshnessClient;
  env?: FreshnessEnvironment;
};

function getSupabaseRuntimeReads(env: FreshnessEnvironment): SupabaseRuntimeReads {
  return env.DATA_FRESHNESS_SUPABASE_READS === "enabled" || env.MARKET_SIGNAL_SUPABASE_READS === "enabled"
    ? "enabled"
    : "disabled";
}

function getFreshnessSource(env: FreshnessEnvironment): FreshnessSource {
  const source = env.DATA_FRESHNESS_SOURCE ?? getDefaultFreshnessSource(env);

  if (source === "mock" || source === "supabase") {
    return source;
  }

  throw new Error(`Unsupported DATA_FRESHNESS_SOURCE: ${source}`);
}

function getDefaultFreshnessSource(env: FreshnessEnvironment): FreshnessSource {
  return env.NEXT_PUBLIC_DATA_SOURCE === "supabase" &&
    env.MARKET_SIGNAL_SUPABASE_READS === "enabled" &&
    env.MARKET_SIGNAL_SUPABASE_PROMOTION_GATE === MARKET_SIGNAL_STAGE_6_PROMOTION_APPROVAL
    ? "supabase"
    : "mock";
}

function applyPublicRuntimeScoreStatus(snapshot: DataFreshnessSnapshot, env: FreshnessEnvironment): DataFreshnessSnapshot {
  const marketSignalSourceStatus = getMarketSignalSourceStatus({ env });

  if (marketSignalSourceStatus.publicScoreSource !== "real") {
    return snapshot;
  }

  return {
    ...snapshot,
    scoreSource: "real",
    scoreSourceLabel: "正式分數"
  };
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

    const snapshot = await repository.getSnapshot();
    return applyPublicRuntimeScoreStatus(snapshot, env);
  };
}

export const getDataFreshnessSnapshot = createDataFreshnessSnapshotGetter();
