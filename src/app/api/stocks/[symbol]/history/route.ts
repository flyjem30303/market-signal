import { NextResponse } from "next/server";
import { createStaticMarketSignalRepository } from "@/lib/repositories/static-market-signal-repository";
import { buildStockPagePayload } from "@/lib/stock-page-payload";
import { buildQuoteViewModel } from "@/lib/stock-quote-view-model";

export const revalidate = 300;

const rangeToHistoryDays = {
  "1M": 45,
  "3M": 110,
  "6M": 210,
  "1Y": 390
} as const;

type StockHistoryRouteProps = {
  params: {
    symbol: string;
  };
};

export async function GET(request: Request, { params }: StockHistoryRouteProps) {
  const symbol = params.symbol.toUpperCase();
  const requestedRange = new URL(request.url).searchParams.get("range") ?? "3M";
  const range = isSupportedRange(requestedRange) ? requestedRange : "3M";
  const historyDays = rangeToHistoryDays[range];
  const payload = await buildStockPagePayload(symbol, historyDays);

  if (!payload.asset || !payload.snapshot) {
    return NextResponse.json({ error: "stock_history_not_found", range, symbol }, { status: 404 });
  }

  const repository = createStaticMarketSignalRepository(payload.repositoryData);
  const quote = buildQuoteViewModel(repository.getSeries(payload.asset.symbol), payload.snapshot);

  return NextResponse.json({
    asOfDate: quote.tradeDate,
    points: quote.chartPoints,
    range,
    symbol: payload.asset.symbol,
    unit: quote.unit
  });
}

function isSupportedRange(value: string): value is keyof typeof rangeToHistoryDays {
  return value in rangeToHistoryDays;
}
