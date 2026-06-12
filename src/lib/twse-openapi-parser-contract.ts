import {
  TWSE_OPENAPI_ADAPTER_BOUNDARY,
  TWSE_OPENAPI_ATTRIBUTION,
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

const ROUTE_REQUIRED_FIELDS: Record<TwseOpenApiRouteId, readonly string[]> = {
  listedStockDailyClose: ["Date", "Code", "ClosingPrice"],
  listedStockDailyTradingInfo: ["Date", "Code", "OpeningPrice", "HighestPrice", "LowestPrice", "ClosingPrice"],
  marketDailyStatistics: ["Date", "IndexName", "ClosingIndex"],
  twiiIndexHistory: ["Date", "ClosingIndex"]
} as const;

export function parseTwseOpenApiSyntheticRows(
  routeId: TwseOpenApiRouteId,
  rows: readonly unknown[]
): TwseOpenApiParserContractResult<"twse_openapi_synthetic_daily_close"> {
  if (rows.length === 0) {
    return emptyResult("no_rows");
  }

  const records: TwseOpenApiNormalizedRecord<"twse_openapi_synthetic_daily_close">[] = [];
  const dateCounts = new Map<string, number>();
  let fieldParseFailureCount = 0;
  let missingRequiredFieldCount = 0;
  let notObjectCount = 0;

  for (const row of rows) {
    if (!isSyntheticRow(row)) {
      notObjectCount += 1;
      continue;
    }

    const requiredFields = ROUTE_REQUIRED_FIELDS[routeId];
    const missingFields = requiredFields.filter((field) => row[field] === undefined || row[field] === null || row[field] === "");
    if (missingFields.length > 0) {
      missingRequiredFieldCount += 1;
      continue;
    }

    const tradeDate = parseTwseOpenApiTradeDate(String(row.Date));
    const close = parseTwseOpenApiNumericCell(pickFirstString(row, ["ClosingIndex", "ClosingPrice"]));
    const open = parseTwseOpenApiNumericCell(pickFirstString(row, ["OpeningIndex", "OpeningPrice"]));
    const high = parseTwseOpenApiNumericCell(pickFirstString(row, ["HighestIndex", "HighestPrice"]));
    const low = parseTwseOpenApiNumericCell(pickFirstString(row, ["LowestIndex", "LowestPrice"]));
    const volume = parseTwseOpenApiNumericCell(pickFirstString(row, ["TradeVolume"]));
    const turnover = parseTwseOpenApiNumericCell(pickFirstString(row, ["TradeValue"]));

    if (!tradeDate || close === null) {
      fieldParseFailureCount += 1;
      continue;
    }

    dateCounts.set(tradeDate, (dateCounts.get(tradeDate) ?? 0) + 1);
    records.push({
      attribution: TWSE_OPENAPI_ATTRIBUTION,
      kind: "twse_openapi_synthetic_daily_close",
      normalized: {
        close,
        high,
        low,
        open,
        sourceRouteId: routeId,
        tradeDate,
        turnover,
        volume
      },
      sourceUpdatedAt: null,
      validationWarnings: buildValidationWarnings({ high, low, open, routeId, turnover, volume })
    });
  }

  const duplicateTradeDateCount = [...dateCounts.values()].filter((count) => count > 1).length;
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

function buildValidationWarnings({
  high,
  low,
  open,
  routeId,
  turnover,
  volume
}: {
  high: number | null;
  low: number | null;
  open: number | null;
  routeId: TwseOpenApiRouteId;
  turnover: number | null;
  volume: number | null;
}): string[] {
  const warnings: string[] = [];
  if (open === null) warnings.push("open_unavailable_in_synthetic_contract");
  if (high === null) warnings.push("high_unavailable_in_synthetic_contract");
  if (low === null) warnings.push("low_unavailable_in_synthetic_contract");
  if (routeId !== "listedStockDailyTradingInfo" && volume === null) warnings.push("volume_not_required_for_route");
  if (routeId !== "listedStockDailyTradingInfo" && turnover === null) warnings.push("turnover_not_required_for_route");
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
