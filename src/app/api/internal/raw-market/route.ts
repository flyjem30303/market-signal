import { NextRequest, NextResponse } from "next/server";
import { buildMixedDataQualitySummary } from "@/lib/mixed-data-quality";
import { buildMixedMarketSnapshot } from "@/lib/mixed-market-adapter";
import { buildPublicReleaseGate } from "@/lib/public-release-gate";
import { getServerRawMarketOverview } from "@/lib/raw-market-loader";
import { mockMarketSignalRepository } from "@/lib/repositories/mock-market-signal-repository";
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

  const scoreDate = overview.snapshot.price?.tradeDate ?? "2026-05-28";
  const score = mockMarketSignalRepository.getSnapshot(symbol, scoreDate);
  const mixed = score ? buildMixedMarketSnapshot({ raw: overview.snapshot, score }) : null;
  const quality = buildMixedDataQualitySummary(mixed);
  const publicGate = buildPublicReleaseGate({ mixed, quality });

  return NextResponse.json({
    mixed,
    overview,
    publicGate,
    quality,
    status: "ok"
  });
}

function isAuthorized(request: NextRequest) {
  const expectedToken = process.env.INTERNAL_DIAGNOSTICS_TOKEN;

  if (!expectedToken) {
    return false;
  }

  const headerToken = request.headers.get("x-internal-diagnostics-token");
  const queryToken = request.nextUrl.searchParams.get("token");

  return headerToken === expectedToken || queryToken === expectedToken;
}
