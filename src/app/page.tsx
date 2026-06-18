import { PageViewTracker } from "@/components/page-view-tracker";
import { DashboardShell } from "@/components/dashboard-shell";
import { getMarketSignalRuntime } from "@/lib/repositories/market-signal-repository";
import { toMarketSignalRepositoryData } from "@/lib/repositories/static-market-signal-repository";

export default async function HomePage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime();
  const assets = repository.getAssets();
  const initialAsset = repository.getAssetBySymbol("TWII") ?? assets[0];
  const snapshots = assets
    .map((asset) => repository.getSnapshot(asset.symbol, "2026-05-28") ?? repository.getSeries(asset.symbol).at(-1))
    .filter(Boolean);
  const featuredSymbols = uniqueSymbols([
    initialAsset.symbol,
    "TWII",
    "0050",
    "006208",
    "2330",
    "2308",
    "2382",
    ...snapshots
      .slice()
      .sort((a, b) => b!.compositeScore - a!.compositeScore)
      .slice(0, 4)
      .map((snapshot) => snapshot!.asset.symbol),
    ...snapshots
      .slice()
      .sort((a, b) => b!.riskScore - a!.riskScore)
      .slice(0, 4)
      .map((snapshot) => snapshot!.asset.symbol)
  ]);

  return (
    <>
      <PageViewTracker eventName="home_page_viewed" payload={{ page: "home" }} />
      <DashboardShell
        initialSymbol={initialAsset.symbol}
        marketSignalSourceStatus={marketSignalSourceStatus}
        repositoryData={toMarketSignalRepositoryData(repository, "2026-05-28", featuredSymbols)}
      />
    </>
  );
}

function uniqueSymbols(symbols: string[]) {
  return Array.from(new Set(symbols.filter(Boolean)));
}
