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
    note: "觀察均線、動能與近期方向，協助判斷市場是否仍在偏多結構。"
  },
  {
    id: "quality",
    name: "基本面品質",
    weight: 18,
    note: "用穩定度、獲利品質與產業位置建立基礎信心，避免只看短線價格。"
  },
  {
    id: "valuation",
    name: "評價壓力",
    weight: 16,
    note: "評估價格是否已反映過高期待，提醒使用者注意追高風險。"
  },
  {
    id: "breadth",
    name: "市場廣度",
    weight: 14,
    note: "觀察上漲家數與族群擴散程度，判斷行情是否只集中在少數標的。"
  },
  {
    id: "flow",
    name: "資金流向",
    weight: 16,
    note: "追蹤資金是否仍支撐主要指數與大型權值股。"
  },
  {
    id: "macro",
    name: "總體風險",
    weight: 18,
    note: "納入利率、匯率、波動與外部風險，避免忽略市場背景。"
  }
] as const;

const signalRules: SignalRule[] = [
  {
    min: 75,
    key: "green",
    title: "偏多",
    text: "市場結構偏正向，趨勢與資金條件相對支撐，但仍需留意資料更新時間與風險變化。"
  },
  {
    min: 62,
    key: "yellow",
    title: "偏多觀察",
    text: "市場仍有支撐，但部分指標進入觀察區，適合加強複核風險與族群擴散。"
  },
  {
    min: 48,
    key: "orange",
    title: "觀望",
    text: "市場訊號分歧，短線方向尚不穩定，建議先看資料品質、風險分數與後續確認訊號。"
  },
  {
    min: 34,
    key: "red",
    title: "警戒",
    text: "風險條件升高，趨勢支撐不足，應優先檢查是否需要降低曝險或等待訊號改善。"
  },
  {
    min: 0,
    key: "deep-red",
    title: "高風險",
    text: "市場狀態偏弱且風險集中，應避免只用單一指標判斷，先等待資料與趨勢回穩。"
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
  runtimeBoundary: "尚未切換正式每日資料流程"
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
    staleDataFlags: ["目前為公開 Beta 模擬資料，尚未完成正式資料切換條件。"],
    missingModuleFlags: ["資料來源、寫入回讀與錯誤降級仍在第一階段資料上線流程中。"],
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
    source: "模擬資料",
    title: "AI 相關族群維持市場關注",
    summary: "模擬資料顯示大型科技與 AI 供應鏈仍是市場觀察重點，但公開版仍需等待真實資料上線後才能作為正式更新來源。",
    category: "市場狀態",
    impact: 2,
    assets: ["TWII", "2330", "2382"]
  },
  {
    date: "2026-05-28",
    source: "模擬資料",
    title: "ETF 觀察仍待來源權利確認",
    summary: "ETF 相關資料在第一階段仍需完成來源權利、欄位合約與回填流程，前台不得宣稱為即時真實資料。",
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
