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
  const changeDirection = changePercent === null ? "尚無變化方向" : changePercent >= 0 ? "示範偏正向" : "示範偏保守";
  const status = wire.status === "ready" ? "可閱讀示範" : "暫停解讀";

  return {
    boundary: {
      publicDataSource: wire.boundary.publicDataSource,
      scoreSource: wire.boundary.scoreSource
    },
    cause:
      wire.status === "ready"
        ? `合成資料已通過 parser 到 runtime handoff，最新示範日期為 ${latestPoint?.tradeDate ?? "未標示"}，示範變化為 ${formatChangePercent(changePercent)}。`
        : "合成資料尚未形成可讀 runtime handoff，畫面維持 fail-closed。",
    impactLevel: "示範觀察",
    nextObservation:
      wire.status === "ready"
        ? "下一步等待資料支援線完成合法來源與 coverage handoff，再評估是否能進入正式資料 gate。"
        : "下一步先修 parser / handoff，避免首頁顯示不可解讀的市場狀態。",
    safetyLine: "目前只用合成資料演練產品體驗；不代表即時市場、不提供買賣建議，也不啟用真實分數。",
    status,
    summary:
      wire.status === "ready"
        ? `TWII mock runtime 已能讀取 ${wire.handoff.pointCount} 筆合成點位，提供市場氛圍示範：${changeDirection}。`
        : "TWII mock runtime 尚未準備好，暫不提供市場氛圍示範。",
    updatedAtLabel: latestPoint?.tradeDate ?? "尚無示範日期"
  };
}

function formatChangePercent(value: number | null): string {
  if (value === null) return "n/a";
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}
