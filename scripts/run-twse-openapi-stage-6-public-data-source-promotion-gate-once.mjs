const MARKET_SIGNAL_SUPABASE_PROMOTION_GATE = "MARKET_SIGNAL_SUPABASE_PROMOTION_GATE";
const TWSE_OPENAPI_STAGE6_PROMOTION_APPROVAL = "stage_6_public_data_source_supabase_approved";

const TWSE_OPENAPI_STAGE6_PUBLIC_DATA_SOURCE_PROMOTION_BOUNDARY = {
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
};

const scenario = readArgValue("--scenario") ?? "default";
const input = buildScenarioInput(scenario);
const promotion = buildPromotionSnapshot(input);

console.log(
  JSON.stringify(
    {
      boundary: TWSE_OPENAPI_STAGE6_PUBLIC_DATA_SOURCE_PROMOTION_BOUNDARY,
      envGateName: MARKET_SIGNAL_SUPABASE_PROMOTION_GATE,
      guardedStatus: "stage_6_public_data_source_supabase_promotion_complete",
      nextRoute: "real_score_formula_gate",
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
      promotionGate: TWSE_OPENAPI_STAGE6_PROMOTION_APPROVAL,
      readonlyState: "current",
      requestedSource: "supabase",
      supabaseRuntimeReads: "enabled"
    };
  }

  if (name === "stale") {
    return {
      promotionGate: TWSE_OPENAPI_STAGE6_PROMOTION_APPROVAL,
      readonlyState: "stale",
      requestedSource: "supabase",
      supabaseRuntimeReads: "enabled"
    };
  }

  if (name === "missing-gate") {
    return {
      promotionGate: undefined,
      readonlyState: "current",
      requestedSource: "supabase",
      supabaseRuntimeReads: "enabled"
    };
  }

  return {
    promotionGate: process.env[MARKET_SIGNAL_SUPABASE_PROMOTION_GATE],
    readonlyState: "current",
    requestedSource: process.env.NEXT_PUBLIC_DATA_SOURCE === "supabase" ? "supabase" : "mock",
    supabaseRuntimeReads: process.env.MARKET_SIGNAL_SUPABASE_READS === "enabled" ? "enabled" : "disabled"
  };
}

function buildPromotionSnapshot(input) {
  const decision = classifyPromotionDecision(input);

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

function classifyPromotionDecision(input) {
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

function readArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  const value = process.argv[index + 1];
  return value && !value.startsWith("--") ? value : undefined;
}
