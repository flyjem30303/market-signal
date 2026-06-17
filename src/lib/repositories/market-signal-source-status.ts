export type MarketSignalDataSource = "mock" | "supabase";
export type MarketSignalSupabaseReads = "disabled" | "enabled";

export type MarketSignalSourceStatus = {
  publicScoreSource: "mock";
  reason: string;
  requestedSource: MarketSignalDataSource;
  resolvedSource: "mock";
  supabaseRuntimeReads: MarketSignalSupabaseReads;
};

export type MarketSignalEnvironment = {
  [key: string]: string | undefined;
  MARKET_SIGNAL_SUPABASE_READS?: string;
  NEXT_PUBLIC_DATA_SOURCE?: string;
};

export type MarketSignalSourceStatusOptions = {
  env?: MarketSignalEnvironment;
};

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

export function getMarketSignalSourceStatus({
  env = process.env
}: MarketSignalSourceStatusOptions = {}): MarketSignalSourceStatus {
  const requestedSource = getDataSource(env);
  const supabaseRuntimeReads = getSupabaseRuntimeReads(env);

  if (requestedSource === "supabase" && supabaseRuntimeReads !== "enabled") {
    return {
      publicScoreSource: "mock",
      reason: "正式資料讀取尚未啟用，公開頁仍以示範資料呈現。",
      requestedSource,
      resolvedSource: "mock",
      supabaseRuntimeReads
    };
  }

  if (requestedSource === "supabase") {
    return {
      publicScoreSource: "mock",
      reason: "後端唯讀已可評估，但公開分數仍需通過正式切換審核才會啟用。",
      requestedSource,
      resolvedSource: "mock",
      supabaseRuntimeReads
    };
  }

  return {
    publicScoreSource: "mock",
    reason: "公開頁目前設定為示範資料模式。",
    requestedSource,
    resolvedSource: "mock",
    supabaseRuntimeReads
  };
}
