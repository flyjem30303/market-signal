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
  { id: "trend", name: "趨勢動能", weight: 18, note: "觀察價格相對均線與中期動能，判斷市場偏多或偏弱。" },
  { id: "earnings", name: "基本面品質", weight: 18, note: "觀察獲利、成長與營運品質，避免只看短線波動。" },
  { id: "valuation", name: "估值壓力", weight: 16, note: "觀察本益比、股價淨值比與評價水位，判斷追高風險。" },
  { id: "breadth", name: "市場廣度", weight: 14, note: "觀察多數標的是否同步偏強，避免少數權值股遮蔽風險。" },
  { id: "flow", name: "資金流向", weight: 16, note: "觀察量能與資金強弱，輔助判讀燈號是否有支撐。" },
  { id: "macro", name: "總經環境", weight: 18, note: "觀察利率、景氣與產業循環，補足市場背景。" }
];

const signalRules: SignalRule[] = [
  { min: 75, key: "green", title: "綠燈偏多", text: "市場狀態偏強，可先關注，但仍需確認資料更新時間與風險來源。" },
  { min: 62, key: "yellow", title: "黃燈觀望", text: "市場仍有支撐，但風險正在升溫，適合加強觀察。" },
  { min: 48, key: "orange", title: "橘燈警戒", text: "趨勢與風險訊號拉扯，應先檢查持倉風險與觀察條件。" },
  { min: 34, key: "red", title: "紅燈防守", text: "市場偏弱或風險偏高，宜降低風險暴露並等待訊號改善。" },
  { min: 0, key: "deep-red", title: "深紅高風險", text: "市場壓力明顯，應優先防守並避免單一訊號決策。" }
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
    title: "金融危機引發全球市場壓力",
    summary: "大型金融機構風險升高，全球股市進入高波動環境，提醒使用者重視系統性風險。",
    category: "總經",
    impact: -3,
    assets: ["TWII", "0050", "006208"]
  },
  {
    date: "2020-03-16",
    source: "Reuters / 公開新聞",
    title: "疫情衝擊造成市場劇烈波動",
    summary: "全球疫情與流動性壓力同步升溫，市場短期波動擴大，適合觀察風險燈號變化。",
    category: "總經",
    impact: -3,
    assets: ["TWII", "0050", "006208", "2330"]
  },
  {
    date: "2023-05-25",
    source: "CNBC / Reuters",
    title: "AI 需求推升半導體與伺服器題材",
    summary: "AI 資本支出題材升溫，帶動半導體、伺服器與相關供應鏈受到市場關注。",
    category: "產業",
    impact: 3,
    assets: ["TWII", "0050", "006208", "2330", "2382", "2308"]
  },
  {
    date: "2025-03-13",
    source: "公開市場資料",
    title: "外資與量能變化影響台股情緒",
    summary: "資金流向與成交量變化使市場情緒轉為觀望，適合搭配市場廣度與風險指標判讀。",
    category: "資金",
    impact: -2,
    assets: ["TWII", "0050", "006208", "2382"]
  },
  {
    date: "2026-05-22",
    source: "Bloomberg / 公開新聞",
    title: "AI 伺服器供應鏈仍是市場焦點",
    summary: "市場持續關注 AI 伺服器需求與供應鏈變化，但高估值也使風險提醒更重要。",
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
