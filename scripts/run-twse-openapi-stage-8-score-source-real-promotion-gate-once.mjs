const MARKET_SIGNAL_SCORE_SOURCE_GATE = "MARKET_SIGNAL_SCORE_SOURCE_GATE";
const TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_APPROVAL = "stage_8_score_source_real_approved";

const TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_PROMOTION_BOUNDARY = {
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
};

const scenario = readArgValue("--scenario") ?? "default";
const input = buildScenarioInput(scenario);
const promotion = buildPromotionSnapshot(input);

console.log(
  JSON.stringify(
    {
      boundary: TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_PROMOTION_BOUNDARY,
      envGateName: MARKET_SIGNAL_SCORE_SOURCE_GATE,
      guardedStatus: "stage_8_score_source_real_promotion_complete",
      nextRoute: "real_runtime_phase_1_complete",
      promotion,
      status: "ok"
    },
    null,
    2
  )
);

function buildScenarioInput(name) {
  if (name === "promoted") {
    return {
      disclaimerVisible: true,
      formulaStatus: "stable",
      noBuySellAdvice: true,
      promotionGate: TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_APPROVAL,
      publicDataSource: "supabase",
      readonlyState: "current",
      requestedScoreSource: "real",
      sourceDisclosureVisible: true,
      updateTimeVisible: true
    };
  }

  if (name === "missing-copy") {
    return {
      disclaimerVisible: false,
      formulaStatus: "stable",
      noBuySellAdvice: true,
      promotionGate: TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_APPROVAL,
      publicDataSource: "supabase",
      readonlyState: "current",
      requestedScoreSource: "real",
      sourceDisclosureVisible: true,
      updateTimeVisible: true
    };
  }

  if (name === "stale") {
    return {
      disclaimerVisible: true,
      formulaStatus: "stable",
      noBuySellAdvice: true,
      promotionGate: TWSE_OPENAPI_STAGE8_SCORE_SOURCE_REAL_APPROVAL,
      publicDataSource: "supabase",
      readonlyState: "stale",
      requestedScoreSource: "real",
      sourceDisclosureVisible: true,
      updateTimeVisible: true
    };
  }

  return {
    disclaimerVisible: true,
    formulaStatus: "stable",
    noBuySellAdvice: true,
    promotionGate: process.env[MARKET_SIGNAL_SCORE_SOURCE_GATE],
    publicDataSource: process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase" ? "supabase" : "mock",
    readonlyState: "current",
    requestedScoreSource: process.env.NEXT_PUBLIC_SCORE_SOURCE === "real" ? "real" : "mock",
    sourceDisclosureVisible: true,
    updateTimeVisible: true
  };
}

function buildPromotionSnapshot(input) {
  const decision = classifyPromotionDecision(input);

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

function classifyPromotionDecision(input) {
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

function readArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  const value = process.argv[index + 1];
  return value && !value.startsWith("--") ? value : undefined;
}
