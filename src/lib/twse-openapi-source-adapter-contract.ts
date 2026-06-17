export type TwseOpenApiRouteId =
  | "twiiIndexHistory"
  | "listedStockDailyClose"
  | "listedStockDailyTradingInfo"
  | "marketDailyStatistics";

export type TwseOpenApiDatasetId = "11755" | "11548" | "11549" | null;

export type TwseOpenApiRouteContract = {
  datasetId: TwseOpenApiDatasetId;
  id: TwseOpenApiRouteId;
  normalizedFields: readonly string[];
  normalizedUse: "twii_daily_close" | "listed_equity_daily_close" | "listed_equity_daily_trading_info" | "market_daily_statistics";
  path: string;
  produces: readonly ["application/json", "text/csv"];
  requiredFor: readonly string[];
  sourceFields: readonly string[];
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
  change: number | null;
  close: number | null;
  datasetId: TwseOpenApiDatasetId;
  high: number | null;
  low: number | null;
  monthlyAverage: number | null;
  name: string | null;
  open: number | null;
  source: "TWSE_OPENAPI_DATA_GOV";
  sourcePath: string;
  sourceRouteId: TwseOpenApiRouteId;
  symbol: string | null;
  tradeDate: string;
  transactions: number | null;
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
    datasetId: "11548",
    id: "listedStockDailyClose",
    normalizedFields: ["trade_date", "symbol", "name", "close", "monthly_average", "source"],
    normalizedUse: "listed_equity_daily_close",
    path: "/exchangeReport/STOCK_DAY_AVG_ALL",
    produces: ["application/json", "text/csv"],
    requiredFor: ["listed stock daily close", "monthly average reference"],
    sourceFields: ["日期", "股票代號", "股票名稱", "收盤價", "月平均價"],
    sourceSummary: "TWSE open-data listed-stock daily close and monthly-average route from data.gov dataset 11548.",
    validationState: "accepted_metadata_route_for_listed_stock_daily_close"
  },
  listedStockDailyTradingInfo: {
    datasetId: "11549",
    id: "listedStockDailyTradingInfo",
    normalizedFields: [
      "trade_date",
      "symbol",
      "name",
      "open",
      "high",
      "low",
      "close",
      "volume",
      "turnover",
      "transactions",
      "source"
    ],
    normalizedUse: "listed_equity_daily_trading_info",
    path: "/exchangeReport/STOCK_DAY_ALL",
    produces: ["application/json", "text/csv"],
    requiredFor: ["listed stock open high low close", "volume", "turnover", "transaction count"],
    sourceFields: ["日期", "證券代號", "證券名稱", "成交股數", "成交金額", "開盤價", "最高價", "最低價", "收盤價", "漲跌價差", "成交筆數"],
    sourceSummary: "TWSE open-data listed-stock daily trading route from data.gov dataset 11549.",
    validationState: "accepted_metadata_route_for_listed_stock_daily_trading_info"
  },
  marketDailyStatistics: {
    datasetId: null,
    id: "marketDailyStatistics",
    normalizedFields: ["trade_date", "close", "source"],
    normalizedUse: "market_daily_statistics",
    path: "/exchangeReport/MI_INDEX",
    produces: ["application/json", "text/csv"],
    requiredFor: ["market daily close statistics", "index-level context"],
    sourceFields: ["日期", "指數", "收盤指數"],
    sourceSummary: "TWSE market daily statistics route kept as a secondary context route, not the Phase 1 primary source.",
    validationState: "accepted_metadata_route_for_market_daily_statistics"
  },
  twiiIndexHistory: {
    datasetId: "11755",
    id: "twiiIndexHistory",
    normalizedFields: ["trade_date", "open", "high", "low", "close", "source"],
    normalizedUse: "twii_daily_close",
    path: "/indicesReport/MI_5MINS_HIST",
    produces: ["application/json", "text/csv"],
    requiredFor: ["TWII index daily close", "TWII open high low close"],
    sourceFields: ["日期", "開盤指數", "最高指數", "最低指數", "收盤指數"],
    sourceSummary: "TWSE open-data TWII daily OHLC route from data.gov dataset 11755.",
    validationState: "accepted_metadata_route_for_twii_index_history"
  }
} as const;

export const TWSE_OPENAPI_ATTRIBUTION: TwseOpenApiAttributionContract = {
  attributionText:
    "資料來源：TWSE OpenAPI / data.gov 開放資料。使用時需標示來源，並依政府資料開放授權條款使用。",
  dataDelayDisclosure:
    "資料以官方開放資料更新時間為準，可能延遲或暫時缺漏；前台必須顯示更新時間與異常狀態，不得宣稱即時逐筆行情。",
  licenseReferenceUrl: "https://data.gov.tw/license",
  noAdviceDisclosure: "本網站提供市場資訊整理與風險辨識，不構成任何買賣建議、保證報酬或投資決策代理。",
  noEndorsementDisclosure: "使用開放資料不代表資料提供機關為本網站、計算結果或任何商業服務背書。",
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
