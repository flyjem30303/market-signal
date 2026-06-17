const TWSE_OPENAPI_STAGE5_READONLY_AUTHORIZATION_ID = "CEO_STAGE_5_TWSE_OPENAPI_SUPABASE_READONLY_GATE_ONCE";
const TWSE_OPENAPI_STAGE5_ALLOW_READONLY = "TWSE_OPENAPI_STAGE5_ALLOW_READONLY";

const TWSE_OPENAPI_STAGE5_SUPABASE_READONLY_BOUNDARY = {
  executionAuthority: "exact_stage_5_readonly_authorization_required",
  publicDataSource: "mock",
  rawPayloadEcho: false,
  readMode: "aggregate_shape_only",
  scoreSource: "mock",
  secretsPrinted: false,
  sqlExecution: false,
  supabaseWrite: false,
  rowPayloadEcho: false
};

const args = new Set(process.argv.slice(2));
const readLive = args.has("--read-live");
const authorizationId = readArgValue("--authorization-id");
const scenario = readArgValue("--scenario") ?? "current";

if (
  readLive &&
  (authorizationId !== TWSE_OPENAPI_STAGE5_READONLY_AUTHORIZATION_ID ||
    process.env[TWSE_OPENAPI_STAGE5_ALLOW_READONLY] !== "true")
) {
  console.log(
    JSON.stringify(
      {
        boundary: TWSE_OPENAPI_STAGE5_SUPABASE_READONLY_BOUNDARY,
        reason: "stage5_readonly_blocked_without_exact_authorization",
        status: "blocked"
      },
      null,
      2
    )
  );
  process.exit(1);
}

const readonlyApiShape = readLive ? await buildLiveReadonlySnapshot() : buildScenarioSnapshot(scenario);

console.log(
  JSON.stringify(
    {
      boundary: TWSE_OPENAPI_STAGE5_SUPABASE_READONLY_BOUNDARY,
      guardedStatus: "stage_5_supabase_readonly_gate_complete",
      nextRoute: "publicDataSource_supabase_promotion_gate",
      readonlyApiShape,
      status: "ok"
    },
    null,
    2
  )
);

function buildScenarioSnapshot(name) {
  if (name === "stale") {
    return buildReadonlySnapshot({
      assetCount: 3,
      dailyPriceCount: 5,
      latestTradeDate: "2026-06-01",
      nowDate: "2026-06-17"
    });
  }

  if (name === "missing") {
    return buildReadonlySnapshot({
      assetCount: 3,
      dailyPriceCount: 0,
      latestTradeDate: null,
      nowDate: "2026-06-17"
    });
  }

  if (name === "source-error") {
    return buildReadonlySnapshot({
      assetCount: 0,
      dailyPriceCount: 0,
      latestTradeDate: null,
      nowDate: "2026-06-17",
      sourceErrorCount: 1
    });
  }

  return buildReadonlySnapshot({
    assetCount: 3,
    dailyPriceCount: 5,
    latestTradeDate: "2026-06-17",
    nowDate: "2026-06-17"
  });
}

function buildReadonlySnapshot(input) {
  return {
    assetCount: Math.max(0, input.assetCount),
    dailyPriceCount: Math.max(0, input.dailyPriceCount),
    freshnessState: classifyReadonlyState(input),
    latestTradeDate: input.latestTradeDate,
    rawPayloadEcho: false,
    readMode: "aggregate_shape_only",
    rowPayloadEcho: false,
    secretsPrinted: false,
    sourceErrorCount: Math.max(0, input.sourceErrorCount ?? 0)
  };
}

function classifyReadonlyState(input) {
  if ((input.sourceErrorCount ?? 0) > 0) return "source_error";
  if (input.dailyPriceCount <= 0 || !input.latestTradeDate) return "missing";

  const latest = Date.parse(`${input.latestTradeDate}T00:00:00.000Z`);
  const now = Date.parse(`${input.nowDate}T00:00:00.000Z`);
  if (!Number.isFinite(latest) || !Number.isFinite(now)) return "source_error";

  const ageDays = Math.floor((now - latest) / (24 * 60 * 60 * 1000));
  return ageDays > 5 ? "stale" : "current";
}

async function buildLiveReadonlySnapshot() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return buildReadonlySnapshot({
      assetCount: 0,
      dailyPriceCount: 0,
      latestTradeDate: null,
      sourceErrorCount: 1
    });
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, anonKey, { auth: { persistSession: false } });

  const [assetCount, dailyPriceCount, latestTradeDate] = await Promise.all([
    countRows(supabase, "stocks"),
    countRows(supabase, "daily_prices"),
    readLatestTradeDate(supabase)
  ]);
  const sourceErrorCount = [assetCount, dailyPriceCount, latestTradeDate].filter((value) => value === "source_error").length;

  return buildReadonlySnapshot({
    assetCount: typeof assetCount === "number" ? assetCount : 0,
    dailyPriceCount: typeof dailyPriceCount === "number" ? dailyPriceCount : 0,
    latestTradeDate: typeof latestTradeDate === "string" ? latestTradeDate : null,
    sourceErrorCount
  });
}

async function countRows(supabase, table) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) return "source_error";
  return count ?? 0;
}

async function readLatestTradeDate(supabase) {
  const { data, error } = await supabase
    .from("daily_prices")
    .select("trade_date")
    .order("trade_date", { ascending: false })
    .limit(1);
  if (error) return "source_error";
  return data?.[0]?.trade_date ?? null;
}

function readArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  const value = process.argv[index + 1];
  return value && !value.startsWith("--") ? value : undefined;
}
