import { PageViewTracker } from "@/components/page-view-tracker";
import { DashboardShell } from "@/components/dashboard-shell";
import { getMarketSignalRuntime } from "@/lib/repositories/market-signal-repository";
import { toMarketSignalRepositoryData } from "@/lib/repositories/static-market-signal-repository";

export default async function HomePage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime();
  const firstAsset = repository.getAssets()[0];
  return (
    <>
      <PageViewTracker eventName="home_page_viewed" payload={{ page: "home" }} />
      <DashboardShell
        initialSymbol={firstAsset.symbol}
        marketSignalSourceStatus={marketSignalSourceStatus}
        repositoryData={toMarketSignalRepositoryData(repository)}
      />
    </>
  );
}
