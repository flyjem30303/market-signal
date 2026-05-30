export type DataFreshnessState = "complete" | "partial" | "stale" | "mock" | "unavailable";

export type DataFreshnessSnapshot = {
  asOfDate: string;
  currency: string;
  description: string;
  isMock: boolean;
  market: string;
  scoreSource: "mock" | "real" | "mixed" | "unavailable";
  scoreSourceLabel: string;
  sourceName: string;
  state: DataFreshnessState;
  stateLabel: string;
  timezone: string;
};

export type DataRunFreshnessRow = {
  data_end_date: string | null;
  row_count: number;
  source_name: string;
  status: "success" | "partial" | "failed";
  target_table: string;
};

export type MarketFreshnessMetadata = {
  currency: string;
  exchange: string;
  timezone: string;
};

const stateLabels: Record<DataFreshnessState, string> = {
  complete: "完整",
  partial: "部分",
  stale: "延遲",
  mock: "模擬",
  unavailable: "不可用"
};

const stateDescriptions: Record<DataFreshnessState, string> = {
  complete: "Freshness metadata 已可讀取；僅代表資料狀態可達，不代表真實評分或資料品質已核准。",
  partial: "Freshness metadata 顯示部分資料缺漏；分數與解讀需保守看待。",
  stale: "Freshness metadata 顯示資料可能延遲；請避免當成即時狀態。",
  mock: "目前為模擬資料，用於產品體驗驗證。",
  unavailable: "資料暫時無法取得，請勿依此做投資判斷。"
};

export function buildMockDataFreshnessSnapshot(): DataFreshnessSnapshot {
  return {
    asOfDate: "2026-05-28",
    currency: "TWD",
    description: stateDescriptions.mock,
    isMock: true,
    market: "TWSE",
    scoreSource: "mock",
    scoreSourceLabel: "模擬評分",
    sourceName: "Mock repository",
    state: "mock",
    stateLabel: stateLabels.mock,
    timezone: "Asia/Taipei"
  };
}

export function buildSupabaseDataFreshnessSnapshot({
  dataRuns,
  market
}: {
  dataRuns: DataRunFreshnessRow[];
  market: MarketFreshnessMetadata;
}): DataFreshnessSnapshot {
  const dailyPriceRun = dataRuns.find((run) => run.target_table === "daily_prices");
  const dailyFundamentalRun = dataRuns.find((run) => run.target_table === "daily_fundamentals");
  const rows = [dailyPriceRun, dailyFundamentalRun].filter((row): row is DataRunFreshnessRow => Boolean(row));

  if (rows.length === 0) {
    return {
      asOfDate: "-",
      currency: market.currency,
      description: stateDescriptions.unavailable,
      isMock: false,
      market: market.exchange,
      scoreSource: "mock",
      scoreSourceLabel: "模擬評分",
      sourceName: "Supabase",
      state: "unavailable",
      stateLabel: stateLabels.unavailable,
      timezone: market.timezone
    };
  }

  const hasFailed = rows.some((row) => row.status === "failed");
  const hasPartial = rows.length < 2 || rows.some((row) => row.status === "partial" || row.row_count <= 0);
  const latestDate = newestDate(rows.map((row) => row.data_end_date).filter((date): date is string => Boolean(date)));
  const sourceNames = [...new Set(rows.map((row) => row.source_name))].join(" / ");
  const state: DataFreshnessState = hasFailed ? "unavailable" : hasPartial ? "partial" : "complete";

  return {
    asOfDate: latestDate ?? "-",
    currency: market.currency,
    description: stateDescriptions[state],
    isMock: false,
    market: market.exchange,
    scoreSource: "mock",
    scoreSourceLabel: "模擬評分",
    sourceName: sourceNames || "Supabase",
    state,
    stateLabel: stateLabels[state],
    timezone: market.timezone
  };
}

function newestDate(dates: string[]) {
  if (dates.length === 0) return null;
  return dates.slice().sort().at(-1) ?? null;
}
