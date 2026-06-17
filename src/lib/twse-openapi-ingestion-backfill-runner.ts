import { parseTwseOpenApiSyntheticRows } from "@/lib/twse-openapi-parser-contract";
import { TWSE_OPENAPI_ROUTES, type TwseOpenApiRouteId } from "@/lib/twse-openapi-source-adapter-contract";

export type TwseOpenApiBackfillDryRunRouteSummary = {
  candidateRowCount: number;
  duplicateCount: number;
  missingSessionCount: number;
  rejectedCount: number;
  routeId: TwseOpenApiRouteId;
  sourceTimestamp: string | null;
};

export type TwseOpenApiBackfillDryRun = {
  candidateRowCount: number;
  duplicateCount: number;
  missingSessionCount: number;
  rawPayloadEcho: false;
  rejectedCount: number;
  routeSummaries: TwseOpenApiBackfillDryRunRouteSummary[];
  rowPayloadEcho: false;
  sourceTimestamp: string | null;
};

export type TwseOpenApiBackfillRunnerResult =
  | {
      boundary: typeof TWSE_OPENAPI_INGESTION_BACKFILL_RUNNER_BOUNDARY;
      dryRun: TwseOpenApiBackfillDryRun;
      nextRoute: "twse_openapi_supabase_bounded_write_and_post_run_review";
      status: "ok";
    }
  | {
      boundary: typeof TWSE_OPENAPI_INGESTION_BACKFILL_RUNNER_BOUNDARY;
      reason: "live_fetch_blocked_without_exact_authorization";
      status: "blocked";
    };

export const TWSE_OPENAPI_INGESTION_BACKFILL_RUNNER_BOUNDARY = {
  executionAuthority: "explicit_live_fetch_authorization_required",
  mode: "dry_run_only",
  publicDataSource: "mock",
  rawPayloadEcho: false,
  scoreSource: "mock",
  sqlExecution: false,
  supabaseWrite: false,
  rowPayloadEcho: false
} as const;

export const TWSE_OPENAPI_LIVE_FETCH_AUTHORIZATION_ID = "CEO_STAGE_3_TWSE_OPENAPI_LIVE_FETCH_DRY_RUN_ONLY";
export const TWSE_OPENAPI_ALLOW_LIVE_FETCH = "TWSE_OPENAPI_ALLOW_LIVE_FETCH";

export const TWSE_OPENAPI_BACKFILL_PRIMARY_ROUTES = [
  "twiiIndexHistory",
  "listedStockDailyClose",
  "listedStockDailyTradingInfo"
] as const satisfies readonly TwseOpenApiRouteId[];

type TwseOpenApiBackfillPrimaryRouteId = (typeof TWSE_OPENAPI_BACKFILL_PRIMARY_ROUTES)[number];

const SYNTHETIC_ROWS_BY_ROUTE: Record<TwseOpenApiBackfillPrimaryRouteId, readonly Readonly<Record<string, unknown>>[]> = {
  listedStockDailyClose: [
    { "日期": "2026-06-10", "股票代號": "2330", "股票名稱": "台積電", "收盤價": "980.00", "月平均價": "965.00" },
    { "日期": "2026-06-10", "股票代號": "2308", "股票名稱": "台達電", "收盤價": "355.50", "月平均價": "350.10" }
  ],
  listedStockDailyTradingInfo: [
    {
      "日期": "2026-06-10",
      "成交筆數": "52,300",
      "成交股數": "28,000,000",
      "成交金額": "27,440,000,000",
      "收盤價": "980.00",
      "最低價": "970.00",
      "最高價": "988.00",
      "漲跌價差": "5.00",
      "證券代號": "2330",
      "證券名稱": "台積電",
      "開盤價": "975.00"
    }
  ],
  twiiIndexHistory: [
    { "日期": "2026-06-10", "收盤指數": "23190.10", "最低指數": "23120.20", "最高指數": "23310.00", "開盤指數": "23255.50" },
    { "日期": "2026-06-11", "收盤指數": "23220.10", "最低指數": "23150.20", "最高指數": "23330.00", "開盤指數": "23200.50" }
  ]
} as const;

export async function runTwseOpenApiBackfillDryRun(input: {
  authorizationId?: string;
  fetchLive?: boolean;
  now?: string;
  rowsByRoute?: Partial<Record<TwseOpenApiRouteId, readonly Readonly<Record<string, unknown>>[]>>;
} = {}): Promise<TwseOpenApiBackfillRunnerResult> {
  if (input.fetchLive && input.authorizationId !== TWSE_OPENAPI_LIVE_FETCH_AUTHORIZATION_ID) {
    return {
      boundary: TWSE_OPENAPI_INGESTION_BACKFILL_RUNNER_BOUNDARY,
      reason: "live_fetch_blocked_without_exact_authorization",
      status: "blocked"
    };
  }

  const routeRows: Partial<Record<TwseOpenApiRouteId, readonly Readonly<Record<string, unknown>>[]>> = {};
  if (input.fetchLive) {
    for (const routeId of TWSE_OPENAPI_BACKFILL_PRIMARY_ROUTES) {
      routeRows[routeId] = await fetchTwseOpenApiRows(routeId);
    }
  } else {
    Object.assign(routeRows, SYNTHETIC_ROWS_BY_ROUTE, input.rowsByRoute);
  }

  return {
    boundary: TWSE_OPENAPI_INGESTION_BACKFILL_RUNNER_BOUNDARY,
    dryRun: buildTwseOpenApiBackfillDryRunPlan(routeRows, input.now ?? null),
    nextRoute: "twse_openapi_supabase_bounded_write_and_post_run_review",
    status: "ok"
  };
}

export function buildTwseOpenApiBackfillDryRunPlan(
  rowsByRoute: Partial<Record<TwseOpenApiRouteId, readonly Readonly<Record<string, unknown>>[]>>,
  sourceTimestamp: string | null
): TwseOpenApiBackfillDryRun {
  const routeSummaries = TWSE_OPENAPI_BACKFILL_PRIMARY_ROUTES.map((routeId) => {
    const rows = rowsByRoute[routeId] ?? [];
    const parsed = parseTwseOpenApiSyntheticRows(routeId, rows);
    return {
      candidateRowCount: parsed.records.length,
      duplicateCount: parsed.duplicateTradeDateCount,
      missingSessionCount: countMissingSessions(parsed.records.map((record) => record.normalized.tradeDate)),
      rejectedCount: parsed.rejectedRowCount,
      routeId,
      sourceTimestamp
    };
  });

  return {
    candidateRowCount: sum(routeSummaries, "candidateRowCount"),
    duplicateCount: sum(routeSummaries, "duplicateCount"),
    missingSessionCount: sum(routeSummaries, "missingSessionCount"),
    rawPayloadEcho: false,
    rejectedCount: sum(routeSummaries, "rejectedCount"),
    routeSummaries,
    rowPayloadEcho: false,
    sourceTimestamp
  };
}

export async function fetchTwseOpenApiRows(routeId: TwseOpenApiRouteId): Promise<readonly Readonly<Record<string, unknown>>[]> {
  const route = TWSE_OPENAPI_ROUTES[routeId];
  const response = await fetch(`https://openapi.twse.com.tw/v1${route.path}`, {
    headers: {
      Accept: "application/json"
    }
  });
  if (!response.ok) return [];

  const json = (await response.json()) as unknown;
  return Array.isArray(json) ? (json as readonly Readonly<Record<string, unknown>>[]) : [];
}

function countMissingSessions(tradeDates: readonly string[]): number {
  const ordered = [...new Set(tradeDates)].sort();
  let missing = 0;
  for (let index = 1; index < ordered.length; index += 1) {
    const previous = Date.parse(`${ordered[index - 1]}T00:00:00.000Z`);
    const current = Date.parse(`${ordered[index]}T00:00:00.000Z`);
    if (Number.isFinite(previous) && Number.isFinite(current)) {
      const gapDays = Math.round((current - previous) / (24 * 60 * 60 * 1000)) - 1;
      if (gapDays > 0) missing += gapDays;
    }
  }
  return missing;
}

function sum(rows: readonly TwseOpenApiBackfillDryRunRouteSummary[], field: keyof TwseOpenApiBackfillDryRunRouteSummary): number {
  return rows.reduce((total, row) => total + (typeof row[field] === "number" ? row[field] : 0), 0);
}
