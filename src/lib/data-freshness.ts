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
  complete: "資料完整",
  partial: "資料部分更新",
  stale: "資料可能過期",
  mock: "示範資料",
  unavailable: "資料暫不可用"
};

const stateDescriptions: Record<DataFreshnessState, string> = {
  complete: "正式資料已完成讀取，前台仍會揭露資料日期、來源與非投資建議邊界。",
  partial: "部分資料已更新，但仍有缺口；使用時請優先確認缺漏範圍。",
  stale: "資料更新時間落後，請避免只用單一燈號做判斷。",
  mock: "目前公開頁使用示範資料，目的在驗證閱讀流程與燈號呈現，不代表真實市場狀態。",
  unavailable: "目前無法取得資料更新狀態；前台會保守揭露並避免誤導。"
};

export function buildMockDataFreshnessSnapshot(): DataFreshnessSnapshot {
  return {
    asOfDate: "示範資料",
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
  const dailyScoreRun = dataRuns.find((run) => run.target_table === "daily_scores");
  const rows = [dailyPriceRun, dailyScoreRun].filter((row): row is DataRunFreshnessRow => Boolean(row));

  if (rows.length === 0) {
    return {
      asOfDate: "-",
      currency: market.currency,
      description: stateDescriptions.unavailable,
      isMock: false,
      market: market.exchange,
      scoreSource: "unavailable",
      scoreSourceLabel: "分數暫不可用",
      sourceName: "正式資料",
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
    scoreSource: "mixed",
    scoreSourceLabel: "正式資料狀態",
    sourceName: sourceNames || "正式資料",
    state,
    stateLabel: stateLabels[state],
    timezone: market.timezone
  };
}

function newestDate(dates: string[]) {
  if (dates.length === 0) return null;
  return dates.slice().sort().at(-1) ?? null;
}
