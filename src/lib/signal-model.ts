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
    name: "趨勢動能",
    weight: 18,
    note: "觀察價格相對均線與短期動能，協助判斷市場是否仍維持偏多結構。"
  },
  {
    id: "quality",
    name: "品質與韌性",
    weight: 18,
    note: "觀察基本面穩定度與下跌時的防禦力，避免只看短線漲跌。"
  },
  {
    id: "valuation",
    name: "估值壓力",
    weight: 16,
    note: "估值越緊繃，市場對利空與波動越敏感，需搭配趨勢一起解讀。"
  },
  {
    id: "breadth",
    name: "市場廣度",
    weight: 14,
    note: "觀察上漲是否由多數標的共同支撐，或只集中在少數權值標的。"
  },
  {
    id: "flow",
    name: "資金流向",
    weight: 16,
    note: "觀察資金是否仍願意留在市場與核心族群，作為燈號轉弱的早期線索。"
  },
  {
    id: "macro",
    name: "總體風險",
    weight: 18,
    note: "納入利率、匯率、國際風險與波動情境，避免單看本地市場。"
  }
] as const;

const signalRules: SignalRule[] = [
  {
    min: 75,
    key: "green",
    title: "偏多",
    text: "市場動能與資金狀態較健康，適合持續觀察趨勢延續，但仍需留意估值與集中度。"
  },
  {
    min: 62,
    key: "yellow",
    title: "偏多觀察",
    text: "市場仍有支撐，但部分風險開始升高，建議確認關鍵指標是否同步。"
  },
  {
    min: 48,
    key: "orange",
    title: "觀望",
    text: "多空訊號混雜，適合降低追價衝動，等待趨勢、資金或風險訊號更明確。"
  },
  {
    min: 34,
    key: "red",
    title: "警戒",
    text: "風險訊號升高，建議優先檢查部位集中度、停損規則與資料更新狀態。"
  },
  {
    min: 0,
    key: "deep-red",
    title: "高風險",
    text: "市場狀態偏弱且風險集中，應以風險控管與等待確認為主。"
  }
];

const signalColors: Record<SignalKey, string> = {
  green: "#0f9f6e",
  yellow: "#d6a100",
  orange: "#e67824",
  red: "#d64545",
  "deep-red": "#8f1f2f"
};

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
    staleDataFlags: ["目前為示範資料，尚未接入正式每日資料更新"],
    missingModuleFlags: ["正式資料覆蓋率與來源權利仍在補齊"],
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
    title: "AI 與權值族群維持市場關注",
    summary: "示範資料顯示市場焦點仍集中在 AI、半導體與主要 ETF，適合觀察資金是否擴散。",
    category: "市場狀態",
    impact: 2,
    assets: ["TWII", "2330", "2382"]
  },
  {
    date: "2026-05-28",
    source: "示範資料",
    title: "ETF 表現穩定但仍需追蹤成交量",
    summary: "ETF 示範資料顯示整體波動較低，後續需觀察量能與指數同步性。",
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
