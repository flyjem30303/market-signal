import { NextRequest, NextResponse } from "next/server";
import { getServerRawMarketOverview } from "@/lib/raw-market-loader";
import type { MarketKey } from "@/lib/repositories/raw-market-types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (process.env.INTERNAL_DIAGNOSTICS_ENABLED !== "true") {
    return NextResponse.json({ status: "disabled" }, { status: 404 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ status: "unauthorized" }, { status: 401 });
  }

  const symbol = request.nextUrl.searchParams.get("symbol") ?? "2330";
  const market: MarketKey = {
    country: request.nextUrl.searchParams.get("country") ?? "TW",
    exchange: request.nextUrl.searchParams.get("exchange") ?? "TWSE"
  };

  const overview = await getServerRawMarketOverview(symbol, market);

  if (!overview.snapshot) {
    return NextResponse.json(
      {
        market,
        status: "not_found",
        symbol
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    overview,
    status: "ok"
  });
}

function isAuthorized(request: NextRequest) {
  const expectedToken = process.env.INTERNAL_DIAGNOSTICS_TOKEN;

  if (!expectedToken) {
    return process.env.NODE_ENV === "development";
  }

  const headerToken = request.headers.get("x-internal-diagnostics-token");
  const queryToken = request.nextUrl.searchParams.get("token");

  return headerToken === expectedToken || queryToken === expectedToken;
}
