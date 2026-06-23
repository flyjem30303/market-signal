import { NextResponse } from "next/server";
import { getMarketSignalSearchItems } from "@/lib/repositories/market-signal-repository";

export const revalidate = 300;

export async function GET() {
  const items = await getMarketSignalSearchItems();

  return NextResponse.json(
    { items },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400"
      }
    }
  );
}
