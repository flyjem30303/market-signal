export type Asset = {
  id: string;
  symbol: string;
  name: string;
  group: string;
  beta: number;
  ai: number;
  quality: number;
  valuation: number;
  flow: number;
};

export const assets: Asset[] = [
  { id: "TWII", symbol: "TWII", name: "台灣加權指數", group: "指數", beta: 1.0, ai: 0.62, quality: 0.64, valuation: 0.58, flow: 0.72 },
  { id: "0050", symbol: "0050", name: "元大台灣50", group: "ETF", beta: 0.92, ai: 0.72, quality: 0.7, valuation: 0.62, flow: 0.68 },
  { id: "006208", symbol: "006208", name: "富邦台50", group: "ETF", beta: 0.9, ai: 0.7, quality: 0.7, valuation: 0.62, flow: 0.66 },
  { id: "2330", symbol: "2330", name: "台積電", group: "半導體", beta: 1.08, ai: 0.95, quality: 0.92, valuation: 0.76, flow: 0.74 },
  { id: "2454", symbol: "2454", name: "聯發科", group: "IC 設計", beta: 1.18, ai: 0.7, quality: 0.76, valuation: 0.7, flow: 0.66 },
  { id: "2317", symbol: "2317", name: "鴻海", group: "電子代工", beta: 1.06, ai: 0.78, quality: 0.65, valuation: 0.55, flow: 0.62 },
  { id: "2308", symbol: "2308", name: "台達電", group: "電源/工控", beta: 0.98, ai: 0.74, quality: 0.82, valuation: 0.68, flow: 0.58 },
  { id: "2382", symbol: "2382", name: "廣達", group: "AI 伺服器", beta: 1.28, ai: 0.92, quality: 0.66, valuation: 0.78, flow: 0.7 }
];

export function findAssetBySymbol(symbol: string) {
  return assets.find((asset) => asset.symbol.toLowerCase() === symbol.toLowerCase());
}
