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
  { id: "trend", name: "價格趨勢", weight: 18, note: "均線結構、動能與相對強弱。" },
  { id: "earnings", name: "獲利基本面", weight: 18, note: "營收、EPS、品質與展望。" },
  { id: "valuation", name: "估值壓力", weight: 16, note: "PE、PB、殖利率與風險溢酬。" },
  { id: "breadth", name: "市場廣度/族群", weight: 14, note: "同族群擴散、站上均線比例與集中度。" },
  { id: "flow", name: "籌碼資金", weight: 16, note: "外資、主力、融資、成交熱度。" },
  { id: "macro", name: "宏觀與產業上游", weight: 18, note: "利率、匯率、AI CAPEX、景氣循環。" }
];

const signalRules: SignalRule[] = [
  { min: 75, key: "green", title: "綠燈", text: "趨勢與基本面仍支持風險資產。" },
  { min: 62, key: "yellow", title: "黃燈", text: "多頭仍在，但估值或情緒開始升溫。" },
  { min: 48, key: "orange", title: "橘燈", text: "健康度與風險開始背離。" },
  { min: 34, key: "red", title: "紅燈", text: "多個模組轉弱，防守優先。" },
  { min: 0, key: "deep-red", title: "深紅", text: "可能進入趨勢破壞或恐慌段。" }
];

export function buildSignalSnapshot(asset: Asset, date: Date): SignalSnapshot {
  const dayIndex = Math.floor(date.getTime() / 86400000);
  const seed = asset.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const waveA = Math.sin((dayIndex + seed) / 97);
  const waveB = Math.cos((dayIndex + seed) / 41);
  const aiBoost = asset.ai * 18;
  const riskHeat = asset.beta * 16 + asset.valuation * 22;

  const modules = moduleDefinitions.map((module, index) => {
    const health = clamp(52 + asset.quality * 26 + aiBoost * (index === 0 || index === 5 ? 0.6 : 0.25) + waveA * 8, 0, 100);
    const risk = clamp(30 + riskHeat + Math.max(waveB, 0) * 14 + (index === 2 ? asset.valuation * 18 : 0), 0, 100);

    return {
      ...module,
      health: Math.round(health),
      risk: Math.round(risk)
    };
  });

  const healthScore = weightedScore(modules, "health");
  const riskScore = weightedScore(modules, "risk");
  const compositeScore = Math.round(clamp(healthScore - riskScore * 0.45 + 28, 0, 100));
  const signal = signalRules.find((rule) => compositeScore >= rule.min) ?? signalRules[signalRules.length - 1];

  return {
    asset,
    date: toDateKey(date),
    healthScore,
    riskScore,
    compositeScore,
    dataQualityScore: 72,
    dataQualityGrade: "C",
    staleDataFlags: ["mock-model"],
    missingModuleFlags: ["real-price", "real-flow", "real-fundamental"],
    modelVersion: "mock-v0.1",
    lastUpdatedAt: `${toDateKey(date)}T20:00:00+08:00`,
    signal,
    modules,
    syntheticReturn: syntheticForwardReturn(dayIndex, asset)
  };
}

export function buildSignalSeries(asset: Asset, startDate = "2000-01-01", endDate = "2026-05-28") {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const days = Math.round((end.getTime() - start.getTime()) / 86400000);
  const rows: SignalSnapshot[] = [];

  for (let index = 0; index <= days; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    rows.push(buildSignalSnapshot(asset, date));
  }

  return rows;
}

export const newsEvents: NewsEvent[] = [
  {
    date: "2008-09-15",
    source: "Reuters / Bloomberg",
    title: "全球金融危機引發風險資產重定價",
    summary: "信用風險上升時，金融與景氣循環股的風險分數需大幅上修。",
    category: "宏觀",
    impact: -3,
    assets: ["TWII", "0050", "006208"]
  },
  {
    date: "2020-03-16",
    source: "Reuters / 中央社",
    title: "疫情衝擊全球需求，市場進入恐慌流動性壓力",
    summary: "極端流動性事件下，回檔風險度應優先反映波動與信用壓力。",
    category: "宏觀",
    impact: -3,
    assets: ["TWII", "0050", "006208", "2330"]
  },
  {
    date: "2023-05-25",
    source: "CNBC / Reuters",
    title: "AI 晶片需求推升全球半導體信心",
    summary: "AI CAPEX 上修會提高半導體與 AI 伺服器供應鏈健康度。",
    category: "基本面",
    impact: 3,
    assets: ["TWII", "0050", "006208", "2330", "2382", "2308"]
  },
  {
    date: "2025-03-13",
    source: "經濟日報 / 工商時報",
    title: "融資與當沖熱度升高，短線情緒指標偏熱",
    summary: "散戶槓桿升溫時，指數可以續強，但追價風險應上修。",
    category: "籌碼",
    impact: -2,
    assets: ["TWII", "0050", "006208", "2382"]
  },
  {
    date: "2026-05-22",
    source: "Bloomberg / 中央社",
    title: "AI 權值股續強但市場討論集中風險",
    summary: "越集中於少數權值股，越需要同時看市場廣度與估值壓力。",
    category: "市場廣度",
    impact: -1,
    assets: ["TWII", "0050", "006208", "2330", "2382"]
  }
];

export function findRelatedNews(asset: Asset, date: string) {
  return newsEvents
    .filter((event) => event.assets.includes(asset.symbol) || event.assets.includes(asset.id))
    .map((event) => ({ ...event, distance: Math.abs(daysBetween(event.date, date)) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)
    .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
}

export function buildBacktestBuckets(rows: SignalSnapshot[]): BacktestBucket[] {
  const samples = rows.slice(0, -20);

  return signalRules.map((signal) => {
    const selected = samples.filter((row) => row.signal.key === signal.key);
    const returns = selected.map((row) => forwardReturn(rows, row.date, 20));

    return {
      signal,
      count: selected.length,
      avgReturn: average(returns),
      winRate: returns.length ? returns.filter((value) => value > 0).length / returns.length : 0,
      maxDrawdown: selected.length ? Math.min(...selected.map((row) => maxForwardDrawdown(rows, row.date, 20))) : 0
    };
  });
}

export function forwardReturn(rows: SignalSnapshot[], date: string, horizon: number) {
  const index = rows.findIndex((row) => row.date === date);
  return rows.slice(index + 1, index + horizon + 1).reduce((sum, row) => sum + row.syntheticReturn / horizon, 0);
}

export function maxForwardDrawdown(rows: SignalSnapshot[], date: string, horizon: number) {
  const index = rows.findIndex((row) => row.date === date);
  let equity = 1;
  let peak = 1;
  let maxDrawdown = 0;

  rows.slice(index + 1, index + horizon + 1).forEach((row) => {
    equity *= 1 + row.syntheticReturn / 20;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.min(maxDrawdown, equity / peak - 1);
  });

  return maxDrawdown;
}

export function signalColor(key: SignalKey) {
  return {
    green: "#1f9d55",
    yellow: "#d99a00",
    orange: "#e56b1f",
    red: "#d83a3a",
    "deep-red": "#8f1d2c"
  }[key];
}

function weightedScore(modules: ModuleScore[], field: "health" | "risk") {
  const weight = modules.reduce((sum, module) => sum + module.weight, 0);
  return Math.round(modules.reduce((sum, module) => sum + module[field] * module.weight, 0) / weight);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function syntheticForwardReturn(dayIndex: number, asset: Asset) {
  return Math.sin(dayIndex / 63) * 0.025 * asset.beta + Math.sin(dayIndex / 420) * 0.035 + asset.quality * 0.004 - 0.012;
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysBetween(a: string, b: string) {
  return Math.round((parseDate(a).getTime() - parseDate(b).getTime()) / 86400000);
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
