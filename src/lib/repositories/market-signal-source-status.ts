import {
  MARKET_SIGNAL_SCORE_SOURCE_GATE,
  TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_APPROVAL,
  buildTwseOpenApiStage8ScoreSourcePromotionSnapshot,
  type TwseOpenApiStage8ScoreSource
} from "../twse-openapi-stage-8-score-source-real-promotion-gate";

export type MarketSignalDataSource = "mock" | "supabase";
export type MarketSignalScoreSource = TwseOpenApiStage8ScoreSource;
export type MarketSignalSupabaseReads = "disabled" | "enabled";
export type MarketSignalSupabasePromotionGate = "disabled" | "stage_6_public_data_source_supabase_approved";
export type MarketSignalScorePromotionGate = "disabled" | "stage_8_score_source_real_approved";

export type MarketSignalSourceStatus = {
  failClosedReason?:
    | "supabase_reads_disabled"
    | "stage_6_promotion_gate_missing"
    | "scoreSource_real_promotion_gate_missing"
    | "scoreSource_real_public_data_source_not_supabase"
    | "scoreSource_real_readonly_state_not_current"
    | "scoreSource_real_formula_not_stable"
    | "scoreSource_real_public_copy_missing"
    | "supabase_read_failed";
  publicScoreSource: MarketSignalScoreSource;
  reason: string;
  requestedScoreSource: MarketSignalScoreSource;
  requestedSource: MarketSignalDataSource;
  resolvedScoreSource: MarketSignalScoreSource;
  resolvedSource: "mock" | "supabase";
  scorePromotionGate: MarketSignalScorePromotionGate;
  supabasePromotionGate: MarketSignalSupabasePromotionGate;
  supabaseRuntimeReads: MarketSignalSupabaseReads;
};

export type MarketSignalEnvironment = {
  [key: string]: string | undefined;
  MARKET_SIGNAL_SCORE_SOURCE_GATE?: string;
  MARKET_SIGNAL_SUPABASE_PROMOTION_GATE?: string;
  MARKET_SIGNAL_SUPABASE_READS?: string;
  NEXT_PUBLIC_DATA_SOURCE?: string;
  NEXT_PUBLIC_SCORE_SOURCE?: string;
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

function getScoreSource(env: MarketSignalEnvironment): MarketSignalScoreSource {
  const scoreSource = env.NEXT_PUBLIC_SCORE_SOURCE ?? "mock";

  if (scoreSource === "mock" || scoreSource === "real") {
    return scoreSource;
  }

  throw new Error(`Unsupported NEXT_PUBLIC_SCORE_SOURCE: ${scoreSource}`);
}

function getSupabaseRuntimeReads(env: MarketSignalEnvironment): MarketSignalSupabaseReads {
  return env.MARKET_SIGNAL_SUPABASE_READS === "enabled" ? "enabled" : "disabled";
}

function getSupabasePromotionGate(env: MarketSignalEnvironment): MarketSignalSupabasePromotionGate {
  return env.MARKET_SIGNAL_SUPABASE_PROMOTION_GATE === MARKET_SIGNAL_STAGE_6_PROMOTION_APPROVAL
    ? MARKET_SIGNAL_STAGE_6_PROMOTION_APPROVAL
    : "disabled";
}

function getScorePromotionGate(env: MarketSignalEnvironment): MarketSignalScorePromotionGate {
  return env.MARKET_SIGNAL_SCORE_SOURCE_GATE === TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_APPROVAL
    ? TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_APPROVAL
    : "disabled";
}

export function getMarketSignalSourceStatus({
  env = process.env
}: MarketSignalSourceStatusOptions = {}): MarketSignalSourceStatus {
  const requestedSource = getDataSource(env);
  const requestedScoreSource = getScoreSource(env);
  const supabaseRuntimeReads = getSupabaseRuntimeReads(env);
  const supabasePromotionGate = getSupabasePromotionGate(env);
  const scorePromotionGate = getScorePromotionGate(env);

  if (requestedSource === "supabase" && supabaseRuntimeReads !== "enabled") {
    return {
      failClosedReason: "supabase_reads_disabled",
      publicScoreSource: "mock",
      reason: "Supabase reads are disabled, so the public runtime stays on mock data and mock scoring.",
      requestedScoreSource,
      requestedSource,
      resolvedScoreSource: "mock",
      resolvedSource: "mock",
      scorePromotionGate,
      supabasePromotionGate,
      supabaseRuntimeReads
    };
  }

  if (requestedSource === "supabase" && supabasePromotionGate !== MARKET_SIGNAL_STAGE_6_PROMOTION_APPROVAL) {
    return {
      failClosedReason: "stage_6_promotion_gate_missing",
      publicScoreSource: "mock",
      reason: "Supabase data was requested, but the Stage 6 public-data promotion gate is missing.",
      requestedScoreSource,
      requestedSource,
      resolvedScoreSource: "mock",
      resolvedSource: "mock",
      scorePromotionGate,
      supabasePromotionGate,
      supabaseRuntimeReads
    };
  }

  const resolvedSource = requestedSource === "supabase" ? "supabase" : "mock";
  const scorePromotion = buildTwseOpenApiStage8ScoreSourcePromotionSnapshot({
    disclaimerVisible: true,
    formulaStatus: "stable",
    noBuySellAdvice: true,
    promotionGate: scorePromotionGate === TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_APPROVAL ? scorePromotionGate : undefined,
    publicDataSource: resolvedSource,
    readonlyState: "current",
    requestedScoreSource,
    sourceDisclosureVisible: true,
    updateTimeVisible: true
  });
  const failClosedReason = mapScorePromotionFailClosedReason(scorePromotion.failClosedReason);

  return {
    failClosedReason,
    publicScoreSource: scorePromotion.publicScoreSource,
    reason:
      scorePromotion.status === "promoted"
        ? "Supabase public data and Stage 8 scoring gate are both approved; public score source can resolve to real."
        : "Public runtime stays on mock scoring until source, formula, copy, and score gates all pass.",
    requestedScoreSource,
    requestedSource,
    resolvedScoreSource: scorePromotion.scoreSource,
    resolvedSource,
    scorePromotionGate,
    supabasePromotionGate,
    supabaseRuntimeReads
  };
}

function mapScorePromotionFailClosedReason(reason: string | undefined): MarketSignalSourceStatus["failClosedReason"] {
  if (!reason) return undefined;
  if (reason === "public_data_source_not_supabase") return "scoreSource_real_public_data_source_not_supabase";
  if (reason === "readonly_state_not_current") return "scoreSource_real_readonly_state_not_current";
  if (reason === "formula_not_stable") return "scoreSource_real_formula_not_stable";
  if (reason === "stage_8_score_source_real_promotion_gate_missing") return "scoreSource_real_promotion_gate_missing";
  if (
    reason === "public_disclaimer_missing" ||
    reason === "source_disclosure_missing" ||
    reason === "update_time_missing" ||
    reason === "buy_sell_advice_boundary_missing"
  ) {
    return "scoreSource_real_public_copy_missing";
  }

  return undefined;
}
