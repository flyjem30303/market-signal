import { PageViewTracker } from "@/components/page-view-tracker";
import { DashboardShell } from "@/components/dashboard-shell";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalRuntime, getMarketSignalSearchItems } from "@/lib/repositories/market-signal-repository";
import { toMarketSignalRepositoryData } from "@/lib/repositories/static-market-signal-repository";

export const revalidate = 300;

export default async function HomePage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime();
  const watchlistItems = await getMarketSignalSearchItems();
  const freshness = await getDataFreshnessSnapshot();
  const assets = repository.getAssets();
  const initialAsset = repository.getAssetBySymbol("TWII") ?? assets[0];
  const latestMarketDate = repository.getSeries(initialAsset.symbol).at(-1)?.date ?? "2026-05-28";
  const snapshotDate = isIsoDate(freshness.asOfDate) ? freshness.asOfDate : latestMarketDate;
  const snapshots = assets
    .map((asset) => repository.getSnapshot(asset.symbol, snapshotDate) ?? repository.getSeries(asset.symbol).at(-1))
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
        freshnessSnapshot={freshness}
        initialSymbol={initialAsset.symbol}
        marketSignalSourceStatus={marketSignalSourceStatus}
        repositoryData={toMarketSignalRepositoryData(repository, snapshotDate, featuredSymbols)}
        watchlistItems={watchlistItems}
      />
    </>
  );
}

function uniqueSymbols(symbols: string[]) {
  return Array.from(new Set(symbols.filter(Boolean)));
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/u.test(value);
}
