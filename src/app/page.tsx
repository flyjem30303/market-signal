import type { Metadata } from "next";
import { HomepageGlobalShell } from "@/components/homepage-global-shell";
import { PageViewTracker } from "@/components/page-view-tracker";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { buildI18nAlternates } from "@/lib/i18n/metadata";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalRuntime, getMarketSignalSearchItems } from "@/lib/repositories/market-signal-repository";
import { buildCorePageJsonLd, buildRouteMetadata, seoSiteDescription } from "@/lib/seo";
import type { SignalSnapshot } from "@/lib/signal-model";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildRouteMetadata({
  description: seoSiteDescription,
  path: "/",
  title: "全球市場風險指南針 | 指數燈號"
});

metadata.alternates = buildI18nAlternates("home");

const homeJsonLd = buildCorePageJsonLd({
  description: "指數燈號提供全球市場風險指南針，目前以台股正式資料為主，協助使用者理解市場變化、風險與標的觀察順序。",
  path: "/",
  title: "全球市場風險指南針"
});

export default async function HomePage() {
  const { marketSignalSourceStatus, repository } = await getMarketSignalRuntime();
  const watchlistItems = await getMarketSignalSearchItems();
  const freshness = await getDataFreshnessSnapshot();
  const assets = repository.getAssets();
  const initialAsset = repository.getAssetBySymbol("TWII") ?? assets[0];
  const marketSeries = repository.getSeries(initialAsset.symbol);
  const snapshotDate = marketSeries.at(-1)?.date ?? "2026-05-28";
  const snapshots = assets
    .map((asset) => repository.getSnapshot(asset.symbol, snapshotDate) ?? repository.getSeries(asset.symbol).at(-1))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));
  const marketSnapshot =
    snapshots.find((snapshot) => snapshot.asset.symbol === "TWII") ??
    marketSeries.at(-1) ??
    snapshots[0];
  const previousMarketSnapshot = findPreviousSnapshot(marketSeries, marketSnapshot.date);

  return (
    <>
      <PageViewTracker eventName="home_page_viewed" payload={{ page: "home" }} />
      <SeoJsonLd data={homeJsonLd} />
      <HomepageGlobalShell
        taiwan={{
          compositeDelta: previousMarketSnapshot ? marketSnapshot.compositeScore - previousMarketSnapshot.compositeScore : null,
          compositeScore: marketSnapshot.compositeScore,
          date: marketSnapshot.date,
          previousDate: previousMarketSnapshot?.date ?? null,
          riskDelta: previousMarketSnapshot ? marketSnapshot.riskScore - previousMarketSnapshot.riskScore : null,
          riskScore: marketSnapshot.riskScore,
          signalTitle: marketSnapshot.signal.title,
          sourceLabel: formatPublicSourceLabel(freshness.sourceName, marketSignalSourceStatus.resolvedSource === "supabase")
        }}
        watchlistItems={watchlistItems}
      />
    </>
  );
}

function formatPublicSourceLabel(sourceName: string, isOfficialRuntime: boolean) {
  if (!isOfficialRuntime) return "示範資料";
  if (!sourceName || sourceName === "正式資料" || sourceName.toLowerCase().includes("supabase")) return "TWSE OpenAPI";
  return sourceName;
}

function findPreviousSnapshot(series: SignalSnapshot[], date: string) {
  for (let index = series.length - 1; index >= 0; index -= 1) {
    const snapshot = series[index];
    if (snapshot.date < date) return snapshot;
  }
  return null;
}
