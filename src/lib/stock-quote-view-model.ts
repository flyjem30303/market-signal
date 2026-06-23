import type { SignalSnapshot } from "@/lib/signal-model";

export type StockQuoteChartPoint = {
  close: number;
  compositeScore: number;
  date: string;
  riskScore: number;
};

export function buildQuoteViewModel(series: SignalSnapshot[], snapshot: SignalSnapshot) {
  const closeLabels = snapshot.asset.type === "index" ? ["指數收盤", "指數收盤價", "收盤點數", "收盤"] : ["收盤價", "ETF 參考價", "收盤"];
  const points = series
    .map((item) => ({
      close: parseMarketNumber(getMarketFactValue(item, closeLabels, 3)),
      compositeScore: item.compositeScore,
      date: item.date,
      riskScore: item.riskScore
    }))
    .filter((item): item is StockQuoteChartPoint => Number.isFinite(item.close))
    .slice(-252);
  const snapshotClose = parseMarketNumber(getMarketFactValue(snapshot, closeLabels, 3));
  const fallbackClose = snapshotClose ?? points.at(-1)?.close ?? snapshot.compositeScore;
  const chartPoints = points.length
    ? [...points]
    : [
        {
          close: fallbackClose,
          compositeScore: snapshot.compositeScore,
          date: snapshot.date,
          riskScore: snapshot.riskScore
        }
      ];
  if (snapshotClose !== null) {
    chartPoints[chartPoints.length - 1] = {
      ...chartPoints[chartPoints.length - 1],
      close: snapshotClose,
      date: snapshot.date
    };
  }
  const previousClose = chartPoints.at(-2)?.close ?? chartPoints.at(-1)!.close;
  const close = snapshotClose ?? chartPoints.at(-1)!.close;
  const change = close - previousClose;
  const changePercent = previousClose === 0 ? 0 : (change / previousClose) * 100;

  return {
    change,
    changePercent,
    chartPoints,
    closeLabel: formatMarketNumber(close),
    stats: [
      { label: "開盤", value: getMarketFactValue(snapshot, ["開盤價", "指數開盤", "開盤"], 0) ?? "暫無資料" },
      { label: "最高", value: getMarketFactValue(snapshot, ["最高價", "指數最高", "最高"], 1) ?? "暫無資料" },
      { label: "最低", value: getMarketFactValue(snapshot, ["最低價", "指數最低", "最低"], 2) ?? "暫無資料" },
      { label: "收盤", value: getMarketFactValue(snapshot, closeLabels, 3) ?? "暫無資料" },
      { label: "成交量", value: getMarketFactValue(snapshot, ["成交量"], 4) ?? "暫無資料" },
      { label: "成交金額", value: getMarketFactValue(snapshot, ["成交金額"], 5) ?? "暫無資料" }
    ],
    symbol: snapshot.asset.symbol,
    tradeDate: getMarketFactValue(snapshot, ["資料日期"], 6) ?? snapshot.date,
    unit: snapshot.asset.type === "index" ? "點" : "TWD"
  };
}

function getMarketFactValue(snapshot: SignalSnapshot, labels: string[], fallbackIndex?: number) {
  return snapshot.marketFacts.find((fact) => labels.includes(fact.label))?.value ?? snapshot.marketFacts[fallbackIndex ?? -1]?.value;
}

function parseMarketNumber(value: string | undefined) {
  if (!value) return null;
  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatMarketNumber(value: number) {
  return value.toLocaleString("zh-TW", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}
