export type MarketSignalDataSource = "mock" | "supabase";
export type MarketSignalSupabaseReads = "disabled" | "enabled";
export type MarketSignalSupabasePromotionGate = "disabled" | "stage_6_public_data_source_supabase_approved";

export type MarketSignalSourceStatus = {
  failClosedReason?: "supabase_reads_disabled" | "stage_6_promotion_gate_missing";
  publicScoreSource: "mock";
  reason: string;
  requestedSource: MarketSignalDataSource;
  resolvedSource: "mock" | "supabase";
  supabasePromotionGate: MarketSignalSupabasePromotionGate;
  supabaseRuntimeReads: MarketSignalSupabaseReads;
};

export type MarketSignalEnvironment = {
  [key: string]: string | undefined;
  MARKET_SIGNAL_SUPABASE_PROMOTION_GATE?: string;
  MARKET_SIGNAL_SUPABASE_READS?: string;
  NEXT_PUBLIC_DATA_SOURCE?: string;
};

export type MarketSignalSourceStatusOptions = {
  env?: MarketSignalEnvironment;
};

export const MARKET_SIGNAL_SUPABASE_PROMOTION_GATE = "MARKET_SIGNAL_SUPABASE_PROMOTION_GATE";
export const MARKET_SIGNAL_STAGE_6_PROMOTION_APPROVAL = "stage_6_public_data_source_supabase_approved";

function getDataSource(env: MarketSignalEnvironment): MarketSignalDataSource {
  const dataSource = env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";

  if (dataSource === "mock" || dataSource === "supabase") {
    return dataSource;
  }

  throw new Error(`Unsupported NEXT_PUBLIC_DATA_SOURCE: ${dataSource}`);
}

function getSupabaseRuntimeReads(env: MarketSignalEnvironment): MarketSignalSupabaseReads {
  return env.MARKET_SIGNAL_SUPABASE_READS === "enabled" ? "enabled" : "disabled";
}

function getSupabasePromotionGate(env: MarketSignalEnvironment): MarketSignalSupabasePromotionGate {
  return env.MARKET_SIGNAL_SUPABASE_PROMOTION_GATE === MARKET_SIGNAL_STAGE_6_PROMOTION_APPROVAL
    ? MARKET_SIGNAL_STAGE_6_PROMOTION_APPROVAL
    : "disabled";
}

export function getMarketSignalSourceStatus({
  env = process.env
}: MarketSignalSourceStatusOptions = {}): MarketSignalSourceStatus {
  const requestedSource = getDataSource(env);
  const supabaseRuntimeReads = getSupabaseRuntimeReads(env);
  const supabasePromotionGate = getSupabasePromotionGate(env);

  if (requestedSource === "supabase" && supabaseRuntimeReads !== "enabled") {
    return {
      failClosedReason: "supabase_reads_disabled",
      publicScoreSource: "mock",
      reason: "即使要求切換資料來源，因即時讀取尚未啟用，前台仍維持安全示範模式。",
      requestedSource,
      resolvedSource: "mock",
      supabasePromotionGate,
      supabaseRuntimeReads
    };
  }

  if (requestedSource === "supabase" && supabasePromotionGate !== MARKET_SIGNAL_STAGE_6_PROMOTION_APPROVAL) {
    return {
      failClosedReason: "stage_6_promotion_gate_missing",
      publicScoreSource: "mock",
      reason: "資料讀取已可用，但尚未通過公開資料來源晉升門檻，前台仍維持安全示範模式。",
      requestedSource,
      resolvedSource: "mock",
      supabasePromotionGate,
      supabaseRuntimeReads
    };
  }

  if (requestedSource === "supabase") {
    return {
      publicScoreSource: "mock",
      reason:
        "公開資料來源晉升門檻已通過；資料可切換至 Supabase，燈號評分仍待後續公式階段。",
      requestedSource,
      resolvedSource: "supabase",
      supabasePromotionGate,
      supabaseRuntimeReads
    };
  }

  return {
    publicScoreSource: "mock",
    reason: "目前以前台示範資料來源呈現。",
    requestedSource,
    resolvedSource: "mock",
    supabasePromotionGate,
    supabaseRuntimeReads
  };
}
