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
  { id: "trend", name: "趨勢強弱", weight: 18, note: "觀察價格方向、均線位置與動能是否支持目前燈號。" },
  { id: "quality", name: "資料品質", weight: 18, note: "檢查資料是否完整、是否延遲，以及是否適合公開呈現。" },
  { id: "valuation", name: "估值壓力", weight: 16, note: "觀察價格是否偏離常態區間，避免只看漲跌幅。" },
  { id: "breadth", name: "市場廣度", weight: 14, note: "觀察上漲家數、產業擴散與市場參與度。" },
  { id: "flow", name: "資金流向", weight: 16, note: "觀察成交量與資金是否支持目前市場狀態。" },
  { id: "macro", name: "風險環境", weight: 18, note: "觀察波動、外部風險與市場情緒是否升高。" }
] as const;

const signalRules: SignalRule[] = [
  {
    min: 75,
    key: "green",
    title: "偏多",
    text: "市場狀態偏多，但仍應確認資料更新時間與風險提示。"
  },
  {
    min: 62,
    key: "yellow",
    title: "偏多觀察",
    text: "市場仍偏正向，但部分風險開始升高，適合加強觀察。"
  },
  {
    min: 48,
    key: "orange",
    title: "觀望",
    text: "市場訊號分歧，建議先看主要風險來源與資料品質。"
  },
  {
    min: 34,
    key: "red",
    title: "警戒",
    text: "風險升高，應降低單一訊號依賴，並等待資料與趨勢確認。"
  },
  {
    min: 0,
    key: "deep-red",
    title: "高風險",
    text: "市場處於高風險狀態，需優先確認風險承受度與資料可靠性。"
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
  runtimeBoundary: "目前前台使用示範資料；正式資料需完成來源權利、覆蓋率、品質與寫入回讀檢查。"
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
    staleDataFlags: ["目前為公開 Beta 示範資料，尚未宣稱正式即時資料。"],
    missingModuleFlags: ["正式資料覆蓋率仍在補齊，請先以閱讀流程與資料邊界為主。"],
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
    title: "AI 題材維持關注，市場仍需觀察風險擴散",
    summary: "示範摘要用於呈現市場解讀格式，不代表正式新聞或投資建議。",
    category: "市場觀察",
    impact: 2,
    assets: ["TWII", "2330", "2382"]
  },
  {
    date: "2026-05-28",
    source: "示範資料",
    title: "ETF 觀察重點轉向資料覆蓋與更新時間",
    summary: "示範摘要用於呈現 ETF 觀察方式，正式資料上線前不作即時宣稱。",
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
