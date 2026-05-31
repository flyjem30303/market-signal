import { PageViewTracker } from "@/components/page-view-tracker";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";

export default function HomePage() {
  const repository = getMarketSignalRepository();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();
  const firstAsset = repository.getAssets()[0];
  return (
    <>
      <PageViewTracker eventName="home_page_viewed" payload={{ page: "home" }} />
      <DashboardShell initialSymbol={firstAsset.symbol} marketSignalSourceStatus={marketSignalSourceStatus} />
    </>
  );
}
