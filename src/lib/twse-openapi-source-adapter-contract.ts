export type TwseOpenApiRouteId =
  | "twiiIndexHistory"
  | "listedStockDailyClose"
  | "listedStockDailyTradingInfo"
  | "marketDailyStatistics";

export type TwseOpenApiRouteContract = {
  id: TwseOpenApiRouteId;
  normalizedUse: "twii_daily_close" | "listed_equity_daily_close" | "listed_equity_daily_trading_info" | "market_daily_statistics";
  path: string;
  produces: readonly ["application/json", "text/csv"];
  requiredFor: readonly string[];
  sourceSummary: string;
  validationState: string;
};

export type TwseOpenApiAttributionContract = {
  attributionText: string;
  dataDelayDisclosure: string;
  licenseReferenceUrl: "https://data.gov.tw/license";
  noAdviceDisclosure: string;
  noEndorsementDisclosure: string;
  sourceLabel: "TWSE OpenAPI / data.gov open-data references";
};

export type TwseOpenApiNormalizedDailyClose = {
  close: number | null;
  high: number | null;
  low: number | null;
  open: number | null;
  sourceRouteId: TwseOpenApiRouteId;
  tradeDate: string;
  turnover: number | null;
  volume: number | null;
};

export type TwseOpenApiNormalizedRecord<TKind extends string> = {
  attribution: TwseOpenApiAttributionContract;
  kind: TKind;
  normalized: TwseOpenApiNormalizedDailyClose;
  sourceUpdatedAt: string | null;
  validationWarnings: string[];
};

export type TwseOpenApiAdapterBoundary = {
  executionAuthority: "not_authorized";
  fixturePolicy: "synthetic_or_contract_only";
  publicDataSource: "mock";
  rawMarketDataFetch: false;
  scoreSource: "mock";
  sqlExecution: false;
  supabaseWrite: false;
};

export const TWSE_OPENAPI_ADAPTER_BOUNDARY: TwseOpenApiAdapterBoundary = {
  executionAuthority: "not_authorized",
  fixturePolicy: "synthetic_or_contract_only",
  publicDataSource: "mock",
  rawMarketDataFetch: false,
  scoreSource: "mock",
  sqlExecution: false,
  supabaseWrite: false
} as const;

export const TWSE_OPENAPI_ROUTES: Record<TwseOpenApiRouteId, TwseOpenApiRouteContract> = {
  listedStockDailyClose: {
    id: "listedStockDailyClose",
    normalizedUse: "listed_equity_daily_close",
    path: "/exchangeReport/STOCK_DAY_AVG_ALL",
    produces: ["application/json", "text/csv"],
    requiredFor: ["listed stock daily close", "monthly average reference"],
    sourceSummary: "上市個股日收盤價及月平均價",
    validationState: "accepted_metadata_route_for_listed_stock_daily_close"
  },
  listedStockDailyTradingInfo: {
    id: "listedStockDailyTradingInfo",
    normalizedUse: "listed_equity_daily_trading_info",
    path: "/exchangeReport/STOCK_DAY_ALL",
    produces: ["application/json", "text/csv"],
    requiredFor: ["listed stock open high low close", "volume", "turnover", "transaction count"],
    sourceSummary: "上市個股日成交資訊",
    validationState: "accepted_metadata_route_for_listed_stock_daily_trading_info"
  },
  marketDailyStatistics: {
    id: "marketDailyStatistics",
    normalizedUse: "market_daily_statistics",
    path: "/exchangeReport/MI_INDEX",
    produces: ["application/json", "text/csv"],
    requiredFor: ["market daily close statistics", "index-level context"],
    sourceSummary: "每日收盤行情-大盤統計資訊",
    validationState: "accepted_metadata_route_for_market_daily_statistics"
  },
  twiiIndexHistory: {
    id: "twiiIndexHistory",
    normalizedUse: "twii_daily_close",
    path: "/indicesReport/MI_5MINS_HIST",
    produces: ["application/json", "text/csv"],
    requiredFor: ["TWII index daily close", "TWII open high low close"],
    sourceSummary: "發行量加權股價指數歷史資料",
    validationState: "accepted_metadata_route_for_twii_index_history"
  }
} as const;

export const TWSE_OPENAPI_ATTRIBUTION: TwseOpenApiAttributionContract = {
  attributionText:
    "資料來源：臺灣證券交易所 OpenAPI / 政府資料開放平臺，依政府資料開放授權條款第1版使用；資料可能延遲或調整，本網站非投資建議。",
  dataDelayDisclosure: "資料以每日收盤後批次更新為目標；若來源延遲、欄位異動或驗證失敗，系統需保守顯示為資料暫不可用。",
  licenseReferenceUrl: "https://data.gov.tw/license",
  noAdviceDisclosure: "本網站提供資訊整理與風險辨識，不提供個別買賣建議、保證報酬或交易指令。",
  noEndorsementDisclosure: "引用公開資料不代表資料提供機關推薦、認可或保證本網站之分析結果。",
  sourceLabel: "TWSE OpenAPI / data.gov open-data references"
} as const;

export function getTwseOpenApiAdapterReadiness() {
  return {
    attribution: TWSE_OPENAPI_ATTRIBUTION,
    boundary: TWSE_OPENAPI_ADAPTER_BOUNDARY,
    nextRoute: "twse_openapi_parser_contract_with_synthetic_fixtures_only",
    routes: TWSE_OPENAPI_ROUTES,
    status: "twse_openapi_source_adapter_contract_scaffold_no_data_fetch"
  } as const;
}
