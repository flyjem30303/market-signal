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

export type MarketFact = {
  label: string;
  value: string;
  note: string;
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
  marketFacts: MarketFact[];
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
  { id: "trend", name: "價格趨勢", weight: 18, note: "觀察收盤價、均線與相對強弱，判斷趨勢是否延續。" },
  { id: "quality", name: "資料信心", weight: 18, note: "檢查資料是否完整、是否過期，以及是否能支撐公開解讀。" },
  { id: "valuation", name: "估值壓力", weight: 16, note: "用示範分數提醒市場是否偏熱，避免只看上漲動能。" },
  { id: "breadth", name: "市場廣度", weight: 14, note: "觀察上漲是否擴散到更多族群，而不是只集中在少數標的。" },
  { id: "flow", name: "資金動能", weight: 16, note: "用示範資金分數提醒買盤是否延續，或開始轉弱。" },
  { id: "macro", name: "風險背景", weight: 18, note: "整理市場波動、外部風險與資料限制，協助判斷是否需要保守。" }
] as const;

const signalRules: SignalRule[] = [
  {
    min: 75,
    key: "green",
    title: "偏多",
    text: "市場狀態偏正向，趨勢與資金條件相對健康，但仍需確認資料更新時間與風險來源。"
  },
  {
    min: 62,
    key: "yellow",
    title: "觀望偏多",
    text: "市場仍有支撐，但部分指標開始分歧，適合加強觀察而不是直接追價。"
  },
  {
    min: 48,
    key: "orange",
    title: "觀望",
    text: "多空訊號混合，建議先看原因、資料狀態與風險分數，再決定是否提高警覺。"
  },
  {
    min: 34,
    key: "red",
    title: "警戒",
    text: "風險分數偏高，應先確認弱勢是否擴散，並避免只用單一分數做判斷。"
  },
  {
    min: 0,
    key: "deep-red",
    title: "高風險",
    text: "市場狀態偏高風險，應先降低解讀信心，等待資料、趨勢與風險條件重新穩定。"
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
  runtimeBoundary:
    "Phase 1 使用 mock 資料建立閱讀流程；正式資料需要來源權利、品質檢查、寫入回讀與 promotion gate 全部通過後才會啟用。"
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
    staleDataFlags: ["Phase 1 使用示範資料；正式收盤價與交易資訊尚未切換到公開資料源。"],
    missingModuleFlags: ["新聞、基本面與完整歷史覆蓋尚未納入正式分數。"],
    modelVersion: "mock-v0.1",
    lastUpdatedAt: `${dateString}T14:30:00+08:00`,
    signal,
    modules: moduleDefinitions.map((definition, index) => {
      const health = clampScore(Math.round(compositeScore + (index - 2) * 4 + asset.quality * 8 - asset.beta * 2));
      const risk = clampScore(Math.round(riskScore + (index - 2) * 3 + asset.beta * 4));
      return { ...definition, health, risk };
    }),
    syntheticReturn: Number(((compositeScore - 52) / 18).toFixed(2)),
    marketFacts: buildMockMarketFacts(asset, dateString, compositeScore)
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
    title: "AI 與大型權值股仍是市場觀察主軸",
    summary: "這是示範市場事件，用來說明標的頁如何呈現新聞脈絡；目前不代表即時新聞，也不納入燈號分數。",
    category: "市場事件",
    impact: 2,
    assets: ["TWII", "2330", "2382"]
  },
  {
    date: "2026-05-28",
    source: "示範資料",
    title: "ETF 資金動能維持觀察",
    summary: "這是示範 ETF 觀察事件，用來測試指數與 ETF 頁的閱讀流程；目前不納入燈號分數。",
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

function buildMockMarketFacts(asset: Asset, dateString: string, compositeScore: number): MarketFact[] {
  if (asset.type === "index") {
    return [
      { label: "指數收盤", value: `${Math.round(14800 + compositeScore * 42).toLocaleString("zh-TW")} 點`, note: "示範值，正式資料尚未啟用" },
      { label: "日變動", value: `${compositeScore >= 55 ? "+" : "-"}${Math.abs(compositeScore - 55).toFixed(1)}%`, note: "用於版面驗證" },
      { label: "資料日期", value: dateString, note: "Phase 1 mock 時間戳" }
    ];
  }

  return [
    { label: asset.type === "etf" ? "ETF 收盤價" : "收盤價", value: `${Math.round(40 + compositeScore * 3.8).toLocaleString("zh-TW")} 元`, note: "示範值，正式資料尚未啟用" },
    { label: "日變動", value: `${compositeScore >= 55 ? "+" : "-"}${Math.abs(compositeScore - 55).toFixed(1)}%`, note: "用於版面驗證" },
    { label: "成交量", value: `${Math.round(1200 + compositeScore * 95).toLocaleString("zh-TW")} 張`, note: "示範值，正式資料尚未啟用" },
    { label: "資料日期", value: dateString, note: "Phase 1 mock 時間戳" }
  ];
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
