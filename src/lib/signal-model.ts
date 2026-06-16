import type { Asset } from "./assets";

export type SignalKey = "green" | "yellow" | "orange" | "red" | "deep-red";

export type SignalRule = {
  min: number;
  key: SignalKey;
  title: string;
  text: string;
};

export type ModuleScore = {
  id: string;
  name: string;
  note: string;
  weight: number;
  health: number;
  risk: number;
};

export type SignalSnapshot = {
  asset: Asset;
  date: string;
  healthScore: number;
  riskScore: number;
  compositeScore: number;
  dataQualityScore: number;
  dataQualityGrade: "A" | "B" | "C" | "D";
  staleDataFlags: string[];
  missingModuleFlags: string[];
  modelVersion: string;
  lastUpdatedAt: string;
  signal: SignalRule;
  modules: ModuleScore[];
  syntheticReturn: number;
};

export type NewsEvent = {
  date: string;
  source: string;
  title: string;
  summary: string;
  category: string;
  impact: number;
  assets: string[];
};

export type BacktestBucket = {
  signal: SignalRule;
  count: number;
  avgReturn: number;
  winRate: number;
  maxDrawdown: number;
};

const moduleDefinitions = [
  { id: "trend", name: "趨勢動能", weight: 18, note: "觀察價格相對均線與動能位置，用來判斷市場是否仍有延續力。" },
  { id: "quality", name: "資料品質", weight: 18, note: "標示目前資料是否完整、可追溯，以及是否仍屬示範資料。" },
  { id: "valuation", name: "估值位置", weight: 16, note: "用相對位置提示市場是否偏熱或偏冷，不作為買賣建議。" },
  { id: "breadth", name: "市場廣度", weight: 14, note: "觀察強勢是否集中在少數標的，或擴散到更多類股。" },
  { id: "flow", name: "資金流向", weight: 16, note: "用資金與成交變化輔助判斷市場是否有追價或退潮跡象。" },
  { id: "macro", name: "風險背景", weight: 18, note: "綜合波動、利率與外部風險，提醒是否需要降低解讀信心。" }
] as const;

const signalRules: SignalRule[] = [
  {
    min: 75,
    key: "green",
    title: "偏多",
    text: "市場狀態偏正向，但仍應搭配風險分數、更新時間與資料來源一起判讀。"
  },
  {
    min: 62,
    key: "yellow",
    title: "偏多觀察",
    text: "市場仍有支撐，但部分風險開始浮現，適合加強觀察而不是盲目追價。"
  },
  {
    min: 48,
    key: "orange",
    title: "觀望",
    text: "訊號分歧，市場方向不夠明確，建議等待更多確認訊號。"
  },
  {
    min: 34,
    key: "red",
    title: "警戒",
    text: "風險升高，應提高防守意識，避免只看單一指標做判斷。"
  },
  {
    min: 0,
    key: "deep-red",
    title: "高風險",
    text: "市場處於高風險區，適合先檢查曝險、資料新鮮度與風險來源。"
  }
];

const signalColors: Record<SignalKey, string> = {
  green: "#0f9f6e",
  yellow: "#d6a100",
  orange: "#e67824",
  red: "#d64545",
  "deep-red": "#8f1f2f"
};

export const publicSignalDataDisclosureNotes = {
  dataMode: "示範資料",
  runtimeBoundary: "Phase 1 公開版仍以 mock 燈號呈現；真實資料 promotion 需通過來源、品質、更新時間與回退檢查。"
} as const;

export function signalColor(key: SignalKey) {
  return signalColors[key];
}

export function buildSignalSnapshot(asset: Asset, date: Date | string): SignalSnapshot {
  const dateString = normalizeDate(date);
  const compositeScore = clampScore(
    Math.round(asset.ai * 25 + asset.quality * 24 + asset.valuation * 18 + asset.flow * 18 + (1.35 - asset.beta) * 12 + 8)
  );
  const healthScore = clampScore(Math.round((asset.quality + asset.ai + asset.flow) * 28));
  const riskScore = clampScore(Math.round((asset.beta * 28 + (1 - asset.valuation) * 34 + (1 - asset.flow) * 24) * 1.05));
  const dataQualityScore = 66;
  const signal = signalRules.find((rule) => compositeScore >= rule.min) ?? signalRules.at(-1)!;

  return {
    asset,
    date: dateString,
    healthScore,
    riskScore,
    compositeScore,
    dataQualityScore,
    dataQualityGrade: "C",
    staleDataFlags: ["Phase 1 目前使用示範資料與受控資料流程，尚未升級為正式即時資料。"],
    missingModuleFlags: ["部分進階資料模組仍待來源與品質 gate 完成後才會開放。"],
    modelVersion: "mock-v0.1",
    lastUpdatedAt: `${dateString}T14:30:00+08:00`,
    signal,
    modules: moduleDefinitions.map((definition, index) => {
      const health = clampScore(Math.round(compositeScore + (index - 2) * 4 + asset.quality * 8 - asset.beta * 2));
      const risk = clampScore(Math.round(riskScore + (index - 2) * 3 + asset.beta * 4));
      return { ...definition, health, risk };
    }),
    syntheticReturn: Number(((compositeScore - 52) / 18).toFixed(2))
  };
}

export function buildSignalSeries(asset: Asset, startDate: string, endDateOrDays: string | number = 20) {
  const start = new Date(`${startDate}T00:00:00+08:00`);
  const days =
    typeof endDateOrDays === "number"
      ? endDateOrDays
      : Math.max(
          1,
          Math.min(40, Math.floor((new Date(`${endDateOrDays}T00:00:00+08:00`).getTime() - start.getTime()) / 86400000) + 1)
        );

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const dateString = date.toISOString().slice(0, 10);
    const drift = Math.sin(index / 3) * 5;
    const adjustedAsset = {
      ...asset,
      ai: clampRatio(asset.ai + drift / 100),
      flow: clampRatio(asset.flow + Math.cos(index / 4) / 20)
    };
    return buildSignalSnapshot(adjustedAsset, dateString);
  });
}

export const newsEvents: NewsEvent[] = [
  {
    date: "2026-05-28",
    source: "示範資料",
    title: "AI 題材維持關注，電子權值股支撐市場情緒",
    summary: "示範事件用於呈現產品閱讀流程，尚未代表真實新聞或投資建議。",
    category: "市場觀察",
    impact: 2,
    assets: ["TWII", "2330", "2382"]
  },
  {
    date: "2026-05-28",
    source: "示範資料",
    title: "ETF 量能穩定，市場總覽維持觀察區間",
    summary: "示範事件用於呈現 ETF 與指數的關聯閱讀，不代表即時市場資料。",
    category: "ETF",
    impact: 1,
    assets: ["0050", "006208"]
  }
];

export function findRelatedNews(assetOrSymbol: Asset | string, _date?: string) {
  const symbol = typeof assetOrSymbol === "string" ? assetOrSymbol : assetOrSymbol.symbol;
  return newsEvents.filter((event) => event.assets.includes(symbol));
}

export function buildBacktestBuckets(_series?: SignalSnapshot[]): BacktestBucket[] {
  return signalRules.map((signal, index) => ({
    signal,
    count: 20 + index * 8,
    avgReturn: Number(((signal.min - 45) / 16).toFixed(2)),
    winRate: clampScore(52 + index * 6),
    maxDrawdown: Number((-(index + 1) * 2.4).toFixed(1))
  }));
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

function clampRatio(value: number) {
  return Math.max(0, Math.min(1, value));
}

function normalizeDate(value: Date | string) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value.slice(0, 10);
}
