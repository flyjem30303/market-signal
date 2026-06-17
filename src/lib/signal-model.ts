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
  { id: "trend", name: "趨勢強弱", weight: 18, note: "觀察均線方向、動能與價格位置，用來判斷市場是否仍有延續力。" },
  { id: "quality", name: "資料品質", weight: 18, note: "檢查資料更新時間、來源一致性與缺漏狀態，避免用錯資料做判斷。" },
  { id: "valuation", name: "估值壓力", weight: 16, note: "用簡化分數呈現評價壓力，不作為個股買賣建議。" },
  { id: "breadth", name: "市場廣度", weight: 14, note: "觀察上漲家數與族群擴散程度，避免只看少數權值股。" },
  { id: "flow", name: "資金動向", weight: 16, note: "觀察資金是否仍偏向風險資產，協助判斷市場溫度。" },
  { id: "macro", name: "總體風險", weight: 18, note: "用利率、匯率與外部風險作為背景提醒，不直接產生交易指令。" }
] as const;

const signalRules: SignalRule[] = [
  {
    min: 75,
    key: "green",
    title: "偏多",
    text: "市場狀態偏強，但仍應確認資料更新時間與風險提示。適合維持觀察，不代表保證上漲。"
  },
  {
    min: 62,
    key: "yellow",
    title: "中性偏多",
    text: "市場仍有支撐，但部分指標開始分歧。適合加強觀察資金、廣度與波動變化。"
  },
  {
    min: 48,
    key: "orange",
    title: "觀望",
    text: "市場方向不夠一致，短線訊號容易反覆。適合降低追價衝動，等待更清楚的確認。"
  },
  {
    min: 34,
    key: "red",
    title: "警戒",
    text: "風險訊號升高，應優先確認部位承受度與資料是否更新，避免只看單一指標。"
  },
  {
    min: 0,
    key: "deep-red",
    title: "高風險",
    text: "多數風險條件不利，適合先保守觀察並等待風險緩和。本訊號不是賣出指令。"
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
  runtimeBoundary: "目前公開頁使用示範資料與示範分數；正式資料來源、覆蓋率與品質檢查通過後才可切換。"
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
    staleDataFlags: ["目前為示範資料；正式資料切換前會顯示來源與更新時間。"],
    missingModuleFlags: ["新聞評分與 ETF 全量覆蓋會在後續版本補齊。"],
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
    source: "示範事件",
    title: "AI 供應鏈仍是市場關注主軸",
    summary: "此事件用來呈現市場脈絡區塊。新聞資訊目前只作為閱讀輔助，不納入正式燈號分數。",
    category: "產業觀察",
    impact: 2,
    assets: ["TWII", "2330", "2382"]
  },
  {
    date: "2026-05-28",
    source: "示範事件",
    title: "ETF 資金流向維持觀察",
    summary: "此事件用來說明資金流如何輔助市場判斷；正式資料上線前不作為投資建議。",
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
        note: "示範資料，用來呈現市場總覽與燈號閱讀方式。"
      },
      {
        label: "當日變化",
        value: `${compositeScore >= 55 ? "+" : "-"}${Math.abs(compositeScore - 55).toFixed(1)}%`,
        note: "示範變化，不代表正式行情。"
      },
      {
        label: "資料日期",
        value: dateString,
        note: "正式資料切換後會顯示實際來源與更新時間。"
      }
    ];
  }

  return [
    {
      label: asset.type === "etf" ? "ETF 參考價" : "收盤價",
      value: `${Math.round(40 + compositeScore * 3.8).toLocaleString("zh-TW")} 元`,
      note: "示範資料，用來呈現標的頁資訊層級。"
    },
    {
      label: "當日變化",
      value: `${compositeScore >= 55 ? "+" : "-"}${Math.abs(compositeScore - 55).toFixed(1)}%`,
      note: "示範變化，不代表正式行情。"
    },
    {
      label: "成交量",
      value: `${Math.round(1200 + compositeScore * 95).toLocaleString("zh-TW")} 張`,
      note: "示範成交量，用於版面與決策輔助流程驗證。"
    },
    {
      label: "資料日期",
      value: dateString,
      note: "正式資料切換後會顯示實際來源與更新時間。"
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
