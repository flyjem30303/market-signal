import {
  TWSE_OPENAPI_PARSER_CONTRACT_BOUNDARY,
  type TwseOpenApiParserContractResult,
  type TwseOpenApiParserFailureClass
} from "@/lib/twse-openapi-parser-contract";
import {
  TWSE_OPENAPI_ATTRIBUTION,
  type TwseOpenApiAttributionContract,
  type TwseOpenApiNormalizedRecord,
  type TwseOpenApiRouteId
} from "@/lib/twse-openapi-source-adapter-contract";

export type TwseOpenApiRuntimeHandoffStatus = "ready" | "blocked";

export type TwseOpenApiRuntimeDailyPoint = {
  close: number;
  high: number | null;
  low: number | null;
  open: number | null;
  sourceRouteId: TwseOpenApiRouteId;
  tradeDate: string;
  turnover: number | null;
  validationWarnings: string[];
  volume: number | null;
};

export type TwseOpenApiRuntimeHandoff = {
  acceptedRecordCount: number;
  attribution: TwseOpenApiAttributionContract;
  boundary: typeof TWSE_OPENAPI_PARSER_CONSUMER_ADAPTER_BOUNDARY;
  duplicateTradeDateCount: number;
  failureClass: TwseOpenApiParserFailureClass;
  fieldParseFailureCount: number;
  latestPoint: TwseOpenApiRuntimeDailyPoint | null;
  missingRequiredFieldCount: number;
  mode: "synthetic_parser_result_only";
  pointCount: number;
  points: TwseOpenApiRuntimeDailyPoint[];
  previousPoint: TwseOpenApiRuntimeDailyPoint | null;
  rejectedRowCount: number;
  routeId: TwseOpenApiRouteId;
  runtimeChange: {
    change: number | null;
    changePercent: number | null;
  };
  status: TwseOpenApiRuntimeHandoffStatus;
  warnings: string[];
};

export const TWSE_OPENAPI_PARSER_CONSUMER_ADAPTER_BOUNDARY = {
  executionAuthority: TWSE_OPENAPI_PARSER_CONTRACT_BOUNDARY.executionAuthority,
  fixturePolicy: "synthetic_parser_result_only",
  nextRoute: "twse_openapi_runtime_mock_consumer_wiring_readiness",
  parserExecution: TWSE_OPENAPI_PARSER_CONTRACT_BOUNDARY.parserExecution,
  publicDataSource: "mock",
  rawMarketDataFetch: false,
  scoreSource: "mock",
  sqlExecution: false,
  status: "twse_openapi_parser_contract_consumer_adapter_no_fetch",
  supabaseWrite: false
} as const;

export function buildTwseOpenApiRuntimeHandoff(
  routeId: TwseOpenApiRouteId,
  parserResult: TwseOpenApiParserContractResult<"twse_openapi_synthetic_daily_close">
): TwseOpenApiRuntimeHandoff {
  if (parserResult.failureClass !== "none") {
    return buildBlockedHandoff(routeId, parserResult, [
      `parser_result_failure_class:${parserResult.failureClass}`,
      "runtime_handoff_fail_closed_no_points_exported"
    ]);
  }

  const points = parserResult.records.map(toRuntimeDailyPoint).sort((a, b) => a.tradeDate.localeCompare(b.tradeDate));
  if (points.length === 0) {
    return buildBlockedHandoff(routeId, parserResult, ["parser_result_empty_after_normalization"]);
  }

  const latestPoint = points.at(-1) ?? null;
  const previousPoint = points.at(-2) ?? null;
  const runtimeChange = calculateChange(latestPoint, previousPoint);

  return {
    acceptedRecordCount: parserResult.records.length,
    attribution: TWSE_OPENAPI_ATTRIBUTION,
    boundary: TWSE_OPENAPI_PARSER_CONSUMER_ADAPTER_BOUNDARY,
    duplicateTradeDateCount: parserResult.duplicateTradeDateCount,
    failureClass: parserResult.failureClass,
    fieldParseFailureCount: parserResult.fieldParseFailureCount,
    latestPoint,
    missingRequiredFieldCount: parserResult.missingRequiredFieldCount,
    mode: "synthetic_parser_result_only",
    pointCount: points.length,
    points,
    previousPoint,
    rejectedRowCount: parserResult.rejectedRowCount,
    routeId,
    runtimeChange,
    status: "ready",
    warnings: collectWarnings(points)
  };
}

export function isTwseOpenApiRuntimeHandoffReady(handoff: TwseOpenApiRuntimeHandoff): boolean {
  return (
    handoff.status === "ready" &&
    handoff.failureClass === "none" &&
    handoff.boundary.publicDataSource === "mock" &&
    handoff.boundary.scoreSource === "mock" &&
    handoff.boundary.rawMarketDataFetch === false &&
    handoff.boundary.sqlExecution === false &&
    handoff.boundary.supabaseWrite === false &&
    handoff.pointCount > 0
  );
}

function buildBlockedHandoff(
  routeId: TwseOpenApiRouteId,
  parserResult: TwseOpenApiParserContractResult<"twse_openapi_synthetic_daily_close">,
  warnings: string[]
): TwseOpenApiRuntimeHandoff {
  return {
    acceptedRecordCount: parserResult.records.length,
    attribution: TWSE_OPENAPI_ATTRIBUTION,
    boundary: TWSE_OPENAPI_PARSER_CONSUMER_ADAPTER_BOUNDARY,
    duplicateTradeDateCount: parserResult.duplicateTradeDateCount,
    failureClass: parserResult.failureClass,
    fieldParseFailureCount: parserResult.fieldParseFailureCount,
    latestPoint: null,
    missingRequiredFieldCount: parserResult.missingRequiredFieldCount,
    mode: "synthetic_parser_result_only",
    pointCount: 0,
    points: [],
    previousPoint: null,
    rejectedRowCount: parserResult.rejectedRowCount,
    routeId,
    runtimeChange: {
      change: null,
      changePercent: null
    },
    status: "blocked",
    warnings
  };
}

function toRuntimeDailyPoint(
  record: TwseOpenApiNormalizedRecord<"twse_openapi_synthetic_daily_close">
): TwseOpenApiRuntimeDailyPoint {
  return {
    close: record.normalized.close ?? 0,
    high: record.normalized.high,
    low: record.normalized.low,
    open: record.normalized.open,
    sourceRouteId: record.normalized.sourceRouteId,
    tradeDate: record.normalized.tradeDate,
    turnover: record.normalized.turnover,
    validationWarnings: record.validationWarnings,
    volume: record.normalized.volume
  };
}

function calculateChange(
  latestPoint: TwseOpenApiRuntimeDailyPoint | null,
  previousPoint: TwseOpenApiRuntimeDailyPoint | null
): { change: number | null; changePercent: number | null } {
  if (!latestPoint || !previousPoint || previousPoint.close === 0) {
    return {
      change: null,
      changePercent: null
    };
  }

  const change = roundMetric(latestPoint.close - previousPoint.close);
  return {
    change,
    changePercent: roundMetric((change / previousPoint.close) * 100)
  };
}

function collectWarnings(points: readonly TwseOpenApiRuntimeDailyPoint[]): string[] {
  return [...new Set(points.flatMap((point) => point.validationWarnings))];
}

function roundMetric(value: number): number {
  return Math.round(value * 10000) / 10000;
}
