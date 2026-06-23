import { NextResponse } from "next/server";
import { buildStockPagePayload } from "@/lib/stock-page-payload";
import { buildQuoteViewModel } from "@/lib/stock-quote-view-model";

const chartHistoryDays = 390;

type StockChartHistoryRouteProps = {
  params: {
    symbol: string;
  };
};

export const revalidate = 300;

export async function GET(_request: Request, { params }: StockChartHistoryRouteProps) {
  const symbol = params.symbol.toUpperCase();
  const payload = await buildStockPagePayload(symbol, chartHistoryDays);
  const snapshot = payload.snapshot;

  if (!payload.asset || !snapshot) {
    return NextResponse.json({ error: "stock_not_found" }, { status: 404 });
  }

  const series = payload.repositoryData.snapshots.filter((item) => item.asset.symbol === symbol);
  const quote = buildQuoteViewModel(series, snapshot);

  return NextResponse.json(
    {
      points: quote.chartPoints,
      tradeDate: quote.tradeDate,
      unit: quote.unit
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400"
      }
    }
  );
}
