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
  {
    id: "trend",
    name: "趨勢強弱",
    weight: 18,
    note: "觀察價格與均線方向，協助判斷市場是否仍維持偏多或轉弱。"
  },
  {
    id: "quality",
    name: "資料品質",
    weight: 18,
    note: "檢查資料完整度、更新時間與模型可讀性，避免使用者誤判。"
  },
  {
    id: "valuation",
    name: "評價壓力",
    weight: 16,
    note: "用估值與風險分數提醒使用者，市場是否已經偏熱或需要保守觀察。"
  },
  {
    id: "breadth",
    name: "市場廣度",
    weight: 14,
    note: "觀察上漲或轉弱是否集中在少數標的，或已擴散到更多市場類別。"
  },
  {
    id: "flow",
    name: "資金流向",
    weight: 16,
    note: "用資金動能輔助判斷市場氛圍，不作為單一買賣依據。"
  },
  {
    id: "macro",
    name: "風險環境",
    weight: 18,
    note: "納入波動、外部風險與情境提醒，協助使用者設定觀察重點。"
  }
] as const;

const signalRules: SignalRule[] = [
  {
    min: 75,
    key: "green",
    title: "偏多",
    text: "市場狀態相對健康，可持續觀察趨勢延續，但仍需注意資料來源與更新時間。"
  },
  {
    min: 62,
    key: "yellow",
    title: "偏多觀察",
    text: "市場仍有支撐，但風險開始累積，適合加強觀察而不是只看單一分數。"
  },
  {
    min: 48,
    key: "orange",
    title: "觀望",
    text: "市場訊號分歧，建議先確認趨勢、風險與資料品質，再決定是否提高關注。"
  },
  {
    min: 34,
    key: "red",
    title: "警戒",
    text: "風險分數偏高，應降低衝動決策，優先確認是否有資料延遲或異常。"
  },
  {
    min: 0,
    key: "deep-red",
    title: "高風險",
    text: "市場狀態偏弱，建議先保守觀察，等待風險緩和或資料更新後再評估。"
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
  runtimeBoundary: "目前公開頁仍使用示範資料與示範分數；真實資料上線前會保留清楚標示。"
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
    staleDataFlags: ["目前為公開 Beta 示範資料，尚未切換為完整真實資料來源。"],
    missingModuleFlags: ["部分資料覆蓋率仍在補齊，真實資料上線前不宣稱即時或完整。"],
    modelVersion: "mock-v0.1",
    lastUpdatedAt: `${dateString}T14:30:00+08:00`,
    signal,
    modules: moduleDefinitions.map((definition, index) => {
      const health = clampScore(Math.round(compositeScore + (index - 2) * 4 + asset.quality * 8 - asset.beta * 2));
      const risk = clampScore(Math.round(riskScore + (index - 2) * 3 + asset.beta * 4));
      return {
        ...definition,
        health,
        risk
      };
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
    title: "AI 題材延續帶動大型權值股觀察",
    summary: "示範事件用來說明市場解讀方式，並非即時新聞或投資建議。",
    category: "市場觀察",
    impact: 2,
    assets: ["TWII", "2330", "2382"]
  },
  {
    date: "2026-05-28",
    source: "示範資料",
    title: "ETF 觀察樣本維持偏多但仍需確認來源",
    summary: "示範事件用來呈現 ETF 觀察脈絡，真實資料仍需通過資料來源 gate。",
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
