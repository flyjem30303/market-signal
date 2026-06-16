export type Phase1SourceDepthAcceptedRouteId =
  | "twii_index_history"
  | "tw_cross_market_index_history"
  | "tw_listed_stock_daily_close";

export type Phase1SourceDepthBlockedScopeId = "phase_1_etf_source_rights";

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

export type Phase1SourceDepthBlockedScope = {
  affectedSymbols: ["0050", "006208"];
  id: Phase1SourceDepthBlockedScopeId;
  nextAction: string;
  reason: string;
};

export type Phase1SourceDepthAcceptanceContract = {
  acceptedRoutes: Phase1SourceDepthAcceptedRoute[];
  blockedScopes: Phase1SourceDepthBlockedScope[];
  canPromotePublicDataSourceToSupabase: false;
  canSetScoreSourceReal: false;
  mode: "phase_1_source_depth_acceptance_contract";
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "blocked_by_etf_source_rights";
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
    blockedScopes: [
      {
        affectedSymbols: ["0050", "006208"],
        id: "phase_1_etf_source_rights",
        nextAction:
          "Complete ETF source-rights evidence for 0050 and 006208 before full Phase 1 source-depth acceptance.",
        reason:
          "TWII and listed-stock open-data routes are locally source-depth acceptable, but ETF source-rights coverage remains unresolved."
      }
    ],
    canPromotePublicDataSourceToSupabase: false,
    canSetScoreSourceReal: false,
    mode: "phase_1_source_depth_acceptance_contract",
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "blocked_by_etf_source_rights",
    stopLine:
      "No SQL, Supabase write, raw market-data fetch, daily_prices mutation, publicDataSource=supabase, or scoreSource=real in this contract.",
    summary:
      "Official open-data routes can support delayed public display and derived metrics for TWII/listed-stock daily close design, while ETF source-rights remains the single Phase 1 source-depth blocker."
  };
}
