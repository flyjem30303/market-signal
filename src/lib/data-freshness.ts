export type DataFreshnessState = "complete" | "partial" | "stale" | "mock" | "unavailable";

export type DataFreshnessSnapshot = {
  asOfDate: string;
  currency: string;
  isMock: boolean;
  market: string;
  sourceName: string;
  state: DataFreshnessState;
  stateLabel: string;
  timezone: string;
};

const stateLabels: Record<DataFreshnessState, string> = {
  complete: "完整",
  partial: "部分",
  stale: "延遲",
  mock: "模擬",
  unavailable: "不可用"
};

export function buildMockDataFreshnessSnapshot(): DataFreshnessSnapshot {
  return {
    asOfDate: "2026-05-28",
    currency: "TWD",
    isMock: true,
    market: "TWSE",
    sourceName: "Mock repository",
    state: "mock",
    stateLabel: stateLabels.mock,
    timezone: "Asia/Taipei"
  };
}
