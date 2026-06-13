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
    note: "觀察價格相對均線與近期動能，用來判斷目前趨勢是延續、轉弱或需要等待確認。"
  },
  {
    id: "earnings",
    name: "基本面品質",
    weight: 18,
    note: "用示範權重整理獲利品質與營運穩定度，協助辨識燈號背後是否有基本面支撐。"
  },
  {
    id: "valuation",
    name: "估值壓力",
    weight: 16,
    note: "觀察市場熱度與估值壓力，提醒使用者不要只看上漲，也要注意風險是否升高。"
  },
  {
    id: "breadth",
    name: "市場廣度",
    weight: 14,
    note: "觀察上漲與轉弱標的分布，協助判斷行情是全面擴散，還是集中在少數族群。"
  },
  {
    id: "flow",
    name: "資金流向",
    weight: 16,
    note: "觀察資金動能與籌碼傾向，協助判斷短線市場是否仍有追價或防守壓力。"
  },
  {
    id: "macro",
    name: "總體環境",
    weight: 18,
    note: "整理利率、匯率、風險偏好與外部事件，避免只用單一技術訊號解讀市場。"
  }
];

const signalRules: SignalRule[] = [
  {
    min: 75,
    key: "green",
    title: "偏多觀察",
    text: "市場狀態偏正向，但仍需搭配資料更新時間、風險分數與個別標的狀況複核。"
  },
  {
    min: 62,
    key: "yellow",
    title: "中性偏多",
    text: "市場仍有支撐，但部分風險正在升高，適合加強觀察而不是只看單一分數。"
  },
  {
    min: 48,
    key: "orange",
    title: "觀望整理",
    text: "趨勢與風險訊號混合，建議等待更多確認，避免用短線波動做過度判斷。"
  },
  {
    min: 34,
    key: "red",
    title: "警戒偏弱",
    text: "市場風險偏高，應檢查跌勢是否擴散、資料是否新鮮，以及是否需要降低風險暴露。"
  },
  {
    min: 0,
    key: "deep-red",
    title: "高風險",
    text: "市場防守訊號明顯，應優先確認風險來源與資料狀態，避免在資訊不足時做出激進判斷。"
  }
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
    title: "全球金融壓力升高，市場風險快速擴散",
    summary: "金融體系壓力升高時，市場常出現流動性收縮與風險資產同步下跌，適合觀察防守訊號是否擴大。",
    category: "總體風險",
    impact: -3,
    assets: ["TWII", "0050", "006208"]
  },
  {
    date: "2020-03-16",
    source: "Reuters / 官方市場資料",
    title: "疫情衝擊推升波動，市場進入防守狀態",
    summary: "外部衝擊造成波動急升時，燈號應同時提示價格、廣度、風險與資料更新狀態，避免只看單日漲跌。",
    category: "總體風險",
    impact: -3,
    assets: ["TWII", "0050", "006208", "2330"]
  },
  {
    date: "2023-05-25",
    source: "CNBC / Reuters",
    title: "AI 題材帶動大型科技與半導體關注",
    summary: "AI 相關需求提高市場風險偏好，但仍需觀察行情是否擴散到更多族群，而不是只集中在少數權值股。",
    category: "產業題材",
    impact: 3,
    assets: ["TWII", "0050", "006208", "2330", "2382", "2308"]
  },
  {
    date: "2025-03-13",
    source: "示範市場資料",
    title: "資金輪動降溫，市場廣度轉弱",
    summary: "當上漲標的集中、資金輪動降溫時，即使指數仍維持高檔，也需要觀察風險是否逐步累積。",
    category: "資金流向",
    impact: -2,
    assets: ["TWII", "0050", "006208", "2382"]
  },
  {
    date: "2026-05-22",
    source: "Bloomberg / 官方市場資料",
    title: "AI 伺服器族群成為市場觀察重點",
    summary: "市場若由 AI 相關族群支撐，需同步觀察權值股、ETF 與市場廣度，避免把單一題材誤判為全面行情。",
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
