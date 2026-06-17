export type TwseOpenApiStage5FreshnessState = "current" | "stale" | "missing" | "source_error";

export type TwseOpenApiStage5ReadonlySnapshot = {
  assetCount: number;
  dailyPriceCount: number;
  freshnessState: TwseOpenApiStage5FreshnessState;
  latestTradeDate: string | null;
  rawPayloadEcho: false;
  readMode: "aggregate_shape_only";
  rowPayloadEcho: false;
  secretsPrinted: false;
  sourceErrorCount: number;
};

export type TwseOpenApiStage5ReadonlyGateResult =
  | {
      boundary: typeof TWSE_OPENAPI_STAGE5_SUPABASE_READONLY_BOUNDARY;
      nextRoute: "publicDataSource_supabase_promotion_gate";
      readonlyApiShape: TwseOpenApiStage5ReadonlySnapshot;
      status: "ok";
    }
  | {
      boundary: typeof TWSE_OPENAPI_STAGE5_SUPABASE_READONLY_BOUNDARY;
      reason: "stage5_readonly_blocked_without_exact_authorization" | "stage5_readonly_blocked_missing_environment";
      status: "blocked";
    };

export const TWSE_OPENAPI_STAGE5_SUPABASE_READONLY_BOUNDARY = {
  executionAuthority: "exact_stage_5_readonly_authorization_required",
  publicDataSource: "mock",
  rawPayloadEcho: false,
  readMode: "aggregate_shape_only",
  scoreSource: "mock",
  secretsPrinted: false,
  sqlExecution: false,
  supabaseWrite: false,
  rowPayloadEcho: false
} as const;

export const TWSE_OPENAPI_STAGE5_READONLY_AUTHORIZATION_ID =
  "CEO_STAGE_5_TWSE_OPENAPI_SUPABASE_READONLY_GATE_ONCE";
export const TWSE_OPENAPI_STAGE5_ALLOW_READONLY = "TWSE_OPENAPI_STAGE5_ALLOW_READONLY";

export function classifyTwseOpenApiStage5ReadonlyState(input: {
  dailyPriceCount: number;
  latestTradeDate: string | null;
  nowDate: string;
  sourceErrorCount?: number;
}): TwseOpenApiStage5FreshnessState {
  if ((input.sourceErrorCount ?? 0) > 0) return "source_error";
  if (input.dailyPriceCount <= 0 || !input.latestTradeDate) return "missing";

  const latest = Date.parse(`${input.latestTradeDate}T00:00:00.000Z`);
  const now = Date.parse(`${input.nowDate}T00:00:00.000Z`);
  if (!Number.isFinite(latest) || !Number.isFinite(now)) return "source_error";

  const ageDays = Math.floor((now - latest) / (24 * 60 * 60 * 1000));
  return ageDays > 5 ? "stale" : "current";
}

export function buildTwseOpenApiStage5ReadonlySnapshot(input: {
  assetCount: number;
  dailyPriceCount: number;
  latestTradeDate: string | null;
  nowDate?: string;
  sourceErrorCount?: number;
}): TwseOpenApiStage5ReadonlySnapshot {
  return {
    assetCount: Math.max(0, input.assetCount),
    dailyPriceCount: Math.max(0, input.dailyPriceCount),
    freshnessState: classifyTwseOpenApiStage5ReadonlyState({
      dailyPriceCount: input.dailyPriceCount,
      latestTradeDate: input.latestTradeDate,
      nowDate: input.nowDate ?? new Date().toISOString().slice(0, 10),
      sourceErrorCount: input.sourceErrorCount
    }),
    latestTradeDate: input.latestTradeDate,
    rawPayloadEcho: false,
    readMode: "aggregate_shape_only",
    rowPayloadEcho: false,
    secretsPrinted: false,
    sourceErrorCount: Math.max(0, input.sourceErrorCount ?? 0)
  };
}

export async function runTwseOpenApiStage5ReadonlyGate(input: {
  authorizationId?: string;
  envEnabled?: boolean;
  readLive?: boolean;
  snapshot?: TwseOpenApiStage5ReadonlySnapshot;
} = {}): Promise<TwseOpenApiStage5ReadonlyGateResult> {
  if (input.readLive && (input.authorizationId !== TWSE_OPENAPI_STAGE5_READONLY_AUTHORIZATION_ID || input.envEnabled !== true)) {
    return {
      boundary: TWSE_OPENAPI_STAGE5_SUPABASE_READONLY_BOUNDARY,
      reason: "stage5_readonly_blocked_without_exact_authorization",
      status: "blocked"
    };
  }

  return {
    boundary: TWSE_OPENAPI_STAGE5_SUPABASE_READONLY_BOUNDARY,
    nextRoute: "publicDataSource_supabase_promotion_gate",
    readonlyApiShape:
      input.snapshot ??
      buildTwseOpenApiStage5ReadonlySnapshot({
        assetCount: 3,
        dailyPriceCount: 5,
        latestTradeDate: "2026-06-17",
        nowDate: "2026-06-17"
      }),
    status: "ok"
  };
}
