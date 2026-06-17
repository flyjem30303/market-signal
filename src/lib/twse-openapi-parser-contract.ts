import {
  TWSE_OPENAPI_ADAPTER_BOUNDARY,
  TWSE_OPENAPI_ATTRIBUTION,
  TWSE_OPENAPI_ROUTES,
  type TwseOpenApiNormalizedRecord,
  type TwseOpenApiRouteId
} from "@/lib/twse-openapi-source-adapter-contract";

export type TwseOpenApiParserFailureClass =
  | "none"
  | "no_rows"
  | "not_object"
  | "missing_required_field"
  | "field_mismatch"
  | "duplicate_dates"
  | "schema_drift_blocked";

export type TwseOpenApiSyntheticRow = Readonly<Record<string, unknown>>;

export type TwseOpenApiParserContractResult<TKind extends string> = {
  duplicateTradeDateCount: number;
  failureClass: TwseOpenApiParserFailureClass;
  fieldParseFailureCount: number;
  missingRequiredFieldCount: number;
  records: TwseOpenApiNormalizedRecord<TKind>[];
  rejectedRowCount: number;
};

export const TWSE_OPENAPI_PARSER_CONTRACT_BOUNDARY = {
  executionAuthority: TWSE_OPENAPI_ADAPTER_BOUNDARY.executionAuthority,
  fixturePolicy: "synthetic_rows_only",
  nextRoute: "twse_openapi_parser_contract_consumer_adapter_no_fetch",
  parserExecution: "synthetic_only",
  publicDataSource: "mock",
  rawMarketDataFetch: false,
  scoreSource: "mock",
  sqlExecution: false,
  status: "twse_openapi_parser_contract_with_synthetic_fixtures_only",
  supabaseWrite: false
} as const;

const DATE_FIELDS = ["日期", "Date"] as const;
const SYMBOL_FIELDS = ["股票代號", "證券代號", "Code", "Symbol"] as const;
const NAME_FIELDS = ["股票名稱", "證券名稱", "Name"] as const;
const OPEN_FIELDS = ["開盤指數", "開盤價", "OpeningIndex", "OpeningPrice"] as const;
const HIGH_FIELDS = ["最高指數", "最高價", "HighestIndex", "HighestPrice"] as const;
const LOW_FIELDS = ["最低指數", "最低價", "LowestIndex", "LowestPrice"] as const;
const CLOSE_FIELDS = ["收盤指數", "收盤價", "ClosingIndex", "ClosingPrice"] as const;
const VOLUME_FIELDS = ["成交股數", "TradeVolume"] as const;
const TURNOVER_FIELDS = ["成交金額", "TradeValue"] as const;
const TRANSACTION_FIELDS = ["成交筆數", "Transaction"] as const;
const MONTHLY_AVERAGE_FIELDS = ["月平均價", "MonthlyAveragePrice"] as const;
const CHANGE_FIELDS = ["漲跌價差", "Change"] as const;

const ROUTE_REQUIRED_FIELDS: Record<TwseOpenApiRouteId, readonly (readonly string[])[]> = {
  listedStockDailyClose: [DATE_FIELDS, SYMBOL_FIELDS, NAME_FIELDS, CLOSE_FIELDS],
  listedStockDailyTradingInfo: [
    DATE_FIELDS,
    SYMBOL_FIELDS,
    NAME_FIELDS,
    OPEN_FIELDS,
    HIGH_FIELDS,
    LOW_FIELDS,
    CLOSE_FIELDS,
    VOLUME_FIELDS,
    TURNOVER_FIELDS,
    TRANSACTION_FIELDS
  ],
  marketDailyStatistics: [DATE_FIELDS, CLOSE_FIELDS],
  twiiIndexHistory: [DATE_FIELDS, OPEN_FIELDS, HIGH_FIELDS, LOW_FIELDS, CLOSE_FIELDS]
} as const;

export function parseTwseOpenApiSyntheticRows(
  routeId: TwseOpenApiRouteId,
  rows: readonly unknown[]
): TwseOpenApiParserContractResult<"twse_openapi_synthetic_daily_close"> {
  if (rows.length === 0) {
    return emptyResult("no_rows");
  }

  const route = TWSE_OPENAPI_ROUTES[routeId];
  const records: TwseOpenApiNormalizedRecord<"twse_openapi_synthetic_daily_close">[] = [];
  const normalizedKeyCounts = new Map<string, number>();
  let fieldParseFailureCount = 0;
  let missingRequiredFieldCount = 0;
  let notObjectCount = 0;

  for (const row of rows) {
    if (!isSyntheticRow(row)) {
      notObjectCount += 1;
      continue;
    }

    const missingRequiredGroups = getMissingRequiredFieldGroups(row, routeId);
    if (missingRequiredGroups.length > 0) {
      missingRequiredFieldCount += 1;
      continue;
    }

    const tradeDate = parseTwseOpenApiTradeDate(parseTwseOpenApiTextCell(pickFirstString(row, DATE_FIELDS)) ?? "");
    const symbol = parseTwseOpenApiTextCell(pickFirstString(row, SYMBOL_FIELDS));
    const name = parseTwseOpenApiTextCell(pickFirstString(row, NAME_FIELDS));
    const close = parseTwseOpenApiNumericCell(pickFirstString(row, CLOSE_FIELDS));
    const open = parseTwseOpenApiNumericCell(pickFirstString(row, OPEN_FIELDS));
    const high = parseTwseOpenApiNumericCell(pickFirstString(row, HIGH_FIELDS));
    const low = parseTwseOpenApiNumericCell(pickFirstString(row, LOW_FIELDS));
    const volume = parseTwseOpenApiNumericCell(pickFirstString(row, VOLUME_FIELDS));
    const turnover = parseTwseOpenApiNumericCell(pickFirstString(row, TURNOVER_FIELDS));
    const transactions = parseTwseOpenApiNumericCell(pickFirstString(row, TRANSACTION_FIELDS));
    const monthlyAverage = parseTwseOpenApiNumericCell(pickFirstString(row, MONTHLY_AVERAGE_FIELDS));
    const change = parseTwseOpenApiNumericCell(pickFirstString(row, CHANGE_FIELDS));

    if (!tradeDate || close === null) {
      fieldParseFailureCount += 1;
      continue;
    }

    const normalizedKey = symbol ? `${tradeDate}:${symbol}` : tradeDate;
    normalizedKeyCounts.set(normalizedKey, (normalizedKeyCounts.get(normalizedKey) ?? 0) + 1);
    records.push({
      attribution: TWSE_OPENAPI_ATTRIBUTION,
      kind: "twse_openapi_synthetic_daily_close",
      normalized: {
        change,
        close,
        datasetId: route.datasetId,
        high,
        low,
        monthlyAverage,
        name,
        open,
        source: "TWSE_OPENAPI_DATA_GOV",
        sourcePath: route.path,
        sourceRouteId: routeId,
        symbol,
        tradeDate,
        transactions,
        turnover,
        volume
      },
      sourceUpdatedAt: null,
      validationWarnings: buildValidationWarnings({ high, low, open, routeId, turnover, transactions, volume })
    });
  }

  const duplicateTradeDateCount = [...normalizedKeyCounts.values()].filter((count) => count > 1).length;
  const rejectedRowCount = rows.length - records.length;

  return {
    duplicateTradeDateCount,
    failureClass: pickFailureClass({
      duplicateTradeDateCount,
      fieldParseFailureCount,
      missingRequiredFieldCount,
      notObjectCount,
      parsedRowCount: records.length
    }),
    fieldParseFailureCount,
    missingRequiredFieldCount,
    records,
    rejectedRowCount
  };
}

export function parseTwseOpenApiTradeDate(value: string): string {
  const trimmed = value.trim();
  const roc = trimmed.match(/^(\d{2,3})\/(\d{2})\/(\d{2})$/);
  if (roc) return normalizeDate(Number(roc[1]) + 1911, Number(roc[2]), Number(roc[3]));

  const ymd = trimmed.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (ymd) return normalizeDate(Number(ymd[1]), Number(ymd[2]), Number(ymd[3]));

  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return normalizeDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  return "";
}

export function parseTwseOpenApiNumericCell(value: string | null): number | null {
  if (value === null) return null;
  const normalized = value.trim().replaceAll(",", "");
  if (normalized === "" || /^-+$/.test(normalized)) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseTwseOpenApiTextCell(value: string | null): string | null {
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function buildValidationWarnings({
  high,
  low,
  open,
  routeId,
  turnover,
  transactions,
  volume
}: {
  high: number | null;
  low: number | null;
  open: number | null;
  routeId: TwseOpenApiRouteId;
  turnover: number | null;
  transactions: number | null;
  volume: number | null;
}): string[] {
  const warnings: string[] = [];
  if (routeId !== "listedStockDailyClose" && open === null) warnings.push("open_unavailable_in_synthetic_contract");
  if (routeId !== "listedStockDailyClose" && high === null) warnings.push("high_unavailable_in_synthetic_contract");
  if (routeId !== "listedStockDailyClose" && low === null) warnings.push("low_unavailable_in_synthetic_contract");
  if (routeId !== "listedStockDailyTradingInfo" && volume === null) warnings.push("volume_not_required_for_route");
  if (routeId !== "listedStockDailyTradingInfo" && turnover === null) warnings.push("turnover_not_required_for_route");
  if (routeId !== "listedStockDailyTradingInfo" && transactions === null) {
    warnings.push("transactions_not_required_for_route");
  }
  return warnings;
}

function emptyResult<TKind extends string>(failureClass: TwseOpenApiParserFailureClass): TwseOpenApiParserContractResult<TKind> {
  return {
    duplicateTradeDateCount: 0,
    failureClass,
    fieldParseFailureCount: 0,
    missingRequiredFieldCount: 0,
    records: [],
    rejectedRowCount: 0
  };
}

function getMissingRequiredFieldGroups(row: TwseOpenApiSyntheticRow, routeId: TwseOpenApiRouteId): readonly string[] {
  return ROUTE_REQUIRED_FIELDS[routeId]
    .filter((aliases) => pickFirstString(row, aliases) === null)
    .map((aliases) => aliases.join("|"));
}

function isSyntheticRow(value: unknown): value is TwseOpenApiSyntheticRow {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeDate(year: number, month: number, day: number): string {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return "";
  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function pickFailureClass(input: {
  duplicateTradeDateCount: number;
  fieldParseFailureCount: number;
  missingRequiredFieldCount: number;
  notObjectCount: number;
  parsedRowCount: number;
}): TwseOpenApiParserFailureClass {
  if (input.notObjectCount > 0) return "not_object";
  if (input.parsedRowCount === 0 && input.missingRequiredFieldCount > 0) return "missing_required_field";
  if (input.parsedRowCount === 0) return "no_rows";
  if (input.fieldParseFailureCount > 0) return "field_mismatch";
  if (input.missingRequiredFieldCount > 0) return "missing_required_field";
  if (input.duplicateTradeDateCount > 0) return "duplicate_dates";
  return "none";
}

function pickFirstString(row: TwseOpenApiSyntheticRow, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return null;
}
