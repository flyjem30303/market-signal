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
  complete: "資料已更新",
  partial: "資料部分可用",
  stale: "資料可能延遲",
  mock: "示範資料",
  unavailable: "資料暫不可用"
};

const stateDescriptions: Record<DataFreshnessState, string> = {
  complete: "資料流程已回報完成；仍請以頁面更新時間與風險聲明作為判讀邊界。",
  partial: "部分資料流程尚未完整，頁面只提供可驗證範圍內的市場狀態整理。",
  stale: "資料更新時間較舊，請先把燈號視為觀察提醒，不要當成即時判斷。",
  mock: "目前使用示範資料與示範分數，用來展示市場燈號閱讀流程；正式資料尚未啟用。",
  unavailable: "目前無法取得資料更新狀態，請等待下一次資料流程或查看方法說明。"
};

export function buildMockDataFreshnessSnapshot(): DataFreshnessSnapshot {
  return {
    asOfDate: "示範更新時間",
    currency: "TWD",
    description: stateDescriptions.mock,
    isMock: true,
    market: "TWSE",
    scoreSource: "mock",
    scoreSourceLabel: "示範分數",
    sourceName: "示範資料",
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
      scoreSourceLabel: "示範分數",
      sourceName: "資料來源尚未回報",
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
    scoreSourceLabel: "示範分數",
    sourceName: sourceNames || "資料來源尚未回報",
    state,
    stateLabel: stateLabels[state],
    timezone: market.timezone
  };
}

function newestDate(dates: string[]) {
  if (dates.length === 0) return null;
  return dates.slice().sort().at(-1) ?? null;
}
