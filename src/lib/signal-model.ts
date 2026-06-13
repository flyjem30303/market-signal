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
    note: "觀察價格相對均線與近期動能，協助判斷市場是延續趨勢還是轉弱。"
  },
  {
    id: "earnings",
    name: "基本面品質",
    weight: 18,
    note: "示範模型用於呈現公司或市場基本面穩定度；正式資料上線前不作為投資建議。"
  },
  {
    id: "valuation",
    name: "估值壓力",
    weight: 16,
    note: "估值越高，代表市場對未來期待越高，也更需要留意回檔風險。"
  },
  {
    id: "breadth",
    name: "市場廣度",
    weight: 14,
    note: "觀察上漲與下跌標的是否擴散，避免只看少數權值股造成誤判。"
  },
  {
    id: "flow",
    name: "資金流向",
    weight: 16,
    note: "示範資金流向用於說明市場熱度與風險變化，正式資料仍需來源確認。"
  },
  {
    id: "macro",
    name: "總體風險",
    weight: 18,
    note: "整合利率、匯率、波動與外部事件風險，協助判斷是否需要降低風險。"
  }
];

const signalRules: SignalRule[] = [
  {
    min: 75,
    key: "green",
    title: "偏多穩定",
    text: "市場氛圍相對健康，適合維持觀察，但仍需確認資料狀態與風險提示。"
  },
  {
    min: 62,
    key: "yellow",
    title: "偏多觀望",
    text: "市場仍有支撐，但部分風險開始升溫，建議追蹤是否連續轉弱。"
  },
  {
    min: 48,
    key: "orange",
    title: "警戒觀察",
    text: "趨勢或風險分數轉弱，適合加強觀察並等待更多確認訊號。"
  },
  {
    min: 34,
    key: "red",
    title: "高風險",
    text: "風險訊號偏高，應優先檢查成因、資料更新與是否需要降低風險。"
  },
  {
    min: 0,
    key: "deep-red",
    title: "極高風險",
    text: "多項風險同時升高，應避免只看單一數字，先回到市場總覽複核。"
  }
];

export function signalColor(key: SignalKey) {
  const colors: Record<SignalKey, string> = {
    green: "#0f8f5f",
    yellow: "#c98a10",
    orange: "#d76a1f",
    red: "#c53030",
    "deep-red": "#7f1d1d"
  };
  return colors[key];
}

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
    staleDataFlags: ["示範資料"],
    missingModuleFlags: ["正式價格", "正式資金流", "正式基本面"],
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
    title: "全球金融危機升溫",
    summary: "信用市場壓力快速升高，股市波動擴大，示範模型會把風險狀態調高。",
    category: "總體風險",
    impact: -3,
    assets: ["TWII", "0050", "006208"]
  },
  {
    date: "2020-03-16",
    source: "Reuters / 市場公開資訊",
    title: "疫情衝擊全球市場",
    summary: "主要市場同步下跌，波動與流動性風險升高，適合回到風險辨識與資料更新時間複核。",
    category: "總體風險",
    impact: -3,
    assets: ["TWII", "0050", "006208", "2330"]
  },
  {
    date: "2023-05-25",
    source: "CNBC / Reuters",
    title: "AI 題材推升科技股關注",
    summary: "AI 需求帶動科技與半導體族群關注度上升，但估值與波動也需要同步觀察。",
    category: "產業動能",
    impact: 3,
    assets: ["TWII", "0050", "006208", "2330", "2382", "2308"]
  },
  {
    date: "2025-03-13",
    source: "市場公開資訊",
    title: "資金流向轉弱",
    summary: "市場資金動能減弱，示範模型會提醒使用者檢查市場廣度與風險分數。",
    category: "資金流向",
    impact: -2,
    assets: ["TWII", "0050", "006208", "2382"]
  },
  {
    date: "2026-05-22",
    source: "Bloomberg / 市場公開資訊",
    title: "AI 供應鏈波動加大",
    summary: "權值科技股波動提高，市場總覽與個股頁都應提醒使用者複核成因與更新時間。",
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
  const target = rows[index + horizon];
  if (index < 0 || !target) return 0;
  return target.syntheticReturn;
}

function maxForwardDrawdown(rows: SignalSnapshot[], date: string, horizon: number) {
  const index = rows.findIndex((row) => row.date === date);
  if (index < 0) return 0;
  const window = rows.slice(index, index + horizon + 1);
  return Math.min(...window.map((row) => row.syntheticReturn));
}

function weightedScore(modules: ModuleScore[], field: "health" | "risk") {
  const totalWeight = modules.reduce((sum, module) => sum + module.weight, 0);
  return Math.round(modules.reduce((sum, module) => sum + module[field] * module.weight, 0) / totalWeight);
}

function syntheticForwardReturn(dayIndex: number, asset: Asset) {
  return Number(((Math.sin(dayIndex / 29 + asset.beta) * 0.06 + (asset.quality - asset.valuation) * 0.035) * 100).toFixed(2));
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function average(values: number[]) {
  if (!values.length) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function daysBetween(a: string, b: string) {
  return Math.round((parseDate(a).getTime() - parseDate(b).getTime()) / 86400000);
}
