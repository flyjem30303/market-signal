import { DashboardShell } from "@/components/dashboard-shell";
import { getMarketSignalRepository } from "@/lib/repositories/market-signal-repository";

export default function HomePage() {
  const repository = getMarketSignalRepository();
  const firstAsset = repository.getAssets()[0];
  return <DashboardShell initialSymbol={firstAsset.symbol} />;
}
