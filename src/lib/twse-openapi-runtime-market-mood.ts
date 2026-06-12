import { getTwseOpenApiRuntimeMockConsumerWireSummary } from "@/lib/twse-openapi-runtime-mock-consumer-wire";

export type TwseOpenApiRuntimeMarketMood = {
  boundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
  };
  cause: string;
  impactLevel: "示範觀察";
  nextObservation: string;
  safetyLine: string;
  status: "可閱讀示範" | "暫停解讀";
  summary: string;
  updatedAtLabel: string;
};

export function getTwseOpenApiRuntimeMarketMood(): TwseOpenApiRuntimeMarketMood {
  const wire = getTwseOpenApiRuntimeMockConsumerWireSummary();
  const latestPoint = wire.handoff.latestPoint;
  const changePercent = wire.handoff.runtimeChange.changePercent;
  const changeDirection = changePercent === null ? "尚無可比前期" : changePercent >= 0 ? "示範偏穩" : "示範轉弱";
  const status = wire.status === "ready" ? "可閱讀示範" : "暫停解讀";

  return {
    boundary: {
      publicDataSource: wire.boundary.publicDataSource,
      scoreSource: wire.boundary.scoreSource
    },
    cause:
      wire.status === "ready"
        ? `合成資料已通過 parser 與 runtime handoff，最新示範日期為 ${latestPoint?.tradeDate ?? "未產生"}，短線變化為 ${formatChangePercent(changePercent)}。`
        : "合成資料尚未通過 runtime handoff，公開頁必須維持 fail-closed。",
    impactLevel: "示範觀察",
    nextObservation:
      wire.status === "ready"
        ? "先用這張卡確認市場氛圍文案、成因欄位與資料限制是否清楚；等資料支援線完成後再替換為正式資料 gate。"
        : "先修復 parser / handoff 問題，再恢復市場氛圍解讀。",
    safetyLine:
      "目前只用合成資料演練產品體驗；不代表即時市場、不提供買賣建議，也不啟用真實分數。",
    status,
    summary:
      wire.status === "ready"
        ? `TWII mock runtime 已可產生 ${wire.handoff.pointCount} 筆示範點位，市場氛圍為「${changeDirection}」。`
        : "TWII mock runtime 尚未能形成可閱讀摘要。",
    updatedAtLabel: latestPoint?.tradeDate ?? "尚無示範日期"
  };
}

function formatChangePercent(value: number | null): string {
  if (value === null) return "n/a";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}
