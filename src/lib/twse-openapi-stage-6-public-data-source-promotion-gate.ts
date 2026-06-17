import type {
  MarketSignalDataSource,
  MarketSignalSupabaseReads
} from "@/lib/repositories/market-signal-source-status";

export const MARKET_SIGNAL_SUPABASE_PROMOTION_GATE = "MARKET_SIGNAL_SUPABASE_PROMOTION_GATE";
export const TWSE_OPENAPI_STAGE6_PROMOTION_APPROVAL = "stage_6_public_data_source_supabase_approved";

export type TwseOpenApiStage6FailClosedReason =
  | "requested_source_not_supabase"
  | "supabase_reads_disabled"
  | "stage_6_promotion_gate_missing"
  | "readonly_state_not_current";

export type TwseOpenApiStage6PromotionInput = {
  promotionGate?: string;
  readonlyState?: "current" | "stale" | "missing" | "source_error";
  requestedSource: MarketSignalDataSource;
  supabaseRuntimeReads: MarketSignalSupabaseReads;
};

export type TwseOpenApiStage6PromotionSnapshot = {
  failClosedReason?: TwseOpenApiStage6FailClosedReason;
  nextRoute: "real_score_formula_gate";
  publicDataSource: "mock" | "supabase";
  rawPayloadEcho: false;
  resolvedSource: "mock" | "supabase";
  rowPayloadEcho: false;
  scoreSource: "mock";
  secretsPrinted: false;
  sourceDisclosure: "TWSE OpenAPI via data.gov open data";
  staleDataBehavior: "fail_closed";
  status: "fail_closed" | "promoted";
  updateTimeRequired: true;
};

export const TWSE_OPENAPI_STAGE6_PUBLIC_DATA_SOURCE_PROMOTION_BOUNDARY = {
  executionAuthority: "exact_stage_6_promotion_gate_required",
  nextRoute: "real_score_formula_gate",
  publicDataSource: "supabase",
  rawPayloadEcho: false,
  rowPayloadEcho: false,
  scoreSource: "mock",
  secretsPrinted: false,
  sourceDisclosure: "TWSE OpenAPI via data.gov open data",
  staleDataBehavior: "fail_closed",
  supabaseWrite: false,
  updateTimeRequired: true
} as const;

export function classifyTwseOpenApiStage6PromotionDecision(
  input: TwseOpenApiStage6PromotionInput
): { failClosedReason?: TwseOpenApiStage6FailClosedReason; resolvedSource: "mock" | "supabase"; status: "fail_closed" | "promoted" } {
  if (input.requestedSource !== "supabase") {
    return {
      failClosedReason: "requested_source_not_supabase",
      resolvedSource: "mock",
      status: "fail_closed"
    };
  }

  if (input.supabaseRuntimeReads !== "enabled") {
    return {
      failClosedReason: "supabase_reads_disabled",
      resolvedSource: "mock",
      status: "fail_closed"
    };
  }

  if (input.promotionGate !== TWSE_OPENAPI_STAGE6_PROMOTION_APPROVAL) {
    return {
      failClosedReason: "stage_6_promotion_gate_missing",
      resolvedSource: "mock",
      status: "fail_closed"
    };
  }

  if ((input.readonlyState ?? "current") !== "current") {
    return {
      failClosedReason: "readonly_state_not_current",
      resolvedSource: "mock",
      status: "fail_closed"
    };
  }

  return {
    resolvedSource: "supabase",
    status: "promoted"
  };
}

export function buildTwseOpenApiStage6PromotionSnapshot(
  input: TwseOpenApiStage6PromotionInput
): TwseOpenApiStage6PromotionSnapshot {
  const decision = classifyTwseOpenApiStage6PromotionDecision(input);

  return {
    failClosedReason: decision.failClosedReason,
    nextRoute: "real_score_formula_gate",
    publicDataSource: decision.resolvedSource,
    rawPayloadEcho: false,
    resolvedSource: decision.resolvedSource,
    rowPayloadEcho: false,
    scoreSource: "mock",
    secretsPrinted: false,
    sourceDisclosure: "TWSE OpenAPI via data.gov open data",
    staleDataBehavior: "fail_closed",
    status: decision.status,
    updateTimeRequired: true
  };
}
