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
  { id: "trend", name: "趨勢強弱", weight: 18, note: "觀察價格方向與動能是否延續。" },
  { id: "quality", name: "資料品質", weight: 18, note: "確認資料是否完整、可讀且有更新時間。" },
  { id: "valuation", name: "估值壓力", weight: 16, note: "用來提醒價格是否已偏離合理區間。" },
  { id: "breadth", name: "市場廣度", weight: 14, note: "觀察強勢是否擴散到多數標的。" },
  { id: "flow", name: "資金動向", weight: 16, note: "觀察資金是否支持目前方向。" },
  { id: "macro", name: "總體風險", weight: 18, note: "納入市場風險與外部不確定性。" }
] as const;

const signalRules: SignalRule[] = [
  {
    min: 75,
    key: "green",
    title: "偏多",
    text: "市場動能與風險條件相對健康，可維持觀察，但仍需留意資料更新時間與突發風險。"
  },
  {
    min: 62,
    key: "yellow",
    title: "偏多觀察",
    text: "市場仍有支撐，但訊號開始分歧，適合加強觀察而不是追逐單一數字。"
  },
  {
    min: 48,
    key: "orange",
    title: "觀望",
    text: "趨勢與風險訊號混合，建議先確認市場廣度與資料狀態，再決定是否提高關注。"
  },
  {
    min: 34,
    key: "red",
    title: "警戒",
    text: "風險訊號升高，應降低對單一強勢訊號的依賴，並確認是否有擴散跡象。"
  },
  {
    min: 0,
    key: "deep-red",
    title: "高風險",
    text: "多數訊號偏弱，應以風險控管與資料確認為優先，不宜只看短線反彈。"
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
    "目前前台仍以示範資料呈現燈號邏輯。資料覆蓋與寫入閉環已完成一輪驗證，但正式資料來源與分數切換仍需另行審核。"
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
  const dataQualityScore = 85;
  const signal = signalRules.find((rule) => compositeScore >= rule.min) ?? signalRules.at(-1)!;

  return {
    asset,
    date: dateString,
    healthScore,
    riskScore,
    compositeScore,
    dataQualityScore,
    dataQualityGrade: "B",
    staleDataFlags: ["目前仍為示範資料；正式資料來源切換前，請以資料狀態與更新時間作為判讀前提。"],
    missingModuleFlags: ["新聞情緒與完整產業資金流尚未納入目前公開分數。"],
    modelVersion: "public-demo-v0.2",
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
    title: "AI 供應鏈維持市場關注",
    summary: "示範事件用來說明新聞模組未來如何影響燈號，目前不納入正式分數。",
    category: "產業動能",
    impact: 2,
    assets: ["TWII", "2330", "2382"]
  },
  {
    date: "2026-05-28",
    source: "示範資料",
    title: "ETF 資金流向仍需觀察",
    summary: "ETF 相關資訊仍在資料來源與覆蓋率確認中，公開頁先維持示範讀法。",
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
      {
        label: "指數點位",
        value: `${Math.round(14800 + compositeScore * 42).toLocaleString("zh-TW")} 點`,
        note: "示範資料，用於呈現市場狀態讀法。"
      },
      {
        label: "一日變化",
        value: `${compositeScore >= 55 ? "+" : "-"}${Math.abs(compositeScore - 55).toFixed(1)}%`,
        note: "依示範分數推估的方向，不代表正式行情。"
      },
      {
        label: "資料日期",
        value: dateString,
        note: "正式資料切換前皆標示為示範資料。"
      }
    ];
  }

  return [
    {
      label: asset.type === "etf" ? "ETF 估算價格" : "估算收盤價",
      value: `${Math.round(40 + compositeScore * 3.8).toLocaleString("zh-TW")} 元`,
      note: "示範資料，用於 UI 與流程驗證。"
    },
    {
      label: "一日變化",
      value: `${compositeScore >= 55 ? "+" : "-"}${Math.abs(compositeScore - 55).toFixed(1)}%`,
      note: "依示範分數推估的方向，不代表正式行情。"
    },
    {
      label: "成交量級",
      value: `${Math.round(1200 + compositeScore * 95).toLocaleString("zh-TW")} 張`,
      note: "示範量級，正式資料來源切換前不可作投資判斷。"
    },
    {
      label: "資料日期",
      value: dateString,
      note: "正式資料切換前皆標示為示範資料。"
    }
  ];
}

function normalizeDate(date: Date | string) {
  if (typeof date === "string") return date;
  return date.toISOString().slice(0, 10);
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

function clampRatio(value: number) {
  return Math.max(0, Math.min(1, value));
}
