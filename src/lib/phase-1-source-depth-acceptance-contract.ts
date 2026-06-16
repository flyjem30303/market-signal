export type Phase1SourceDepthAcceptedRouteId =
  | "twii_index_history"
  | "tw_cross_market_index_history"
  | "tw_listed_stock_daily_close";

export type Phase1SourceDepthDeferredScopeId = "phase_1_1_etf_source_rights";

export type Phase1SourceDepthAcceptedRoute = {
  apiDocumentationUrl: string;
  attributionRequired: true;
  cadence: "daily";
  charge: "free";
  id: Phase1SourceDepthAcceptedRouteId;
  label: string;
  license: "Open Government Data License, version 1.0";
  publicUsePosture: "accepted_for_delayed_public_display_and_derived_metrics";
  sourceUrl: string;
};

export type Phase1SourceDepthDeferredScope = {
  affectedSymbols: ["0050", "006208"];
  id: Phase1SourceDepthDeferredScopeId;
  nextAction: string;
  reason: string;
};

export type Phase1SourceDepthAcceptanceContract = {
  acceptedRoutes: Phase1SourceDepthAcceptedRoute[];
  deferredScopes: Phase1SourceDepthDeferredScope[];
  canPromotePublicDataSourceToSupabase: false;
  canSetScoreSourceReal: false;
  mode: "phase_1_source_depth_acceptance_contract";
  phase1Universe: "twii_plus_listed_stock_daily_close";
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "accepted_for_phase_1_scope";
  stopLine: string;
  summary: string;
};

const TWSE_OPENAPI_SWAGGER_URL = "https://openapi.twse.com.tw/v1/swagger.json";

export function getPhase1SourceDepthAcceptanceContract(): Phase1SourceDepthAcceptanceContract {
  return {
    acceptedRoutes: [
      {
        apiDocumentationUrl: TWSE_OPENAPI_SWAGGER_URL,
        attributionRequired: true,
        cadence: "daily",
        charge: "free",
        id: "twii_index_history",
        label: "TWII weighted index historical daily close",
        license: "Open Government Data License, version 1.0",
        publicUsePosture: "accepted_for_delayed_public_display_and_derived_metrics",
        sourceUrl: "https://data.gov.tw/en/datasets/11755"
      },
      {
        apiDocumentationUrl: TWSE_OPENAPI_SWAGGER_URL,
        attributionRequired: true,
        cadence: "daily",
        charge: "free",
        id: "tw_cross_market_index_history",
        label: "Taiwan cross-market index historical daily close",
        license: "Open Government Data License, version 1.0",
        publicUsePosture: "accepted_for_delayed_public_display_and_derived_metrics",
        sourceUrl: "https://data.gov.tw/en/datasets/11669"
      },
      {
        apiDocumentationUrl: TWSE_OPENAPI_SWAGGER_URL,
        attributionRequired: true,
        cadence: "daily",
        charge: "free",
        id: "tw_listed_stock_daily_close",
        label: "TW listed stock daily close and monthly average",
        license: "Open Government Data License, version 1.0",
        publicUsePosture: "accepted_for_delayed_public_display_and_derived_metrics",
        sourceUrl: "https://data.gov.tw/dataset/11548"
      }
    ],
    deferredScopes: [
      {
        affectedSymbols: ["0050", "006208"],
        id: "phase_1_1_etf_source_rights",
        nextAction:
          "Complete ETF source-rights evidence for 0050 and 006208 in Phase 1.1 before adding ETF coverage.",
        reason:
          "ETF coverage is deliberately deferred out of Phase 1 so Phase 1 can ship TWII plus listed-stock daily close first."
      }
    ],
    canPromotePublicDataSourceToSupabase: false,
    canSetScoreSourceReal: false,
    mode: "phase_1_source_depth_acceptance_contract",
    phase1Universe: "twii_plus_listed_stock_daily_close",
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "accepted_for_phase_1_scope",
    stopLine:
      "No SQL, Supabase write, raw market-data fetch, daily_prices mutation, publicDataSource=supabase, or scoreSource=real in this contract.",
    summary:
      "Phase 1 source depth is accepted for TWII and listed-stock daily close. ETF coverage is deferred to Phase 1.1."
  };
}
