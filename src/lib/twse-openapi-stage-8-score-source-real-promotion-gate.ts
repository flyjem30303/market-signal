export const MARKET_SIGNAL_SCORE_SOURCE_GATE = "MARKET_SIGNAL_SCORE_SOURCE_GATE";
export const TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_APPROVAL = "stage_8_score_source_real_approved";

export type TwseOpenApiStage8ScoreSource = "mock" | "real";

export type TwseOpenApiStage8FailClosedReason =
  | "requested_score_source_not_real"
  | "public_data_source_not_supabase"
  | "readonly_state_not_current"
  | "formula_not_stable"
  | "stage_8_score_source_real_promotion_gate_missing"
  | "public_disclaimer_missing"
  | "source_disclosure_missing"
  | "update_time_missing"
  | "buy_sell_advice_boundary_missing";

export type TwseOpenApiStage8PromotionInput = {
  disclaimerVisible: boolean;
  formulaStatus: "stable" | "missing" | "unreviewed";
  noBuySellAdvice: boolean;
  promotionGate?: string;
  publicDataSource: "mock" | "supabase";
  readonlyState: "current" | "stale" | "missing" | "source_error";
  requestedScoreSource: TwseOpenApiStage8ScoreSource;
  sourceDisclosureVisible: boolean;
  updateTimeVisible: boolean;
};

export type TwseOpenApiStage8PromotionSnapshot = {
  failClosedReason?: TwseOpenApiStage8FailClosedReason;
  formulaStatus: TwseOpenApiStage8PromotionInput["formulaStatus"];
  nextRoute: "score_source_real_blocked" | "real_runtime_phase_1_complete";
  noBuySellAdvice: true;
  publicDataSource: "mock" | "supabase";
  publicScoreSource: TwseOpenApiStage8ScoreSource;
  rawPayloadEcho: false;
  readonlyState: TwseOpenApiStage8PromotionInput["readonlyState"];
  resolvedScoreSource: TwseOpenApiStage8ScoreSource;
  rowPayloadEcho: false;
  scoreSource: TwseOpenApiStage8ScoreSource;
  secretsPrinted: false;
  sourceDisclosure: "TWSE OpenAPI via data.gov open data";
  status: "fail_closed" | "promoted";
  updateTimeRequired: true;
};

export const TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_PROMOTION_BOUNDARY = {
  executionAuthority: "exact_stage_8_score_source_real_gate_required",
  nextRoute: "real_runtime_phase_1_complete",
  noBuySellAdvice: true,
  publicDataSource: "supabase",
  publicScoreSource: "real",
  rawPayloadEcho: false,
  rowPayloadEcho: false,
  scoreSource: "real",
  secretsPrinted: false,
  sourceDisclosure: "TWSE OpenAPI via data.gov open data",
  supabaseWrite: false,
  updateTimeRequired: true
} as const;

export function classifyTwseOpenApiStage8ScoreSourcePromotionDecision(
  input: TwseOpenApiStage8PromotionInput
): { failClosedReason?: TwseOpenApiStage8FailClosedReason; scoreSource: TwseOpenApiStage8ScoreSource; status: "fail_closed" | "promoted" } {
  if (input.requestedScoreSource !== "real") {
    return {
      failClosedReason: "requested_score_source_not_real",
      scoreSource: "mock",
      status: "fail_closed"
    };
  }

  if (input.publicDataSource !== "supabase") {
    return {
      failClosedReason: "public_data_source_not_supabase",
      scoreSource: "mock",
      status: "fail_closed"
    };
  }

  if (input.readonlyState !== "current") {
    return {
      failClosedReason: "readonly_state_not_current",
      scoreSource: "mock",
      status: "fail_closed"
    };
  }

  if (input.formulaStatus !== "stable") {
    return {
      failClosedReason: "formula_not_stable",
      scoreSource: "mock",
      status: "fail_closed"
    };
  }

  if (input.promotionGate !== TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_APPROVAL) {
    return {
      failClosedReason: "stage_8_score_source_real_promotion_gate_missing",
      scoreSource: "mock",
      status: "fail_closed"
    };
  }

  if (!input.disclaimerVisible) {
    return {
      failClosedReason: "public_disclaimer_missing",
      scoreSource: "mock",
      status: "fail_closed"
    };
  }

  if (!input.sourceDisclosureVisible) {
    return {
      failClosedReason: "source_disclosure_missing",
      scoreSource: "mock",
      status: "fail_closed"
    };
  }

  if (!input.updateTimeVisible) {
    return {
      failClosedReason: "update_time_missing",
      scoreSource: "mock",
      status: "fail_closed"
    };
  }

  if (!input.noBuySellAdvice) {
    return {
      failClosedReason: "buy_sell_advice_boundary_missing",
      scoreSource: "mock",
      status: "fail_closed"
    };
  }

  return {
    scoreSource: "real",
    status: "promoted"
  };
}

export function buildTwseOpenApiStage8ScoreSourcePromotionSnapshot(
  input: TwseOpenApiStage8PromotionInput
): TwseOpenApiStage8PromotionSnapshot {
  const decision = classifyTwseOpenApiStage8ScoreSourcePromotionDecision(input);

  return {
    failClosedReason: decision.failClosedReason,
    formulaStatus: input.formulaStatus,
    nextRoute: decision.status === "promoted" ? "real_runtime_phase_1_complete" : "score_source_real_blocked",
    noBuySellAdvice: true,
    publicDataSource: input.publicDataSource,
    publicScoreSource: decision.scoreSource,
    rawPayloadEcho: false,
    readonlyState: input.readonlyState,
    resolvedScoreSource: decision.scoreSource,
    rowPayloadEcho: false,
    scoreSource: decision.scoreSource,
    secretsPrinted: false,
    sourceDisclosure: "TWSE OpenAPI via data.gov open data",
    status: decision.status,
    updateTimeRequired: true
  };
}
