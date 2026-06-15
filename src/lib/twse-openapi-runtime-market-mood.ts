import { getTwseOpenApiRuntimeMockConsumerWireSummary } from "@/lib/twse-openapi-runtime-mock-consumer-wire";

export type TwseOpenApiRuntimeMarketMood = {
  boundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
  };
  cause: string;
  impactLevel: "中等影響";
  nextObservation: string;
  safetyLine: string;
  status: "示範資料可讀" | "示範資料暫停";
  summary: string;
  updatedAtLabel: string;
};

export function getTwseOpenApiRuntimeMarketMood(): TwseOpenApiRuntimeMarketMood {
  const wire = getTwseOpenApiRuntimeMockConsumerWireSummary();
  const latestPoint = wire.handoff.latestPoint;
  const changePercent = wire.handoff.runtimeChange.changePercent;
  const changeDirection = changePercent === null ? "尚無可比較變化" : changePercent >= 0 ? "短線偏強" : "短線轉弱";
  const status = wire.status === "ready" ? "示範資料可讀" : "示範資料暫停";

  return {
    boundary: {
      publicDataSource: wire.boundary.publicDataSource,
      scoreSource: wire.boundary.scoreSource
    },
    cause:
      wire.status === "ready"
        ? `目前以合成資料驗證 parser 到 runtime 的接線，最新示範日期為 ${latestPoint?.tradeDate ?? "尚未產生"}，變化幅度為 ${formatChangePercent(changePercent)}。`
        : "合成資料尚未通過 parser / runtime handoff，公開頁維持 fail-closed 示範狀態。",
    impactLevel: "中等影響",
    nextObservation:
      wire.status === "ready"
        ? "下一步觀察資料來源權利、覆蓋率與寫入 gate 是否通過；通過前不啟用正式資料。"
        : "下一步先修復 parser 或 handoff，再回到公開頁可讀性檢查。",
    safetyLine: "目前仍是示範資料與示範分數，不提供買賣建議，也不代表正式資料已上線。",
    status,
    summary:
      wire.status === "ready"
        ? `TWSE OpenAPI runtime 示範接線已可讀，包含 ${wire.handoff.pointCount} 筆合成資料點，市場脈絡判讀為${changeDirection}。`
        : "TWSE OpenAPI runtime 示範接線暫停，公開頁不應宣稱真實資料可用。",
    updatedAtLabel: latestPoint?.tradeDate ?? "尚無示範日期"
  };
}

function formatChangePercent(value: number | null): string {
  if (value === null) return "n/a";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}
